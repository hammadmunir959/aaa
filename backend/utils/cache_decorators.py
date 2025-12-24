from functools import wraps
from django.core.cache import cache
from django.http import HttpResponse
import hashlib
import logging
import json
from django.conf import settings
from rest_framework.response import Response  # Moved to global import

logger = logging.getLogger(__name__)


def cache_page_custom(timeout=300, key_prefix="page"):
    """
    Custom page caching decorator with more control.

    Args:
        timeout: Cache timeout in seconds (default 5 minutes)
        key_prefix: Prefix for cache key

    Usage:
        @cache_page_custom(timeout=600, key_prefix='homepage')
        def home_view(request):
            ...
    """

    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Skip caching for authenticated users or POST requests
            if request.user.is_authenticated or request.method != "GET":
                return view_func(request, *args, **kwargs)

            # Generate cache key based on full URL and query params
            cache_key = f"{key_prefix}:{request.get_full_path()}"

            # Try to get cached response
            try:
                cached_response = cache.get(cache_key)
                if cached_response is not None:
                    logger.debug(f"Cache HIT for {cache_key}")
                    # Add header to indicate cache hit
                    if isinstance(cached_response, HttpResponse):
                        cached_response["X-Cache"] = "HIT"
                        cached_response["X-Cache-Key"] = cache_key
                        return cached_response
            except Exception as e:
                logger.warning(f"Cache get failed for {cache_key}: {e}")

            # Call the view function
            logger.debug(f"Cache MISS for {cache_key}")
            response = view_func(request, *args, **kwargs)

            # Cache successful responses only
            if response.status_code == 200:
                response["X-Cache"] = "MISS"
                response["X-Cache-Key"] = cache_key
                try:
                    cache.set(cache_key, response, timeout)
                    logger.info(f"Cached response for {cache_key} (TTL: {timeout}s)")
                except Exception as e:
                    logger.warning(f"Cache set failed for {cache_key}: {e}")

            return response

        return wrapper

    return decorator


def cache_api_response(timeout=60, key_func=None):
    """
    Cache API responses (JSON) checks for serializable data.

    Args:
        timeout: Cache timeout in seconds (default 1 minute)
        key_func: Function to generate custom cache key
    """
    from rest_framework.response import Response

    def decorator(view_func):
        @wraps(view_func)
        def wrapper(*args, **kwargs):
            # Determine which argument is the request object
            request = None
            if args and hasattr(args[0], "method"):
                request = args[0]
            elif len(args) > 1 and hasattr(args[1], "method"):
                request = args[1]

            # Skip caching for non-GET methods or if request object is missing
            if not request or request.method != "GET":
                return view_func(*args, **kwargs)

            # Generate cache key
            if key_func:
                cache_key = key_func(request, *args, **kwargs)
            else:
                # Default: use request path + query params hash
                # We use the path in clear text to allow pattern-based invalidation (e.g. "api:/api/cms/*")
                path = request.path
                query_hash = hashlib.md5(request.GET.urlencode().encode()).hexdigest()
                cache_key = f"api:{path}:{query_hash}"

            # Try cache
            try:
                cached_packet = cache.get(cache_key)
                if cached_packet is not None:
                    # Check if it's our new dict format or old Response object
                    if isinstance(cached_packet, dict) and "data" in cached_packet:
                        logger.info(f"API Cache HIT for {cache_key}")
                        # Reconstruct Response
                        response = Response(
                            data=cached_packet["data"],
                            status=cached_packet.get("status", 200),
                        )
                        response["X-Cache"] = "HIT"
                        # response['X-Cache-Key'] = cache_key  # Optional debug
                        return response
                    elif hasattr(cached_packet, "data"):
                        # Legacy cache support (if pickling worked previously)
                        logger.info(f"API Cache HIT (Legacy) for {cache_key}")
                        cached_packet["X-Cache"] = "HIT"
                        return cached_packet
            except Exception as e:
                logger.warning(f"API Cache get failed for {cache_key}: {e}")

            # Call view
            logger.info(f"API Cache MISS for {cache_key}")
            response = view_func(*args, **kwargs)

            # Cache successful responses only
            if hasattr(response, "status_code") and response.status_code == 200:
                try:
                    # Store only the data, not the Response object
                    # This avoids "must be rendered" errors and pickling issues
                    cache_packet = {
                        "data": response.data,
                        "status": response.status_code,
                    }
                    cache.set(cache_key, cache_packet, timeout)
                    logger.debug(
                        f"Cached API response for {cache_key} (TTL: {timeout}s)"
                    )
                except Exception as e:
                    logger.warning(f"API Cache set failed for {cache_key}: {e}")

                if hasattr(response, "__setitem__"):
                    response["X-Cache"] = "MISS"

            return response

        return wrapper

    return decorator


