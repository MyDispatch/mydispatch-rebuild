/* ==================================================================================
   HEADER V45.0 - PREMIUM VIBRANT PROFESSIONAL
   ==================================================================================
   ✅ Premium Vibrant Professional Farbpalette
   ✅ Verbesserte Kontraste und Lesbarkeit
   ✅ Business Tarif Premium Features
   ✅ 100% V45.0 Design System konform
   ================================================================================== */

import { useAuth } from '@/hooks/use-auth';
import { useAccountType } from '@/hooks/use-account-type';
import { V28Button } from '@/components/design-system/V28Button';
import { LogOut, User, Search, Bot } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/config/app-routes';
import { designTokens } from '@/config/design-tokens';
import { cn } from '@/lib/utils';

interface HeaderProps {
  sidebarExpanded: boolean;
}

export function Header({ sidebarExpanded }: HeaderProps) {
  const { user, profile, signOut, company } = useAuth();
  const { permissions } = useAccountType();
  const navigate = useNavigate();

  // Trigger Global Search via Custom Event
  const openSearch = () => {
    const event = new CustomEvent('open-global-search');
    window.dispatchEvent(event);
  };

  return (
    <header
      role="banner"
      aria-label="Hauptkopfbereich"
      className={cn(
        "fixed top-0 right-0 h-16 border-b shadow-lg transition-all backdrop-blur-md"
      )}
      style={{
        zIndex: designTokens.zIndex.header,
        left: sidebarExpanded ? '240px' : '64px',
        width: sidebarExpanded ? 'calc(100% - 240px)' : 'calc(100% - 64px)',
        transitionDuration: '300ms',
        boxShadow: designTokens.shadows.card,
        backgroundColor: designTokens.colors.slate[50],
        borderColor: designTokens.colors.slate[200],
        borderBottomWidth: 1,
        borderStyle: 'solid',
      }}
    >
      <div className="px-8 h-full flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* V29.1: UNIFIED LOGO - Nur MyDispatch-Logo systemweit */}
          <div
            onClick={() => navigate(APP_ROUTES.dashboard)} 
            className="cursor-pointer hover:opacity-90 transition-all duration-300"
            title="Zur Startseite"
            aria-label="Zur Startseite"
            role="link"
          >
            <Logo className="h-8 md:h-10" />
          </div>
          
          {user && (
            <nav aria-label="Benutzeraktionen" className="flex items-center gap-3">
              <button
                onClick={openSearch}
                title="Suche (Cmd+K / Strg+K)"
                aria-label="Globale Suche öffnen"
                type="button"
                className="p-2 rounded-lg transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-slate-800 hover:bg-slate-100"
              >
                <Search className="w-5 h-5" />
                <span className="sr-only">Tastaturkürzel: Cmd+K / Strg+K</span>
              </button>
              <button
                onClick={() => {
                  const event = new CustomEvent('open-ai-chat');
                  window.dispatchEvent(event);
                }}
                title="AI-Assistent öffnen (Cmd+I)"
                aria-label="AI-Assistent öffnen"
                type="button"
                className="p-2 rounded-lg transition-all duration-300 hover:-translate-y-0.5 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-slate-800 hover:bg-slate-100"
              >
                <Bot className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{
                    backgroundColor: designTokens.colors.accent.DEFAULT,
                    boxShadow: `0 0 12px ${designTokens.colors.accent.DEFAULT}`,
                  }}
                />
                <span className="sr-only">Tastaturkürzel: Cmd+I</span>
              </button>
              <div
                className="hidden md:flex items-center rounded-lg gap-3 px-4 py-2 shadow-md"
                aria-label="Angemeldeter Benutzer"
                style={{
                  backgroundColor: designTokens.colors.slate[800],
                  borderColor: designTokens.colors.slate[600],
                  borderWidth: 1,
                  borderStyle: 'solid',
                }}
              >
                <User className="w-4 h-4" style={{ color: '#fff' }} />
                <span className="font-medium" style={{ color: '#fff' }}>{profile?.first_name || user.email}</span>
              </div>
              <button
                onClick={() => {
                  signOut();
                  navigate('/login');
                }}
                aria-label="Abmelden"
                type="button"
                className="p-2 rounded-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-slate-800 hover:bg-slate-100"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Abmelden</span>
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
