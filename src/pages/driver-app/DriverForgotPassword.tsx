import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { V28Button } from '@/components/design-system/V28Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail } from 'lucide-react';
import officialLogo from '@/assets/mydispatch-logo-official.png';
import { SEOHead } from '@/components/shared/SEOHead';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function DriverForgotPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/driver/reset-password`
      });

      if (error) throw error;
      
      toast({
        title: 'E-Mail versendet',
        description: 'Bitte überprüfen Sie Ihr Postfach für weitere Anweisungen'
      });
      
      // Don't navigate automatically - user should click link in email
    } catch (error: Error | unknown) {
      toast({
        title: 'Fehler',
        description: error?.message || 'E-Mail konnte nicht versendet werden',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Passwort vergessen - MyDispatch Fahrer-App"
        description="Setzen Sie Ihr Passwort zurück"
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <V28Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/driver/login')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </V28Button>
          <img 
            src={officialLogo} 
            alt="MyDispatch Logo" 
            className="h-10 w-auto object-contain"
          />
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <div className="max-w-md mx-auto space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                <Mail className="h-10 w-10 text-foreground" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Passwort vergessen?
              </h1>
              <p className="text-muted-foreground">
                Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-background"
                    required
                  />
                </div>
              </div>

              <V28Button
                type="submit"
                disabled={isLoading}
                variant="primary"
                size="lg"
                className="w-full mt-6"
              >
                {isLoading ? 'Wird gesendet...' : 'Link senden'}
              </V28Button>
            </form>

            {/* Back to Login */}
            <div className="text-center pt-4">
              <button
                onClick={() => navigate('/driver/login')}
                className="text-primary hover:text-primary/80"
              >
                Zurück zur Anmeldung
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
