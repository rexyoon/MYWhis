# MyWhis — 나만의 위스키 진열장 📒🥃

> 내가 산 위스키를 등록하고, 종류·세부분류별로 관리하고, "오늘 뭐 마실까?"를 랜덤으로 골라주는 앱

작성일: 2026-06-25

---

## 1. 한 줄 요약

내가 소장한 위스키(및 사케/버번 등)를 **용량·개봉 상태·경과일**과 함께 등록·관리하고,
종류(위스키/스카치/사케/버번/피트 등)와 세부분류(블렌디드/싱글몰트/셰리/피트 등)를
드롭다운으로 선택해 분류하며, **랜덤으로 오늘 마실 술을 추천**받는 개인용 모바일 앱.

---

## 2. 기술 스택 (결정됨)

| 영역 | 선택 | 이유 |
|------|------|------|
| 프론트엔드 | **React Native (Expo, TypeScript)** | iOS/Android 동시 개발, Windows에서 개발 가능, Expo Go로 폰에서 즉시 테스트 |
| 라우팅 | **Expo Router** (파일 기반) | 화면 구조가 폴더 구조와 1:1, 학습/유지보수 쉬움 |
| 백엔드 | **Java 21 + Spring Boot 3.3 (REST API)** | 직접 작성하는 백엔드. Spring Data JPA + Spring Security |
| DB | **PostgreSQL** (로컬 또는 Supabase 호스팅) | SQL 스키마 직접 관리 (`supabase/schema.sql`) |
| 인증 | **JWT (jjwt) + BCrypt** | 자체 `users` 테이블, 백엔드가 발급/검증 |
| 데이터 방향 | **온라인 우선** (서버 중심) | 여러 기기 동기화, 단순한 구조 |
| 상태/세션 | AsyncStorage + JWT 토큰 | 자동 로그인 유지 |

> 변경 이력: 초기에는 백엔드를 Supabase(BaaS)로 잡았으나, 사용자가 **직접 Java 백엔드**를
> 작성하기로 하여 Spring Boot REST API로 전환. Supabase는 (선택적으로) Postgres 호스팅 용도로만 사용.

---

## 3. 핵심 기능

### 3.1 계정
- 이메일/비밀번호 **회원가입 / 로그인 / 로그아웃**
- 로그인한 사용자만 자기 데이터 접근 (RLS)
- 프로필(닉네임) 관리

### 3.2 위스키(보틀) 등록·관리
등록 항목:
- 이름 (예: 라가불린 16년)
- **종류(category)** — 드롭다운: 위스키 / 스카치위스키 / 버번 / 피트위스키 / 사케 / 기타...
- **세부분류(subtype)** — 종류에 따라 바뀌는 드롭다운 (예: 위스키→블렌디드/싱글몰트/셰리/피트...)
- **총 용량(ml)** 예: 700
- **현재 남은 용량(ml)** 예: 520
- **등록일** (구매/등록한 날)
- **개봉일(뚜껑 연 날짜)** — 미개봉이면 비움
- 도수(ABV %) — 선택
- 메모, 사진(선택)

자동 계산(파생) 값:
- **경과일** = 오늘 − 등록일 (그리고 개봉 후 경과일 = 오늘 − 개봉일)
- **남은 비율(%)** = 남은 용량 / 총 용량
- 개봉 여부 = 개봉일 존재 여부

### 3.3 진열장(목록) 보기
- 내 보틀 카드 리스트 (이름, 종류/세부분류, 남은 비율 게이지, 경과일)
- 종류별 필터 / 검색
- 카드 탭 → 상세 화면 (수정/삭제, 남은 용량 업데이트)

### 3.4 ⭐ 랜덤 추천 (이 앱만의 기능)
- "오늘 뭐 마실까?" 버튼 → 내 보틀 중 하나를 랜덤 선택해 보여줌
- 필터 옵션: 종류, "개봉한 것만", "남은 양 있는 것만"
- 룰렛/뽑기 느낌의 연출 + 결과 카드

---

## 4. 데이터 모델 (Supabase / Postgres)

