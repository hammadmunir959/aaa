from rest_framework import serializers

from .models import Inquiry
from utils.spam_protection import check_rate_limit


class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = "__all__"


class InquiryCreateSerializer(serializers.ModelSerializer):
    # Simple anti-spam fields
    honeypot = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Inquiry
        fields = [
            "name",
            "email",
            "phone",
            "subject",
            "message",
            "vehicle_interest",
            "honeypot",
        ]

    def validate(self, attrs):
        request = self.context.get("request")

        # Check honeypot (should be empty)
        honeypot = attrs.pop("honeypot", "")
        if honeypot:
            raise serializers.ValidationError({"honeypot": "Spam detected."})

        # Captcha validation removed - form works without captcha

        # Rate limiting
        ip_address = request.META.get("REMOTE_ADDR") if request else None
        if ip_address and check_rate_limit(ip_address, "inquiry"):
            raise serializers.ValidationError(
                {"rate_limit": "Too many submissions from this IP. Try again later."}
            )

        attrs["ip_address"] = ip_address
        attrs["source"] = "web"
        return attrs


class InquiryReplySerializer(serializers.Serializer):
    message = serializers.CharField(min_length=3, max_length=4000)
