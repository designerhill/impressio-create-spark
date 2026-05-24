import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get('strip_secret_key');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Verify auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user?.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { planType, billingPeriod = 'monthly' } = await req.json();

    // Define price mapping
    const priceMap: Record<string, { amount: number; name: string }> = {
      pro: { amount: 1900, name: 'Pro Plan' },
      enterprise: { amount: 5900, name: 'Enterprise Plan' },
    };

    if (!priceMap[planType]) {
      throw new Error('Invalid plan type');
    }

    // Calculate price based on billing period (20% discount for yearly)
    let finalAmount = priceMap[planType].amount;
    const interval = billingPeriod === 'yearly' ? 'year' : 'month';
    
    if (billingPeriod === 'yearly') {
      finalAmount = Math.round(priceMap[planType].amount * 12 * 0.8);
    }

    const origin = req.headers.get('origin') || 'http://localhost:8080';

    // Look up existing customer from subscriptions table first
    const { data: existingSub } = await adminClient
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    let customerId: string | undefined = existingSub?.stripe_customer_id ?? undefined;

    if (!customerId) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { supabase_user_id: user.id },
        });
        customerId = customer.id;
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: priceMap[planType].name,
              description: `${planType.charAt(0).toUpperCase() + planType.slice(1)} subscription - ${billingPeriod} billing`,
            },
            unit_amount: finalAmount,
            recurring: {
              interval: interval as 'month' | 'year',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        supabase_user_id: user.id,
        plan_type: planType,
        billing_period: billingPeriod,
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});