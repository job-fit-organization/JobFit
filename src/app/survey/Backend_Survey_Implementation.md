# 설문조사(Survey) 백엔드 보강 내역 (Before & After)

이 문서는 설문조사 데이터(별점, 선호 기능, 피드백)를 백엔드 DB에 저장할 수 있도록 보강한 내역을 정리한 것입니다.

---

## 1. 데이터 모델 (Models)

### 📊 Survey 모델 추가 (`backend/api/models.py`)
- **[수정 전]**: 설문 데이터를 저장할 모델이 존재하지 않음.
- **[수정 후]**: `Survey` 모델을 추가하여 유저 정보, 별점, 선택 기능(JSON), 피드백 내용을 저장하도록 구현.

```python
# [After] 신규 추가
class Survey(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    rating = models.PositiveSmallIntegerField()
    features = models.JSONField()
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

---

## 2. API 및 비즈니스 로직 (Views & Serializers)

### 📤 Survey 시리얼라이저/뷰 구현 (`backend/api/serializer.py`, `backend/api/views.py`)
- **[수정 전]**: 관련 로직 부재.
- **[수정 후]**: 유효성 검사를 위한 `SurveySerializer`와 POST 요청을 처리하는 `SurveyView` 구현. 로그인 유저일 경우 자동으로 작성자로 연결됨.

```python
# [After - views.py]
class SurveyView(APIView):
    def post(self, request):
        serializer = SurveySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user if request.user.is_authenticated else None
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
```

---

## 3. 설정 및 환경 (Environment)

### 🔗 DB 주소 및 설정 정규화 (`backend/.env`, `backend/config/settings.py`)
- **[수정 전]**: `HOST`가 `127.0.0.1`로 하드코딩되어 Docker 내부 통신 오류 발생.
- **[수정 후]**: 환경 변수를 사용하도록 수정하고 기본값을 `db`로 설정하여 안정적인 DB 연결 확보.

### ⚠️ 에러 핸들러 수정 (`backend/authentication/exceptions.py`)
- **[이슈]**: `response`가 `None`일 때 `status_code`에 접근하여 500 에러 유발.
- **[수정]**: `response` 유무를 먼저 체크하도록 로직을 보강하여 API 안정성 확보.

---

## 4. 수동 테이블 생성 (Manual SQL)

마이그레이션이 정상적으로 적용되지 않는 환경을 위해 수동 생성 SQL 쿼리를 제공합니다.

```sql
CREATE TABLE `api_survey` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `rating` SMALLINT UNSIGNED NOT NULL,
    `features` JSON NOT NULL,
    `feedback` LONGTEXT NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `user_id` BIGINT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 5. 파일 리스트 (Changed Files)
- **[NEW]** `src/app/survey/Backend_Survey_Implementation.md`
- **[MODIFY]** `backend/api/models.py`
- **[MODIFY]** `backend/api/serializer.py`
- **[MODIFY]** `backend/api/views.py`
- **[MODIFY]** `backend/api/urls.py`
- **[MODIFY]** `backend/config/settings.py`
- **[MODIFY]** `backend/authentication/exceptions.py`
- **[MODIFY]** `backend/.env`

---
**JobFit Organization - Backend Team**
