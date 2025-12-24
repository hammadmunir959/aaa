"""
Main Chatbot Service

The primary chatbot service that orchestrates all other services.
Extracted from the monolithic services.py file for better maintainability.
"""

import logging
import re
from typing import Dict, List, Optional, Any

from django.utils import timezone

from ..models import Conversation, ContactInfo
from .context_manager import ContextManager
from .content_search import ContentSearchService
from .response_generator import ResponseGenerator

logger = logging.getLogger(__name__)

# Pre-compiled Regex Patterns
EMAIL_PATTERN = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b")
PHONE_PATTERN = re.compile(r"(?:\+?44|0)\d{9,10}")
NAME_FALLBACK_PATTERN = re.compile(r"\b([A-Z][a-z]{1,15} [A-Z][a-z]{1,15})\b")
EXPLICIT_NAME_PATTERNS = [
    re.compile(
        r"my name is ([A-Z][a-z]{1,20}(?: [A-Z][a-z]{1,20})*(?: [A-Z][a-z]{1,20})?)",
        re.IGNORECASE,
    ),
    re.compile(r"I am ([A-Z][a-z]{1,20}(?: [A-Z][a-z]{1,20})?)", re.IGNORECASE),
    re.compile(r"I'm ([A-Z][a-z]{1,20}(?: [A-Z][a-z]{1,20})?)", re.IGNORECASE),
    re.compile(r"call me ([A-Z][a-z]{1,20}(?: [A-Z][a-z]{1,20})?)", re.IGNORECASE),
]

# Common words to filter out from name detection
COMMON_WORDS = {
    "the",
    "and",
    "for",
    "are",
    "but",
    "not",
    "you",
    "all",
    "can",
    "her",
    "was",
    "one",
    "our",
    "had",
    "by",
    "hot",
    "but",
    "some",
    "what",
    "there",
    "we",
    "can",
    "out",
    "other",
    "were",
    "all",
    "there",
    "when",
    "up",
    "use",
    "your",
    "how",
    "said",
    "each",
    "which",
    "their",
    "time",
    "if",
    "will",
    "way",
    "about",
    "many",
    "then",
    "them",
    "write",
    "would",
    "like",
    "so",
    "these",
    "her",
    "long",
    "make",
    "thing",
    "see",
    "him",
    "two",
    "has",
    "look",
    "more",
    "day",
    "could",
    "go",
    "come",
    "did",
    "number",
    "sound",
    "most",
    "people",
    "my",
    "over",
    "know",
    "water",
    "than",
    "call",
    "first",
    "who",
    "may",
    "down",
    "side",
    "been",
    "now",
    "find",
    "any",
    "new",
    "work",
    "part",
    "take",
    "get",
    "place",
    "made",
    "live",
    "where",
    "after",
    "back",
    "little",
    "only",
    "round",
    "man",
    "year",
    "came",
    "show",
    "every",
    "good",
    "me",
    "give",
    "our",
    "under",
    "very",
    "just",
    "name",
    "should",
    "please",
    "want",
    "help",
    "need",
    "this",
    "that",
    "here",
    "from",
    "they",
    "much",
    "right",
    "think",
    "also",
    "around",
    "another",
}


