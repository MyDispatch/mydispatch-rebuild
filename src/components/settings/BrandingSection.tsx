/* ==================================================================================
   BRANDING SECTION V18.3.30
   ==================================================================================
   Logo & Primärfarbe (Corporate Identity)
   HINWEIS: Landingpage-Konfiguration erfolgt im Landingpage-Konfigurator
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/lib/compat';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSettings } from '@/contexts/SettingsContext';
import { LogoUpload } from './LogoUpload';
import { Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { V28Button } from '@/components/design-system/V28Button';
import { CI_COLORS_HEX } from '@/lib/design-system';

export function BrandingSection() {
  const { companyData, setCompanyData } = useSettings();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Corporate Identity
          </CardTitle>
          <CardDescription>
            Logo und Primärfarbe Ihres Unternehmens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Logo-Upload */}
          <div className="space-y-2">
            <LogoUpload
              companyId={companyData.id}
              currentLogoUrl={companyData.logo_url || undefined}
              onUploadComplete={(url) => setCompanyData({ ...companyData, logo_url: url })}
            />
          </div>

          {/* Primärfarbe */}
          <div className="space-y-2">
            <Label htmlFor="primary_color">Primärfarbe (CI)</Label>
            <div className="flex gap-2">
              <Input
                id="primary_color"
                type="color"
                value={companyData.primary_color || CI_COLORS_HEX.primary}
                onChange={(e) => setCompanyData({ ...companyData, primary_color: e.target.value })}
                className="w-20 h-12"
              />
              <Input
                value={companyData.primary_color || CI_COLORS_HEX.primary}
                onChange={(e) => setCompanyData({ ...companyData, primary_color: e.target.value })}
                placeholder={CI_COLORS_HEX.primary}
                className="flex-1 min-h-[44px] touch-manipulation"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Diese Farbe wird im System und auf Ihrer Landingpage verwendet
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Hinweis: Landingpage-Konfigurator */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <p className="font-medium mb-1">Landingpage konfigurieren</p>
            <p className="text-sm">
              Die vollständige Konfiguration Ihrer öffentlichen Landingpage 
              (Domain, Inhalte, Widget) erfolgt im Landingpage-Konfigurator.
            </p>
          </div>
          <V28Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate('/landingpage-konfigurator')}
          >
            Zum Konfigurator →
          </V28Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
