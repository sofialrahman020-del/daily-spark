import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { UserProfile, UserStats, DEFAULT_PROFILE, DEFAULT_STATS } from '@/types/profile';

const PROFILE_KEY = 'user-profile';
const STATS_KEY = 'user-stats';

// Shared state for profile
let profileState: UserProfile = DEFAULT_PROFILE;
let statsState: UserStats = DEFAULT_STATS;
let isInitialized = false;

// Subscribers for state changes
const profileListeners = new Set<() => void>();
const statsListeners = new Set<() => void>();

const notifyProfileListeners = () => {
  profileListeners.forEach(listener => listener());
};

const notifyStatsListeners = () => {
  statsListeners.forEach(listener => listener());
};

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

// Initialize state from localStorage
const initializeState = () => {
  if (!isInitialized) {
    profileState = loadProfile();
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
    
    statsState = loadedStats;
    isInitialized = true;
  }
};

// Initialize on module load
initializeState();

export const useUserProfile = () => {
  // Subscribe to profile changes
  const profile = useSyncExternalStore(
    (callback) => {
      profileListeners.add(callback);
      return () => profileListeners.delete(callback);
    },
    () => profileState
  );

  // Subscribe to stats changes
  const stats = useSyncExternalStore(
    (callback) => {
      statsListeners.add(callback);
      return () => statsListeners.delete(callback);
    },
    () => statsState
  );

  const updateProfile = useCallback((updates: Partial<UserProfile>): void => {
    profileState = { ...profileState, ...updates };
    saveProfile(profileState);
    notifyProfileListeners();
  }, []);

  const incrementRoutinesCompleted = useCallback((): void => {
    const today = getTodayDate();
    
    const isNewDay = statsState.lastActiveDate !== today;
    const newStreak = isNewDay ? statsState.currentStreak + 1 : statsState.currentStreak;
    const newBestStreak = Math.max(statsState.bestStreak, newStreak);
    
    statsState = {
      totalRoutinesCompleted: statsState.totalRoutinesCompleted + 1,
      currentStreak: newStreak,
      bestStreak: newBestStreak,
      lastActiveDate: today,
    };
    
    saveStats(statsState);
    notifyStatsListeners();
  }, []);

  const updateLastActiveDate = useCallback((): void => {
    const today = getTodayDate();
    statsState = {
      ...statsState,
      lastActiveDate: today,
    };
    saveStats(statsState);
    notifyStatsListeners();
  }, []);

  return {
    profile,
    stats,
    isLoading: false,
    updateProfile,
    incrementRoutinesCompleted,
    updateLastActiveDate,
  };
};
