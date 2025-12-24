from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class PageView(models.Model):
    """Track page views for analytics"""

    page_path = models.CharField(max_length=500)
    page_title = models.CharField(max_length=200, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    referrer = models.CharField(max_length=500, blank=True)
    session_id = models.CharField(max_length=200, blank=True)
    user = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, blank=True
    )
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-viewed_at"]
        indexes = [
            models.Index(fields=["page_path", "-viewed_at"]),
            models.Index(fields=["-viewed_at"]),
            models.Index(fields=["session_id"]),
        ]


class VisitorSession(models.Model):
    """Track visitor sessions"""

    session_id = models.CharField(max_length=200, unique=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    first_visit = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    page_views_count = models.IntegerField(default=0)
    duration_seconds = models.IntegerField(null=True, blank=True)
    user = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, blank=True
    )

    class Meta:
        ordering = ["-first_visit"]
        indexes = [
            models.Index(fields=["session_id"]),
            models.Index(fields=["-first_visit"]),
        ]


class ActivityLog(models.Model):
    """Log user activities for dashboard and notifications"""

    ACTIVITY_TYPES = [
        ("login", "User Login"),
        ("logout", "User Logout"),
        ("create", "Create Record"),
        ("update", "Update Record"),
        ("delete", "Delete Record"),
        ("view", "View Record"),
        # Notification activity types
        ("booking_created", "Booking Created"),
        ("booking_updated", "Booking Updated"),
        ("booking_approved", "Booking Approved"),
        ("booking_cancelled", "Booking Cancelled"),
        ("inquiry_received", "Inquiry Received"),
        ("inquiry_assigned", "Inquiry Assigned"),
        ("testimonial_submitted", "Testimonial Submitted"),
        ("testimonial_approved", "Testimonial Approved"),
        ("testimonial_rejected", "Testimonial Rejected"),
        ("admin_approved", "Admin Approved"),
        ("admin_suspended", "Admin Suspended"),
        ("backup_completed", "Backup Completed"),
        ("backup_failed", "Backup Failed"),
        ("purchase_request", "Purchase Request"),
        ("system_alert", "System Alert"),
        ("user_action", "User Action"),
    ]

    NOTIFICATION_TYPES = [
        ("info", "Info"),
        ("success", "Success"),
        ("warning", "Warning"),
        ("error", "Error"),
    ]

    PRIORITY_LEVELS = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("urgent", "Urgent"),
    ]

    user = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="activities",
    )
    recipient = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="notifications",
        help_text="User who should be notified about this activity",
    )
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    description = models.TextField()
    content_type = models.ForeignKey(
        ContentType, on_delete=models.CASCADE, null=True, blank=True
    )
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey("content_type", "object_id")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    # Notification fields
    is_read = models.BooleanField(
        default=False,
        help_text="Whether the notification has been read by the recipient",
    )
    read_at = models.DateTimeField(
        null=True, blank=True, help_text="When the notification was read"
    )
    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPES,
        default="info",
        help_text="Visual type for notification display",
    )
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_LEVELS,
        default="medium",
        help_text="Priority level of the notification",
    )
    action_url = models.CharField(
        max_length=500,
        blank=True,
        help_text="URL to navigate to when notification is clicked",
    )
    expires_at = models.DateTimeField(
        null=True, blank=True, help_text="Optional expiration date for the notification"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["recipient", "is_read", "-created_at"]),
            models.Index(fields=["activity_type", "-created_at"]),
            models.Index(fields=["-created_at"]),
        ]

    def mark_as_read(self):
        """Mark this notification as read"""
        if not self.is_read:
            from django.utils import timezone

            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=["is_read", "read_at"])

    def __str__(self):
        return f"{self.get_activity_type_display()} - {self.description[:50]}"
