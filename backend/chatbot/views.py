from typing import Optional
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.conf import settings
from django.db.models import Count, Prefetch
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from datetime import timedelta
from rest_framework.pagination import PageNumberPagination

from .models import Conversation, ConversationMessage, ChatbotContext, ChatbotSettings
from .serializers import (
    ConversationDetailSerializer,
    ConversationListSerializer,
    ConversationMessageSerializer,
    ChatbotContextSerializer,
    ChatbotSettingsSerializer,
)
from utils.permissions import IsAdmin
from .tasks import generate_chatbot_response_task
from .services import (
    invalidate_context_sections_cache,
    invalidate_content_search_cache,
    SimpleChatbotService,
)

MAX_CONVERSATION_MESSAGES = 200
DEFAULT_CONVERSATION_MESSAGES = 50
CHATBOT_CONFIG_CACHE_TIMEOUT = 300


def _resolve_message_limit(limit_param: Optional[str]) -> int:
    """Clamp conversation message pagination limits."""
    try:
        limit = int(limit_param)
    except (TypeError, ValueError):
        return DEFAULT_CONVERSATION_MESSAGES

    return max(1, min(limit, MAX_CONVERSATION_MESSAGES))


@method_decorator(cache_page(CHATBOT_CONFIG_CACHE_TIMEOUT), name="list")
@method_decorator(cache_page(CHATBOT_CONFIG_CACHE_TIMEOUT), name="retrieve")
class ChatbotContextViewSet(viewsets.ModelViewSet):
    """Manage chatbot context sections"""

    queryset = ChatbotContext.objects.all()
    serializer_class = ChatbotContextSerializer
    permission_classes = [IsAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["section", "is_active"]

    def perform_create(self, serializer):
        """Cache invalidation after creating a context section."""
        super().perform_create(serializer)
        invalidate_context_sections_cache()

    def perform_update(self, serializer):
        """Cache invalidation after modifying a context section."""
        super().perform_update(serializer)
        invalidate_context_sections_cache()

    def perform_destroy(self, instance):
        """Cache invalidation after removing a context section."""
        super().perform_destroy(instance)
        invalidate_context_sections_cache()


@method_decorator(cache_page(CHATBOT_CONFIG_CACHE_TIMEOUT), name="list")
@method_decorator(cache_page(CHATBOT_CONFIG_CACHE_TIMEOUT), name="retrieve")
class ChatbotSettingsViewSet(viewsets.ModelViewSet):
    """Manage chatbot settings (singleton)"""

    queryset = ChatbotSettings.objects.all()
    serializer_class = ChatbotSettingsSerializer
    permission_classes = [IsAdmin]
    lookup_field = "id"

    def get_object(self):
        """Always return the singleton instance"""
        return ChatbotSettings.get_settings()

    def _invalidate_singleton_cache(self):
        invalidate_context_sections_cache()
        invalidate_content_search_cache()

    def list(self, request, *args, **kwargs):
        """Return the singleton instance as a list"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response([serializer.data])

    def retrieve(self, request, *args, **kwargs):
        """Return the singleton instance"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """Update the singleton instance instead of creating"""
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        self._invalidate_singleton_cache()
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """Update the singleton instance"""
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        self._invalidate_singleton_cache()
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """Partial update the singleton instance"""
        return self.update(request, *args, **kwargs)


class ConversationViewSet(viewsets.ModelViewSet):
    """Manage conversations (admin only)"""

    queryset = Conversation.objects.all()
    serializer_class = ConversationDetailSerializer
    permission_classes = [IsAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["status", "is_lead", "manual_reply_active"]
    pagination_class = type(
        "StandardPagination",
        (PageNumberPagination,),
        {"page_size": 10, "page_size_query_param": "page_size", "max_page_size": 100},
    )

    def get_queryset(self):
        queryset = Conversation.objects.annotate(
            message_count=Count("messages")
        ).order_by("-started_at")

        if self.action in {"retrieve", "send_manual_reply", "toggle_manual_reply"}:
            return queryset.prefetch_related(
                Prefetch(
                    "messages",
                    queryset=ConversationMessage.objects.order_by("timestamp"),
                )
            )

        return queryset

    def get_serializer_class(self):
        if self.action == "list":
            return ConversationListSerializer
        return ConversationDetailSerializer

    @action(detail=True, methods=["post"])
    def toggle_manual_reply(self, request, pk=None):
        """Toggle manual reply mode on/off for a conversation"""
        conversation = self.get_object()
        if conversation.status != "active":
            return Response(
                {"error": "Can only toggle manual reply for active conversations"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if conversation.manual_reply_active:
            conversation.deactivate_manual_reply()
            return Response(
                {"message": "Switched to Auto mode", "manual_reply_active": False}
            )
        else:
            conversation.activate_manual_reply()
            return Response(
                {"message": "Switched to Manual mode", "manual_reply_active": True}
            )

    # Removed mark_completed action - admins cannot manually mark as completed
    # Status is automatically managed based on session activity and completion conditions

    @action(detail=True, methods=["post"])
    def send_manual_reply(self, request, pk=None):
        """Send a manual reply to the user"""
        conversation = self.get_object()
        reply_message = request.data.get("message", "").strip()

        if not reply_message:
            return Response(
                {"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        if conversation.status != "active":
            return Response(
                {"error": "Conversation is not active"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not conversation.manual_reply_active:
            return Response(
                {"error": "Manual reply mode is not active"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Save manual reply message as admin message
        ConversationMessage.objects.create(
            conversation=conversation,
            message_type="admin",
            content=reply_message,
            response_time_ms=0,  # Manual replies don't have response time
            is_admin_reply=True,
        )

        # Update last activity
        conversation.last_activity = timezone.now()
        conversation.save()

        # Check if should auto-complete after manual reply
        conversation.check_and_mark_completed()

        return Response(
            {
                "message": "Manual reply sent successfully",
                "manual_reply_active": conversation.manual_reply_active,
                "status": conversation.status,
            }
        )


from django.views.decorators.csrf import csrf_exempt

from asgiref.sync import sync_to_async


@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def chatbot_message(request):
    """
    Handle simple chatbot message.

    Wraps async logic in a synchronous view using async_to_sync to ensure
    compatibility with DRF @api_view decorator and WSGI/ASGI environments.
    """
    from asgiref.sync import async_to_sync
    import asyncio

    # Extract data in sync context
    data = request.data

    # Get IP address
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip_address = x_forwarded_for.split(",")[0]
    else:
        ip_address = request.META.get("REMOTE_ADDR")

    async def process_async_logic(msg_data, client_ip):
        try:
            user_message = msg_data.get("message", "").strip()
            session_id = msg_data.get("session_id", "")

            import logging

            logger = logging.getLogger(__name__)
            logger.info(
                f"Chatbot: Start processing message for session {session_id} from {client_ip}"
            )

            if not user_message or not session_id:
                logger.warning(
                    f"Chatbot: Missing message or session_id for {client_ip}"
                )
                return Response(
                    {"error": "Message and session_id are required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Async DB Ops - Get or Create Conversation
            try:
                conversation, created = await Conversation.objects.aget_or_create(
                    session_id=session_id,
                    defaults={"ip_address": client_ip, "started_at": timezone.now()},
                )
                logger.info(
                    f"Chatbot: Conversation {'created' if created else 'retrieved'} (ID: {conversation.id})"
                )
            except AttributeError:
                logger.info(
                    "Chatbot: aget_or_create not available, using sync_to_async fallback"
                )
                from asgiref.sync import sync_to_async

                conversation, created = await sync_to_async(
                    Conversation.objects.get_or_create
                )(
                    session_id=session_id,
                    defaults={"ip_address": client_ip, "started_at": timezone.now()},
                )

            if created:
                from asgiref.sync import sync_to_async

                @sync_to_async
                def cleanup_others():
                    count = (
                        Conversation.objects.filter(
                            ip_address=client_ip, status="active"
                        )
                        .exclude(id=conversation.id)
                        .update(
                            status="completed",
                            ended_at=timezone.now(),
                            manual_reply_active=False,
                        )
                    )
                    return count

                count = await cleanup_others()
                logger.info(
                    f"Chatbot: Cleaned up {count} other active sessions for {client_ip}"
                )

            if not conversation.ip_address:
                conversation.ip_address = client_ip
                await conversation.asave()

            # Check completion status
            from asgiref.sync import sync_to_async

            @sync_to_async
            def check_completion():
                conversation.check_and_mark_completed()
                return conversation.status

            status_val = await check_completion()

            if status_val == "completed":
                logger.info(f"Chatbot: Session {session_id} is completed")
                return Response(
                    {
                        "message": "This conversation has ended. Please start a new conversation.",
                        "response_time_ms": 0,
                        "session_id": session_id,
                        "manual_reply_active": False,
                        "conversation_completed": True,
                    }
                )

            # Save user message
            await ConversationMessage.objects.acreate(
                conversation=conversation, message_type="user", content=user_message
            )
            logger.info(f"Chatbot: User message saved for session {session_id}")

            conversation.last_activity = timezone.now()
            await conversation.asave()

            if conversation.manual_reply_active:
                logger.info(
                    f"Chatbot: Manual reply active for session {session_id}, skipping AI"
                )
                return Response(
                    {
                        "message": "",
                        "response_time_ms": 0,
                        "session_id": session_id,
                        "manual_reply_active": True,
                        "silent_block": True,
                    }
                )

            # AI Generation
            logger.info(f"Chatbot: Initializing AI generation for session {session_id}")
            service = SimpleChatbotService()
            ai_response = await service.process_message_async(
                user_message, conversation
            )
            logger.info(
                f"Chatbot: AI response generated in {ai_response.get('response_time_ms')}ms"
            )

            await ConversationMessage.objects.acreate(
                conversation=conversation,
                message_type="assistant",
                content=ai_response["message"],
                response_time_ms=ai_response.get("response_time_ms", 1000),
                is_admin_reply=False,
            )
            logger.info(f"Chatbot: Assistant message saved for session {session_id}")

            conversation.last_activity = timezone.now()
            await check_completion()
            await conversation.asave()

            return Response(
                {
                    "message": "",
                    "response_time_ms": 0,
                    "session_id": session_id,
                    "manual_reply_active": False,
                    "contact_info_collected": ai_response.get(
                        "contact_info_collected", False
                    ),
                    "has_lead_info": ai_response.get("has_lead_info", False),
                    "collected_fields": ai_response.get("collected_fields", []),
                    "status": conversation.status,
                }
            )

        except Exception as e:
            import logging
            import traceback

            logger = logging.getLogger(__name__)
            logger.error(f"Chatbot Critical Error: {str(e)}")
            logger.error(traceback.format_exc())
            return Response(
                {
                    "error": "Error processing message",
                    "detail": str(e) if settings.DEBUG else None,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    # Execute the async logic properly in a sync context
    return async_to_sync(process_async_logic)(data, ip_address)


@api_view(["GET"])
@permission_classes([AllowAny])  # Public endpoint for widget polling
def get_conversation_messages(request):
    """Get conversation messages by session_id (for widget polling)"""
    session_id = request.query_params.get("session_id")
    last_message_id = request.query_params.get(
        "last_message_id"
    )  # Optional filter for new messages only
    limit = _resolve_message_limit(request.query_params.get("limit"))

    if not session_id:
        return Response(
            {"error": "session_id is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        conversation = Conversation.objects.get(session_id=session_id)
        messages_qs = conversation.messages

        if last_message_id:
            try:
                last_id = int(last_message_id)
                messages = list(
                    messages_qs.filter(id__gt=last_id).order_by("id")[:limit]
                )
            except (ValueError, TypeError):
                messages = list(messages_qs.order_by("-id")[:limit])[::-1]
        else:
            messages = list(messages_qs.order_by("-id")[:limit])[::-1]

        serializer = ConversationMessageSerializer(messages, many=True)
        return Response(
            {
                "messages": serializer.data,
                "manual_reply_active": conversation.manual_reply_active,
                "status": conversation.status,
            }
        )
    except Conversation.DoesNotExist:
        # Return empty response instead of 404 for polling endpoints
        # This prevents 404 warnings when polling for conversations that don't exist yet
        return Response(
            {"messages": [], "manual_reply_active": False, "status": "active"},
            status=status.HTTP_200_OK,
        )
