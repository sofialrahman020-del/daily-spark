import { User, Bell, Volume2, Vibrate, Moon, Sun, Shield, Flame, Trophy, CheckCircle } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTheme } from '@/hooks/useTheme';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { ALARM_SOUNDS, UserProfile } from '@/types/profile';
import { ReminderOffset } from '@/types/routine';
import { cn } from '@/lib/utils';

export const Profile = () => {
  const { profile, stats, updateProfile } = useUserProfile();
  const { theme, setTheme } = useTheme();

  const reminderOptions: { value: ReminderOffset; label: string }[] = [
    { value: 5, label: '5 min' },
    { value: 10, label: '10 min' },
    { value: 15, label: '15 min' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 pt-safe">
      {/* Header */}
      <div className="p-4">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your settings</p>
      </div>

      {/* User Info */}
      <div className="px-4 mb-6">
        <div className="p-4 rounded-2xl bg-card/50 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <Input
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="Your name"
                className="text-lg font-semibold bg-transparent border-none p-0 h-auto focus-visible:ring-0 text-foreground"
              />
              <p className="text-sm text-muted-foreground">Tap to edit name</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mb-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Your Stats</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-card/50 border border-border text-center">
            <CheckCircle className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.totalRoutinesCompleted}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="p-4 rounded-xl bg-card/50 border border-border text-center">
            <Flame className="w-5 h-5 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Current Streak</p>
          </div>
          <div className="p-4 rounded-xl bg-card/50 border border-border text-center">
            <Trophy className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.bestStreak}</p>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="px-4 space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground">Settings</h2>

        {/* Default Reminder */}
        <div className="p-4 rounded-xl bg-card/50 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Default Reminder</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {reminderOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateProfile({ defaultReminderOffset: option.value })}
                className={cn(
                  "py-2 px-3 rounded-lg text-sm font-medium transition-all",
                  profile.defaultReminderOffset === option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Alarm Sound */}
        <div className="p-4 rounded-xl bg-card/50 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Alarm Sound</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ALARM_SOUNDS.map((sound) => (
              <button
                key={sound.id}
                onClick={() => updateProfile({ alarmSound: sound.id })}
                className={cn(
                  "py-2 px-3 rounded-lg text-sm font-medium transition-all text-left",
                  profile.alarmSound === sound.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {sound.name}
              </button>
            ))}
          </div>
        </div>

        {/* Vibration Toggle */}
        <div className="p-4 rounded-xl bg-card/50 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Vibrate className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">Vibration</span>
            </div>
            <Switch
              checked={profile.vibrationEnabled}
              onCheckedChange={(checked) => updateProfile({ vibrationEnabled: checked })}
            />
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="p-4 rounded-xl bg-card/50 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="font-medium text-foreground">Dark Mode</span>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </div>

        {/* Battery Optimization Warning (Android) */}
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground mb-1">Battery Optimization</h3>
              <p className="text-sm text-muted-foreground">
                For reliable alarms on Android, disable battery optimization for this app in your device settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
