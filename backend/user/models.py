from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    SOCIAL_TYPE = [
        ('Naver', '네이버'),
        ('Kakao', '카카오'),
        ('Google', '구글'),
    ]
    JOB_CHOICE = [
        ('AI Application Engineer', 'AI 서비스 개발자'),
        ('MLOps Engineer', 'MLOps 엔지니어'),
        ('Data Scientist', '데이터 사이언티스트'),
    ]

    name = models.CharField(max_length=50, null=True)
    social = models.CharField(max_length=10, choices=SOCIAL_TYPE, blank=True, null=True)
    job = models.CharField(max_length=30, choices=JOB_CHOICE, blank=True, null=True)
