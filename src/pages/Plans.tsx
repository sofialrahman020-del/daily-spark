import React, { useState } from 'react';
import { ArrowLeft, Check, X, Crown, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { PREMIUM_PLANS, FREE_PLAN, PremiumDuration } from '@/types/subscription';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PlansProps {
  onBack: () => void;
}

export const Plans: React.FC<PlansProps> = ({ onBack }) => {
  const { subscription, isPremium, upgradeToPremium, getDaysRemaining } = useSubscription();
  const [selectedDuration, setSelectedDuration] = useState<PremiumDuration>('1_year');
  
  const daysRemaining = getDaysRemaining();

  const handleUpgrade = (duration: PremiumDuration) => {
    // In a real app, this would trigger a payment flow
    upgradeToPremium(duration);
    toast.success('🎉 Welcome to Premium!');
  };

  const selectedPlan = PREMIUM_PLANS.find(p => p.duration === selectedDuration);

  return (
    <div className="min-h-screen bg-background safe-top safe-bottom">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Subscription Plans</h1>
        </div>
      </div>

      <div className="px-4 py-6 pb-24 space-y-6">
        {/* Current Plan Status */}
        {isPremium && (
          <Card className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-full">
                <Crown className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="font-medium text-amber-500">Premium Active</p>
                {daysRemaining !== null && (
                  <p className="text-sm text-muted-foreground">
                    {daysRemaining} days remaining
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Free Plan Card */}
        <Card className={cn(
          "p-4 transition-all",
          !isPremium && "ring-2 ring-primary"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">{FREE_PLAN.name}</h2>
              <p className="text-2xl font-bold">
                ₹{FREE_PLAN.price}
                <span className="text-sm font-normal text-muted-foreground"> / lifetime</span>
              </p>
            </div>
            {!isPremium && (
              <Badge variant="outline" className="text-primary border-primary">
                Current Plan
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            {FREE_PLAN.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                {feature.included ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={cn(
                  "text-sm",
                  !feature.included && "text-muted-foreground"
                )}>
                  {feature.text}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="text-sm">📺</span>
              <span className="text-sm text-muted-foreground">Contains ads</span>
            </div>
          </div>
        </Card>

        {/* Premium Plans Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold">Premium Plans</h2>
          </div>

          {/* Duration Selector */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {PREMIUM_PLANS.map((plan) => (
              <button
                key={plan.duration}
                onClick={() => setSelectedDuration(plan.duration!)}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all text-left relative",
                  selectedDuration === plan.duration
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-border bg-card hover:border-amber-500/50"
                )}
              >
                {plan.duration === '1_year' && (
                  <Badge className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs">
                    Best Value
                  </Badge>
                )}
                <p className="text-sm text-muted-foreground">{plan.durationLabel}</p>
                <p className="text-lg font-bold">₹{plan.price}</p>
                {plan.discount && (
                  <p className="text-xs text-green-500">{plan.discount}% OFF</p>
                )}
              </button>
            ))}
          </div>

          {/* Selected Plan Details */}
          {selectedPlan && (
            <Card className="p-4 bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/30">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="font-semibold">Premium Features</h3>
              </div>

              <div className="space-y-2 mb-6">
                {selectedPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                onClick={() => handleUpgrade(selectedDuration)}
                disabled={isPremium && subscription.premiumDuration === selectedDuration}
              >
                {isPremium ? 'Extend Subscription' : `Upgrade for ₹${selectedPlan.price}`}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-3">
                Cancel anytime. No questions asked.
              </p>
            </Card>
          )}
        </div>

        {/* Why Premium Section */}
        <div className="mt-8">
          <h3 className="font-semibold mb-4">Why go Premium?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-1.5 rounded-full bg-primary/10">
                <span className="text-lg">🚫</span>
              </div>
              <div>
                <p className="font-medium text-sm">No Ads</p>
                <p className="text-xs text-muted-foreground">
                  Enjoy a clean, distraction-free experience
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-1.5 rounded-full bg-primary/10">
                <span className="text-lg">♾️</span>
              </div>
              <div>
                <p className="font-medium text-sm">Unlimited Everything</p>
                <p className="text-xs text-muted-foreground">
                  No limits on routines and goals
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-1.5 rounded-full bg-primary/10">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <p className="font-medium text-sm">Advanced Analytics</p>
                <p className="text-xs text-muted-foreground">
                  Track your progress with detailed stats
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
