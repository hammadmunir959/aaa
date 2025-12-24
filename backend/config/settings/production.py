import os

from .base import *

# Production-specific settings
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

# Override ALLOWED_HOSTS from environment (required in production)
ALLOWED_HOSTS = (
    os.getenv("ALLOWED_HOSTS", "").split(",") if os.getenv("ALLOWED_HOSTS") else []
)
# Add internal Docker hostnames for nginx proxy
ALLOWED_HOSTS.extend(["app", "nginx", "localhost", "127.0.0.1"])
if not ALLOWED_HOSTS or ALLOWED_HOSTS == [""]:
    raise ValueError("ALLOWED_HOSTS must be set in production environment")

# CORS Configuration for Production
# Allow production domain and any additional origins from environment
CORS_ALLOWED_ORIGINS = os.getenv(
    "CORS_ALLOWED_ORIGINS", "https://aaa-as.co.uk,https://www.aaa-as.co.uk"
).split(",")
# Filter out empty strings
CORS_ALLOWED_ORIGINS = [
    origin.strip() for origin in CORS_ALLOWED_ORIGINS if origin.strip()
]

# In debug mode, allow localhost for CORS
if DEBUG:
    CORS_ALLOWED_ORIGINS.extend(
        [
            "http://localhost:8000",
            "http://127.0.0.1:8000",
        ]
    )

# Ensure CORS credentials are allowed for authenticated requests
CORS_ALLOW_CREDENTIALS = True

# Explicitly disallow all origins (security)
CORS_ALLOW_ALL_ORIGINS = False

# Allowed HTTP methods
CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

# Allowed headers
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# CSRF Trusted Origins (must match CORS origins for POST requests)
CSRF_TRUSTED_ORIGINS = os.getenv(
    "CSRF_TRUSTED_ORIGINS", "https://aaa-as.co.uk,https://www.aaa-as.co.uk"
).split(",")
# Filter out empty strings
CSRF_TRUSTED_ORIGINS = [
    origin.strip() for origin in CSRF_TRUSTED_ORIGINS if origin.strip()
]

# In debug mode, allow localhost for CSRF
if DEBUG:
    CSRF_TRUSTED_ORIGINS.extend(
        [
            "http://localhost:8000",
            "http://127.0.0.1:8000",
        ]
    )

# CSRF settings for API requests
CSRF_COOKIE_HTTPONLY = False  # Allow JavaScript to access CSRF cookie
# SameSite will be set below based on Secure setting

# Security settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
# SSL settings - disable for local Docker development
# Set to True only when behind a reverse proxy with SSL termination
SECURE_SSL_REDIRECT = os.getenv("SECURE_SSL_REDIRECT", "False").lower() == "true"
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

SESSION_COOKIE_SECURE = (
    os.getenv("SESSION_COOKIE_SECURE", "True").lower() == "true"
)  # Default True for production HTTPS
CSRF_COOKIE_SECURE = (
    os.getenv("CSRF_COOKIE_SECURE", "True").lower() == "true"
)  # Default True for production HTTPS

# When Secure=True, SameSite MUST be None for cross-origin cookie sharing
# This is REQUIRED for HTTPS sites that need to share cookies across origins
# Explicitly set to None for production HTTPS (default behavior)
_CSRF_SECURE = os.getenv("CSRF_COOKIE_SECURE", "True").lower() == "true"
_SESSION_SECURE = os.getenv("SESSION_COOKIE_SECURE", "True").lower() == "true"

CSRF_COOKIE_SAMESITE = "None" if _CSRF_SECURE else "Lax"
SESSION_COOKIE_SAMESITE = "None" if _SESSION_SECURE else "Lax"

# Override Django defaults explicitly
if CSRF_COOKIE_SECURE:
    CSRF_COOKIE_SAMESITE = "None"
if SESSION_COOKIE_SECURE:
    SESSION_COOKIE_SAMESITE = "None"

# Force override at the end to ensure it's set correctly
# Django may have defaults that override our settings, so we set it explicitly here
if CSRF_COOKIE_SECURE:
    CSRF_COOKIE_SAMESITE = "None"
if SESSION_COOKIE_SECURE:
    SESSION_COOKIE_SAMESITE = "None"
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

# Media files - override MEDIA_ROOT for production Docker setup
# Media is mounted at /app/media in docker-compose.prod.yml
import os

if os.path.exists("/app/media"):
    MEDIA_ROOT = "/app/media"
else:
    # Fallback to default if not in Docker
    MEDIA_ROOT = BASE_DIR / "media"

# Disable Django's built-in CSP to use our custom one
SECURE_CONTENT_SECURITY_POLICY = None

# Site URL for production
SITE_URL = os.getenv("SITE_URL", "https://aaa-as.co.uk")

# Static files served by web server
STATICFILES_STORAGE = "django.contrib.staticfiles.storage.ManifestStaticFilesStorage"

# Production logging - use console only to avoid file permission issues in containers
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {
        "add_request_id": {
            "()": "utils.logging_filters.RequestIDFilter",
        },
    },
    "formatters": {
        "structured": {
            "format": "[{asctime}] {levelname} {name} {message} (request_id={request_id})",
            "style": "{",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "console": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "formatter": "structured",
            "filters": ["add_request_id"],
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "django.request": {
            "handlers": ["console"],
            "level": "ERROR",
            "propagate": False,
        },
        "django.server": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "django.db.backends": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "utils": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "chatbot": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
    },
}

# CRITICAL: Force CSRF and Session cookie SameSite to None for HTTPS production
# This MUST be at the end to override any Django defaults
# When Secure=True, SameSite MUST be None for cross-origin cookie sharing
# Force to None unconditionally for production HTTPS
CSRF_COOKIE_SAMESITE = "None"
SESSION_COOKIE_SAMESITE = "None"
