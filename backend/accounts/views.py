from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
import requests

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
