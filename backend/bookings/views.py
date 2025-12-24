from datetime import date

from django.db.models import Count, Max, Min
from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from utils.backup import get_backup_stats
from utils.email import send_claim_confirmation
from utils.permissions import IsAdmin
from vehicles.models import Vehicle

from .models import Claim
from .serializers import (
    ClaimCreateSerializer,
    ClaimSerializer,
    OperationsClaimSerializer,
    OperationsClientSerializer,
    OperationsStaffSerializer,
    OperationsVehicleSerializer,
)


class ClaimFilter(filters.FilterSet):
    status = filters.ChoiceFilter(choices=Claim.STATUS_CHOICES)
    created_after = filters.DateFilter(field_name="created_at", lookup_expr="gte")
    created_before = filters.DateFilter(field_name="created_at", lookup_expr="lte")

    class Meta:
        model = Claim
        fields = ["status", "assigned_staff"]


class ClaimViewSet(viewsets.ModelViewSet):
    queryset = Claim.objects.select_related(
        "vehicle", "assigned_staff"
    ).prefetch_related("documents")
    filter_backends = [DjangoFilterBackend]
    filterset_class = ClaimFilter

    def get_serializer_class(self):
        if self.action == "create":
            return ClaimCreateSerializer
        return ClaimSerializer

    def get_permissions(self):
        if self.action == "create":
            return []
        return [IsAdmin()]

    def perform_create(self, serializer):
        claim = serializer.save()
        send_claim_confirmation(claim.email, claim)

    @action(detail=True, methods=["patch"], permission_classes=[IsAdmin])
    def approve(self, request, pk=None):
        claim = self.get_object()
        claim.status = "approved"
        claim.save(update_fields=["status"])
        serializer = self.get_serializer(claim)
        return Response(serializer.data)

    @action(detail=True, methods=["patch"], permission_classes=[IsAdmin])
    def cancel(self, request, pk=None):
        claim = self.get_object()
        claim.status = "cancelled"
        claim.save(update_fields=["status"])
        serializer = self.get_serializer(claim)
        return Response(serializer.data)

    @action(detail=True, methods=["patch"], permission_classes=[IsAdmin])
    def assign_staff(self, request, pk=None):
        claim = self.get_object()
        staff_id = request.data.get("staff_id")

        from accounts.models import User

        try:
            staff = User.objects.get(
                id=staff_id, admin_type__in=["admin", "super_admin"]
            )
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid staff member"}, status=status.HTTP_400_BAD_REQUEST
            )

        claim.assigned_staff = staff
        claim.save(update_fields=["assigned_staff"])
        serializer = self.get_serializer(claim)
        return Response(serializer.data)


class OperationsDataView(APIView):
    """
    Aggregate operational data for the admin Operations dashboard.
    Provides clients, fleet, bookings, staff assignments, and backup metadata.
    """

    permission_classes = [IsAdmin]

    def get(self, request):
        # Prefetch claims with related data
        claims_qs = Claim.objects.select_related("vehicle", "assigned_staff")

        # Clients aggregation (group by email)
        client_stats = claims_qs.values(
            "email", "first_name", "last_name", "phone"
        ).annotate(
            total_bookings=Count("id"),
            last_booking_date=Max("created_at"),
            first_booking_date=Min("created_at"),
            last_status=Max("status"),
        )
        client_payload = []
        for c in client_stats:
            client_payload.append(
                {
                    "name": f"{c['first_name']} {c['last_name']}".strip(),
                    "email": c["email"],
                    "phone": c["phone"],
                    "total_bookings": c["total_bookings"],
                    "last_booking_date": c["last_booking_date"],
                    "first_booking_date": c["first_booking_date"],
                    "last_status": c["last_status"],
                }
            )

        # Fleet with current assignment
        vehicles = Vehicle.objects.all()
        fleet_data = OperationsVehicleSerializer(vehicles, many=True).data

        # Bookings/claims data
        bookings_data = OperationsClaimSerializer(claims_qs, many=True).data

        # Staff assignments
        staff_qs = User.objects.filter(
            admin_type__in=[User.ROLE_ADMIN, User.ROLE_SUPER_ADMIN]
        )
        staff_data = OperationsStaffSerializer(staff_qs, many=True).data

        # Backup metadata
        backup_stats = get_backup_stats() or {}
        last_backup = backup_stats.get("newest_backup")
        backup_info = {
            "last_backup": last_backup,
            "total_backups": backup_stats.get("total_backups", 0),
            "total_size_bytes": backup_stats.get("total_size_bytes", 0),
        }

        # Summary cards
        summary = {
            "total_clients": len(client_payload),
            "total_bookings": claims_qs.count(),
            "active_bookings": claims_qs.filter(
                status__in=["pending", "approved"]
            ).count(),
            "total_vehicles": vehicles.count(),
            "available_vehicles": vehicles.filter(status="available").count(),
            "booked_vehicles": vehicles.filter(status="booked").count(),
            "maintenance_vehicles": vehicles.filter(status="maintenance").count(),
            "last_backup": last_backup,
        }

        response_payload = {
            "summary": summary,
            "clients": OperationsClientSerializer(client_payload, many=True).data,
            "fleet": fleet_data,
            "bookings": bookings_data,
            "staff_assignments": staff_data,
            "backup": backup_info,
            "generated_at": date.today(),
        }

        return Response(response_payload, status=status.HTTP_200_OK)
