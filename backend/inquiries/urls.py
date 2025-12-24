from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import InquiryViewSet, generate_captcha

app_name = 'inquiries'

router = DefaultRouter()
router.register(r'inquiries', InquiryViewSet, basename='inquiry')

urlpatterns = [
    path('', include(router.urls)),
    path('captcha/', generate_captcha, name='generate-captcha'),
]





