from rest_framework import serializers
from .models import Category, Choice, Question


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'choice_text']


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'choices']


class StartAttemptResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    user = serializers.IntegerField()
    subcategory = serializers.IntegerField()
    total_questions = serializers.IntegerField()
    questions = QuestionSerializer(many=True)


class SaveAnswerRequestSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    choice_id = serializers.IntegerField()


class SaveAnswerResponseSerializer(serializers.Serializer):
    attempt_id = serializers.IntegerField()
    question_id = serializers.IntegerField()
    saved = serializers.BooleanField()


class SubmitAnswerItemSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    choice_id = serializers.IntegerField()


class SubmitAttemptRequestSerializer(serializers.Serializer):
    answers = SubmitAnswerItemSerializer(many=True)


class ResultItemSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    question_text = serializers.CharField()
    selected_choice = serializers.CharField()
    correct_choice = serializers.CharField()
    is_correct = serializers.BooleanField()
    explanation = serializers.CharField(allow_blank=True, allow_null=True)


class SubmitAttemptResponseSerializer(serializers.Serializer):
    attempt_id = serializers.IntegerField()
    status = serializers.CharField()
    score = serializers.FloatField()
    correct_count = serializers.IntegerField()
    total_questions = serializers.IntegerField()
    is_passed = serializers.BooleanField()
    results = ResultItemSerializer(many=True)


class MessageResponseSerializer(serializers.Serializer):
    message = serializers.CharField()


class SubCategoryListItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    description = serializers.CharField(allow_blank=True, allow_null=True)
    order = serializers.IntegerField()
    is_unlocked = serializers.BooleanField()
    is_completed = serializers.BooleanField()
    best_score = serializers.FloatField()
    attempt_count = serializers.IntegerField()


class SubCategoryDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    category_id = serializers.IntegerField()
    category_name = serializers.CharField()
    name = serializers.CharField()
    description = serializers.CharField(allow_blank=True, allow_null=True)
    order = serializers.IntegerField()
    pass_score = serializers.IntegerField()


class AttemptListItemSerializer(serializers.Serializer):
    attempt_id = serializers.IntegerField()
    subcategory_name = serializers.CharField()
    attempt_no = serializers.IntegerField()
    score = serializers.FloatField()
    is_passed = serializers.BooleanField()
    status = serializers.CharField()
    submitted_at = serializers.DateTimeField(allow_null=True)


class CategoryProgressSerializer(serializers.Serializer):
    category_id = serializers.IntegerField()
    category_name = serializers.CharField()
    completed_subcategories = serializers.IntegerField()
    total_subcategories = serializers.IntegerField()
    progress_rate = serializers.FloatField()