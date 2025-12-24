"""
Backup utilities for AAA Accident Solutions LTD application.

This module provides comprehensive backup functionality including:
- Database backups using django-dbbackup
- Media files compression
- Backup archive creation
- Automatic cleanup based on retention policies

Integration with Celery tasks for automated scheduling.
"""

import logging
import os
import shutil
import tarfile
import tempfile
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

from django.conf import settings
from django.core.management import call_command
from django.utils import timezone

logger = logging.getLogger(__name__)


def get_backup_directory() -> Path:
    """
    Get the backup directory path.

    Returns:
        Path: Backup directory path
    """
    if hasattr(settings, "BACKUP_STORAGE") and settings.BACKUP_STORAGE == "s3":
        # For S3 storage, use a temporary local directory
        temp_dir = Path(tempfile.gettempdir()) / "aaa_backups"
        temp_dir.mkdir(exist_ok=True)
        return temp_dir
    else:
        # Default local storage
        backup_dir = Path(os.getenv("BACKUP_DIR", "/opt/backups/aaa"))
        backup_dir.mkdir(parents=True, exist_ok=True)
        return backup_dir


def get_timestamp() -> str:
    """
    Generate a timestamp string for backup files.

    Returns:
        str: Timestamp in YYYYMMDD_HHMMSS format
    """
    return datetime.now().strftime("%Y%m%d_%H%M%S")


def backup_database() -> Optional[str]:
    """
    Create a backup of the PostgreSQL database using pg_dump.

    Returns:
        Optional[str]: Path to the created backup file, or None if failed
    """
    try:
        backup_dir = get_backup_directory()
        timestamp = get_timestamp()
        backup_filename = f"db_{timestamp}.sql.gz"
        backup_path = backup_dir / backup_filename

        # Ensure backup directory exists
        backup_dir.mkdir(parents=True, exist_ok=True)

        # Database connection parameters
        db_config = settings.DATABASES["default"]
        db_name = db_config["NAME"]
        db_user = db_config["USER"]
        db_password = db_config["PASSWORD"]
        db_host = db_config["HOST"]
        db_port = db_config["PORT"]

        # Build pg_dump command
        import subprocess

        cmd = [
            "pg_dump",
            "-h",
            db_host,
            "-p",
            str(db_port),
            "-U",
            db_user,
            "-d",
            db_name,
            "--no-password",
            "--compress=9",  # gzip compression level 9
            "--format=custom",  # custom format (compressed)
            "--blobs",  # include large objects
            "--verbose",
        ]

        # Set environment variable for password
        env = os.environ.copy()
        env["PGPASSWORD"] = db_password

        logger.info(f"Creating database backup: {backup_path}")

        # Run pg_dump
        with open(backup_path, "wb") as f:
            result = subprocess.run(
                cmd, stdout=f, stderr=subprocess.PIPE, env=env, check=True
            )

        if backup_path.exists() and backup_path.stat().st_size > 0:
            size_mb = backup_path.stat().st_size / (1024 * 1024)
            logger.info(
                f"Database backup created successfully: {backup_path} ({size_mb:.2f} MB)"
            )
            return str(backup_path)
        else:
            logger.error("Database backup file was not created or is empty")
            return None

    except subprocess.CalledProcessError as e:
        logger.error(f"pg_dump command failed: {e.stderr.decode()}")
        return None
    except Exception as e:
        logger.error(f"Database backup failed: {e}", exc_info=True)
        return None


def backup_media_files() -> Optional[str]:
    """
    Create a compressed archive of the media directory.

    Returns:
        Optional[str]: Path to the created backup archive, or None if failed
    """
    try:
        media_root = Path(settings.MEDIA_ROOT)
        if not media_root.exists():
            logger.warning(f"Media directory does not exist: {media_root}")
            return None

        backup_dir = get_backup_directory()
        timestamp = get_timestamp()
        backup_filename = f"media_{timestamp}.tar.gz"
        backup_path = backup_dir / backup_filename

        # Create compressed archive
        with tarfile.open(backup_path, "w:gz") as tar:
            # Add all files in media directory
            for file_path in media_root.rglob("*"):
                if file_path.is_file():
                    # Calculate relative path for archive
                    relative_path = file_path.relative_to(media_root.parent)
                    tar.add(file_path, arcname=str(relative_path))

        # Verify backup was created and has content
        if backup_path.exists() and backup_path.stat().st_size > 0:
            logger.info(
                f"Media backup created: {backup_path} ({backup_path.stat().st_size} bytes)"
            )
            return str(backup_path)
        else:
            logger.error("Media backup creation failed or resulted in empty file")
            return None

    except Exception as e:
        logger.error(f"Media backup failed: {e}", exc_info=True)
        return None


