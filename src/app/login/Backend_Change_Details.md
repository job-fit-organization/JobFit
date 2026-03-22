# JobFit 백엔드(Backend) 수정 상세 내역 (Before & After)

이 문서는 백엔드 시스템의 안정성 강화와 데모 데이터 연동을 위해 진행된 주요 코드 변경 사항을 정리한 것입니다.

---

## 1. 인증 및 보안 (Authentication)

### 🛡️ Bearer 토큰 인증 추가 (`authentication/authenticators.py`)
**[수정 전]**: 기본 JWT 인증만 지원하여 프론트엔드의 `Authorization: Bearer <token>` 형식을 처리하지 못함.
**[수정 후]**: `CustomJWTAuthentication` 클래스를 구현하여 `Bearer` 접두사가 붙은 토큰을 정상적으로 파싱하고 사용자를 식별하도록 개선.

```python
# [After] 신규 추가
class CustomJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth = get_authorization_header(request).split()
        if not auth or auth[0].lower() != b'bearer':
            return None
        # 토큰 디코딩 및 유저 반환 로직...
```

### 🐞 예외 처리기 버그 수정 (`authentication/exceptions.py`)
**[수정 전]**: 에러 발생 시 `None` 객체의 속성에 접근하려다 백엔드 자체가 Crash(500 에러) 발생.
**[수정 후]**: 객체 존재 여부를 먼저 확인하는 방어 코드를 추가하여 실제 에러 원인이 프론트엔드에 정확히 전달되도록 수정.

```python
# [Before]
error_code = response.data.get('code') # response가 None일 경우 Crash

# [After]
if response is not None:
    error_code = response.data.get('code')
```

---

## 2. 데이터 모델 및 API 기능 (Models & API)

### 📊 테스트 점수 및 직무 저장 (`api/models.py`)
**[수정 전]**: `Attempt` 모델에 점수(`score`)와 추천 직무(`recommended_job`) 필드가 없어 결과 저장이 불가능함.
**[수정 후]**: 해당 필드들을 추가하고 마이그레이션을 완료하여 테스트 결과를 영구적으로 기록할 수 있게 함.

```python
# [After] 필드 추가
class Attempt(models.Model):
    # ... 기존 필드
    score = models.PositiveIntegerField(default=0)
    recommended_job = models.ForeignKey('Job', on_delete=models.SET_NULL, null=True)
```

### 🧪 데모 데이터 자동 생성 (`api/views.py`)
**[수정 전]**: 신규 데모 유저 로그인 시 활동 이력이 비어 있어 마이페이지가 썰렁함.
**[수정 후]**: `SeedDemoData` API를 구축하여 로그인 즉시 학습 퀴즈 6건과 직무 테스트 3건의 가짜 데이터를 자동 생성.

---

## 3. 데이터 표현 (Serializers & Analytics)

### 📈 내역 리스트 점수 연동 (`user/serializer.py`)
**[수정 전]**: DB에 점수가 없어 리스트 조회 시 항상 0점 혹은 계산된 값만 노출됨.
**[수정 후]**: `score` 필드 값을 우선적으로 반환하도록 시리얼라이저 수정.

```python
# [After]
def get_score(self, obj):
    if obj.score > 0: # DB에 저장된 점수가 있으면 우선 사용
        return obj.score
    return obj.responses.filter(is_correct=True).count()
```

### 🎯 동적 직무 추천 분석 (`accounts/views.py`)
**[수정 전]**: 추천 리포트가 항상 고정된 텍스트("탐색 중")만 반환함.
**[수정 후]**: 최신 `Attempt` 기록을 조회하여 사용자의 직무 유형(MLOps, AI 등)과 적합도 점수를 실시간 응답하도록 로직 변경.

---

## 4. 결론 및 기대 효과
*   **사용자 경험(UX)**: 데모 유저도 즉시 풍성한 개인화 대시보드를 확인할 수 있음.
*   **데이터 추적**: 사용자의 학습 및 테스트 성과를 수치화하여 DB에 기록함으로써 향후 정밀한 분석이 가능해짐.
*   **서버 안정성**: 인증 실패나 예외 상황에서도 서버가 죽지 않고 친절한 에러 메시지를 제공함.

---
**JobFit Organization - Development Team**
