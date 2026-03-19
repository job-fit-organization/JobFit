from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer): # ModelSerializer: 모델을 바로 직렬화
    class Meta:
        model = Job # 사용할 모델
        fields = ['id', 'code', 'name', 'desc'] # 직렬화를 통해 표시할 필드
    
    