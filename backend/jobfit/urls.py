from django.urls import path
from . import views

app_name = 'jobfit'

urlpatterns = [
    # Categories
    path('api/categories/', views.category_list_api, name='category_list_api'),
    path('api/categories/<int:category_id>/subcategories/', views.subcategory_list_api, name='subcategory_list_api'),
    path('api/categories/<int:category_id>/progress/', views.category_progress_api, name='category_progress_api'),

    # SubCategories
    path('api/subcategories/<int:subcategory_id>/', views.subcategory_detail_api, name='subcategory_detail_api'),

    # Assessments / Attempts
    path('api/subcategories/<int:subcategory_id>/attempts/start/', views.start_attempt_api, name='start_attempt_api'),
    path('api/attempts/<int:attempt_id>/answers/', views.save_answer_api, name='save_answer_api'),
    path('api/attempts/<int:attempt_id>/submit/', views.submit_attempt_api, name='submit_attempt_api'),
    path('api/attempts/<int:attempt_id>/result/', views.attempt_result_api, name='attempt_result_api'),

    # Users
    path('api/users/me/attempts/', views.my_attempt_list_api, name='my_attempt_list_api'),
    path('api/users/me/progress/', views.my_progress_api, name='my_progress_api'),
]