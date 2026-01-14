import { ReminderOffset } from './routine';

export interface UserProfile {
  name: string;
  photoUrl: string | null;
  defaultReminderOffset: ReminderOffset;
  alarmSound: string;
  vibrationEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface UserStats {
  totalRoutinesCompleted: number;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string | null;
}

export const DEFAULT_PROFILE: UserProfile = {
  name: 'User',
  photoUrl: null,
  defaultReminderOffset: 5,
  alarmSound: 'default',
  vibrationEnabled: true,
  theme: 'dark',
};

export const DEFAULT_STATS: UserStats = {
  totalRoutinesCompleted: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastActiveDate: null,
};

export const ALARM_SOUNDS = [
  { id: 'default', name: 'Default' },
  { id: 'gentle', name: 'Gentle Wake' },
  { id: 'energetic', name: 'Energetic' },
  { id: 'nature', name: 'Nature Sounds' },
  { id: 'classic', name: 'Classic Alarm' },
];
