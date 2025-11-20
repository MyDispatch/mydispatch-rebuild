/* ==================================================================================
   RECHTLICHE WARNUNGEN V18.3.24
   ==================================================================================
   Automatische Warnung bei fehlenden rechtlichen Pflichtfeldern
   ================================================================================== */

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { V28Button } from "@/components/design-system/V28Button";

interface LegalWarningProps {
  entity: "booking" | "invoice" | "customer" | "driver" | "vehicle";
  missingFields: string[];
  onFix?: () => void;
}

const LEGAL_CONTEXT = {
  booking: {
    law: "PBefG § 51",
    description: "Personenbeförderungsgesetz",
    consequence: "Bußgeld bis 10.000 €",
  },
  invoice: {
    law: "§ 14 UStG",
    description: "Umsatzsteuergesetz",
    consequence: "Vorsteuerabzug nicht möglich",
  },
  customer: {
    law: "DSGVO Art. 30",
    description: "Verarbeitungsverzeichnis",
    consequence: "Bußgeld bis 10 Mio. € oder 2% Jahresumsatz",
  },
  driver: {
    law: "StVG § 21",
    description: "Straßenverkehrsgesetz",
    consequence: "Fahren ohne gültige Fahrerlaubnis = Straftat",
  },
  vehicle: {
    law: "StVZO § 29",
    description: "Straßenverkehrs-Zulassungs-Ordnung",
    consequence: "Bußgeld + Punkte bei TÜV-Überschreitung",
  },
};

export function LegalWarning({ entity, missingFields, onFix }: LegalWarningProps) {
  const context = LEGAL_CONTEXT[entity];

  if (missingFields.length === 0) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-semibold">
        Rechtliche Pflichtfelder fehlen ({context.law})
      </AlertTitle>
      <AlertDescription>
        <div className="space-y-2 mt-2">
          <p className="text-sm">
            Folgende Felder sind nach {context.law} ({context.description}) zwingend erforderlich:
          </p>
          <ul className="text-sm list-disc list-inside space-y-1">
            {missingFields.map((field) => (
              <li key={field} className="font-medium">
                {field}
              </li>
            ))}
          </ul>
          <p className="text-sm font-medium mt-2">⚠️ Konsequenz: {context.consequence}</p>
          {onFix && (
            <V28Button size="sm" variant="secondary" onClick={onFix} className="mt-3">
              Jetzt beheben
            </V28Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

/**
 * ABLAUF-WARNUNGEN für Führerschein/TÜV
 */
interface ExpiryWarningProps {
  type: "license" | "tuev" | "insurance";
  expiryDate: string;
  itemName: string; // z.B. "Max Mustermann" oder "M-AB 123"
  onRenew?: () => void;
}

export function ExpiryWarning({ type, expiryDate, itemName, onRenew }: ExpiryWarningProps) {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const daysUntilExpiry = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const isExpired = daysUntilExpiry < 0;
  const isCritical = daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  const isWarning = daysUntilExpiry <= 60 && daysUntilExpiry > 30;

  if (!isExpired && !isCritical && !isWarning) return null;

  const config = {
    license: {
      title: "Führerschein läuft ab",
      law: "StVG § 21",
      consequence: "Fahren ohne gültige Fahrerlaubnis = Straftat (Freiheitsstrafe bis 1 Jahr)",
      critical: "DARF NICHT MEHR EINGESETZT WERDEN!",
    },
    tuev: {
      title: "TÜV läuft ab",
      law: "StVZO § 29",
      consequence: "Bußgeld 15-75 € + 1 Punkt (bei >8 Monaten)",
      critical: "DARF NICHT MEHR EINGESETZT WERDEN!",
    },
    insurance: {
      title: "Versicherung läuft ab",
      law: "PflVG § 1",
      consequence: "Straftat (Freiheitsstrafe bis 1 Jahr oder Geldstrafe)",
      critical: "DARF NICHT MEHR EINGESETZT WERDEN!",
    },
  };

  const variant = isExpired ? "destructive" : "default";
  const { title, law, consequence, critical } = config[type];

  return (
    <Alert variant={variant} className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-semibold">
        {isExpired ? `${title} - ABGELAUFEN!` : `${title}`}
      </AlertTitle>
      <AlertDescription>
        <div className="space-y-2 mt-2">
          <p className="text-sm">
            <span className="font-medium">{itemName}</span>
            {" - "}
            {isExpired ? (
              <span className="font-bold text-status-error">
                Seit {Math.abs(daysUntilExpiry)} Tagen abgelaufen!
              </span>
            ) : (
              <span className="font-medium">Läuft in {daysUntilExpiry} Tagen ab</span>
            )}
          </p>

          {isExpired && (
            <div className="bg-status-error/10 border border-status-error/30 rounded p-2 mt-2">
              <p className="text-sm font-bold text-status-error">🚫 {critical}</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-2">Rechtliche Grundlage: {law}</p>
          <p className="text-xs text-muted-foreground">Konsequenz: {consequence}</p>

          {onRenew && (
            <V28Button
              size="sm"
              variant={isExpired ? "primary" : "secondary"}
              onClick={onRenew}
              className="mt-3"
            >
              {isExpired ? "Sofort aktualisieren" : "Verlängerung einleiten"}
            </V28Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
