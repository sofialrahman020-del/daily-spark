import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TimePickerWheelProps {
  value: string; // HH:MM format
  onChange: (value: string) => void;
}

const TimePickerWheel: React.FC<TimePickerWheelProps> = ({ value, onChange }) => {
  const [hours, setHours] = useState(() => {
    const h = parseInt(value.split(':')[0], 10);
    return h % 12 || 12;
  });
  const [minutes, setMinutes] = useState(() => parseInt(value.split(':')[1], 10));
  const [period, setPeriod] = useState<'AM' | 'PM'>(() => {
    const h = parseInt(value.split(':')[0], 10);
    return h >= 12 ? 'PM' : 'AM';
  });

  // Update parent when values change
  useEffect(() => {
    let h = hours;
    if (period === 'PM' && hours !== 12) h += 12;
    if (period === 'AM' && hours === 12) h = 0;
    const timeString = `${h.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    onChange(timeString);
  }, [hours, minutes, period, onChange]);

  const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {/* Hours */}
      <div className="flex flex-col items-center">
        <label className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Hour</label>
        <select
          value={hours}
          onChange={(e) => setHours(parseInt(e.target.value, 10))}
          className="bg-secondary text-foreground text-4xl font-display font-bold text-center appearance-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer time-display"
        >
          {hourOptions.map((h) => (
            <option key={h} value={h}>
              {h.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
      </div>

      {/* Separator */}
      <span className="text-4xl font-display font-bold text-foreground mt-6">:</span>

      {/* Minutes */}
      <div className="flex flex-col items-center">
        <label className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Min</label>
        <select
          value={minutes}
          onChange={(e) => setMinutes(parseInt(e.target.value, 10))}
          className="bg-secondary text-foreground text-4xl font-display font-bold text-center appearance-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer time-display"
        >
          {minuteOptions.map((m) => (
            <option key={m} value={m}>
              {m.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
      </div>

      {/* AM/PM */}
      <div className="flex flex-col items-center ml-2">
        <label className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Period</label>
        <div className="flex flex-col gap-1">
          {(['AM', 'PM'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 haptic",
                period === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-muted"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimePickerWheel;
