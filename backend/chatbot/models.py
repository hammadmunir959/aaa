from django.db import models
from django.contrib.postgres.indexes import GinIndex
from django.core.exceptions import ValidationError
from django.utils import timezone
import uuid


class ChatbotContext(models.Model):
    """Context sections for chatbot to classify intents and generate responses"""

    SECTION_CHOICES = [
        ("intro", "Chatbot Introduction"),
        ("company", "Company Information"),
        ("services", "Services Overview"),
        ("working", "How We Work"),
        ("faqs", "Frequently Asked Questions"),
        ("pricing", "Pricing Information"),
        ("contact", "Contact Details"),
        ("policies", "Company Policies"),
        ("emergency", "Emergency Services"),
    ]

    section = models.CharField(max_length=20, choices=SECTION_CHOICES, unique=True)
    title = models.CharField(max_length=200)
    content = models.TextField(help_text="Detailed context content for this section")
    keywords = models.TextField(
        blank=True, help_text="Comma-separated keywords for intent classification"
    )
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, blank=True
    )

    class Meta:
        ordering = ["display_order", "section"]
        verbose_name = "Chatbot Context"
        verbose_name_plural = "Chatbot Contexts"

    def __str__(self):
        return f"{self.get_section_display()} - {self.title}"

    def get_keywords_list(self):
        """Return keywords as a list"""
        if not self.keywords:
            return []
        return [k.strip().lower() for k in self.keywords.split(",") if k.strip()]


class Conversation(models.Model):
    """Enhanced chatbot conversation session"""

    STATUS_CHOICES = [
        ("active", "Active"),
        ("completed", "Completed"),
        ("manual", "Manual Reply Active"),
    ]

    session_id = models.CharField(max_length=200, unique=True, default=uuid.uuid4)
    user_email = models.EmailField(null=True, blank=True)
    user_name = models.CharField(max_length=200, blank=True)
    user_phone = models.CharField(max_length=20, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    is_lead = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    manual_reply_active = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    last_activity = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-started_at"]
        indexes = [
            models.Index(fields=["status", "-started_at"]),
            models.Index(fields=["session_id"]),
            models.Index(fields=["ip_address"]),
            models.Index(fields=["is_lead", "-started_at"]),
        ]

    def __str__(self):
        return (
            f"Conversation {self.id} - {self.session_id} ({self.get_status_display()})"
        )

    @property
    def duration(self):
        """Calculate conversation duration in minutes"""
        if not self.ended_at:
            return None
        return (self.ended_at - self.started_at).total_seconds() / 60

    @property
    def lead_score(self):
        """Get lead score from contact info"""
        try:
            contact = self.contact_info
        except ContactInfo.DoesNotExist:
            return 0
        return contact.lead_score

    def mark_completed(self):
        """Mark conversation as completed (only called automatically)"""
        from django.utils import timezone

        if self.status != "completed":
            self.status = "completed"
            self.ended_at = timezone.now()
            self.manual_reply_active = False  # Deactivate manual mode when completed
            self.save()

    def activate_manual_reply(self):
        """Activate manual reply mode (only for active conversations)"""
        if self.status == "active":
            self.manual_reply_active = True
            self.save()

    def deactivate_manual_reply(self):
        """Deactivate manual reply mode"""
        if self.status == "active":
            self.manual_reply_active = False
            self.save()

    def check_and_mark_completed(self):
        """
        Check if conversation should be auto-completed based on inactivity.
        Complete conversations after 2 minutes of inactivity to improve UX and reduce polling.
        """
        from django.utils import timezone
        from datetime import timedelta

        # Already completed
        if self.status == "completed":
            return False

        # Complete conversation if inactive for more than 2 minutes
        if self.last_activity and (timezone.now() - self.last_activity) > timedelta(
            minutes=2
        ):
            self.status = "completed"
            self.ended_at = timezone.now()
            self.save(update_fields=["status", "ended_at"])
            return True

        # Don't auto-complete active conversations
        return False


class ConversationMessage(models.Model):
    """Individual messages in a conversation"""

    MESSAGE_TYPES = [
        ("user", "User Message"),
        ("assistant", "Assistant Message (AI)"),
        ("admin", "Admin Message (Manual)"),
    ]

    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name="messages"
    )
    message_type = models.CharField(
        max_length=20, choices=MESSAGE_TYPES, default="user"
    )
    content = models.TextField()
    response_time_ms = models.IntegerField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_admin_reply = models.BooleanField(
        default=False, help_text="True if this is a manual admin reply"
    )

    class Meta:
        ordering = ["timestamp"]
        indexes = [
            models.Index(fields=["conversation", "timestamp"]),
            models.Index(fields=["conversation", "-timestamp"]),
            models.Index(fields=["conversation", "id"]),
        ]

    def __str__(self):
        return f"{self.get_message_type_display()} - {self.content[:50]}"


