from django.urls import path
from . import views

app_name = 'learning'

urlpatterns = [
    # 1. 학습 방식 선택 (직무 중심 vs 기술 중심)
    path('select-mode/', views.SelectModeView.as_view(), name='select_mode'),
    # 2. 직무 선택 및 스펙트럼 조회
    path('select-job/', views.JobSelectView.as_view(), name='job_select'),
    # 3. 임시 로드맵 메인 화면 (로그인 후 이미 관심 직무가 등록된 유저용)
    path('roadmap/', views.JobRoadmapView.as_view(), name='job_roadmap'),

    path('skills/<int:skill_id>/', views.SkillDetailView.as_view(), name='skill_detail'),
]