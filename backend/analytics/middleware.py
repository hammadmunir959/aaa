import uuid
from django.utils import timezone
from django.conf import settings
import logging
from typing import Optional

from accounts.models import User
from .models import ActivityLog, PageView, VisitorSession

logger = logging.getLogger(__name__)

class AnalyticsMiddleware:
    """Middleware to track page views and sessions"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip tracking for API calls, admin, static files or SPA assets
        frontend_assets_prefix = getattr(settings, 'FRONTEND_ASSETS_URL', '/assets/')
        skip_paths = [
            '/api/',
            '/admin/',  # Exclude all admin pages
            '/django-admin/',
            '/super-admin/',  # Exclude super-admin pages
            '/cms/',  # Exclude CMS pages
            '/backup/',  # Exclude backup pages
            '/theming/',  # Exclude theming pages
            '/static/',
            '/media/',
            frontend_assets_prefix if frontend_assets_prefix else None,
        ]
        
        # Check if path should be skipped
        should_skip = False
        for skip_prefix in skip_paths:
            if skip_prefix and request.path.startswith(skip_prefix):
                should_skip = True
                break
        
        # Skip static file extensions
        if not should_skip:
            static_extensions = ['.ico', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.css', '.js', '.woff', '.woff2', '.ttf', '.eot']
            should_skip = any(request.path.lower().endswith(ext) for ext in static_extensions) or 'favicon' in request.path.lower()
        
        # Skip auth routes (login, register, etc.)
        if not should_skip:
            should_skip = request.path.startswith('/auth/')
        
        if should_skip:
            return self.get_response(request)
        
        # Track homepage and all other pages (normalize homepage path)
        page_path = request.path if request.path != '/' else '/home'

        # Get or create session ID
        session_id = request.COOKIES.get('analytics_session')
        
        # Check for session expiration (30 minutes of inactivity)
        if session_id:
            try:
                last_session = VisitorSession.objects.filter(session_id=session_id).first()
                if last_session:
                    time_since_activity = timezone.now() - last_session.last_activity
                    if time_since_activity.total_seconds() > 1800:  # 30 minutes
                        session_id = None  # Force new session
            except Exception:
                session_id = None

        if not session_id:
            session_id = str(uuid.uuid4())
            request.session_was_rotated = True  # Flag to ensure cookie is set

        # Get user info
        user = getattr(request, 'user', None)
        if user is not None and not getattr(user, 'is_authenticated', False):
            user = None

        # Track page view (wrap in try-except to prevent errors from breaking requests)
        try:
            PageView.objects.create(
                page_path=page_path,
                page_title=getattr(request, 'page_title', ''),
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                referrer=request.META.get('HTTP_REFERER', ''),
                session_id=session_id,
                user=user,
            )
        except Exception as e:
            logger.error(f"Failed to create page view: {e}")

        # Update or create session
        now = timezone.now()
        session, created = VisitorSession.objects.get_or_create(
            session_id=session_id,
            defaults={
                'ip_address': self.get_client_ip(request),
                'user_agent': request.META.get('HTTP_USER_AGENT', ''),
                'user': user,
                'first_visit': now,
                'last_activity': now,
                'page_views_count': 1,
            }
        )

        if not created:
            # Calculate session duration (time since first visit)
            # Only update duration if this is logically the same session (which it is, because we filtered expired ones above)
            if session.first_visit:
                duration = int((now - session.first_visit).total_seconds())
                session.duration_seconds = duration
            
            session.last_activity = now
            session.page_views_count += 1
            
            # Update user if they logged in during this session
            if user and not session.user:
                session.user = user
            
            session.save(update_fields=['last_activity', 'page_views_count', 'user', 'duration_seconds'])

        # Add session cookie to response
        response = self.get_response(request)
        if not request.COOKIES.get('analytics_session') or getattr(request, 'session_was_rotated', False):
            response.set_cookie(
                'analytics_session',
                session_id,
                max_age=30*24*60*60,  # 30 days - persistent cookie for returning visitor detection
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax',
            )

        return response

    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class AdminActivityMiddleware:
    """Automatically capture admin CRUD actions across API endpoints."""

    TRACKED_METHODS = {'POST', 'PUT', 'PATCH', 'DELETE'}
    METHOD_ACTIVITY_MAP = {
        'POST': 'create',
        'PUT': 'update',
        'PATCH': 'update',
        'DELETE': 'delete',
    }
    METHOD_VERB_MAP = {
        'POST': 'Created',
        'PUT': 'Updated',
        'PATCH': 'Updated',
        'DELETE': 'Deleted',
    }

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        try:
            self._log_activity(request, response)
        except Exception:  # pragma: no cover - logging must never break requests
            logger.exception("Failed to auto-log admin activity for path %s", request.path)
        return response

    def _log_activity(self, request, response):
        if request.method not in self.TRACKED_METHODS:
            return

        if response.status_code >= 400:
            return

        if not request.path.startswith('/api/'):
            return

        user = getattr(request, 'user', None)
        if not self._is_trackable_user(user):
            return

        activity_type = self.METHOD_ACTIVITY_MAP.get(request.method)
        if not activity_type:
            return

        description = self._build_description(request)
        ActivityLog.objects.create(
            user=user,
            activity_type=activity_type,
            description=description,
            ip_address=self._get_client_ip(request),
        )

    @staticmethod
    def _is_trackable_user(user: Optional[User]) -> bool:
        return bool(
            user
            and getattr(user, 'is_authenticated', False)
            and getattr(user, 'admin_type', None) in {User.ROLE_ADMIN, User.ROLE_SUPER_ADMIN}
            and getattr(user, 'status', None) == User.STATUS_ACTIVE
        )

    def _build_description(self, request) -> str:
        resolver = getattr(request, 'resolver_match', None)
        base_label = None
        object_id = None

        if resolver:
            base_label = self._humanize_label(resolver.view_name)
            object_id = resolver.kwargs.get('pk') or resolver.kwargs.get('id')

        if not base_label:
            base_label = self._label_from_path(request.path)

        verb = self.METHOD_VERB_MAP.get(request.method, 'Updated')
        description = f"{verb} {base_label}".strip()

        if object_id:
            description = f"{description} (ID {object_id})"

        return description

    @staticmethod
    def _humanize_label(view_name: Optional[str]) -> Optional[str]:
        if not view_name:
            return None
        label = view_name.split(':')[-1]
        label = label.replace('-', ' ').replace('_', ' ')
        return label.strip().title() if label else None

    @staticmethod
    def _label_from_path(path: str) -> str:
        stripped = path.strip('/').split('/')
        if stripped and stripped[0] == 'api':
            stripped = stripped[1:]
        segment = stripped[0] if stripped else 'resource'
        return segment.replace('-', ' ').replace('_', ' ').title() or 'Resource'

    @staticmethod
    def _get_client_ip(request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR', '')
