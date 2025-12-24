import random
import string
from datetime import timedelta

from django.contrib.auth import authenticate
from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from utils.email import notify_super_admin_of_admin_request, send_otp_email
from utils.permissions import IsSuperAdmin
from utils.response import error_response, success_response
from utils.security_logging import SecurityAuditLogger

from .models import OTPVerification, User
from .serializers import (
    AdminLoginSerializer,
    AdminRegistrationSerializer,
    OTPVerificationSerializer,
    PasswordResetSerializer,
    UserSerializer,
)


def _generate_otp(length: int = 6) -> str:
    """Generate numeric OTP of given length."""
    return "".join(random.choices(string.digits, k=length))


def _issue_otp(email: str, purpose: str) -> str:
    """Create (or refresh) an OTP for a specific purpose and email."""
    # Mark existing unused OTPs for the same purpose as used
    OTPVerification.objects.filter(email=email, purpose=purpose, is_used=False).update(
        is_used=True
    )

    otp_code = _generate_otp()
    OTPVerification.objects.create(
        email=email,
        otp_code=otp_code,
        purpose=purpose,
        expires_at=timezone.now() + timedelta(minutes=10),
    )
    send_otp_email(email, otp_code, purpose=purpose)
    return otp_code


def _notify_super_admin_about_admin(user: User) -> None:
    """Notify super admin about new admin registration."""
    super_admin = User.objects.filter(
        admin_type=User.ROLE_SUPER_ADMIN, is_email_verified=True
    ).first()

    if super_admin:
        notify_super_admin_of_admin_request(
            super_admin_email=super_admin.email,
            admin_email=user.email,
            admin_name=user.get_full_name() or user.email,
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def register_admin(request):
    """Register a new admin or super admin user."""
    serializer = AdminRegistrationSerializer(data=request.data)

    if not serializer.is_valid():
        return error_response(
            message="Validation failed",
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="VALIDATION_ERROR",
            details=serializer.errors,
        )

    validated_data = serializer.validated_data
    email = validated_data["email"]

    try:
        with transaction.atomic():
            # Remove any existing unverified user with same email
            existing_user = User.objects.filter(email=email).first()
            if existing_user and not existing_user.is_email_verified:
                existing_user.delete()
                OTPVerification.objects.filter(email=email).delete()

            # Create new user
            user = User.objects.create_user(
                username=email,
                email=email,
                password=validated_data["password"],
                first_name=validated_data.get("first_name", ""),
                last_name=validated_data.get("last_name", ""),
                phone=validated_data.get("phone", ""),
                admin_type=validated_data["admin_type"],
                status=User.STATUS_PENDING,
                is_active=True,
                is_email_verified=False,
            )

            # Issue OTP for email verification
            _issue_otp(email, "verification")

            # Notify super admin for regular admin registrations
            if validated_data["admin_type"] == User.ROLE_ADMIN:
                _notify_super_admin_about_admin(user)

            # Log security event
            SecurityAuditLogger.log_user_registration(
                user_id=user.id,
                email=email,
                admin_type=validated_data["admin_type"],
                ip_address=request.META.get("REMOTE_ADDR", ""),
                user_agent=request.META.get("HTTP_USER_AGENT", ""),
            )

            return success_response(
                data={
                    "user_id": user.id,
                    "status": user.status,
                    "message": "Registration successful. Please verify your email.",
                },
                message="Registration successful",
                status_code=status.HTTP_201_CREATED,
            )

    except Exception as e:
        return error_response(
            message="Registration failed",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="REGISTRATION_ERROR",
            details=str(e),
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def login_admin(request):
    """Login admin user and return JWT tokens."""
    serializer = AdminLoginSerializer(data=request.data)

    if not serializer.is_valid():
        return error_response(
            message="Invalid credentials",
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="INVALID_CREDENTIALS",
            details=serializer.errors,
        )

    user = serializer.validated_data["user"]

    # Check email verification
    if not user.is_email_verified:
        return error_response(
            message="Please verify your email before logging in",
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="EMAIL_NOT_VERIFIED",
        )

    # Check user status
    if user.status != User.STATUS_ACTIVE:
        return error_response(
            message=f"Account status: {user.get_status_display()}",
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="ACCOUNT_NOT_ACTIVE",
            details={"status": user.status},
        )

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)

    # Log security event
    SecurityAuditLogger.log_user_login(
        user_id=user.id,
        email=user.email,
        ip_address=request.META.get("REMOTE_ADDR", ""),
        user_agent=request.META.get("HTTP_USER_AGENT", ""),
    )

    return success_response(
        data={
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "admin_type": user.admin_type,
                "status": user.status,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_email_verified": user.is_email_verified,
            },
        },
        message="Login successful",
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_otp(request):
    """Verify OTP for email verification or password reset."""
    serializer = OTPVerificationSerializer(data=request.data)

    if not serializer.is_valid():
        return error_response(
            message="Invalid OTP",
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="INVALID_OTP",
            details=serializer.errors,
        )

    otp = serializer.validated_data["otp"]
    email = serializer.validated_data["email"]
    purpose = serializer.validated_data["purpose"]

    try:
        with transaction.atomic():
            # Mark OTP as used
            otp.is_used = True
            otp.save()

            if purpose == "verification":
                # Verify user email
                user = User.objects.filter(email=email).first()
                if user:
                    user.is_email_verified = True
                    # For super admin, activate immediately
                    if user.admin_type == User.ROLE_SUPER_ADMIN:
                        user.status = User.STATUS_ACTIVE
                    user.save()

            return success_response(message="OTP verified successfully")

    except Exception as e:
        return error_response(
            message="OTP verification failed",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="VERIFICATION_ERROR",
            details=str(e),
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def resend_verification_otp(request):
    """Resend verification OTP."""
    email = request.data.get("email")

    if not email:
        return error_response(
            message="Email is required",
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="EMAIL_REQUIRED",
        )

    user = User.objects.filter(email=email).first()
    if not user:
        return error_response(
            message="User not found",
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="USER_NOT_FOUND",
        )

    if user.is_email_verified:
        return error_response(
            message="Email already verified",
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="EMAIL_ALREADY_VERIFIED",
        )

    try:
        _issue_otp(email, "verification")
        return success_response(message="OTP sent successfully")
    except Exception as e:
        return error_response(
            message="Failed to send OTP",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="OTP_SEND_ERROR",
            details=str(e),
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def request_password_reset(request):
    """Request password reset OTP."""
    email = request.data.get("email")

    if not email:
        return error_response(
            message="Email is required",
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="EMAIL_REQUIRED",
        )

    user = User.objects.filter(email=email, is_email_verified=True).first()
    if not user:
        # Don't reveal if user exists for security
        return success_response(
            message="If the email exists, a reset code has been sent"
        )

    try:
        _issue_otp(email, "password_reset")
        return success_response(message="Password reset code sent successfully")
    except Exception as e:
        return error_response(
            message="Failed to send reset code",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="RESET_CODE_ERROR",
            details=str(e),
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password(request):
    """Reset password using OTP."""
    serializer = PasswordResetSerializer(data=request.data)

    if not serializer.is_valid():
        return error_response(
            message="Invalid data",
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="INVALID_DATA",
            details=serializer.errors,
        )

    otp = serializer.validated_data["otp"]
    email = serializer.validated_data["email"]
    new_password = serializer.validated_data["new_password"]

    try:
        with transaction.atomic():
            # Mark OTP as used
            otp.is_used = True
            otp.save()

            # Update user password
            user = User.objects.filter(email=email).first()
            if user:
                user.set_password(new_password)
                user.save()

                # Log security event
                SecurityAuditLogger.log_password_reset(
                    user_id=user.id,
                    email=email,
                    ip_address=request.META.get("REMOTE_ADDR", ""),
                    user_agent=request.META.get("HTTP_USER_AGENT", ""),
                )

            return success_response(message="Password reset successfully")

    except Exception as e:
        return error_response(
            message="Password reset failed",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="PASSWORD_RESET_ERROR",
            details=str(e),
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """Get current authenticated user data."""
    serializer = UserSerializer(request.user)
    return success_response(
        data=serializer.data, message="User data retrieved successfully"
    )


@api_view(["GET"])
@permission_classes([IsSuperAdmin])
def list_admin_requests(request):
    """List admin registration requests (Super Admin only)."""
    users = User.objects.filter(admin_type=User.ROLE_ADMIN).order_by("-created_at")

    serializer = UserSerializer(users, many=True)
    return success_response(
        data=serializer.data, message="Admin requests retrieved successfully"
    )


@api_view(["PATCH"])
@permission_classes([IsSuperAdmin])
def update_admin_status(request, user_id):
    """Update admin status (Super Admin only)."""
    try:
        user = User.objects.get(id=user_id, admin_type=User.ROLE_ADMIN)
    except User.DoesNotExist:
        return error_response(
            message="Admin user not found",
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="USER_NOT_FOUND",
        )

    new_status = request.data.get("status")
    if new_status not in dict(User.STATUS_CHOICES):
        return error_response(
            message="Invalid status",
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="INVALID_STATUS",
        )

    user.status = new_status
    user.save()

    # Log security event
    SecurityAuditLogger.log_admin_status_change(
        admin_user_id=request.user.id,
        target_user_id=user.id,
        old_status=user.status,
        new_status=new_status,
        ip_address=request.META.get("REMOTE_ADDR", ""),
        user_agent=request.META.get("HTTP_USER_AGENT", ""),
    )

    return success_response(
        data=UserSerializer(user).data, message="Admin status updated successfully"
    )
