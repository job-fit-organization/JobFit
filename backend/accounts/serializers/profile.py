from rest_framework import serializers
from accounts.models import User, SocialAccount


class SocialAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialAccount
        fields = ['provider', 'provider_user_id', 'email', 'connected_at']


class UserProfileSerializer(serializers.ModelSerializer):
    social_accounts = SocialAccountSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'nickname',
            'phone',
            'social_accounts',
        ]