def invalidate_cache(key_pattern):
    """
    Invalidate cache keys matching a pattern.

    Args:
        key_pattern: Pattern to match (e.g., 'page:/blog/*' or 'api:vehicle*')

    Returns:
        Number of keys deleted

    Usage:
        from utils.cache_decorators import invalidate_cache
        invalidate_cache('page:/blog/*')  # Clear all blog page caches
        invalidate_cache('api:*')  # Clear all API caches
    """
    try:
        # Try to use Redis scan for efficient pattern matching
        try:
            from django_redis import get_redis_connection

            conn = get_redis_connection("default")

            # Get all keys matching pattern
            # Note: Redis keys might be prefixed by Django (e.g. ":1:" for version 1)
            # But django-redis usually handles the prefix if we use its client?
            # Actually conn.scan_iter scans 'raw' keys. We need to be careful.
            # If we simply use cache.delete_pattern provided by some backends?
            # Standard django cache doesn't have delete_pattern.

            # Assuming standard django-redis setup where keys are stored as is (or we need to match *pattern)
            keys = list(conn.scan_iter(match=key_pattern))

            if keys:
                deleted = conn.delete(*keys)
                logger.info(
                    f"Invalidated {deleted} cache keys matching '{key_pattern}' (Redis)"
                )
                return deleted
        except (ImportError, Exception) as redis_error:
            # Fallback for LocMemCache or if Redis is down/not configured
            # This is expensive as it iterates all keys, but acceptable for dev/fallback
            if hasattr(cache, "_cache"):
                formatted_pattern = key_pattern.replace(
                    "*", ""
                )  # Simple contain check for fallback
                keys_to_delete = []
                for key in list(cache._cache.keys()):
                    # Simple wildcard support: if pattern ends with *, check startswith
                    if key_pattern.endswith("*"):
                        prefix = key_pattern[:-1]
                        if key.startswith(prefix):
                            keys_to_delete.append(key)
                    elif formatted_pattern in key:
                        keys_to_delete.append(key)

                if keys_to_delete:
                    for k in keys_to_delete:
                        cache.delete(k)
                    logger.info(
                        f"Invalidated {len(keys_to_delete)} cache keys matching '{key_pattern}' (LocMem)"
                    )
                    return len(keys_to_delete)

            # If we reached here, we couldn't invalidate
            logger.debug(
                f"Could not invalidate pattern '{key_pattern}' - Backend not supported or Redis failed: {redis_error}"
            )
            return 0

    except Exception as e:
        logger.error(f"Failed to invalidate cache pattern '{key_pattern}': {e}")
        return 0


def cache_queryset(timeout=300, key_prefix="queryset"):
    """
    Cache database queryset results.

    Args:
        timeout: Cache timeout in seconds
        key_prefix: Prefix for cache key

    Usage:
        @cache_queryset(timeout=600, key_prefix='vehicles')
        def get_all_vehicles():
            return Vehicle.objects.all()
    """

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key_raw = f"{key_prefix}:{func.__name__}:{args}:{kwargs}"
            cache_key = f"qs:{hashlib.md5(cache_key_raw.encode()).hexdigest()}"

            # Try cache
            try:
                cached_data = cache.get(cache_key)
                if cached_data is not None:
                    logger.debug(f"Query Cache HIT for {cache_key}")
                    return cached_data
            except Exception as e:
                logger.warning(f"Query Cache get failed for {cache_key}: {e}")

            # Call function
            logger.debug(f"Query Cache MISS for {cache_key}")
            result = func(*args, **kwargs)

            # Cache the result if it exists
            if result is not None:
                # For querysets, convert to list to make it cacheable
                if hasattr(result, "_result_cache"):
                    result = list(result)

                try:
                    cache.set(cache_key, result, timeout)
                    logger.info(f"Cached queryset for {cache_key} (TTL: {timeout}s)")
                except Exception as e:
                    logger.warning(f"Query Cache set failed for {cache_key}: {e}")

            return result

        return wrapper

    return decorator


def clear_all_caches():
    """
    Clear all application caches.

    Usage:
        from utils.cache_decorators import clear_all_caches
        clear_all_caches()
    """
    try:
        cache.clear()
        logger.info("All caches cleared successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to clear caches: {e}")
        return False


def get_cache_stats():
    """
    Get current cache statistics.

    Returns:
        dict with cache stats or None if not available
    """
    try:
        from django_redis import get_redis_connection

        conn = get_redis_connection("default")

        info = conn.info()

        stats = {
            "connected_clients": info.get("connected_clients", 0),
            "used_memory_human": info.get("used_memory_human", "N/A"),
            "used_memory_peak_human": info.get("used_memory_peak_human", "N/A"),
            "total_keys": conn.dbsize(),
            "keyspace_hits": info.get("keyspace_hits", 0),
            "keyspace_misses": info.get("keyspace_misses", 0),
        }

        # Calculate hit rate
        hits = stats["keyspace_hits"]
        misses = stats["keyspace_misses"]
        total = hits + misses

        if total > 0:
            stats["hit_rate"] = round((hits / total) * 100, 2)
        else:
            stats["hit_rate"] = 0.0

        return stats

    except Exception as e:
        logger.error(f"Failed to get cache stats: {e}")
        return None
