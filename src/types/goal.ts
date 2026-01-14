export type GoalType = 'checkbox' | 'count';
export type GoalFrequency = 'daily' | 'weekly';

export interface Goal {
  id: string;
  title: string;
  type: GoalType;
  frequency: GoalFrequency;
  targetCount?: number;
  currentCount: number;
  isCompleted: boolean;
  streak: number;
  lastCompletedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GoalFormData {
  title: string;
  type: GoalType;
  frequency: GoalFrequency;
  targetCount?: number;
}