class ChatbotSettings(models.Model):
    """Chatbot configuration settings - singleton model"""

    MODEL_CHOICES = [
        # Production Models
        ("llama-3.1-8b-instant", "Llama 3.1 8B Instant (560 tps, 131K context)"),
        ("llama-3.3-70b-versatile", "Llama 3.3 70B Versatile (280 tps, 131K context)"),
        ("openai/gpt-oss-120b", "OpenAI GPT-OSS 120B (500 tps, 131K context)"),
        ("openai/gpt-oss-20b", "OpenAI GPT-OSS 20B (1000 tps, 131K context)"),
        # Production Systems
        ("groq/compound", "Groq Compound (450 tps, 131K context) - Agentic AI System"),
        ("groq/compound-mini", "Groq Compound Mini (450 tps, 131K context)"),
        # Preview Models
        (
            "meta-llama/llama-4-maverick-17b-128e-instruct",
            "Llama 4 Maverick 17B 128E (600 tps, 131K context)",
        ),
        (
            "meta-llama/llama-4-scout-17b-16e-instruct",
            "Llama 4 Scout 17B 16E (750 tps, 131K context)",
        ),
        (
            "moonshotai/kimi-k2-instruct-0905",
            "Moonshot AI Kimi K2 (200 tps, 262K context)",
        ),
        ("qwen/qwen3-32b", "Qwen3 32B (400 tps, 131K context)"),
        # Legacy/Deprecated (keeping for backward compatibility)
        ("mixtral-8x7b-32768", "Mixtral 8x7B (32K context) - Legacy"),
        ("llama-3.1-70b-versatile", "Llama 3.1 70B Versatile - Legacy"),
        ("gemma-7b-it", "Gemma 7B IT - Legacy"),
        ("llama-3.2-90b-text-preview", "Llama 3.2 90B Text Preview - Legacy"),
    ]

    # Singleton instance ID
    id = models.IntegerField(primary_key=True, default=1, editable=False)

    # API Configuration
    api_key = models.CharField(
        max_length=500,
        blank=True,
        help_text="Groq API Key (leave empty to use environment variable GROQ_API_KEY)",
    )
    model = models.CharField(
        max_length=100,
        choices=MODEL_CHOICES,
        default="llama-3.1-8b-instant",
        help_text="LLM model to use for chatbot responses",
    )
    openrouter_api_key = models.CharField(
        max_length=500,
        blank=True,
        help_text="OpenRouter API Key (leave empty to use environment variable OPENROUTER_API_KEY)",
    )
    openrouter_model = models.CharField(
        max_length=200,
        blank=True,
        help_text="OpenRouter model to use for chatbot responses (e.g., openai/gpt-4o-mini, anthropic/claude-3.5-sonnet)",
    )

    # Response Settings
    max_tokens = models.IntegerField(
        default=500, help_text="Maximum tokens for AI responses"
    )
    temperature = models.FloatField(
        default=0.7,
        help_text="Temperature for AI responses (0.0-2.0, higher = more creative)",
    )

    # Feature Flags
    is_active = models.BooleanField(
        default=True, help_text="Enable/disable chatbot functionality"
    )
    auto_populate_context = models.BooleanField(
        default=True, help_text="Automatically populate default contexts on startup"
    )

    # Metadata
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="chatbot_settings_updates",
    )

    class Meta:
        verbose_name = "Chatbot Settings"
        verbose_name_plural = "Chatbot Settings"

    def __str__(self):
        return "Chatbot Settings"

    def clean(self):
        """Ensure only one instance exists"""
        if not self.id:
            self.id = 1
        if ChatbotSettings.objects.exclude(id=self.id).exists():
            raise ValidationError("Only one ChatbotSettings instance is allowed.")

    def save(self, *args, **kwargs):
        """Override save to ensure singleton"""
        self.id = 1
        self.clean()
        super().save(*args, **kwargs)
        from django.core.cache import cache

        cache.delete("chatbot_settings")

    @classmethod
    def get_settings(cls):
        """Get or create the singleton settings instance with caching"""
        from django.core.cache import cache

        settings = cache.get("chatbot_settings")
        if not settings:
            settings, created = cls.objects.get_or_create(id=1)
            cache.set("chatbot_settings", settings, 300)  # Cache for 5 minutes
        return settings

    def get_api_key(self):
        """Get API key from settings or environment variable"""
        from django.conf import settings as django_settings

        if self.api_key:
            return self.api_key
        return getattr(django_settings, "GROQ_API_KEY", None)

    def get_model(self):
        """Get model from settings or environment variable"""
        from django.conf import settings as django_settings

        if self.model:
            return self.model
        return getattr(django_settings, "GROQ_MODEL", "llama-3.1-8b-instant")


