"""
Management command to fix old notification URLs.
Converts /admin/dashboard/cms/inquiries to /admin/dashboard/inquiries/messages
"""
from django.core.management.base import BaseCommand
from analytics.models import ActivityLog


class Command(BaseCommand):
    help = 'Fix old incorrect notification action_urls'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be updated without making changes',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        # Find notifications with incorrect URLs
        notifications = ActivityLog.objects.filter(
            action_url__icontains='/admin/dashboard/cms/inquiries'
        )
        
        count = notifications.count()
        
        if count == 0:
            self.stdout.write(
                self.style.SUCCESS('No notifications with incorrect URLs found.')
            )
            return
        
        self.stdout.write(f'Found {count} notification(s) with incorrect URLs.')
        
        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN - No changes will be made'))
            for notification in notifications:
                self.stdout.write(
                    f'  ID {notification.id}: {notification.action_url} → /admin/dashboard/inquiries/messages'
                )
        else:
            updated = notifications.update(
                action_url='/admin/dashboard/inquiries/messages'
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully updated {updated} notification(s).'
                )
            )

