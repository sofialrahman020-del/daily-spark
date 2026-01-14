import React from 'react';
import { Sun, Moon, Settings } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  const { isDark, toggleTheme } = useTheme();

  // Get greeting based on time of day
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get current date formatted
  const getDateString = (): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <header className="px-4 pt-4 pb-6">
      <div className="flex items-start justify-between">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            {getGreeting()}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {getDateString()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-muted transition-colors haptic"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {/* Settings */}
          {onSettingsClick && (
            <button
              onClick={onSettingsClick}
              className="p-2.5 rounded-xl hover:bg-muted transition-colors haptic"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
