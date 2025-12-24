import random
from datetime import timedelta
from typing import Optional, Tuple

import requests
from django.conf import settings
from django.core.cache import cache
from django.utils import timezone


def generate_simple_captcha() -> Tuple[str, int]:
    """
    Generate a simple math captcha question and answer.

    Returns:
        tuple: (question_string, correct_answer)
    """
    # Generate two random numbers between 1 and 20
    num1 = random.randint(1, 20)
    num2 = random.randint(1, 20)


def validate_recaptcha(token: str, ip_address: Optional[str] = None) -> bool:
    """
    Legacy reCAPTCHA validation function (deprecated).
    Now returns True for backward compatibility.
    """
    # For backward compatibility, always return True
    # This function is being phased out in favor of simple_captcha
    return True


def check_rate_limit(
    ip_address: str, action_type: str, max_requests: int = 3, window_minutes: int = 60
) -> bool:
    """
    Simple rate limiter based on IP address and action type.
    Returns True if the limit is exceeded.
    """
    cache_key = f"rate_limit:{action_type}:{ip_address}"
    now = timezone.now()
    window_start = now - timedelta(minutes=window_minutes)

    request_times = cache.get(cache_key, [])
    request_times = [
        timestamp for timestamp in request_times if timestamp > window_start
    ]

    if len(request_times) >= max_requests:
        return True

    request_times.append(now)
    cache.set(cache_key, request_times, window_minutes * 60)
    return False
