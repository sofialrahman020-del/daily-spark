import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Bell, Repeat, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TimePickerWheel from '@/components/TimePickerWheel';
import DaySelector from '@/components/DaySelector';
import {
  Routine,
  RoutineFormData,
  ReminderOffset,
  RepeatOption,
  DayOfWeek,
  WEEKDAYS,
  ALL_DAYS,
} from '@/types/routine';
import { cn } from '@/lib/utils';

interface RoutineFormProps {
  routine?: Routine; // If provided, we're editing
  onSave: (data: RoutineFormData) => void;
  onDelete?: () => void;
  onBack: () => void;
}

const REMINDER_OPTIONS: { value: ReminderOffset; label: string }[] = [
  { value: 0, label: 'No Alarm' },
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 15, label: '15 min' },
];

const REPEAT_OPTIONS: { value: RepeatOption; label: string }[] = [
  { value: 'daily', label: 'Every day' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'custom', label: 'Custom' },
];

const RoutineForm: React.FC<RoutineFormProps> = ({
  routine,
  onSave,
  onDelete,
  onBack,
}) => {
  const [title, setTitle] = useState(routine?.title || '');
  const [time, setTime] = useState(routine?.time || '08:00');
  const [reminderOffset, setReminderOffset] = useState<ReminderOffset>(
    routine?.reminderOffset || 10
  );
  const [repeatOption, setRepeatOption] = useState<RepeatOption>(
    routine?.repeatOption || 'daily'
  );
  const [customDays, setCustomDays] = useState<DayOfWeek[]>(
    routine?.customDays || ALL_DAYS
  );

  const isEditing = !!routine;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const effectiveDays =
      repeatOption === 'daily'
        ? ALL_DAYS
        : repeatOption === 'weekdays'
        ? WEEKDAYS
        : customDays;

    onSave({
      title: title.trim(),
      time,
      reminderOffset,
      repeatOption,
      customDays: effectiveDays,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-top safe-bottom pb-20 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors haptic"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold font-display">
          {isEditing ? 'Edit Routine' : 'New Routine'}
        </h1>
        {isEditing && onDelete ? (
          <button
            onClick={onDelete}
            className="p-2 -mr-2 rounded-lg hover:bg-destructive/10 transition-colors haptic"
          >
            <Trash2 className="w-5 h-5 text-destructive" />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          {/* Time Picker */}
          <section>
            <TimePickerWheel value={time} onChange={setTime} />
          </section>

          {/* Title */}
          <section>
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
              <Type className="w-4 h-4" />
              Routine Name
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Wake Up, Gym, Study..."
              className="h-12 text-base"
              maxLength={50}
            />
          </section>

          {/* Reminder Offset */}
          <section>
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
              <Bell className="w-4 h-4" />
              Remind Me Before
            </label>
            <div className="grid grid-cols-4 gap-2">
              {REMINDER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setReminderOffset(option.value)}
                  className={cn(
                    "py-3 rounded-xl text-xs font-medium transition-all duration-200 haptic",
                    reminderOffset === option.value
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          {/* Repeat Options */}
          <section>
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
              <Repeat className="w-4 h-4" />
              Repeat
            </label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {REPEAT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRepeatOption(option.value)}
                  className={cn(
                    "py-3 rounded-xl text-sm font-medium transition-all duration-200 haptic",
                    repeatOption === option.value
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Custom Days Selector */}
            {repeatOption === 'custom' && (
              <div className="animate-scale-in">
                <DaySelector
                  selectedDays={customDays}
                  onChange={setCustomDays}
                />
              </div>
            )}
          </section>
        </div>

        {/* Submit Button */}
        <div className="px-4 py-6 border-t border-border bg-background">
          <Button
            type="submit"
            variant="primary"
            size="xl"
            className="w-full"
            disabled={!title.trim()}
          >
            {isEditing ? 'Save Changes' : 'Create Routine'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RoutineForm;