```
profiles            (auth.users 1:1)
  id (uuid, = auth.uid)
  nickname
  created_at

categories          (술 종류 — 시드 데이터)
  id (text, slug)    예: 'whisky', 'scotch', 'bourbon', 'peated', 'sake', 'other'
  label_ko           예: '위스키', '스카치위스키'
  sort_order

subtypes            (세부분류 — categories에 종속, 시드 데이터)
  id (uuid)
  category_id (fk → categories.id)
  label_ko           예: '블렌디드', '싱글몰트', '셰리', '피트'
  sort_order

bottles             (사용자 보틀 — 핵심 테이블)
  id (uuid)
  user_id (fk → auth.users)        ← RLS 기준
  name
  category_id (fk → categories.id)
  subtype_id  (fk → subtypes.id, nullable)
  total_volume_ml (int)
  remaining_volume_ml (int)
  abv (numeric, nullable)
  registered_date (date)
  opened_date (date, nullable)
  image_url (text, nullable)
  notes (text, nullable)
  created_at, updated_at
```

- 경과일·남은비율은 **DB에 저장하지 않고** 앱에서 계산 (날짜 기준이라 매일 변함).
- categories/subtypes는 시드로 채워두고, 사용자는 드롭다운에서 선택만.
- RLS: `bottles`는 `user_id = auth.uid()` 인 행만 select/insert/update/delete.

세부분류 시드 예시:
| 종류 | 세부분류 |
|------|----------|
| 위스키 | 블렌디드, 싱글몰트, 그레인, 셰리캐스크, 버번캐스크, 피트 |
| 스카치위스키 | 하이랜드, 스페이사이드, 아일라, 로우랜드, 캠벨타운, 아일랜드 |
| 버번 | 스트레이트 버번, 스몰배치, 싱글배럴, 와일드 |
| 피트위스키 | 라이트 피트, 헤비 피트, 아일라 피트 |
| 사케 | 준마이, 긴조, 다이긴조, 혼조조 |
| 기타 | 럼, 진, 데킬라, 코냑, 브랜디 |

---

## 5. 화면 구성 (Expo Router)

```
app/
  _layout.tsx              루트 + 인증 게이트
  (auth)/
    login.tsx              로그인
    signup.tsx             회원가입
  (tabs)/
    _layout.tsx            하단 탭
    index.tsx              🏠 진열장(목록)
    random.tsx             🎲 랜덤 추천
    profile.tsx            👤 프로필
  bottle/
    new.tsx                ➕ 보틀 등록
    [id].tsx               📄 보틀 상세/수정
```

---

## 6. 폴더 구조 (전체)

```
MyWhis/
├── docs/
│   └── PLAN.md                  ← 이 문서
├── README.md                    실행 방법
├── supabase/
│   ├── schema.sql               테이블 + RLS + 트리거
│   └── seed.sql                 종류/세부분류 시드
└── mobile/                      Expo 앱
    ├── app/                     화면 (Expo Router)
    ├── src/
    │   ├── lib/supabase.ts      Supabase 클라이언트
    │   ├── context/AuthContext.tsx
    │   ├── types/db.ts          DB 타입
    │   ├── api/bottles.ts       데이터 접근
    │   └── utils/date.ts        경과일/비율 계산
    ├── app.json
    ├── package.json
    └── .env.example
```

---

## 7. 개발 단계 (로드맵)

1. **Phase 0 — 스캐폴딩 (이번 작업)**
   - 폴더/계획서/스키마/Expo 앱 뼈대 생성
2. **Phase 1 — 백엔드 셋업**
   - Supabase 프로젝트 생성 → `schema.sql`, `seed.sql` 실행 → `.env` 채우기
3. **Phase 2 — 인증**
   - 회원가입/로그인/세션 유지/로그아웃
4. **Phase 3 — 보틀 CRUD**
   - 등록(종류·세부분류 종속 드롭다운) → 목록 → 상세/수정/남은용량 업데이트 → 삭제
5. **Phase 4 — 랜덤 추천**
   - 필터 + 뽑기 연출 + 결과
6. **Phase 5 — 다듬기**
   - 사진 업로드(Supabase Storage), 통계(총 보틀/총 용량), 정렬/검색, 다크 테마

---

## 8. 실행 방법 (요약)

```bash
# 1) Supabase 프로젝트 만들고 schema.sql, seed.sql 실행
# 2) mobile 폴더에서
cd mobile
npm install
cp .env.example .env      # SUPABASE_URL, SUPABASE_ANON_KEY 채우기
npx expo start            # Expo Go 앱으로 QR 스캔하여 폰에서 실행
```

자세한 건 [README.md](../README.md) 참고.
