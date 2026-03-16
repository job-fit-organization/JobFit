from django.contrib.auth import login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status

from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse

from accounts.serializers import (
    SignupRequestSerializer,
    LoginRequestSerializer,
    LogoutRequestSerializer,
    AuthTokenResponseSerializer,
    MessageResponseSerializer,
    UserProfileSerializer,
)


class SignupAPIView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        tags=['Accounts'],
        summary='일반 회원가입',
        description='이메일, 비밀번호, 기본 프로필 정보를 사용해 회원가입합니다.',
        request=SignupRequestSerializer,
        responses={
            201: UserProfileSerializer,
            400: OpenApiResponse(description='유효성 검사 실패'),
        },
        examples=[
            OpenApiExample(
                '회원가입 요청 예시',
                value={
                    'email': 'user@example.com',
                    'username': 'jaekyeong',
                    'nickname': 'moon',
                    'phone': '010-1234-5678',
                    'password': 'test1234!',
                    'password_confirm': 'test1234!',
                },
                request_only=True,
            )
        ],
    )
    def post(self, request):
        serializer = SignupRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserProfileSerializer(user).data, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        tags=['Accounts'],
        summary='일반 로그인',
        description='이메일과 비밀번호로 로그인합니다.',
        request=LoginRequestSerializer,
        responses={
            200: AuthTokenResponseSerializer,
            400: OpenApiResponse(description='로그인 실패'),
        },
        examples=[
            OpenApiExample(
                '로그인 요청 예시',
                value={
                    'email': 'user@example.com',
                    'password': 'test1234!',
                },
                request_only=True,
            ),
            OpenApiExample(
                '로그인 응답 예시',
                value={
                    'user_id': 1,
                    'email': 'user@example.com',
                    'access': 'access.token.example',
                    'refresh': 'refresh.token.example',
                },
                response_only=True,
                status_codes=['200'],
            ),
        ],
    )
    def post(self, request):
        serializer = LoginRequestSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        login(request, user)

        # 실제 구현에서는 JWT 발급 로직 사용
        return Response({
            'user_id': user.id,
            'email': user.email,
            'access': 'access.token.example',
            'refresh': 'refresh.token.example',
        }, status=status.HTTP_200_OK)


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=['Accounts'],
        summary='로그아웃',
        description='현재 로그인된 사용자를 로그아웃 처리합니다.',
        request=LogoutRequestSerializer,
        responses={200: MessageResponseSerializer},
    )
    def post(self, request):
        logout(request)
        return Response({'message': '로그아웃이 완료되었습니다.'}, status=status.HTTP_200_OK)


class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=['Accounts'],
        summary='내 정보 조회',
        description='현재 로그인한 사용자의 프로필 정보를 조회합니다.',
        responses={200: UserProfileSerializer},
    )
    def get(self, request):
        return Response(UserProfileSerializer(request.user).data, status=status.HTTP_200_OK)