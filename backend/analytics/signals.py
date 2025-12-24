from django.db.models.signals import post_delete, post_save

from bookings.models import Claim
from car_sales.models import CarListing, CarPurchaseRequest
from faq.models import FAQ
from gallery.models import GalleryImage
from newsletter.models import NewsletterSubscriber
from testimonials.models import Testimonial
from vehicles.models import Vehicle

from .cache import (
    BOOKING_TRENDS_CACHE_PREFIX,
    DASHBOARD_SUMMARY_CACHE_PREFIX,
    invalidate_booking_trends_cache,
    invalidate_dashboard_summary_cache,
)


SUMMARY_MODELS = [
    Vehicle,
    Claim,
    Testimonial,
    CarListing,
    CarPurchaseRequest,
    GalleryImage,
    NewsletterSubscriber,
    FAQ,
]

BOOKING_TREND_MODELS = [Claim, CarPurchaseRequest]


def _invalidate_summary_cache(sender, **kwargs):
    """Invalidate the cached dashboard summary when key models change."""
    invalidate_dashboard_summary_cache()


def _invalidate_booking_trends_cache(sender, **kwargs):
    """Invalidate the cached booking trends when relevant models change."""
    invalidate_booking_trends_cache()


def _connect_signals(models, handler, suffix):
    for model in models:
        post_save.connect(
            handler,
            sender=model,
            weak=False,
            dispatch_uid=f"{model.__name__}_{suffix}_post_save",
        )
        post_delete.connect(
            handler,
            sender=model,
            weak=False,
            dispatch_uid=f"{model.__name__}_{suffix}_post_delete",
        )


_connect_signals(
    SUMMARY_MODELS, _invalidate_summary_cache, DASHBOARD_SUMMARY_CACHE_PREFIX
)
_connect_signals(
    BOOKING_TREND_MODELS, _invalidate_booking_trends_cache, BOOKING_TRENDS_CACHE_PREFIX
)
