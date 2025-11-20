/* ==================================================================================
   MobileHeader V28.1 - VOLLSTÄNDIG HARMONISIERT
   ==================================================================================
   ✅ V28.1 Slate Design System (Professional Minimalism)
   ✅ Einheitliche Logo Component Nutzung
   ✅ designTokens.zIndex.mobileHeader
   ✅ Keine deprecated UNIFIED_DESIGN_TOKENS
   ✅ Synchrone 300ms Transitions
   ================================================================================== */

import { useState } from 'react';
import { Menu, Search, User, Settings, LogOut, Bot } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { V28Button } from '@/components/design-system/V28Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { designTokens } from '@/config/design-tokens';
import { Logo } from '@/components/shared/Logo';

export function MobileHeader() {
  const { profile, company } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth?mode=signup');
      toast.success('Erfolgreich abgemeldet');
    } catch (error) {
      toast.error('Fehler beim Abmelden');
    }
  };

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 backdrop-blur-md"
        style={{
          zIndex: designTokens.zIndex.mobileHeader,
          height: '56px',
          background: `linear-gradient(135deg, ${designTokens.colors.slate[900]} 0%, ${designTokens.colors.slate[600]} 100%)`,
          borderBottom: `1px solid ${designTokens.colors.slate[200]}`,
        }}
      >
        <div className="flex items-center justify-between h-full px-4">
          {/* Logo - Unified Logo Component */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/dashboard')}
          >
            <Logo className="h-7 w-auto" />
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1">
            <V28Button
              variant="ghost" 
              size="sm"
              onClick={() => {
                const event = new CustomEvent('open-global-search');
                window.dispatchEvent(event);
              }}
              className="h-10 w-10 p-0 text-white hover:text-white"
              aria-label="Suche"
              icon={Search}
            >
              {/* Empty for icon-only */}
            </V28Button>
            
            <V28Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                const event = new CustomEvent('open-ai-chat');
                window.dispatchEvent(event);
              }}
              className="h-10 w-10 p-0 text-white hover:text-white"
              aria-label="AI-Support"
              icon={Bot}
            >
              {/* Empty for icon-only */}
            </V28Button>
            
            <V28Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowMenu(true)}
              className="h-10 w-10 p-0 text-white hover:text-white"
              aria-label="Menü öffnen"
              icon={Menu}
            >
              {/* Empty for icon-only */}
            </V28Button>
          </div>
        </div>
      </header>

      {/* Slide-out Menu */}
      <Sheet open={showMenu} onOpenChange={setShowMenu}>
        <SheetContent side="right" className="w-80 sm:w-96">
          <SheetHeader>
            <SheetTitle>Menü</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 flex flex-col gap-6">
            {/* User Profile */}
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profile?.profile_image_url || undefined} />
                <AvatarFallback 
                  style={{
                    backgroundColor: designTokens.colors.slate[900],
                    color: designTokens.colors.white,
                  }}
                >
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div 
                  className="font-semibold truncate"
                  style={{ color: designTokens.colors.slate[900] }}
                >
                  {profile?.first_name && profile?.last_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : profile?.email || 'Benutzer'}
                </div>
                <div 
                  className="text-sm truncate"
                  style={{ color: designTokens.colors.slate[600] }}
                >
                  {profile?.email}
                </div>
              </div>
            </div>

            <Separator />

            {/* Quick Actions */}
            <div className="flex flex-col gap-2">
              <V28Button
                variant="ghost"
                className="w-full justify-start group"
                onClick={() => {
                  navigate('/einstellungen');
                  setShowMenu(false);
                }}
                icon={Settings}
                iconPosition="left"
              >
                <span className="ml-3">Einstellungen</span>
              </V28Button>

              <V28Button
                variant="ghost"
                className="w-full justify-start group"
                onClick={() => {
                  navigate('/einstellungen?tab=account');
                  setShowMenu(false);
                }}
                icon={User}
                iconPosition="left"
              >
                <span className="ml-3">Profil</span>
              </V28Button>

              <Separator />

              <V28Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleLogout}
                icon={LogOut}
                iconPosition="left"
              >
                <span className="ml-3">Abmelden</span>
              </V28Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
