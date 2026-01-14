import { useState, useEffect, useCallback } from 'react';
import { Goal, GoalFormData } from '@/types/goal';

const STORAGE_KEY = 'daily-goals';

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

const getWeekStart = (): string => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek;
  const weekStart = new Date(now.setDate(diff));
  return weekStart.toISOString().split('T')[0];
};

const loadGoals = (): Goal[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load goals:', error);
    return [];
  }
};

const saveGoals = (goals: Goal[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Failed to save goals:', error);
  }
};

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reset goals based on frequency
  const resetGoalsIfNeeded = useCallback((loadedGoals: Goal[]): Goal[] => {
    const today = getTodayDate();
    const weekStart = getWeekStart();

    return loadedGoals.map(goal => {
      const lastCompleted = goal.lastCompletedDate;
      
      if (goal.frequency === 'daily' && lastCompleted !== today) {
        // Check if streak should continue (completed yesterday)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        const newStreak = lastCompleted === yesterdayStr ? goal.streak : 0;
        
        return {
          ...goal,
          currentCount: 0,
          isCompleted: false,
          streak: newStreak,
          updatedAt: new Date().toISOString(),
        };
      }
      
      if (goal.frequency === 'weekly' && lastCompleted && lastCompleted < weekStart) {
        return {
          ...goal,
          currentCount: 0,
          isCompleted: false,
          updatedAt: new Date().toISOString(),
        };
      }
      
      return goal;
    });
  }, []);

  useEffect(() => {
    const loaded = loadGoals();
    const reset = resetGoalsIfNeeded(loaded);
    setGoals(reset);
    saveGoals(reset);
    setIsLoading(false);
  }, [resetGoalsIfNeeded]);

  useEffect(() => {
    if (!isLoading) {
      saveGoals(goals);
    }
  }, [goals, isLoading]);

  const addGoal = useCallback((data: GoalFormData): Goal => {
    const now = new Date().toISOString();
    const newGoal: Goal = {
      id: generateId(),
      ...data,
      currentCount: 0,
      isCompleted: false,
      streak: 0,
      lastCompletedDate: null,
      createdAt: now,
      updatedAt: now,
    };

    setGoals(prev => [...prev, newGoal]);
    return newGoal;
  }, []);

  const updateGoal = useCallback((id: string, data: Partial<GoalFormData>): void => {
    setGoals(prev =>
      prev.map(goal =>
        goal.id === id
          ? { ...goal, ...data, updatedAt: new Date().toISOString() }
          : goal
      )
    );
  }, []);

  const deleteGoal = useCallback((id: string): void => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  }, []);

  const toggleGoalComplete = useCallback((id: string): void => {
    setGoals(prev =>
      prev.map(goal => {
        if (goal.id !== id) return goal;
        
        const today = getTodayDate();
        const wasCompleted = goal.isCompleted;
        const newCompleted = !wasCompleted;
        
        return {
          ...goal,
          isCompleted: newCompleted,
          currentCount: goal.type === 'checkbox' ? (newCompleted ? 1 : 0) : goal.currentCount,
          streak: newCompleted ? goal.streak + 1 : Math.max(0, goal.streak - 1),
          lastCompletedDate: newCompleted ? today : goal.lastCompletedDate,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const incrementGoalCount = useCallback((id: string): void => {
    setGoals(prev =>
      prev.map(goal => {
        if (goal.id !== id || goal.type !== 'count') return goal;
        
        const today = getTodayDate();
        const newCount = Math.min(goal.currentCount + 1, goal.targetCount || 999);
        const newCompleted = newCount >= (goal.targetCount || 1);
        const wasCompleted = goal.isCompleted;
        
        return {
          ...goal,
          currentCount: newCount,
          isCompleted: newCompleted,
          streak: newCompleted && !wasCompleted ? goal.streak + 1 : goal.streak,
          lastCompletedDate: newCompleted ? today : goal.lastCompletedDate,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const decrementGoalCount = useCallback((id: string): void => {
    setGoals(prev =>
      prev.map(goal => {
        if (goal.id !== id || goal.type !== 'count') return goal;
        
        const newCount = Math.max(0, goal.currentCount - 1);
        const wasCompleted = goal.isCompleted;
        const newCompleted = newCount >= (goal.targetCount || 1);
        
        return {
          ...goal,
          currentCount: newCount,
          isCompleted: newCompleted,
          streak: wasCompleted && !newCompleted ? Math.max(0, goal.streak - 1) : goal.streak,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const getCompletedGoalsToday = useCallback((): number => {
    return goals.filter(g => g.isCompleted).length;
  }, [goals]);

  const getTotalGoals = useCallback((): number => {
    return goals.length;
  }, [goals]);

  return {
    goals,
    isLoading,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleGoalComplete,
    incrementGoalCount,
    decrementGoalCount,
    getCompletedGoalsToday,
    getTotalGoals,
  };
};
