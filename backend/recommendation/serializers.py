from rest_framework import serializers
from .models import JobCategory, JobRecommendationQuestion, JobRecommendationChoice, TestHistory

class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCategory
        fields = ['id', 'name', 'description']

class JobRecommendationChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRecommendationChoice
        fields = ['id', 'content']

class JobRecommendationQuestionSerializer(serializers.ModelSerializer):
    choices = JobRecommendationChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = JobRecommendationQuestion
        fields = ['id', 'content', 'order', 'choices']

class TestSubmitChoiceSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    choice_id = serializers.IntegerField()

class TestSubmitRequestSerializer(serializers.Serializer):
    answers = TestSubmitChoiceSerializer(many=True)

class TestHistorySerializer(serializers.ModelSerializer):
    recommended_job = JobCategorySerializer(read_only=True)

    class Meta:
        model = TestHistory
        fields = ['id', 'recommended_job', 'created_at']
