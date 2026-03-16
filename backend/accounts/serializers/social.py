from rest_framework import serializers


class SocialLoginRequestSerializer(serializers.Serializer):
    provider = serializers.ChoiceField(choices=['kakao', 'google', 'naver'])
    access_token = serializers.CharField(required=False)
    code = serializers.CharField(required=False)

    def validate(self, attrs):
        if not attrs.get('access_token') and not attrs.get('code'):
            raise serializers.ValidationError(
                'access_token 또는 code 중 하나는 반드시 필요합니다.'
            )
        return attrs


class SocialLoginResponseSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    email = serializers.EmailField(allow_blank=True)
    provider = serializers.CharField()
    is_new_user = serializers.BooleanField()
    access = serializers.CharField()
    refresh = serializers.CharField()