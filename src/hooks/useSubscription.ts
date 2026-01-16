import { useCallback, useSyncExternalStore } from 'react';
import { 
  UserSubscription, 
  DEFAULT_SUBSCRIPTION, 
  FREE_PLAN_LIMITS,
  PremiumDuration,
  PlanType 
} from '@/types/subscription';

const SUBSCRIPTION_KEY = 'user-subscription';

// Shared state for subscription
let subscriptionState: UserSubscription = DEFAULT_SUBSCRIPTION;
let isInitialized = false;

// Subscribers for state changes
const subscriptionListeners = new Set<() => void>();

const notifySubscriptionListeners = () => {
  subscriptionListeners.forEach(listener => listener());
};

const loadSubscription = (): UserSubscription => {
  try {
    const stored = localStorage.getItem(SUBSCRIPTION_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Check if subscription has expired
      if (parsed.endDate && new Date(parsed.endDate) < new Date()) {
        return { ...DEFAULT_SUBSCRIPTION };
      }
      return { ...DEFAULT_SUBSCRIPTION, ...parsed };
    }
    return DEFAULT_SUBSCRIPTION;
  } catch (error) {
    console.error('Failed to load subscription:', error);
    return DEFAULT_SUBSCRIPTION;
  }
};

const saveSubscription = (subscription: UserSubscription): void => {
  try {
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
  } catch (error) {
    console.error('Failed to save subscription:', error);
  }
};

// Initialize state from localStorage
const initializeState = () => {
  if (!isInitialized) {
    subscriptionState = loadSubscription();
    isInitialized = true;
  }
};

// Initialize on module load
initializeState();

export const useSubscription = () => {
  // Subscribe to subscription changes
  const subscription = useSyncExternalStore(
    (callback) => {
      subscriptionListeners.add(callback);
      return () => subscriptionListeners.delete(callback);
    },
    () => subscriptionState
  );

  const isPremium = subscription.planType === 'premium' && subscription.isActive;

  const upgradeToPremium = useCallback((duration: PremiumDuration): void => {
    const startDate = new Date().toISOString();
    let endDate: Date;
    
    switch (duration) {
      case '1_month':
        endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case '3_months':
        endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case '6_months':
        endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case '1_year':
        endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }
    
    subscriptionState = {
      planType: 'premium',
      premiumDuration: duration,
      startDate,
      endDate: endDate.toISOString(),
      isActive: true,
    };
    
    saveSubscription(subscriptionState);
    notifySubscriptionListeners();
  }, []);

  const downgradeToFree = useCallback((): void => {
    subscriptionState = {
      planType: 'free',
      isActive: true,
    };
    
    saveSubscription(subscriptionState);
    notifySubscriptionListeners();
  }, []);

  const canAddRoutine = useCallback((currentCount: number): boolean => {
    if (isPremium) return true;
    return currentCount < FREE_PLAN_LIMITS.routines;
  }, [isPremium]);

  const canAddGoal = useCallback((currentCount: number): boolean => {
    if (isPremium) return true;
    return currentCount < FREE_PLAN_LIMITS.goals;
  }, [isPremium]);

  const getRemainingRoutines = useCallback((currentCount: number): number => {
    if (isPremium) return Infinity;
    return Math.max(0, FREE_PLAN_LIMITS.routines - currentCount);
  }, [isPremium]);

  const getRemainingGoals = useCallback((currentCount: number): number => {
    if (isPremium) return Infinity;
    return Math.max(0, FREE_PLAN_LIMITS.goals - currentCount);
  }, [isPremium]);

  const getDaysRemaining = useCallback((): number | null => {
    if (!subscription.endDate) return null;
    const end = new Date(subscription.endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, [subscription.endDate]);

  return {
    subscription,
    isPremium,
    upgradeToPremium,
    downgradeToFree,
    canAddRoutine,
    canAddGoal,
    getRemainingRoutines,
    getRemainingGoals,
    getDaysRemaining,
    limits: FREE_PLAN_LIMITS,
  };
};
