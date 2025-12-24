"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from django.urls import include, path, re_path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework_simplejwt.views import TokenRefreshView

from chatbot import (
    views as chatbot_views,  # Provide direct names for public chatbot endpoints
)
from config import views as config_views
from config.sitemaps import sitemaps
from inquiries.views import generate_captcha

urlpatterns = [
    # Serve the frontend SPA at the root URL (no auth required)
    path("", config_views.frontend_app, name="frontend-root"),
    # Health check endpoints (public, no auth required)
    path("health/", config_views.health_check, name="health"),
    path("ready/", config_views.readiness_check, name="ready"),
    path("live/", config_views.liveness_check, name="live"),
    # SEO: Sitemap (public, no auth required)
    path(
        "sitemap.xml",
        sitemap,
        {"sitemaps": sitemaps},
        name="django.contrib.sitemaps.views.sitemap",
    ),
    # Admin routes - /admin/ and /admin/home/ are handled by frontend React app
    # Only keep the Django admin panel route
    path("django-admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls", namespace="accounts")),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/theming/", include("theming.urls", namespace="theming")),
    path("api/", include("vehicles.urls", namespace="vehicles")),
    path("api/", include("bookings.urls", namespace="bookings")),
    path("api/", include("inquiries.urls", namespace="inquiries")),
    path("api/", include("testimonials.urls", namespace="testimonials")),
    path("api/", include("blog.urls", namespace="blog")),
    path("api/", include("car_sales.urls", namespace="car_sales")),
    path("api/cms/", include("cms.urls", namespace="cms")),
    path("api/analytics/", include("analytics.urls", namespace="analytics")),
    path("api/chatbot/", include("chatbot.urls", namespace="chatbot")),
    path("api/newsletter/", include("newsletter.urls", namespace="newsletter")),
    path("api/gallery/", include("gallery.urls", namespace="gallery")),
    path("api/", include("faq.urls", namespace="faq")),
    path("api/backup/", include("backup.urls", namespace="backup")),
    path(
        "api/metrics/", include("config.metrics_urls", namespace="metrics")
    ),  # Metrics endpoints
    # Public chatbot endpoints (global names for backwards compatibility with tests/clients)
    path("api/chatbot/message/", chatbot_views.chatbot_message, name="chatbot-message"),
    path(
        "api/chatbot/messages/",
        chatbot_views.get_conversation_messages,
        name="get_conversation_messages",
    ),
    # vvv DEPRECATED FALLBACK ROUTES vvv
    # These routes are maintained for backward compatibility with frontend clients
    # that haven't updated to the new /api/ prefix yet.
    # ------------------------------------------------------------------------
    # Fallback paths for chatbot (if frontend is missing /api prefix)
    path(
        "chatbot/message/", chatbot_views.chatbot_message, name="chatbot-message-direct"
    ),
    path(
        "chatbot/messages/",
        chatbot_views.get_conversation_messages,
        name="get_conversation_messages-direct",
    ),
    # Fallback paths for auth endpoints
    path("auth/", include("accounts.urls", namespace="accounts_fallback")),
    # Fallback path for theming endpoints
    path("theming/", include("theming.urls", namespace="theming_fallback")),
    # Other Fallbacks
    path("analytics/", include("analytics.urls", namespace="analytics_fallback")),
    path("vehicles/", include("vehicles.urls", namespace="vehicles_fallback")),
    path("bookings/", include("bookings.urls", namespace="bookings_fallback")),
    path("", include("inquiries.urls", namespace="inquiries_fallback")),
    path(
        "testimonials/", include("testimonials.urls", namespace="testimonials_fallback")
    ),
    path("blog/", include("blog.urls", namespace="blog_fallback")),
    path("car_sales/", include("car_sales.urls", namespace="car_sales_fallback")),
    path("cms/", include("cms.urls", namespace="cms_fallback")),
    path("newsletter/", include("newsletter.urls", namespace="newsletter_fallback")),
    path("gallery/", include("gallery.urls", namespace="gallery_fallback")),
    path("faq/", include("faq.urls", namespace="faq_fallback")),
    path(
        "cookies/", include("cookie_consent.urls", namespace="cookie_consent_fallback")
    ),
    path("backup/", include("backup.urls", namespace="backup_fallback")),
    path("metrics/", include("config.metrics_urls", namespace="metrics_fallback")),
    # ------------------------------------------------------------------------
    # ^^^ END DEPRECATED ROUTES ^^^
    # Fallback for car sales endpoints (often called without /api prefix)
    # The generic empty include for car_sales was capturing the root URL and causing auth errors.
    # It has been commented out. Specific car_sales routes should be prefixed (e.g., 'car_sales/')
    # path('', include('car_sales.urls')),
    # Captcha endpoint
    path("api/captcha/", generate_captcha, name="generate-captcha"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    # Explicit admin routes for frontend SPA - these should be handled by React Router
    # Match /admin, /admin/, and any path starting with /admin/
    re_path(r"^admin.*", config_views.frontend_app, name="admin-frontend"),
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]

