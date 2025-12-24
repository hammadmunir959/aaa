"""
URL configuration for backup management API.
"""

from django.urls import path

from . import views

app_name = "backup"

urlpatterns = [
    path("stats/", views.backup_stats, name="backup-stats"),
    path("list/", views.backup_list, name="backup-list"),
    path("create/", views.backup_create, name="backup-create"),
    path("verify/", views.backup_verify, name="backup-verify"),
    path("cleanup/", views.backup_cleanup, name="backup-cleanup"),
    path("config/", views.backup_config, name="backup-config"),
    path("download/<str:filename>/", views.backup_download, name="backup-download"),
    path("task/<str:task_id>/", views.backup_task_status, name="backup-task-status"),
]
