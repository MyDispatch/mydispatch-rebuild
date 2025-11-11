import { useEffect, useMemo, useState } from 'react';
import { V28MarketingSection } from '@/components/design-system/V28MarketingSection';
import { V28MarketingCard } from '@/components/design-system/V28MarketingCard';
import { V28Button } from '@/components/design-system/V28Button';
import { Input } from '@/components/ui/input';

type DocsSyncReport = {
  filesProcessed: number;
  docs: Array<{ path: string; title: string }>;
};

export function DocsRegistry() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Array<{ path: string; title: string }>>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);

  useEffect(() => {
    let cancelled = false;
    async function fetchDocs() {
      try {
        // Server-first: Edge Function (falls verfügbar)
        const res = await fetch('/functions/v1/wiki-sync?q=' + encodeURIComponent(query));
        if (res.ok) {
          const json = await res.json();
          if (!cancelled) {
            setItems((json.items || []).map((d: any) => ({ path: d.path, title: d.title })));
            setLoading(false);
          }
          return;
        }
      } catch (_) {
        // ignore, fallback next
      }
      try {
        // Fallback: Lokaler statischer Bericht
        const res = await fetch('/docs-sync-report.json');
        if (!cancelled) {
          if (res.ok) {
            const json: DocsSyncReport = await res.json();
            setItems(json.docs || []);
            setLoading(false);
          } else {
            throw new Error('Keine Datenquellen verfügbar');
          }
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Fehler beim Laden');
          setLoading(false);
        }
      }
    }
    fetchDocs();
    return () => { cancelled = true; };
  }, [query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = !q
      ? items
      : items.filter(i => i.title.toLowerCase().includes(q) || i.path.toLowerCase().includes(q));
    return base;
  }, [items, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  return (
    <V28MarketingSection
      background="surface"
      title="Repo-Dokumente (MD‑2024)"
      description="Automatisch synchronisierte Projektdokumente"
    >
      <V28MarketingCard className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
          <div className="flex-1 w-full">
            <Input
              placeholder="Suchen nach Titel oder Pfad"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <V28Button variant="secondary" onClick={() => { setQuery(''); setPage(1); }}>Reset</V28Button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Pro Seite</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="rounded-md bg-slate-800/60 border border-slate-700 text-slate-50 px-2 py-1"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
              <option value={96}>96</option>
            </select>
          </div>
        </div>
      </V28MarketingCard>

      {loading && (
        <V28MarketingCard>Wird geladen…</V28MarketingCard>
      )}
      {error && (
        <V28MarketingCard className="text-red-500">{error}</V28MarketingCard>
      )}
      {!loading && !error && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageItems.map((doc) => (
              <V28MarketingCard key={doc.path} className="hover:shadow-xl transition-shadow">
                <div className="font-semibold text-slate-200 mb-1">{doc.title || 'Unbenannt'}</div>
                <div className="text-xs text-slate-400">{doc.path}</div>
              </V28MarketingCard>
            ))}
            {pageItems.length === 0 && (
              <V28MarketingCard>Keine Treffer</V28MarketingCard>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div>{filtered.length} Dokumente • Seite {currentPage} / {pageCount}</div>
            <div className="flex items-center gap-2">
              <V28Button
                variant="secondary"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >Zurück</V28Button>
              <span>{filtered.length === 0 ? 0 : start + 1}–{Math.min(filtered.length, start + pageSize)}</span>
              <V28Button
                variant="secondary"
                disabled={currentPage >= pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              >Weiter</V28Button>
            </div>
          </div>
        </div>
      )}
    </V28MarketingSection>
  );
}

export default DocsRegistry;
