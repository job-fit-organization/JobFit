import os
import json
from django.conf import settings
from django.core.management.base import BaseCommand

from api.models import Skill, Learning, QuestionChoice, Job, Roadmap
from groq import Groq

class Command(BaseCommand):
    help = 'Generate Learning and Quiz content using Groq API'

    def handle(self, *args, **kwargs):
        api_key = settings.GROQ_API_KEY
        if not api_key:
            self.stdout.write(self.style.ERROR(
                'GROQ_API_KEY environment variable is not set. '
                'Please set it in your environment or .env file before running.'
            ))
            return

        client = Groq(api_key=api_key)
        # Groq에서 권장하는 빠르고 똑똑한 최신 Llama3 기반 범용 모델
        # (만약 에러가 난다면 'llama3-70b-8192' 로 변경해보세요)
        model_name = "openai/gpt-oss-120b" 
        
        # 1. Job 기반 Skill 생성
        self.stdout.write(self.style.WARNING("== 단계 1: Groq LLM으로 직무(Job)별 필수 Skill(기술) 생성 =="))
        jobs = Job.objects.all()
        if not jobs.exists():
            self.stdout.write(self.style.ERROR("DB에 직무(Job) 데이터가 하나도 없습니다. load_tests 명령어를 먼저 실행해주세요."))
            return

        for job in jobs:
            if not Roadmap.objects.filter(job=job).exists():
                self.stdout.write(f"  -> '{job.name}'의 핵심 기술 로드맵(학습 순서) 생성 중...")
                prompt = f"""
                너는 IT 커리어 컨설턴트야. '{job.name}' ({job.desc}) 직무를 수행하기 위해 반드시 순서대로 학습해야 하는 핵심 IT 기술(Skill) 10가지를 추천해줘.
                반드시 초보자가 처음부터 배워나가는 **학습 순서대로** 배열해야 해. (선행 기술 -> 후행 기술)
                각 기술은 {{"code": "식별자(영문소문자)", "name": "기술명", "desc": "설명"}} 구조를 가져야 해.
                반드시 아래 JSON 형식으로만 응답해:
                {{
                    "skills": [
                        {{"code": "python", "name": "Python", "desc": "데이터 분석 및 개발을 위한 범용 언어"}},
                        {{"code": "sql", "name": "SQL", "desc": "데이터베이스 관리를 위한 언어"}},
                        {{"code": "numpy-pandas", "name": "Numpy & Pandas", "desc": "데이터 분석 및 개발을 위한 범용 라이브러리"}},
                        {{"code": "ml", "name": "Machine Learning", "desc": "AI 모델 개발을 위한 머신러닝 기초 이론과 실습"}},
                        {{"code": "deep-learning", "name": "Deep Learning", "desc": "AI 모델 개발을 위한 딥러닝 기초 이론과 실습"}}
                    ]
                }}
                """
                
                try:
                    completion = client.chat.completions.create(
                        model=model_name,
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.7,
                        response_format={"type": "json_object"}
                    )
                    
                    data = json.loads(completion.choices[0].message.content)
                    skills_list = data.get('skills', [])
                    
                    prev_skill = None
                    for item in skills_list:
                        skill, _ = Skill.objects.get_or_create(
                            code=item['code'],
                            defaults={'name': item['name'], 'desc': item.get('desc', '')}
                        )
                        # 이전 단계 기술이 있다면 prerequisite_skill로 등록하여 학습 순서 연결
                        roadmap, created = Roadmap.objects.get_or_create(
                            job=job, 
                            skill=skill,
                            defaults={'prerequisite_skill': prev_skill}
                        )
                        if not created and roadmap.prerequisite_skill != prev_skill:
                            roadmap.prerequisite_skill = prev_skill
                            roadmap.save()
                            
                        prev_skill = skill
                        
                    self.stdout.write(self.style.SUCCESS(f"  -> {job.name}: {len(skills_list)}개의 기술 및 로드맵 순서 등록 완료!"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Error generating skills for {job.name}: {e}"))
            else:
                self.stdout.write(f"  -> '{job.name}'의 기술 스택이 이미 존재합니다 (생성 스킵).")

        all_skills = Skill.objects.all()

        # 2. Skill 기반 Learning 주제 생성
        self.stdout.write(self.style.WARNING("\n== 단계 2: Groq LLM으로 Learning(학습 주제) 목차 생성 =="))
        for skill in all_skills:
            if not Learning.objects.filter(skill=skill).exists():
                self.stdout.write(f"  -> '{skill.name}' 커리큘럼 생성 중...")
                prompt = f"""
                너는 훌륭한 IT 커리큘럼 설계자야. '{skill.name}' 기술을 웹 서비스에서 학습시키기 위한 핵심 소주제 5가지를 만들어줘.
                각 주제는 {{"code": "식별자(영문소문자)", "name": "주제명(한글)", "desc": "설명"}} 구조를 가져야 해.
                반드시 아래 JSON 형식으로만 응답해:
                {{
                    "learnings": [
                        {{"code": "python_beginner", "name": "파이썬 입문", "desc": "변수와 자료형, 조건문과 반복문, 함수, 기본 자료구조 등 파이썬 코드를 작성하기 위한 기초 문법"}},
                        {{"code": "python_intermediate", "name": "파이썬 중급", "desc": "클래스와 객체의 이해, 모듈화, 리스트 컴프리헨션, lambda/map/filter 등 파이썬 코드를 구조화하고 재사용하는 방법"}},
                        {{"code": "python_advanced", "name": "파이썬 심화", "desc": "메모리와 객체 모델, 함수 심화(closure, decorator 등), dunder와 매직 메소드 등 파이썬이 어떻게 동작하는지 심도있게 학습"}}
                    ]
                }}
                """
                
                try:
                    completion = client.chat.completions.create(
                        model=model_name,
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.7,
                        response_format={"type": "json_object"}
                    )
                    
                    data = json.loads(completion.choices[0].message.content)
                    learnings_list = data.get('learnings', [])
                    for item in learnings_list:
                        Learning.objects.get_or_create(
                            code=item['code'],
                            defaults={
                                'name': item['name'],
                                'desc': item.get('desc', ''),
                                'skill': skill
                            }
                        )
                    self.stdout.write(self.style.SUCCESS(f"  -> {len(learnings_list)}개의 주제 생성 완료!"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Error generating learning for {skill.name}: {e}"))
            else:
                self.stdout.write(f"  -> '{skill.name}' 커리큘럼이 이미 존재합니다 (생성 스킵).")

        all_learnings = Learning.objects.all()

        # 3. Learning 기반 Quiz 생성
        self.stdout.write(self.style.WARNING("\n== 단계 3: Groq LLM으로 각 주제별 퀴즈(Quiz) 생성 =="))
        
        last_q = QuestionChoice.objects.all().order_by('-question_group_id').first()
        next_group_id = (last_q.question_group_id + 1) if last_q else 1

        for learning in all_learnings:
            if not QuestionChoice.objects.filter(learning=learning, question_type='Quiz').exists():
                self.stdout.write(f"  -> '{learning.name}' 퀴즈 출제 중...")
                prompt = f"""
                너는 훌륭한 IT 퀴즈 출제자야. '{learning.skill.name}'의 '{learning.name}' ({learning.desc}) 주제에 대한 4지선다형 객관식 퀴즈 5개를 만들어줘.
                문제는 난이도가 조금 있어야 하며, 선택지는 무조건 4개여야 해. 정답(is_correct: true)은 4개 중 1개만 있어야 해.
                반드시 아래 JSON 형식으로만 응답해:
                {{
                    "questions": [
                        {{
                            "question_text": "파이썬에서 리스트를 선언하는 방법은?",
                            "choices": [
                                {{"choice_text": "[]", "is_correct": true}},
                                {{"choice_text": "{{}}", "is_correct": false}},
                                {{"choice_text": "()", "is_correct": false}},
                                {{"choice_text": "<>", "is_correct": false}}
                            ]
                        }}
                    ]
                }}
                """
                
                try:
                    completion = client.chat.completions.create(
                        model=model_name,
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.7,
                        response_format={"type": "json_object"}
                    )
                    
                    data = json.loads(completion.choices[0].message.content)
                    questions = data.get('questions', [])
                    
                    choices_to_create = []
                    for q in questions:
                        current_group_id = next_group_id
                        next_group_id += 1
                        
                        for choice in q.get('choices', []):
                            choices_to_create.append(QuestionChoice(
                                question_group_id=current_group_id,
                                question_type='Quiz',
                                learning=learning,
                                question_text=q['question_text'],
                                choice_text=choice['choice_text'],
                                is_correct=bool(choice.get('is_correct', False))
                            ))
                            
                    if choices_to_create:
                        QuestionChoice.objects.bulk_create(choices_to_create)
                        self.stdout.write(self.style.SUCCESS(f"  -> {len(questions)}개의 퀴즈 문제 생성 완료!"))
                        
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Error generating quiz for {learning.name}: {e}"))
            else:
                self.stdout.write(f"  -> '{learning.name}' 퀴즈가 이미 존재합니다 (생성 스킵).")

        self.stdout.write(self.style.SUCCESS('\n=== 모든 AI 콘텐츠 파이프라인 처리가 완료되었습니다 ==='))
