from collections import defaultdict

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch

from drf_spectacular.utils import extend_schema, OpenApiExample

from .models import (
    JobCategory,
    JobRecommendationQuestion,
    JobRecommendationChoice,
    TestHistory
)
from .serializers import (
    JobRecommendationQuestionSerializer,
    TestSubmitRequestSerializer,
    TestHistorySerializer,
    JobCategorySerializer
)


from django.conf import settings
import random

@extend_schema(
    methods=['GET'],
    tags=['AI Job Recommendation'],
    summary='추천 테스트 문항 목록 조회',
    description=f'활성화된 AI 직무 추천 테스트 문항과 선택지를 무작위로 조회합니다. (기본 {getattr(settings, "RECOMMENDATION_QUESTION_COUNT", 10)}문항)',
    responses={200: JobRecommendationQuestionSerializer(many=True)},
)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_recommendation_questions(request):
    # Fetch all active questions
    all_questions = list(JobRecommendationQuestion.objects.filter(is_active=True).prefetch_related(
        Prefetch('choices', queryset=JobRecommendationChoice.objects.all())
    ))
    
    # Check settings for how many to return, default to 10
    limit = getattr(settings, 'RECOMMENDATION_QUESTION_COUNT', 10)
    
    # Randomly select up to limit
    if len(all_questions) > limit:
        selected_questions = random.sample(all_questions, limit)
    else:
        selected_questions = all_questions

    serializer = JobRecommendationQuestionSerializer(selected_questions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema(
    methods=['POST'],
    tags=['AI Job Recommendation'],
    summary='테스트 결과 제출 및 직무 추천',
    description='사용자가 선택한 답안을 제출하고 추천 직무를 반환받습니다. 회원의 경우 히스토리가 저장됩니다.',
    request=TestSubmitRequestSerializer,
    responses={
        200: JobCategorySerializer,
        400: dict,
    },
    examples=[
        OpenApiExample(
            '제출 예시',
            value={
                'answers': [
                    {'question_id': 1, 'choice_id': 3},
                    {'question_id': 2, 'choice_id': 7}
                ]
            },
            request_only=True,
        )
    ]
)
@api_view(['POST'])
@permission_classes([AllowAny])
def submit_recommendation_test(request):
    serializer = TestSubmitRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    answers = serializer.validated_data['answers']
    
    # Calculate scores per category based on chosen choices
    category_scores = defaultdict(int)
    saved_answers = {}
    
    for answer in answers:
        question_id = answer['question_id']
        choice_id = answer['choice_id']
        
        choice = get_object_or_404(JobRecommendationChoice, pk=choice_id, question_id=question_id)
        saved_answers[str(question_id)] = choice_id
        
        # score_profile example: {"1": 10, "3": 5} -> string keys mapping to int values
        for cat_id_str, score in choice.score_profile.items():
            try:
                cat_id = int(cat_id_str)
                category_scores[cat_id] += score
            except ValueError:
                continue

    recommended_job = None
    if category_scores:
        # Get category with highest score
        best_cat_id = max(category_scores, key=category_scores.get)
        recommended_job = JobCategory.objects.filter(pk=best_cat_id).first()
    
    # If no job could be determined or no categories setup, fallback or random? Let's assume there's always a match 
    # if the DB is set up correctly, else None.
    
    if request.user.is_authenticated:
        # Save history for members
        TestHistory.objects.create(
            user=request.user,
            recommended_job=recommended_job,
            answers=saved_answers
        )

    if recommended_job:
        response_serializer = JobCategorySerializer(recommended_job)
        return Response(response_serializer.data, status=status.HTTP_200_OK)
    else:
        # Fallback if DB is empty or score was 0
        return Response({'message': '적절한 추천 직무를 찾지 못했습니다.'}, status=status.HTTP_200_OK)


@extend_schema(
    methods=['GET'],
    tags=['AI Job Recommendation'],
    summary='직무 추천 테스트 이력 조회 (회원 전용)',
    description='회원의 이전 직무 추천 결과 이력을 조회합니다.',
    responses={200: TestHistorySerializer(many=True)},
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recommendation_history(request):
    histories = TestHistory.objects.filter(user=request.user).order_by('-created_at')
    serializer = TestHistorySerializer(histories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
