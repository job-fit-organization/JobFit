from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User

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
    name = models.CharField(max_length=100, unique=True, verbose_name="기술명")
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

class UserCurriculumProgress(models.Model):
    """
    사용자의 커리큘럼 단계별 학습 완료 상태 추적
    """
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='curriculum_progresses', 
        verbose_name="사용자"
    )
    curriculum = models.ForeignKey(
        Curriculum, 
        on_delete=models.CASCADE, 
        related_name='progresses', 
        verbose_name="커리큘럼 단계"
    )
    is_completed = models.BooleanField(default=False, verbose_name="완료 여부")
    completed_at = models.DateTimeField(blank=True, null=True, verbose_name="완료 일시")

    class Meta:
        db_table = 'user_curriculum_progresses'
        unique_together = ('user', 'curriculum')
        verbose_name = '사용자 진도 상태'
        verbose_name_plural = '사용자 진도 상태 목록'
    
    def __str__(self):
        status = "완료" if self.is_completed else "학습 중"
        return f"{self.user.username} - {self.curriculum.skill.name} Step {self.curriculum.step} ({status})"

class UserBookmark(models.Model):
    """
    학습 자료실 북마크 영속화
    """
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='bookmarks', 
        verbose_name="사용자"
    )
    curriculum = models.ForeignKey(
        Curriculum, 
        on_delete=models.CASCADE, 
        related_name='bookmarks', 
        verbose_name="북마크 커리큘럼"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="북마크 시간")
    
    class Meta:
        db_table = 'user_bookmarks'
        unique_together = ('user', 'curriculum')
        verbose_name = '사용자 북마크'
        verbose_name_plural = '사용자 북마크 목록'

    def __str__(self):
        return f"{self.user.username}의 북마크: {self.curriculum}"
    
class UserNote(models.Model):
    """
    학습 중 입력하는 AJAX 비동기 저장 개인 메모
    """
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='notes', 
        verbose_name="사용자"
    )
    curriculum = models.ForeignKey(
        Curriculum, 
        on_delete=models.CASCADE, 
        related_name='notes', 
        verbose_name="메모 대상 커리큘럼"
    )
    content = models.TextField(blank=True, verbose_name="메모 본문")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="작성일")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="최종 수정일")

    class Meta:
        db_table = 'user_notes'
        unique_together = ('user', 'curriculum')
        verbose_name = '사용자 메모'
        verbose_name_plural = '사용자 메모 목록'

    def __str__(self):
        return f"{self.user.username}의 메모: {self.curriculum.title}"

class QuizQuestion(models.Model):
    """
    기술별 문제 은행 데이터
    """
    DIFFICULTY_CHOICES = [
        ('easy', '쉬움 (15점)'),
        ('medium', '중간 (20점)'),
        ('hard', '어려움 (30점)'),
    ]
    skill = models.ForeignKey(
        Skill, 
        on_delete=models.CASCADE, 
        related_name='quizzes', 
        verbose_name="대상 기술"
    )
    question_text = models.TextField(verbose_name="퀴즈 지문")
    difficulty = models.CharField(
        max_length=10, 
        choices=DIFFICULTY_CHOICES, 
        default='medium', 
        verbose_name="난이도"
    )
    explanation = models.TextField(blank=True, null=True, verbose_name="정답 해설")
    class Meta:
        db_table = 'quiz_questions'
        verbose_name = '퀴즈 문제'
        verbose_name_plural = '퀴즈 문제 목록'
    def __str__(self):
        return f"[{self.skill.name} | {self.get_difficulty_display()}] {self.question_text[:30]}..."

class QuizChoice(models.Model):
    """
    문제의 4지 선다 선택지
    """
    question = models.ForeignKey(
        QuizQuestion, 
        on_delete=models.CASCADE, 
        related_name='choices', 
        verbose_name="소속 문제"
    )
    choice_text = models.CharField(max_length=255, verbose_name="선택지 내용")
    is_correct = models.BooleanField(default=False, verbose_name="정답 여부")
    class Meta:
        db_table = 'quiz_choices'
        verbose_name = '퀴즈 보기'
        verbose_name_plural = '퀴즈 보기 목록'
    def __str__(self):
        correct_tag = "[정답]" if self.is_correct else ""
        return f"{correct_tag} {self.choice_text}"

class QuizAttempt(models.Model):
    """
    사용자의 기술 퀴즈 1회 세션 응시 결과 기록
    """
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='quiz_attempts', 
        verbose_name="사용자"
    )
    skill = models.ForeignKey(
        Skill, 
        on_delete=models.CASCADE, 
        related_name='attempts', 
        verbose_name="대상 기술"
    )
    score = models.PositiveIntegerField(default=0, verbose_name="취득 점수 (최대 100점)")
    is_passed = models.BooleanField(default=False, verbose_name="통과 여부 (70점 기준)")
    attempted_at = models.DateTimeField(auto_now_add=True, verbose_name="제출 시간")
    class Meta:
        db_table = 'quiz_attempts'
        verbose_name = '퀴즈 시도 이력'
        verbose_name_plural = '퀴즈 시도 이력 목록'
    def __str__(self):
        result = "Pass" if self.is_passed else "Fail"
        return f"{self.user.username} - {self.skill.name} ({self.score}점, {result})"

class UserResponse(models.Model):
    """
    퀴즈 세션 시도 안에서 각 문제별로 사용자가 낸 정답/오답 로그
    """
    attempt = models.ForeignKey(
        QuizAttempt, 
        on_delete=models.CASCADE, 
        related_name='responses', 
        verbose_name="퀴즈 세션 시도"
    )
    question = models.ForeignKey(
        QuizQuestion, 
        on_delete=models.CASCADE, 
        verbose_name="푼 문제"
    )
    selected_choice = models.ForeignKey(
        QuizChoice, 
        on_delete=models.CASCADE, 
        verbose_name="선택한 보기"
    )
    is_correct = models.BooleanField(verbose_name="정답 일치 여부")
    class Meta:
        db_table = 'user_responses'
        verbose_name = '사용자 문항 답안'
        verbose_name_plural = '사용자 문항 답안 목록'
    def __str__(self):
        status = "정답" if self.is_correct else "오답"
        return f"문항: {self.question.id} -> {status}"