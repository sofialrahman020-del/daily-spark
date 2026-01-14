import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import RoutineCard from '@/components/RoutineCard';
import EmptyState from '@/components/EmptyState';
import NextRoutineBanner from '@/components/NextRoutineBanner';
import RoutineForm from '@/components/RoutineForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useRoutines } from '@/hooks/useRoutines';
import { useTheme } from '@/hooks/useTheme';
import { Routine, RoutineFormData } from '@/types/routine';
import { toast } from 'sonner';

type View = 'list' | 'add' | 'edit';

const Index: React.FC = () => {
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
    getRoutine,
    getTodaysRoutines,
    getNextRoutine,
  } = useRoutines();

  // Initialize theme
  useTheme();

  const todaysRoutines = getTodaysRoutines();
  const nextRoutine = getNextRoutine();

  const handleAddClick = () => {
    setEditingRoutine(null);
    setView('add');
  };

  const handleEditClick = (routine: Routine) => {
    setEditingRoutine(routine);
    setView('edit');
  };

  const handleSave = (data: RoutineFormData) => {
    if (editingRoutine) {
      updateRoutine(editingRoutine.id, data);
      toast.success('Routine updated');
    } else {
      addRoutine(data);
      toast.success('Routine created');
    }
    setView('list');
    setEditingRoutine(null);
  };

  const handleDelete = () => {
    if (editingRoutine) {
      deleteRoutine(editingRoutine.id);
      toast.success('Routine deleted');
      setView('list');
      setEditingRoutine(null);
    }
    setDeleteConfirmOpen(false);
  };

  const handleBack = () => {
    setView('list');
    setEditingRoutine(null);
  };

  // Show form view
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
              </h2>
            </div>

            {/* Routine List */}
            <div className="px-4 space-y-3">
              {todaysRoutines.length > 0 ? (
                todaysRoutines.map((routine) => (
                  <RoutineCard
                    key={routine.id}
                    routine={routine}
                    onToggle={toggleRoutine}
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
                        onToggle={toggleRoutine}
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
        <div className="fixed bottom-6 right-4 safe-bottom">
          <Button
            variant="fab"
            size="fab"
            onClick={handleAddClick}
            className="shadow-elevated"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
