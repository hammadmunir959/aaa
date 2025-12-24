import logging
from django.core.cache import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .cache_decorators import invalidate_cache

logger = logging.getLogger(__name__)


def invalidate_cms_cache(sender, instance, **kwargs):
    """
    Invalidate CMS-related cache keys when CMS models are updated.
    """
    try:
        # Invalidate landing page config and general CMS endpoints
        logger.info(f"Invalidating CMS cache due to change in {sender.__name__}")
        # New key format: api:/api/cms/landing-config/:<hash>
        # So we match any key containing /cms/
        # Prepend * to match any key prefix (e.g. pchm:1:)
        invalidate_cache("*api:*cms*")
    except Exception as e:
        logger.error(f"Error invalidating CMS cache: {e}")


def invalidate_theming_cache(sender, instance, **kwargs):
    """
    Invalidate Theming-related cache keys when Theme/Event models are updated.
    """
    try:
        logger.info(f"Invalidating Theming cache due to change in {sender.__name__}")
        # Match any key containing /theming/
        invalidate_cache("*api:*theming*")
    except Exception as e:
        logger.error(f"Error invalidating Theming cache: {e}")
