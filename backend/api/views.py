from collections import OrderedDict, defaultdict

from rest_framework import status, serializers
from rest_framework.authentication import get_authorization_header
from rest_framework.views import APIView 
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed , APIException

from drf_spectacular.utils import (
    extend_schema,
    OpenApiExample,
    OpenApiParameter,
    OpenApiTypes,
    inline_serializer,
)

from user.models import User
from user.serializer import UserSerializer
from .models import Job, Roadmap, Skill, Learning, QuestionChoice, Attempt, UserResponse
from .serializer import (
    JobSerializer, 
    RoadmapSerializer, 
    SkillSerializer,
    RoadmapResponseSerializer,
    LearningSerializer,
    QuestionGroupSerializer, 
    QuizSubmitSerializer, 
    JobTestSubmitSerializer, 
    RecommendedJobSerializer,
    SkillLearningResponseSerializer,
    QuizSubmitResponseSerializer,
    QuizQuestionListResponseSerializer,
    JobTestQuestionListResponseSerializer,
    JobTestSubmitResponseSerializer

)
from authentication.token import create_access_token, create_refresh_token, decode_access_token, decode_refresh_token

from django.shortcuts import get_object_or_404
from django.db import transaction


# Create your views here.
class Register(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save() 
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class LoginView(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']

        user = User.objects.filter(email=username).first()
        if user is None:
            raise APIException('User not found')
        elif not user.check_password(password):
            raise APIException('Incorrect password')
        
        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)
        
        response = Response()
        response.set_cookie(key='refreshToken', value=refresh_token, httponly=True)
        response.data = {
            'token': access_token
        }
        
        return response
    
class RefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refreshToken')
        id = decode_refresh_token(refresh_token)
        access_token = create_access_token(id)
        return Response({
            'token': access_token 
        })

class Logoutview(APIView):
    def post(self, _):
        response = Response()
        response.delete_cookie(key='refreshToken')
        response.data = {
            'message': 'success'
        }
        return response

class SeedDemoData(APIView):
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        summary='데모 데이터 시딩',
        description='데모 유저를 위해 가짜 학습 및 테스트 기록을 생성합니다.',
        tags=['Demo'],
        responses={201: inline_serializer(name='SeedResponse', fields={'message': serializers.CharField()})}
    )
    def post(self, request):
        user = request.user
        
        # 1. 필수 기초 데이터 (Skill, Job)
        python_skill, _ = Skill.objects.get_or_create(code='python', defaults={'name': 'Python Programming'})
        
        job_ai, _ = Job.objects.get_or_create(code='ai-app-eng', defaults={'name': 'AI app 엔지니어'})
        job_ds, _ = Job.objects.get_or_create(code='data-scientist', defaults={'name': 'Data Scientist'})
        job_mlops, _ = Job.objects.get_or_create(code='mlops-eng', defaults={'name': 'MLOps 엔지니어'})
        
        # 이미 데이터가 있으면 기존 것 삭제 후 재생성 (갱신을 위해)
        Attempt.objects.filter(user=user).delete()

        # 2. 학습 퀴즈 이력 생성 (파이썬 기초 시리즈)
        import random
        topics = ["문법 기초", "데이터 타입", "함수와 모듈"]
        for topic in topics:
            # 통과 기록용 Learning
            l_base, _ = Learning.objects.get_or_create(
                code=f'py-{topic}', 
                skill=python_skill, 
                defaults={'name': f'파이썬 기초 - {topic}'}
            )
            
            # 통과 기록 (100점)
            Attempt.objects.create(user=user, attempt_type='quiz', learning=l_base, score=10)
            
            # 미통과 기록 (랜덤 낮은 점수)
            Attempt.objects.create(user=user, attempt_type='quiz', learning=l_base, score=random.randint(1, 5))
        
        # 3. 직무 테스트 이력 생성 (AI, DS, MLOps)
        jobs = [job_ai, job_ds, job_mlops]
        for job in jobs:
            score = random.randint(70, 80)
            Attempt.objects.create(
                user=user, 
                attempt_type='job_test', 
                recommended_job=job,
                score=score
            )
        
        return Response({"message": "Demo data seeded successfully"}, status=status.HTTP_201_CREATED)

