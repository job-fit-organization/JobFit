import os
import re
from django.core.management.base import BaseCommand
from django.conf import settings
from api.models import QuestionChoice, Job

class Command(BaseCommand):
    help = 'Load job test questions from Beginner and Expert markdown files'

    def handle(self, *args, **kwargs):
        if hasattr(settings, 'BASE_DIR'):
            data_dir = os.path.join(settings.BASE_DIR, 'data')
        else:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            data_dir = os.path.join(base_dir, 'data')

        files = [
            ('Test_B', os.path.join(data_dir, 'beginner_questions-2.md')),
            ('Test_E', os.path.join(data_dir, 'expert_questions-1.md'))
        ]

        # Ensure Job objects exist for mapping
        Job.objects.get_or_create(code='data-sci', defaults={'name': '데이터 사이언티스트'})
        Job.objects.get_or_create(code='ai-app', defaults={'name': 'AI 서비스 개발자'})
        Job.objects.get_or_create(code='mlops', defaults={'name': 'MLOps 엔지니어'})
        
        job_code_map = {
            'data-sci': '데이터 사이언티스트',
            'ai-app': 'AI 서비스 개발자',
            'mlops': 'MLOps 엔지니어'
        }

        # 기존에 있는 데이터 제거
        QuestionChoice.objects.filter(question_type__in=['Test_B', 'Test_E', 'Test', 'job_recommend']).delete()

        choices_to_create = []

        for q_type, filepath in files:
            if not os.path.exists(filepath):
                self.stdout.write(self.style.WARNING(f'File not found: {filepath}'))
                continue

            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            blocks = re.split(r'\*\*Q(\d+)\.\s*(.*?)\*\*', content)
            
            for i in range(1, len(blocks), 3):
                if i + 2 >= len(blocks): break
                q_num = int(blocks[i])
                q_text = blocks[i+1].strip()
                choices_text = blocks[i+2]
                
                if q_type == 'Test_E':
                    group_id = 100 + q_num
                else:
                    group_id = q_num
                
                choice_blocks = re.split(r'\n-\s+', '\n' + choices_text.strip())
                for cb in choice_blocks:
                    cb = cb.strip()
                    if not cb:
                        continue
                    
                    parts = cb.split('\n')
                    choice_desc = parts[0].strip()
                    
                    scores_dict = {}
                    if len(parts) > 1:
                        arrow_line = parts[1].strip()
                        if '→' in arrow_line:
                            mapping_part = arrow_line.split('→')[1].strip()
                            if '중립' not in mapping_part and '0:0:0' not in mapping_part:
                                scores_part = mapping_part.split('/')[0].strip()
                                for pair in scores_part.split(','):
                                    pair = pair.strip()
                                    if ':' in pair:
                                        parts_list = pair.split(':')
                                        if len(parts_list) == 2:
                                            job_name, weight = parts_list
                                            job_name = job_name.strip()
                                            try:
                                                weight = int(weight.strip())
                                            except ValueError:
                                                continue
                                            
                                            job_code = job_code_map.get(job_name)
                                            if job_code:
                                                scores_dict[job_code] = weight
                    
                    choices_to_create.append(QuestionChoice(
                        question_group_id=group_id,
                        question_type=q_type,
                        question_text=q_text,
                        choice_text=choice_desc,
                        job_scores=scores_dict
                    ))

        if choices_to_create:
            QuestionChoice.objects.bulk_create(choices_to_create)
            self.stdout.write(self.style.SUCCESS(f'Successfully loaded {len(choices_to_create)} question choices with weights!'))
        else:
            self.stdout.write(self.style.WARNING('No questions were found or parsed.'))
