"""
Backup management API views for admin dashboard.
"""

import os
import logging
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from django.core.management import call_command
from django.core.exceptions import ValidationError
from django.http import FileResponse, Http404, JsonResponse
from django.utils.encoding import escape_uri_path
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from pathlib import Path

from utils.backup import (
    backup_database,
    backup_media_files,
    create_backup_archive,
    cleanup_old_backups,
    list_backups,
    get_backup_stats,
    verify_backup_integrity,
)
from utils.tasks import (
    run_full_backup,
    run_database_backup,
    run_media_backup,
    cleanup_expired_backups,
)

logger = logging.getLogger(__name__)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def backup_stats(request):
    """Get backup statistics."""
    try:
        # Check if user is admin or staff
        is_admin = hasattr(request.user, "is_admin") and request.user.is_admin
        if not (request.user.is_staff or is_admin):
            return Response(
                {"error": "Permission denied. Staff access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        stats = get_backup_stats()
        logger.info(f"Backup stats retrieved by user {request.user.username}")
        return Response(stats, status=status.HTTP_200_OK)
    except FileNotFoundError as e:
        logger.warning(f"Backup directory not found: {e}")
        return Response(
            {"error": "Backup directory not accessible", "details": str(e)},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    except PermissionError as e:
        logger.error(f"Permission error accessing backup directory: {e}")
        return Response(
            {"error": "Insufficient permissions to access backup directory"},
            status=status.HTTP_403_FORBIDDEN,
        )
    except Exception as e:
        logger.error(f"Error getting backup stats: {e}", exc_info=True)
        return Response(
            {
                "error": "Failed to retrieve backup statistics",
                "details": str(e) if settings.DEBUG else None,
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def backup_list(request):
    """List all available backups."""
    try:
        # Check if user is admin or staff
        is_admin = hasattr(request.user, "is_admin") and request.user.is_admin
        if not (request.user.is_staff or is_admin):
            return Response(
                {"error": "Permission denied. Staff access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        backups = list_backups()
        logger.info(
            f"Backup list retrieved by user {request.user.username}, found {len(backups)} backups"
        )
        return Response({"backups": backups}, status=status.HTTP_200_OK)
    except FileNotFoundError as e:
        logger.warning(f"Backup directory not found: {e}")
        return Response(
            {"error": "Backup directory not accessible", "details": str(e)},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    except PermissionError as e:
        logger.error(f"Permission error accessing backup directory: {e}")
        return Response(
            {"error": "Insufficient permissions to access backup directory"},
            status=status.HTTP_403_FORBIDDEN,
        )
    except Exception as e:
        logger.error(f"Error listing backups: {e}", exc_info=True)
        return Response(
            {
                "error": "Failed to list backups",
                "details": str(e) if settings.DEBUG else None,
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def backup_create(request):
    """Create a backup (database, media, or full)."""
    try:
        # Check if user is admin or staff
        is_admin = hasattr(request.user, "is_admin") and request.user.is_admin
        if not (request.user.is_staff or is_admin):
            return Response(
                {"error": "Permission denied. Staff access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        backup_type = request.data.get("type", "full")  # 'database', 'media', or 'full'

        if backup_type == "database":
            result = run_database_backup.delay()
            logger.info(
                f"Database backup task queued by user {request.user.username}, task_id: {result.id}"
            )
            return Response(
                {
                    "message": "Database backup task queued",
                    "task_id": result.id,
                    "type": "database",
                },
                status=status.HTTP_202_ACCEPTED,
            )

        elif backup_type == "media":
            result = run_media_backup.delay()
            logger.info(
                f"Media backup task queued by user {request.user.username}, task_id: {result.id}"
            )
            return Response(
                {
                    "message": "Media backup task queued",
                    "task_id": result.id,
                    "type": "media",
                },
                status=status.HTTP_202_ACCEPTED,
            )

        elif backup_type == "full":
            result = run_full_backup.delay()
            logger.info(
                f"Full backup task queued by user {request.user.username}, task_id: {result.id}"
            )
            return Response(
                {
                    "message": "Full backup task queued",
                    "task_id": result.id,
                    "type": "full",
                },
                status=status.HTTP_202_ACCEPTED,
            )

        else:
            return Response(
                {
                    "error": f'Invalid backup type: {backup_type}. Must be "database", "media", or "full"'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    except Exception as e:
        logger.error(f"Error creating backup: {e}", exc_info=True)
        return Response(
            {
                "error": f"Failed to create backup: {str(e)}",
                "details": str(e) if settings.DEBUG else None,
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def backup_verify(request):
    """Verify backup integrity."""
    try:
        # Check if user is admin or staff
        is_admin = hasattr(request.user, "is_admin") and request.user.is_admin
        if not (request.user.is_staff or is_admin):
            return Response(
                {"error": "Permission denied. Staff access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        backup_path = request.data.get("path")

        if not backup_path:
            return Response(
                {"error": "Backup path is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        is_valid = verify_backup_integrity(backup_path)
        logger.info(
            f"Backup verification by user {request.user.username} for {backup_path}: {'valid' if is_valid else 'invalid'}"
        )
        return Response(
            {
                "path": backup_path,
                "valid": is_valid,
                "message": (
                    "Backup is valid" if is_valid else "Backup verification failed"
                ),
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        logger.error(f"Error verifying backup: {e}", exc_info=True)
        return Response(
            {
                "error": f"Failed to verify backup: {str(e)}",
                "details": str(e) if settings.DEBUG else None,
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def backup_cleanup(request):
    """Clean up old backups."""
    try:
        # Check if user is admin or staff
        is_admin = hasattr(request.user, "is_admin") and request.user.is_admin
        if not (request.user.is_staff or is_admin):
            return Response(
                {"error": "Permission denied. Staff access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        days = request.data.get("days", 30)

        try:
            days = int(days)
            if days < 1:
                return Response(
                    {"error": "Days must be a positive integer"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except (ValueError, TypeError):
            return Response(
                {"error": "Days must be a valid integer"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        deleted_count = cleanup_old_backups(days)
        logger.info(
            f"Backup cleanup by user {request.user.username}: deleted {deleted_count} backups older than {days} days"
        )
        return Response(
            {
                "message": f"Cleanup completed",
                "deleted_count": deleted_count,
                "retention_days": days,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        logger.error(f"Error cleaning up backups: {e}", exc_info=True)
        return Response(
            {
                "error": f"Failed to cleanup backups: {str(e)}",
                "details": str(e) if settings.DEBUG else None,
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def backup_config(request):
    """Get backup configuration."""
    try:
        # Check if user is admin or staff
        is_admin = hasattr(request.user, "is_admin") and request.user.is_admin
        if not (request.user.is_staff or is_admin):
            return Response(
                {"error": "Permission denied. Staff access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        config = {
            "enabled": getattr(settings, "BACKUP_ENABLED", True),
            "retention_days": getattr(settings, "BACKUP_RETENTION_DAYS", 30),
            "storage": getattr(settings, "BACKUP_STORAGE", "local"),
            "schedule_hour": int(os.getenv("BACKUP_SCHEDULE_HOUR", 2)),
            "backup_directory": str(
                getattr(settings, "DBBACKUP_BACKUP_DIRECTORY", "/opt/backups/pchm")
            ),
        }
        return Response(config, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error getting backup config: {e}", exc_info=True)
        return Response(
            {
                "error": "Failed to retrieve backup configuration",
                "details": str(e) if settings.DEBUG else None,
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def backup_download(request, filename):
    """Download a backup file."""
    try:
        # Security check - ensure the user is super admin or superuser
        is_super_admin = (
            hasattr(request.user, "is_super_admin") and request.user.is_super_admin
        )
        if not (request.user.is_superuser or is_super_admin):
            return Response(
                {"error": "Permission denied. Only superusers can download backups."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Get backup directory
        from utils.backup import get_backup_directory

        backup_dir = get_backup_directory()

        # Construct file path
        file_path = backup_dir / filename

        # Security check - ensure file is within backup directory
        if not str(file_path.resolve()).startswith(str(backup_dir.resolve())):
            logger.warning(f"Attempted path traversal attack with filename: {filename}")
            return Response(
                {"error": "Invalid file path"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Check if file exists
        if not file_path.exists():
            logger.warning(f"Attempted to download non-existent file: {filename}")
            raise Http404("Backup file not found")

        # Verify it's actually a backup file (security measure)
        allowed_extensions = {".sql.gz", ".tar.gz", ".sql", ".tar"}
        if not any(filename.endswith(ext) for ext in allowed_extensions):
            return Response(
                {"error": "Invalid file type"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Log the download
        logger.info(f"User {request.user.username} downloading backup: {filename}")

        # Return file response
        response = FileResponse(
            open(file_path, "rb"), as_attachment=True, filename=filename
        )
        response["Content-Disposition"] = (
            f'attachment; filename="{escape_uri_path(filename)}"'
        )
        return response

    except Http404:
        return Response(
            {"error": "Backup file not found"}, status=status.HTTP_404_NOT_FOUND
        )
    except PermissionError:
        logger.error(f"Permission error accessing backup file: {filename}")
        return Response(
            {"error": "Permission denied to access backup file"},
            status=status.HTTP_403_FORBIDDEN,
        )
    except Exception as e:
        logger.error(f"Error downloading backup file {filename}: {e}", exc_info=True)
        return Response(
            {"error": "Failed to download backup file"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def backup_task_status(request, task_id):
    """Get the status of a backup task."""
    try:
        # Check if user is admin or staff
        is_admin = hasattr(request.user, "is_admin") and request.user.is_admin
        if not (request.user.is_staff or is_admin):
            return Response(
                {"error": "Permission denied. Staff access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Import celery app to check task status
        from celery.result import AsyncResult

        result = AsyncResult(task_id)

        response_data = {
            "task_id": task_id,
            "status": result.status,
            "ready": result.ready(),
        }

        if result.ready():
            if result.successful():
                response_data["result"] = result.result
                response_data["message"] = "Task completed successfully"
            else:
                response_data["error"] = (
                    str(result.info) if result.info else "Task failed"
                )
                response_data["message"] = "Task failed"
        else:
            response_data["message"] = "Task is still running"

        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error getting task status for {task_id}: {e}", exc_info=True)
        return Response(
            {
                "error": "Failed to get task status",
                "details": str(e) if settings.DEBUG else None,
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
