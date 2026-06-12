
CREATE OR REPLACE FUNCTION public.validate_payout_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance integer;
BEGIN
  IF NEW.amount_cents IS NULL OR NEW.amount_cents <= 0 THEN
    RAISE EXCEPTION 'Payout amount must be positive';
  END IF;

  SELECT balance_cents INTO current_balance
  FROM public.wallets
  WHERE user_id = NEW.user_id;

  IF current_balance IS NULL OR current_balance < NEW.amount_cents THEN
    RAISE EXCEPTION 'Insufficient wallet balance for payout request';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_payout_request_trigger ON public.payout_requests;
CREATE TRIGGER validate_payout_request_trigger
BEFORE INSERT ON public.payout_requests
FOR EACH ROW
EXECUTE FUNCTION public.validate_payout_request();
