import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleError, handleSuccess } from '@/lib/api-utils';

export type CollabSection = 'html' | 'css' | 'js';

interface CollabSnapshot {
  id: string;
  timestamp: number;
  author?: string;
  note?: string;
  data: { html: string; css: string; js: string };
}

interface CollabState {
  html: string;
  css: string;
  js: string;
  version: number;
  lastUpdatedAt: number;
}

interface PresenceUser {
  id: string;
  name?: string;
  isEditing?: boolean;
}

interface UseCollabDocumentOptions {
  docId: string;
  initial?: Partial<CollabState>;
  author?: string;
}

/**
 * Supabase-Realtime basierter Kollaborations-Hook
 * - Broadcasts vollständige Sektionen (html/css/js) mit Versionszähler
 * - Presence-Tracking (Teilnehmerliste)
 * - Snapshots/Versionen lokal + synchroner Abgleich über Broadcast
 */
export function useCollabDocument({ docId, initial, author }: UseCollabDocumentOptions) {
  const clientId = useMemo(() => crypto.randomUUID(), []);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const [state, setState] = useState<CollabState>(() => ({
    html: initial?.html ?? '<div class="p-4">Hallo Welt</div>',
    css: initial?.css ?? ':root{font-family:system-ui} .p-4{padding:1rem}',
    js: initial?.js ?? '',
    version: initial?.version ?? 1,
    lastUpdatedAt: Date.now(),
  }));

  const [presence, setPresence] = useState<PresenceUser[]>([]);
  const [snapshots, setSnapshots] = useState<CollabSnapshot[]>([]);

  // Broadcast Helper
  const broadcast = async (event: string, payload: any) => {
    try {
      const ch = channelRef.current || supabase.channel(`collab:${docId}`);
      channelRef.current = ch;
      await ch.send({ type: 'broadcast', event, payload });
    } catch (err) {
      // Silent fail – Collaboration ist optional in DEV
      console.warn('[Collab] Broadcast failed', err);
    }
  };

  // Presence Tracking
  useEffect(() => {
    const ch = supabase.channel(`collab:${docId}`, {
      config: { presence: { key: clientId } },
    });
    channelRef.current = ch;

    ch.on('broadcast', { event: 'update-section' }, ({ payload }) => {
      const { section, content, version, ts, clientId: sender } = payload as {
        section: CollabSection; content: string; version: number; ts: number; clientId: string;
      };
      setState((prev) => {
        // Konfliktlösung: höhere Version gewinnt; bei gleicher Version neuere Zeit gewinnt
        const shouldApply = version > prev.version || (version === prev.version && ts > prev.lastUpdatedAt);
        if (!shouldApply) return prev;
        const next = { ...prev, version, lastUpdatedAt: ts } as CollabState;
        (next as any)[section] = content;
        return next;
      });
    });

    ch.on('broadcast', { event: 'commit-snapshot' }, ({ payload }) => {
      const snap = payload as CollabSnapshot;
      setSnapshots((prev) => {
        const exists = prev.find((s) => s.id === snap.id);
        if (exists) return prev;
        return [snap, ...prev].slice(0, 50);
      });
    });

    ch.on('broadcast', { event: 'request-state' }, async () => {
      // Antworte mit aktuellem State
      await broadcast('state-response', { state, snapshots });
    });

    ch.on('broadcast', { event: 'state-response' }, ({ payload }) => {
      const { state: remoteState, snapshots: remoteSnaps } = payload as { state: CollabState; snapshots: CollabSnapshot[] };
      setState((prev) => {
        if (remoteState.version > prev.version) return remoteState;
        return prev;
      });
      if (remoteSnaps?.length) {
        setSnapshots((prev) => {
          const all = [...remoteSnaps, ...prev];
          const dedup = new Map<string, CollabSnapshot>();
          all.forEach((s) => dedup.set(s.id, s));
          return Array.from(dedup.values()).sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);
        });
      }
    });

    ch.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await ch.track({ id: clientId, name: author, isEditing: false });
        // Fordere aktuellen State von anderen Teilnehmern an
        await broadcast('request-state', { requester: clientId });
      }
    });

    ch.on('presence', { event: 'sync' }, () => {
      const presenceState = ch.getPresenceState<PresenceUser>();
      const users = Object.values(presenceState).flat();
      setPresence(users);
    });

    return () => {
      ch.unsubscribe();
      channelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId, clientId, author]);

  const updateSection = async (section: CollabSection, content: string) => {
    const ts = Date.now();
    setState((prev) => ({
      ...prev,
      [section]: content,
      version: prev.version + 1,
      lastUpdatedAt: ts,
    }));

    await broadcast('update-section', {
      section,
      content,
      version: state.version + 1,
      ts,
      clientId,
    });
  };

  const commitSnapshot = async (note?: string) => {
    const snap: CollabSnapshot = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      author,
      note,
      data: { html: state.html, css: state.css, js: state.js },
    };
    setSnapshots((prev) => [snap, ...prev].slice(0, 50));
    await broadcast('commit-snapshot', snap);
    handleSuccess('Version gespeichert', note);
  };

  const revertTo = async (snapshotId: string) => {
    const snap = snapshots.find((s) => s.id === snapshotId);
    if (!snap) return handleError('Version nicht gefunden');
    const ts = Date.now();
    const nextVersion = state.version + 1;
    setState({ ...snap.data, version: nextVersion, lastUpdatedAt: ts });
    await broadcast('update-section', { section: 'html', content: snap.data.html, version: nextVersion, ts, clientId });
    await broadcast('update-section', { section: 'css', content: snap.data.css, version: nextVersion, ts, clientId });
    await broadcast('update-section', { section: 'js', content: snap.data.js, version: nextVersion, ts, clientId });
    handleSuccess('Zur Version zurückgesetzt');
  };

  return {
    state,
    presence,
    snapshots,
    updateSection,
    commitSnapshot,
    revertTo,
  };
}

