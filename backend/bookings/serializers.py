from rest_framework import serializers

from accounts.models import User
from utils.spam_protection import check_rate_limit
from vehicles.models import Vehicle

from .models import Claim, ClaimDocument


class ClaimDocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = ClaimDocument
        fields = "__all__"

    def get_file_url(self, obj):
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.file.url)
        return None


class ClaimSerializer(serializers.ModelSerializer):
    """Public/standard serializer with helpful denormalized fields for the UI."""

    documents = ClaimDocumentSerializer(many=True, read_only=True)
    vehicle_details = serializers.SerializerMethodField()
    assigned_staff_details = serializers.SerializerMethodField()
    rental_duration_days = serializers.SerializerMethodField()

    class Meta:
        model = Claim
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "address",
            "accident_date",
            "vehicle_registration",
            "insurance_company",
            "policy_number",
            "accident_details",
            "vehicle",
            "start_date",
            "end_date",
            "pickup_location",
            "drop_location",
            "notes",
            "status",
            "assigned_staff",
            "created_at",
            "updated_at",
            "documents",
            "vehicle_details",
            "assigned_staff_details",
            "rental_duration_days",
        ]

    def get_vehicle_details(self, obj: Claim):
        if obj.vehicle:
            return {
                "id": obj.vehicle.id,
                "name": obj.vehicle.name,
                "registration": obj.vehicle.registration,
                "type": obj.vehicle.type,
                "status": obj.vehicle.status,
            }
        return None

    def get_assigned_staff_details(self, obj: Claim):
        staff = obj.assigned_staff
        if not staff:
            return None
        return {
            "id": staff.id,
            "first_name": staff.first_name,
            "last_name": staff.last_name,
            "email": staff.email,
        }

    def get_rental_duration_days(self, obj: Claim):
        if obj.start_date and obj.end_date:
            return (obj.end_date - obj.start_date).days
        return None


class ClaimCreateSerializer(serializers.ModelSerializer):
    documents = serializers.ListField(
        child=serializers.FileField(), required=False, write_only=True
    )
    # Simple anti-spam fields
    honeypot = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Claim
        fields = [
            "first_name",
            "last_name",
            "email",
            "phone",
            "address",
            "accident_date",
            "vehicle_registration",
            "insurance_company",
            "policy_number",
            "accident_details",
            "pickup_location",
            "drop_location",
            "notes",
            "documents",
            "honeypot",
        ]

    def validate(self, attrs):
        request = self.context.get("request")

        # Check honeypot (should be empty)
        honeypot = attrs.pop("honeypot", "")
        if honeypot:
            raise serializers.ValidationError({"honeypot": "Spam detected."})

        # Rate limiting
        ip_address = request.META.get("REMOTE_ADDR") if request else None
        if ip_address and check_rate_limit(ip_address, "claim"):
            raise serializers.ValidationError(
                {"rate_limit": "Too many submissions from this IP. Try again later."}
            )

        return attrs

    def create(self, validated_data):
        documents = validated_data.pop("documents", [])
        claim = Claim.objects.create(**validated_data)

        for doc_file in documents:
            ClaimDocument.objects.create(
                claim=claim, file=doc_file, file_name=doc_file.name
            )

        from utils.email import send_claim_confirmation

        send_claim_confirmation(
            claim.email,
            {
                "id": claim.id,
                "first_name": claim.first_name,
                "last_name": claim.last_name,
                "created_at": claim.created_at,
            },
        )

        return claim


class OperationsClientSerializer(serializers.Serializer):
    """Aggregated view of clients derived from claims."""

    name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField(allow_blank=True)
    total_bookings = serializers.IntegerField()
    last_booking_date = serializers.DateTimeField(allow_null=True)
    last_status = serializers.CharField(allow_blank=True)
    first_booking_date = serializers.DateTimeField(allow_null=True)


class OperationsAssignmentSerializer(serializers.Serializer):
    """Lightweight assignment summary used for vehicles and staff."""

    claim_id = serializers.IntegerField()
    client_name = serializers.CharField()
    status = serializers.CharField()
    start_date = serializers.DateField(allow_null=True)
    end_date = serializers.DateField(allow_null=True)
    assigned_at = serializers.DateTimeField()
    staff_id = serializers.IntegerField(allow_null=True)
    staff_name = serializers.CharField(allow_blank=True)


class OperationsVehicleSerializer(serializers.ModelSerializer):
    """Vehicle details plus current/last assignment info."""

    current_assignment = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = [
            "id",
            "name",
            "registration",
            "type",
            "status",
            "seats",
            "fuel_type",
            "transmission",
            "daily_rate",
            "created_at",
            "updated_at",
            "current_assignment",
        ]

    def get_current_assignment(self, obj: Vehicle):
        claim: Claim | None = (
            Claim.objects.filter(vehicle=obj)
            .exclude(status="cancelled")
            .order_by("-created_at")
            .first()
        )
        if not claim:
            return None
        return {
            "claim_id": claim.id,
            "client_name": f"{claim.first_name} {claim.last_name}".strip(),
            "status": claim.status,
            "start_date": claim.start_date,
            "end_date": claim.end_date,
            "assigned_at": claim.created_at,
            "staff_id": claim.assigned_staff_id,
            "staff_name": (
                claim.assigned_staff.get_full_name() if claim.assigned_staff else ""
            ),
        }


class OperationsStaffSerializer(serializers.ModelSerializer):
    """Staff overview including assignment counts."""

    assignments = serializers.SerializerMethodField()
    assignments_count = serializers.SerializerMethodField()
    active_assignments_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "admin_type",
            "status",
            "assignments_count",
            "active_assignments_count",
            "assignments",
        ]

    def get_assignments_count(self, obj: User):
        return Claim.objects.filter(assigned_staff=obj).count()

    def get_active_assignments_count(self, obj: User):
        return Claim.objects.filter(
            assigned_staff=obj, status__in=["pending", "approved"]
        ).count()

    def get_assignments(self, obj: User):
        claims = (
            Claim.objects.filter(assigned_staff=obj)
            .select_related("vehicle")
            .order_by("-created_at")[:5]
        )
        return [
            {
                "claim_id": c.id,
                "client_name": f"{c.first_name} {c.last_name}".strip(),
                "vehicle_registration": c.vehicle.registration if c.vehicle else None,
                "status": c.status,
                "start_date": c.start_date,
                "end_date": c.end_date,
                "created_at": c.created_at,
            }
            for c in claims
        ]


class OperationsClaimSerializer(ClaimSerializer):
    """Extended claim serializer for the operations dashboard."""

    client_name = serializers.SerializerMethodField()

    class Meta(ClaimSerializer.Meta):
        fields = ClaimSerializer.Meta.fields + ["client_name"]

    def get_client_name(self, obj: Claim):
        return f"{obj.first_name} {obj.last_name}".strip()
