# JobFit 개발 및 수정 상세 내역 (Login & MyPage)

이 문서는 프로젝트의 주요 수정 사항과 실제 구현된 코드 파편(Code Snippets)을 포함하고 있습니다.

---

## 1. 로그인 (Login) 핵심 수정 사항

### ⚡ 데모 로그인 로직 (`src/app/login/page.tsx`)
기존의 소셜 로그인 외에, 개발 및 테스트를 위한 순차적 계정 생성 로직을 추가했습니다.

```tsx
const handleTestLogin = async () => {
    setIsLoading(true);
    try {
        // 1~999까지 순차적으로 가입 시도 (빈 계정 찾기)
        for (let i = 1; i <= 999; i++) {
            const email = `demo${i}@jobfit.com`;
            const name = `데모 유저 ${i}`;
            
            const regRes = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password: 'password123' })
            });

            if (regRes.status === 201 || regRes.status === 400) {
                // 가입 성공 또는 이미 존재하는 계정인 경우 로그인 시도
                const loginRes = await fetch('http://localhost:8000/api/login/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password: 'password123' })
                });
                // ... 토큰 저장 및 리다이렉션 로직
            }
        }
    } catch (error) { /* 에러 처리 */ }
};
```

---

## 2. 마이페이지 (MyPage) 핵심 수정 사항

### 🔗 데이터 바인딩 및 UI 최적화 (`LoggedInView.tsx`, `StatsSection.tsx`)
비정상적이던 데이터 로딩 상태와 불필요한 섹션을 정리했습니다.

```tsx
// LoggedInView.tsx 수정 후 (데이터 바인딩 활성화)
const userData = await userRes.json();
fetchedProfile = {
    ...fetchedProfile,
    name: userData.name || currentUser?.nickname || fetchedProfile.name,
    email: userData.email || currentUser?.email || fetchedProfile.email,
    // ... 기타 스탯 바인딩
};
```

### 🛠️ 백엔드 ORM 전환 (`backend/accounts/views.py`)
불안정한 Raw SQL을 제거하고 안정적인 Django ORM으로 교체했습니다.

```python
class UserProfileView(APIView):
    def get(self, request, user_id):
        user = User.objects.filter(username=user_id).first()
        # ... 유저 조회 및 데이터 가공
        progress = {
            "python_cnt": Attempt.objects.filter(user=user, learning__skill__code__icontains='python').count(),
            "mlops_cnt": Attempt.objects.filter(user=user, learning__skill__code__icontains='mlops').count(),
            # ... 분야별 카운트 계산
        }
        return Response({ "name": user.name, "email": user.email, "progress": progress })
```

---

## 3. 백엔드 시스템 기반 수정 사항

### 🛡️ 커스텀 JWT 인증 처리 (`authentication/authenticators.py`)
프론트엔드 Bearer 토큰을 백엔드 `request.user`와 연동시켰습니다.

```python
class CustomJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or 'Bearer' not in auth_header:
            return None
        
        token = auth_header.split()[1]
        user_id = decode_access_token(token) # 토큰에서 유저 ID 추출
        user = User.objects.get(id=user_id)
        return (user, None)
```

### 🛣️ 엔드포인트 및 시리얼라이저 보완
- **api/urls.py**: 마이페이지 호출 경로 (`users/<str:user_id>/`, `users/stats/`) 추가
- **user/serializer.py**: `username` 자동 생성 로직 및 히스토리 조회 시 오류(`AttributeError`) 방지 로직 추가

---

**결과**: 위 코드 변경을 통해 전반적인 데이터 흐름이 고정된 Mock 데이터 방식에서 **실제 데이터베이스 연동 방식**으로 성공적으로 전환되었습니다.
