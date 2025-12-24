from django.utils import timezone
from django.core.cache import cache
from django.conf import settings
from datetime import date
from config.themes import THEMES
from theming.models import Event, Theme

CACHE_KEY_PREFIX = "active_theme"
CACHE_TTL = 300  # 5 minutes


def _today_local_date():
    """Get today's date in the local timezone."""
    return timezone.localtime(timezone.now()).date()


def get_active_event(now_date=None):
    """
    Get the active event for a given date.
    Returns None if no event is active.
    """
    if now_date is None:
        now_date = _today_local_date()
    
    # Check cache first
    cache_key = f"{CACHE_KEY_PREFIX}_event_{now_date.isoformat()}"
    cached_event = cache.get(cache_key)
    if cached_event is not None:
        return cached_event
    
    # Query active events
    qs = Event.objects.filter(active=True)
    candidates = []
    
    for ev in qs:
        if ev.recurring_yearly:
            # Map this year's start/end with year replaced to now_date.year
            # Handle year wrapping for events crossing year boundary if needed (simplified for now)
            try:
                start = ev.start_date.replace(year=now_date.year)
                end = ev.end_date.replace(year=now_date.year)
            except ValueError:
                # Handle leap year case (Feb 29)
                start = ev.start_date.replace(year=now_date.year, day=28)
                end = ev.end_date.replace(year=now_date.year, day=28)
        else:
            start, end = ev.start_date, ev.end_date
        
        # Calculate effective start date (including pre-activation period)
        from datetime import timedelta
        effective_start = start - timedelta(days=ev.pre_activate_days)
        
        if effective_start <= now_date <= end:
            candidates.append(ev)
    
    # Pick highest priority, then earliest start
    if not candidates:
        cache.set(cache_key, None, CACHE_TTL)
        return None
    
    chosen = sorted(candidates, key=lambda e: (-e.priority, e.start_date))[0]
    cache.set(cache_key, chosen, CACHE_TTL)
    return chosen


def get_active_theme(request=None):
    """
    Get the active theme configuration.
    Returns a dict with theme_key, theme config, and event info.
    
    Args:
        request: Optional Django request object for preview mode support
    """
    # Check if theming is enabled
DEFAULT_THEME = {
    "name": "Default",
    "scrolling_message": "",
    "scrolling_background_color": "#000000",
}


def get_active_theme(request=None):
    """
    Get the active theme configuration.
    Returns a dict with theme_key, theme config, and event info.
    
    Args:
        request: Optional Django request object for preview mode support
    """
    # Check if theming is enabled
    if not getattr(settings, 'THEMING_ENABLED', True):
        return {
            "theme_key": "default",
            "theme": DEFAULT_THEME,
            "event": None
        }
    
    # Check for preview theme in session (for admin preview mode)
    if request and hasattr(request, 'session'):
        preview_theme = request.session.get('preview_theme')
        if preview_theme:
            # Try to get theme from database
            try:
                db_theme = Theme.objects.get(key=preview_theme)
                theme_data = db_theme.to_dict()
                return {
                    "theme_key": preview_theme,
                    "theme": theme_data,
                    "event": None,
                    "preview": True
                }
            except Theme.DoesNotExist:
                # If preview theme key is not found in DB, fallback to default
                pass
    
    today = _today_local_date()
    event = get_active_event(today)
    
    if event:
        theme_key = event.theme_key
    else:
        # Check for user-selected active theme
        active_theme = Theme.objects.filter(is_active=True).first()
        if active_theme:
            theme_key = active_theme.key
        else:
            theme_key = "default"
    
    # Try to get theme from database
    try:
        db_theme = Theme.objects.get(key=theme_key)
        theme_data = db_theme.to_dict()
    except Theme.DoesNotExist:
        # Fallback to default
        theme_data = DEFAULT_THEME
        theme_key = "default"
    
    return {
        "theme_key": theme_key,
        "theme": theme_data,
        "event": {
            "name": event.name if event else None,
            "slug": event.slug if event else None,
        } if event else None
    }

