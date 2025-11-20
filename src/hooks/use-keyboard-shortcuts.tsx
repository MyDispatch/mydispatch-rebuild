/* ==================================================================================
   KEYBOARD SHORTCUTS HOOK - V18.1
   ==================================================================================
   Power-User-Features: Cmd+K, Cmd+N, Cmd+/, etc.
   ================================================================================== */

import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface ShortcutConfig {
  key: string;
  ctrlOrCmd?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
  category: string;
}

export const useKeyboardShortcuts = (
  onOpenGlobalSearch?: () => void,
  onOpenShortcutHelp?: () => void
) => {
  const navigate = useNavigate();

  const shortcuts = useCallback((): ShortcutConfig[] => [
    {
      key: 'k',
      ctrlOrCmd: true,
      action: () => onOpenGlobalSearch?.(),
      description: 'Global Search öffnen',
      category: 'Navigation',
    },
    {
      key: 'n',
      ctrlOrCmd: true,
      action: () => navigate('/auftraege?new=true'),
      description: 'Neuer Auftrag',
      category: 'Aktionen',
    },
    {
      key: 'd',
      ctrlOrCmd: true,
      shift: true,
      action: () => navigate('/'),
      description: 'Zum Dashboard',
      category: 'Navigation',
    },
    {
      key: 'k',
      ctrlOrCmd: true,
      shift: true,
      action: () => navigate('/kunden'),
      description: 'Kunden-Übersicht',
      category: 'Navigation',
    },
    {
      key: 'f',
      ctrlOrCmd: true,
      shift: true,
      action: () => navigate('/fahrer'),
      description: 'Fahrer-Übersicht',
      category: 'Navigation',
    },
    {
      key: 'v',
      ctrlOrCmd: true,
      shift: true,
      action: () => navigate('/fahrzeuge'),
      description: 'Fahrzeuge-Übersicht',
      category: 'Navigation',
    },
    {
      key: 'a',
      ctrlOrCmd: true,
      shift: true,
      action: () => navigate('/auftraege'),
      description: 'Aufträge-Übersicht',
      category: 'Navigation',
    },
    {
      key: 'p',
      ctrlOrCmd: true,
      shift: true,
      action: () => navigate('/partner'),
      description: 'Partner-Übersicht',
      category: 'Navigation',
    },
    {
      key: '/',
      ctrlOrCmd: true,
      action: () => onOpenShortcutHelp?.(),
      description: 'Keyboard-Shortcuts anzeigen',
      category: 'Hilfe',
    },
  ], [navigate, onOpenGlobalSearch, onOpenShortcutHelp]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Safety check: Ensure event.key exists
      if (!event.key) return;
      
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

      for (const shortcut of shortcuts()) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrlOrCmd ? ctrlOrCmd : true;
        const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatches = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { shortcuts: shortcuts() };
};

// Helper für Shortcut-Anzeige
export const getShortcutDisplay = (shortcut: ShortcutConfig): string => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const parts: string[] = [];

  if (shortcut.ctrlOrCmd) {
    parts.push(isMac ? '⌘' : 'Ctrl');
  }
  if (shortcut.shift) {
    parts.push(isMac ? '⇧' : 'Shift');
  }
  if (shortcut.alt) {
    parts.push(isMac ? '⌥' : 'Alt');
  }

  parts.push(shortcut.key.toUpperCase());

  return parts.join(isMac ? '' : '+');
};
