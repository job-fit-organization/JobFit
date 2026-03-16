from django.urls import path
from . import views

app_name = 'recommendation'

urlpatterns = [
    path('questions/', views.get_recommendation_questions, name='get_recommendation_questions'),
    path('submit/', views.submit_recommendation_test, name='submit_recommendation_test'),
    path('history/', views.get_recommendation_history, name='get_recommendation_history'),
]
