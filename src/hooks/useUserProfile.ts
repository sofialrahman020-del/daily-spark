import { useState, useEffect, useCallback } from 'react';
import { UserProfile, UserStats, DEFAULT_PROFILE, DEFAULT_STATS } from '@/types/profile';

const PROFILE_KEY = 'user-profile';
const STATS_KEY = 'user-stats';

const loadProfile = (): UserProfile => {
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    return stored ? { ...DEFAULT_PROFILE, ...JSON.parse(stored) } : DEFAULT_PROFILE;
  } catch (error) {
    console.error('Failed to load profile:', error);
    return DEFAULT_PROFILE;
  }
};

const saveProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save profile:', error);
  }
};

const loadStats = (): UserStats => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    return stored ? { ...DEFAULT_STATS, ...JSON.parse(stored) } : DEFAULT_STATS;
  } catch (error) {
    console.error('Failed to load stats:', error);
    return DEFAULT_STATS;
  }
};

const saveStats = (stats: UserStats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save stats:', error);
  }
};

const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedProfile = loadProfile();
    const loadedStats = loadStats();
    
    // Check and update streak
    const today = getTodayDate();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (loadedStats.lastActiveDate && loadedStats.lastActiveDate !== today && loadedStats.lastActiveDate !== yesterdayStr) {
      // Streak broken
      loadedStats.currentStreak = 0;
    }
    
    setProfile(loadedProfile);
    setStats(loadedStats);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveProfile(profile);
    }
  }, [profile, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveStats(stats);
    }
  }, [stats, isLoading]);

  const updateProfile = useCallback((updates: Partial<UserProfile>): void => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const incrementRoutinesCompleted = useCallback((): void => {
    const today = getTodayDate();
    
    setStats(prev => {
      const isNewDay = prev.lastActiveDate !== today;
      const newStreak = isNewDay ? prev.currentStreak + 1 : prev.currentStreak;
      const newBestStreak = Math.max(prev.bestStreak, newStreak);
      
      return {
        totalRoutinesCompleted: prev.totalRoutinesCompleted + 1,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        lastActiveDate: today,
      };
    });
  }, []);

  const updateLastActiveDate = useCallback((): void => {
    const today = getTodayDate();
    setStats(prev => ({
      ...prev,
      lastActiveDate: today,
    }));
  }, []);

  return {
    profile,
    stats,
    isLoading,
    updateProfile,
    incrementRoutinesCompleted,
    updateLastActiveDate,
  };
};
