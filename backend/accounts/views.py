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


class UserProfileView(APIView):
    def get(self, request, user_id):
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM users WHERE user_id=%s", (user_id,))
                user_data = cursor.fetchone()
            conn.close()
            
            if not user_data:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
                
            return Response({
                "name": user_data["name"],
                "level": user_data.get("level", 1),
                "exp": user_data.get("exp", 0),
                "attendanceDays": user_data.get("attendance", 0),
                "progress": {
                    "python_cnt": user_data.get("python_cnt", 0),
                    "mlops_cnt": user_data.get("mlops_cnt", 0),
                    "deeplearning_cnt": user_data.get("deeplearning_cnt", 0),
                }
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"MySQL Select User Error: {e}")
            return Response({'error': 'Database error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserLearningHistoryView(APIView):
    def get(self, request, user_id):
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM learning_histories WHERE user_id=%s ORDER BY completion_time DESC", (user_id,))
                rows = cursor.fetchall()
            conn.close()
            return Response(rows, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserJobHistoryView(APIView):
    def get(self, request, user_id):
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM test_histories WHERE user_id=%s ORDER BY completion_time DESC", (user_id,))
                rows = cursor.fetchall()
            conn.close()
            return Response(rows, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserRecommendationView(APIView):
    def get(self, request, user_id):
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                # 사용자의 최근 직무 테스트 결과를 가져옴
                cursor.execute("""
                    SELECT test_result 
                    FROM test_histories 
                    WHERE user_id=%s 
                    ORDER BY completion_time DESC 
                    LIMIT 1
                """, (user_id,))
                last_test = cursor.fetchone()
            conn.close()

            # 기본 추천 데이터
            recommendation = {
                "type": "탐색 중",
                "title": "끝없는 가능성을 지닌 예비 개발자",
                "description": "아직 충분한 테스트 데이터가 모이지 않았습니다. 직무 역량 테스트를 진행하여 본인에게 딱 맞는 맞춤형 직무 추천을 받아보세요!",
                "matchRate": 0,
                "recommendedJobs": ["소프트웨어 엔지니어", "데이터 분석가", "풀스택 개발자"],
                "traits": ["성장가능성", "다방면", "호기심"]
            }

            if last_test and last_test['test_result']:
                last_type = last_test['test_result']
                if '백엔드' in last_type or 'BackEnd' in last_type:
                    recommendation = {
                        "type": "AI BackEnd",
                        "title": "철저한 계획가형 백엔드 엔지니어",
                        "description": "안정적인 시스템 설계와 꼼꼼한 코드 리뷰에 탁월한 재능을 보이시네요. 데이터의 정합성을 중요시하는 대규모 트래픽 처리 백엔드 직무를 추천합니다.",
                        "matchRate": 98,
                        "recommendedJobs": ["백엔드 엔지니어", "클라우드 아키텍트", "DBA"],
                        "traits": ["분석적", "체계적", "책임감"]
                    }
                elif '프론트엔드' in last_type or 'FrontEnd' in last_type:
                    recommendation = {
                        "type": "UI/UX FrontEnd",
                        "title": "섬세한 아티스트형 프론트엔드 엔지니어",
                        "description": "사용자 경험(UX)과 인터페이스(UI) 최적화에 놀라운 감각을 보여줍니다. 즉각적이고 부드러운 반응성이 필요한 웹 프론트엔드 직무를 추천합니다.",
                        "matchRate": 95,
                        "recommendedJobs": ["프론트엔드 개발자", "UI/UX 엔지니어", "퍼블리셔"],
                        "traits": ["창의적", "사용자중심", "꼼꼼함"]
                    }
                elif '데이터' in last_type or '분석' in last_type or 'Data' in last_type:
                    recommendation = {
                        "type": "Data Analytics",
                        "title": "인사이트 발굴형 데이터 엔지니어",
                        "description": "방대한 데이터 속에서 숨겨진 패턴과 가치를 찾아내는 능력이 뛰어납니다. 비즈니스 의사결정에 직결되는 데이터 직무를 추천합니다.",
                        "matchRate": 96,
                        "recommendedJobs": ["데이터 엔지니어", "데이터 애널리스트", "데이터 사이언티스트"],
                        "traits": ["통찰력", "논리적", "탐구심"]
                    }
                elif 'AI' in last_type or '배포' in last_type or 'MLOps' in last_type or '인공지능' in last_type:
                     recommendation = {
                        "type": "AI MLOps",
                        "title": "혁신을 이끄는 AI 엔지니어",
                        "description": "복잡한 문제 해결 피드백 사이클 단축에 큰 강점을 보입니다. 모델 운영과 자동화를 전담하는 AI MLOps 직무를 강력 추천합니다.",
                        "matchRate": 94,
                        "recommendedJobs": ["머신러닝 엔지니어", "MLOps 엔지니어", "AI 리서처"],
                        "traits": ["혁신적", "문제해결", "주도적"]
                    }
                elif '클라우드' in last_type or '인프라' in last_type or 'DevOps' in last_type:
                     recommendation = {
                        "type": "Cloud Infrastructure",
                        "title": "안정성을 지키는 인프라 전문가",
                        "description": "다양한 서비스의 기반 환경을 조율하고 효율적으로 관리하는 것에 익숙합니다. 시스템의 심장을 다루는 클라우드 직무를 추천합니다.",
                        "matchRate": 92,
                        "recommendedJobs": ["DevOps 엔지니어", "클라우드 엔지니어", "SRE"],
                        "traits": ["전략적", "안정추구", "원활함"]
                    }

            return Response(recommendation, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"User Recommendation Error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PlatformStatsView(APIView):
    def get(self, request):
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                # 1. Total Participants (전체 유저 수)
                cursor.execute("SELECT COUNT(*) as total FROM users")
                total_users = cursor.fetchone()['total']

                # 2. Average Score (학습 + 직무 테스트 전체 평균)
                cursor.execute("""
                    SELECT 
                        (SELECT COALESCE(AVG(score), 0) FROM test_histories) as avg_job,
                        (SELECT COALESCE(AVG(score), 0) FROM learning_histories) as avg_learn
                """)
                avgs = cursor.fetchone()
                
                avg_j, avg_l = 0, 0
                if avgs:
                    avg_j, avg_l = float(avgs.get('avg_job') or 0), float(avgs.get('avg_learn') or 0)
                
                if avg_j and avg_l:
                    avg_score = round((avg_j + avg_l) / 2, 1)
                elif avg_j or avg_l:
                    avg_score = round(avg_j + avg_l, 1)
                else:
                    avg_score = 0

                # 3. Popular Category (가장 많이 본 직무 테스트 결과)
                cursor.execute("""
                    SELECT test_result, COUNT(test_result) as cnt
                    FROM test_histories 
                    GROUP BY test_result
                    ORDER BY cnt DESC
                    LIMIT 1
                """)
                popular_row = cursor.fetchone()
                popular_category = popular_row['test_result'] if popular_row else '데이터 부족'

            conn.close()

            stats = {
                "totalParticipants": total_users,
                "averagePlatformScore": avg_score,
                "popularCategory": popular_category,
            }

            return Response(stats, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Platform Stats Error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
