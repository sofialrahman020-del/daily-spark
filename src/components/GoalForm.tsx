import { useState } from 'react';
import { ArrowLeft, CheckSquare, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoalFormData, GoalType, GoalFrequency } from '@/types/goal';
import { cn } from '@/lib/utils';

interface GoalFormProps {
  onSubmit: (data: GoalFormData) => void;
  onCancel: () => void;
}

export const GoalForm = ({ onSubmit, onCancel }: GoalFormProps) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<GoalType>('checkbox');
  const [frequency, setFrequency] = useState<GoalFrequency>('daily');
  const [targetCount, setTargetCount] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      type,
      frequency,
      targetCount: type === 'count' ? targetCount : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-background pt-safe">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">New Goal</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Goal Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Drink 8 glasses of water"
            className="h-12 bg-card/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
            autoFocus
          />
        </div>

        {/* Goal Type */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">
            Goal Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('checkbox')}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                type === 'checkbox'
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card/50 hover:border-primary/30"
              )}
            >
              <CheckSquare className={cn(
                "w-6 h-6",
                type === 'checkbox' ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-sm font-medium",
                type === 'checkbox' ? "text-primary" : "text-foreground"
              )}>
                Checkbox
              </span>
              <span className="text-xs text-muted-foreground text-center">
                Complete or not
              </span>
            </button>
            <button
              type="button"
              onClick={() => setType('count')}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                type === 'count'
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card/50 hover:border-primary/30"
              )}
            >
              <Hash className={cn(
                "w-6 h-6",
                type === 'count' ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-sm font-medium",
                type === 'count' ? "text-primary" : "text-foreground"
              )}>
                Count-based
              </span>
              <span className="text-xs text-muted-foreground text-center">
                Track progress
              </span>
            </button>
          </div>
        </div>

        {/* Target Count (only for count type) */}
        {type === 'count' && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              Target Count
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setTargetCount(Math.max(1, targetCount - 1))}
                className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-foreground hover:bg-muted transition-colors text-xl font-medium"
              >
                −
              </button>
              <span className="text-3xl font-bold text-foreground w-16 text-center">
                {targetCount}
              </span>
              <button
                type="button"
                onClick={() => setTargetCount(targetCount + 1)}
                className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors text-xl font-medium"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Frequency */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">
            Frequency
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFrequency('daily')}
              className={cn(
                "p-4 rounded-xl border-2 transition-all text-center",
                frequency === 'daily'
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card/50 hover:border-primary/30"
              )}
            >
              <span className={cn(
                "font-medium",
                frequency === 'daily' ? "text-primary" : "text-foreground"
              )}>
                Daily
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                Resets every day
              </p>
            </button>
            <button
              type="button"
              onClick={() => setFrequency('weekly')}
              className={cn(
                "p-4 rounded-xl border-2 transition-all text-center",
                frequency === 'weekly'
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card/50 hover:border-primary/30"
              )}
            >
              <span className={cn(
                "font-medium",
                frequency === 'weekly' ? "text-primary" : "text-foreground"
              )}>
                Weekly
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                Resets every week
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
        <Button
          type="submit"
          disabled={!title.trim()}
          className="w-full h-14 text-base font-semibold rounded-2xl bg-primary hover:bg-primary/90"
        >
          Create Goal
        </Button>
      </div>
    </form>
  );
};
