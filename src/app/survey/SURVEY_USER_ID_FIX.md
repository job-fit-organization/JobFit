# 설문조사 로그인 유저 정보 저장 구현 가이드

설문조사(Survey) 제출 시 로그인한 사용자의 정보를 저장하기 위해 적용된 기술적 변경 사항을 정리한 문서입니다.

## 1. 백엔드 구현 (Django REST Framework)

### 1) 모델 정의 (`backend/api/models.py`)
`Survey` 모델에 `user` 필드를 `ForeignKey`로 설정하여 Django의 `User` 모델과 연결했습니다. `null=True`, `blank=True` 설정을 통해 비로그인 사용자의 설문도 허용하되, 로그인 사용자는 추적 가능하게 했습니다.

```python
class Survey(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, blank=True,
        related_name='surveys'
    )
    # ... 기타 필드 (rating, features, feedback)
```

### 2) 뷰 로직 (`backend/api/views.py`)
`SurveyView`에서 `request.user`를 확인하여 인증된 사용자(`is_authenticated`)인 경우 시리얼라이저 저장 시 해당 유저 객체를 주입합니다.

```python
class SurveyView(APIView):
    def post(self, request):
        serializer = SurveySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # request.user가 인증된 상태면 유저 정보를 포함하여 저장
        user = request.user if request.user.is_authenticated else None
        serializer.save(user=user)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
```

---

## 2. 프론트엔드 구현 (Next.js & Axios)

### 1) 중앙 집중식 API 클라이언트 (`src/app/learning/data/apiClient.ts`)
모든 API 요청에 자동으로 `Authorization` 헤더를 포함시키기 위해 Axios 인터셉터(Interceptor)를 구현했습니다.

```typescript
const apiClient = axios.create({ baseURL: 'http://localhost:8000/api' });

apiClient.interceptors.request.use((config) => {
    // localStorage에서 저장된 JWT 토큰을 가져옴
    const token = localStorage.getItem('access_token');
    if (token) {
        // 모든 요청 헤더에 Bearer 토큰 추가
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

### 2) 설문조사 제출 페이지 (`src/app/survey/page.tsx`)
기존의 `fetch` 라이브러리 대신 위에서 정의한 `apiClient`를 사용하여 요청을 보냅니다. 이를 통해 별도의 헤더 설정 없이도 자동으로 유저 인증 정보가 서버로 전달됩니다.

```typescript
import { postSurvey } from '@/app/learning/data/apiClient';

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        // apiClient를 통해 전송 (자동으로 Authorization 헤더 포함)
        await postSurvey({ rating, features: selectedFeatures, feedback });
    } catch (error) {
        console.error('제출 실패:', error);
    }
};
```

---

## 3. 요약 흐름
1. **로그인**: 사용자가 로그인하면 서버로부터 JWT 토큰(`access_token`)을 받아 `localStorage`에 저장합니다.
2. **요청 인터셉트**: 설문 제출 시 Axios 인터셉터가 토큰을 가로채서 API 요청 헤더에 삽입합니다.
3. **토큰 검증**: 백엔드(`CustomJWTAuthentication`)가 헤더의 토큰을 해석하여 `request.user`에 유저 정보를 채웁니다.
4. **DB 저장**: `SurveyView`가 `request.user` 정보를 모델의 `user_id` 컬럼에 저장합니다.
