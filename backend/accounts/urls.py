from django.urls import path
from accounts.views.auth import SignupAPIView, LoginAPIView, LogoutAPIView, MeAPIView
from accounts.views.social import KakaoSocialLoginAPIView, GoogleSocialLoginAPIView, NaverSocialLoginAPIView

app_name = 'accounts'

urlpatterns = [
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('me/', MeAPIView.as_view(), name='me'),

    path('social/kakao/login/', KakaoSocialLoginAPIView.as_view(), name='kakao-login'),
    path('social/google/login/', GoogleSocialLoginAPIView.as_view(), name='google-login'),
    path('social/naver/login/', NaverSocialLoginAPIView.as_view(), name='naver-login'),
]