# GET /api/jobs/
class JobListView(APIView): # APIView
    @extend_schema(
        summary='직무 목록 조회',
        description='사용자가 선택할 수 있는 전체 직무 목록을 조회합니다.',
        tags=['Job'],
        responses={200: JobSerializer(many=True)},
        examples=[
            OpenApiExample(
                '직무 목록 응답 예시',
                value=[
                    {
                        'id': 1,
                        'code': 'AIS',
                        'name': 'AI 서비스 개발자',
                        'desc': 'AI 서비스를 개발하는 직무'
                    },
                    {
                        'id': 2,
                        'code': 'MLO',
                        'name': 'MLOps 엔지니어',
                        'desc': 'ML 시스템 운영 및 배포하는 직무'
                    },
                    {
                        'id': 3,
                        'code': 'DaS',
                        'name': '데이터 사이언티스트',
                        'desc': '데이터를 분석하여 새로운 인사이트를 도출하는 직무'
                    },
                ],
                response_only=True,
            )
        ]
    )
    def get(self, request):
        # 쿼리셋
        jobs = Job.objects.all()

        # 시리얼라이저를 생성하고 쿼리셋을 전달
        serializer = JobSerializer(jobs, many=True)

        return Response(serializer.data)

# GET /api/jobs/{job_id}/roadmap/
class RoadmapView(APIView):
    @extend_schema(
        summary='직무별 로드맵 조회',
        description='선택한 직무에 필요한 기술 목록과 선수 기술 관계를 함께 조회합니다.',
        tags=['Roadmap'],
        parameters=[
            OpenApiParameter(
                name='job_id',
                type=int,
                location=OpenApiParameter.PATH,
                description='조회할 직무 ID'
            )
        ],
        responses={
            200: RoadmapResponseSerializer,
            404: inline_serializer(
                name='JobNotFoundResponse',
                fields={
                    'detail': serializers.CharField()
                }
            )
        },
        examples=[
            OpenApiExample(
                '직무별 로드맵 응답 예시',
                value={
                    'job': {
                        'id': 1,
                        'code': 'ai_application_engineer',
                        'name': 'AI 서비스 개발자',
                        'desc': 'AI 서비스를 개발하는 직무'
                    },
                    'roadmap': [
                        {
                            'skill_id': 1,
                            'skill_code': 'python',
                            'skill_name': 'Python',
                            'skill_desc': '파이썬 기초',
                            'prerequisite_skill_id': None,
                            'prerequisite_skill_name': None
                        },
                        {
                            'skill_id': 2,
                            'skill_code': 'ml',
                            'skill_name': 'Machine Learning',
                            'skill_desc': '머신러닝 기초',
                            'prerequisite_skill_id': 1,
                            'prerequisite_skill_name': 'Python'
                        }
                    ]
                },
                response_only=True,
            )
        ]
    )
    def get(self, request, job_id):
        job = get_object_or_404(Job, id=job_id)
        # Roadmap 테이블에서 job=job인 데이터를 조회 -> Roadmap 테이블의 skill, prerequisite_skill 열 데이터를 가져옴
        roadmaps = Roadmap.objects.filter(job=job).select_related('skill', 'prerequisite_skill')

        # 직렬화를 위해 시리얼라이저 객체 생성
        job_serializer = JobSerializer(job)
        roadmap_serializer = RoadmapSerializer(roadmaps, many=True)

        return Response({
            'job': job_serializer.data,
            'roadmap': roadmap_serializer.data
        })

# GET /api/skills/{skill_id}/learnings/
class SkillLearningView(APIView):
    @extend_schema(
        summary='기술별 학습 목록 조회',
        description='특정 기술에 포함된 학습 목록을 조회합니다.',
        tags=['Learning'],
        parameters=[
            OpenApiParameter(
                name='skill_id',
                type=int,
                location=OpenApiParameter.PATH,
                description='조회할 기술 ID'
            )
        ],
        responses={
            200: SkillLearningResponseSerializer,
            404: inline_serializer(
                name='SkillNotFoundResponse',
                fields={
                    'detail': serializers.CharField()
                }
            )
        },
        examples=[
            OpenApiExample(
                '기술별 학습 목록 응답 예시',
                value={
                    'skill': {
                        'id': 1,
                        'code': 'python',
                        'name': 'Python',
                        'desc': '파이썬 기초'
                    },
                    'learnings': [
                        {
                            'id': 1,
                            'code': 'python_basic',
                            'name': '파이썬 기초 문법',
                            'desc': 'for, if, while'
                        },
                        {
                            'id': 2,
                            'code': 'python_oop',
                            'name': '파이썬 객체지향',
                            'desc': 'class & instance'
                        }
                    ]
                },
                response_only=True,
            )
        ]
    )
    def get(self, request, skill_id):
        skill = get_object_or_404(Skill, id=skill_id)
        learnings = Learning.objects.filter(skill=skill)

        # 직렬화를 위해 시리얼라이저 객체 생성
        skill_serializer = SkillSerializer(skill)
        learning_serializer = LearningSerializer(learnings, many=True)

        return Response({
            'skill': skill_serializer.data,
            'learnings': learning_serializer.data
        })

