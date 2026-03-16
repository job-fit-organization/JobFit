from django.db import models
# from django.contrib.auth.models import User
from django.conf import settings

# Create your models here.
class Category(models.Model): # 대분류 테이블
    '''
    name: 대분류 이름 - 파이썬/머신러닝/딥러닝/...
    '''
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class SubCategory(models.Model): # 중분류 테이블
    '''
    category: 대분류
    name: 중분류 이름 - 변수와자료형/리스트와튜플/...
    description: 중분류 설명
    order: 같은 대분류 내 학습 순서
    pass_score: 다음 순서로 넘어가기 위해 필요한 퀴즈 점수
    '''
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(default=1)
    pass_score = models.PositiveIntegerField(default=60)

    def __str__(self):
        return self.name

class SubCategoryPrerequisite(models.Model): # 선행관계 테이블
    '''
    subcategory의 선행되어야 하는 prerequisite
    '''
    subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE, related_name='prerequisites')
    prerequisite = models.ForeignKey(SubCategory, on_delete=models.CASCADE, related_name='required_for')

    class Meta:
        unique_together = ('subcategory', 'prerequisite')

class Question(models.Model): # 퀴즈 질문 테이블
    '''
    question_text: 퀴즈 문제
    explanation: 문제 해설?
    is_active: ?
    '''
    subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    explanation = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.question_text[:30]

class Choice(models.Model): # 퀴즈 선택지 테이블
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    choice_text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.choice_text

class AssessmentAttempt(models.Model): # 퀴즈 응시 이력 테이블
    '''
    user: 사용자 정보
    subcategory: 응시한 중분류
    status: 응시 상태
    total_questions: 출제된 퀴즈 문항 수
    correct_count: 맞춘 정답 수
    score: 점수
    is_passed: 통과 여부
    started_at: 응시를 시작한 시간
    submitted_at: 제출한 시간
    attempt_no: 응시 번호? 횟수?
    '''
    STATUS_CHOICES = (
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assessment_attempts')
    subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE, related_name='attempts')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    total_questions = models.PositiveIntegerField(default=5)
    correct_count = models.PositiveIntegerField(default=0)
    score = models.FloatField(default=0)
    is_passed = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(blank=True, null=True)
    attempt_no = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f'{self.user.username} - {self.subcategory.name} - {self.attempt_no}'

class AttemptQuestion(models.Model): # 응시 이력 중, 특정 질문이 몇 번째로 출제되었는지 저장하는 테이블
    '''
    attempt: 퀴즈 응시 이력
    question: 출제된 문제
    order: 출제 순서
    '''
    attempt = models.ForeignKey(AssessmentAttempt, on_delete=models.CASCADE, related_name='attempt_questions')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    order = models.PositiveIntegerField()

    class Meta:
        unique_together = ('attempt', 'question')

class UserAnswer(models.Model): # 응시 이력에서 사용자가 응답한 기록을 저장하는 테이블
    '''
    attempt: 퀴즈 응시 이력
    question: 출제된 문제
    selected_choice: 사용자가 선택한 선택지
    is_correct: 정답 여부
    answered_at: 선택 시간
    '''
    attempt = models.ForeignKey(AssessmentAttempt, on_delete=models.CASCADE, related_name='user_answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)
    answered_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('attempt', 'question')

class UserSubCategoryProgress(models.Model): # 응시 현황을 저장하는 테이블
    '''
    user, subcategory: 사용자, 중분류
    is_unlocked: 잠금 해제 여부
    is_completed: 완료 여부
    best_score, latest_score: 최고 점수, 최신 점수
    attempt_count: 퀴즈 응시 횟수
    last_attempt_at: 최신 응시 시점
    '''
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subcategory_progress')
    subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE, related_name='user_progress')
    is_unlocked = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    best_score = models.FloatField(default=0)
    latest_score = models.FloatField(default=0)
    attempt_count = models.PositiveIntegerField(default=0)
    last_attempt_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        unique_together = ('user', 'subcategory')