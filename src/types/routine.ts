// Routine data types for the Daily Routine Reminder app

export type ReminderOffset = 5 | 10 | 15;

export type RepeatOption = 'daily' | 'weekdays' | 'custom';

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface Routine {
  id: string;
  title: string;
  time: string; // HH:MM format
  reminderOffset: ReminderOffset;
  repeatOption: RepeatOption;
  customDays: DayOfWeek[];
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineFormData {
  title: string;
  time: string;
  reminderOffset: ReminderOffset;
  repeatOption: RepeatOption;
  customDays: DayOfWeek[];
}

// Day labels for display
export const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
};

export const DAY_FULL_LABELS: Record<DayOfWeek, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

export const ALL_DAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
export const WEEKDAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri'];
