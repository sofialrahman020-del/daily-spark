import { CalendarCheck, Target, LayoutTemplate, User } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabId = 'routine' | 'goals' | 'templates' | 'profile';

interface BottomNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs = [
  { id: 'routine' as TabId, label: 'Routine', icon: CalendarCheck },
  { id: 'goals' as TabId, label: 'Goals', icon: Target },
  { id: 'templates' as TabId, label: 'Templates', icon: LayoutTemplate },
  { id: 'profile' as TabId, label: 'Profile', icon: User },
];

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full py-2 transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "relative p-1.5 rounded-xl transition-all duration-200",
                isActive && "bg-primary/10"
              )}>
                <Icon 
                  className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive && "scale-110"
                  )} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium mt-1 transition-all",
                isActive && "font-semibold"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
