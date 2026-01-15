import { useState } from 'react';
import { User, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LoginProps {
  onLogin: (name: string, method: 'guest' | 'email' | 'google' | 'facebook') => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [guestName, setGuestName] = useState('');

  const handleGuestLogin = () => {
    if (guestName.trim()) {
      onLogin(guestName.trim(), 'guest');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 safe-top safe-bottom">
      {/* Logo/Title */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-10 h-10 text-primary-foreground" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-foreground font-display mb-2">
          Daily Routine
        </h1>
        <p className="text-muted-foreground">
          Build better habits, one routine at a time
        </p>
      </div>

      {/* Login Options */}
      <div className="w-full max-w-sm space-y-4">
        {/* Guest Login */}
        {showGuestInput ? (
          <div className="space-y-3 animate-scale-in">
            <Input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter your name"
              className="h-14 text-base text-center"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleGuestLogin()}
            />
            <Button
              onClick={handleGuestLogin}
              disabled={!guestName.trim()}
              className="w-full h-14 text-base gap-2"
              variant="primary"
            >
              Continue as Guest
              <ArrowRight className="w-5 h-5" />
            </Button>
            <button
              onClick={() => setShowGuestInput(false)}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to login options
            </button>
          </div>
        ) : (
          <>
            {/* Guest Button */}
            <Button
              onClick={() => setShowGuestInput(true)}
              variant="outline"
              className="w-full h-14 text-base justify-start gap-4 border-2"
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              Continue as Guest
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-muted-foreground">
                  or sign in with
                </span>
              </div>
            </div>

            {/* Email Login */}
            <Button
              onClick={() => onLogin('User', 'email')}
              variant="outline"
              className="w-full h-14 text-base justify-start gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              Continue with Email
            </Button>

            {/* Google Login */}
            <Button
              onClick={() => onLogin('User', 'google')}
              variant="outline"
              className="w-full h-14 text-base justify-start gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              Continue with Google
            </Button>

            {/* Facebook Login */}
            <Button
              onClick={() => onLogin('User', 'facebook')}
              variant="outline"
              className="w-full h-14 text-base justify-start gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              Continue with Facebook
            </Button>
          </>
        )}
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground text-center mt-12 max-w-xs">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};
