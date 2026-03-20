from collections import OrderedDict, defaultdict

from rest_framework import status
from rest_framework.authentication import get_authorization_header
from rest_framework.views import APIView 
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed , APIException

from user.models import User
from user.serializer import UserSerializer
from .models import Job, Roadmap, Skill, Learning, QuestionChoice, Attempt, UserResponse
from .serializer import JobSerializer, RoadmapSerializer, SkillSerializer, LearningSerializer, QuestionGroupSerializer, QuizSubmitSerializer, JobTestSubmitSerializer, RecommendedJobSerializer
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

# GET /api/jobs/
class JobListView(APIView): # APIView
    def get(self, request):
        # 쿼리셋
        jobs = Job.objects.all()

        # 시리얼라이저를 생성하고 쿼리셋을 전달
        serializer = JobSerializer(jobs, many=True)

        return Response(serializer.data)

# GET /api/jobs/{job_id}/roadmap/
class RoadmapView(APIView):
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
    def get(self, request):
        question_choices = QuestionChoice.objects.filter(
            question_type='Test'
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

        question_serializer = QuestionGroupSerializer(list(grouped_questions.values()), many=True)

        return Response({
            'questions': question_serializer.data
        })


# POST /api/job-test/submit/
class JobTestSubmitView(APIView):
    permission_classes = [IsAuthenticated]

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