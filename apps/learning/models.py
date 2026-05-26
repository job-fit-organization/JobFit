from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.
# 1. 기초 데이터 레이어 (직무 및 기술)
class Job(models.Model):
    """
    사용자가 선택할 수 있는 커리어 직무
    """
    name = models.CharField(max_length=100, unique=True, verbose_name='직무명')
    description = models.TextField(blank=True, null=True, verbose_name='직무 설명')
    job_image_url = models.URLField(
        blank=True,
        null=True,
        verbose_name="AI 일러스트 이미지 URL"
    )

    class Meta:
        db_table = 'jobs'
        verbose_name = '직무'
        verbose_name_plural = '직무 목록'
    
    def __str__(self):
        return self.name

class Skill(models.Model):
    """
    개별 학습 기술 노드
    """
    name = models.CharField(max_length=100, unique=True, verbose_names="기술명")
    description = models.TextField(blank=True, null=True, verbose_name="기술 설명")
    skill_icon_code = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name="Devicon/Lucide 아이콘 코드"
    )

    class Meta:
        db_table = 'skills' # 데이터베이스 테이블 이름
        verbose_name = '기술' # 관리자 페이지에서 보일 이름
        verbose_name_plural = '기술 목록' # 관리자 페이지에서 복수형으로 보일 이름
    
    def __str__(self):
        return self.name

# 2. 로드맵 DAG & 커리큘럼 레이어
class Roadmap(models.Model):
    """
    특정 직무에 소속된 기술들의 의존성 네트워크 정의
    prerequisite가 null이면 해당 직무의 시작 루트 기술을 의미
    """
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='roadmap_nodes',
        verbose_name='대상 직무'
    )
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='roadmap_as_skill',
        verbose_name="대상 기술"
    )
    prerequisite = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='roadmap_as_prerequisite',
        verbose_name="선행 기술"
    )

    class Meta:
        db_table = 'roadmap'
        verbose_name = '로드맵 의존성'
        verbose_name_plural = '로드맵 의존성 목록'
        # 동일 직무 내에서 특정 기술의 특정 선행 관계는 중복 저장 방지
        unique_together = ('job', 'skill', 'prerequisite')
    
    def clean(self):
        """
        자기 자신을 선행기술로 지정하는 순환 오류 방지 검증
        """
        if self.skill == self.prerequisite:
            raise ValidationError("자기 자신을 선행 기술로 지정할 수 없습니다.")
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        pre_name = self.prerequisite.name if self.prerequisite else "ROOT"
        return f'[{self.job.name}] {pre_name} -> {self.skill.name}'

class Curriculum(models.Model):
    """
    기술별 단계별 학습 마크다운 자료 컨텐츠
    """
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='curriculums',
        verbose_name="대상 기술"
    )
    step = models.PositiveIntegerField(verbose_name="학습 단계")
    title = models.CharField(max_length=200, verbose_name="단계별 학습 제목")
    content = models.TextField(verbose_name="학습 내용")

    class Meta:
        db_table = 'curriculums'
        ordering = ['skill', 'step']
        unique_together = ('skill', 'step')
        verbose_name = '커리큘럼 단계'
        verbose_name_plural = '커리큘럼 단계 목록'

    def __str__(self):
        return f"{self.skill.name} - Step {self.step}: {self.title}"