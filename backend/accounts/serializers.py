from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import User, OTPVerification


class AdminRegistrationSerializer(serializers.Serializer):
    """Serializer for admin registration"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    admin_type = serializers.ChoiceField(choices=User.ROLE_CHOICES)
    first_name = serializers.CharField(max_length=30, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=30, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)

    def validate_password(self, value):
        """Validate password using Django's password validators"""
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def validate_email(self, value):
        """Check if email already exists and is verified"""
        existing_user = User.objects.filter(email=value).first()
        if existing_user and existing_user.is_email_verified:
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_admin_type(self, value):
        """Validate admin type constraints"""
        if value == User.ROLE_SUPER_ADMIN:
            # Check if super admin already exists
            if User.objects.filter(
                admin_type=User.ROLE_SUPER_ADMIN,
                is_email_verified=True
            ).exists():
                raise serializers.ValidationError(
                    "A Super Admin already exists. Only one is allowed."
                )
        return value


class AdminLoginSerializer(serializers.Serializer):
    """Serializer for admin login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(username=email, password=password)
            
            if not user:
                raise serializers.ValidationError(
                    "Invalid email or password"
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    "User account is disabled"
                )
            
            if not user.is_admin:
                raise serializers.ValidationError(
                    "User does not have admin permissions"
                )
            
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError(
                "Must include email and password"
            )


class OTPVerificationSerializer(serializers.Serializer):
    """Serializer for OTP verification"""
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6, min_length=6)
    purpose = serializers.CharField(max_length=20, default='verification')

    def validate(self, attrs):
        email = attrs.get('email')
        otp_code = attrs.get('otp_code')
        purpose = attrs.get('purpose')

        # Find valid OTP
        otp = OTPVerification.objects.filter(
            email=email,
            otp_code=otp_code,
            purpose=purpose,
            is_used=False
        ).first()

        if not otp:
            raise serializers.ValidationError(
                "Invalid or expired OTP"
            )

        # Check if expired
        from django.utils import timezone
        if otp.expires_at < timezone.now():
            raise serializers.ValidationError(
                "OTP has expired"
            )

        attrs['otp'] = otp
        return attrs


class PasswordResetSerializer(serializers.Serializer):
    """Serializer for password reset"""
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6, min_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_new_password(self, value):
        """Validate new password using Django's password validators"""
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def validate(self, attrs):
        email = attrs.get('email')
        otp_code = attrs.get('otp_code')

        # Find valid OTP for password reset
        otp = OTPVerification.objects.filter(
            email=email,
            otp_code=otp_code,
            purpose='password_reset',
            is_used=False
        ).first()

        if not otp:
            raise serializers.ValidationError(
                "Invalid or expired OTP"
            )

        # Check if expired
        from django.utils import timezone
        if otp.expires_at < timezone.now():
            raise serializers.ValidationError(
                "OTP has expired"
            )

        attrs['otp'] = otp
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data"""
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 
            'admin_type', 'status', 'phone', 'is_email_verified',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']
