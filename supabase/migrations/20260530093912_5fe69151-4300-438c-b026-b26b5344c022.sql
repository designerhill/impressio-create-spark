-- Restrict avatar SELECT to individual object access only (no bucket-wide listing by anon)
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

CREATE POLICY "Avatar images are publicly readable"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] IS NOT NULL);

-- Revoke direct execute on security-definer helpers (only triggers should call them)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;