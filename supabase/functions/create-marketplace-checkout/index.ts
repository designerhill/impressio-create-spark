import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401,
      });
    }

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user?.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401,
      });
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { listingId } = await req.json();
    if (!listingId) throw new Error('listingId required');

    const { data: listing, error: lerr } = await admin
      .from('marketplace_listings')
      .select('*, designs!inner(design_data)')
      .eq('id', listingId)
      .maybeSingle();
    if (lerr || !listing) throw new Error('Listing not found');
    if (!listing.is_published) throw new Error('Listing not available');
    if (listing.seller_id === user.id) throw new Error('Cannot buy your own listing');

    // Free listing → clone immediately
    if (listing.price_cents === 0) {
      const { data: newDesign, error: derr } = await admin.from('designs').insert({
        user_id: user.id,
        title: listing.title,
        type: listing.type,
        design_data: (listing as any).designs.design_data,
        thumbnail_url: listing.preview_url,
      }).select('id').single();
      if (derr) throw derr;

      await admin.from('purchases').insert({
        buyer_id: user.id,
        seller_id: listing.seller_id,
        listing_id: listing.id,
        cloned_design_id: newDesign.id,
        price_cents: 0,
        seller_earning_cents: 0,
        status: 'completed',
      });
      await admin.from('marketplace_listings')
        .update({ sales_count: (listing.sales_count || 0) + 1 })
        .eq('id', listing.id);

      const origin = req.headers.get('origin') || '';
      return new Response(JSON.stringify({ free: true, url: `${origin}/my-designs?purchased=1` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200,
      });
    }

    const stripeSecretKey = Deno.env.get('strip_secret_key');
    if (!stripeSecretKey) throw new Error('Stripe not configured');
    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });

    const origin = req.headers.get('origin') || 'http://localhost:8080';
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: user.email,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: listing.title, description: listing.description ?? undefined },
          unit_amount: listing.price_cents,
        },
        quantity: 1,
      }],
      success_url: `${origin}/my-designs?purchased=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/marketplace/${listing.id}?canceled=1`,
      metadata: {
        marketplace_listing_id: listing.id,
        buyer_id: user.id,
        seller_id: listing.seller_id,
      },
    });

    await admin.from('purchases').insert({
      buyer_id: user.id,
      seller_id: listing.seller_id,
      listing_id: listing.id,
      price_cents: listing.price_cents,
      seller_earning_cents: Math.floor(listing.price_cents * 0.8),
      stripe_session_id: session.id,
      status: 'pending',
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
    });
  }
});