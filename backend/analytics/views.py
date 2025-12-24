from datetime import timedelta

from django.db.models import Avg, Case, CharField, Count, Q, Sum, Value, When
from django.db.models.functions import ExtractHour, TruncDate, TruncMonth
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from bookings.models import Claim
from car_sales.models import CarListing, CarPurchaseRequest
from faq.models import FAQ
from gallery.models import GalleryImage
from inquiries.models import Inquiry
from newsletter.models import NewsletterSubscriber
from testimonials.models import Testimonial
from utils.cache import cache_result
from vehicles.models import Vehicle

from .cache import (
    BOOKING_TRENDS_CACHE_PREFIX,
    DASHBOARD_SUMMARY_CACHE_PREFIX,
)
from .models import ActivityLog, PageView, VisitorSession
from .serializers import ActivityLogSerializer, NotificationSerializer
from .utils import get_activity_icon

SEARCH_DOMAINS = ["google", "bing", "yahoo", "duckduckgo"]
SOCIAL_DOMAINS = ["facebook", "instagram", "linkedin", "twitter", "t.co", "x.com"]
TABLET_KEYWORDS = ["ipad", "tablet"]
MOBILE_KEYWORDS = ["mobile", "iphone", "android"]


class ActivityLogPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = "page_size"
    max_page_size = 100


def _safe_percentage(value: int | float, total: int | float) -> float:
    if not total:
        return 0.0
    return round((value / total) * 100, 2)


def _build_keyword_query(field: str, keywords: list[str]) -> Q:
    matcher = Q(pk__in=[])
    for keyword in keywords:
        matcher |= Q(**{f"{field}__icontains": keyword})
    return matcher


def _build_referrer_case() -> Case:
    search_q = _build_keyword_query("referrer", SEARCH_DOMAINS)
    social_q = _build_keyword_query("referrer", SOCIAL_DOMAINS)

    return Case(
        When(Q(referrer__isnull=True) | Q(referrer__exact=""), then=Value("Direct")),
        When(search_q, then=Value("Search")),
        When(social_q, then=Value("Social")),
        When(Q(referrer__icontains="email"), then=Value("Email")),
        default=Value("Referral"),
        output_field=CharField(),
    )


def _build_device_case() -> Case:
    tablet_q = _build_keyword_query("user_agent", TABLET_KEYWORDS)
    mobile_q = _build_keyword_query("user_agent", MOBILE_KEYWORDS)

    return Case(
        When(
            Q(user_agent__isnull=True) | Q(user_agent__exact=""), then=Value("Unknown")
        ),
        When(tablet_q, then=Value("Tablet")),
        When(mobile_q, then=Value("Mobile")),
        default=Value("Desktop"),
        output_field=CharField(),
    )


@cache_result(timeout=300, key_prefix=DASHBOARD_SUMMARY_CACHE_PREFIX)
def _build_dashboard_summary() -> dict:
    now = timezone.now()
    today = now.date()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)

    data = {
        "totalVehicles": Vehicle.objects.count(),
        "totalBookings": Claim.objects.count(),
        "inquiries": Claim.objects.filter(created_at__date=today).count(),
        "testimonials": Testimonial.objects.filter(status="approved").count(),
        "carListings": CarListing.objects.filter(status="published").count(),
        "purchaseRequests": CarPurchaseRequest.objects.count(),
        "galleryImages": GalleryImage.objects.filter(is_active=True).count(),
        "newsletterSubscribers": NewsletterSubscriber.objects.filter(
            is_active=True
        ).count(),
        "faqItems": FAQ.objects.filter(is_active=True).count(),
    }

    # Use VisitorSession for more accurate unique visitor counting
    # For unique visitors, we count distinct authenticated users OR distinct anonymous sessions
    # This provides more accurate counts: same authenticated user = 1 visitor, different anonymous sessions = separate visitors

    # For today: sessions that had activity today
    today_start = timezone.make_aware(
        timezone.datetime.combine(today, timezone.datetime.min.time())
    )
    authenticated_today = (
        VisitorSession.objects.filter(last_activity__date=today, user__isnull=False)
        .values("user_id")
        .distinct()
        .count()
    )

    anonymous_today = (
        VisitorSession.objects.filter(last_activity__date=today, user__isnull=True)
        .exclude(session_id="")
        .values("session_id")
        .distinct()
        .count()
    )

    unique_visitors_today = authenticated_today + anonymous_today

    # For week/month: sessions with activity in the period
    authenticated_week = (
        VisitorSession.objects.filter(last_activity__gte=week_ago, user__isnull=False)
        .values("user_id")
        .distinct()
        .count()
    )

    anonymous_week = (
        VisitorSession.objects.filter(last_activity__gte=week_ago, user__isnull=True)
        .exclude(session_id="")
        .values("session_id")
        .distinct()
        .count()
    )

    unique_visitors_week = authenticated_week + anonymous_week

    authenticated_month = (
        VisitorSession.objects.filter(last_activity__gte=month_ago, user__isnull=False)
        .values("user_id")
        .distinct()
        .count()
    )

    anonymous_month = (
        VisitorSession.objects.filter(last_activity__gte=month_ago, user__isnull=True)
        .exclude(session_id="")
        .values("session_id")
        .distinct()
        .count()
    )

    unique_visitors_month = authenticated_month + anonymous_month

    data.update(
        {
            "pageViewsToday": PageView.objects.filter(viewed_at__date=today).count(),
            "pageViewsWeek": PageView.objects.filter(viewed_at__gte=week_ago).count(),
            "pageViewsMonth": PageView.objects.filter(viewed_at__gte=month_ago).count(),
            "uniqueVisitorsToday": unique_visitors_today,
            "uniqueVisitorsWeek": unique_visitors_week,
            "uniqueVisitorsMonth": unique_visitors_month,
        }
    )

    return data


