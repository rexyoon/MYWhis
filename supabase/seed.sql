-- ============================================================
-- MyWhis — 시드 데이터 (술 종류 + 세부분류)
-- schema.sql 실행 후에 실행하세요.
-- ============================================================

-- ── 종류(categories) ──────────────────────────────────────
insert into categories (id, label_ko, sort_order) values
  ('whisky',  '위스키',       10),
  ('scotch',  '스카치위스키', 20),
  ('bourbon', '버번',         30),
  ('peated',  '피트위스키',   40),
  ('sake',    '사케',         50),
  ('other',   '기타',         60)
on conflict (id) do update set label_ko = excluded.label_ko, sort_order = excluded.sort_order;

-- ── 세부분류(subtypes) ────────────────────────────────────
delete from subtypes where category_id in
  ('whisky','scotch','bourbon','peated','sake','other');

insert into subtypes (category_id, label_ko, sort_order) values
  -- 위스키
  ('whisky', '블렌디드',     10),
  ('whisky', '싱글몰트',     20),
  ('whisky', '그레인',       30),
  ('whisky', '셰리캐스크',   40),
  ('whisky', '버번캐스크',   50),
  ('whisky', '피트',         60),
  -- 스카치위스키 (지역)
  ('scotch', '하이랜드',     10),
  ('scotch', '스페이사이드', 20),
  ('scotch', '아일라',       30),
  ('scotch', '로우랜드',     40),
  ('scotch', '캠벨타운',     50),
  ('scotch', '아일랜드',     60),
  -- 버번
  ('bourbon', '스트레이트 버번', 10),
  ('bourbon', '스몰배치',        20),
  ('bourbon', '싱글배럴',        30),
  ('bourbon', '휘티드 버번',     40),
  -- 피트위스키
  ('peated', '라이트 피트', 10),
  ('peated', '미디엄 피트', 20),
  ('peated', '헤비 피트',   30),
  ('peated', '아일라 피트', 40),
  -- 사케
  ('sake', '준마이',     10),
  ('sake', '긴조',       20),
  ('sake', '다이긴조',   30),
  ('sake', '혼조조',     40),
  -- 기타
  ('other', '럼',       10),
  ('other', '진',       20),
  ('other', '데킬라',   30),
  ('other', '코냑',     40),
  ('other', '브랜디',   50);
