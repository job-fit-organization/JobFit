from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse

from accounts.models import User, SocialAccount
from accounts.serializers import SocialLoginRequestSerializer, SocialLoginResponseSerializer


class BaseSocialLoginAPIView(APIView):
    permission_classes = [AllowAny]
    provider_name = None

    @extend_schema(
        tags=['Social Auth'],
        summary='SNS 로그인',
        description='SNS access token 또는 authorization code를 사용해 로그인하거나 신규 가입을 처리합니다.',
        request=SocialLoginRequestSerializer,
        responses={
            200: SocialLoginResponseSerializer,
            400: OpenApiResponse(description='잘못된 요청'),
        },
        examples=[
            OpenApiExample(
                'SNS 로그인 요청 예시',
                value={
                    'provider': 'kakao',
                    'access_token': 'sample-social-access-token'
                },
                request_only=True,
            ),
            OpenApiExample(
                'SNS 로그인 응답 예시',
                value={
                    'user_id': 3,
                    'email': 'socialuser@example.com',
                    'provider': 'kakao',
                    'is_new_user': True,
                    'access': 'access.token.example',
                    'refresh': 'refresh.token.example',
                },
                response_only=True,
                status_codes=['200'],
            ),
        ],
    )
    def post(self, request):
        serializer = SocialLoginRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        provider = self.provider_name
        social_email = f'{provider}_user@example.com'
        provider_user_id = f'{provider}_12345'

        user, created = User.objects.get_or_create(
            email=social_email,
            defaults={
                'username': f'{provider}_user',
                'nickname': f'{provider}_nickname',
            }
        )

        SocialAccount.objects.get_or_create(
            user=user,
            provider=provider,
            provider_user_id=provider_user_id,
            defaults={'email': social_email}
        )

        return Response({
            'user_id': user.id,
            'email': user.email,
            'provider': provider,
            'is_new_user': created,
            'access': 'access.token.example',
            'refresh': 'refresh.token.example',
        }, status=status.HTTP_200_OK)


class KakaoSocialLoginAPIView(BaseSocialLoginAPIView):
    provider_name = 'kakao'


class GoogleSocialLoginAPIView(BaseSocialLoginAPIView):
    provider_name = 'google'


class NaverSocialLoginAPIView(BaseSocialLoginAPIView):
    provider_name = 'naver'