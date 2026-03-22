from django.urls import path
from .views import UserProfileView, UserLearningHistoryView, UserJobHistoryView, UserRecommendationView, PlatformStatsView

urlpatterns = [
    path('stats/', PlatformStatsView.as_view(), name='platform_stats'),
    path('<str:user_id>/', UserProfileView.as_view(), name='user_profile'),
    path('<str:user_id>/histories/learning/', UserLearningHistoryView.as_view(), name='user_learning_history'),
    path('<str:user_id>/histories/job/', UserJobHistoryView.as_view(), name='user_job_history'),
    path('<str:user_id>/recommendation/', UserRecommendationView.as_view(), name='user_recommendation'),
]
