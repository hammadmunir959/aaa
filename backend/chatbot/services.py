"""
Simple and Natural Chatbot Service - Compatibility Layer

This file provides backward compatibility while the chatbot services
have been refactored into modular components in the services/ directory.

For new code, import directly from the services package:
    from chatbot.services import ContentIndexer, SimpleChatbotService, etc.
"""

# Re-export the modular services for backward compatibility
from .services.content_indexer import ContentIndexer
from .services.chatbot_service import SimpleChatbotService
from .services.context_manager import ContextManager, invalidate_context_sections_cache
from .services.content_search import ContentSearchService, invalidate_content_search_cache
from .services.response_generator import ResponseGenerator

# Maintain backward compatibility for any existing imports
SimpleChatbotService = SimpleChatbotService
ContentIndexer = ContentIndexer

# Export legacy functions for backward compatibility
def invalidate_context_sections_cache():
    """Legacy function for backward compatibility."""
    from .services.context_manager import invalidate_context_sections_cache as _invalidate
    return _invalidate()

def invalidate_content_search_cache():
    """Legacy function for backward compatibility."""
    from .services.content_search import invalidate_content_search_cache as _invalidate
    return _invalidate()
