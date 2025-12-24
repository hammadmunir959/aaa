from django.core.cache import cache

from utils.cache import get_cache_key


DASHBOARD_SUMMARY_CACHE_PREFIX = "dashboard_summary"
BOOKING_TRENDS_CACHE_PREFIX = "booking_trends"


def invalidate_dashboard_summary_cache() -> None:
    """Clear cached dashboard summary data."""
    cache.delete(get_cache_key(DASHBOARD_SUMMARY_CACHE_PREFIX))


def invalidate_booking_trends_cache() -> None:
    """Clear cached booking trends data."""
    cache.delete(get_cache_key(BOOKING_TRENDS_CACHE_PREFIX))

