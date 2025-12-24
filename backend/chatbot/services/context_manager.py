"""
Context Manager Service

Manages chatbot context sections and provides cached access to context data.
Extracted from the monolithic services.py file for better maintainability.
"""

import logging
from typing import Dict, List, Optional

from django.core.cache import cache

from utils.cache import cache_result, get_cache_key

from ..models import ChatbotContext

logger = logging.getLogger(__name__)

CONTEXT_CACHE_PREFIX = 'chatbot_context_sections'


def invalidate_context_sections_cache() -> None:
    """Invalidate the context sections cache"""
    cache.delete(get_cache_key(CONTEXT_CACHE_PREFIX))


@cache_result(timeout=3600, key_prefix=CONTEXT_CACHE_PREFIX)
def _get_cached_context_sections() -> Dict[str, Dict[str, str]]:
    """
    Get cached context sections with 1-hour TTL.
    """
    sections: Dict[str, Dict[str, str]] = {}
    for context in ChatbotContext.objects.filter(is_active=True):
        sections[context.section] = {
            'title': context.title,
            'content': context.content,
            'keywords': context.get_keywords_list()
        }
    return sections


class ContextManager:
    """
    Manages chatbot context sections for different conversation intents.
    Provides intelligent context matching and retrieval.
    """

    def __init__(self):
        self._context_sections = None

    @property
    def context_sections(self) -> Dict[str, Dict[str, str]]:
        """Get cached context sections"""
        if self._context_sections is None:
            self._context_sections = _get_cached_context_sections()
        return self._context_sections

    def refresh_contexts(self) -> None:
        """Force refresh of context sections from database"""
        invalidate_context_sections_cache()
        self._context_sections = _get_cached_context_sections()

    def get_context_for_intent(self, intent: str) -> Optional[Dict[str, str]]:
        """
        Get context section for a specific intent.

        Args:
            intent: The intent identifier (e.g., 'services', 'contact', 'pricing')

        Returns:
            Context section dict or None if not found
        """
        return self.context_sections.get(intent)

    def find_relevant_contexts(self, message: str, max_results: int = 3) -> List[Dict[str, str]]:
        """
        Find context sections most relevant to a message based on keyword matching.

        Args:
            message: User message to analyze
            max_results: Maximum number of contexts to return

        Returns:
            List of relevant context sections ordered by relevance
        """
        message_lower = message.lower()
        scored_contexts = []

        for section_key, context_data in self.context_sections.items():
            keywords = context_data.get('keywords', [])
            score = self._calculate_context_relevance(message_lower, keywords)
            if score > 0:
                scored_contexts.append((context_data, score))

        # Sort by score descending and return top results
        scored_contexts.sort(key=lambda x: x[1], reverse=True)
        return [context for context, score in scored_contexts[:max_results]]

    def _calculate_context_relevance(self, message_lower: str, keywords: List[str]) -> float:
        """
        Calculate relevance score for a context section based on keyword matches.

        Args:
            message_lower: Lowercase user message
            keywords: List of keywords for the context

        Returns:
            Relevance score (0.0 to 1.0)
        """
        if not keywords:
            return 0.0

        total_score = 0.0
        max_score = len(keywords)

        for keyword in keywords:
            keyword_lower = keyword.lower()
            if keyword_lower in message_lower:
                # Exact match gets full points
                total_score += 1.0
            elif any(word in message_lower for word in keyword_lower.split()):
                # Partial word matches get half points
                total_score += 0.5

        return total_score / max_score if max_score > 0 else 0.0

    def get_context_content(self, section: str) -> Optional[str]:
        """
        Get the content of a specific context section.

        Args:
            section: Context section identifier

        Returns:
            Context content string or None if section not found
        """
        context = self.get_context_for_intent(section)
        return context.get('content') if context else None

    def get_context_title(self, section: str) -> Optional[str]:
        """
        Get the title of a specific context section.

        Args:
            section: Context section identifier

        Returns:
            Context title string or None if section not found
        """
        context = self.get_context_for_intent(section)
        return context.get('title') if context else None

    def list_available_contexts(self) -> List[str]:
        """
        Get list of all available context section identifiers.

        Returns:
            List of context section keys
        """
        return list(self.context_sections.keys())

    def get_context_with_metadata(self, section: str) -> Optional[Dict[str, any]]:
        """
        Get complete context section with all metadata.

        Args:
            section: Context section identifier

        Returns:
            Complete context dict with title, content, and keywords
        """
        return self.get_context_for_intent(section)
