from django.db import models
from django.contrib.auth.models import User

# Create your models here.
# 1. Job (직무)
class Job(models.Model):
    job_name = models.CharField(max_length=100, unique=True, verbose_name='직무명')
    job_desc = models.TextField(blank=True, null=True, verbose_name='직무 설명')
    job_image_url = models.URLField(
        blank=True,
        null=True,
        verbose_name="AI 일러스트 이미지 URL"
    )

    class Meta:
        db_table = 'job'
        verbose_name = '직무'
        verbose_name_plural = '직무 목록'
    
    def __str__(self):
        return self.job_name


# 2. Skill (기술)
class Skill(models.Model):
    skill_name = models.CharField(max_length=100, unique=True, verbose_name="기술명")
    skill_desc = models.TextField(blank=True, null=True, verbose_name="기술 설명")
    skill_level = models.CharField(max_length=20, verbose_name='기술 난이도')
    skill_icon_code = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name="Devicon/Lucide 아이콘 코드"
    )

    class Meta:
        db_table = 'skill'
        verbose_name = '기술'
        verbose_name_plural = '기술 목록'
    
    def __str__(self):
        return self.skill_name


# 3. Roadmap (로드맵 의존성 DAG)
class Roadmap(models.Model):
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
    parent_roadmap_id = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='roadmap_as_parent_roadmap_id',
        verbose_name="선행 기술"
    )

    class Meta:
        db_table = 'roadmap'
        verbose_name = '로드맵 의존성'
        verbose_name_plural = '로드맵 의존성 목록'
        unique_together = ('job', 'skill', 'parent_roadmap_id')
    
    def __str__(self):
        pre_name = self.parent_roadmap_id.skill_name if self.parent_roadmap_id else "ROOT"
        return f'[{self.job.job_name}] {pre_name} -> {self.skill.skill_name}'


# 4. Curriculum (커리큘럼 단계)
class Curriculum(models.Model):
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='curriculums',
        verbose_name="대상 기술"
    )
    curriculum_step = models.CharField(max_length=30, verbose_name="단계 식별자")
    topic = models.TextField(verbose_name="주제")
    objectives = models.TextField(verbose_name="학습 목표")
    key_contents = models.TextField(verbose_name="학습 내용")

    class Meta:
        db_table = 'curriculum'
        ordering = ['skill', 'curriculum_step']
        unique_together = ('skill', 'curriculum_step')
        verbose_name = '커리큘럼 단계'
        verbose_name_plural = '커리큘럼 단계 목록'

    def __str__(self):
        return f"{self.skill.skill_name} - {self.curriculum_step}: {self.topic}"


# 5. UserCurriculumProgress (사용자 진도 상태)
class UserCurriculumProgress(models.Model):
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
        return f"{self.user.username} - {self.curriculum.skill.skill_name} Step {self.curriculum.curriculum_step} ({status})"


# 6. UserBookmark (북마크)
class UserBookmark(models.Model):
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


# 7. UserNote (노트 필기)
class UserNote(models.Model):
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
        return f"{self.user.username}의 메모: {self.curriculum.topic}"


# 8. QuizQuestion (퀴즈 문제 은행)
class QuizQuestion(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', '쉬움 (15점)'),
        ('medium', '중간 (20점)'),
        ('hard', '어려움 (30점)'),
    ]
    curriculum = models.ForeignKey(
        Curriculum, 
        on_delete=models.CASCADE, 
        related_name='quiz_questions', 
        verbose_name="대상 커리큘럼"
    )
    question = models.TextField(verbose_name="퀴즈 지문")
    difficulty = models.CharField(
        max_length=10, 
        choices=DIFFICULTY_CHOICES, 
        default='medium', 
        verbose_name="난이도"
    )

    class Meta:
        db_table = 'quizquestion'
        verbose_name = '퀴즈 문제'
        verbose_name_plural = '퀴즈 문제 목록'

    def __str__(self):
        return f"[{self.curriculum.skill.skill_name} | {self.get_difficulty_display()}] {self.question[:30]}..."


# 9. QuizChoice (퀴즈 선택지)
class QuizChoice(models.Model):
    question = models.ForeignKey(
        QuizQuestion, 
        on_delete=models.CASCADE, 
        related_name='choices', 
        verbose_name="소속 문제"
    )
    choice_text = models.CharField(max_length=255, verbose_name="선택지 내용")
    is_correct = models.BooleanField(default=False, verbose_name="정답 여부")
    explanation = models.TextField(blank=True, null=True, verbose_name="정답 해설")

    class Meta:
        db_table = 'quizchoice'
        verbose_name = '퀴즈 보기'
        verbose_name_plural = '퀴즈 보기 목록'

    def __str__(self):
        correct_tag = "[정답]" if self.is_correct else ""
        return f"{correct_tag} {self.choice_text}"


# 10. QuizAttempt (퀴즈 응시 내역)
class QuizAttempt(models.Model):
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
        return f"{self.user.username} - {self.skill.skill_name} ({self.score}점, {result})"


# 11. UserResponse (선택한 개별 퀴즈 답안 로그)
class UserResponse(models.Model):
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