# GET /api/learnings/{learning_id}/questions/
class QuizQuestionListView(APIView):
    @extend_schema(
        summary='학습별 퀴즈 문제 조회',
        description='특정 학습 단계에 속한 퀴즈 문제를 question_group_id 기준으로 묶어서 조회합니다.',
        tags=['Quiz'],
        parameters=[
            OpenApiParameter(
                name='learning_id',
                type=int,
                location=OpenApiParameter.PATH,
                description='조회할 학습 ID'
            )
        ],
        responses={
            200: QuizQuestionListResponseSerializer,
            404: inline_serializer(
                name='LearningNotFoundResponse',
                fields={
                    'detail': serializers.CharField()
                }
            )
        },
        examples=[
            OpenApiExample(
                '학습별 퀴즈 조회 응답 예시',
                value={
                    'learning': {
                        'id': 1,
                        'code': 'python_basic',
                        'name': '파이썬 기초 문법',
                        'desc': ''
                    },
                    'questions': [
                        {
                            'question_group_id': 100,
                            'question_text': '파이썬의 자료형이 아닌 것은?',
                            'choices': [
                                {'id': 1, 'choice_text': 'list'},
                                {'id': 2, 'choice_text': 'tuple'},
                                {'id': 3, 'choice_text': 'array'},
                                {'id': 4, 'choice_text': 'int'}
                            ]
                        },
                        {
                            'question_group_id': 101,
                            'question_text': '파이썬에서 함수를 정의하는 키워드는?',
                            'choices': [
                                {'id': 5, 'choice_text': 'import'},
                                {'id': 6, 'choice_text': 'def'},
                                {'id': 7, 'choice_text': 'class'},
                                {'id': 8, 'choice_text': 'map'}
                            ]
                        }
                    ]
                },
                response_only=True,
            )
        ]
    )
    def get(self, request, learning_id):
        learning = get_object_or_404(Learning, id=learning_id)
        question_choices = QuestionChoice.objects.filter(
            learning=learning
        ).order_by('question_group_id', 'id') # order_by로 정렬해서 조회

        grouped_questions = OrderedDict()

        for item in question_choices:
            group_id = item.question_group_id

            if group_id not in grouped_questions:
                grouped_questions[group_id] = {
                    'question_group_id': group_id,
                    'question_text': item.question_text,
                    'choices': []
                }

            grouped_questions[group_id]['choices'].append({
                'id': item.id,
                'choice_text': item.choice_text
            })

        learning_serializer = LearningSerializer(learning)
        question_serializer = QuestionGroupSerializer(list(grouped_questions.values()), many=True)

        return Response({
            'learning': learning_serializer.data,
            'questions': question_serializer.data
        })

