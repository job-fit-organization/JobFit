from django.urls import path
from . import views

from allauth.account.views import LogoutView

app_name = 'accounts'

urlpatterns = [
    path('', views.LandingView.as_view(), name='landing'),
    path('login-redirect/', views.login_redirect_view, name='login_redirect'), # 동적 로그인 분기
    path('logout/', LogoutView.as_view(), name='logout'),
]