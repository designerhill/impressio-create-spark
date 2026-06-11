import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MIN_PAYOUT_CENTS = 1000;

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401,
    });

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { amount_cents, payout_method, notes } = await req.json();
    if (!Number.isInteger(amount_cents) || amount_cents < MIN_PAYOUT_CENTS) {
      throw new Error(`Minimum payout is $${MIN_PAYOUT_CENTS / 100}`);
    }
    if (!payout_method) throw new Error('payout_method required');

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: wallet } = await admin.from('wallets').select('*').eq('user_id', user.id).maybeSingle();
    if (!wallet || wallet.balance_cents < amount_cents) throw new Error('Insufficient balance');

    await admin.from('wallets').update({ balance_cents: wallet.balance_cents - amount_cents }).eq('user_id', user.id);

    const { data: pr, error: prErr } = await admin.from('payout_requests').insert({
      user_id: user.id, amount_cents, payout_method, notes, status: 'pending',
    }).select('id').single();
    if (prErr) throw prErr;

    await admin.from('wallet_transactions').insert({
      user_id: user.id, amount_cents: -amount_cents, type: 'payout_request',
      note: `Payout requested via ${payout_method}`,
    });

    return new Response(JSON.stringify({ ok: true, id: pr.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
    });
  }
});