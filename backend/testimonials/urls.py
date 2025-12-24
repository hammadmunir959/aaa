from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import TestimonialViewSet

app_name = 'testimonials'

router = DefaultRouter()
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')

urlpatterns = [
    path('', include(router.urls)),
]





