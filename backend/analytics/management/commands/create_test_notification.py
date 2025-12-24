"""
Management command to create a test notification for the current user.
Usage: python manage.py create_test_notification --user <email>
"""

from django.core.management.base import BaseCommand

from accounts.models import User
from analytics.notification_service import create_notification


class Command(BaseCommand):
    help = "Create a test notification for a user"

    def add_arguments(self, parser):
        parser.add_argument(
            "--user",
            type=str,
            help="Email of the user to create notification for",
            required=True,
        )
        parser.add_argument(
            "--type",
            type=str,
            default="info",
            choices=["info", "success", "warning", "error"],
            help="Notification type",
        )

    def handle(self, *args, **options):
        user_email = options["user"]
        notification_type = options["type"]

        try:
            user = User.objects.get(email=user_email)
            self.stdout.write(f"Creating test notification for user: {user.email}")

            notification = create_notification(
                recipient=user,
                activity_type="system_alert",
                description=f"This is a test {notification_type} notification to verify the notification system is working.",
                notification_type=notification_type,
                priority="medium",
                action_url="/admin/dashboard",
            )

            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully created notification #{notification.id} for {user.email}"
                )
            )
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f"User with email {user_email} not found")
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error creating notification: {str(e)}")
            )
