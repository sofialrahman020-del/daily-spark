import { Sunrise, BookOpen, Dumbbell, Brain, Briefcase } from 'lucide-react';
import { RoutineTemplate } from '@/types/template';
import { cn } from '@/lib/utils';

interface TemplateCardProps {
  template: RoutineTemplate;
  onSelect: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sunrise,
  BookOpen,
  Dumbbell,
  Brain,
  Briefcase,
};

export const TemplateCard = ({ template, onSelect }: TemplateCardProps) => {
  const Icon = iconMap[template.icon] || Sunrise;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full p-4 rounded-2xl border border-border bg-card/50 backdrop-blur-sm",
        "hover:border-primary/30 hover:bg-card/80 transition-all duration-200",
        "text-left group"
      )}
    >
      <div className="flex items-start gap-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${template.color}20` }}
        >
          <Icon 
            className="w-6 h-6" 
            style={{ color: template.color }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {template.description}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            {template.routines.length} routines
          </p>
        </div>
      </div>
    </button>
  );
};
