from rest_framework import serializers

from .models import ActivityLog
from .utils import get_activity_icon


class ActivityLogSerializer(serializers.ModelSerializer):
    """API representation for activity log entries."""

    activity_label = serializers.CharField(source='get_activity_type_display', read_only=True)
    timestamp = serializers.DateTimeField(source='created_at', read_only=True)
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    icon = serializers.SerializerMethodField()
    text = serializers.CharField(source='description', read_only=True)  # Alias for backward compatibility

    class Meta:
        model = ActivityLog
        fields = [
            'id',
            'activity_type',
            'activity_label',
            'description',
            'text',  # Alias for description
            'timestamp',
            'user_name',
            'user_email',
            'ip_address',
            'icon',
            # Notification fields
            'is_read',
            'read_at',
            'notification_type',
            'priority',
            'action_url',
            'recipient',
        ]

    @staticmethod
    def _get_user_display(user):
        if not user:
            return None
        full_name = user.get_full_name()
        return full_name or user.email or user.username

    def get_user_name(self, obj):
        return self._get_user_display(obj.user) or "System"

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None

    def get_icon(self, obj):
        return get_activity_icon(obj.activity_type)


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for notifications (ActivityLog entries with recipient)."""
    
    activity_label = serializers.CharField(source='get_activity_type_display', read_only=True)
    notification_type_label = serializers.CharField(source='get_notification_type_display', read_only=True)
    priority_label = serializers.CharField(source='get_priority_display', read_only=True)
    timestamp = serializers.DateTimeField(source='created_at', read_only=True)
    user_name = serializers.SerializerMethodField()
    icon = serializers.SerializerMethodField()

    class Meta:
        model = ActivityLog
        fields = [
            'id',
            'activity_type',
            'activity_label',
            'description',
            'timestamp',
            'user_name',
            'icon',
            'is_read',
            'read_at',
            'notification_type',
            'notification_type_label',
            'priority',
            'priority_label',
            'action_url',
        ]

    def get_user_name(self, obj):
        if not obj.user:
            return "System"
        full_name = obj.user.get_full_name()
        return full_name or obj.user.email or obj.user.username

    def get_icon(self, obj):
        return get_activity_icon(obj.activity_type)