# Serve media files - also serve in production as fallback (nginx should handle this)
# But this ensures Django can serve media if nginx is not configured
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    # Serve static files from staticfiles directory
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Serve frontend assets from assets directory
# Serve frontend assets from assets directory - Explicitly handle this to ensure it works
if settings.FRONTEND_DIST_ASSETS_DIR.exists():
    from django.views.static import serve as static_serve

    urlpatterns += [
        re_path(
            r"^assets/(?P<path>.*)$",
            static_serve,
            {
                "document_root": str(settings.FRONTEND_DIST_ASSETS_DIR),
            },
        ),
    ]

# Serve frontend fonts
# Serve frontend fonts - Explicitly handle this too
if settings.FRONTEND_DIST_FONTS_DIR.exists():
    urlpatterns += [
        re_path(
            r"^fonts/(?P<path>.*)$",
            static_serve,
            {
                "document_root": str(settings.FRONTEND_DIST_FONTS_DIR),
            },
        ),
    ]

# Serve root-level frontend files (videos, images, etc.) that are in frontend_dist root
# This needs to be done carefully to not interfere with API routes or SPA routing
# Serve in both DEBUG and production (nginx should handle this, but Django fallback is safer)
if settings.FRONTEND_DIST_DIR.exists():
    from django.views.static import serve as static_serve

    # Serve static files from frontend_dist root (videos, images, favicon, etc.)
    # Only match specific file extensions to avoid conflicts with SPA routing
    # Pattern allows letters, numbers, spaces, hyphens, underscores, dots in filename
    frontend_static_extensions = [
        "mp4",
        "jpg",
        "jpeg",
        "png",
        "gif",
        "svg",
        "webp",
        "ico",
        "txt",
        "xml",
    ]
    frontend_static_pattern = (
        rf'^(?P<path>[^/]+\.({"|".join(frontend_static_extensions)}))$'
    )

    def serve_frontend_static(request, path):
        """Serve static files from frontend_dist root directory"""
        from django.http import Http404

        file_path = settings.FRONTEND_DIST_DIR / path
        # Exclude files that are in subdirectories (already handled by other patterns)
        if "assets/" in path or "fonts/" in path:
            raise Http404("File not found")
        if file_path.exists() and file_path.is_file():
            return static_serve(
                request, path, document_root=str(settings.FRONTEND_DIST_DIR)
            )
        raise Http404("File not found")

    urlpatterns += [
        re_path(frontend_static_pattern, serve_frontend_static, name="frontend-static"),
    ]

urlpatterns += [
    re_path(
        # Fallback for SPA routes - catch all non-API routes for frontend React app
        # Note: admin/ routes are already handled above, so we exclude them here
        r"^(?!api/)(?!admin)(?!django-admin/)(?!media/)(?!static/)(?!assets/)(?!fonts/)(?!health/)(?!ready/)(?!live/).*$",  # fallback for SPA routes (exclude static file patterns)
        config_views.frontend_app,
        name="frontend-app",
    ),
]

# Custom 404 handler to avoid Django debug page URL pattern rendering issues
handler404 = config_views.custom_404_handler
