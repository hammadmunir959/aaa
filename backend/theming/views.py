import logging

from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_http_methods
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from config.themes import THEMES
from theming.models import Event, Theme
from theming.serializers import (
    EventModelSerializer,
    ThemeDetailSerializer,
    ThemeModelSerializer,
)
from theming.services.theme_resolver import get_active_theme

logger = logging.getLogger(__name__)


def _is_admin_user(user):
    """Check if user is admin/staff"""
    if not user or not hasattr(user, "is_authenticated") or not user.is_authenticated:
        return False
    if hasattr(user, "is_staff") and user.is_staff:
        return True
    if hasattr(user, "is_superuser") and user.is_superuser:
        return True
    if hasattr(user, "admin_type") and user.admin_type in ["admin", "super_admin"]:
        return True
    if hasattr(user, "is_admin") and user.is_admin:
        return True
    return False


def _authenticate_request(request):
    """Authenticate request and return user"""
    from rest_framework.authentication import SessionAuthentication
    from rest_framework_simplejwt.authentication import JWTAuthentication

    user = None
    auth_header = request.headers.get("Authorization", "")

    if auth_header.startswith("Bearer "):
        jwt_auth = JWTAuthentication()
        try:
            token = auth_header.split(" ")[1]
            validated_token = jwt_auth.get_validated_token(token)
            user = jwt_auth.get_user(validated_token)
        except Exception:
            pass

    if not user:
        session_auth = SessionAuthentication()
        try:
            user_tuple = session_auth.authenticate(request)
            if user_tuple:
                user = user_tuple[0]
        except Exception:
            pass

    return user


