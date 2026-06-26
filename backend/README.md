# MyWhis Backend (Spring Boot)

위스키 진열장 REST API. **Java 21 + Spring Boot 3.3 + Spring Data JPA + Spring Security(JWT) + PostgreSQL**.

> JDK 21(LTS)이 필요합니다. 설치: [Adoptium Temurin 21](https://adoptium.net/temurin/releases/?version=21)
> 또는 `winget install EclipseAdoptium.Temurin.21.JDK`

## 폴더 구조

```
backend/
├── pom.xml
├── mvnw / mvnw.cmd            Maven Wrapper (Maven 설치 불필요)
├── .env.example
└── src/main/
    ├── resources/application.yml
    └── java/com/mywhis/
        ├── MywhisApplication.java     앱 진입점
        ├── config/SecurityConfig.java JWT/CORS/보안 설정
        ├── security/                  JWT 발급·검증 필터
        │   ├── JwtTokenProvider.java
        │   ├── JwtAuthenticationFilter.java
        │   └── CurrentUser.java
        ├── user/                      계정 (가입/로그인)
        │   ├── User.java, UserRepository.java
        │   ├── AuthService.java, AuthController.java
        │   └── dto/AuthDtos.java
        ├── catalog/                   술 종류/세부분류 (드롭다운)
        │   ├── Category.java, Subtype.java
        │   ├── CategoryRepository.java, SubtypeRepository.java
        │   └── CatalogController.java
        ├── bottle/                    보틀 CRUD (핵심)
        │   ├── Bottle.java, BottleRepository.java
        │   ├── BottleService.java, BottleController.java
        │   └── dto/BottleDtos.java
        └── common/                    예외 처리 / 헬스체크
            ├── NotFoundException.java
            ├── GlobalExceptionHandler.java
            └── HealthController.java
```

## 실행 방법

### 1) DB 준비
PostgreSQL DB를 만들고 (`mywhis`), 프로젝트 루트의
[`supabase/schema.sql`](../supabase/schema.sql) → [`supabase/seed.sql`](../supabase/seed.sql) 순서로 실행.
> Supabase의 Postgres를 써도 되고, 로컬 Postgres여도 됩니다.

### 2) 환경변수
```bash
cp .env.example .env   # 값 채우기 (DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET)
```
실행 시 환경변수로 주입하거나 `application.yml` 기본값을 수정하세요.

### 3) 빌드 & 실행 (Maven Wrapper)
```bash
# Windows (PowerShell/CMD)
mvnw.cmd spring-boot:run

# macOS/Linux/Git Bash
./mvnw spring-boot:run
```
> IntelliJ IDEA나 VS Code(Java 확장)로 `backend/` 폴더를 열면 자동으로 의존성을 받아 실행할 수도 있습니다.

서버는 `http://localhost:8080` 에서 뜹니다. 헬스체크: `GET /api/health`

## API 요약

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| POST | `/api/auth/signup` | ✗ | 회원가입 → `{token, email, nickname}` |
| POST | `/api/auth/login` | ✗ | 로그인 → `{token, email, nickname}` |
| GET | `/api/categories` | ✓ | 술 종류 목록 |
| GET | `/api/subtypes?categoryId=whisky` | ✓ | 세부분류 (종류별 필터 가능) |
| GET | `/api/bottles` | ✓ | 내 보틀 목록 |
| GET | `/api/bottles/{id}` | ✓ | 보틀 상세 |
| POST | `/api/bottles` | ✓ | 보틀 등록 |
| PUT | `/api/bottles/{id}` | ✓ | 보틀 수정 |
| PATCH | `/api/bottles/{id}/remaining` | ✓ | 남은 용량만 수정 |
| DELETE | `/api/bottles/{id}` | ✓ | 보틀 삭제 |

인증 필요한 요청은 헤더에 `Authorization: Bearer <token>` 추가.

### 예시 (curl)
```bash
# 회원가입
curl -X POST localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"a@b.com","password":"secret1","nickname":"위스키러버"}'

# 보틀 등록 (TOKEN 은 위 응답의 token)
curl -X POST localhost:8080/api/bottles \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"라가불린 16년","categoryId":"scotch","totalVolumeMl":700,"remainingVolumeMl":520,"abv":43,"registeredDate":"2026-06-25"}'
```

## 보틀 응답 필드
서버가 경과일·남은비율 등 파생값까지 계산해서 내려줍니다:
`remainingPercent`, `opened`, `elapsedDaysSinceRegistered`, `elapsedDaysSinceOpened`, `categoryLabel`, `subtypeLabel`.
