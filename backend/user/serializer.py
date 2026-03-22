from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import User
from api.models import Attempt

# api 통신 때 user 정보를 제공하기 위한 객체
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'password', 'email', 'social', 'job']

        extra_kwargs = {
            # 쓰기 전용이기 때문에 비번은 api통신 때 리턴되지 않음 
            'password': {'write_only': True},
            'username': {'required': False}
        }

    # user 생성 요청이 들어올 때, 비밀번호가 hashing 처리된 후 db에 저장 
    def create(self, validated_data):
        print("[UserSerializer][create] Start")
        password = validated_data.pop('password', None)
        
        # username이 명시적으로 전달되지 않았다면 email을 username으로 사용
        if not validated_data.get('username') and validated_data.get('email'):
            validated_data['username'] = validated_data.get('email')

        instance = self.Meta.model(**validated_data)
        if password is not None:
            # provide django, password will be hashing!
            instance.set_password(password)
        instance.save()
        return instance
    
class QuizHistorySerializer(serializers.ModelSerializer): # 기준이 되는 모델과 그 모델이 참조하는 모델의 필드만 필요하다면 ModelSerializer로 충분
    # 기존에 있는 필드를 다시 작성하면 이름을 명확히해서 구분하기 쉽게 됨
    attempt_id = serializers.IntegerField(source='id', read_only=True)
    # 기준이 되는 모델의 필드가 아니라면 정의 필요
    # 1. 참조하는 모델의 필드라면, source 옵션 지정
    learning_id = serializers.IntegerField(source='learning.id', read_only=True)
    learning_code = serializers.CharField(source='learning.code', read_only=True)
    learning_name = serializers.CharField(source='learning.name', read_only=True)
    # 2. 필드는 모델에 존재하지 않지만, 시리얼라이저 클래스 내부에 계산하는 메소드를 구현하여 저장할 수 있음
    score = serializers.SerializerMethodField() # method_name에 호출될 메소드 이름 지정
    total = serializers.SerializerMethodField() # 지정하지 않으면 자동으로 get_<field_name>이 됨

    class Meta:
        model = Attempt
        fields = [
            'attempt_id',
            'learning_id',
            'learning_code',
            'learning_name',
            'score',
            'total',
            'created_at',
        ]

    def get_score(self, obj): # obj: 직렬화되는 객체
        # 필드에 점수가 저장되어 있으면 우선 사용, 아니면 계산
        if obj.score > 0:
            return obj.score
        return obj.responses.filter(is_correct=True).count()

    def get_total(self, obj):
        count = obj.responses.count()
        return count if count > 0 else 10 # 기본 문항 수 10개로 가정

class JobTestHistorySerializer(serializers.ModelSerializer):
    attempt_id = serializers.IntegerField(source='id', read_only=True)
    recommended_job_id = serializers.SerializerMethodField()
    recommended_job_code = serializers.SerializerMethodField()
    recommended_job_name = serializers.SerializerMethodField()

    class Meta:
        model = Attempt
        fields = [
            'attempt_id',
            'recommended_job_id',
            'recommended_job_code',
            'recommended_job_name',
            'score',
            'created_at',
        ]

    def get_recommended_job_id(self, obj):
        return obj.recommended_job.id if obj.recommended_job else None

    def get_recommended_job_code(self, obj):
        return obj.recommended_job.code if obj.recommended_job else "N/A"

    def get_recommended_job_name(self, obj):
        if obj.recommended_job:
            return obj.recommended_job.name
        return "직무 분석 준비 중"
