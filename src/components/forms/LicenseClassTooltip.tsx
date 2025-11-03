import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LICENSE_CLASSES = {
  'AM': 'Kleinkrafträder, Fahrräder mit Hilfsmotor bis 45 km/h, max. 50 cm³',
  'A1': 'Leichtkrafträder bis 125 cm³, max. 11 kW, max. 0,1 kW/kg',
  'A2': 'Krafträder bis 35 kW, max. 0,2 kW/kg',
  'A': 'Krafträder über 35 kW, Trikes über 15 kW',
  'B': 'Kraftfahrzeuge bis 3,5t zGG, max. 8 Passagiere (+ Fahrer)',
  'BE': 'PKW (Klasse B) mit Anhänger über 750 kg',
  'C1': 'Kraftfahrzeuge 3,5t - 7,5t zGG',
  'C1E': 'Fahrzeugkombination aus Klasse C1 und Anhänger über 750 kg',
  'C': 'Kraftfahrzeuge über 7,5t zGG',
  'CE': 'LKW (Klasse C) mit Anhänger über 750 kg',
  'D1': 'Kleinbusse 9-16 Passagiere (+ Fahrer), max. 8m Länge',
  'D1E': 'Fahrzeugkombination aus Klasse D1 und Anhänger über 750 kg',
  'D': 'Busse über 16 Passagiere (+ Fahrer)',
  'DE': 'Bus (Klasse D) mit Anhänger über 750 kg',
  'P-Schein': 'Personenbeförderungsschein (Taxi, Mietwagen, Krankentransport) - Pflicht für gewerbliche Personenbeförderung'
} as const;

interface LicenseClassTooltipProps {
  licenseClass: keyof typeof LICENSE_CLASSES;
  children?: React.ReactNode;
}

export function LicenseClassTooltip({ licenseClass, children }: LicenseClassTooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <button type="button" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <Info className="h-4 w-4" />
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="max-w-xs bg-popover text-popover-foreground border border-border shadow-lg"
          sideOffset={5}
        >
          <div className="space-y-1">
            <p className="font-semibold text-sm">Klasse {licenseClass}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {LICENSE_CLASSES[licenseClass]}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { LICENSE_CLASSES };
