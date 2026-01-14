import { useState } from 'react';
import { Plus, Target, Flame } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { GoalCard } from '@/components/GoalCard';
import { GoalForm } from '@/components/GoalForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';

export const Goals = () => {
  const {
    goals,
    addGoal,
    deleteGoal,
    toggleGoalComplete,
    incrementGoalCount,
    decrementGoalCount,
    getCompletedGoalsToday,
    getTotalGoals,
  } = useGoals();

  const [showForm, setShowForm] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  const completedCount = getCompletedGoalsToday();
  const totalCount = getTotalGoals();
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (showForm) {
    return (
      <GoalForm
        onSubmit={(data) => {
          addGoal(data);
          setShowForm(false);
        }}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 pt-safe">
      {/* Header */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Goals</h1>
            <p className="text-sm text-muted-foreground">Track your daily progress</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            size="icon"
            className="w-10 h-10 rounded-xl bg-primary hover:bg-primary/90"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Progress</p>
                <p className="text-xl font-bold text-foreground">
                  {completedCount} / {totalCount}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{completionRate}%</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 h-2 bg-background/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="px-4 space-y-3">
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Flame className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No goals yet</h3>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              Create your first goal to start tracking your progress
            </p>
          </div>
        ) : (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onToggle={() => toggleGoalComplete(goal.id)}
              onIncrement={() => incrementGoalCount(goal.id)}
              onDecrement={() => decrementGoalCount(goal.id)}
              onDelete={() => setGoalToDelete(goal.id)}
            />
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!goalToDelete}
        onOpenChange={(open) => !open && setGoalToDelete(null)}
        onConfirm={() => {
          if (goalToDelete) {
            deleteGoal(goalToDelete);
            setGoalToDelete(null);
          }
        }}
        title="Delete Goal"
        description="Are you sure you want to delete this goal? This action cannot be undone."
        variant="destructive"
        confirmLabel="Delete"
      />
    </div>
  );
};
