import React from 'react';
import { DayOfWeek, DAY_LABELS, ALL_DAYS } from '@/types/routine';
import { cn } from '@/lib/utils';

interface DaySelectorProps {
  selectedDays: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
  disabled?: boolean;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDays,
  onChange,
  disabled = false,
}) => {
  const toggleDay = (day: DayOfWeek) => {
    if (disabled) return;
    
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  return (
    <div className="flex justify-between gap-1">
      {ALL_DAYS.map((day) => {
        const isSelected = selectedDays.includes(day);
        return (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(day)}
            disabled={disabled}
            className={cn(
              "flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200 haptic",
              isSelected
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-secondary text-muted-foreground hover:bg-muted",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {DAY_LABELS[day]}
          </button>
        );
      })}
    </div>
  );
};

export default DaySelector;
