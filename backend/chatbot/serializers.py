from rest_framework import serializers
from .models import Conversation, ConversationMessage, ChatbotContext, ChatbotSettings


class ConversationMessageSerializer(serializers.ModelSerializer):
    """Serializer for conversation messages"""

    class Meta:
        model = ConversationMessage
        fields = [
            "id",
            "message_type",
            "content",
            "response_time_ms",
            "timestamp",
            "is_admin_reply",
        ]


class ConversationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing conversations"""

    message_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Conversation
        fields = [
            "id",
            "session_id",
            "user_email",
            "user_name",
            "user_phone",
            "ip_address",
            "is_lead",
            "status",
            "manual_reply_active",
            "started_at",
            "ended_at",
            "last_activity",
            "message_count",
        ]


class ConversationDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for conversations (includes messages)"""

    messages = ConversationMessageSerializer(many=True, read_only=True)
    message_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Conversation
        fields = [
            "id",
            "session_id",
            "user_email",
            "user_name",
            "user_phone",
            "ip_address",
            "is_lead",
            "status",
            "manual_reply_active",
            "started_at",
            "ended_at",
            "last_activity",
            "messages",
            "message_count",
        ]


class ChatbotContextSerializer(serializers.ModelSerializer):
    """Serializer for chatbot context sections"""

    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = ChatbotContext
        fields = [
            "id",
            "section",
            "title",
            "content",
            "keywords",
            "is_active",
            "display_order",
            "created_at",
            "updated_at",
            "created_by",
            "created_by_name",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def get_created_by_name(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def create(self, validated_data):
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)


class ChatbotSettingsSerializer(serializers.ModelSerializer):
    """Serializer for chatbot settings"""

    updated_by_name = serializers.SerializerMethodField()

    class Meta:
        model = ChatbotSettings
        fields = [
            "id",
            "api_key",
            "model",
            "openrouter_api_key",
            "openrouter_model",
            "max_tokens",
            "temperature",
            "is_active",
            "auto_populate_context",
            "updated_at",
            "updated_by",
            "updated_by_name",
        ]
        read_only_fields = ["id", "updated_at"]

    def get_updated_by_name(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None

    def update(self, instance, validated_data):
        """Update settings and track who updated them"""
        request = self.context.get("request")
        if request and request.user:
            validated_data["updated_by"] = request.user
        return super().update(instance, validated_data)
