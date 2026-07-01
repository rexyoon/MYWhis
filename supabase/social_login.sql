-- ============================================================
-- MyWhis — 소셜 로그인(카카오·네이버) 지원을 위한 users 테이블 확장
-- 기존 schema.sql 실행 후, 이 ALTER 문들을 SQL Editor에서 실행하세요.
-- (이미 적용돼 있어도 안전하게 재실행 가능)
-- ============================================================

-- 소셜 유저는 비밀번호/이메일이 없을 수 있으므로 NOT NULL 해제
alter table users alter column password_hash drop not null;
alter table users alter column email         drop not null;

-- 로그인 제공자 구분: 'local' | 'kakao' | 'naver'
alter table users add column if not exists provider    text not null default 'local';
alter table users add column if not exists provider_id text;

-- (provider, provider_id) 조합은 유일 (provider_id 가 있는 경우에만)
create unique index if not exists uq_users_provider
  on users(provider, provider_id) where provider_id is not null;