# POST /api/quiz/submit/ : url자체에 파라미터를 담아서 보내는 GET과 달리, POST에서는 request에 담아서 파라미터를 보냄
class QuizSubmitView(APIView):
    # # 사용자 로그인 여부 확인
    # permission_classes = [IsAuthenticated]
    
    @extend_schema(
        summary='퀴즈 제출',
        description='학습 퀴즈의 답안을 제출하고, 채점 결과와 응시 결과를 저장합니다.',
        tags=['Quiz'],
        request=QuizSubmitSerializer,
        responses={
            201: QuizSubmitResponseSerializer,
            400: inline_serializer(
                name='QuizSubmitBadRequestResponse',
                fields={
                    'detail': serializers.CharField()
                }
            )
        },
        examples=[
            OpenApiExample(
                '퀴즈 제출 요청 예시',
                value={
                    'learning_id': 1,
                    'answers': [
                        {
                            'question_group_id': 100,
                            'selected_question_choice_id': 3
                        },
                        {
                            'question_group_id': 101,
                            'selected_question_choice_id': 6
                        }
                    ]
                },
                request_only=True,
            ),
            OpenApiExample(
                '퀴즈 제출 성공 응답 예시',
                value={
                    'attempt_id': 1,
                    'learning_id': 1,
                    'score': 2,
                    'total': 2,
                    'results': [
                        {
                            'question_group_id': 100,
                            'selected_question_choice_id': 3,
                            'is_correct': True
                        },
                        {
                            'question_group_id': 101,
                            'selected_question_choice_id': 6,
                            'is_correct': True
                        }
                    ]
                },
                response_only=True,
            ),
            OpenApiExample(
                '퀴즈 제출 실패 응답 예시',
                value={
                    'detail': '100번 문제에 대한 선택지가 올바르지 않습니다.'
                },
                response_only=True,
                status_codes=['400'],
            )
        ]
    )
    def post(self, request):
        serializer = QuizSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # serializer.validated_data['field_name']: serializer에 구현한 validate_<field_name>의 반환값이 저장됨
        learning = get_object_or_404(Learning, id=serializer.validated_data['learning_id'])
        answers = serializer.validated_data['answers']

        # transaction: 데이터베이스의 상태를 변화시키는 작업 단위 -> 한꺼번에 완료가 되거나 실패해야 함; "All or nothing"
        # 한 번에 수행되어야 하는 일련의 작업들에 대한 로직을 with transaction.atomic()으로 묶어줌
        with transaction.atomic():
            attempt = Attempt.objects.create(
                user=request.user,
                attempt_type='quiz',
                learning=learning
            )

            results = []
            score = 0

            for answer in answers:
                question_group_id = answer['question_group_id']
                selected_question_choice_id = answer['selected_question_choice_id']

                selected_choice = get_object_or_404(
                    QuestionChoice,
                    id=selected_question_choice_id,
                    learning=learning
                )

                # 선택한 choice가 해당 question_group_id에 속하는지 검증
                if selected_choice.question_group_id != question_group_id:
                    return Response(
                        {'detail': f'{question_group_id}번 문제에 대한 선택지가 올바르지 않습니다.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                is_correct = bool(selected_choice.is_correct)

                UserResponse.objects.create(
                    attempt=attempt,
                    question_group_id=question_group_id,
                    selected_question_choice=selected_choice,
                    is_correct=is_correct
                )

                if is_correct:
                    score += 1

                results.append({
                    'question_group_id': question_group_id,
                    'selected_question_choice_id': selected_question_choice_id,
                    'is_correct': is_correct
                })

            return Response(
                {
                    'attempt_id': attempt.id,
                    'learning_id': learning.id,
                    'score': score,
                    'total': len(answers),
                    'results': results
                },
                status=status.HTTP_201_CREATED
            )

# GET /api/job-test/questions/
class JobTestQuestionView(APIView):
    @extend_schema(
        summary='직무 추천 테스트 문제 조회',
        description='사용자가 선택한 test_type에 따라 직무 추천 테스트 문항을 question_group_id 기준으로 묶어서 조회합니다.',
        tags=['Job Test'],
        parameters=[
            OpenApiParameter(
                name='test_type',
                description='불러올 테스트 유형 (E 또는 B)',
                required=True,
                type=OpenApiTypes.STR,
                enum=['E', 'B']
            )
        ],
        responses={
            200: JobTestQuestionListResponseSerializer
        },
        examples=[
            OpenApiExample(
                '직무 추천 테스트 문제 조회 성공 예시',
                value={
                    'questions': [
                        {
                            'question_group_id': 201,
                            'question_text': '어떤 업무가 더 흥미롭나요?',
                            'choices': [
                                {
                                    'id': 31,
                                    'choice_text': '사용자 행동 데이터를 분석하고 싶다'
                                },
                                {
                                    'id': 32,
                                    'choice_text': '모델을 운영 환경에 배포하고 싶다'
                                },
                                {
                                    'id': 33,
                                    'choice_text': 'AI 서비스를 직접 구현하고 싶다'
                                },
                                {
                                    'id': 34,
                                    'choice_text': '잘 모르겠다'
                                }
                            ]
                        }
                    ]
                },
                response_only=True
            )
        ]
    )
    def get(self, request):
        test_type = request.query_params.get('test_type')

        test_type_mapping = {
            'E': 'Test_E',
            'B': 'Test_B',
        }

        question_type = test_type_mapping.get(test_type)

        if not question_type:
            return Response(
                {
                    'detail': '유효한 test_type을 입력해주세요. (E 또는 B)'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        question_choices = QuestionChoice.objects.filter(
            question_type=question_type
        ).order_by('question_group_id', 'id')

        grouped_questions = OrderedDict()

        for item in question_choices:
            group_id = item.question_group_id

            if group_id not in grouped_questions:
                grouped_questions[group_id] = {
                    'question_group_id': group_id,
                    'question_text': item.question_text,
                    'choices': []
                }

            grouped_questions[group_id]['choices'].append({
                'id': item.id,
                'choice_text': item.choice_text
            })

        question_serializer = QuestionGroupSerializer(
            list(grouped_questions.values()),
            many=True
        )

        return Response({
            'questions': question_serializer.data
        }, status=status.HTTP_200_OK)

# POST /api/job-test/submit/
class JobTestSubmitView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='직무 추천 테스트 제출',
        description='직무 추천 테스트 답안을 제출하고, 응답을 저장한 뒤 추천 직무를 반환합니다.',
        tags=['Job Test'],
        request=JobTestSubmitSerializer,
        responses={
            201: JobTestSubmitResponseSerializer,
            400: inline_serializer(
                name='JobTestSubmitBadRequestResponse',
                fields={
                    'detail': serializers.CharField()
                }
            ),
            401: inline_serializer(
                name='JobTestSubmitUnauthorizedResponse',
                fields={
                    'detail': serializers.CharField()
                }
            )
        },
        examples=[
            OpenApiExample(
                '직무 추천 테스트 제출 요청 예시',
                value={
                    'answers': [
                        {
                            'question_group_id': 201,
                            'selected_question_choice_id': 31
                        },
                        {
                            'question_group_id': 202,
                            'selected_question_choice_id': 35
                        }
                    ]
                },
                request_only=True
            ),
            OpenApiExample(
                '직무 추천 테스트 제출 성공 예시',
                value={
                    'attempt_id': 7,
                    'recommended_job': {
                        'id': 2,
                        'code': 'data_scientist',
                        'name': 'Data Scientist'
                    },
                    'results': [
                        {
                            'question_group_id': 201,
                            'selected_question_choice_id': 31
                        },
                        {
                            'question_group_id': 202,
                            'selected_question_choice_id': 35
                        }
                    ]
                },
                response_only=True,
                status_codes=['201']
            ),
            OpenApiExample(
                '직무 추천 테스트 제출 실패 예시',
                value={
                    'detail': '201번 문제에 대한 선택지가 올바르지 않습니다.'
                },
                response_only=True,
                status_codes=['400']
            )
        ]
    )
    def post(self, request):
        serializer = JobTestSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        answers = serializer.validated_data['answers']

        with transaction.atomic():
            attempt = Attempt.objects.create(
                user=request.user,
                attempt_type='job_test'
            )

            job_scores = defaultdict(int)
            results = []

            for answer in answers:
                question_group_id = answer['question_group_id']
                selected_question_choice_id = answer['selected_question_choice_id']

                selected_choice = get_object_or_404(
                    QuestionChoice,
                    id=selected_question_choice_id,
                    question_type='job_recommend'
                )

                if selected_choice.question_group_id != question_group_id:
                    return Response(
                        {'detail': f'{question_group_id}번 문제에 대한 선택지가 올바르지 않습니다.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                if selected_choice.recommended_job is None:
                    return Response(
                        {'detail': f'{selected_question_choice_id}번 선택지에 추천 직무가 연결되어 있지 않습니다.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                UserResponse.objects.create(
                    attempt=attempt,
                    question_group_id=question_group_id,
                    selected_question_choice=selected_choice,
                    is_correct=None
                )

                job_scores[selected_choice.recommended_job_id] += 1

                results.append({
                    'question_group_id': question_group_id,
                    'selected_question_choice_id': selected_question_choice_id
                })

            # 최고 점수 직무 선택
            recommended_job_id = max(job_scores, key=job_scores.get)
            recommended_job = Job.objects.get(id=recommended_job_id)

            attempt.recommended_job = recommended_job
            attempt.save()

            return Response(
                {
                    'attempt_id': attempt.id,
                    'recommended_job': RecommendedJobSerializer(recommended_job).data,
                    'results': results
                },
                status=status.HTTP_201_CREATED
            )

class SurveyView(APIView):
    def post(self, request):
        serializer = SurveySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # 로그인 되어 있으면 유저 정보 연결
        user = request.user if request.user.is_authenticated else None
        serializer.save(user=user)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)