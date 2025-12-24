"""
Helper service for creating notifications (ActivityLog entries with recipient).
"""
from typing import Optional
from django.contrib.contenttypes.models import ContentType
from .models import ActivityLog
from accounts.models import User


def create_notification(
    recipient: User,
    activity_type: str,
    description: str,
    actor_user: Optional[User] = None,
    notification_type: str = 'info',
    priority: str = 'medium',
    action_url: Optional[str] = None,
    content_object=None,
    expires_at=None,
) -> ActivityLog:
    """
    Create a notification (ActivityLog entry with recipient).
    
    Args:
        recipient: User who should receive the notification
        activity_type: Type of activity (from ActivityLog.ACTIVITY_TYPES)
        description: Description of the activity/notification
        actor_user: User who performed the action (optional)
        notification_type: Visual type ('info', 'success', 'warning', 'error')
        priority: Priority level ('low', 'medium', 'high', 'urgent')
        action_url: URL to navigate to when clicked
        content_object: Related object (GenericForeignKey)
        expires_at: Optional expiration datetime
        
    Returns:
        Created ActivityLog instance
    """
    content_type = None
    object_id = None
    
    if content_object:
        content_type = ContentType.objects.get_for_model(content_object)
        object_id = content_object.pk
    
    notification = ActivityLog.objects.create(
        user=actor_user,
        recipient=recipient,
        activity_type=activity_type,
        description=description,
        notification_type=notification_type,
        priority=priority,
        action_url=action_url or '',
        content_type=content_type,
        object_id=object_id,
        expires_at=expires_at,
    )
    
    return notification


def create_notification_for_admins(
    activity_type: str,
    description: str,
    actor_user: Optional[User] = None,
    notification_type: str = 'info',
    priority: str = 'medium',
    action_url: Optional[str] = None,
    content_object=None,
    admin_types: Optional[list] = None,
) -> list[ActivityLog]:
    """
    Create notifications for all admin users.
    
    Args:
        activity_type: Type of activity
        description: Description of the activity
        actor_user: User who performed the action
        notification_type: Visual type
        priority: Priority level
        action_url: URL to navigate to
        content_object: Related object
        admin_types: List of admin types to notify (None = all admins)
        
    Returns:
        List of created ActivityLog instances
    """
    from accounts.models import User
    
    if admin_types is None:
        admin_types = [User.ROLE_ADMIN, User.ROLE_SUPER_ADMIN]
    
    admins = User.objects.filter(
        admin_type__in=admin_types,
        status=User.STATUS_ACTIVE
    )
    
    notifications = []
    for admin in admins:
        notification = create_notification(
            recipient=admin,
            activity_type=activity_type,
            description=description,
            actor_user=actor_user,
            notification_type=notification_type,
            priority=priority,
            action_url=action_url,
            content_object=content_object,
        )
        notifications.append(notification)
    
    return notifications

