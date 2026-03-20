from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import (
    extend_schema,
    OpenApiExample,
    OpenApiParameter,
    inline_serializer,
)

from api.models import Attempt
from .serializer import QuizHistorySerializer, JobTestHistorySerializer

# Create your views here.
# GET /users/mypage/quiz-history/
class QuizHistoryView(APIView):
    # permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='내 퀴즈 응시 이력 조회',
        description='로그인한 사용자의 학습 퀴즈 응시 이력을 최신순으로 조회합니다.',
        tags=['User'],
        responses={
            200: QuizHistorySerializer(many=True),
            401: inline_serializer(
                name='QuizHistoryUnauthorizedResponse',
                fields={
                    'detail': serializers.CharField()
                }
            )
        },
        examples=[
            OpenApiExample(
                '퀴즈 응시 이력 조회 성공 예시',
                value=[
                    {
                        'attempt_id': 3,
                        'learning_id': 1,
                        'learning_code': 'python_basic',
                        'learning_name': '파이썬 기초 문법',
                        'score': 2,
                        'total': 2,
                        'created_at': '2026-03-20T15:30:00'
                    },
                    {
                        'attempt_id': 4,
                        'learning_id': 2,
                        'learning_code': 'python_oop',
                        'learning_name': '파이썬 객체지향',
                        'score': 1,
                        'total': 3,
                        'created_at': '2026-03-21T10:00:00'
                    }
                ],
                response_only=True
            )
        ]
    )
    def get(self, request):
        attempts = Attempt.objects.filter(
            user=request.user,
            attempt_type='quiz',
        ).select_related('learning').prefetch_related('responses').order_by('-created_at')

        serializer = QuizHistorySerializer(attempts, many=True)
        return Response(serializer.data)

# GET /user/mypage/job-test-history
class JobTestHistoryView(APIView):
    # permission_classes = [IsAuthenticated]
    
    @extend_schema(
        summary='내 직무 추천 테스트 이력 조회',
        description='로그인한 사용자의 직무 추천 테스트 이력을 최신순으로 조회합니다.',
        tags=['User'],
        responses={
            200: JobTestHistorySerializer(many=True),
            401: inline_serializer(
                name='JobTestHistoryUnauthorizedResponse',
                fields={
                    'detail': serializers.CharField()
                }
            )
        },
        examples=[
            OpenApiExample(
                '직무 추천 테스트 이력 조회 성공 예시',
                value=[
                    {
                        'attempt_id': 7,
                        'recommended_job_id': 2,
                        'recommended_job_code': 'data_scientist',
                        'recommended_job_name': 'Data Scientist',
                        'created_at': '2026-03-22T14:20:00'
                    },
                    {
                        'attempt_id': 5,
                        'recommended_job_id': 1,
                        'recommended_job_code': 'ai_application_engineer',
                        'recommended_job_name': 'AI 서비스 개발자',
                        'created_at': '2026-03-19T09:10:00'
                    }
                ],
                response_only=True
            )
        ]
    )
    def get(self, request):
        attempts = Attempt.objects.filter(
            user=request.user,
            attempt_type='job_test'
        ).select_related('recommended_job').order_by('-created_at')

        serializer = JobTestHistorySerializer(attempts, many=True)
        return Response(serializer.data)