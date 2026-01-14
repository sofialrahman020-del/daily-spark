import { ReminderOffset, RepeatOption, DayOfWeek } from './routine';

export interface TemplateRoutine {
  title: string;
  time: string;
  reminderOffset: ReminderOffset;
  repeatOption: RepeatOption;
  customDays: DayOfWeek[];
}

export interface RoutineTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  routines: TemplateRoutine[];
}

export const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: 'morning',
    name: 'Morning Routine',
    description: 'Start your day right with energizing activities',
    icon: 'Sunrise',
    color: 'hsl(35, 92%, 60%)',
    routines: [
      { title: 'Wake Up', time: '06:00', reminderOffset: 5, repeatOption: 'daily', customDays: [] },
      { title: 'Morning Stretch', time: '06:15', reminderOffset: 5, repeatOption: 'daily', customDays: [] },
      { title: 'Healthy Breakfast', time: '06:45', reminderOffset: 10, repeatOption: 'daily', customDays: [] },
      { title: 'Plan Your Day', time: '07:15', reminderOffset: 5, repeatOption: 'daily', customDays: [] },
    ],
  },
  {
    id: 'student',
    name: 'Student Study Routine',
    description: 'Optimize your study sessions for better learning',
    icon: 'BookOpen',
    color: 'hsl(220, 90%, 60%)',
    routines: [
      { title: 'Morning Review', time: '08:00', reminderOffset: 10, repeatOption: 'weekdays', customDays: [] },
      { title: 'Study Session 1', time: '09:00', reminderOffset: 5, repeatOption: 'weekdays', customDays: [] },
      { title: 'Break & Snack', time: '10:30', reminderOffset: 5, repeatOption: 'weekdays', customDays: [] },
      { title: 'Study Session 2', time: '11:00', reminderOffset: 5, repeatOption: 'weekdays', customDays: [] },
      { title: 'Evening Review', time: '19:00', reminderOffset: 10, repeatOption: 'weekdays', customDays: [] },
    ],
  },
  {
    id: 'gym',
    name: 'Gym Routine',
    description: 'Stay fit with a structured workout schedule',
    icon: 'Dumbbell',
    color: 'hsl(0, 85%, 60%)',
    routines: [
      { title: 'Pre-Workout Meal', time: '05:30', reminderOffset: 15, repeatOption: 'weekdays', customDays: [] },
      { title: 'Gym Session', time: '06:00', reminderOffset: 10, repeatOption: 'weekdays', customDays: [] },
      { title: 'Post-Workout Shake', time: '07:30', reminderOffset: 5, repeatOption: 'weekdays', customDays: [] },
      { title: 'Rest Day Yoga', time: '07:00', reminderOffset: 10, repeatOption: 'custom', customDays: ['sat', 'sun'] },
    ],
  },
  {
    id: 'meditation',
    name: 'Meditation Routine',
    description: 'Find inner peace with daily mindfulness practice',
    icon: 'Brain',
    color: 'hsl(280, 70%, 60%)',
    routines: [
      { title: 'Morning Meditation', time: '06:00', reminderOffset: 5, repeatOption: 'daily', customDays: [] },
      { title: 'Breathing Exercise', time: '12:00', reminderOffset: 5, repeatOption: 'daily', customDays: [] },
      { title: 'Gratitude Journal', time: '20:00', reminderOffset: 10, repeatOption: 'daily', customDays: [] },
      { title: 'Evening Meditation', time: '21:30', reminderOffset: 5, repeatOption: 'daily', customDays: [] },
    ],
  },
  {
    id: 'workday',
    name: 'Workday Routine',
    description: 'Stay productive throughout your work day',
    icon: 'Briefcase',
    color: 'hsl(160, 70%, 45%)',
    routines: [
      { title: 'Morning Standup Prep', time: '08:45', reminderOffset: 10, repeatOption: 'weekdays', customDays: [] },
      { title: 'Deep Work Block', time: '09:30', reminderOffset: 5, repeatOption: 'weekdays', customDays: [] },
      { title: 'Lunch Break', time: '12:00', reminderOffset: 10, repeatOption: 'weekdays', customDays: [] },
      { title: 'Email Check', time: '14:00', reminderOffset: 5, repeatOption: 'weekdays', customDays: [] },
      { title: 'End of Day Review', time: '17:30', reminderOffset: 10, repeatOption: 'weekdays', customDays: [] },
    ],
  },
];
