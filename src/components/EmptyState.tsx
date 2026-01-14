import React from 'react';
import { Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddClick }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      {/* Icon with pulse ring effect */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-ring" />
        <div className="relative w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-card">
          <Clock className="w-10 h-10 text-primary-foreground" />
        </div>
      </div>

      {/* Text */}
      <h2 className="text-xl font-semibold text-foreground mb-2 font-display">
        No routines yet
      </h2>
      <p className="text-muted-foreground text-sm max-w-[240px] mb-8">
        Create your first daily routine and never miss an important task again
      </p>

      {/* CTA Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={onAddClick}
        className="gap-2"
      >
        <Plus className="w-5 h-5" />
        Create First Routine
      </Button>
    </div>
  );
};

export default EmptyState;
