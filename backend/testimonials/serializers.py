from rest_framework import serializers

from .models import Testimonial
from utils.spam_protection import check_rate_limit


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'


class TestimonialCreateSerializer(serializers.ModelSerializer):
    # Simple anti-spam fields (optional for admins)
    honeypot = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = Testimonial
        fields = ['name', 'feedback', 'rating', 'service_type', 'honeypot']
        extra_kwargs = {
            'status': {'required': False, 'read_only': True},  # Status is set automatically
            'service_type': {'required': False, 'allow_blank': True, 'allow_null': True}
        }

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value

    def validate_service_type(self, value):
        if value:
            valid_choices = [choice[0] for choice in Testimonial.SERVICE_CHOICES]
            if value not in valid_choices:
                raise serializers.ValidationError('Invalid service type selected.')
        return value

    def validate(self, attrs):
        request = self.context.get('request')
        
        # Skip CAPTCHA and spam checks for authenticated admin users
        is_admin = (
            request and 
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_staff or request.user.is_superuser or hasattr(request.user, 'admin_type') and request.user.admin_type is not None)
        )
        
        if is_admin:
            # Remove CAPTCHA fields from attrs if present (admins don't need them)
            attrs.pop('honeypot', None)
            return attrs
        
        # For public users, perform all spam protection checks
        # Check honeypot (should be empty)
        honeypot = attrs.pop('honeypot', '')
        if honeypot:
            raise serializers.ValidationError({'honeypot': 'Spam detected.'})
        


        # Rate limiting
        ip_address = request.META.get('REMOTE_ADDR') if request else None
        if ip_address and check_rate_limit(ip_address, 'testimonial'):
            raise serializers.ValidationError(
                {'rate_limit': 'Too many submissions from this IP. Try again later.'}
            )

        return attrs

    def create(self, validated_data):
        # Set status to approved (published) for public submissions
        # Admins can archive/delete later if needed
        validated_data.setdefault('status', 'approved')
        return super().create(validated_data)


