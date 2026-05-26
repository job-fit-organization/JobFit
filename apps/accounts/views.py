from django.shortcuts import redirect
from django.views.generic import TemplateView
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.db.models.signals import post_save
from allauth.socialaccount.signals import social_account_added
from django.dispatch import receiver
from apps.accounts.models import UserProfile

# Create your views here.

# 1. 메인 / 로그인 화면 뷰
class LandingView(TemplateView):
    template_name = 'landing.html'

# 2. 동적 리다이렉트 분기 뷰 (로그인 완료 후 자동 실행)
@login_required
def login_redirect_view(request):
    user = request.user
    
    # 사용자가 이미 선택한 직무 데이터가 존재하는지 확인
    user_selected_jobs = user.profile.userselectedjob_set.all() if hasattr(user, 'profile') else []
    
    if user_selected_jobs:
        return redirect('learning:job_roadmap')  # 관심 직무 등록 유저는 로드맵으로 패스
    else:
        return redirect('learning:select_mode')  # 최초 진입 유저는 시작 모드 선택으로 패스

# 3. 소셜 인증 완료 시 UserProfile 데이터 자동 동기화용 시그널 수신기 (Allauth Signal)
@receiver(social_account_added)
def sync_social_profile(request, sociallogin, **kwargs):
    user = sociallogin.user
    profile, created = UserProfile.objects.get_or_create(user=user)
    
    # 소셜 정보 추출 및 프로필 영속화
    profile.provider = sociallogin.account.provider  # 'google', 'github', 'kakao', 'naver'
    profile.social_id = sociallogin.account.uid
    
    # 제공처별 유저 아바타(프로필 이미지) 수급 분석
    extra_data = sociallogin.account.extra_data
    avatar_url = ""
    
    if profile.provider == 'google':
        avatar_url = extra_data.get('picture', '')
    elif profile.provider == 'github':
        avatar_url = extra_data.get('avatar_url', '')
    elif profile.provider == 'kakao':
        properties = extra_data.get('properties', {})
        avatar_url = properties.get('profile_image', '')
    elif profile.provider == 'naver':
        response = extra_data.get('response', '')
        avatar_url = response.get('profile_image', '')
        
    profile.profile_image_url = avatar_url
    profile.save()