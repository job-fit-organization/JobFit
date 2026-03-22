from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
import requests
import pymysql
import os

def get_db_connection():
    return pymysql.connect(
        host=os.environ.get('DB_HOST', '127.0.0.1'),
        user=os.environ.get('DB_USER', 'root'),
        password=os.environ.get('DB_PASSWORD', 'password'),
        database=os.environ.get('DB_NAME', 'jobfit'),
        port=int(os.environ.get('DB_PORT', 3306)),
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

class KakaoLoginView(APIView):
    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Code is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 1. Exchange code for Kakao access token
        token_url = "https://kauth.kakao.com/oauth/token"
        token_data = {
            "grant_type": "authorization_code",
            "client_id": settings.KAKAO_REST_API_KEY,
            "redirect_uri": settings.KAKAO_REDIRECT_URI,
            "code": code,
        }
        token_headers = {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
        }
        
        token_res = requests.post(token_url, data=token_data, headers=token_headers)
        if token_res.status_code != 200:
            print(f"KAKAO TOKEN ERROR: {token_res.json()}")
            return Response({'error': 'Failed to get Kakao access token', 'details': token_res.json()}, status=status.HTTP_400_BAD_REQUEST)
        
        kakao_access_token = token_res.json().get('access_token')
        
        # 2. Get User Profile from Kakao
        profile_url = "https://kapi.kakao.com/v2/user/me"
        profile_headers = {
            "Authorization": f"Bearer {kakao_access_token}",
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
        }
        
        profile_res = requests.get(profile_url, headers=profile_headers)
        if profile_res.status_code != 200:
            return Response({'error': 'Failed to get user profile from Kakao'}, status=status.HTTP_400_BAD_REQUEST)
        
        profile_json = profile_res.json()
        kakao_id = str(profile_json.get("id"))
        
        # Kakao user properties (optional depending on scopes)
        properties = profile_json.get("properties", {})
        nickname = properties.get("nickname", f"user_{kakao_id}")
        
        # 3. Get or Create User
        user, created = User.objects.get_or_create(username=kakao_id)
        if created:
            user.first_name = nickname
            user.save()
            
        # 3.5. Sync with Custom MySQL Users table
        try:
            conn = get_db_connection()
            kakao_email = profile_json.get("kakao_account", {}).get("email", f"{kakao_id}@kakao.com")
            
            with conn.cursor() as cursor:
                sql = """
                    INSERT INTO users (user_id, email, password, name)
                    VALUES (%s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE name=VALUES(name)
                """
                cursor.execute(sql, (kakao_id, kakao_email, 'kakao_dummy_password', nickname))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"MySQL Sync Error: {e}")
            
        # 4. Generate JWT Tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'nickname': user.first_name
            }
        }, status=status.HTTP_200_OK)


class WithdrawView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        user = request.user
        kakao_id = user.username
        
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM users WHERE user_id=%s", (kakao_id,))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"MySQL Delete Error: {e}")
            
        user.delete()
        return Response({'message': 'Successfully withdrawn'}, status=status.HTTP_200_OK)


from django.contrib.auth import get_user_model
from api.models import Attempt
from django.db.models import Avg, Count

User = get_user_model()

