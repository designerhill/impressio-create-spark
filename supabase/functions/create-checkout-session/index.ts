import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

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

    const { planType, userId, billingPeriod = 'monthly' } = await req.json();

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
    
    // Create or retrieve customer
    const customers = await stripe.customers.list({
      limit: 1,
      email: userId, // In production, use actual email
    });

    let customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        metadata: { supabase_user_id: userId },
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
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
      success_url: `${origin}/pricing?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        supabase_user_id: userId,
        plan_type: planType,
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