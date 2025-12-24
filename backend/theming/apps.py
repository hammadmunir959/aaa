from django.apps import AppConfig


class ThemingConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "theming"

    def ready(self):
        from django.db.models.signals import post_delete, post_save

        import theming.signals  # noqa
        from utils.cache_invalidation import invalidate_theming_cache

        try:
            from .models import Event, Theme

            # Register signals
            for model in [Theme, Event]:
                post_save.connect(invalidate_theming_cache, sender=model)
                post_delete.connect(invalidate_theming_cache, sender=model)
        except ImportError:
            pass