def create_backup_archive(db_backup_path: str, media_backup_path: str) -> Optional[str]:
    """
    Create a combined archive containing database and media backups.

    Args:
        db_backup_path: Path to database backup file
        media_backup_path: Path to media backup file

    Returns:
        Optional[str]: Path to the combined archive, or None if failed
    """
    try:
        if not db_backup_path or not media_backup_path:
            logger.error("Cannot create archive: missing backup files")
            return None

        db_path = Path(db_backup_path)
        media_path = Path(media_backup_path)

        if not db_path.exists() or not media_path.exists():
            logger.error("Cannot create archive: backup files do not exist")
            return None

        backup_dir = get_backup_directory()
        timestamp = get_timestamp()
        archive_filename = f"full_backup_{timestamp}.tar.gz"
        archive_path = backup_dir / archive_filename

        # Create combined archive
        with tarfile.open(archive_path, "w:gz") as tar:
            # Add database backup
            tar.add(db_path, arcname=f"database/{db_path.name}")

            # Add media backup
            tar.add(media_path, arcname=f"media/{media_path.name}")

            # Create a metadata file
            metadata_content = f"""AAA Accident Solutions LTD Full Backup
Created: {datetime.now().isoformat()}
Database backup: {db_path.name}
Media backup: {media_path.name}
Database size: {db_path.stat().st_size} bytes
Media size: {media_path.stat().st_size} bytes
"""

            # Add metadata as a file in the archive
            import io

            metadata_file = io.BytesIO(metadata_content.encode("utf-8"))
            tarinfo = tarfile.TarInfo(name="backup_info.txt")
            tarinfo.size = len(metadata_content.encode("utf-8"))
            tar.addfile(tarinfo, fileobj=metadata_file)

        if archive_path.exists() and archive_path.stat().st_size > 0:
            logger.info(
                f"Full backup archive created: {archive_path} ({archive_path.stat().st_size} bytes)"
            )

            # Clean up individual backup files after successful archive creation
            try:
                db_path.unlink()
                media_path.unlink()
                logger.info("Individual backup files cleaned up after archive creation")
            except Exception as e:
                logger.warning(f"Failed to clean up individual backup files: {e}")

            return str(archive_path)
        else:
            logger.error(
                "Full backup archive creation failed or resulted in empty file"
            )
            return None

    except Exception as e:
        logger.error(f"Full backup archive creation failed: {e}", exc_info=True)
        return None


def cleanup_old_backups(days: int = 30) -> int:
    """
    Remove backup files older than the specified number of days.

    Args:
        days: Number of days to retain backups (default: 30)

    Returns:
        int: Number of files deleted
    """
    try:
        backup_dir = get_backup_directory()
        cutoff_date = timezone.now() - timedelta(days=days)

        deleted_count = 0
        backup_files = list(backup_dir.glob("*"))

        for backup_file in backup_files:
            if backup_file.is_file():
                # Check file modification time
                file_mtime = datetime.fromtimestamp(backup_file.stat().st_mtime)
                file_mtime = timezone.make_aware(file_mtime)

                if file_mtime < cutoff_date:
                    try:
                        backup_file.unlink()
                        deleted_count += 1
                        logger.info(f"Deleted old backup: {backup_file.name}")
                    except Exception as e:
                        logger.warning(f"Failed to delete {backup_file.name}: {e}")

        if deleted_count > 0:
            logger.info(f"Cleanup completed: {deleted_count} old backup files removed")
        else:
            logger.info("Cleanup completed: no old backup files to remove")

        return deleted_count

    except Exception as e:
        logger.error(f"Backup cleanup failed: {e}", exc_info=True)
        return 0


