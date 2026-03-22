from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from .token import decode_access_token

User = get_user_model()

class CustomJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            # Bearer <token>
            parts = auth_header.split()
            if len(parts) != 2 or parts[0].lower() != 'bearer':
                return None
            
            token = parts[1]
            user_id = decode_access_token(token)
            
            # user_id는 pk이거나 username일 수 있음 (token.py에 따라 다름)
            user = User.objects.filter(id=user_id if str(user_id).isdigit() else None).first() or User.objects.filter(username=user_id).first()
            
            if not user:
                raise AuthenticationFailed('User not found')

            return (user, None)
        except Exception as e:
            raise AuthenticationFailed(str(e))
