from django.urls import path
from .views import (
    Register,
    LoginView,
    RefreshView,
    Logoutview,
    JobListView,
    RoadmapView,
    SkillLearningView,
    QuizQuestionListView,
    QuizSubmitView,
    JobTestQuestionView,
    JobTestSubmitView
)

urlpatterns = [
    path('register/', Register.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', RefreshView.as_view(), name='refresh'),
    path('logout/', Logoutview.as_view(), name='logout'),
    
    path('jobs/', JobListView.as_view(), name='job_list'),
    path('jobs/<int:job_id>/roadmap/', RoadmapView.as_view(), name='job_roadmap'),
    path('skills/<int:skill_id>/learnings/', SkillLearningView.as_view(), name='skill_learning_list'),
    path('learnings/<int:learning_id>/questions/', QuizQuestionListView.as_view(), name='quiz_question_list'),
    path('quiz/submit/', QuizSubmitView.as_view(), name='quiz_submit'),
    path('job-test/questions/', JobTestQuestionView.as_view(), name='job-test_question_list'),
    path('job-test/submit/', JobTestSubmitView.as_view(), name='job-test_submit'),
]