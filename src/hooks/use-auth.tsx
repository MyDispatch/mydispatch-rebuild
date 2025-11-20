import * as React from 'react';
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';
import type { ExtendedProfile, ExtendedCompany } from '@/types/extended-types';
import { toExtendedCompany } from '@/types/extended-types';
import type { Profile } from '@/integrations/supabase/types/core-tables';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: ExtendedProfile | null;
  company: ExtendedCompany | null;
  roles: string[];
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderInner({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [company, setCompany] = useState<ExtendedCompany | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setCompany(null);
          setRoles([]);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          fetchUserData(session.user.id);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        logger.error('Auth session error:', error);
        setSession(null);
        setUser(null);
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*, companies(*)')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        handleError(profileError, 'Fehler beim Laden des Profils', { showToast: false });
        setLoading(false);
        return;
      }

      const profileDataAny = profileData as any;
      const extendedCompany = toExtendedCompany(profileDataAny?.companies || null);

      const enrichedProfile: ExtendedProfile = {
        ...(profileDataAny as Profile),
        email: session?.user?.email,
        company: extendedCompany,
        companies: extendedCompany,
      };

      setProfile(enrichedProfile);
      setCompany(extendedCompany);

      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) {
        handleError(rolesError, 'Fehler beim Laden der Rollen', { showToast: false });
      }

      interface UserRole {
        role: string;
      }
      const rolesDataAny = rolesData as any;
      const userRoles = rolesDataAny?.map((r: UserRole) => r.role) || [];

      // CRITICAL: Email-basierter Master-Zugang für NeXify Master-User
      const userEmail = session?.user?.email?.toLowerCase().trim();
      const isMasterEmail = userEmail === 'courbois1981@gmail.com' ||
                           userEmail === 'pascal@nexify.ai' ||
                           userEmail === 'master@nexify.ai';

      if (isMasterEmail && !userRoles.includes('master')) {
        userRoles.push('master');
        logger.debug('[useAuth] Master-Rolle durch Email hinzugefügt', { email: userEmail });
      }

      setRoles(userRoles);
    } catch (error) {
      handleError(error, 'Fehler beim Laden der Benutzerdaten', { showToast: false });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      setProfile(null);
      setCompany(null);
      setRoles([]);

      navigate('/auth');
      toast({
        title: 'Abgemeldet',
        description: 'Sie wurden erfolgreich abgemeldet.',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, company, roles, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthProviderInner>{children}</AuthProviderInner>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  // CRITICAL V18.3.30: Robust Error Handling with Diagnostic Info
  if (context === undefined) {
    // Development: Detailed error with stack trace
    if (import.meta.env.DEV) {
      logger.error('[useAuth] Context is undefined - AuthProvider missing in tree', undefined, {
        location: window.location.pathname,
      });
    }

    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Ensure <AuthProvider> wraps your component tree. ' +
      `Current path: ${window.location.pathname}`
    );
  }

  return context;
}
