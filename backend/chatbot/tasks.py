import logging

from celery import shared_task
from django.utils import timezone

from .models import Conversation, ConversationMessage
from .services import ContentIndexer, SimpleChatbotService

logger = logging.getLogger(__name__)


@shared_task(bind=True)
def generate_chatbot_response_task(self, conversation_id: int, user_message_id: int) -> dict:
    try:
        conversation = Conversation.objects.get(id=conversation_id)
        user_message = ConversationMessage.objects.get(id=user_message_id)
    except (Conversation.DoesNotExist, ConversationMessage.DoesNotExist) as exc:
        logger.warning(
            "Chatbot response task could not find resources",
            extra={'conversation_id': conversation_id, 'user_message_id': user_message_id, 'error': str(exc)}
        )
        return {'error': 'Conversation or user message not found'}

    if conversation.status == 'completed' or conversation.manual_reply_active:
        logger.info(
            "Skipping AI response because conversation is not active",
            extra={'conversation_id': conversation_id, 'manual_reply_active': conversation.manual_reply_active}
        )
        return {'message': 'Conversation not active'}

    try:
        service = SimpleChatbotService()
        ai_response = service.process_message(user_message.content, conversation)

        ConversationMessage.objects.create(
            conversation=conversation,
            message_type='assistant',
            content=ai_response['message'],
            response_time_ms=ai_response.get('response_time_ms', 1000),
            is_admin_reply=False
        )

        conversation.last_activity = timezone.now()
        conversation.check_and_mark_completed()
        conversation.save(update_fields=['last_activity'])

        return {
            'message': ai_response['message'],
            'response_time_ms': ai_response.get('response_time_ms', 1000)
        }
    except Exception as exc:
        logger.error(f"Error generating chatbot response: {exc}", exc_info=True)
        return {'error': 'Failed to generate response'}


@shared_task
def index_website_content_task() -> dict:
    """Background task to rebuild the chatbot content index."""
    indexer = ContentIndexer()
    result = indexer.index_all_content()
    logger.info("Chatbot content indexing completed", extra=result)
    return result


@shared_task
def cleanup_inactive_sessions_task() -> dict:
    """
    Background task to close inactive chatbot sessions.
    Runs periodically to check for sessions inactive for > 2 minutes.
    """
    try:
        from datetime import timedelta
        cutoff_time = timezone.now() - timedelta(minutes=2)
        
        # Find active conversations with no activity for > 2 minutes
        stale_conversations = Conversation.objects.filter(
            status='active',
            last_activity__lt=cutoff_time
        )
        
        count = 0
        for conversation in stale_conversations:
            # Re-check individually to be safe and use the model method
            if conversation.check_and_mark_completed():
                count += 1
                
        if count > 0:
            logger.info(f"Cleaned up {count} inactive chatbot sessions")
            
        return {'cleaned_count': count}
    except Exception as e:
        logger.error(f"Error cleaning up inactive sessions: {e}", exc_info=True)
        return {'error': str(e)}

