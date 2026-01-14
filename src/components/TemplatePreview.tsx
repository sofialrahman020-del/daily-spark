import { useState } from 'react';
import { ArrowLeft, Clock, Check, Sunrise, BookOpen, Dumbbell, Brain, Briefcase } from 'lucide-react';
import { RoutineTemplate, TemplateRoutine } from '@/types/template';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TemplatePreviewProps {
  template: RoutineTemplate;
  onUse: (routines: TemplateRoutine[]) => void;
  onBack: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sunrise,
  BookOpen,
  Dumbbell,
  Brain,
  Briefcase,
};

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

const repeatLabels: Record<string, string> = {
  daily: 'Every day',
  weekdays: 'Weekdays',
  custom: 'Custom',
};

export const TemplatePreview = ({ template, onUse, onBack }: TemplatePreviewProps) => {
  const [editedRoutines, setEditedRoutines] = useState<TemplateRoutine[]>(template.routines);
  const Icon = iconMap[template.icon] || Sunrise;

  const updateTime = (index: number, newTime: string) => {
    setEditedRoutines(prev => 
      prev.map((r, i) => i === index ? { ...r, time: newTime } : r)
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-safe">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Template Preview</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Template Info */}
      <div className="p-4">
        <div 
          className="p-6 rounded-2xl border"
          style={{ 
            borderColor: `${template.color}40`,
            background: `linear-gradient(135deg, ${template.color}10 0%, transparent 100%)`
          }}
        >
          <div className="flex items-center gap-4 mb-3">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${template.color}20` }}
            >
              <Icon className="w-7 h-7" style={{ color: template.color }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{template.name}</h2>
              <p className="text-sm text-muted-foreground">{template.routines.length} routines</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{template.description}</p>
        </div>
      </div>

      {/* Routines List */}
      <div className="px-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Tap time to edit
        </h3>
        {editedRoutines.map((routine, index) => (
          <div
            key={index}
            className="p-4 rounded-xl border border-border bg-card/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{routine.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {repeatLabels[routine.repeatOption]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <input
                  type="time"
                  value={routine.time}
                  onChange={(e) => updateTime(index, e.target.value)}
                  className={cn(
                    "bg-transparent text-foreground font-medium text-right",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2 py-1",
                    "w-24"
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Use Template Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
        <Button
          onClick={() => onUse(editedRoutines)}
          className="w-full h-14 text-base font-semibold rounded-2xl bg-primary hover:bg-primary/90"
        >
          Use Template
        </Button>
      </div>
    </div>
  );
};
