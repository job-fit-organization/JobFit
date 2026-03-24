from django.conf import settings
from django.db import models

# Create your models here.
class Job(models.Model):
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    desc = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Skill(models.Model):
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    desc = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Learning(models.Model):
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    desc = models.TextField(blank=True)
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='learnings'
    )

    def __str__(self):
        return self.name

class Roadmap(models.Model):
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='roadmaps'
    )
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='roadmaps'
    )
    prerequisite_skill = models.ForeignKey(
        Skill,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='next_roadmaps'
    )

    class Meta:
        unique_together = ('job', 'skill')
    
    def __str__(self):
        return f'{self.job.name} - {self.skill.name}'

class QuestionChoice(models.Model):
    # 상수: 퀴즈 OR 테스트
    QUESTION_TYPE = [
        ('Quiz', '퀴즈'),
        ('Test_B', '테스트(입문자)'),
        ('Test_E', '테스트(전문가)')
    ]

    question_group_id = models.PositiveIntegerField(db_index=True)
    question_type = models.CharField(max_length=10, choices=QUESTION_TYPE)
    learning = models.ForeignKey(
        Learning,
        on_delete=models.CASCADE,
        related_name='question_choices',
        null=True, blank=True
    )
    question_text = models.TextField()
    choice_text = models.TextField()
    is_correct = models.BooleanField(null=True, blank=True)
    job_scores = models.JSONField(
        default=dict,
        blank=True,
        help_text="직무별 가중치 (예: {'DaS': 3, 'MLO': 1})"
    )

    class Meta:
        ordering = ['question_group_id', 'id']

    def __str__(self):
        return f'Q{self.question_group_id} - {self.choice_text[:20]}'

class Attempt(models.Model):
    ATTEMPT_TYPE = [
        ('quiz', '학습 퀴즈'),
        ('job_test', '직무 추천 테스트'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='attempts'
    )
    attempt_type = models.CharField(max_length=20, choices=ATTEMPT_TYPE)
    learning = models.ForeignKey(
        Learning,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='attempts'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    score = models.PositiveIntegerField(default=0)
    recommended_job = models.ForeignKey(
        'Job',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='resulting_attempts'
    )

    def __str__(self):
        return f'{self.user.username} - {self.attempt_type} - {self.id}'

class UserResponse(models.Model):
    attempt = models.ForeignKey(
        Attempt,
        on_delete=models.CASCADE,
        related_name='responses'
    )
    question_group_id = models.PositiveIntegerField()
    selected_question_choice = models.ForeignKey(
        QuestionChoice,
        on_delete=models.CASCADE,
        related_name='selected_responses'
    )
    is_correct = models.BooleanField(null=True, blank=True)

    class Meta:
        unique_together = ('attempt', 'question_group_id')

    def __str__(self):
        return f'Attempt {self.attempt_id} - Q{self.question_group_id}'

class Survey(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='surveys'
    )
    rating = models.PositiveSmallIntegerField()
    features = models.JSONField()
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Survey {self.id} - Rating: {self.rating}'