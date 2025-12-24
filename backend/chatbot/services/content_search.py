"""
Content Search Service

Handles searching indexed content using PostgreSQL full-text search.
Extracted from the monolithic services.py file for better maintainability.
"""

import logging
from typing import Any, Dict, List, Optional

from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector
from django.core.cache import cache
from django.db.models import Q

from utils.cache import get_cache_key, invalidate_cache_pattern

from ..models import ContentIndex

logger = logging.getLogger(__name__)

SEARCH_CACHE_PREFIX = "chatbot_content_search"


def invalidate_content_search_cache() -> None:
    """Invalidate all content search cache entries"""
    invalidate_cache_pattern(f"pchm:{SEARCH_CACHE_PREFIX}:*")


def _execute_cached_content_search(
    query: str, limit: int = 10, content_types: Optional[List[str]] = None
) -> List[tuple]:
    """
    Execute cached content search with PostgreSQL full-text search.

    Returns a list of (content_item, score) tuples, ordered by relevance.
    """
    if not query or not query.strip():
        return []

    query_terms = query.lower().split()
    cache_key = get_cache_key(
        SEARCH_CACHE_PREFIX, query=query, limit=limit, content_types=content_types
    )

    # Try to get from cache first
    cached_result = cache.get(cache_key)
    if cached_result is not None:
        return cached_result

    # Execute search
    results = _perform_content_search(query_terms, limit, content_types)

    # Cache the results for 10 minutes
    cache.set(cache_key, results, 600)

    return results


def _perform_content_search(
    query_terms: List[str], limit: int = 10, content_types: Optional[List[str]] = None
) -> List[tuple]:
    """
    Perform the actual content search using PostgreSQL full-text search.
    """
    # Create search query from terms
    search_query = SearchQuery(" ".join(query_terms), search_type="websearch")

    # Create search vector from title and content
    search_vector = SearchVector("title", weight="A") + SearchVector(
        "content_text", weight="B"
    )

    # Base queryset
    queryset = ContentIndex.objects.filter(is_active=True, is_searchable=True)

    # Filter by content types if specified
    if content_types:
        queryset = queryset.filter(content_type__in=content_types)

    # Annotate with search rank and filter by minimum relevance
    queryset = (
        queryset.annotate(rank=SearchRank(search_vector, search_query))
        .filter(Q(rank__gte=0.01))  # Minimum relevance threshold
        .order_by("-rank")
    )

    # Get top results
    content_items = list(queryset[:limit])

    # Return as (item, score) tuples
    return [(item, item.rank) for item in content_items]


class ContentSearchService:
    """
    Service for searching indexed content with intelligent ranking and caching.
    """

    @staticmethod
    def search_content(
        query: str, limit: int = 10, content_types: Optional[List[str]] = None
    ) -> List[tuple]:
        """
        Search indexed content for relevant information.

        Args:
            query: Search query string
            limit: Maximum number of results to return
            content_types: Optional list of content types to search in

        Returns:
            List of (ContentIndex, score) tuples ordered by relevance
        """
        return _execute_cached_content_search(query, limit, content_types)

    @staticmethod
    def search_with_fallback(
        query: str, limit: int = 10, content_types: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        Search with fallback to keyword-based search if full-text search fails.
        Returns formatted results for chatbot consumption.
        """
        try:
            results = ContentSearchService.search_content(query, limit, content_types)

            # Format for chatbot use
            formatted_results = []
            for content_item, score in results:
                formatted_results.append(
                    {
                        "title": content_item.title,
                        "summary": content_item.summary
                        or content_item.content_text[:300] + "...",
                        "url": content_item.url,
                        "category": content_item.category,
                        "relevance_score": float(score),
                        "content_type": content_item.content_type,
                    }
                )

            return formatted_results

        except Exception as e:
            logger.warning(
                f"Full-text search failed, falling back to basic search: {e}"
            )
            return ContentSearchService._fallback_search(query, limit, content_types)

    @staticmethod
    def _fallback_search(
        query: str, limit: int = 10, content_types: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        Fallback keyword-based search when full-text search is unavailable.
        """
        query_lower = query.lower()

        # Base queryset
        queryset = ContentIndex.objects.filter(is_active=True, is_searchable=True)

        if content_types:
            queryset = queryset.filter(content_type__in=content_types)

        # Get all items for scoring
        content_items = list(queryset)

        # Score items based on keyword matches
        scored_results = []
        for item in content_items:
            score = ContentSearchService._calculate_keyword_score(item, query_lower)
            if score > 0:
                scored_results.append((item, score))

        # Sort by score and take top results
        scored_results.sort(key=lambda x: x[1], reverse=True)
        top_results = scored_results[:limit]

        # Format results
        formatted_results = []
        for content_item, score in top_results:
            formatted_results.append(
                {
                    "title": content_item.title,
                    "summary": content_item.summary
                    or content_item.content_text[:300] + "...",
                    "url": content_item.url,
                    "category": content_item.category,
                    "relevance_score": score,
                    "content_type": content_item.content_type,
                }
            )

        return formatted_results

    @staticmethod
    def _calculate_keyword_score(content_item: ContentIndex, query_lower: str) -> float:
        """
        Calculate relevance score based on keyword matches in title, content, and keywords.
        """
        score = 0.0

        # Title matches (highest weight)
        title_lower = content_item.title.lower()
        if query_lower in title_lower:
            score += 10.0
        else:
            # Partial matches in title
            query_words = query_lower.split()
            title_words = set(title_lower.split())
            matching_words = query_words & title_words
            score += len(matching_words) * 3.0

        # Content matches (medium weight)
        content_lower = content_item.content_text.lower()
        if query_lower in content_lower:
            score += 5.0
        else:
            # Partial matches in content
            content_words = set(content_lower.split())
            matching_words = query_words & content_words
            score += len(matching_words) * 1.0

        # Keywords matches (high weight)
        keywords = content_item.get_keywords_list()
        keyword_matches = sum(
            1 for keyword in keywords if query_lower in keyword.lower()
        )
        score += keyword_matches * 4.0

        # Priority boost
        score += content_item.priority * 0.1

        return score
