# Generated migration for adding notification fields to ActivityLog

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("analytics", "0001_initial"),
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="activitylog",
            name="recipient",
            field=models.ForeignKey(
                blank=True,
                help_text="User who should be notified about this activity",
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="notifications",
                to="accounts.user",
            ),
        ),
        migrations.AddField(
            model_name="activitylog",
            name="is_read",
            field=models.BooleanField(
                default=False,
                help_text="Whether the notification has been read by the recipient",
            ),
        ),
        migrations.AddField(
            model_name="activitylog",
            name="read_at",
            field=models.DateTimeField(
                blank=True, help_text="When the notification was read", null=True
            ),
        ),
        migrations.AddField(
            model_name="activitylog",
            name="notification_type",
            field=models.CharField(
                choices=[
                    ("info", "Info"),
                    ("success", "Success"),
                    ("warning", "Warning"),
                    ("error", "Error"),
                ],
                default="info",
                help_text="Visual type for notification display",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="activitylog",
            name="priority",
            field=models.CharField(
                choices=[
                    ("low", "Low"),
                    ("medium", "Medium"),
                    ("high", "High"),
                    ("urgent", "Urgent"),
                ],
                default="medium",
                help_text="Priority level of the notification",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="activitylog",
            name="action_url",
            field=models.CharField(
                blank=True,
                help_text="URL to navigate to when notification is clicked",
                max_length=500,
            ),
        ),
        migrations.AddField(
            model_name="activitylog",
            name="expires_at",
            field=models.DateTimeField(
                blank=True,
                help_text="Optional expiration date for the notification",
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="activitylog",
            name="activity_type",
            field=models.CharField(
                choices=[
                    ("login", "User Login"),
                    ("logout", "User Logout"),
                    ("create", "Create Record"),
                    ("update", "Update Record"),
                    ("delete", "Delete Record"),
                    ("view", "View Record"),
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
                ],
                max_length=50,
            ),
        ),
        migrations.AlterField(
            model_name="activitylog",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="activities",
                to="accounts.user",
            ),
        ),
        migrations.AddIndex(
            model_name="activitylog",
            index=models.Index(
                fields=["recipient", "is_read", "-created_at"],
                name="analytics_a_recipie_idx",
            ),
        ),
    ]
