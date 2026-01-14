import React from 'react';
import { Clock, Bell, Repeat, ChevronRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Routine, DAY_LABELS, WEEKDAYS } from '@/types/routine';
import { cn } from '@/lib/utils';

interface RoutineCardProps {
  routine: Routine;
  onToggle: (id: string) => void;
  onClick: (routine: Routine) => void;
  isNext?: boolean;
}

const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  onToggle,
  onClick,
  isNext = false,
}) => {
  // Format time for display (12-hour format)
  const formatTime = (time: string): { time: string; period: string } => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return {
      time: `${displayHours}:${minutes.toString().padStart(2, '0')}`,
      period,
    };
  };

  // Get repeat description
  const getRepeatText = (): string => {
    switch (routine.repeatOption) {
      case 'daily':
        return 'Every day';
      case 'weekdays':
        return 'Weekdays';
      case 'custom':
        if (routine.customDays.length === 7) return 'Every day';
        if (routine.customDays.length === 0) return 'No days selected';
        return routine.customDays.map(d => DAY_LABELS[d]).join(', ');
      default:
        return '';
    }
  };

  const { time, period } = formatTime(routine.time);

  return (
    <div
      className={cn(
        "relative bg-card rounded-2xl p-4 shadow-card transition-all duration-200 haptic",
        "hover:shadow-elevated cursor-pointer",
        isNext && "ring-2 ring-primary/30 bg-gradient-card",
        !routine.isEnabled && "opacity-60"
      )}
      onClick={() => onClick(routine)}
    >
      {/* Next indicator */}
      {isNext && (
        <div className="absolute -top-2 left-4 px-2 py-0.5 bg-primary rounded-full">
          <span className="text-xs font-medium text-primary-foreground">Next up</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        {/* Left: Time and Title */}
        <div className="flex items-center gap-4">
          {/* Time display */}
          <div className="flex flex-col items-end">
            <span className={cn(
              "text-3xl font-bold font-display time-display",
              routine.isEnabled ? "text-foreground" : "text-muted-foreground"
            )}>
              {time}
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {period}
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-12 bg-border" />

          {/* Title and meta */}
          <div className="flex flex-col gap-1">
            <h3 className={cn(
              "text-lg font-semibold",
              routine.isEnabled ? "text-foreground" : "text-muted-foreground"
            )}>
              {routine.title}
            </h3>
            
            <div className="flex items-center gap-3 text-muted-foreground">
              {/* Reminder info */}
              <div className="flex items-center gap-1">
                <Bell className="w-3.5 h-3.5" />
                <span className="text-xs">{routine.reminderOffset}m before</span>
              </div>
              
              {/* Repeat info */}
              <div className="flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5" />
                <span className="text-xs">{getRepeatText()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Toggle and Arrow */}
        <div className="flex items-center gap-3">
          <Switch
            checked={routine.isEnabled}
            onCheckedChange={() => onToggle(routine.id)}
            onClick={(e) => e.stopPropagation()}
          />
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default RoutineCard;
