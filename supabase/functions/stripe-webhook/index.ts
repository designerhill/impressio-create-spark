import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const stripe = new Stripe(Deno.env.get('strip_secret_key') || '', {
  apiVersion: '2023-10-16',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    let event: Stripe.Event;
    
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const planType = session.metadata?.plan_type;
        const marketplaceListingId = session.metadata?.marketplace_listing_id;

        // Marketplace purchase
        if (marketplaceListingId && session.metadata?.buyer_id) {
          const buyerId = session.metadata.buyer_id;
          const sellerId = session.metadata.seller_id!;

          const { data: listing } = await supabase
            .from('marketplace_listings')
            .select('*, designs!inner(design_data)')
            .eq('id', marketplaceListingId)
            .maybeSingle();

          if (listing) {
            // Clone design to buyer
            const { data: cloned } = await supabase.from('designs').insert({
              user_id: buyerId,
              title: listing.title,
              type: listing.type,
              design_data: (listing as any).designs.design_data,
              thumbnail_url: listing.preview_url,
            }).select('id').single();

            const earning = Math.floor((listing.price_cents || 0) * 0.8);

            await supabase.from('purchases')
              .update({ status: 'completed', cloned_design_id: cloned?.id, seller_earning_cents: earning })
              .eq('stripe_session_id', session.id);

            await supabase.from('marketplace_listings')
              .update({ sales_count: (listing.sales_count || 0) + 1 })
              .eq('id', listing.id);

            // Credit seller wallet
            const { data: wallet } = await supabase
              .from('wallets').select('*').eq('user_id', sellerId).maybeSingle();

            if (wallet) {
              await supabase.from('wallets').update({
                balance_cents: wallet.balance_cents + earning,
                lifetime_earnings_cents: wallet.lifetime_earnings_cents + earning,
              }).eq('user_id', sellerId);
            } else {
              await supabase.from('wallets').insert({
                user_id: sellerId, balance_cents: earning, lifetime_earnings_cents: earning,
              });
            }

            const { data: purchase } = await supabase.from('purchases')
              .select('id').eq('stripe_session_id', session.id).maybeSingle();
            await supabase.from('wallet_transactions').insert({
              user_id: sellerId, amount_cents: earning, type: 'sale',
              purchase_id: purchase?.id,
              note: `Sale: ${listing.title}`,
            });
          }
          break;
        }

        if (userId && planType && session.subscription) {
          await supabase.from('subscriptions').upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            plan_type: planType,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }
});