@extend_schema(
    summary="Get active theme",
    description="Returns the currently active theme based on date and events",
    tags=["Theming"],
)
@api_view(["GET"])
@permission_classes([AllowAny])
def active_theme_api(request):
    """API endpoint to get the currently active theme."""
    theme_data = get_active_theme(request)
    response = Response(theme_data)
    # Prevent browser caching
    response["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response["Pragma"] = "no-cache"
    response["Expires"] = "0"
    return response


@staff_member_required
def theme_selector(request):
    """Admin page for selecting and previewing themes."""
    current_theme = get_active_theme(request)
    preview_theme = request.session.get("preview_theme")

    if request.method == "POST":
        action = request.POST.get("action")

        if action == "set_preview":
            theme_key = request.POST.get("theme_key")
            if Theme.objects.filter(key=theme_key).exists():
                request.session["preview_theme"] = theme_key
                messages.success(request, f"Preview mode enabled.")
            else:
                messages.error(request, "Invalid theme selected.")
            return redirect("admin:theming_theme_selector")

        elif action == "clear_preview":
            if "preview_theme" in request.session:
                del request.session["preview_theme"]
                messages.success(
                    request, "Preview mode disabled. Active theme will be used."
                )
            return redirect("admin:theming_theme_selector")

    context = {
        "themes": Theme.objects.values("key", "name"),
        "current_theme": current_theme,
        "preview_theme": preview_theme,
        "title": "Theme Selector",
    }

    return render(request, "admin/theming/theme_selector.html", context)


@staff_member_required
@require_http_methods(["POST"])
def preview_theme(request):
    """API endpoint to set preview theme via POST."""
    theme_key = request.POST.get("theme_key")

    if theme_key and Theme.objects.filter(key=theme_key).exists():
        request.session["preview_theme"] = theme_key
        messages.success(request, f"Preview mode enabled.")
    elif theme_key == "":
        if "preview_theme" in request.session:
            del request.session["preview_theme"]
        messages.success(request, "Preview mode disabled.")
    else:
        messages.error(request, "Invalid theme selected.")

    return redirect(request.POST.get("next", "admin:theming_theme_selector"))


@extend_schema(
    summary="Set preview theme",
    description="Set a preview theme for admin users (requires staff/admin access)",
    tags=["Theming"],
)
@api_view(["POST"])
@permission_classes([AllowAny])  # We'll check auth manually
def preview_theme_api(request):
    """API endpoint to set preview theme for admin users."""
    import logging

    from rest_framework import status
    from rest_framework.authentication import SessionAuthentication
    from rest_framework.response import Response
    from rest_framework_simplejwt.authentication import JWTAuthentication

    logger = logging.getLogger(__name__)

    # Try to authenticate using JWT first (from Bearer token)
    user = None
    auth_header = request.headers.get("Authorization", "")

    if auth_header.startswith("Bearer "):
        # JWT authentication
        jwt_auth = JWTAuthentication()
        try:
            token = auth_header.split(" ")[1]
            validated_token = jwt_auth.get_validated_token(token)
            user = jwt_auth.get_user(validated_token)
            logger.debug(
                f"JWT authentication successful for user: {user.email if hasattr(user, 'email') else 'unknown'}"
            )
        except Exception as e:
            logger.debug(f"JWT authentication failed: {str(e)}")

    # Try session authentication if JWT didn't work
    if not user:
        session_auth = SessionAuthentication()
        try:
            user_tuple = session_auth.authenticate(request)
            if user_tuple:
                user = user_tuple[0]
                logger.debug(
                    f"Session authentication successful for user: {user.email if hasattr(user, 'email') else 'unknown'}"
                )
        except Exception as e:
            logger.debug(f"Session authentication failed: {str(e)}")

    # Check if user is authenticated and is staff/admin
    if not user:
        logger.warning("No user found in request")
        return Response(
            {"error": "Authentication required. Please log in."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if not hasattr(user, "is_authenticated") or not user.is_authenticated:
        logger.warning(
            f"User {user.email if hasattr(user, 'email') else 'unknown'} is not authenticated"
        )
        return Response(
            {"error": "Authentication required. Please log in."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    # Check if user is staff/admin using both Django's is_staff/is_superuser
    # and the custom admin_type field
    is_admin = False
    if hasattr(user, "is_staff") and user.is_staff:
        is_admin = True
    if hasattr(user, "is_superuser") and user.is_superuser:
        is_admin = True
    if hasattr(user, "admin_type") and user.admin_type in ["admin", "super_admin"]:
        is_admin = True
    if hasattr(user, "is_admin") and user.is_admin:  # Property method
        is_admin = True

    if not is_admin:
        logger.warning(
            f"User {user.email if hasattr(user, 'email') else 'unknown'} is not staff/admin. admin_type: {getattr(user, 'admin_type', 'None')}, is_staff: {getattr(user, 'is_staff', 'None')}, is_superuser: {getattr(user, 'is_superuser', 'None')}"
        )
        return Response(
            {"error": "Staff/admin access required."}, status=status.HTTP_403_FORBIDDEN
        )

    theme_key = request.data.get("theme_key")

    # Check database themes
    theme_exists = False
    theme_name = None

    if theme_key:
        try:
            db_theme = Theme.objects.get(key=theme_key)
            theme_exists = True
            theme_name = db_theme.name
        except Theme.DoesNotExist:
            pass

    if theme_key and theme_exists:
        request.session["preview_theme"] = theme_key
        return Response(
            {
                "success": True,
                "message": f'Preview mode enabled for "{theme_name}" theme.',
                "theme_key": theme_key,
            }
        )
    elif theme_key == "" or theme_key is None:
        if "preview_theme" in request.session:
            del request.session["preview_theme"]
        return Response(
            {"success": True, "message": "Preview mode disabled.", "theme_key": None}
        )
    else:
        return Response(
            {"error": "Invalid theme selected."}, status=status.HTTP_400_BAD_REQUEST
        )


@extend_schema(
    summary="List all themes or create theme",
    description="Get list of all themes (predefined and custom) or create a new theme",
    tags=["Theming"],
)
@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def list_themes_api(request):
    """List all themes including predefined and custom themes, or create a new theme"""
    if request.method == "POST":
        # Create new theme
        user = _authenticate_request(request)
        if not _is_admin_user(user):
            return Response(
                {"error": "Staff/admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = ThemeModelSerializer(data=request.data)
        if serializer.is_valid():
            theme = serializer.save(is_custom=True)
            return Response(
                {
                    "key": theme.key,
                    "name": theme.name,
                    "config": theme.to_dict(),
                    "is_custom": True,
                    "is_active": theme.is_active,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # GET - List all themes
    custom_themes = Theme.objects.all()
    custom_theme_list = []
    for theme in custom_themes:
        custom_theme_list.append(
            {
                "key": theme.key,
                "name": theme.name,
                "config": theme.to_dict(),
                "is_custom": theme.is_custom,
                "is_active": theme.is_active,
            }
        )

    return Response(custom_theme_list)


@extend_schema(
    summary="Get or update theme",
    description="Get a specific theme by key or update it",
    tags=["Theming"],
)
@api_view(["GET", "PATCH", "PUT"])
@permission_classes([AllowAny])
def get_theme_api(request, theme_key):
    """Get or update a specific theme"""
    if request.method in ["PATCH", "PUT"]:
        # Update theme
        user = _authenticate_request(request)
        if not _is_admin_user(user):
            return Response(
                {"error": "Staff/admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            theme = Theme.objects.get(key=theme_key)
        except Theme.DoesNotExist:
            return Response(
                {"error": f'Theme with key "{theme_key}" not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ThemeModelSerializer(theme, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "key": theme.key,
                    "name": theme.name,
                    "config": theme.to_dict(),
                    "is_custom": theme.is_custom,
                    "is_active": theme.is_active,
                }
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # GET - Get a specific theme
    # Try database themes
    try:
        theme = Theme.objects.get(key=theme_key)
        return Response(
            {
                "key": theme.key,
                "name": theme.name,
                "config": theme.to_dict(),
                "is_custom": True,
                "is_active": theme.is_active,
            }
        )
    except Theme.DoesNotExist:
        return Response(
            {"error": f'Theme with key "{theme_key}" not found.'},
            status=status.HTTP_404_NOT_FOUND,
        )


@extend_schema(
    summary="List theme events or create event",
    description="Get list of all theme events or create a new event",
    tags=["Theming"],
)
@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def list_events_api(request):
    """List all theme events or create a new event"""
    if request.method == "POST":
        # Create new event
        user = _authenticate_request(request)
        if not _is_admin_user(user):
            return Response(
                {"error": "Staff/admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = EventModelSerializer(data=request.data)
        if serializer.is_valid():
            event = serializer.save()
            return Response(
                EventModelSerializer(event).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # GET - List all events
    events = Event.objects.all()
    serializer = EventModelSerializer(events, many=True)
    return Response(serializer.data)


@extend_schema(
    summary="Update or delete theme event",
    description="Update or delete a theme event (admin only)",
    tags=["Theming"],
)
@api_view(["PATCH", "DELETE"])
@permission_classes([AllowAny])
def update_event_api(request, event_id):
    """Update or delete a theme event"""
    user = _authenticate_request(request)
    if not _is_admin_user(user):
        return Response(
            {"error": "Staff/admin access required."}, status=status.HTTP_403_FORBIDDEN
        )

    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response(
            {"error": f"Event with id {event_id} not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "DELETE":
        event.delete()
        return Response({"success": True, "message": "Event deleted successfully."})

    # PATCH - Update
    serializer = EventModelSerializer(event, data=request.data, partial=True)
    if serializer.is_valid():
        event = serializer.save()
        return Response(EventModelSerializer(event).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
