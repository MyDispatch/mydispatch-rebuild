import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { V28Button } from '@/components/design-system/V28Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import officialLogo from '@/assets/mydispatch-logo-official.png';
import { SEOHead } from '@/components/shared/SEOHead';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function DriverRegister() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    acceptedTerms: false,
    acceptedPrivacy: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptedTerms || !formData.acceptedPrivacy) {
      toast({
        title: 'Zustimmung erforderlich',
        description: 'Bitte akzeptieren Sie die Nutzungsbedingungen und Datenschutzerklärung',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            role: 'driver'
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: 'Registrierung erfolgreich',
        description: 'Bitte überprüfen Sie Ihre E-Mail für den Bestätigungscode'
      });
      
      navigate('/driver/verify-email');
    } catch (error: Error | unknown) {
      toast({
        title: 'Registrierung fehlgeschlagen',
        description: error?.message || 'Bitte versuchen Sie es erneut',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Registrieren - MyDispatch Fahrer-App"
        description="Registrieren Sie sich als Fahrer bei MyDispatch"
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
          <div className="w-10" />
        </div>

        {/* Form Content */}
        <div className="px-6 py-8">
          <div className="max-w-md mx-auto space-y-6">
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Konto erstellen
              </h1>
              <p className="text-muted-foreground">
                Werden Sie Teil des MyDispatch-Teams
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground font-medium">
                    Vorname
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Max"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="pl-10 h-12 bg-background"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground font-medium">
                    Nachname
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Mustermann"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="h-12 bg-background"
                    required
                  />
                </div>
              </div>

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
                    className="pl-10 h-12 bg-background"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-medium">
                  Telefonnummer
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+49 170 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10 h-12 bg-background"
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
                    placeholder="Mindestens 8 Zeichen"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 h-12 bg-background"
                    required
                    minLength={8}
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

              {/* Terms Checkboxes */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptedTerms}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, acceptedTerms: checked as boolean })
                    }
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                    Ich akzeptiere die{' '}
                    <span className="text-primary font-medium">Nutzungsbedingungen</span>
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={formData.acceptedPrivacy}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, acceptedPrivacy: checked as boolean })
                    }
                    className="mt-1"
                  />
                  <Label htmlFor="privacy" className="text-sm text-muted-foreground cursor-pointer">
                    Ich akzeptiere die{' '}
                    <span className="text-primary font-medium">Datenschutzerklärung</span>
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <V28Button
                type="submit"
                disabled={isLoading}
                variant="primary"
                size="lg"
                className="w-full mt-6"
              >
                {isLoading ? 'Wird registriert...' : 'Registrieren'}
              </V28Button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-muted-foreground">
                Bereits registriert?{' '}
                <button
                  onClick={() => navigate('/driver/login')}
                  className="text-primary hover:text-primary/80 font-semibold"
                >
                  Jetzt anmelden
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
