import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.44239165779b49c6b7ae11f932d9d83f',
  appName: 'Daily Routine Reminder',
  webDir: 'dist',
  server: {
    url: 'https://44239165-779b-49c6-b7ae-11f932d9d83f.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#2dd4bf',
      sound: 'alarm.wav',
    },
  },
};

export default config;
