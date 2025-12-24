"""
Serializers for backup management API.
"""

from rest_framework import serializers


class BackupCreateSerializer(serializers.Serializer):
    """Serializer for backup creation requests."""

    type = serializers.ChoiceField(
        choices=["database", "media", "full"],
        default="full",
        help_text="Type of backup to create",
    )


class BackupVerifySerializer(serializers.Serializer):
    """Serializer for backup verification requests."""

    path = serializers.CharField(
        max_length=500, help_text="Path to the backup file to verify"
    )


class BackupCleanupSerializer(serializers.Serializer):
    """Serializer for backup cleanup requests."""

    days = serializers.IntegerField(
        default=30, min_value=1, help_text="Number of days to retain backups"
    )


class BackupFileSerializer(serializers.Serializer):
    """Serializer for backup file information."""

    filename = serializers.CharField()
    path = serializers.CharField()
    size = serializers.IntegerField()
    created = serializers.DateTimeField()
    type = serializers.ChoiceField(choices=["database", "media", "full", "unknown"])


class BackupStatsSerializer(serializers.Serializer):
    """Serializer for backup statistics."""

    total_backups = serializers.IntegerField()
    total_size_bytes = serializers.IntegerField()
    total_size_mb = serializers.FloatField()
    backup_directory = serializers.CharField()
    oldest_backup = serializers.DateTimeField(allow_null=True)
    newest_backup = serializers.DateTimeField(allow_null=True)
    backups_by_type = serializers.DictField()


class BackupConfigSerializer(serializers.Serializer):
    """Serializer for backup configuration."""

    enabled = serializers.BooleanField()
    retention_days = serializers.IntegerField()
    storage = serializers.CharField()
    schedule_hour = serializers.IntegerField()
    backup_directory = serializers.CharField()


class BackupCreateResponseSerializer(serializers.Serializer):
    """Serializer for backup creation response."""

    message = serializers.CharField()
    task_id = serializers.CharField()
    type = serializers.ChoiceField(choices=["database", "media", "full"])


class BackupVerifyResponseSerializer(serializers.Serializer):
    """Serializer for backup verification response."""

    path = serializers.CharField()
    valid = serializers.BooleanField()
    message = serializers.CharField()


class BackupCleanupResponseSerializer(serializers.Serializer):
    """Serializer for backup cleanup response."""

    message = serializers.CharField()
    deleted_count = serializers.IntegerField()
    retention_days = serializers.IntegerField()
