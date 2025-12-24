from django.urls import path

from . import views

app_name = "analytics"

urlpatterns = [
    path("dashboard/summary/", views.dashboard_summary, name="dashboard_summary"),
    path("dashboard/booking-trends/", views.booking_trends, name="booking_trends"),
    path("dashboard/vehicle-usage/", views.vehicle_usage, name="vehicle_usage"),
    path("dashboard/recent-activity/", views.recent_activity, name="recent_activity"),
    path("dashboard/activity-log/", views.activity_log, name="activity_log"),
    path("dashboard/chatbot-stats/", views.chatbot_stats, name="chatbot_stats"),
    path(
        "dashboard/web-overview/",
        views.web_analytics_overview,
        name="web_analytics_overview",
    ),
    # New Analytics Endpoints
    path("dashboard/fleet-status/", views.fleet_status, name="fleet_status"),
    path("dashboard/sales-pipeline/", views.sales_pipeline, name="sales_pipeline"),
    path(
        "dashboard/upcoming-returns/", views.upcoming_returns, name="upcoming_returns"
    ),
    # Notification endpoints
    path("notifications/", views.notifications, name="notifications"),
    path(
        "notifications/unread-count/",
        views.notification_unread_count,
        name="notification_unread_count",
    ),
    path(
        "notifications/<int:notification_id>/read/",
        views.notification_mark_read,
        name="notification_mark_read",
    ),
    path(
        "notifications/mark-all-read/",
        views.notification_mark_all_read,
        name="notification_mark_all_read",
    ),
    path(
        "notifications/<int:notification_id>/",
        views.notification_delete,
        name="notification_delete",
    ),
]
