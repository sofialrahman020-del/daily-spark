import React, { useState, useEffect } from 'react';
import { Clock, Bell } from 'lucide-react';
import { Routine } from '@/types/routine';
import { cn } from '@/lib/utils';

interface NextRoutineBannerProps {
  routine: Routine;
}

const NextRoutineBanner: React.FC<NextRoutineBannerProps> = ({ routine }) => {
  const [timeUntil, setTimeUntil] = useState<string>('');

  // Calculate time until routine
  useEffect(() => {
    const calculateTimeUntil = () => {
      const now = new Date();
      const [hours, minutes] = routine.time.split(':').map(Number);
      
      const routineTime = new Date();
      routineTime.setHours(hours, minutes, 0, 0);
      
      // If routine time has passed today, it's for tomorrow
      if (routineTime <= now) {
        routineTime.setDate(routineTime.getDate() + 1);
      }
      
      const diff = routineTime.getTime() - now.getTime();
      const hoursUntil = Math.floor(diff / (1000 * 60 * 60));
      const minutesUntil = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hoursUntil > 0) {
        setTimeUntil(`${hoursUntil}h ${minutesUntil}m`);
      } else {
        setTimeUntil(`${minutesUntil}m`);
      }
    };

    calculateTimeUntil();
    const interval = setInterval(calculateTimeUntil, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [routine.time]);

  // Format time for display
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="mx-4 mb-6 p-4 bg-gradient-primary rounded-2xl shadow-card animate-fade-in">
      <div className="flex items-center justify-between">
        {/* Left: Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-primary-foreground/80 text-xs font-medium uppercase tracking-wide">
              Coming up
            </p>
            <h3 className="text-primary-foreground font-semibold text-lg">
              {routine.title}
            </h3>
          </div>
        </div>

        {/* Right: Time */}
        <div className="text-right">
          <p className="text-primary-foreground font-bold text-xl font-display time-display">
            {formatTime(routine.time)}
          </p>
          <p className="text-primary-foreground/70 text-xs">
            in {timeUntil}
          </p>
        </div>
      </div>

      {/* Reminder indicator */}
      <div className="mt-3 pt-3 border-t border-primary-foreground/20 flex items-center gap-2">
        <Bell className="w-3.5 h-3.5 text-primary-foreground/70" />
        <span className="text-xs text-primary-foreground/70">
          Reminder {routine.reminderOffset} minutes before
        </span>
      </div>
    </div>
  );
};

export default NextRoutineBanner;
