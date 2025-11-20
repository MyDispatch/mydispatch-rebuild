/* ==================================================================================
   UPCOMING EVENTS WIDGET - Context Widget für Termine/Schichten
   ==================================================================================
   ✅ Kompakte Event-Liste mit Zeitanzeige
   ✅ Perfekt für Kalender, Schichtzettel, Fahrzeuge
   ✅ Zeigt maximal 3 Events
   ================================================================================== */

import { Clock } from "lucide-react";

interface UpcomingEvent {
  title: string;
  time: string;
  highlight?: boolean;
}

interface UpcomingEventsWidgetProps {
  events: UpcomingEvent[];
}

export function UpcomingEventsWidget({ events }: UpcomingEventsWidgetProps) {
  return (
    <div className="space-y-2">
      {events.slice(0, 3).map((event, index) => (
        <div key={index} className="flex items-start gap-2 text-xs">
          <Clock className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p
              className={`font-medium truncate ${event.highlight ? "text-blue-600" : "text-slate-900"}`}
            >
              {event.title}
            </p>
            <p className="text-[10px] text-slate-500">{event.time}</p>
          </div>
        </div>
      ))}
      {events.length === 0 && (
        <p className="text-xs text-slate-500 italic">Keine anstehenden Termine</p>
      )}
    </div>
  );
}

/**
 * USAGE EXAMPLE:
 *
 * <UpcomingEventsWidget
 *   events={[
 *     { title: 'Schicht: Max Mustermann', time: 'Heute 14:00 - 22:00', highlight: true },
 *     { title: 'Wartung: Fahrzeug #123', time: 'Morgen 09:00' },
 *     { title: 'TÜV: Fahrzeug #456', time: 'In 3 Tagen' }
 *   ]}
 * />
 */
