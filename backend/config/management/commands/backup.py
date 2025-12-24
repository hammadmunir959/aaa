"""
Management command for AAA Accident Solutions LTD backup operations.

This command provides comprehensive backup functionality including:
- Database backup
- Media files backup
- Full backup (database + media)
- Backup listing and statistics
- Backup verification

Usage:
    python manage.py backup [options]
"""

import os
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from utils.backup import (
    backup_database,
    backup_media_files,
    cleanup_old_backups,
    create_backup_archive,
    get_backup_stats,
    list_backups,
    verify_backup_integrity,
)


class Command(BaseCommand):
    help = 'AAA Accident Solutions LTD backup management command'

    def add_arguments(self, parser):
        parser.add_argument(
            '--database',
            action='store_true',
            help='Backup only the database',
        )
        parser.add_argument(
            '--media',
            action='store_true',
            help='Backup only media files',
        )
        parser.add_argument(
            '--full',
            action='store_true',
            help='Create full backup (database + media)',
        )
        parser.add_argument(
            '--list',
            action='store_true',
            help='List all available backups',
        )
        parser.add_argument(
            '--stats',
            action='store_true',
            help='Show backup statistics',
        )
        parser.add_argument(
            '--verify',
            type=str,
            metavar='BACKUP_PATH',
            help='Verify integrity of a specific backup file',
        )
        parser.add_argument(
            '--cleanup',
            type=int,
            metavar='DAYS',
            help='Clean up backups older than specified days (default: 30)',
        )
        parser.add_argument(
            '--cleanup-dry-run',
            action='store_true',
            help='Show what would be cleaned up without actually deleting',
        )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('AAA Accident Solutions LTD Backup Management Command')
        )
        self.stdout.write('=' * 40)

        try:
            if options['database']:
                self._handle_database_backup()
            elif options['media']:
                self._handle_media_backup()
            elif options['full']:
                self._handle_full_backup()
            elif options['list']:
                self._handle_list_backups()
            elif options['stats']:
                self._handle_backup_stats()
            elif options['verify']:
                self._handle_verify_backup(options['verify'])
            elif options['cleanup'] is not None:
                self._handle_cleanup(options['cleanup'], dry_run=options['cleanup_dry_run'])
            elif options['cleanup_dry_run']:
                self._handle_cleanup(30, dry_run=True)
            else:
                self._show_usage()

        except Exception as e:
            raise CommandError(f'Backup operation failed: {e}')

    def _handle_database_backup(self):
        """Handle database backup operation."""
        self.stdout.write('Creating database backup...')
        backup_path = backup_database()

        if backup_path:
            self.stdout.write(
                self.style.SUCCESS(f'Database backup created: {backup_path}')
            )
        else:
            raise CommandError('Database backup failed')

    def _handle_media_backup(self):
        """Handle media files backup operation."""
        self.stdout.write('Creating media files backup...')
        backup_path = backup_media_files()

        if backup_path:
            self.stdout.write(
                self.style.SUCCESS(f'Media backup created: {backup_path}')
            )
        else:
            raise CommandError('Media backup failed')

    def _handle_full_backup(self):
        """Handle full backup operation."""
        self.stdout.write('Creating full backup (database + media)...')

        # Create individual backups first
        db_backup = backup_database()
        if not db_backup:
            raise CommandError('Database backup failed')

        media_backup = backup_media_files()
        if not media_backup:
            raise CommandError('Media backup failed')

        # Create combined archive
        archive_path = create_backup_archive(db_backup, media_backup)
        if archive_path:
            self.stdout.write(
                self.style.SUCCESS(f'Full backup created: {archive_path}')
            )
        else:
            raise CommandError('Full backup archive creation failed')

    def _handle_list_backups(self):
        """Handle backup listing operation."""
        backups = list_backups()

        if not backups:
            self.stdout.write('No backups found.')
            return

        self.stdout.write(f'Found {len(backups)} backup(s):\n')

        # Print header
        self.stdout.write(
            f"{'Type':<10} {'Filename':<35} {'Size (MB)':<10} {'Created':<20}"
        )
        self.stdout.write('-' * 75)

        # Print each backup
        for backup in backups:
            size_mb = f"{backup['size'] / (1024 * 1024):.2f}"
            created = backup['created'].strftime('%Y-%m-%d %H:%M:%S')
            self.stdout.write(
                f"{backup['type']:<10} {backup['filename']:<35} {size_mb:<10} {created:<20}"
            )

    def _handle_backup_stats(self):
        """Handle backup statistics operation."""
        stats = get_backup_stats()

        if not stats:
            self.stdout.write('Unable to retrieve backup statistics.')
            return

        self.stdout.write('Backup Statistics:')
        self.stdout.write(f"  Total backups: {stats['total_backups']}")
        self.stdout.write(f"  Total size: {stats['total_size_mb']} MB")
        self.stdout.write(f"  Backup directory: {stats['backup_directory']}")
        if stats['oldest_backup']:
            self.stdout.write(f"  Oldest backup: {stats['oldest_backup']}")
        if stats['newest_backup']:
            self.stdout.write(f"  Newest backup: {stats['newest_backup']}")

        self.stdout.write('\nBackups by type:')
        for backup_type, count in stats['backups_by_type'].items():
            self.stdout.write(f"  {backup_type.capitalize()}: {count}")

    def _handle_verify_backup(self, backup_path):
        """Handle backup verification operation."""
        if not os.path.exists(backup_path):
            raise CommandError(f'Backup file does not exist: {backup_path}')

        self.stdout.write(f'Verifying backup: {backup_path}')

        if verify_backup_integrity(backup_path):
            self.stdout.write(
                self.style.SUCCESS('✓ Backup verification successful')
            )
        else:
            self.stdout.write(
                self.style.ERROR('✗ Backup verification failed - file may be corrupted')
            )

    def _handle_cleanup(self, days, dry_run=False):
        """Handle backup cleanup operation."""
        if dry_run:
            self.stdout.write(f'Dry run: Would clean up backups older than {days} days')
        else:
            self.stdout.write(f'Cleaning up backups older than {days} days...')

        # Get list of backups for dry run
        backups = list_backups()
        old_backups = []

        from datetime import datetime, timedelta
        cutoff_date = datetime.now() - timedelta(days=days)

        for backup in backups:
            if backup['created'] < cutoff_date:
                old_backups.append(backup)

        if not old_backups:
            self.stdout.write('No old backups to clean up.')
            return

        if dry_run:
            self.stdout.write(f'Would delete {len(old_backups)} backup(s):')
            for backup in old_backups:
                self.stdout.write(f'  - {backup["filename"]} ({backup["created"].strftime("%Y-%m-%d %H:%M:%S")})')
        else:
            deleted_count = cleanup_old_backups(days)
            self.stdout.write(
                self.style.SUCCESS(f'Cleanup completed: {deleted_count} backup(s) removed')
            )

    def _show_usage(self):
        """Show command usage information."""
        self.stdout.write("""
Usage: python manage.py backup [options]

Options:
  --database           Backup only the database
  --media             Backup only media files
  --full              Create full backup (database + media)
  --list              List all available backups
  --stats             Show backup statistics
  --verify PATH       Verify integrity of a specific backup file
  --cleanup DAYS      Clean up backups older than specified days
  --cleanup-dry-run   Show what would be cleaned up without deleting

Examples:
  python manage.py backup --full
  python manage.py backup --list
  python manage.py backup --cleanup 30
  python manage.py backup --verify /path/to/backup.tar.gz
""")
