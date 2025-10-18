import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type PlanType = 'free' | 'pro' | 'enterprise';

interface Subscription {
  plan_type: PlanType;
  status: string;
  current_period_end: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('plan_type, status, current_period_end')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (error) throw error;

        // If no active subscription, user is on free plan
        setSubscription(data ? {
          plan_type: data.plan_type as PlanType,
          status: data.status,
          current_period_end: data.current_period_end
        } : { plan_type: 'free', status: 'active', current_period_end: null });
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setSubscription({ plan_type: 'free', status: 'active', current_period_end: null });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();

    // Subscribe to changes
    const channel = supabase
      .channel('subscriptions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { subscription, loading, planType: subscription?.plan_type || 'free' };
};