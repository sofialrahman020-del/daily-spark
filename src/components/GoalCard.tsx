import { Check, Minus, Plus, Flame, Trash2 } from 'lucide-react';
import { Goal } from '@/types/goal';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface GoalCardProps {
  goal: Goal;
  onToggle: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onDelete: () => void;
}

export const GoalCard = ({ 
  goal, 
  onToggle, 
  onIncrement, 
  onDecrement,
  onDelete 
}: GoalCardProps) => {
  const progress = goal.type === 'count' && goal.targetCount 
    ? (goal.currentCount / goal.targetCount) * 100 
    : goal.isCompleted ? 100 : 0;

  return (
    <div className={cn(
      "relative p-4 rounded-2xl border transition-all duration-300",
      "bg-card/50 backdrop-blur-sm",
      goal.isCompleted 
        ? "border-primary/30 bg-primary/5" 
        : "border-border hover:border-primary/20"
    )}>
      <div className="flex items-start gap-3">
        {/* Checkbox / Counter */}
        {goal.type === 'checkbox' ? (
          <button
            onClick={onToggle}
            className={cn(
              "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200",
              goal.isCompleted
                ? "bg-primary border-primary text-primary-foreground"
                : "border-muted-foreground/30 hover:border-primary/50"
            )}
          >
            {goal.isCompleted && <Check className="w-4 h-4" />}
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={onDecrement}
              disabled={goal.currentCount === 0}
              className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-12 text-center text-sm font-semibold text-foreground">
              {goal.currentCount}/{goal.targetCount}
            </span>
            <button
              onClick={onIncrement}
              disabled={goal.currentCount >= (goal.targetCount || 999)}
              className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 disabled:opacity-30 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Goal Info */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold text-sm transition-all",
            goal.isCompleted ? "text-muted-foreground line-through" : "text-foreground"
          )}>
            {goal.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground capitalize">
              {goal.frequency}
            </span>
            {goal.streak > 0 && (
              <div className="flex items-center gap-0.5 text-xs text-orange-500">
                <Flame className="w-3 h-3" />
                <span>{goal.streak}</span>
              </div>
            )}
          </div>
        </div>

        {/* Delete button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="w-8 h-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress bar for count goals */}
      {goal.type === 'count' && (
        <div className="mt-3 h-1.5 bg-muted/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
