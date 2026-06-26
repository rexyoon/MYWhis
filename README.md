# 🥃 MyWhis — 나만의 위스키 진열장

내가 산 위스키를 용량·개봉 상태·경과일과 함께 등록하고, 종류/세부분류로 분류하며,
**"오늘 뭐 마실까?"를 랜덤으로 골라주는** iOS/Android 앱.

- 📋 자세한 기획은 [docs/PLAN.md](docs/PLAN.md) 참고
- 프론트엔드: **React Native (Expo, TypeScript)** — `mobile/`
- 백엔드: **Java Spring Boot (REST API + JWT)** — `backend/`
- DB: **PostgreSQL** (로컬 또는 Supabase 호스팅) — SQL은 `supabase/`

---

## 폴더 구조

```
MyWhis/
├── docs/PLAN.md          기획서
├── supabase/             DB 스크립트 (PostgreSQL)
│   ├── schema.sql        테이블 (users/categories/subtypes/bottles)
│   └── seed.sql          술 종류/세부분류 시드
├── backend/              Java Spring Boot REST API
│   ├── pom.xml
│   └── src/main/java/com/mywhis/   (user · catalog · bottle · security · config)
└── mobile/               Expo 앱 (iOS/Android)
    ├── app/              화면 (Expo Router)
    └── src/              로직 (api, context, components, utils)
```

> ⚠️ 참고: `mobile/` 프론트엔드는 현재 Supabase 클라이언트로 작성돼 있습니다.
> Java 백엔드로 전환하려면 `mobile/src/api/*` 와 `AuthContext` 를 이 REST API
> (`http://<서버>:8080/api/...`) 호출로 바꿔야 합니다. (원하면 이어서 작업 가능)

---

## 설치 & 실행

### 1) DB 준비 (PostgreSQL)
로컬 Postgres를 쓰거나, Supabase에서 프로젝트를 만들어 그 Postgres를 사용합니다.
DB를 만든 뒤 SQL Editor(또는 psql)에서 순서대로 실행:
1. [`supabase/schema.sql`](supabase/schema.sql)
2. [`supabase/seed.sql`](supabase/seed.sql)

### 2) 백엔드 실행 (Java Spring Boot)
```bash
cd backend
cp .env.example .env     # DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET 채우기
./mvnw spring-boot:run   # Windows: mvnw.cmd spring-boot:run
```
→ `http://localhost:8080` 에서 API 기동. 자세한 엔드포인트는 [backend/README.md](backend/README.md).

### 3) 모바일 앱 실행 (Expo)
```bash
cd mobile
npm install
npx expo start
```
- 휴대폰에 **Expo Go** 앱 설치 후 터미널의 QR 코드 스캔 → 폰에서 바로 실행
- 안드로이드 에뮬레이터: `a` / iOS 시뮬레이터(맥): `i`

> 프론트를 Java 백엔드에 연결하는 작업은 위 폴더 구조 안내의 참고 사항을 보세요.

---

## 주요 화면

| 탭 | 설명 |
|----|------|
| 🥃 진열장 | 보틀 목록(남은 비율 게이지·경과일), 종류 필터, + 등록 |
| 🎲 랜덤 추천 | 종류/개봉여부/남은양 필터 후 룰렛으로 한 잔 뽑기 |
| 👤 프로필 | 닉네임, 로그아웃 |

보틀 카드를 누르면 상세 화면에서 **남은 용량 조정(− 한 잔)**, 수정, 삭제가 가능합니다.

---

## 데이터 모델 요약

- `categories` — 술 종류 (위스키/스카치/버번/피트/사케/기타)
- `subtypes` — 종류에 종속된 세부분류 (드롭다운이 종류 선택에 따라 바뀜)
- `bottles` — 사용자 보틀 (용량, 등록일/개봉일, 도수, 메모 등). RLS로 본인 데이터만 접근
- 경과일·남은 비율은 저장하지 않고 앱에서 날짜 기준으로 계산

---

## 다음 단계 (확장 아이디어)
- 사진 업로드 (Supabase Storage)
- 시음 기록/평점 히스토리
- 통계 대시보드 (종류별 분포, 소비 추이)
- 다크/라이트 테마 전환

자세한 로드맵은 [docs/PLAN.md](docs/PLAN.md) 7번 항목 참고.
