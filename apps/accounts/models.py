from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


# Create your models here.
class UserProfile(models.Model):
    """
    Django의 내장 User 모델을 확장하여 소셜 로그인 정보 및 프로필 메타데이터를 저장하는 모델
    """
    # 1. 빌트인 User와 1:1 강제 매핑
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
        verbose_name='사용자 계정'
    )

    # 2. 소셜 로그인 정보
    social_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name='소셜 고유 ID'
    )
    provider = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        choices =[
            ('github', 'GitHub'),
            ('google', 'Google'),
            ('kakao', 'Kakao'),
            ('naver', 'Naver')
        ],
        verbose_name='소셜 제공처'
    )
    profile_image_url = models.URLField(
        blank=True,
        null=True,
        verbose_name='프로필 이미지 URL'
    )

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="생성일")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="수정일")

    class Meta:
        db_table = 'user_profiles'
        verbose_name = '사용자 프로필'
        verbose_name_plural = '사용자 프로필 목록'
    
    def __str__(self):
        return f"{self.user.username} ({self.provider or 'Local'})의 프로필"

# 3. django signals를 통한 자동 동기화
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    새로운 User 인스턴스가 데이터베이스에 저장(생성)될 때 호출되는 수신기.
    자동으로 매핑된 UserProfile 레코드를 생성
    """
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    User 인스턴스가 업데이트될 때 호출되는 수신기.
    프로필 정보의 변경 사항을 데이터베이스에 저장
    """
    if hasattr(instance, 'profile'):
        instance.profile.save()

class UserSelectedJob(models.Model):
    """
    사용자가 매핑하여 선택한 관심 직무를 저장하는 테이블 (1유저당 관심 직무 관리)
    """
    user_profile = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        # related_name을 지정하지 않음으로써 Django 기본 룰인 'userselectedjob_set' 역참조명을 자동 활성화합니다.
        verbose_name="사용자 프로필"
    )
    job = models.ForeignKey(
        'learning.Job',  # learning 앱의 Job 모델을 스트링으로 안전하게 참조
        on_delete=models.CASCADE,
        verbose_name="선택한 직무"
    )
    selected_at = models.DateTimeField(auto_now_add=True, verbose_name="선택 일시")
    class Meta:
        db_table = 'user_selected_job'
        unique_together = ('user_profile', 'job')
        verbose_name = '사용자 관심 직무'
        verbose_name_plural = '사용자 관심 직무 목록'
    def __str__(self):
        return f"{self.user_profile.user.username} -> {self.job.job_name}"