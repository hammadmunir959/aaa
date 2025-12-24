from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from analytics.notification_service import create_notification_for_admins
from utils.email import notify_inquiry_team, send_inquiry_reply
from utils.permissions import IsAdmin
from utils.spam_protection import generate_simple_captcha

from .models import Inquiry
from .serializers import (
    InquiryCreateSerializer,
    InquiryReplySerializer,
    InquirySerializer,
)


class InquiryFilter(filters.FilterSet):
    status = filters.ChoiceFilter(choices=Inquiry.STATUS_CHOICES)
    source = filters.ChoiceFilter(choices=Inquiry.SOURCE_CHOICES)
    created_after = filters.DateTimeFilter(field_name="created_at", lookup_expr="gte")
    created_before = filters.DateTimeFilter(field_name="created_at", lookup_expr="lte")

    class Meta:
        model = Inquiry
        fields = ["status", "source", "is_spam"]


class InquiryViewSet(viewsets.ModelViewSet):
    queryset = Inquiry.objects.all().order_by("-created_at")
    filter_backends = [DjangoFilterBackend]
    filterset_class = InquiryFilter

    def get_queryset(self):
        """Optimize queryset for admin list views."""
        queryset = Inquiry.objects.all().order_by("-created_at")

        # For list views, limit fields
        if self.action == "list":
            queryset = queryset.only(
                "id",
                "name",
                "email",
                "subject",
                "status",
                "source",
                "is_spam",
                "created_at",
            )

        return queryset

    def get_serializer_class(self):
        if self.action == "create":
            return InquiryCreateSerializer
        return InquirySerializer

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsAdmin()]

    def perform_create(self, serializer):
        inquiry = serializer.save()
        notify_inquiry_team(inquiry)
        # send_inquiry_acknowledgement(inquiry) - Removed as per user request (redundant)

        # Create notification for all admins (skip if marked as spam)
        if not inquiry.is_spam:
            create_notification_for_admins(
                activity_type="inquiry_received",
                description=f"New inquiry from {inquiry.name} ({inquiry.email}): {inquiry.subject}",
                action_url=f"/admin/dashboard/inquiries/messages",
                notification_type="info",
                priority="medium",
                content_object=inquiry,
                actor_user=None,  # Public submission, no user
            )

    @action(detail=True, methods=["patch"], permission_classes=[IsAdmin])
    def update_status(self, request, pk=None):
        inquiry = self.get_object()
        new_status = request.data.get("status")

        if new_status not in dict(Inquiry.STATUS_CHOICES):
            return Response(
                {"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST
            )

        inquiry.status = new_status
        inquiry.save(update_fields=["status"])
        serializer = self.get_serializer(inquiry)
        return Response(serializer.data)

    @action(detail=True, methods=["patch"], permission_classes=[IsAdmin])
    def mark_spam(self, request, pk=None):
        inquiry = self.get_object()
        inquiry.is_spam = True
        inquiry.spam_score = request.data.get("spam_score")
        inquiry.save(update_fields=["is_spam", "spam_score"])
        serializer = self.get_serializer(inquiry)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[IsAdmin])
    def reply_email(self, request, pk=None):
        inquiry = self.get_object()
        reply_serializer = InquiryReplySerializer(data=request.data)
        reply_serializer.is_valid(raise_exception=True)

        reply_message = reply_serializer.validated_data["message"]
        send_inquiry_reply(
            inquiry=inquiry,
            reply_message=reply_message,
        )

        inquiry.status = "replied"
        inquiry.save(update_fields=["status"])

        serializer = self.get_serializer(inquiry)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def generate_captcha(request):
    """
    Generate a simple math captcha question.
    """
    question, answer = generate_simple_captcha()
    return Response(
        {
            "question": question,
            # Don't send the answer to the client!
            # The answer will be validated server-side
        }
    )
