export type PlanType = 'free' | 'premium';

export type PremiumDuration = '1_month' | '3_months' | '6_months' | '1_year';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  duration?: PremiumDuration;
  durationLabel?: string;
  discount?: number;
  features: PlanFeature[];
  limitations?: PlanLimitation[];
}

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PlanLimitation {
  type: 'routines' | 'goals';
  limit: number;
}

export interface UserSubscription {
  planType: PlanType;
  premiumDuration?: PremiumDuration;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export const FREE_PLAN_LIMITS = {
  routines: 5,
  goals: 3,
};

export const PREMIUM_PLANS: Plan[] = [
  {
    id: 'premium',
    name: 'Premium',
    price: 39,
    duration: '1_month',
    durationLabel: '1 Month',
    features: [
      { text: 'No ads', included: true },
      { text: 'Unlimited routines', included: true },
      { text: 'Unlimited goals', included: true },
      { text: 'Advanced alarms', included: true },
      { text: 'Stats & streaks', included: true },
      { text: 'Custom themes', included: true },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 109,
    duration: '3_months',
    durationLabel: '3 Months',
    discount: 10,
    features: [
      { text: 'No ads', included: true },
      { text: 'Unlimited routines', included: true },
      { text: 'Unlimited goals', included: true },
      { text: 'Advanced alarms', included: true },
      { text: 'Stats & streaks', included: true },
      { text: 'Custom themes', included: true },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 189,
    duration: '6_months',
    durationLabel: '6 Months',
    discount: 20,
    features: [
      { text: 'No ads', included: true },
      { text: 'Unlimited routines', included: true },
      { text: 'Unlimited goals', included: true },
      { text: 'Advanced alarms', included: true },
      { text: 'Stats & streaks', included: true },
      { text: 'Custom themes', included: true },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 329,
    duration: '1_year',
    durationLabel: '1 Year',
    discount: 30,
    features: [
      { text: 'No ads', included: true },
      { text: 'Unlimited routines', included: true },
      { text: 'Unlimited goals', included: true },
      { text: 'Advanced alarms', included: true },
      { text: 'Stats & streaks', included: true },
      { text: 'Custom themes', included: true },
    ],
  },
];

export const FREE_PLAN: Plan = {
  id: 'free',
  name: 'Free',
  price: 0,
  features: [
    { text: 'Up to 5 routines', included: true },
    { text: 'Up to 3 goals', included: true },
    { text: 'Basic alarms', included: true },
    { text: 'Advanced stats', included: false },
    { text: 'Custom alarm sounds', included: false },
    { text: 'Ad-free experience', included: false },
  ],
  limitations: [
    { type: 'routines', limit: 5 },
    { type: 'goals', limit: 3 },
  ],
};

export const DEFAULT_SUBSCRIPTION: UserSubscription = {
  planType: 'free',
  isActive: true,
};
