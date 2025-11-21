/* ==================================================================================
   SHORTCUTS WIDGET - Context Widget für Schnellzugriff-Links
   ==================================================================================
   ✅ Kompakte Link-Liste mit Icons
   ✅ Perfekt für Einstellungen, Partner, Dokumente
   ✅ Hover-Effekte für bessere UX
   ================================================================================== */

import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Shortcut {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface ShortcutsWidgetProps {
  links: Shortcut[];
}

export function ShortcutsWidget({ links }: ShortcutsWidgetProps) {
  return (
    <div className="space-y-1.5">
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.href}
          className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded px-2 py-1.5 transition-colors"
        >
          <link.icon className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{link.label}</span>
        </Link>
      ))}
    </div>
  );
}

/**
 * USAGE EXAMPLE:
 * 
 * <ShortcutsWidget
 *   links={[
 *     { icon: Settings, label: 'Systemeinstellungen', href: '/einstellungen/system' },
 *     { icon: Users, label: 'Benutzerverwaltung', href: '/einstellungen/benutzer' },
 *     { icon: Shield, label: 'Sicherheit', href: '/einstellungen/sicherheit' }
 *   ]}
 * />
 */
