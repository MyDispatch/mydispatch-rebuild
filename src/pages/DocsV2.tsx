import { useState } from 'react';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { SEOHead } from '@/components/shared/SEOHead';
import { V28HeroPremium } from '@/components/hero';
import { V28MarketingSection } from '@/components/design-system/V28MarketingSection';
import { V28MarketingCard } from '@/components/design-system/V28MarketingCard';
import { V28IconBox } from '@/components/design-system/V28IconBox';
import { V28Button } from '@/components/design-system/V28Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Search } from 'lucide-react';
import { useNexifyWikiSearch } from '@/hooks/api/useNexifyWiki';

export default function DocsV2() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [q, setQ] = useState('component');
  const { data: results = [], isFetching } = useNexifyWikiSearch(q, 5);

  return (
    <MarketingLayout currentPage="docs">
      <SEOHead 
        title="Dokumentation & Hilfe – V2"
        description="MyDispatch Dokumentation mit integrierter Wiki-Suche (NeXify API)"
        canonical="/docs-v2"
      />

      <V28HeroPremium
        variant="features"
        backgroundVariant="3d-premium"
        badge={{ text: 'Dokumentation', icon: Search }}
        title="V2 Dokumentation mit Wiki-Suche"
        subtitle="Schnell die richtigen Inhalte finden"
        description="Die neue NeXify API bietet robuste, skalierbare Suche über die Wissensbasis."
        primaryCTA={{
          label: user ? 'Zum Dashboard' : 'Jetzt starten',
          onClick: () => user ? navigate('/dashboard') : navigate('/auth?mode=signup')
        }}
        secondaryCTA={{ label: 'Support kontaktieren', onClick: () => navigate('/contact') }}
      />

      <V28MarketingSection background="canvas" title="Wiki-Suche" description="Direkt aus der Dokumentation suchen">
        <V28MarketingCard>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <V28IconBox icon={Search} variant="slate" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Suchbegriff eingeben…"
                className="flex-1 rounded-md border px-3 py-2 text-sm"
              />
              <V28Button onClick={() => {}} disabled>
                Suchen
              </V28Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isFetching && (
                <div className="text-sm text-slate-500">Suche läuft…</div>
              )}
              {!isFetching && results.length === 0 && (
                <div className="text-sm text-slate-500">Keine Ergebnisse gefunden.</div>
              )}
              {results.map((r, idx) => (
                <div key={idx} className="rounded-lg border p-4">
                  <div className="font-semibold text-slate-900">{r.title}</div>
                  {r.snippet && (
                    <div className="text-sm text-slate-600 mt-1">{r.snippet}</div>
                  )}
                  <div className="text-xs text-slate-500 mt-2">
                    Kategorie: {r.category || 'Allgemein'} | Relevanz: {Math.round((r.relevance || 0) * 100)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </V28MarketingCard>
      </V28MarketingSection>
    </MarketingLayout>
  );
}

