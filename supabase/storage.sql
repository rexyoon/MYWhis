-- ============================================================
-- MyWhis — Supabase Storage 정책 (보틀 이미지)
-- 사전 작업: 대시보드 Storage 에서 'bottle-images' 버킷을 먼저 만드세요.
--   (New bucket → name: bottle-images → Public bucket 체크)
-- 그 후 이 SQL 을 SQL Editor 에서 실행하세요.
-- ============================================================

-- 공개 읽기 (이미지 URL 로 누구나 조회)
drop policy if exists "bottle_images_public_read" on storage.objects;
create policy "bottle_images_public_read"
  on storage.objects for select
  using ( bucket_id = 'bottle-images' );

-- 업로드 허용 (anon 키로 업로드 — 학습용)
-- ⚠️ 운영에서는 더 조이거나, 백엔드가 service_role 로 signed upload URL 발급하는 방식 권장
drop policy if exists "bottle_images_anon_insert" on storage.objects;
create policy "bottle_images_anon_insert"
  on storage.objects for insert
  with check ( bucket_id = 'bottle-images' );

-- (선택) 잘못 올린 파일 정리용 삭제 허용
drop policy if exists "bottle_images_anon_delete" on storage.objects;
create policy "bottle_images_anon_delete"
  on storage.objects for delete
  using ( bucket_id = 'bottle-images' );