class SimpleChatbotService:
    """
    Simple chatbot service focused on natural conversation and lead generation.
    Core goal: Collect name, email, and phone information naturally and professionally.
    """

    def __init__(self):
        # Initialize service dependencies
        self.context_manager = ContextManager()
        self.content_search = ContentSearchService()
        self.response_generator = ResponseGenerator()

    async def process_message_async(
        self, message: str, conversation: Conversation
    ) -> Dict[str, Any]:
        """
        Async version of process_message.
        """
        from asgiref.sync import sync_to_async

        start_time = timezone.now()
        logger.info(
            f"Chatbot Service: Starting async processing for message: '{message[:50]}...'"
        )

        # Extract contact information (sync, but fast regex)
        contact_info = self._extract_contact_info(message, conversation)
        if contact_info:
            logger.info(
                f"Chatbot Service: Extracted contact info: {list(contact_info.keys())}"
            )

        # Get relevant context (mix of sync/async potential)
        @sync_to_async
        def get_context():
            return self._get_context_for_response(message, conversation)

        logger.info("Chatbot Service: Retrieving context...")
        context = await get_context()
        logger.info(f"Chatbot Service: Context retrieved ({len(context)} chars)")

        # Generate natural, professional response (ASYNC IO)
        logger.info("Chatbot Service: Calling ResponseGenerator...")
        response = await self.response_generator.generate_response_async(
            message=message,
            context=context,
            conversation=conversation,
            contact_info=contact_info,
        )
        logger.info("Chatbot Service: ResponseGenerator completed")

        # Update contact information (sync DB)
        @sync_to_async
        def save_updates():
            if contact_info:
                self._update_contact_info(conversation, contact_info)
            return self._check_lead_potential(conversation)

        has_lead_info = await save_updates()

        response_time = (timezone.now() - start_time).total_seconds() * 1000

        return {
            "message": response,
            "response_time_ms": int(response_time),
            "contact_info_collected": bool(contact_info),
            "has_lead_info": has_lead_info,
            "collected_fields": list(contact_info.keys()) if contact_info else [],
        }

    def process_message(
        self, message: str, conversation: Conversation
    ) -> Dict[str, Any]:
        """
        Process user message and generate natural response focused on contact collection.
        Core goal: Collect name, email, phone naturally and professionally.
        """
        start_time = timezone.now()

        # Extract contact information from the message
        contact_info = self._extract_contact_info(message, conversation)

        # Get relevant context for response
        context = self._get_context_for_response(message, conversation)

        # Generate natural, professional response
        response = self.response_generator.generate_response(
            message=message,
            context=context,
            conversation=conversation,
            contact_info=contact_info,
        )

        # Update contact information if found
        if contact_info:
            self._update_contact_info(conversation, contact_info)

        # Check if we now have complete contact info for lead generation
        has_lead_info = self._check_lead_potential(conversation)

        response_time = (timezone.now() - start_time).total_seconds() * 1000

        return {
            "message": response,
            "response_time_ms": int(response_time),
            "contact_info_collected": bool(contact_info),
            "has_lead_info": has_lead_info,
            "collected_fields": list(contact_info.keys()) if contact_info else [],
        }

    def _extract_contact_info(
        self, message: str, conversation: Conversation
    ) -> Dict[str, str]:
        """
        Extract contact information (name, email, phone) from user message.
        Returns dict with found contact fields.
        """
        contact_info = {}

        # Extract email using regex
        emails = EMAIL_PATTERN.findall(message)
        if emails:
            contact_info["email"] = emails[0]

        # Extract phone numbers using a normalized string for reliability
        normalized_phone = re.sub(r"[^\d+]", "", message)
        phone_match = PHONE_PATTERN.search(normalized_phone)
        if phone_match:
            contact_info["phone"] = phone_match.group(0)

        # Extract name using improved heuristics
        if not conversation.user_name:
            # Look for explicit name introductions first
            for pattern in EXPLICIT_NAME_PATTERNS:
                match = pattern.search(message)
                if match:
                    name = match.group(1).strip()
                    # Check if it's a reasonable name (2-20 chars per word, not common words)
                    words = name.split()
                    if (
                        len(words) >= 1
                        and len(words) <= 3
                        and all(2 <= len(word) <= 20 for word in words)
                        and not any(word.lower() in COMMON_WORDS for word in words)
                    ):
                        contact_info["name"] = name
                        break

            # If no explicit name found, try First Last pattern as fallback
            if "name" not in contact_info:
                first_last_match = NAME_FALLBACK_PATTERN.search(message)
                if first_last_match:
                    name = first_last_match.group(1)
                    words = name.split()
                    if (
                        len(words) == 2
                        and all(len(word) >= 2 and len(word) <= 15 for word in words)
                        and not any(word.lower() in COMMON_WORDS for word in words)
                    ):
                        contact_info["name"] = name

        return contact_info

    def _get_context_for_response(
        self, message: str, conversation: Conversation
    ) -> str:
        """
        Get relevant context using intelligent content search and fallback to static content.
        """
        # First, try to find relevant content from the dynamic knowledge base
        relevant_content = self._search_relevant_content(message)

        if relevant_content:
            # Combine multiple relevant content pieces for comprehensive context
            combined_content = self._combine_relevant_content(relevant_content, message)
            if len(combined_content) > 1000:  # If we have substantial relevant content
                return combined_content

        # Fallback to static context sections for general queries
        message_lower = message.lower()

        # Comprehensive keyword matching for all company aspects
        context_mapping = {
            # Services & Booking
            "services": [
                "service",
                "what do you",
                "what can you",
                "offer",
                "provide",
                "available",
                "options",
            ],
            "working": [
                "how do you",
                "how it works",
                "process",
                "procedure",
                "steps",
                "how to",
            ],
            "pricing": [
                "price",
                "cost",
                "fee",
                "expensive",
                "cheap",
                "budget",
                "rate",
                "charge",
            ],
            # Company Information
            "company": [
                "about",
                "who are you",
                "company",
                "business",
                "organization",
                "established",
                "history",
            ],
            "contact": [
                "contact",
                "phone",
                "email",
                "call",
                "reach",
                "location",
                "address",
                "office",
            ],
            # Specific Services
            "emergency": [
                "emergency",
                "accident",
                "breakdown",
                "urgent",
                "help",
                "stuck",
                "tow",
                "repair",
            ],
        }

        # Check for specific context matches
        for context_key, keywords in context_mapping.items():
            if any(keyword in message_lower for keyword in keywords):
                context_content = self.context_manager.get_context_content(context_key)
                if context_content:
                    return context_content

        # Booking/car hire specific keywords
        if any(
            word in message_lower
            for word in [
                "book",
                "hire",
                "rent",
                "reserve",
                "rental",
                "car hire",
                "vehicle",
            ]
        ):
            context_content = self.context_manager.get_context_content("services")
            if context_content:
                return context_content

        # Car sales specific keywords
        if any(
            word in message_lower
            for word in [
                "buy",
                "sell",
                "purchase",
                "car sale",
                "selling",
                "buying",
                "wanna sell",
                "need a car to buy",
                "purchase form",
                "sell form",
                "request purchase",
                "submit sell",
                "car sales form",
                "how to buy",
                "how to sell",
            ]
        ):
            # Search for car sales content first
            car_sales_content = self._search_relevant_content(message, limit=5)
            if car_sales_content:
                combined = self._combine_relevant_content(car_sales_content, message)
                if len(combined) > 500:
                    return combined
            # Fallback to services context which includes car sales
            context_content = self.context_manager.get_context_content("services")
            if context_content:
                return context_content

        # Default to comprehensive company overview
        context_content = self.context_manager.get_context_content("intro")
        if context_content:
            return context_content

        return self._get_comprehensive_company_info()

    def _search_relevant_content(self, message: str, limit: int = 5) -> list:
        """
        Search the content index for relevant information based on the user's message.
        """
        try:
            return self.content_search.search_content(message, limit=limit)
        except Exception as e:
            logger.warning(f"Content search failed: {e}")
            return []

    def _combine_relevant_content(
        self, relevant_content: list, original_message: str
    ) -> str:
        """
        Combine multiple relevant content pieces into a coherent context.
        """
        if not relevant_content:
            return ""

        combined_parts = []
        seen_titles = set()

        for content_item, score in relevant_content:
            # Avoid duplicates
            if content_item.title in seen_titles:
                continue
            seen_titles.add(content_item.title)

            # Format content piece
            content_part = f"""
**{content_item.title}**

{content_item.summary or content_item.content_text[:500]}

Source: {content_item.url}
---
"""
            combined_parts.append(content_part)

        combined = "\n".join(combined_parts)

        # Add query context
        query_context = f"""
Based on your question about: "{original_message[:100]}{'...' if len(original_message) > 100 else ''}"

Here is the most relevant information from our website:
{combined}

This information is current as of our last content update.
"""

        return query_context

    def _update_contact_info(
        self, conversation: Conversation, contact_info: Dict[str, str]
    ):
        """
        Update conversation and contact info with extracted information.
        """
        updated = False

        # Update conversation model
        if "name" in contact_info and not conversation.user_name:
            conversation.user_name = contact_info["name"]
            updated = True

        if "email" in contact_info and not conversation.user_email:
            conversation.user_email = contact_info["email"]
            updated = True

        if "phone" in contact_info and not conversation.user_phone:
            conversation.user_phone = contact_info["phone"]
            updated = True

        if updated:
            conversation.save()

        # Create or update ContactInfo record
        if contact_info:
            contact_obj, created = ContactInfo.objects.get_or_create(
                conversation=conversation,
                defaults={
                    "name": contact_info.get("name", ""),
                    "email": contact_info.get("email", ""),
                    "phone": contact_info.get("phone", ""),
                    "source_message": "",  # Could be added later if needed
                },
            )

            if not created:
                # Update existing record
                if "name" in contact_info and not contact_obj.name:
                    contact_obj.name = contact_info["name"]
                if "email" in contact_info and not contact_obj.email:
                    contact_obj.email = contact_info["email"]
                if "phone" in contact_info and not contact_obj.phone:
                    contact_obj.phone = contact_info["phone"]
                contact_obj.save()

            # Update lead status
            contact_obj.update_lead_status()

    def _check_lead_potential(self, conversation: Conversation) -> bool:
        """
        Check if conversation has enough contact info to be considered a lead.
        """
        # Consider it a lead if we have name AND (email OR phone)
        has_name = bool(conversation.user_name)
        has_contact = bool(conversation.user_email or conversation.user_phone)

        if has_name and has_contact:
            conversation.is_lead = True
            conversation.save()
            return True

        return False

    def _get_comprehensive_company_info(self) -> str:
        """
        Provide comprehensive information about the company and its services.
        This serves as a fallback when specific context sections aren't available.
        """
        return """
        **AAA Accident Solutions LTD** is a leading provider of premium car hire and vehicle rental services, specializing in **PCO/Taxi replacement vehicles** (for non-fault accidents), **accident claims management**, and **luxury car sales**.

        **Location**: First Floor, Urban Building, 3-9 Albert St, Slough SL1 2BE, United Kingdom

        **Our Key Services & How to Avail:**

        **1. PCO / Taxi Replacement (Non-Fault)**
        We provide like-for-like replacement vehicles for PCO drivers involved in non-fault accidents.
        • **Benefit**: No upfront cost, same-day delivery, helps with loss of earnings.
        • **How to Avail**: Contact us immediately -> We verify liability -> Vehicle is delivered to you -> We manage repairs.

        **2. Accident Claim Management**
        Full handling of your accident claim, from recovery to settlement.
        • **Benefit**: "No Win No Fee" service, handled by dedicated agents.
        • **How to Avail**: Call our 24/7 helpline -> Assign a handler -> We deal with insurers -> Settlement.

        **3. Car Sales**
        Buy premium ex-fleet or sourced vehicles (Mercedes, BMW, Audi, etc.).
        • **How to Avail**: Browse our fleet online/ask here -> Request purchase info -> Consultation & Filing -> Purchase.

        **Our Fleet:**
        We offer a premium selection of vehicles including:
        • **Mercedes-Benz**: E 300, E 200, C 200, S-Class, V-Class (MPV)
        • **Audi**: A8 L 60 TFSI E Quattro
        • **Land Rover / Range Rover**: Discovery SE SD4, Range Rover Sport Autobiography
        • **Volkswagen**: Tiguan Life TSI
        • **Kia**: Niro

        **Contact Information:**
        • **Main Office / Emergency (24/7)**: +44 345 565 1332
        • **WhatsApp**: +44 79 4377 0119
        • **Email**: info@aaa-as.co.uk
        • **Office Hours**: Mon-Fri 9AM-6PM, Sat 10AM-4PM

        We're committed to keeping you mobile and stress-free. How can I assist you with your car hire or claim needs today?
        """
