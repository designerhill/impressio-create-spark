-- 1) Drop redundant service_role policy on subscriptions (service_role bypasses RLS anyway)
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;

-- 2) Lock down internal trigger function from API callers
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO service_role;