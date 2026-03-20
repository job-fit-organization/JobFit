from rest_framework import serializers
from .models import Job, Roadmap, Skill, Learning

class JobSerializer(serializers.ModelSerializer): # ModelSerializer: 모델을 바로 직렬화, 모델 row 하나를 그대로 반환할 때 유용
    class Meta:
        model = Job # 사용할 모델
        fields = ['id', 'code', 'name', 'desc'] # 직렬화를 통해 표시할 필드

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'code', 'name', 'desc']

class LearningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Learning
        fields = ['id', 'code', 'name','desc']
    
class RoadmapSerializer(serializers.ModelSerializer):
    '''
    JobSerializer처럼 단순하게 구현하게 되면, -> {job: 1, skill: 1, prerequisite: 1} -> 이걸 가지고 또 스킬을 조회하는 부분이 필요해짐
    => serializer를 model과 유사하게 만들 수 있음
        - serializers.IntegerField(source=FOREIGN_KEY, read_only: 읽기 전용으로 설정)
        - 모델처럼 필드를 만들어두면, 메타 클래스의 fields에 담을 수 있다
    '''
    skill_id = serializers.IntegerField(source='skill.id', read_only=True)
    skill_code = serializers.CharField(source='skill.code', read_only=True)
    skill_name = serializers.CharField(source='skill.name', read_only=True)
    skill_desc = serializers.CharField(source='skill.desc', read_only=True)

    prerequisite_skill_id = serializers.IntegerField(source='prerequisite_skill.id', read_only=True)
    prerequisite_skill_name = serializers.CharField(source='prerequisite_skill.name', read_only=True)
    
    class Meta:
        model = Roadmap # Roadmap 모델을 기준으로 한다
        fields = [ # Roadmap이 참조하고 있는 객체의 값도 꺼내서 보여줄 수 있음, 왜냐하면 위에서 정의한 필드의 source가 'skill.xxx'라서
            'skill_id',
            'skill_code',
            'skill_name',
            'skill_desc',
            'prerequisite_skill_id',
            'prerequisite_skill_name',
        ]

# ----------------
# Common
# ----------------
class ChoiceItemSerializer(serializers.Serializer): # Serializer: 직렬화하여 출력할 구조를 직접 정의(모델과 비슷?)
    id = serializers.IntegerField()
    choice_text = serializers.CharField()

class QuestionGroupSerializer(serializers.Serializer):
    question_group_id = serializers.IntegerField()
    question_text = serializers.CharField()
    choices = ChoiceItemSerializer(many=True) # 시리얼라이저 안에 시리얼라이저 -> {key0: value0, key1: {key2: value, key3: value}}

class AnswerItemSerializer(serializers.Serializer): # 사용자가 입력한 내용을 하나씩 직렬화하는 시리얼라이저
    '''
    question_group_id에 대해 사용자가 선택한 선지 ID(selected_question_choice_id)
    '''
    question_group_id = serializers.IntegerField()
    selected_question_choice_id = serializers.IntegerField()

class BaseAnswerSubmitSerializer(serializers.Serializer): # 사용자가 입력한 내용 제출하기 위해 각각을 묶어서 직렬화
    answers = AnswerItemSerializer(many=True)

    # validate_<field_name>: 사용자 정의 필드에 대해 유효성 검사 절차를 지정할 수 있다 -> 검증된 값 또는 serializers.ValidationError를 반환
    def validate_answers(self, value):
        if not value:
            raise serializers.ValidationError('최소 1개 이상의 답안이 필요합니다.')
        
        group_ids = [item['question_group_id'] for item in value]
        if len(group_ids) != len(set(group_ids)):
            raise serializers.ValidationError('같은 문제에 중복 응답할 수 없습니다.')
        
        return value

# ----------------
# Quiz
# ----------------
class QuizSubmitSerializer(BaseAnswerSubmitSerializer):
    learning_id = serializers.IntegerField()

    def validate_learning_id(self, value):
        if not Learning.objects.filter(id=value).exists():
            raise serializers.ValidationError('존재하지 않는 학습입니다.')
        return value

class QuizSubmitResultSerializer(serializers.Serializer):
    question_group_id = serializers.IntegerField()
    selected_question_choice_id = serializers.IntegerField()
    is_correct = serializers.BooleanField()

class QuizSubmitResponseSerializer(serializers.Serializer):
    attempt_id = serializers.IntegerField()
    learning_id = serializers.IntegerField()
    score = serializers.IntegerField()
    total = serializers.IntegerField()
    results = QuizSubmitResultSerializer(many=True)

# ----------------
# Common
# ----------------
class JobTestSubmitSerializer(BaseAnswerSubmitSerializer):
    pass


class RecommendedJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'code', 'name']


class JobTestSubmitResultSerializer(serializers.Serializer):
    question_group_id = serializers.IntegerField()
    selected_question_choice_id = serializers.IntegerField()


class JobTestSubmitResponseSerializer(serializers.Serializer):
    attempt_id = serializers.IntegerField()
    recommended_job = RecommendedJobSerializer()
    results = JobTestSubmitResultSerializer(many=True)