class ContactInfo(models.Model):
    """Track contact information collected from chatbot conversations"""

    conversation = models.OneToOneField(
        Conversation, on_delete=models.CASCADE, related_name="contact_info"
    )

    # Collected contact information
    name = models.CharField(max_length=200, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)

    # Collection metadata
    collected_at = models.DateTimeField(auto_now_add=True)
    source_message = models.TextField(
        blank=True, help_text="Original message that contained this contact info"
    )

    # Lead status
    is_lead = models.BooleanField(default=False)
    lead_score = models.IntegerField(default=0, help_text="Lead quality score (0-100)")

    class Meta:
        ordering = ["-collected_at"]
        indexes = [
            models.Index(fields=["is_lead", "-collected_at"]),
            models.Index(fields=["email"]),
            models.Index(fields=["phone"]),
        ]

    def __str__(self):
        return f"Contact: {self.name or 'Unknown'} ({self.conversation.session_id})"

    def update_lead_status(self):
        """Update lead status based on collected information"""
        score = 0

        if self.name:
            score += 30
        if self.email:
            score += 40
        if self.phone:
            score += 30

        self.lead_score = score
        self.is_lead = score >= 70  # Consider lead if we have name + contact method
        self.save()

        # Also update conversation
        if self.is_lead:
            self.conversation.is_lead = True
            self.conversation.save()


class ContentIndex(models.Model):
    """Dynamic content index for website data accessible to chatbot"""

    CONTENT_TYPES = [
        ("page", "Static Page"),
        ("blog", "Blog Post"),
        ("service", "Service Page"),
        ("vehicle", "Vehicle Listing"),
        ("testimonial", "Customer Testimonial"),
        ("faq", "FAQ Item"),
        ("gallery", "Gallery Image"),
        ("cms", "CMS Content"),
        ("contact", "Contact Information"),
        ("pricing", "Pricing Information"),
    ]

    # Content identification
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    object_id = models.PositiveIntegerField()
    content_object = models.CharField(
        max_length=200, help_text="Model instance identifier"
    )

    # Content metadata
    title = models.CharField(max_length=500)
    slug = models.CharField(max_length=500, blank=True)
    url = models.URLField(max_length=1000)

    # Content data
    content_text = models.TextField(help_text="Full text content for search")
    summary = models.TextField(
        blank=True, help_text="Brief summary for quick reference"
    )
    keywords = models.TextField(blank=True, help_text="Comma-separated keywords")

    # Metadata for context
    category = models.CharField(max_length=100, blank=True)
    tags = models.TextField(blank=True, help_text="Comma-separated tags")
    priority = models.IntegerField(default=5, help_text="Importance for search (1-10)")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    content_updated_at = models.DateTimeField(
        help_text="When the original content was last updated"
    )

    # Status
    is_active = models.BooleanField(default=True)
    is_searchable = models.BooleanField(default=True)

    class Meta:
        ordering = ["-priority", "-content_updated_at"]
        indexes = [
            models.Index(fields=["content_type", "-content_updated_at"]),
            models.Index(fields=["is_active", "is_searchable", "-priority"]),
            models.Index(fields=["category", "-content_updated_at"]),
            models.Index(fields=["url"]),
            models.Index(fields=["title"]),
            GinIndex(
                fields=["content_text"],
                name="contentindex_content_text_gin",
                opclasses=["gin_trgm_ops"],
            ),
            GinIndex(
                fields=["keywords"],
                name="contentindex_keywords_gin",
                opclasses=["gin_trgm_ops"],
            ),
        ]
        unique_together = ["content_type", "object_id"]

    def __str__(self):
        return f"{self.get_content_type_display()}: {self.title}"

    def get_keywords_list(self):
        """Return keywords as a list"""
        if not self.keywords:
            return []
        return [k.strip().lower() for k in self.keywords.split(",") if k.strip()]

    def get_tags_list(self):
        """Return tags as a list"""
        if not self.tags:
            return []
        return [t.strip() for t in self.tags.split(",") if t.strip()]

    def calculate_relevance_score(self, query_terms):
        """Calculate relevance score for a search query"""
        score = 0
        query_lower = " ".join(query_terms).lower()
        content_lower = self.content_text.lower()
        title_lower = self.title.lower()

        # Title matches (highest weight)
        for term in query_terms:
            if term.lower() in title_lower:
                score += 10

        # Content matches
        for term in query_terms:
            if term.lower() in content_lower:
                score += 5

        # Keyword matches
        keywords = self.get_keywords_list()
        for term in query_terms:
            if term.lower() in [k.lower() for k in keywords]:
                score += 8

        # Category relevance
        if self.category:
            for term in query_terms:
                if term.lower() in self.category.lower():
                    score += 3

        # Priority bonus
        score += self.priority

        # Recency bonus (newer content gets slight preference)
        days_old = (timezone.now() - self.content_updated_at).days
        recency_bonus = max(0, 5 - days_old // 30)  # Bonus decreases over time
        score += recency_bonus

        return score
