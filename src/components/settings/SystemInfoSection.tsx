/* ==================================================================================
   SYSTEM INFO SECTION V18.3
   ==================================================================================
   System-Informationen, Account-Type, Version
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { V28Button } from '@/components/design-system/V28Button';
import { useAuth } from '@/hooks/use-auth';
import { useAccountType } from '@/hooks/use-account-type';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { useNavigate } from 'react-router-dom';

export function SystemInfoSection() {
  const { user, company } = useAuth();
  const { accountType, permissions } = useAccountType();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          System-Informationen
        </CardTitle>
        <CardDescription>
          Technische Details und Support
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">App-Version</Label>
            <p className="text-foreground font-medium">V18.3</p>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Account-Typ</Label>
            <div>
              <StatusIndicator
                type={accountType === 'master' ? 'error' : accountType === 'test' ? 'warning' : 'info'}
                label={accountType === 'master' ? 'Master' : accountType === 'test' ? 'Test' : 'Normal'}
                size="md"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Unternehmens-ID</Label>
            <p className="text-xs font-mono text-foreground break-all">{company?.id}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Benutzer-ID</Label>
            <p className="text-xs font-mono text-foreground break-all">{user?.id}</p>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg text-sm">
          <p className="font-medium mb-2">Support kontaktieren</p>
          <p className="text-muted-foreground mb-3">
            Bei Fragen oder Problemen steht Ihnen unser Support-Team gerne zur Verfügung.
          </p>
          <V28Button
            variant="secondary"
            onClick={() => navigate('/nexify-support')}
            className="min-h-[44px] touch-manipulation"
          >
            Support-Center öffnen
          </V28Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>DSGVO-konform</p>
          <p>PBefG-zertifiziert</p>
          <p>Hosted in Deutschland</p>
        </div>
      </CardContent>
    </Card>
  );
}
