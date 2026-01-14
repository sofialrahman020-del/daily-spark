import { useState } from 'react';
import { LayoutTemplate } from 'lucide-react';
import { ROUTINE_TEMPLATES, RoutineTemplate, TemplateRoutine } from '@/types/template';
import { TemplateCard } from '@/components/TemplateCard';
import { TemplatePreview } from '@/components/TemplatePreview';
import { useToast } from '@/hooks/use-toast';

interface TemplatesProps {
  onApplyTemplate: (routines: TemplateRoutine[]) => void;
}

export const Templates = ({ onApplyTemplate }: TemplatesProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<RoutineTemplate | null>(null);
  const { toast } = useToast();

  const handleUseTemplate = (routines: TemplateRoutine[]) => {
    onApplyTemplate(routines);
    setSelectedTemplate(null);
    toast({
      title: "Template Applied",
      description: `${routines.length} routines added to your list`,
    });
  };

  if (selectedTemplate) {
    return (
      <TemplatePreview
        template={selectedTemplate}
        onUse={handleUseTemplate}
        onBack={() => setSelectedTemplate(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 pt-safe">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <LayoutTemplate className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Templates</h1>
            <p className="text-sm text-muted-foreground">Quick-start your routine</p>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="px-4 space-y-3">
        {ROUTINE_TEMPLATES.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={() => setSelectedTemplate(template)}
          />
        ))}
      </div>
    </div>
  );
};
