from django.db import models
from django.conf import settings

# Create your models here.
class JobCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class JobRecommendationQuestion(models.Model):
    content = models.TextField()
    order = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.content[:30]

class JobRecommendationChoice(models.Model):
    question = models.ForeignKey(JobRecommendationQuestion, on_delete=models.CASCADE, related_name='choices')
    content = models.CharField(max_length=255)
    # score_profile maps a JobCategory ID to points added for this choice
    # example: {"1": 10, "2": 5} meaning 10 points to category 1, 5 to category 2
    score_profile = models.JSONField(default=dict)

    def __str__(self):
        return self.content

class TestHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='job_recommendation_history')
    recommended_job = models.ForeignKey(JobCategory, on_delete=models.SET_NULL, null=True, blank=True)
    answers = models.JSONField(default=dict) # Store selected choice IDs as {"question_id": "choice_id"}
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.email} - {self.recommended_job.name if self.recommended_job else "None"}'
