import React, { useState, useCallback } from 'react';
import { Plus, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import RoutineCard from '@/components/RoutineCard';
import EmptyState from '@/components/EmptyState';
import NextRoutineBanner from '@/components/NextRoutineBanner';
import RoutineForm from '@/components/RoutineForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useRoutines } from '@/hooks/useRoutines';
import { useTheme } from '@/hooks/useTheme';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { Routine, RoutineFormData } from '@/types/routine';
import { TemplateRoutine } from '@/types/template';
import { LoginMethod } from '@/types/profile';
import { toast } from 'sonner';
import { Goals } from './Goals';
import { Templates } from './Templates';
import { Profile } from './Profile';
import { Login } from './Login';
import { Plans } from './Plans';

type View = 'list' | 'add' | 'edit' | 'plans';
type TabId = 'routine' | 'goals' | 'templates' | 'profile';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('routine');
  const [view, setView] = useState<View>('list');
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const {
    routines,
    isLoading,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    toggleRoutine,
    getTodaysRoutines,
    getNextRoutine,
  } = useRoutines();

  const { profile, incrementRoutinesCompleted, updateProfile } = useUserProfile();
  const { canAddRoutine, getRemainingRoutines, isPremium, limits } = useSubscription();

  // Initialize theme
  useTheme();

  const todaysRoutines = getTodaysRoutines();
  const nextRoutine = getNextRoutine();

  // Handle login - defined before early return
  const handleLogin = useCallback((name: string, method: LoginMethod) => {
    updateProfile({
      name,
      isLoggedIn: true,
      loginMethod: method,
    });
    toast.success(`Welcome, ${name}!`);
  }, [updateProfile]);

  const handleNavigateToPlans = useCallback(() => {
    setView('plans');
  }, []);

  const handleAddClick = useCallback(() => {
    if (!canAddRoutine(routines.length)) {
      toast.error(`Upgrade to Premium for unlimited routines! (${limits.routines} max on Free plan)`);
      handleNavigateToPlans();
      return;
    }
    setEditingRoutine(null);
    setView('add');
  }, [canAddRoutine, routines.length, limits.routines, handleNavigateToPlans]);

  const handleEditClick = useCallback((routine: Routine) => {
    setEditingRoutine(routine);
    setView('edit');
  }, []);

  const handleSave = useCallback((data: RoutineFormData) => {
    if (editingRoutine) {
      updateRoutine(editingRoutine.id, data);
      toast.success('Routine updated');
    } else {
      addRoutine(data);
      toast.success('Routine created');
    }
    setView('list');
    setEditingRoutine(null);
  }, [editingRoutine, updateRoutine, addRoutine]);

  const handleDelete = useCallback(() => {
    if (editingRoutine) {
      deleteRoutine(editingRoutine.id);
      toast.success('Routine deleted');
      setView('list');
      setEditingRoutine(null);
    }
    setDeleteConfirmOpen(false);
  }, [editingRoutine, deleteRoutine]);

  const handleBack = useCallback(() => {
    setView('list');
    setEditingRoutine(null);
  }, []);

  const handleToggle = useCallback((id: string) => {
    const routine = routines.find(r => r.id === id);
    if (routine && routine.isEnabled) {
      incrementRoutinesCompleted();
    }
    toggleRoutine(id);
  }, [routines, toggleRoutine, incrementRoutinesCompleted]);

  const handleApplyTemplate = useCallback((templateRoutines: TemplateRoutine[]) => {
    templateRoutines.forEach((routine) => {
      addRoutine({
        title: routine.title,
        time: routine.time,
        reminderOffset: routine.reminderOffset,
        repeatOption: routine.repeatOption,
        customDays: routine.customDays,
      });
    });
    setActiveTab('routine');
  }, [addRoutine]);

  // Show login screen if not logged in
  if (!profile.isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }


  // Show plans page
  if (view === 'plans') {
    return <Plans onBack={() => setView('list')} />;
  }

  // Render different tabs
  if (activeTab === 'goals') {
    return (
      <>
        <Goals onNavigateToPlans={handleNavigateToPlans} />
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </>
    );
  }

  if (activeTab === 'templates') {
    return (
      <>
        <Templates onApplyTemplate={handleApplyTemplate} />
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </>
    );
  }

  if (activeTab === 'profile') {
    return (
      <>
        <Profile onNavigateToPlans={handleNavigateToPlans} />
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </>
    );
  }

  // Show form view for routine tab
  if (view === 'add' || view === 'edit') {
    return (
      <>
        <RoutineForm
          routine={editingRoutine || undefined}
          onSave={handleSave}
          onDelete={() => setDeleteConfirmOpen(true)}
          onBack={handleBack}
        />
        <ConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          title="Delete Routine"
          description={`Are you sure you want to delete "${editingRoutine?.title}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          variant="destructive"
        />
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </>
    );
  }

  // Show list view
  return (
    <div className="min-h-screen bg-background flex flex-col safe-top safe-bottom">
      {/* Header */}
      <Header />

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : routines.length === 0 ? (
          <EmptyState onAddClick={handleAddClick} />
        ) : (
          <>
            {/* Next Routine Banner */}
            {nextRoutine && <NextRoutineBanner routine={nextRoutine} />}

            {/* Section Header */}
            <div className="px-4 mb-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Today's Routines ({todaysRoutines.length})
                {!isPremium && (
                  <span className="ml-2 text-xs normal-case">
                    • {getRemainingRoutines(routines.length)} remaining
                  </span>
                )}
              </h2>
            </div>

            {/* Routine List */}
            <div className="px-4 space-y-3">
              {todaysRoutines.length > 0 ? (
                todaysRoutines.map((routine) => (
                  <RoutineCard
                    key={routine.id}
                    routine={routine}
                    onToggle={handleToggle}
                    onClick={handleEditClick}
                    isNext={nextRoutine?.id === routine.id}
                  />
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground text-sm">
                    No routines scheduled for today
                  </p>
                </div>
              )}
            </div>

            {/* All Routines Section */}
            {routines.length > todaysRoutines.length && (
              <div className="px-4 mt-8">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                  All Routines ({routines.length})
                </h2>
                <div className="space-y-3">
                  {routines
                    .filter((r) => !todaysRoutines.find((t) => t.id === r.id))
                    .map((routine) => (
                      <RoutineCard
                        key={routine.id}
                        routine={routine}
                        onToggle={handleToggle}
                        onClick={handleEditClick}
                      />
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* FAB */}
      {routines.length > 0 && (
        <div className="fixed bottom-20 right-4 safe-bottom">
          <Button
            variant="fab"
            size="fab"
            onClick={handleAddClick}
            className="shadow-elevated"
            disabled={!isPremium && getRemainingRoutines(routines.length) === 0}
          >
            {!isPremium && getRemainingRoutines(routines.length) === 0 ? (
              <Lock className="w-6 h-6" />
            ) : (
              <Plus className="w-6 h-6" />
            )}
          </Button>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
