from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ClaimViewSet, OperationsDataView

app_name = 'bookings'

router = DefaultRouter()
router.register(r'claims', ClaimViewSet, basename='claim')

urlpatterns = [
    path('', include(router.urls)),
    path('operations-data/', OperationsDataView.as_view(), name='operations-data'),
    # Alias to match /api/bookings/operations/ requested by frontend service
    path('bookings/operations/', OperationsDataView.as_view(), name='operations-data-bookings-prefix'),
]



