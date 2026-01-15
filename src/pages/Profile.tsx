import { useState, useRef } from 'react';
import { User, Bell, Volume2, Vibrate, Moon, Sun, Shield, Flame, Trophy, CheckCircle, Pencil, Camera, Mail, LogIn } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTheme } from '@/hooks/useTheme';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ALARM_SOUNDS } from '@/types/profile';
import { ReminderOffset } from '@/types/routine';
import { cn } from '@/lib/utils';

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

      {/* Login Section */}
      <div className="px-4 mb-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Account</h2>
        <div className="p-4 rounded-xl bg-card/50 border border-border space-y-3">
          <p className="text-sm text-muted-foreground">
            Sign in to sync your data across devices
          </p>
          
          {/* Email Login */}
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3"
            onClick={() => {/* TODO: Implement email login */}}
          >
            <Mail className="w-5 h-5" />
            Continue with Email
          </Button>
          
          {/* Google Login */}
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3"
            onClick={() => {/* TODO: Implement Google login */}}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
          
          {/* Facebook Login */}
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3"
            onClick={() => {/* TODO: Implement Facebook login */}}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </Button>
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
