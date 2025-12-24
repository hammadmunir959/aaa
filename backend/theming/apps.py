from django.apps import AppConfig


class ThemingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'theming'
    
    def ready(self):
        import theming.signals  # noqa
        
        from django.db.models.signals import post_save, post_delete
        from utils.cache_invalidation import invalidate_theming_cache
        
        try:
            from .models import Theme, Event
            
            # Register signals
            for model in [Theme, Event]:
                post_save.connect(invalidate_theming_cache, sender=model)
                post_delete.connect(invalidate_theming_cache, sender=model)
        except ImportError:
            pass