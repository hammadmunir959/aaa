from django.apps import AppConfig


class CmsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "cms"

    def ready(self):
        from django.db.models.signals import post_delete, post_save

        from utils.cache_invalidation import invalidate_cms_cache

        # dynamic import to avoid AppRegistryNotReady
        try:
            from .models import LandingPageConfig, TeamMember

            # Register signals
            for model in [LandingPageConfig, TeamMember]:
                post_save.connect(invalidate_cms_cache, sender=model)
                post_delete.connect(invalidate_cms_cache, sender=model)
        except ImportError:
            pass
