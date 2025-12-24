from __future__ import annotations

ACTIVITY_ICON_MAP = {
    'login': '🔑',
    'logout': '🚪',
    'create': '➕',
    'update': '✏️',
    'delete': '🗑️',
    'view': '👁️',
    # Notification activity types
    'booking_created': '📋',
    'booking_updated': '✏️',
    'booking_approved': '✅',
    'booking_cancelled': '❌',
    'inquiry_received': '📩',
    'inquiry_assigned': '👤',
    'testimonial_submitted': '⭐',
    'testimonial_approved': '✅',
    'testimonial_rejected': '❌',
    'admin_approved': '👑',
    'admin_suspended': '🚫',
    'backup_completed': '💾',
    'backup_failed': '⚠️',
    'purchase_request': '🛒',
    'system_alert': '🔔',
    'user_action': '👤',
}


def get_activity_icon(activity_type: str) -> str:
    """
    Return a unicode icon that represents the activity type.

    Parameters
    ----------
    activity_type: str
        The stored activity type choice value.
    """
    return ACTIVITY_ICON_MAP.get(activity_type, '📝')

