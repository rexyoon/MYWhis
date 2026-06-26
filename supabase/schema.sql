-- ============================================================
-- MyWhis — PostgreSQL 스키마 (Spring Boot 백엔드용)
-- 인증/권한은 Java 백엔드가 담당하므로 RLS 없음.
-- 실행 순서: 1) schema.sql  2) seed.sql
-- ============================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ── 1) users : 계정 ────────────────────────────────────────
create table if not exists users (
  id             uuid primary key default gen_random_uuid(),
  email          text unique not null,
  password_hash  text not null,            -- BCrypt 해시 (백엔드에서 처리)
  nickname       text not null,
  created_at     timestamptz not null default now()
);

-- ── 2) categories : 술 종류 (시드 데이터) ─────────────────────
create table if not exists categories (
  id          text primary key,            -- slug 예: 'whisky'
  label_ko    text not null,               -- '위스키'
  sort_order  int  not null default 0
);

-- ── 3) subtypes : 세부분류 (categories 종속, 시드 데이터) ─────
create table if not exists subtypes (
  id           uuid primary key default gen_random_uuid(),
  category_id  text not null references categories(id) on delete cascade,
  label_ko     text not null,
  sort_order   int  not null default 0
);
create index if not exists idx_subtypes_category on subtypes(category_id);

-- ── 4) bottles : 사용자 보틀 (핵심) ─────────────────────────
create table if not exists bottles (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references users(id) on delete cascade,
  name                 text not null,
  category_id          text references categories(id),
  subtype_id           uuid references subtypes(id),
  total_volume_ml      int  not null check (total_volume_ml > 0),
  remaining_volume_ml  int  not null check (remaining_volume_ml >= 0),
  abv                  numeric(4,1),                  -- 도수 %, 선택
  registered_date      date not null default current_date,
  opened_date          date,                           -- null = 미개봉
  image_url            text,
  notes                text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint remaining_lte_total check (remaining_volume_ml <= total_volume_ml)
);
create index if not exists idx_bottles_user on bottles(user_id);
