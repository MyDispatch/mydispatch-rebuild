/* ==================================================================================
   RESET-PASSWORD.TSX - V33.4 PASSWORD RESET COMPLETION PAGE
   ==================================================================================
   Completion page for password reset flow initiated via Auth.tsx

   Flow:
   1. User enters email in Auth.tsx (Forgot Password)
   2. Supabase sends email with magic link → /auth/reset-password?token=...
   3. This page validates token & allows new password entry
   4. Success → Redirect to dashboard with auto-login
   ================================================================================== */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { V28Card, V28CardHeader, V28CardTitle, V28CardDescription, V28CardContent } from '@/components/design-system/V28Card';
import { V28Button } from '@/components/design-system/V28Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { AuthPageLayout } from '@/components/layout/AuthPageLayout';
import { SEOHead } from '@/components/shared/SEOHead';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

// Password validation schema (same as Auth.tsx)
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
      .regex(/[A-Z]/, 'Passwort muss mindestens einen Großbuchstaben enthalten')
      .regex(/[a-z]/, 'Passwort muss mindestens einen Kleinbuchstaben enthalten')
      .regex(/[0-9]/, 'Passwort muss mindestens eine Ziffer enthalten')
      .regex(/[^A-Za-z0-9]/, 'Passwort muss mindestens ein Sonderzeichen enthalten'),
    password_confirm: z.string(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: 'Passwörter stimmen nicht überein',
    path: ['password_confirm'],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      password_confirm: '',
    },
  });

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        // Supabase automatically handles token validation via URL params
        // If user lands here from email link, session is auto-established
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          setTokenValid(false);
          toast({
            title: 'Ungültiger Link',
            description: 'Der Password-Reset-Link ist ungültig oder abgelaufen.',
            variant: 'destructive',
          });
        } else {
          setTokenValid(true);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setTokenValid(false);
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      toast({
        title: 'Passwort aktualisiert',
        description: 'Ihr Passwort wurde erfolgreich geändert. Sie werden weitergeleitet...',
      });

      // Wait 2 seconds, then redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: 'Fehler',
        description: error?.message || 'Passwort konnte nicht aktualisiert werden.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <AuthPageLayout>
        <SEOHead
          title="Passwort zurücksetzen | MyDispatch"
          description="Setzen Sie Ihr MyDispatch-Passwort zurück"
          canonical="/auth/reset-password"
        />
        <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner />
            <p className="text-muted-foreground">Link wird überprüft...</p>
          </div>
        </div>
      </AuthPageLayout>
    );
  }

  if (!tokenValid) {
    return (
      <AuthPageLayout>
        <SEOHead
          title="Ungültiger Link | MyDispatch"
          description="Passwort-Reset-Link ungültig"
          canonical="/auth/reset-password"
        />
        <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <V28Card className="w-full max-w-md">
            <V28CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
              <V28CardTitle>Ungültiger Link</V28CardTitle>
              <V28CardDescription>
                Der Password-Reset-Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Link an.
              </V28CardDescription>
            </V28CardHeader>
            <V28CardContent>
              <V28Button onClick={() => navigate('/auth')} className="w-full">
                Zurück zur Anmeldung
              </V28Button>
            </V28CardContent>
          </V28Card>
        </div>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout>
      <SEOHead
        title="Neues Passwort setzen | MyDispatch"
        description="Setzen Sie ein neues Passwort für Ihren MyDispatch-Account"
        canonical="/auth/reset-password"
      />

      <div className="min-h-[calc(100vh-160px)] flex items-start sm:items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
        <V28Card className="w-full max-w-md">
          <V28CardHeader>
            <V28CardTitle>Neues Passwort setzen</V28CardTitle>
            <V28CardDescription>
              Geben Sie Ihr neues Passwort ein. Es muss mindestens 8 Zeichen lang sein und Groß-/Kleinbuchstaben,
              Ziffern und Sonderzeichen enthalten.
            </V28CardDescription>
          </V28CardHeader>
          <V28CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Neues Passwort</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...form.register('password')}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>

              {/* Password Confirm Field */}
              <div className="space-y-2">
                <Label htmlFor="password_confirm">Passwort bestätigen</Label>
                <div className="relative">
                  <Input
                    id="password_confirm"
                    type={showPasswordConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...form.register('password_confirm')}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.password_confirm && (
                  <p className="text-sm text-destructive">{form.formState.errors.password_confirm.message}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-medium">Passwort muss enthalten:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Mindestens 8 Zeichen</li>
                  <li>Mindestens einen Großbuchstaben (A-Z)</li>
                  <li>Mindestens einen Kleinbuchstaben (a-z)</li>
                  <li>Mindestens eine Ziffer (0-9)</li>
                  <li>Mindestens ein Sonderzeichen (!@#$%^&*)</li>
                </ul>
              </div>

              {/* Submit Button */}
              <V28Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner className="mr-2" />
                    Passwort wird aktualisiert...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Passwort speichern
                  </>
                )}
              </V28Button>
            </form>
          </V28CardContent>
        </V28Card>
      </div>
    </AuthPageLayout>
  );
}
