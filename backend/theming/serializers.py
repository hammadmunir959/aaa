from rest_framework import serializers
from theming.models import Theme, Event


class ThemeSerializer(serializers.Serializer):
    theme_key = serializers.CharField()
    theme = serializers.DictField()
    event = serializers.DictField(allow_null=True)


class ThemeModelSerializer(serializers.ModelSerializer):
    """Serializer for Theme model"""
    class Meta:
        model = Theme
        fields = [
            'id', 'key', 'name', 
            'scrolling_message', 'scrolling_background_color',
            'is_custom', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ThemeDetailSerializer(serializers.ModelSerializer):
    """Serializer that returns theme in format compatible with THEMES config"""
    config = serializers.SerializerMethodField()
    
    class Meta:
        model = Theme
        fields = ['key', 'name', 'config', 'is_custom', 'is_active']
    
    def get_config(self, obj):
        return obj.to_dict()


class EventModelSerializer(serializers.ModelSerializer):
    """Serializer for Event model"""
    class Meta:
        model = Event
        fields = [
            'id', 'name', 'slug', 'start_date', 'end_date',
            'theme_key', 'priority', 'active', 'recurring_yearly', 'pre_activate_days',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

