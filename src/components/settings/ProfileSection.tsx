/* ==================================================================================
   PROFILE SECTION V18.3
   ==================================================================================
   User-Profil: Vor-/Nachname, Email (read-only), Passwort ändern
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/lib/compat";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/hooks/use-auth";

export function ProfileSection() {
  const { profileData, setProfileData } = useSettings();
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mein Profil</CardTitle>
        <CardDescription>Verwalten Sie Ihre persönlichen Daten</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">Vorname</Label>
            <Input
              id="first_name"
              value={profileData.first_name || ""}
              onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
              className="min-h-[44px] touch-manipulation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Nachname</Label>
            <Input
              id="last_name"
              value={profileData.last_name || ""}
              onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
              className="min-h-[44px] touch-manipulation"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email">E-Mail (schreibgeschützt)</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
              className="min-h-[44px] bg-muted cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Ihre E-Mail-Adresse kann nicht geändert werden
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
