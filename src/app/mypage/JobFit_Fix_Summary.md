# JobFit 개발 및 수정 상세 내역 (Before & After)

이 문서는 프로젝트의 각 기능별 수정 사항을 코드 비교(`Before` & `After`)와 함께 정리한 최종 기술 분석서입니다.

---

## 백엔드 (Backend) 수정 사항

### ⚙️ 데이터 모델 확장 (`backend/api/models.py`)
- **[수정 전]**: 테스트 결과를 저장할 공간이 없음.
- **[수정 후]**: `Attempt` 모델에 점수와 추천 직무 결과 필드 추가.

```python
# [After]
class Attempt(models.Model):
    score = models.PositiveIntegerField(default=0)
    recommended_job = models.ForeignKey('Job', on_delete=models.SET_NULL, null=True)
```

### 🛡️ 인증 및 예외 처리 (`authentication/`)
- **[수정 전]**: Bearer 토큰 미지원 및 에러 시 서버 Crash 발생.
- **[수정 후]**: `CustomJWTAuthentication` 추가 및 `exceptions.py` 방어 코드 적용.

```python
# [After - exceptions.py]
if response is not None:
    error_code = response.data.get('code')
```

### 📈 ORM 기반 리팩토링 및 동적 리포트 (`backend/accounts/views.py`)
- **[수정 전]**: 존재하지 않는 테이블을 Raw SQL로 조회하여 500 에러 고착.
- **[수정 후]**: **Django ORM**으로 완전 교체 및 최신 기록 기반 동적 추천 로직 구현.

```python
# [After]
user = User.objects.filter(username=user_id).first()
last_attempt = Attempt.objects.filter(user=user, attempt_type='job_test').order_by('-created_at').first()
# ... 이후 last_attempt 정보를 바탕으로 추천 직무 반환
```

---

## 3. 종합 결과
*   **안정성**: 백엔드 Crash 요인 제거 및 DB 동기화 완료.
*   **완성도**: 데모 유저를 위한 즉각적인 결과 대시보드 환경 완비.
*   **전문성**: 최신 폰트 및 직관적인 통과/미통과 UI를 통한 신뢰성 확보.

