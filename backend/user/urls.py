from django.urls import path
from .views import QuizHistoryView, JobTestHistoryView

urlpatterns = [
    path('mypage/quiz-history/', QuizHistoryView.as_view(), name='quiz_history'),
    path('mypage/job-test-history/', JobTestHistoryView.as_view(), name='job-test_history')
]