@cache_result(timeout=900, key_prefix=BOOKING_TRENDS_CACHE_PREFIX)
def _build_booking_trends() -> list[dict]:
    end_date = timezone.now()
    start_date = end_date - timedelta(days=240)  # 8 months

    def get_monthly_counts(queryset, date_field: str):
        return (
            queryset.filter(
                **{f"{date_field}__gte": start_date, f"{date_field}__lte": end_date}
            )
            .annotate(month=TruncMonth(date_field))
            .values("month")
            .annotate(total=Count("id"))
            .order_by("month")
        )

    def to_lookup(data):
        lookup = {}
        for entry in data:
            month_key = entry["month"].strftime("%B %Y")
            lookup[month_key] = entry["total"]
        return lookup

    bookings_lookup = to_lookup(get_monthly_counts(Claim.objects, "created_at"))
    inquiries_lookup = to_lookup(get_monthly_counts(Inquiry.objects, "created_at"))
    purchase_lookup = to_lookup(
        get_monthly_counts(CarPurchaseRequest.objects, "created_at")
    )

    months = []
    current_date = start_date.replace(day=1)
    while current_date <= end_date:
        months.append(current_date.strftime("%B %Y"))
        if current_date.month == 12:
            current_date = current_date.replace(year=current_date.year + 1, month=1)
        else:
            current_date = current_date.replace(month=current_date.month + 1)

    result = [
        {
            "month": month_key,
            "bookings": bookings_lookup.get(month_key, 0),
            "inquiries": inquiries_lookup.get(month_key, 0),
            "purchaseRequests": purchase_lookup.get(month_key, 0),
        }
        for month_key in months
    ]

    return result[-8:]


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    """Get dashboard summary statistics"""
    return Response(_build_dashboard_summary())


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def booking_trends(request):
    """Get multi-metric trends for the last 8 months"""
    return Response(_build_booking_trends())


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def vehicle_usage(request):
    """Get vehicle usage distribution"""
    usage_data = (
        Vehicle.objects.values("type").annotate(count=Count("id")).order_by("-count")
    )

    total_vehicles = Vehicle.objects.count()
    result = []

    for item in usage_data:
        result.append(
            {
                "name": dict(Vehicle.TYPE_CHOICES)[item["type"]],
                "value": item["count"],
                "percentage": (
                    round((item["count"] / total_vehicles) * 100, 1)
                    if total_vehicles > 0
                    else 0
                ),
            }
        )

    return Response(result)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recent_activity(request):
    """Get recent activity feed"""
    queryset = ActivityLog.objects.select_related("user").order_by("-created_at")
    paginator = ActivityLogPagination()
    page = paginator.paginate_queryset(queryset, request)
    serializer = ActivityLogSerializer(page, many=True)

    if request.query_params.get("page"):
        return paginator.get_paginated_response(serializer.data)

    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def activity_log(request):
    """Return paginated activity log with optional filters."""
    queryset = ActivityLog.objects.select_related("user").order_by("-created_at")

    activity_type = request.query_params.get("type")
    search_query = request.query_params.get("q")

    if activity_type:
        queryset = queryset.filter(activity_type=activity_type)

    if search_query:
        queryset = queryset.filter(
            Q(description__icontains=search_query)
            | Q(user__first_name__icontains=search_query)
            | Q(user__last_name__icontains=search_query)
            | Q(user__email__icontains=search_query)
        )

    paginator = ActivityLogPagination()
    paginated_queryset = paginator.paginate_queryset(queryset, request)
    serializer = ActivityLogSerializer(paginated_queryset, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def notifications(request):
    """Get notifications for the current user."""
    # Filter by recipient = current user
    queryset = (
        ActivityLog.objects.filter(recipient=request.user)
        .select_related("user", "recipient")
        .order_by("-created_at")
    )

    # Filter out expired notifications
    queryset = queryset.filter(
        Q(expires_at__isnull=True) | Q(expires_at__gt=timezone.now())
    )

    # Optional filters
    is_read = request.query_params.get("is_read")
    if is_read is not None:
        queryset = queryset.filter(is_read=is_read.lower() == "true")

    notification_type = request.query_params.get("type")
    if notification_type:
        queryset = queryset.filter(notification_type=notification_type)

    # If no page parameter, return all results (not paginated)
    # This is more efficient for dropdown notifications
    if not request.query_params.get("page"):
        serializer = NotificationSerializer(
            queryset[:50], many=True
        )  # Limit to 50 for dropdown
        return Response(serializer.data)

    # If page parameter exists, return paginated response
    paginator = ActivityLogPagination()
    paginated_queryset = paginator.paginate_queryset(queryset, request)
    serializer = NotificationSerializer(paginated_queryset, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def notification_unread_count(request):
    """Get count of unread notifications for current user."""
    count = (
        ActivityLog.objects.filter(recipient=request.user, is_read=False)
        .filter(Q(expires_at__isnull=True) | Q(expires_at__gt=timezone.now()))
        .count()
    )

    return Response({"unread_count": count})


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def notification_mark_read(request, notification_id):
    """Mark a notification as read."""
    try:
        notification = ActivityLog.objects.get(
            id=notification_id,
            recipient=request.user,  # Ensure user owns this notification
        )
        notification.mark_as_read()
        serializer = NotificationSerializer(notification)
        return Response(serializer.data)
    except ActivityLog.DoesNotExist:
        return Response(
            {"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def notification_mark_all_read(request):
    """Mark all notifications as read for current user."""
    updated = ActivityLog.objects.filter(recipient=request.user, is_read=False).update(
        is_read=True, read_at=timezone.now()
    )

    return Response(
        {"message": f"Marked {updated} notifications as read", "updated_count": updated}
    )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def notification_delete(request, notification_id):
    """Delete a notification."""
    try:
        notification = ActivityLog.objects.get(
            id=notification_id,
            recipient=request.user,  # Ensure user owns this notification
        )
        notification.delete()
        return Response(
            {"message": "Notification deleted"}, status=status.HTTP_204_NO_CONTENT
        )
    except ActivityLog.DoesNotExist:
        return Response(
            {"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def web_analytics_overview(request):
    """Provide detailed website analytics for the dashboard."""
    period_param = request.query_params.get("period", "30d")
    period_map = {
        "7d": 7,
        "30d": 30,
        "90d": 90,
    }
    days = period_map.get(period_param, 30)
    days = max(days, 1)

    now = timezone.now()
    start = (now - timedelta(days=days - 1)).replace(
        hour=0, minute=0, second=0, microsecond=0
    )

    pageviews_qs = PageView.objects.filter(viewed_at__gte=start, viewed_at__lte=now)
    visitor_sessions_qs = VisitorSession.objects.filter(last_activity__gte=start)

    total_views = pageviews_qs.count()

    # Improved unique visitor counting:
    # - For authenticated users: count distinct user_id
    # - For anonymous users: count distinct session_id (excluding empty)
    # - This provides more accurate unique visitor counts
    authenticated_visitors = (
        VisitorSession.objects.filter(last_activity__gte=start, user__isnull=False)
        .values("user_id")
        .distinct()
        .count()
    )

    anonymous_visitors = (
        VisitorSession.objects.filter(last_activity__gte=start, user__isnull=True)
        .exclude(session_id="")
        .values("session_id")
        .distinct()
        .count()
    )

    unique_visitors = authenticated_visitors + anonymous_visitors
    total_sessions = visitor_sessions_qs.count()

    # Filter valid sessions for averages (exclude 0-page sessions and potential anomalies)
    valid_sessions_qs = visitor_sessions_qs.filter(page_views_count__gt=0)

    avg_session_duration = (
        valid_sessions_qs.filter(
            duration_seconds__isnull=False,
            duration_seconds__lt=86400,  # Exclude sessions > 24 hours (legacy data anomalies)
        ).aggregate(avg=Avg("duration_seconds"))["avg"]
        or 0
    )

    total_duration = (
        valid_sessions_qs.filter(
            duration_seconds__isnull=False,
            duration_seconds__lt=86400,  # Exclude sessions > 24 hours (legacy data anomalies)
        ).aggregate(total=Sum("duration_seconds"))["total"]
        or 0
    )

    avg_pages_per_session = (
        valid_sessions_qs.aggregate(avg=Avg("page_views_count"))["avg"] or 0
    )

    bounce_sessions = valid_sessions_qs.filter(page_views_count__lte=1).count()
    returning_sessions = valid_sessions_qs.filter(page_views_count__gte=3).count()

    # Get daily page views
    raw_daily_pageviews = list(
        pageviews_qs.annotate(day=TruncDate("viewed_at"))
        .values("day")
        .annotate(views=Count("id"))
    )
    daily_pageviews_lookup = {
        entry["day"]: entry["views"] for entry in raw_daily_pageviews
    }

    # Get daily unique visitors from VisitorSession (more accurate)
    # Count authenticated users + anonymous sessions separately, then combine
    raw_daily_authenticated = list(
        VisitorSession.objects.filter(last_activity__gte=start, user__isnull=False)
        .annotate(day=TruncDate("last_activity"))
        .values("day")
        .annotate(visitors=Count("user_id", distinct=True))
    )

    raw_daily_anonymous = list(
        VisitorSession.objects.filter(last_activity__gte=start, user__isnull=True)
        .annotate(day=TruncDate("last_activity"))
        .exclude(session_id="")
        .values("day")
        .annotate(visitors=Count("session_id", distinct=True))
    )

    # Combine authenticated and anonymous counts by day
    daily_visitors_lookup = {}
    for entry in raw_daily_authenticated:
        day = entry["day"]
        daily_visitors_lookup[day] = (
            daily_visitors_lookup.get(day, 0) + entry["visitors"]
        )
    for entry in raw_daily_anonymous:
        day = entry["day"]
        daily_visitors_lookup[day] = (
            daily_visitors_lookup.get(day, 0) + entry["visitors"]
        )

    traffic_trend = []
    for offset in range(days):
        current_day = (start + timedelta(days=offset)).date()
        traffic_trend.append(
            {
                "date": current_day.isoformat(),
                "views": daily_pageviews_lookup.get(current_day, 0),
                "uniqueVisitors": daily_visitors_lookup.get(current_day, 0),
            }
        )

    raw_hourly = list(
        pageviews_qs.annotate(hour=ExtractHour("viewed_at"))
        .values("hour")
        .annotate(views=Count("id"))
    )
    hourly_lookup = {entry["hour"]: entry["views"] for entry in raw_hourly}
    hourly_distribution = [
        {"hour": hour, "views": hourly_lookup.get(hour, 0)} for hour in range(24)
    ]

    # Filter out admin/internal pages, auth routes, and static files - only show public website pages
    public_pages_qs = pageviews_qs.exclude(
        # Admin routes
        Q(page_path__startswith="/admin/")
        | Q(page_path__startswith="/api/")
        | Q(page_path__startswith="/django-admin/")
        | Q(page_path__startswith="/super-admin/")
        | Q(page_path__startswith="/cms/")
        | Q(page_path__startswith="/backup/")
        | Q(page_path__startswith="/theming/")
        |
        # Auth routes
        Q(page_path__startswith="/auth/")
        |
        # System/hidden files (security concern - should not be accessible)
        Q(page_path__startswith="/.")
        |
        # Static files and assets
        Q(page_path__endswith=".svg")
        | Q(page_path__endswith=".png")
        | Q(page_path__endswith=".jpg")
        | Q(page_path__endswith=".jpeg")
        | Q(page_path__endswith=".gif")
        | Q(page_path__endswith=".webp")
        | Q(page_path__endswith=".ico")
        | Q(page_path__endswith=".css")
        | Q(page_path__endswith=".js")
        | Q(page_path__endswith=".txt")
        | Q(page_path__endswith=".xml")
        |
        # Other internal/system paths
        Q(page_path__startswith="/static/")
        | Q(page_path__startswith="/media/")
        | Q(page_path__startswith="/assets/")
        | Q(page_path__startswith="/fonts/")
    )

    # Calculate total views for public pages only (for accurate share calculation)
    total_public_views = public_pages_qs.count()

    top_pages_qs = list(
        public_pages_qs.values("page_path", "page_title")
        .annotate(views=Count("id"))
        .order_by("-views")[:8]
    )
    top_pages = [
        {
            "path": item["page_path"],
            "title": item["page_title"],
            "views": item["views"],
            "share": _safe_percentage(item["views"], total_public_views),
        }
        for item in top_pages_qs
    ]

    source_counts = (
        pageviews_qs.annotate(source=_build_referrer_case())
        .values("source")
        .annotate(views=Count("id"))
        .order_by("-views")
    )
    traffic_sources = [
        {
            "source": entry["source"],
            "views": entry["views"],
            "percentage": _safe_percentage(entry["views"], total_views),
        }
        for entry in source_counts[:6]
    ]

    device_counts = (
        pageviews_qs.annotate(device=_build_device_case())
        .values("device")
        .annotate(views=Count("id"))
        .order_by("-views")
    )
    device_breakdown = [
        {
            "device": entry["device"],
            "views": entry["views"],
            "percentage": _safe_percentage(entry["views"], total_views),
        }
        for entry in device_counts
    ]

    response_payload = {
        "period": period_param if period_param in period_map else "30d",
        "range": {
            "start": start.isoformat(),
            "end": now.isoformat(),
        },
        "headline": {
            "totalViews": total_views,
            "uniqueVisitors": unique_visitors,
            "totalSessions": total_sessions,
            "avgSessionDurationSeconds": round(avg_session_duration, 2),
            "avgPagesPerSession": round(avg_pages_per_session or 0, 2),
            "viewerMinutes": round(total_duration / 60, 2),
            "bounceRate": round(_safe_percentage(bounce_sessions, total_sessions), 2),
            "returningVisitorRate": round(
                _safe_percentage(returning_sessions, total_sessions), 2
            ),
        },
        "trafficTrend": traffic_trend,
        "hourlyDistribution": hourly_distribution,
        "topPages": top_pages,
        "trafficSources": traffic_sources,
        "deviceBreakdown": device_breakdown,
        "engagement": {
            "sessions": total_sessions,
            "avgSessionDurationSeconds": round(avg_session_duration, 2),
            "avgPagesPerSession": round(avg_pages_per_session or 0, 2),
            "totalDurationSeconds": total_duration,
        },
    }

    return Response(response_payload)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def chatbot_stats(request):
    """Get chatbot usage statistics"""
    from django.db.models import Avg, Count

    from chatbot.models import Conversation, ConversationMessage

    # Basic stats
    total_conversations = Conversation.objects.count()
    total_messages = ConversationMessage.objects.count()
    leads_generated = Conversation.objects.filter(is_lead=True).count()

    # Average response time (if available)
    avg_response_time = ConversationMessage.objects.filter(
        response_time_ms__isnull=False
    ).aggregate(avg_time=Avg("response_time_ms"))["avg_time"]

    return Response(
        {
            "totalConversations": total_conversations,
            "totalMessages": total_messages,
            "leadsCollected": leads_generated,
            "avgResponseTime": (
                f"{avg_response_time:.0f}ms" if avg_response_time else "N/A"
            ),
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def fleet_status(request):
    """Get current fleet availability status"""
    status_counts = Vehicle.objects.values("status").annotate(count=Count("id"))

    # Initialize with 0 for all known statuses
    data = {"available": 0, "booked": 0, "maintenance": 0}

    for item in status_counts:
        status_key = item["status"]
        if status_key in data:
            data[status_key] = item["count"]

    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def sales_pipeline(request):
    """Get sales pipeline value from active purchase requests"""
    # Active statuses that count towards pipeline
    active_statuses = [
        "pending",
        "contacted",
        "viewing_scheduled",
        "offer_made",
        "accepted",
    ]

    pipeline_data = CarPurchaseRequest.objects.filter(
        status__in=active_statuses, offer_price__isnull=False
    ).aggregate(total_value=Sum("offer_price"), count=Count("id"))

    return Response(
        {
            "totalValue": pipeline_data["total_value"] or 0,
            "activeRequests": pipeline_data["count"] or 0,
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def upcoming_returns(request):
    """Get vehicles returning in the next 3 days"""
    today = timezone.now().date()
    three_days_later = today + timedelta(days=3)

    returns = (
        Claim.objects.filter(
            status="approved", end_date__gte=today, end_date__lte=three_days_later
        )
        .select_related("vehicle")
        .order_by("end_date")[:5]
    )

    data = []
    for claim in returns:
        data.append(
            {
                "id": claim.id,
                "vehicle": str(claim.vehicle),
                "customer": f"{claim.first_name} {claim.last_name}",
                "returnDate": claim.end_date,
                "daysRemaining": (claim.end_date - today).days,
            }
        )

    return Response(data)
