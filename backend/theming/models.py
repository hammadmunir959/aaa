import json

from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from django.db import models


class Theme(models.Model):
    """Custom theme configuration stored in database"""

    key = models.SlugField(
        max_length=120,
        unique=True,
        help_text="Unique identifier for the theme (e.g., 'summer_2024')",
    )
    name = models.CharField(max_length=200, help_text="Display name for the theme")
    # Scrolling banner message configuration
    scrolling_message = models.CharField(
        max_length=500,
        blank=True,
        default="",
        help_text="Message to display in the scrolling banner at the top of the homepage",
    )
    scrolling_background_color = models.CharField(
        max_length=7,
        default="#000000",
        help_text="Background color for the scrolling banner in hex format",
    )

    is_custom = models.BooleanField(
        default=True,
        help_text="True for user-created themes, False for system defaults",
    )
    is_active = models.BooleanField(
        default=False,
        help_text="If set, this theme will be used globally as default (unless an event overrides it)",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Theme"
        verbose_name_plural = "Themes"

    def save(self, *args, **kwargs):
        if self.is_active:
            # Deselect all others
            Theme.objects.filter(is_active=True).exclude(pk=self.pk).update(
                is_active=False
            )
        super().save(*args, **kwargs)

    # This replacement is actually for NEXT step, I am just acknowledging I need to check them.
    # For now, I will skip editing this file as `ThemeDetailSerializer` delegates to `to_dict` which I already updated in `models.py`.
    # Wait, I updated `models.py` but I didn't verify `views.py`.
    # I will construct a `view_file` call instead.

    def to_dict(self):
        return {
            "name": self.name,
            "scrolling_message": self.scrolling_message,
            "scrolling_background_color": self.scrolling_background_color,
        }

    def __str__(self):
        return f"{self.name} ({self.key})"


class Event(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=120, unique=True)
    start_date = models.DateField()
    end_date = models.DateField()
    theme_key = models.CharField(
        max_length=120,
        help_text="Theme key (can be from predefined themes or custom themes)",
    )
    priority = models.IntegerField(
        default=0, help_text="Higher priority runs when events overlap"
    )
    active = models.BooleanField(default=True)
    recurring_yearly = models.BooleanField(
        default=False, help_text="If true, treat as recurring each year"
    )
    pre_activate_days = models.IntegerField(
        default=0,
        help_text="Number of days before start_date to automatically activate this theme",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-priority", "start_date"]
        verbose_name = "Event"
        verbose_name_plural = "Events"

    def clean(self):
        if self.end_date < self.start_date:
            raise ValidationError("end_date must be same or after start_date")

    @property
    def theme(self):
        """Backward compatibility property"""
        return self.theme_key

    def __str__(self):
        return f"{self.name} ({self.start_date} → {self.end_date})"
