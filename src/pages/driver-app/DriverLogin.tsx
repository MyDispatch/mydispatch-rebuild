import officialLogo from '@/assets/mydispatch-logo-official.png';
import { V28Button } from '@/components/design-system/V28Button';
import { SEOHead } from '@/components/shared/SEOHead';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DriverLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) throw error;

      toast({
        title: 'Anmeldung erfolgreich',
        description: 'Willkommen zurück!'
      });

      navigate('/driver/dashboard');
    } catch (error: Error | unknown) {
      toast({
        title: 'Anmeldung fehlgeschlagen',
        description: error?.message || 'Bitte überprüfen Sie Ihre Zugangsdaten',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Anmelden - MyDispatch Fahrer-App"
        description="Melden Sie sich in der MyDispatch Fahrer-App an"
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <V28Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/driver/welcome')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </V28Button>
          <img
            src={officialLogo}
            alt="MyDispatch Logo"
            className="h-10 w-auto object-contain"
          />
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Form Content */}
        <div className="px-6 py-8">
          <div className="max-w-md mx-auto space-y-6">
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Willkommen zurück
              </h1>
              <p className="text-muted-foreground">
                Melden Sie sich an, um fortzufahren
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  E-Mail-Adresse
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ihre@email.de"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-12 bg-background border-border"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Passwort
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 h-12 bg-background border-border"
                    required
                  />
                  <V28Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </V28Button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate('/driver/forgot-password')}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Passwort vergessen?
                </button>
              </div>

              {/* Submit Button */}
              <V28Button
                type="submit"
                disabled={isLoading}
                variant="primary"
                size="lg"
                className="w-full mt-6"
              >
                {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
              </V28Button>
            </form>

            {/* Register Link */}
            <div className="text-center pt-4">
              <p className="text-muted-foreground">
                Noch kein Konto?{' '}
                <button
                  onClick={() => navigate('/driver/register')}
                  className="text-primary hover:text-primary/80 font-semibold"
                >
                  Jetzt registrieren
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 375 150" fill="none" className="w-full">
            <path
              d="M0 80 Q 93.75 40, 187.5 80 T 375 80 V 150 H 0 Z"
              fill="hsl(var(--primary))"
              opacity="0.1"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
