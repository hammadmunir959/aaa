"""
Response Generator Service

Handles generating natural, professional chatbot responses.
Extracted from the monolithic services.py file for better maintainability.
"""

import logging
import re
import requests
from typing import Dict, List, Optional, Any

import groq
from django.conf import settings

from ..models import Conversation

logger = logging.getLogger(__name__)


class ResponseGenerator:
    """
    Generates natural, professional chatbot responses using AI models.
    Handles fallback to different models and response cleaning.
    """

    def __init__(self):
        # Initial settings from django.conf.settings
        self.groq_api_key = getattr(settings, 'GROQ_API_KEY', None)
        self.model = getattr(settings, 'GROQ_MODEL', 'llama-3.1-8b-instant')
        self.openrouter_api_key = getattr(settings, 'OPENROUTER_API_KEY', None)
        self.openrouter_model = getattr(settings, 'OPENROUTER_MODEL', 'openai/gpt-oss-20b:free')
        self.max_tokens = 80
        self.temperature = 0.3
        
        # Initialize Groq clients lazily
        self._client = None
        self._async_client = None

    def _get_db_settings(self):
        """Fetch settings from the database singleton."""
        from ..models import ChatbotSettings
        try:
            db_settings = ChatbotSettings.get_settings()
            if db_settings.api_key:
                self.groq_api_key = db_settings.api_key
            if db_settings.model:
                self.model = db_settings.model
            if db_settings.openrouter_api_key:
                self.openrouter_api_key = db_settings.openrouter_api_key
            if db_settings.openrouter_model:
                self.openrouter_model = db_settings.openrouter_model
            self.max_tokens = db_settings.max_tokens
            self.temperature = db_settings.temperature
        except Exception as e:
            logger.warning(f"Failed to load settings from DB, using defaults/environment: {e}")

    @property
    def async_client(self):
        """Lazy initialization of AsyncGroq client."""
        if self._async_client is None:
            self._get_db_settings()
            if self.groq_api_key:
                try:
                    import groq
                    self._async_client = groq.AsyncGroq(api_key=self.groq_api_key)
                except Exception as e:
                    logger.error(f"Failed to initialize AsyncGroq client: {e}")
        return self._async_client

    @property
    def sync_client(self):
        """Lazy initialization of Groq client."""
        if self._client is None:
            self._get_db_settings()
            if self.groq_api_key:
                try:
                    import groq
                    self._client = groq.Groq(api_key=self.groq_api_key)
                except Exception as e:
                    logger.error(f"Failed to initialize Groq client: {e}")
        return self._client

    async def generate_response_async(
        self,
        message: str,
        context: str,
        conversation: Conversation,
        contact_info: Optional[Dict[str, str]] = None
    ) -> str:
        """
        Async version of generate_response.
        """
        # Get conversation history for context (sync DB access needs sync_to_async in view or pre-fetched)
        # Note: We assume 'conversation' passed here has necessary data or we access it carefully.
        # Ideally, history construction happens outside or we use async iteration if this was fully async.
        # For simplicity, we restart history construction logic or expect pre-fetched data.
        # To avoid DB issues, we'll assume the view passes the context string fully formed, 
        # OR we use sync_to_async for the DB parts here.
        
        from asgiref.sync import sync_to_async
        
        # Helper to get history safely
        @sync_to_async
        def get_history():
            recent_messages = list(conversation.messages.order_by('-timestamp')[:4])
            history = []
            for msg in reversed(recent_messages):
                sender = 'Assistant' if msg.message_type == 'assistant' else 'User'
                content = msg.content[:100] + '...' if len(msg.content) > 100 else msg.content
                history.append(f"{sender}: {content}")
            return "\n".join(history) if history else "New conversation"

        conversation_context = await get_history()

        # Check if we have specific content knowledge
        has_specific_content = len(context) > 500 and "Source:" in context

        # Build prompt
        if has_specific_content:
            prompt = self._build_specific_content_prompt(
                message, context, conversation_context, conversation, contact_info
            )
        else:
            prompt = self._build_general_knowledge_prompt(
                message, context, conversation_context, conversation, contact_info
            )

        # Check if client is available
        if not self.async_client:
            logger.warning("Groq async client not initialized, trying OpenRouter fallback")
            try:
                system_prompt = self._get_system_prompt()
                if self.openrouter_api_key:
                    return await self._generate_with_openrouter_async(system_prompt, prompt)
            except Exception as e:
                logger.warning(f"OpenRouter fallback failed: {e}")
            return "Hello! How can I help you with your car hire needs today?"

        try:
            system_prompt = self._get_system_prompt()
            response = await self.async_client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=80,
                temperature=0.3
            )
            raw_response = response.choices[0].message.content.strip()

            cleaned_response = self._clean_response(raw_response)
            truncated_response = self._truncate_to_sentences(cleaned_response, max_sentences=3)
            final_response = self._final_cleanup(truncated_response)

            return final_response

        except Exception as groq_error:
            logger.warning(f"Groq Async API error: {groq_error}, falling back to OpenRouter")
            try:
                return await self._generate_with_openrouter_async(system_prompt, prompt)
            except Exception as openrouter_error:
                logger.error(f"OpenRouter async fallback failed: {openrouter_error}")
                return "Hello! How can I help you with your car hire needs today?"

    def generate_response(
        self,
        message: str,
        context: str,
        conversation: Conversation,
        contact_info: Optional[Dict[str, str]] = None
    ) -> str:
        """
        Generate a natural, professional response using AI.
        """
        # Get conversation history for context
        recent_messages = list(conversation.messages.order_by('-timestamp')[:4])
        history = []
        for msg in reversed(recent_messages):
            sender = 'Assistant' if msg.message_type == 'assistant' else 'User'
            content = msg.content[:100] + '...' if len(msg.content) > 100 else msg.content
            history.append(f"{sender}: {content}")
            
        conversation_context = "\n".join(history) if history else "New conversation"

        # Check if we have specific content knowledge
        has_specific_content = len(context) > 500 and "Source:" in context

        # Build prompt based on available knowledge
        if has_specific_content:
            prompt = self._build_specific_content_prompt(
                message, context, conversation_context, conversation, contact_info
            )
        else:
            prompt = self._build_general_knowledge_prompt(
                message, context, conversation_context, conversation, contact_info
            )

        # Check if client is available
        if not self.client:
            logger.warning("Groq client not initialized, trying OpenRouter fallback")
            try:
                system_prompt = self._get_system_prompt()
                if self.openrouter_api_key:
                    return self._generate_with_openrouter(system_prompt, prompt)
            except Exception as e:
                logger.warning(f"OpenRouter fallback failed: {e}")
            return "Hello! How can I help you with your car hire needs today?"

        try:
            system_prompt = self._get_system_prompt()
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=80,  # Very strict limit for 2-3 sentences
                temperature=0.3  # Lower temperature for more consistent, concise responses
            )
            raw_response = response.choices[0].message.content.strip()

            # Clean and format the response
            cleaned_response = self._clean_response(raw_response)
            truncated_response = self._truncate_to_sentences(cleaned_response, max_sentences=3)
            final_response = self._final_cleanup(truncated_response)

            return final_response

        except Exception as groq_error:
            logger.warning(f"Groq API error: {groq_error}, falling back to OpenRouter")
            try:
                return self._generate_with_openrouter(system_prompt, prompt)
            except Exception as openrouter_error:
                logger.error(f"OpenRouter fallback also failed: {openrouter_error}")
                return "Hello! How can I help you with your car hire needs today?"

    def _build_specific_content_prompt(
        self,
        message: str,
        context: str,
        conversation_context: str,
        conversation: Conversation,
        contact_info: Optional[Dict[str, str]]
    ) -> str:
        """Build prompt for responses with specific website content knowledge."""
        return f"""
        You are an expert customer service representative for **AAA Accident Solutions LTD** with access to our complete website content and knowledge base.

        **YOUR KNOWLEDGE BASE:** You have access to all current website information, including specific details about our services, pricing, vehicles, testimonials, FAQs, and company information.

        CONVERSATION HISTORY:
        {conversation_context}

        USER QUESTION: {message}

        **RELEVANT WEBSITE CONTENT:**
        {context[:1500]}...

        KNOWN CONTACT INFO:
        - Name: {conversation.user_name or 'Unknown'}
        - Email: {conversation.user_email or 'Unknown'}
        - Phone: {conversation.user_phone or 'Unknown'}

        NEW CONTACT INFO DETECTED: {', '.join(contact_info.keys()) if contact_info else 'None'}

        **CRITICAL RESPONSE RULES:**
        1. **STRICT LIMIT**: Maximum 2-3 sentences ONLY. Never exceed this.
        2. **NO LISTS**: Do NOT list services, features, or bullet points unless specifically asked
        3. **NO INTRODUCTIONS**: Do NOT introduce yourself or explain who you are unless asked
        4. **DIRECT ANSWER**: Answer ONLY what was asked, nothing more
        5. **NO CONTACT PROMPTS**: Do NOT ask for contact information unless the user is ready to book
        6. **NO VERBOSE EXPLANATIONS**: Keep it brief and to the point

        **RESPONSE FORMAT:**
        - For greetings: Simple greeting + brief offer to help (2 sentences max)
        - For questions: Direct answer (2-3 sentences max)
        - No service listings, no company introductions, no long explanations

        Provide ONLY a 2-3 sentence response:
        """

    def _build_general_knowledge_prompt(
        self,
        message: str,
        context: str,
        conversation_context: str,
        conversation: Conversation,
        contact_info: Optional[Dict[str, str]]
    ) -> str:
        """Build prompt for general knowledge responses."""
        return f"""
        You are an expert customer service representative for **AAA Accident Solutions LTD**, a premium car hire and accident replacement vehicle specialist with comprehensive knowledge of our services.

        CONVERSATION HISTORY:
        {conversation_context}

        CURRENT MESSAGE: {message}

        CONTEXT INFORMATION: {context[:800]}...

        KNOWN CONTACT INFO:
        - Name: {conversation.user_name or 'Unknown'}
        - Email: {conversation.user_email or 'Unknown'}
        - Phone: {conversation.user_phone or 'Unknown'}

        NEW CONTACT INFO DETECTED: {', '.join(contact_info.keys()) if contact_info else 'None'}

        **CRITICAL RESPONSE RULES:**
        1. **STRICT LIMIT**: Maximum 2-3 sentences ONLY. Never exceed this.
        2. **NO LISTS**: Do NOT list services, features, or bullet points unless specifically asked
        3. **NO INTRODUCTIONS**: Do NOT introduce yourself or explain who you are unless asked
        4. **DIRECT ANSWER**: Answer ONLY what was asked, nothing more
        5. **NO CONTACT PROMPTS**: Do NOT ask for contact information unless the user is ready to book
        6. **NO VERBOSE EXPLANATIONS**: Keep it brief and to the point

        **RESPONSE FORMAT:**
        - For greetings: Simple greeting + brief offer to help (2 sentences max)
        - For questions: Direct answer (2-3 sentences max)
        - No service listings, no company introductions, no long explanations

        Provide ONLY a 2-3 sentence response:
        """

    def _get_system_prompt(self) -> str:
        """Get the system prompt for consistent behavior."""
        return """
        You are a professional customer service representative for AAA Accident Solutions LTD.

        **CRITICAL RULES - FOLLOW STRICTLY:**
        1. **MAXIMUM 2-3 SENTENCES** - Never exceed this limit, ever
        2. **NO SERVICE LISTS** - Do NOT list services, features, or bullet points unless explicitly asked
        3. **NO INTRODUCTIONS** - Do NOT introduce yourself or explain who you are unless asked "who are you"
        4. **NO CONTACT PROMPTS** - Do NOT ask for name, email, or phone unless user is ready to book
        5. **DIRECT ANSWERS ONLY** - Answer exactly what was asked, nothing more
        6. **NO VERBOSE EXPLANATIONS** - Keep every response brief and to the point

        **RESPONSE EXAMPLES:**
        - User says "hi" → "Hello! How can I help you today?" (1-2 sentences)
        - User asks "who are you" → "I'm a customer service representative for AAA Accident Solutions LTD. How can I assist you?" (2 sentences)
        - User asks about pricing → "Our rates start from £25/day for economy vehicles and £85/day for luxury. What type of vehicle are you looking for?" (2-3 sentences)

        **NEVER DO:**
        - List all services unless asked
        - Provide long introductions
        - Ask for contact info proactively
        - Write more than 3 sentences
        - Use bullet points or lists

        Keep responses professional, concise, and actionable. Maximum 2-3 sentences always.
        """

    async def _generate_with_openrouter_async(self, system_prompt: str, user_prompt: str) -> str:
        """
        Async version of OpenRouter fallback.
        """
        import httpx
        
        if not self.openrouter_api_key:
            raise ValueError("OpenRouter API key not configured")

        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.openrouter_api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": getattr(settings, 'SITE_URL', 'http://localhost:8000'),
            "X-Title": "AAA Accident Solutions LTD Chatbot"
        }

        payload = {
            "model": self.openrouter_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "max_tokens": 80,
            "temperature": 0.3
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers, timeout=30)
            response.raise_for_status()
            data = response.json()
            
        raw_response = data['choices'][0]['message']['content'].strip()

        cleaned_response = self._clean_response(raw_response)
        truncated_response = self._truncate_to_sentences(cleaned_response, max_sentences=3)
        final_response = self._final_cleanup(truncated_response)

        return final_response

    def _generate_with_openrouter(self, system_prompt: str, user_prompt: str) -> str:
        """
        Generate response using OpenRouter API as fallback.
        """
        if not self.openrouter_api_key:
            raise ValueError("OpenRouter API key not configured")

        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.openrouter_api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": getattr(settings, 'SITE_URL', 'http://localhost:8000'),
            "X-Title": "AAA Accident Solutions LTD Chatbot"
        }

        payload = {
            "model": self.openrouter_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "max_tokens": 80,  # Very strict limit for 2-3 sentences
            "temperature": 0.3  # Lower temperature for more consistent, concise responses
        }

        response = requests.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()

        data = response.json()
        raw_response = data['choices'][0]['message']['content'].strip()

        # Clean and format the response
        cleaned_response = self._clean_response(raw_response)
        truncated_response = self._truncate_to_sentences(cleaned_response, max_sentences=3)
        final_response = self._final_cleanup(truncated_response)

        return final_response

    def _final_cleanup(self, text: str) -> str:
        """
        Final cleanup to ensure response is truly concise and has no lists.
        """
        if not text:
            return "Hello! How can I help you with your car hire needs today?"

        # Remove any remaining list markers
        text = re.sub(r'^\s*[•\-\*]\s+', '', text, flags=re.MULTILINE)
        text = re.sub(r'^\s*\d+\.\s+', '', text, flags=re.MULTILINE)
        text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)

        # Split by newlines and take only the first paragraph (before any list-like content)
        lines = text.split('\n')
        clean_lines = []
        for line in lines:
            line = line.strip()
            # Stop at first list-like line or empty line followed by list
            if (re.match(r'^[•\-\*]\s+', line) or
                re.match(r'^\d+\.\s+', line) or
                (line == '' and clean_lines)):  # Empty line after content
                break
            if line and len(line) > 3:
                clean_lines.append(line)

        text = ' '.join(clean_lines)

        # Count sentences - if more than 3, truncate
        sentences = re.split(r'[.!?]+\s+', text)
        if len(sentences) > 3:
            text = '. '.join(sentences[:3])
            if not text.endswith(('.', '!', '?')):
                text += '.'

        # Final character limit
        if len(text) > 250:
            text = text[:250]
            last_punct = max(text.rfind('.'), text.rfind('!'), text.rfind('?'))
            if last_punct > 50:
                text = text[:last_punct + 1]

        return text.strip()

    def _truncate_to_sentences(self, text: str, max_sentences: int = 3) -> str:
        """
        Truncate response to maximum number of sentences and remove lists.
        """
        if not text:
            return text.strip()

        # Remove bullet points, numbered lists, and markdown formatting
        text = re.sub(r'^\s*[•\-\*]\s+', '', text, flags=re.MULTILINE)  # Bullet points
        text = re.sub(r'^\s*\d+\.\s+', '', text, flags=re.MULTILINE)  # Numbered lists
        text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)  # Bold markdown
        text = re.sub(r'^\s*#+\s+', '', text, flags=re.MULTILINE)  # Headers

        # Remove lines that look like list items or section headers
        lines = text.split('\n')
        clean_lines = []
        for line in lines:
            line = line.strip()
            # Skip list items, headers, and empty lines
            if (line and
                not re.match(r'^[•\-\*]\s+', line) and
                not re.match(r'^\d+\.\s+', line) and
                not re.match(r'^#+\s+', line) and
                not line.startswith('**') and
                len(line) > 5):  # Skip very short lines
                clean_lines.append(line)

        text = ' '.join(clean_lines)

        # Split into sentences more reliably
        sentence_pattern = r'([.!?]+)\s+'
        sentences = re.split(sentence_pattern, text)

        if len(sentences) <= 1:  # No sentence endings found
            # If no punctuation, take first 200 characters max
            return text[:200].strip()

        # Reconstruct sentences with their punctuation
        reconstructed = []
        i = 0
        while i < len(sentences) - 1:
            if i + 1 < len(sentences):
                sentence = (sentences[i] + sentences[i + 1]).strip()
                if sentence and len(sentence) > 5:  # Skip very short fragments
                    reconstructed.append(sentence)
            i += 2

        # Add any remaining text as last sentence if no punctuation
        if i < len(sentences) and sentences[i].strip() and len(sentences[i].strip()) > 5:
            reconstructed.append(sentences[i].strip())

        # Take only max_sentences
        if len(reconstructed) > max_sentences:
            truncated = ' '.join(reconstructed[:max_sentences])
        else:
            truncated = ' '.join(reconstructed)

        # Enforce character limit (approximately 200 chars for 2-3 sentences)
        if len(truncated) > 250:
            # Take first 250 chars and find last complete sentence
            truncated = truncated[:250]
            last_period = max(truncated.rfind('.'), truncated.rfind('!'), truncated.rfind('?'))
            if last_period > 50:  # Only truncate if we have a reasonable sentence
                truncated = truncated[:last_period + 1]

        return truncated.strip()

    def _clean_response(self, response: str) -> str:
        """
        Parse out thinking/reasoning tags and extract only the actual response content.
        """
        if not response:
            return "I'm here to help with your car hire needs. How can I assist you?"

        # Step 1: Look for the most recent complete response after thinking blocks
        # Split by thinking tags and take the last meaningful part
        thinking_splits = re.split(r'</?think[^>]*>|</?thinking[^>]*>|</?reasoning[^>]*>|</?redacted[^>]*>', response, flags=re.IGNORECASE)

        # Find the last part that looks like a proper response (not thinking content)
        for part in reversed(thinking_splits):
            part = part.strip()
            if (len(part) > 20 and
                not part.lower().startswith(('okay', 'let\'s', 'the user', 'i need to', 'maybe', 'also')) and
                not re.search(r'^(?:conversation|user|response|check|make sure|follow|keep|add)', part.lower()) and
                re.search(r'(?:hi|hello|welcome|aaa|accident|solutions|car|hire|help|assist)', part.lower())):
                response = part
                break

        # Step 2: Remove any remaining thinking tags and their content
        thinking_patterns = [
            r'<think[^>]*>.*?</think[^>]*>',
            r'<thinking[^>]*>.*?</thinking[^>]*>',
            r'<reasoning[^>]*>.*?</reasoning[^>]*>',
            r'<redacted_reasoning[^>]*>.*?</redacted_reasoning[^>]*>',
            r'<redacted[^>]*>.*?</redacted_reasoning[^>]*>',
        ]
        for pattern in thinking_patterns:
            response = re.sub(pattern, '', response, flags=re.IGNORECASE | re.DOTALL)

        # Step 3: If we still have thinking content mixed in, try to extract just the response part
        # Look for common response starters and take everything from there
        lines = response.split('\n')
        response_lines = []
        in_response = False

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Start collecting when we find response-like content
            if (re.search(r'^(?:Hi|Hello|Welcome|Thank|I\'m|We\'re|At|\*\*)', line, re.IGNORECASE) or
                re.search(r'(?:😊|🤝|welcome|assist|help)', line.lower())):
                in_response = True
                response_lines.append(line)
            elif in_response:
                # Stop if we hit thinking patterns
                if (re.search(r'<(?:think|thinking|reasoning|redacted)', line, re.IGNORECASE) or
                    re.search(r'^(?:Okay|Let\'s|The user|I need to|Maybe|Also)', line, re.IGNORECASE) or
                    re.search(r'^(?:conversation|user|response|check|make sure|follow|keep)', line.lower())):
                    break
                else:
                    response_lines.append(line)

        if response_lines:
            response = '\n'.join(response_lines).strip()

        # Step 4: Remove any remaining HTML/XML tags
        response = re.sub(r'<[^>]+>', '', response)

        # Step 5: Clean up whitespace
        response = re.sub(r'\n\s*\n\s*\n+', '\n\n', response)
        response = response.strip()

        # Step 6: If response is empty or too short, return default
        if not response or len(response) < 10:
            return "I'm here to help with your car hire needs. How can I assist you?"

        return response
