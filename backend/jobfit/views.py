from random import sample

from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes

from .models import (
    Category,
    SubCategory,
    Question,
    Choice,
    AssessmentAttempt,
    AttemptQuestion,
    UserAnswer,
    UserSubCategoryProgress,
)
from .serializers import (
    CategorySerializer,
    StartAttemptResponseSerializer,
    SaveAnswerRequestSerializer,
    SaveAnswerResponseSerializer,
    SubmitAttemptRequestSerializer,
    SubmitAttemptResponseSerializer,
    MessageResponseSerializer,
    SubCategoryListItemSerializer,
    SubCategoryDetailSerializer,
    AttemptListItemSerializer,
    CategoryProgressSerializer,
)


@extend_schema(
    methods=['GET'],
    tags=['Categories'],
    summary='카테고리 목록 조회',
    description='학습 서비스의 대분류 카테고리 목록을 조회합니다.',
    responses={200: CategorySerializer(many=True)},
)
@api_view(['GET'])
def category_list_api(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema(
    methods=['GET'],
    tags=['SubCategories'],
    summary='카테고리별 중분류 목록 조회',
    description='특정 대분류에 속한 중분류 목록과 사용자 진행 상태를 조회합니다.',
    parameters=[
        OpenApiParameter(
            name='category_id',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.PATH,
            required=True,
            description='대분류 ID',
        ),
    ],
    responses={200: SubCategoryListItemSerializer(many=True)},
)
@api_view(['GET'])
def subcategory_list_api(request, category_id):
    category = get_object_or_404(Category, pk=category_id)
    subcategories = SubCategory.objects.filter(category=category).order_by('order')

    data = []
    for subcategory in subcategories:
        progress = UserSubCategoryProgress.objects.filter(
            user=request.user,
            subcategory=subcategory
        ).first()

        data.append({
            'id': subcategory.id,
            'name': subcategory.name,
            'description': subcategory.description,
            'order': subcategory.order,
            'is_unlocked': progress.is_unlocked if progress else False,
            'is_completed': progress.is_completed if progress else False,
            'best_score': progress.best_score if progress else 0,
            'attempt_count': progress.attempt_count if progress else 0,
        })

    return Response(data, status=status.HTTP_200_OK)


@extend_schema(
    methods=['GET'],
    tags=['SubCategories'],
    summary='중분류 상세 조회',
    description='특정 중분류의 상세 정보를 조회합니다.',
    parameters=[
        OpenApiParameter(
            name='subcategory_id',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.PATH,
            required=True,
            description='중분류 ID',
        ),
    ],
    responses={200: SubCategoryDetailSerializer},
)
@api_view(['GET'])
def subcategory_detail_api(request, subcategory_id):
    subcategory = get_object_or_404(SubCategory, pk=subcategory_id)

    data = {
        'id': subcategory.id,
        'category_id': subcategory.category.id,
        'category_name': subcategory.category.name,
        'name': subcategory.name,
        'description': subcategory.description,
        'order': subcategory.order,
        'pass_score': subcategory.pass_score,
    }

    return Response(data, status=status.HTTP_200_OK)


@extend_schema(
    methods=['POST'],
    tags=['Assessments'],
    summary='중분류 평가 시작',
    description='특정 중분류의 평가 응시를 시작하고 출제된 5개의 문제를 반환합니다.',
    parameters=[
        OpenApiParameter(
            name='subcategory_id',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.PATH,
            required=True,
            description='중분류 ID',
        ),
    ],
    responses={
        201: StartAttemptResponseSerializer,
        400: MessageResponseSerializer,
    },
    examples=[
        OpenApiExample(
            '평가 시작 성공 예시',
            response_only=True,
            status_codes=['201'],
            value={
                'id': 101,
                'user': 1,
                'subcategory': 11,
                'total_questions': 5,
                'questions': [
                    {
                        'id': 1,
                        'question_text': '파이썬의 문자열 자료형은?',
                        'choices': [
                            {'id': 1, 'choice_text': 'int'},
                            {'id': 2, 'choice_text': 'str'},
                            {'id': 3, 'choice_text': 'list'},
                            {'id': 4, 'choice_text': 'tuple'},
                        ],
                    }
                ],
            },
        ),
    ],
)
@api_view(['POST'])
def start_attempt_api(request, subcategory_id):
    subcategory = get_object_or_404(SubCategory, pk=subcategory_id)

    questions = list(
        Question.objects.filter(subcategory=subcategory, is_active=True)
    )

    if len(questions) < 5:
        return Response(
            {'message': '출제 가능한 문제가 5개보다 적습니다.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    selected_questions = sample(questions, 5)

    previous_attempt_count = AssessmentAttempt.objects.filter(
        user=request.user,
        subcategory=subcategory
    ).count()

    attempt = AssessmentAttempt.objects.create(
        user=request.user,
        subcategory=subcategory,
        status='in_progress',
        total_questions=5,
        attempt_no=previous_attempt_count + 1,
    )

    for idx, question in enumerate(selected_questions, start=1):
        AttemptQuestion.objects.create(
            attempt=attempt,
            question=question,
            order=idx,
        )

    question_data = []
    for question in selected_questions:
        question_data.append({
            'id': question.id,
            'question_text': question.question_text,
            'choices': [
                {
                    'id': choice.id,
                    'choice_text': choice.choice_text,
                }
                for choice in question.choices.all()
            ]
        })

    response_data = {
        'id': attempt.id,
        'user': request.user.id,
        'subcategory': subcategory.id,
        'total_questions': 5,
        'questions': question_data,
    }

    return Response(response_data, status=status.HTTP_201_CREATED)


@extend_schema(
    methods=['POST'],
    tags=['Attempts'],
    summary='답안 임시 저장',
    description='응시 중 특정 문항의 답안을 저장합니다.',
    parameters=[
        OpenApiParameter(
            name='attempt_id',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.PATH,
            required=True,
            description='응시 ID',
        ),
    ],
    request=SaveAnswerRequestSerializer,
    responses={
        200: SaveAnswerResponseSerializer,
        400: MessageResponseSerializer,
    },
    examples=[
        OpenApiExample(
            '요청 예시',
            request_only=True,
            value={
                'question_id': 1,
                'choice_id': 2,
            },
        ),
        OpenApiExample(
            '응답 예시',
            response_only=True,
            status_codes=['200'],
            value={
                'attempt_id': 101,
                'question_id': 1,
                'saved': True,
            },
        ),
    ],
)
@api_view(['POST'])
def save_answer_api(request, attempt_id):
    attempt = get_object_or_404(AssessmentAttempt, pk=attempt_id, user=request.user)

    if attempt.status == 'completed':
        return Response(
            {'message': '이미 제출이 완료된 응시입니다.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = SaveAnswerRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    question_id = serializer.validated_data['question_id']
    choice_id = serializer.validated_data['choice_id']

    question = get_object_or_404(Question, pk=question_id)
    choice = get_object_or_404(Choice, pk=choice_id, question=question)

    is_assigned = AttemptQuestion.objects.filter(
        attempt=attempt,
        question=question
    ).exists()

    if not is_assigned:
        return Response(
            {'message': '해당 문제는 이 응시에 포함되지 않습니다.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    UserAnswer.objects.update_or_create(
        attempt=attempt,
        question=question,
        defaults={
            'selected_choice': choice,
            'is_correct': choice.is_correct,
        }
    )

    return Response(
        {
            'attempt_id': attempt.id,
            'question_id': question.id,
            'saved': True,
        },
        status=status.HTTP_200_OK
    )


@extend_schema(
    methods=['POST'],
    tags=['Attempts'],
    summary='응시 최종 제출',
    description='출제된 5문항에 대한 답안을 최종 제출하고 점수와 해설을 반환합니다.',
    parameters=[
        OpenApiParameter(
            name='attempt_id',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.PATH,
            required=True,
            description='응시 ID',
        ),
    ],
    request=SubmitAttemptRequestSerializer,
    responses={
        200: SubmitAttemptResponseSerializer,
        400: MessageResponseSerializer,
    },
    examples=[
        OpenApiExample(
            '최종 제출 요청 예시',
            request_only=True,
            value={
                'answers': [
                    {'question_id': 1, 'choice_id': 2},
                    {'question_id': 2, 'choice_id': 7},
                    {'question_id': 3, 'choice_id': 9},
                    {'question_id': 4, 'choice_id': 15},
                    {'question_id': 5, 'choice_id': 20},
                ]
            },
        ),
        OpenApiExample(
            '최종 제출 성공 예시',
            response_only=True,
            status_codes=['200'],
            value={
                'attempt_id': 101,
                'status': 'completed',
                'score': 80.0,
                'correct_count': 4,
                'total_questions': 5,
                'is_passed': True,
                'results': [
                    {
                        'question_id': 1,
                        'question_text': '파이썬의 문자열 자료형은?',
                        'selected_choice': 'str',
                        'correct_choice': 'str',
                        'is_correct': True,
                        'explanation': 'str은 문자열 자료형이다.',
                    }
                ],
            },
        ),
    ],
)
@api_view(['POST'])
def submit_attempt_api(request, attempt_id):
    attempt = get_object_or_404(AssessmentAttempt, pk=attempt_id, user=request.user)

    if attempt.status == 'completed':
        return Response(
            {'message': '이미 제출이 완료된 응시입니다.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = SubmitAttemptRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    answers = serializer.validated_data['answers']

    for answer in answers:
        question = get_object_or_404(Question, pk=answer['question_id'])
        choice = get_object_or_404(Choice, pk=answer['choice_id'], question=question)

        is_assigned = AttemptQuestion.objects.filter(
            attempt=attempt,
            question=question
        ).exists()

        if not is_assigned:
            return Response(
                {'message': f'{question.id}번 문제는 현재 응시에 포함되지 않습니다.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        UserAnswer.objects.update_or_create(
            attempt=attempt,
            question=question,
            defaults={
                'selected_choice': choice,
                'is_correct': choice.is_correct,
            }
        )

    assigned_question_count = AttemptQuestion.objects.filter(attempt=attempt).count()
    answered_question_count = UserAnswer.objects.filter(attempt=attempt).count()

    if answered_question_count < assigned_question_count:
        return Response(
            {'message': '5개의 문항에 모두 답변해야 제출할 수 있습니다.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user_answers = UserAnswer.objects.filter(attempt=attempt).select_related(
        'question', 'selected_choice'
    )
    correct_count = user_answers.filter(is_correct=True).count()
    total_questions = attempt.total_questions
    score = (correct_count / total_questions) * 100
    is_passed = score >= attempt.subcategory.pass_score

    attempt.correct_count = correct_count
    attempt.score = score
    attempt.is_passed = is_passed
    attempt.status = 'completed'
    attempt.submitted_at = timezone.now()
    attempt.save()

    progress, created = UserSubCategoryProgress.objects.get_or_create(
        user=request.user,
        subcategory=attempt.subcategory,
        defaults={
            'is_unlocked': True,
            'is_completed': is_passed,
            'best_score': score,
            'latest_score': score,
            'attempt_count': 1,
            'last_attempt_at': timezone.now(),
        }
    )

    if not created:
        progress.latest_score = score
        progress.best_score = max(progress.best_score, score)
        progress.attempt_count += 1
        progress.last_attempt_at = timezone.now()
        if is_passed:
            progress.is_completed = True
        progress.save()

    results = []
    for user_answer in user_answers:
        correct_choice = user_answer.question.choices.filter(is_correct=True).first()

        results.append({
            'question_id': user_answer.question.id,
            'question_text': user_answer.question.question_text,
            'selected_choice': user_answer.selected_choice.choice_text,
            'correct_choice': correct_choice.choice_text if correct_choice else '',
            'is_correct': user_answer.is_correct,
            'explanation': user_answer.question.explanation,
        })

    return Response(
        {
            'attempt_id': attempt.id,
            'status': attempt.status,
            'score': score,
            'correct_count': correct_count,
            'total_questions': total_questions,
            'is_passed': is_passed,
            'results': results,
        },
        status=status.HTTP_200_OK
    )


@extend_schema(
    methods=['GET'],
    tags=['Attempts'],
    summary='응시 결과 조회',
    description='완료된 응시의 점수와 해설을 조회합니다.',
    parameters=[
        OpenApiParameter(
            name='attempt_id',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.PATH,
            required=True,
            description='응시 ID',
        ),
    ],
    responses={
        200: SubmitAttemptResponseSerializer,
        403: MessageResponseSerializer,
    },
)
@api_view(['GET'])
def attempt_result_api(request, attempt_id):
    attempt = get_object_or_404(AssessmentAttempt, pk=attempt_id, user=request.user)

    if attempt.status != 'completed':
        return Response(
            {'message': '응시가 완료되지 않아 결과를 조회할 수 없습니다.'},
            status=status.HTTP_403_FORBIDDEN
        )

    user_answers = UserAnswer.objects.filter(attempt=attempt).select_related(
        'question', 'selected_choice'
    )

    results = []
    for user_answer in user_answers:
        correct_choice = user_answer.question.choices.filter(is_correct=True).first()

        results.append({
            'question_id': user_answer.question.id,
            'question_text': user_answer.question.question_text,
            'selected_choice': user_answer.selected_choice.choice_text,
            'correct_choice': correct_choice.choice_text if correct_choice else '',
            'is_correct': user_answer.is_correct,
            'explanation': user_answer.question.explanation,
        })

    return Response(
        {
            'attempt_id': attempt.id,
            'status': attempt.status,
            'score': attempt.score,
            'correct_count': attempt.correct_count,
            'total_questions': attempt.total_questions,
            'is_passed': attempt.is_passed,
            'results': results,
        },
        status=status.HTTP_200_OK
    )


@extend_schema(
    methods=['GET'],
    tags=['Users'],
    summary='내 응시 이력 조회',
    description='로그인 사용자의 전체 응시 이력을 조회합니다.',
    responses={200: AttemptListItemSerializer(many=True)},
)
@api_view(['GET'])
def my_attempt_list_api(request):
    attempts = AssessmentAttempt.objects.filter(
        user=request.user
    ).select_related('subcategory').order_by('-started_at')

    data = []
    for attempt in attempts:
        data.append({
            'attempt_id': attempt.id,
            'subcategory_name': attempt.subcategory.name,
            'attempt_no': attempt.attempt_no,
            'score': attempt.score,
            'is_passed': attempt.is_passed,
            'status': attempt.status,
            'submitted_at': attempt.submitted_at,
        })

    return Response(data, status=status.HTTP_200_OK)


@extend_schema(
    methods=['GET'],
    tags=['Progress'],
    summary='카테고리 진행률 조회',
    description='특정 대분류에 대한 사용자 진행률을 조회합니다.',
    parameters=[
        OpenApiParameter(
            name='category_id',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.PATH,
            required=True,
            description='대분류 ID',
        ),
    ],
    responses={200: CategoryProgressSerializer},
)
@api_view(['GET'])
def category_progress_api(request, category_id):
    category = get_object_or_404(Category, pk=category_id)

    total_subcategories = SubCategory.objects.filter(category=category).count()
    completed_subcategories = UserSubCategoryProgress.objects.filter(
        user=request.user,
        subcategory__category=category,
        is_completed=True
    ).count()

    progress_rate = 0
    if total_subcategories > 0:
        progress_rate = round((completed_subcategories / total_subcategories) * 100, 2)

    return Response(
        {
            'category_id': category.id,
            'category_name': category.name,
            'completed_subcategories': completed_subcategories,
            'total_subcategories': total_subcategories,
            'progress_rate': progress_rate,
        },
        status=status.HTTP_200_OK
    )


@extend_schema(
    methods=['GET'],
    tags=['Progress'],
    summary='전체 진행률 조회',
    description='로그인 사용자의 전체 카테고리 진행 현황을 조회합니다.',
    responses={200: CategoryProgressSerializer(many=True)},
)
@api_view(['GET'])
def my_progress_api(request):
    categories = Category.objects.all()

    data = []
    for category in categories:
        total_subcategories = SubCategory.objects.filter(category=category).count()
        completed_subcategories = UserSubCategoryProgress.objects.filter(
            user=request.user,
            subcategory__category=category,
            is_completed=True
        ).count()

        progress_rate = 0
        if total_subcategories > 0:
            progress_rate = round((completed_subcategories / total_subcategories) * 100, 2)

        data.append({
            'category_id': category.id,
            'category_name': category.name,
            'completed_subcategories': completed_subcategories,
            'total_subcategories': total_subcategories,
            'progress_rate': progress_rate,
        })

    return Response(data, status=status.HTTP_200_OK)