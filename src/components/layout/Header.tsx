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
import { LogOut, User, Search, Bot } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { useNavigate } from 'react-router-dom';
import { designTokens } from '@/config/design-tokens';
import { cn } from '@/lib/utils';

interface HeaderProps {
  sidebarExpanded: boolean;
}

export function Header({ sidebarExpanded }: HeaderProps) {
  const { user, profile, signOut } = useAuth();
  const { permissions } = useAccountType();
  const navigate = useNavigate();

  // Trigger Global Search via Custom Event
  const openSearch = () => {
    const event = new CustomEvent('open-global-search');
    window.dispatchEvent(event);
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 shadow-lg transition-all backdrop-blur-md"
      )}
      style={
        {
          zIndex: designTokens.zIndex.header,
          left: sidebarExpanded ? '240px' : '64px',
          width: sidebarExpanded ? 'calc(100% - 240px)' : 'calc(100% - 64px)',
          transitionDuration: '300ms',
          boxShadow: designTokens.shadows.md,
        }
      }
    >
      <div className="px-6 lg:px-8 h-full flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* V29.1: UNIFIED LOGO - Nur MyDispatch-Logo systemweit */}
          <div
            onClick={() => navigate(permissions.canAccessMasterDashboard ? '/master' : '/dashboard')}
            className="cursor-pointer hover:opacity-90 transition-all duration-300"
            title="Zur Startseite"
          >
            <Logo className="h-8 md:h-10" />
          </div>

          {user && (
            <div className="flex items-center gap-3">
              <button
                onClick={openSearch}
                title="Suche (Cmd+K / Strg+K)"
                className="p-2.5 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  color: designTokens.colors.slate[800],
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = designTokens.colors.slate[100];
                  e.currentTarget.style.boxShadow = designTokens.shadows.sm;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  const event = new CustomEvent('open-ai-chat');
                  window.dispatchEvent(event);
                }}
                title="AI-Assistent öffnen (Cmd+I)"
                className="p-2.5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 relative"
                style={{
                  color: designTokens.colors.slate[800],
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = designTokens.colors.slate[100];
                  e.currentTarget.style.boxShadow = designTokens.shadows.sm;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Bot className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{
                    backgroundColor: designTokens.colors.accent.DEFAULT,
                    boxShadow: `0 0 12px ${designTokens.colors.accent.DEFAULT}`,
                  }}
                />
              </button>
              <div className="hidden md:flex items-center rounded-lg gap-3 px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-600 shadow-md"
              >
                <User className="w-4 h-4 text-white" />
                <span className="text-white font-medium">{profile?.first_name || user.email}</span>
              </div>
              <button
                onClick={() => {
                  signOut();
                  navigate('/login');
                }}
                className="p-2.5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                style={{
                  color: designTokens.colors.slate[800],
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = designTokens.colors.slate[100];
                  e.currentTarget.style.boxShadow = designTokens.shadows.sm;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Abmelden</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
