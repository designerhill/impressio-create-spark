
-- Block all client writes on wallets
CREATE POLICY "Block client writes on wallets"
ON public.wallets AS RESTRICTIVE
FOR ALL TO anon, authenticated
USING (false) WITH CHECK (false);

-- Block all client writes on wallet_transactions
CREATE POLICY "Block client writes on wallet_transactions"
ON public.wallet_transactions AS RESTRICTIVE
FOR ALL TO anon, authenticated
USING (false) WITH CHECK (false);

-- Block all client writes on purchases
CREATE POLICY "Block client writes on purchases"
ON public.purchases AS RESTRICTIVE
FOR INSERT TO anon, authenticated WITH CHECK (false);

CREATE POLICY "Block client updates on purchases"
ON public.purchases AS RESTRICTIVE
FOR UPDATE TO anon, authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Block client deletes on purchases"
ON public.purchases AS RESTRICTIVE
FOR DELETE TO anon, authenticated
USING (false);

-- Block client updates/deletes on payout_requests (keep INSERT allowed via existing permissive policy)
CREATE POLICY "Block client updates on payout_requests"
ON public.payout_requests AS RESTRICTIVE
FOR UPDATE TO anon, authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Block client deletes on payout_requests"
ON public.payout_requests AS RESTRICTIVE
FOR DELETE TO anon, authenticated
USING (false);