def verify_backup_integrity(backup_path: str) -> bool:
    """
    Verify that a backup file is not corrupted.

    Args:
        backup_path: Path to the backup file to verify

    Returns:
        bool: True if backup is valid, False otherwise
    """
    try:
        path = Path(backup_path)

        if not path.exists():
            logger.error(f"Backup file does not exist: {backup_path}")
            return False

        if path.stat().st_size == 0:
            logger.error(f"Backup file is empty: {backup_path}")
            return False

        # For tar.gz files, try to open and verify structure
        if backup_path.endswith(".tar.gz"):
            try:
                with tarfile.open(backup_path, "r:gz") as tar:
                    # Try to list contents to verify archive integrity
                    tar.getmembers()
                logger.info(f"Backup integrity verified: {backup_path}")
                return True
            except tarfile.TarError as e:
                logger.error(f"Backup archive is corrupted: {backup_path} - {e}")
                return False
        else:
            # For other files, just check size and readability
            try:
                with open(backup_path, "rb") as f:
                    f.read(1024)  # Try to read first 1KB
                logger.info(f"Backup file verified: {backup_path}")
                return True
            except Exception as e:
                logger.error(f"Backup file is corrupted: {backup_path} - {e}")
                return False

    except Exception as e:
        logger.error(f"Backup verification failed: {e}", exc_info=True)
        return False


def list_backups() -> list[dict]:
    """
    List all available backup files with metadata.

    Returns:
        list[dict]: List of backup information dictionaries
    """
    try:
        backup_dir = get_backup_directory()
        backups = []

        for backup_file in backup_dir.glob("*"):
            if backup_file.is_file():
                stat = backup_file.stat()
                backups.append(
                    {
                        "filename": backup_file.name,
                        "path": str(backup_file),
                        "size": stat.st_size,
                        "created": datetime.fromtimestamp(stat.st_mtime),
                        "type": (
                            "database"
                            if backup_file.name.startswith("db_")
                            else (
                                "media"
                                if backup_file.name.startswith("media_")
                                else (
                                    "full"
                                    if backup_file.name.startswith("full_backup_")
                                    else "unknown"
                                )
                            )
                        ),
                    }
                )

        # Sort by creation time (newest first)
        backups.sort(key=lambda x: x["created"], reverse=True)

        return backups

    except Exception as e:
        logger.error(f"Failed to list backups: {e}", exc_info=True)
        return []


def get_backup_stats() -> dict:
    """
    Get statistics about the backup system.

    Returns:
        dict: Backup statistics
    """
    try:
        backups = list_backups()
        backup_dir = get_backup_directory()

        total_size = sum(b["size"] for b in backups)
        oldest_backup = min((b["created"] for b in backups), default=None)
        newest_backup = max((b["created"] for b in backups), default=None)

        stats = {
            "total_backups": len(backups),
            "total_size_bytes": total_size,
            "total_size_mb": round(total_size / (1024 * 1024), 2),
            "backup_directory": str(backup_dir),
            "oldest_backup": oldest_backup.isoformat() if oldest_backup else None,
            "newest_backup": newest_backup.isoformat() if newest_backup else None,
            "backups_by_type": {
                "database": len([b for b in backups if b["type"] == "database"]),
                "media": len([b for b in backups if b["type"] == "media"]),
                "full": len([b for b in backups if b["type"] == "full"]),
                "unknown": len([b for b in backups if b["type"] == "unknown"]),
            },
        }

        return stats

    except Exception as e:
        logger.error(f"Failed to get backup stats: {e}", exc_info=True)
        return {}


# Legacy function for backward compatibility with shell script
def run_legacy_backup() -> bool:
    """
    Run backup using the legacy shell script approach.
    This is kept for backward compatibility.

    Returns:
        bool: True if backup succeeded, False otherwise
    """
    import subprocess

    try:
        script_path = Path(settings.BASE_DIR).parent / "backup.sh"

        if not script_path.exists():
            logger.error(f"Legacy backup script not found: {script_path}")
            return False

        # Make script executable
        script_path.chmod(0o755)

        # Run the backup script
        result = subprocess.run(
            [str(script_path)], cwd=script_path.parent, capture_output=True, text=True
        )

        if result.returncode == 0:
            logger.info("Legacy backup completed successfully")
            logger.debug(f"Backup output: {result.stdout}")
            return True
        else:
            logger.error(f"Legacy backup failed: {result.stderr}")
            return False

    except Exception as e:
        logger.error(f"Legacy backup execution failed: {e}", exc_info=True)
        return False
