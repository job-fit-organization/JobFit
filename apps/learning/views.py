import json
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from apps.learning.models import Job, Skill, Roadmap, UserCurriculumProgress, Curriculum, UserNote
from apps.accounts.models import UserSelectedJob

# Create your views here.
# 1. 학습 모드 선택 뷰 (templates/mode_select.html 렌더링)
class SelectModeView(LoginRequiredMixin, TemplateView):
    template_name = 'mode_select.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # 로그인 유저 프로필 정보 전달
        context['user_profile'] = getattr(self.request.user, 'profile', None)
        return context

# 2. 관심 직무 선택 뷰 (templates/job_select.html 렌더링)
class JobSelectView(LoginRequiredMixin, TemplateView):
    template_name = 'job_select.html'

    # GET 요청 시: DB의 모든 직무 데이터를 조회하여 템플릿으로 전달
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['jobs'] = Job.objects.all()  # DB의 모든 직무 전송
        return context
    
    def post(self, request, *args, **kwargs):
        job_id = request.POST.get('job_id')
        if job_id:
            user_profile = request.user.profile
            UserSelectedJob.objects.update_or_create(
                user_profile=user_profile,
                defaults={'job_id': job_id}
            )

            return redirect('learning:job_roadmap')
        
        return redirect('learning:job_select')

# 3. 로드맵 메인 뷰 (우선 템플릿 연결만 확보)
class JobRoadmapView(LoginRequiredMixin, TemplateView):
    template_name = 'job_roadmap.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        user_profile = user.profile
        
        # 1. 관심 직무 로드
        selected_job_ref = UserSelectedJob.objects.filter(user_profile=user_profile).first()
        job = selected_job_ref.job
        
        # 2. 해당 직무 로드맵의 선행 구조 분석
        roadmap_items = Roadmap.objects.filter(job=job)
        
        # 스킬별 선행 관계 파악을 위한 간선 리스트 구축
        skills_set = set()
        adj_map = {} # parent -> children
        parent_counts = {} # 각 스킬의 선행 기술 개수 (Topological Sort용)
        
        for item in roadmap_items:
            skills_set.add(item.skill)
            if item.parent_roadmap_id:
                skills_set.add(item.parent_roadmap_id)
                parent_counts[item.skill.id] = parent_counts.get(item.skill.id, 0) + 1
                adj_map.setdefault(item.parent_roadmap_id.id, []).append(item.skill.id)
        
        # 3. 레벨(의존성 깊이) 계산 알고리즘 (BFS 위상 정렬 응용)
        levels = {} # skill_id -> level_number
        queue = []
        
        for skill in skills_set:
            if skill.id not in parent_counts:
                levels[skill.id] = 0 # 선행 과목이 없는 루트 노드들은 Level 0
                queue.append(skill.id)
                
        while queue:
            curr_id = queue.pop(0)
            curr_level = levels[curr_id]
            for child_id in adj_map.get(curr_id, []):
                levels[child_id] = max(levels.get(child_id, 0), curr_level + 1)
                queue.append(child_id)
                
        # 4. 동일 레벨(Level)별 그룹화 및 X, Y 좌표 계산
        level_groups = {} # level_num -> [skill_objects]
        for skill in skills_set:
            lvl = levels.get(skill.id, 0)
            level_groups.setdefault(lvl, []).append(skill)
            
        nodes_data = {}
        for lvl, group in level_groups.items():
            N = len(group)
            # Y축 좌표 설정 (Level 0 = 20%, Level 1 = 50%, Level 2 = 80%)
            top_percent = 20 + (lvl * 30)
            
            for idx, skill in enumerate(group):
                # X축 좌표 설정 (동일 그룹 내 균등 분할)
                left_percent = int((idx + 1) * 100 / (N + 1))
                
                # 진도 연산
                progresses = UserCurriculumProgress.objects.filter(user=user, curriculum__skill=skill)
                status = 'not_started'
                if progresses.exists():
                    status = 'completed' if all(p.is_completed for p in progresses) else 'in_progress'
                
                nodes_data[skill.id] = {
                    'id': skill.id,
                    'name': skill.skill_name,
                    'icon': skill.skill_icon_code or "💎",
                    'status': status,
                    'left': left_percent,
                    'top': top_percent
                }
                
        # 5. 실시간 동적 SVG 화살표 좌표 가공
        edges_data = []
        for item in roadmap_items:
            if item.parent_roadmap_id and item.parent_roadmap_id.id in nodes_data and item.skill.id in nodes_data:
                parent_node = nodes_data[item.parent_roadmap_id.id]
                child_node = nodes_data[item.skill.id]
                
                # 선행 노드가 완료 상태인지 체크하여 화살표 선 색상 지정
                edge_status = 'completed' if parent_node['status'] == 'completed' else 'not_started'
                
                edges_data.append({
                    'x1': parent_node['left'],
                    'y1': parent_node['top'],
                    'x2': child_node['left'],
                    'y2': child_node['top'],
                    'status': edge_status
                })
                
        context['job'] = job
        context['db_nodes'] = nodes_data.values()
        context['db_edges'] = edges_data
        return context

class SkillDetailView(LoginRequiredMixin, TemplateView):
    template_name = 'skill_detail.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        skill_id = self.kwargs.get('skill_id')
        
        skill = get_object_or_404(Skill, id=skill_id)
        curriculums = Curriculum.objects.filter(skill=skill).order_by('curriculum_step')
        
        # 1. 사용자의 메모 내역 로드
        user_notes = UserNote.objects.filter(user=user, curriculum__skill=skill)
        notes_map = {note.curriculum.id: note.content for note in user_notes}
        
        # [핵심] 2. 템플릿 복잡도를 낮추기 위해 각 커리큘럼 객체에 가상 속성으로 필기 내용 병합
        for curr in curriculums:
            curr.user_note_content = notes_map.get(curr.id, "")
        
        context['skill'] = skill
        context['curriculums'] = curriculums # 병합된 리스트 전송
        return context