import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, Zap, Crown, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Pricing = () => {
  const { user } = useAuth();
  const { planType, loading } = useSubscription();
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = async (plan: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (plan === 'free') {
      toast.info('You are already on the free plan');
      return;
    }

    if (plan === 'enterprise') {
      toast.info('Please contact sales for enterprise plans');
      return;
    }

    try {
      toast.loading('Creating checkout session...');
      
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          planType: plan, 
          userId: user.id,
          billingPeriod 
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create checkout session');
    }
  };

  const calculatePrice = (basePrice: string) => {
    const price = parseInt(basePrice);
    if (billingPeriod === 'yearly') {
      // 20% discount for yearly
      return Math.round(price * 12 * 0.8);
    }
    return price;
  };

  const plans = [
    {
      name: "Free",
      price: "0",
      period: "forever",
      description: "Perfect for trying out Impressio",
      badge: null,
      features: [
        "3 designs per month",
        "Basic templates",
        "Standard quality exports",
        "Email support",
        "Impressio watermark"
      ],
      limitations: [
        "Advanced templates",
        "HD quality exports",
        "Team collaboration",
        "Custom branding",
        "Priority support"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Pro",
      price: "19",
      period: "month",
      description: "Best for professionals and small teams",
      badge: "Most Popular",
      features: [
        "Unlimited designs",
        "All premium templates",
        "HD quality exports",
        "Remove watermarks",
        "Priority email support",
        "Advanced editing tools",
        "Custom fonts",
        "Team sharing (up to 5 members)"
      ],
      limitations: [
        "Advanced team features",
        "Custom branding",
        "API access"
      ],
      buttonText: "Start Pro Trial",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      price: "59",
      period: "month",
      description: "For large teams and organizations",
      badge: "Best Value",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "Custom branding",
        "API access",
        "Advanced analytics",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
        "Phone support"
      ],
      limitations: [],
      buttonText: "Contact Sales",
      buttonVariant: "default" as const,
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes! You can cancel your subscription at any time from your account settings. You'll continue to have access to Pro features until the end of your billing period."
    },
    {
      question: "What happens to my designs if I downgrade?",
      answer: "Your designs are always yours to keep. If you downgrade, you'll keep all existing designs but may lose access to some premium features for new designs."
    },
    {
      question: "Do you offer student discounts?",
      answer: "Yes! We offer 50% off Pro plans for verified students and educators. Contact our support team with your .edu email address."
    },
    {
      question: "Can I change plans later?",
      answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to get started."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-subtle">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Choose the perfect plan for your design needs. Start free, upgrade anytime.
          </p>
          
          {/* Toggle */}
          <div className="inline-flex items-center bg-muted rounded-lg p-1">
            <button 
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                billingPeriod === 'monthly' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                billingPeriod === 'yearly' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground'
              }`}
            >
              Yearly
              <Badge className="ml-2 bg-green-100 text-green-700 text-xs">Save 20%</Badge>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={plan.name} 
                className={`relative p-8 ${
                  plan.popular 
                    ? 'border-primary shadow-elegant ring-2 ring-primary/20' 
                    : 'border-border'
                } hover:shadow-elegant transition-all duration-300`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    {plan.badge}
                  </Badge>
                )}
                
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className="mb-4">
                    {index === 0 && <Sparkles className="w-8 h-8 mx-auto text-muted-foreground" />}
                    {index === 1 && <Zap className="w-8 h-8 mx-auto text-primary" />}
                    {index === 2 && <Crown className="w-8 h-8 mx-auto text-gold" />}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-foreground">
                      ${plan.name === 'Free' ? plan.price : calculatePrice(plan.price)}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      /{billingPeriod === 'yearly' && plan.name !== 'Free' ? 'year' : plan.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <div key={limitationIndex} className="flex items-start gap-3 opacity-50">
                      <X className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{limitation}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  variant={plan.buttonVariant} 
                  className="w-full"
                  size="lg"
                  onClick={() => handleSubscribe(plan.name.toLowerCase())}
                  disabled={loading || (user && planType === plan.name.toLowerCase())}
                >
                  {user && planType === plan.name.toLowerCase() 
                    ? 'Current Plan' 
                    : plan.buttonText}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Compare All Features
            </h2>
            <p className="text-muted-foreground">
              See exactly what's included in each plan
            </p>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-semibold">Features</th>
                    <th className="text-center p-4 font-semibold">Free</th>
                    <th className="text-center p-4 font-semibold">Pro</th>
                    <th className="text-center p-4 font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-4">Designs per month</td>
                    <td className="text-center p-4">3</td>
                    <td className="text-center p-4">Unlimited</td>
                    <td className="text-center p-4">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="p-4">Templates</td>
                    <td className="text-center p-4">Basic</td>
                    <td className="text-center p-4">All Premium</td>
                    <td className="text-center p-4">All Premium</td>
                  </tr>
                  <tr>
                    <td className="p-4">Export Quality</td>
                    <td className="text-center p-4">Standard</td>
                    <td className="text-center p-4">HD</td>
                    <td className="text-center p-4">HD</td>
                  </tr>
                  <tr>
                    <td className="p-4">Team Members</td>
                    <td className="text-center p-4">1</td>
                    <td className="text-center p-4">5</td>
                    <td className="text-center p-4">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="p-4">Custom Branding</td>
                    <td className="text-center p-4"><X className="w-4 h-4 text-muted-foreground mx-auto" /></td>
                    <td className="text-center p-4"><X className="w-4 h-4 text-muted-foreground mx-auto" /></td>
                    <td className="text-center p-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4">API Access</td>
                    <td className="text-center p-4"><X className="w-4 h-4 text-muted-foreground mx-auto" /></td>
                    <td className="text-center p-4"><X className="w-4 h-4 text-muted-foreground mx-auto" /></td>
                    <td className="text-center p-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold text-foreground mb-3">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-subtle">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users creating beautiful designs with Impressio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline">
              Start Free Trial
            </Button>
            <Button size="lg">
              View All Plans
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;