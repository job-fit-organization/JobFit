# API - Auth

## 1. 소셜 로그인

```http
POST /api/auth/social-login
```

### 요청

```json
{
  "provider": "google",
  "accessToken": "SOCIAL_ACCESS_TOKEN"
}
```

### 응답

```json
{
  "userId": 1,
  "email": "user@example.com",
  "name": "User Name",
  "isNewUser": false,
  "accessToken": "SERVICE_ACCESS_TOKEN"
}
```

## 2. 사용자 정보 확인

```http
GET /api/users/me
```

## 3. 설계 메모

- 소셜 로그인 후 사용자 정보가 DB에 있는지 확인한다.
- 신규 사용자는 사용자 정보를 저장한다.
- 로그인 성공 후 직무/기술 선택 페이지로 이동한다.
