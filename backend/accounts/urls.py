from django.urls import path

from . import views

app_name = "accounts"

urlpatterns = [
    # CSRF token endpoint
    path("csrf/", views.csrf_token_view, name="csrf_token"),
    # Authentication endpoints
    path("register/", views.register_admin, name="register"),
    path("login/", views.login_admin, name="login"),
    # OTP verification endpoints
    path("verify-otp/", views.verify_otp, name="verify_otp"),
    path("resend-otp/", views.resend_verification_otp, name="resend_otp"),
    # Password reset endpoints
    path(
        "password/request-reset/",
        views.request_password_reset,
        name="request_password_reset",
    ),
    path("password/reset/", views.reset_password, name="reset_password"),
    # User management endpoints
    path("me/", views.get_current_user, name="current_user"),
    path("admins/", views.list_admin_requests, name="list_admins"),
    path(
        "admins/<int:user_id>/status/",
        views.update_admin_status,
        name="update_admin_status",
    ),
    path("users/<int:user_id>/", views.delete_admin, name="delete_admin"),
]
