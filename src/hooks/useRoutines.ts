import { useState, useEffect, useCallback } from 'react';
import { Routine, RoutineFormData, DayOfWeek, ALL_DAYS, WEEKDAYS } from '@/types/routine';

const STORAGE_KEY = 'daily-routines';

// Generate unique ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get current day of week
const getCurrentDay = (): DayOfWeek => {
  const days: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return days[new Date().getDay()];
};

// Load routines from localStorage
const loadRoutines = (): Routine[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load routines:', error);
    return [];
  }
};

// Save routines to localStorage
const saveRoutines = (routines: Routine[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
  } catch (error) {
    console.error('Failed to save routines:', error);
  }
};

export const useRoutines = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load routines on mount
  useEffect(() => {
    const loaded = loadRoutines();
    setRoutines(loaded);
    setIsLoading(false);
  }, []);

  // Save routines whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveRoutines(routines);
    }
  }, [routines, isLoading]);

  // Add a new routine
  const addRoutine = useCallback((data: RoutineFormData): Routine => {
    const now = new Date().toISOString();
    const newRoutine: Routine = {
      id: generateId(),
      ...data,
      isEnabled: true,
      createdAt: now,
      updatedAt: now,
    };

    setRoutines(prev => [...prev, newRoutine]);
    return newRoutine;
  }, []);

  // Update an existing routine
  const updateRoutine = useCallback((id: string, data: Partial<RoutineFormData>): void => {
    setRoutines(prev =>
      prev.map(routine =>
        routine.id === id
          ? { ...routine, ...data, updatedAt: new Date().toISOString() }
          : routine
      )
    );
  }, []);

  // Delete a routine
  const deleteRoutine = useCallback((id: string): void => {
    setRoutines(prev => prev.filter(routine => routine.id !== id));
  }, []);

  // Toggle routine enabled state
  const toggleRoutine = useCallback((id: string): void => {
    setRoutines(prev =>
      prev.map(routine =>
        routine.id === id
          ? { ...routine, isEnabled: !routine.isEnabled, updatedAt: new Date().toISOString() }
          : routine
      )
    );
  }, []);

  // Get routine by ID
  const getRoutine = useCallback((id: string): Routine | undefined => {
    return routines.find(routine => routine.id === id);
  }, [routines]);

  // Get routines for today
  const getTodaysRoutines = useCallback((): Routine[] => {
    const today = getCurrentDay();
    
    return routines
      .filter(routine => {
        if (!routine.isEnabled) return false;
        
        switch (routine.repeatOption) {
          case 'daily':
            return true;
          case 'weekdays':
            return WEEKDAYS.includes(today);
          case 'custom':
            return routine.customDays.includes(today);
          default:
            return false;
        }
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [routines]);

  // Get next upcoming routine
  const getNextRoutine = useCallback((): Routine | null => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const todaysRoutines = getTodaysRoutines();
    const upcoming = todaysRoutines.filter(r => r.time > currentTime);
    
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [getTodaysRoutines]);

  return {
    routines,
    isLoading,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    toggleRoutine,
    getRoutine,
    getTodaysRoutines,
    getNextRoutine,
  };
};
