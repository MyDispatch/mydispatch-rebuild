import { Clock } from "lucide-react";
interface OpeningHoursProps {
  className?: string;
  showIcon?: boolean;
  compact?: boolean;
}
export function OpeningHours({
  className = "",
  showIcon = true,
  compact = false,
}: OpeningHoursProps) {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
        {showIcon && <Clock className="h-4 w-4" />}
        <span>Mo. - Fr.: 9:00 - 17:00 Uhr</span>
      </div>
    );
  }
  return (
    <div className={`space-y-2 text-center ${className}`}>
      <div className="flex items-center justify-center gap-2 font-semibold text-foreground">
        {showIcon && <Clock className="h-5 w-5 text-foreground" />}
        <span>MyDispatch Support</span>
      </div>
      <div className="text-sm space-y-1 text-muted-foreground">
        <p className="text-center">Mo. - Fr.: 9:00 - 17:00 Uhr</p>
        <p className="text-center">Sa. - So.: Geschlossen</p>
      </div>
      <p className="text-xs text-muted-foreground italic text-center">
        Außerhalb der Öffnungszeiten erreichen Sie uns per E-Mail
      </p>
    </div>
  );
}
