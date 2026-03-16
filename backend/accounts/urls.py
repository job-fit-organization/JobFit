from django.urls import path
from .views import KakaoLoginView, WithdrawView

urlpatterns = [
    path('kakao/login/', KakaoLoginView.as_view(), name='kakao_login'),
    path('withdraw/', WithdrawView.as_view(), name='withdraw'),
]
