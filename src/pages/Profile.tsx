import { useState, useRef } from 'react';
import { User, Bell, Volume2, Vibrate, Moon, Sun, Shield, Flame, Trophy, CheckCircle, Pencil, Camera, Mail, LogOut } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTheme } from '@/hooks/useTheme';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ALARM_SOUNDS } from '@/types/profile';
import { ReminderOffset } from '@/types/routine';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const Profile = () => {
  const { profile, stats, updateProfile } = useUserProfile();
  const { theme, setTheme } = useTheme();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [tempEmail, setTempEmail] = useState(profile.email || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reminderOptions: { value: ReminderOffset; label: string }[] = [
    { value: 0, label: 'No Alarm' },
    { value: 5, label: '5 min' },
    { value: 10, label: '10 min' },
    { value: 15, label: '15 min' },
  ];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoUrl = event.target?.result as string;
        updateProfile({ photoUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      updateProfile({ name: tempName.trim() });
    }
    setIsEditingName(false);
  };

  const handleSaveEmail = () => {
    updateProfile({ email: tempEmail.trim() });
    setIsEditingEmail(false);
  };

  const handleLogout = () => {
    updateProfile({ 
      isLoggedIn: false, 
      loginMethod: null,
      name: 'User',
      email: '',
      photoUrl: null 
    });
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-safe overflow-y-auto">
      {/* Header */}
      <div className="p-4">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your settings</p>
      </div>

      {/* User Info */}
      <div className="px-4 mb-6">
        <div className="p-4 rounded-2xl bg-card/50 border border-border">
          <div className="flex items-center gap-4">
            {/* Profile Photo */}
            <div className="relative">
              <div 
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {profile.photoUrl ? (
                  <img 
                    src={profile.photoUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-primary-foreground" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
              >
                <Camera className="w-3 h-3 text-primary-foreground" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            {/* Name and Email */}
            <div className="flex-1 space-y-2">
              {/* Name */}
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Your name"
                      className="h-8 text-base"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    />
                    <Button size="sm" onClick={handleSaveName}>Save</Button>
                  </div>
                ) : (
                  <>
                    <span className="text-lg font-semibold text-foreground">{profile.name}</span>
                    <button
                      onClick={() => {
                        setTempName(profile.name);
                        setIsEditingName(true);
                      }}
                      className="p-1 rounded-md hover:bg-muted transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </>
                )}
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                {isEditingEmail ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      placeholder="your@email.com"
                      type="email"
                      className="h-8 text-sm"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEmail()}
                    />
                    <Button size="sm" onClick={handleSaveEmail}>Save</Button>
                  </div>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {profile.email || 'Add email'}
                    </span>
                    <button
                      onClick={() => {
                        setTempEmail(profile.email || '');
                        setIsEditingEmail(true);
                      }}
                      className="p-1 rounded-md hover:bg-muted transition-colors"
                    >
                      <Pencil className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="px-4 mb-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Account</h2>
        <div className="p-4 rounded-xl bg-card/50 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">
                {profile.loginMethod === 'guest' ? 'Guest Account' : 
                 profile.loginMethod === 'email' ? 'Email Account' :
                 profile.loginMethod === 'google' ? 'Google Account' :
                 profile.loginMethod === 'facebook' ? 'Facebook Account' : 'Account'}
              </p>
              <p className="text-sm text-muted-foreground">
                Logged in as {profile.name}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
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
          <div className="grid grid-cols-4 gap-2">
            {reminderOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateProfile({ defaultReminderOffset: option.value })}
                className={cn(
                  "py-2 px-2 rounded-lg text-xs font-medium transition-all",
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
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 mb-8">
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
