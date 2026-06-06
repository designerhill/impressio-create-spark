
-- 1) Lock down subscriptions writes (no INSERT/UPDATE/DELETE policies => denied for authenticated/anon; service_role bypasses RLS)
REVOKE INSERT, UPDATE, DELETE ON public.subscriptions FROM anon, authenticated;
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;

-- Explicit restrictive policies to make intent clear and prevent accidental future grants
DROP POLICY IF EXISTS "No client inserts on subscriptions" ON public.subscriptions;
CREATE POLICY "No client inserts on subscriptions"
  ON public.subscriptions AS RESTRICTIVE FOR INSERT
  TO authenticated, anon
  WITH CHECK (false);

DROP POLICY IF EXISTS "No client updates on subscriptions" ON public.subscriptions;
CREATE POLICY "No client updates on subscriptions"
  ON public.subscriptions AS RESTRICTIVE FOR UPDATE
  TO authenticated, anon
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "No client deletes on subscriptions" ON public.subscriptions;
CREATE POLICY "No client deletes on subscriptions"
  ON public.subscriptions AS RESTRICTIVE FOR DELETE
  TO authenticated, anon
  USING (false);

-- 2) Restrict avatar uploads to strict path: {auth.uid}/avatar(.ext)
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (auth.uid())::text = (storage.foldername(name))[1]
    AND name ~ ('^' || (auth.uid())::text || '/avatar(\.[A-Za-z0-9]+)?$')
  );

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (auth.uid())::text = (storage.foldername(name))[1]
    AND name ~ ('^' || (auth.uid())::text || '/avatar(\.[A-Za-z0-9]+)?$')
  );
