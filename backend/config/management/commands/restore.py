"""
Management command for AAA backup restoration.

This command provides comprehensive restore functionality including:
- Database restoration
- Media files restoration
- Full backup restoration
- Restore verification

Usage:
    python manage.py restore [options] <backup_file>
"""

import os
import shutil
import tarfile
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from django.conf import settings


class Command(BaseCommand):
    help = "AAA backup restoration command"

    def add_arguments(self, parser):
        parser.add_argument(
            "backup_file",
            help="Path to the backup file to restore",
        )
        parser.add_argument(
            "--database-only",
            action="store_true",
            help="Restore only the database from backup",
        )
        parser.add_argument(
            "--media-only",
            action="store_true",
            help="Restore only media files from backup",
        )
        parser.add_argument(
            "--full-restore",
            action="store_true",
            help="Perform full restoration (database + media)",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would be restored without actually doing it",
        )
        parser.add_argument(
            "--force",
            action="store_true",
            help="Force restoration without confirmation prompts",
        )

    def handle(self, *args, **options):
        backup_file = options["backup_file"]

        self.stdout.write(self.style.SUCCESS("AAA Backup Restoration Command"))
        self.stdout.write("=" * 40)

        # Validate backup file exists
        if not os.path.exists(backup_file):
            raise CommandError(f"Backup file does not exist: {backup_file}")

        # Determine restore type
        if options["database_only"]:
            self._restore_database(backup_file, options["dry_run"], options["force"])
        elif options["media_only"]:
            self._restore_media(backup_file, options["dry_run"], options["force"])
        elif options["full_restore"]:
            self._restore_full(backup_file, options["dry_run"], options["force"])
        else:
            # Auto-detect based on filename
            self._auto_detect_restore_type(
                backup_file, options["dry_run"], options["force"]
            )

    def _auto_detect_restore_type(self, backup_file, dry_run, force):
        """Auto-detect the type of restoration needed based on filename."""
        filename = os.path.basename(backup_file)

        if filename.startswith("db_") and filename.endswith(".psql"):
            self.stdout.write("Detected database backup, restoring database...")
            self._restore_database(backup_file, dry_run, force)
        elif filename.startswith("media_") and filename.endswith(".tar.gz"):
            self.stdout.write("Detected media backup, restoring media files...")
            self._restore_media(backup_file, dry_run, force)
        elif filename.startswith("full_backup_") and filename.endswith(".tar.gz"):
            self.stdout.write("Detected full backup, performing full restoration...")
            self._restore_full(backup_file, dry_run, force)
        else:
            raise CommandError(
                f"Cannot auto-detect backup type for: {filename}\n"
                "Please specify --database-only, --media-only, or --full-restore"
            )

    def _restore_database(self, backup_file, dry_run, force):
        """Restore database from backup."""
        if not dry_run and not force:
            confirmed = self._confirm_action(
                f"This will REPLACE the current database with the backup: {backup_file}\n"
                "All current data will be lost. Continue?"
            )
            if not confirmed:
                self.stdout.write("Database restoration cancelled.")
                return

        self.stdout.write(
            f'{"[DRY RUN] " if dry_run else ""}Restoring database from: {backup_file}'
        )

        if dry_run:
            self.stdout.write("Would run: dbrestore command")
            return

        try:
            # Use django-dbbackup to restore
            call_command("dbrestore", backup_file, interactive=False)
            self.stdout.write(
                self.style.SUCCESS("Database restoration completed successfully")
            )
        except Exception as e:
            raise CommandError(f"Database restoration failed: {e}")

    def _restore_media(self, backup_file, dry_run, force):
        """Restore media files from backup."""
        if not dry_run and not force:
            confirmed = self._confirm_action(
                f"This will REPLACE media files in {settings.MEDIA_ROOT}\n"
                "Existing media files may be overwritten. Continue?"
            )
            if not confirmed:
                self.stdout.write("Media restoration cancelled.")
                return

        self.stdout.write(
            f'{"[DRY RUN] " if dry_run else ""}Restoring media files from: {backup_file}'
        )

        if dry_run:
            self.stdout.write(f"Would extract to: {settings.MEDIA_ROOT}")
            return

        try:
            self._extract_media_backup(backup_file)
            self.stdout.write(
                self.style.SUCCESS("Media files restoration completed successfully")
            )
        except Exception as e:
            raise CommandError(f"Media restoration failed: {e}")

    def _restore_full(self, backup_file, dry_run, force):
        """Perform full restoration (database + media)."""
        if not dry_run and not force:
            confirmed = self._confirm_action(
                f"This will perform a COMPLETE restoration from: {backup_file}\n"
                "This includes database replacement and media file restoration.\n"
                "ALL current data will be lost. Continue?"
            )
            if not confirmed:
                self.stdout.write("Full restoration cancelled.")
                return

        self.stdout.write(
            f'{"[DRY RUN] " if dry_run else ""}Performing full restoration from: {backup_file}'
        )

        if dry_run:
            self.stdout.write("Would restore database and extract media files")
            return

        try:
            # Extract and restore database
            temp_dir = self._extract_full_backup(backup_file)

            # Find database backup in extracted files
            db_backup = None
            for file_path in Path(temp_dir).rglob("*"):
                if file_path.name.startswith("db_") and file_path.name.endswith(
                    ".psql"
                ):
                    db_backup = str(file_path)
                    break

            if not db_backup:
                raise CommandError("Database backup not found in full backup archive")

            # Restore database
            self.stdout.write("Restoring database...")
            call_command("dbrestore", db_backup, interactive=False)

            # Restore media files
            self.stdout.write("Restoring media files...")
            media_dir = Path(temp_dir) / "media"
            if media_dir.exists():
                media_backup = None
                for file_path in media_dir.rglob("*.tar.gz"):
                    media_backup = str(file_path)
                    break

                if media_backup:
                    self._extract_media_backup(media_backup)
                else:
                    self.stdout.write(
                        self.style.WARNING("No media backup found in full backup")
                    )
            else:
                self.stdout.write(
                    self.style.WARNING("No media directory found in full backup")
                )

            # Cleanup
            shutil.rmtree(temp_dir)

            self.stdout.write(
                self.style.SUCCESS("Full restoration completed successfully")
            )

        except Exception as e:
            raise CommandError(f"Full restoration failed: {e}")

    def _extract_media_backup(self, backup_file):
        """Extract media files from backup archive."""
        media_root = Path(settings.MEDIA_ROOT)
        media_root.mkdir(parents=True, exist_ok=True)

        # Create temporary directory for extraction
        import tempfile

        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)

            # Extract archive
            with tarfile.open(backup_file, "r:gz") as tar:
                tar.extractall(temp_path)

            # Find media directory in extracted files
            extracted_media = None
            for item in temp_path.iterdir():
                if item.is_dir() and (
                    item.name == "media" or "media" in item.name.lower()
                ):
                    extracted_media = item
                    break

            if not extracted_media:
                # If no media directory found, assume all files are media files
                extracted_media = temp_path

            # Copy files to media root
            for file_path in extracted_media.rglob("*"):
                if file_path.is_file():
                    # Calculate relative path
                    relative_path = file_path.relative_to(extracted_media)
                    target_path = media_root / relative_path

                    # Create target directory
                    target_path.parent.mkdir(parents=True, exist_ok=True)

                    # Copy file
                    shutil.copy2(file_path, target_path)

    def _extract_full_backup(self, backup_file):
        """Extract full backup archive and return temp directory path."""
        import tempfile

        temp_dir = tempfile.mkdtemp(prefix="pchm_restore_")
        temp_path = Path(temp_dir)

        with tarfile.open(backup_file, "r:gz") as tar:
            tar.extractall(temp_path)

        return temp_dir

    def _confirm_action(self, message):
        """Get user confirmation for destructive operations."""
        self.stdout.write(self.style.WARNING(message))
        response = input('Type "yes" to continue: ').strip().lower()
        return response == "yes"