class UserProfileView(APIView):
    def get(self, request, user_id):
        try:
            # user_id는 username(이메일) 또는 pk일 수 있음
            user = User.objects.filter(username=user_id).first() or User.objects.filter(id=user_id if str(user_id).isdigit() else None).first()
            
            if not user:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
                
            # 진행도 계산 (Attempt 모델 기준)
            progress = {
                "python_cnt": Attempt.objects.filter(user=user, learning__skill__code__icontains='python').count(),
                "mlops_cnt": Attempt.objects.filter(user=user, learning__skill__code__icontains='mlops').count(),
                "llm_cnt": Attempt.objects.filter(user=user, learning__skill__code__icontains='llm').count(),
                "deeplearning_cnt": Attempt.objects.filter(user=user, learning__skill__code__icontains='deep').count(),
            }

            return Response({
                "name": user.name or user.username,
                "email": user.email,
                "level": getattr(user, 'level', 1),
                "exp": getattr(user, 'exp', 0),
                "attendanceDays": getattr(user, 'attendance', 0),
                "progress": progress
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"UserProfileView Error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserLearningHistoryView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.filter(username=user_id).first()
            if not user: return Response([], status=status.HTTP_200_OK)
            
            attempts = Attempt.objects.filter(user=user, attempt_type='quiz').order_by('-created_at')
            # 기존 응답 포맷(raw query 결과)과 맞추기 위해 변환
            data = [{
                "id": a.id,
                "skill": a.learning.skill.name if a.learning and a.learning.skill else "Unknown",
                "score": a.responses.filter(is_correct=True).count(), # 임시 계산
                "completion_time": a.created_at.isoformat()
            } for a in attempts]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserJobHistoryView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.filter(username=user_id).first()
            if not user: return Response([], status=status.HTTP_200_OK)
            
            attempts = Attempt.objects.filter(user=user, attempt_type='job_test').order_by('-created_at')
            data = [{
                "id": a.id,
                "test_result": a.recommended_job.name if a.recommended_job else "Unknown",
                "score": 100,
                "completion_time": a.created_at.isoformat()
            } for a in attempts]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserRecommendationView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.filter(username=user_id).first()
            last_attempt = Attempt.objects.filter(user=user, attempt_type='job_test').order_by('-created_at').first()

            # 기본 추천 데이터 (기존 로직 유지)
            recommendation = {
                "type": "탐색 중",
                "title": "끝없는 가능성을 지닌 예비 개발자",
                "description": "아직 충분한 테스트 데이터가 모이지 않았습니다. 직무 역량 테스트를 진행하여 본인에게 딱 맞는 맞춤형 직무 추천을 받아보세요!",
                "matchRate": 0,
                "recommendedJobs": ["소프트웨어 엔지니어", "데이터 분석가", "풀스택 개발자"],
                "traits": ["성장가능성", "다방면", "호기심"]
            }

            if last_attempt and last_attempt.recommended_job:
                job_name = last_attempt.recommended_job.name
                recommendation["matchRate"] = last_attempt.score or 0
                recommendation["description"] = f"최근 진행하신 직무 역량 테스트 결과, {job_name} 분야에서 뛰어난 잠재력을 보여주셨습니다."
                
                if 'AI app' in job_name:
                    recommendation["type"] = "AI App Engineer"
                    recommendation["title"] = "창의적인 AI 애플리케이션 빌더"
                    recommendation["traits"] = ["창의성", "문제해결", "AI융합"]
                elif 'Data Scientist' in job_name:
                    recommendation["type"] = "Data Scientist"
                    recommendation["title"] = "데이터의 가치를 찾는 분석 전문가"
                    recommendation["traits"] = ["논리력", "수리감각", "통찰력"]
                elif 'MLOps' in job_name:
                    recommendation["type"] = "MLOps Engineer"
                    recommendation["title"] = "안정적인 AI 인프라 최적화 전문가"
                    recommendation["traits"] = ["효율성", "시스템이해", "자동화"]
                else:
                    recommendation["type"] = job_name
                    recommendation["title"] = f"준비된 {job_name} 전문가"

            return Response(recommendation, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PlatformStatsView(APIView):
    def get(self, request):
        try:
            total_users = User.objects.count()
            
            stats = {
                "totalParticipants": total_users,
                "averagePlatformScore": 85.5, # 데모용 고정값
                "popularCategory": "AI 서비스 개발자",
            }
            return Response(stats, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            stats = {
                "totalParticipants": total_users,
                "averagePlatformScore": avg_score,
                "popularCategory": popular_category,
            }

            return Response(stats, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Platform Stats Error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
