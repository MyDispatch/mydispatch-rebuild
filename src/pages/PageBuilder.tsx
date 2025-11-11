import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useFeatureFlag, toggleFeatureFlag, useFeatureFlags } from '@/lib/feature-flags-client';
import { logger } from '@/lib/logger';

// GrapesJS styles (bundled by Vite)
import 'grapesjs/dist/css/grapes.min.css';

export default function PageBuilder() {
  const editorEl = useRef<HTMLDivElement | null>(null);
  const [editor, setEditor] = useState<any>(null);
  const isEnabled = useFeatureFlag('page_builder');
  const { flags } = useFeatureFlags();
  const location = useLocation();
  const force = new URLSearchParams(location.search).get('force') === '1';

  useEffect(() => {
    let disposed = false;

    async function init() {
      if (!editorEl.current) return;
      try {
        const grapesjs = await import('grapesjs');
        const presetWebpage = (await import('grapesjs-preset-webpage')).default;

        const e = grapesjs.default?.init
          ? grapesjs.default.init({
              container: editorEl.current,
              height: '74vh',
              fromElement: false,
              storageManager: { type: 'local' },
              plugins: [presetWebpage],
              pluginsOpts: {
                [presetWebpage?.name || 'grapesjs-preset-webpage']: {
                  blocksBasic: true,
                },
              },
              canvas: {
                styles: [
                  // Tailwind CDN so content renders roughly consistent with app styles
                  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
                ],
              },
            })
          : grapesjs.init({
              container: editorEl.current,
              height: '74vh',
              fromElement: false,
              storageManager: { type: 'local' },
              plugins: [presetWebpage],
              canvas: {
                styles: [
                  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
                ],
              },
            });

        if (disposed) {
          e?.destroy?.();
          return;
        }

        // Seed with a simple hero section (Tailwind classes)
        e.addComponents(`
          <section class="bg-slate-900 text-slate-50 py-16 rounded-xl">
            <div class="max-w-5xl mx-auto px-6">
              <h1 class="text-4xl font-bold">MyDispatch Page Builder</h1>
              <p class="mt-3 text-slate-300">Erstellen Sie schnell abschnittsbasierte Inhalte.</p>
              <div class="mt-6">
                <a class="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg" href="#">Jetzt starten</a>
              </div>
            </div>
          </section>
        `);

        // Register NeXify blocks for common sections
        const bm = e.BlockManager;
        bm.add('hero', {
          label: 'Hero',
          category: 'NeXify',
          content: `
            <section class="bg-slate-900 text-slate-50 py-16">
              <div class="max-w-5xl mx-auto px-6 text-center">
                <h1 class="text-4xl font-bold">Starke Disposition, klare Prozesse</h1>
                <p class="mt-3 text-slate-300">Cloud‑basiert, sicher, mobil – MyDispatch für Profis.</p>
                <div class="mt-6 flex justify-center gap-3">
                  <a class="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg" href="#">Jetzt starten</a>
                  <a class="inline-block bg-slate-700 text-white px-4 py-2 rounded-lg" href="#">Demo ansehen</a>
                </div>
              </div>
            </section>`,
        });

        bm.add('trust-badges', {
          label: 'Trust Badges',
          category: 'NeXify',
          content: `
            <section class="bg-slate-800 text-slate-200 py-8">
              <div class="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div class="p-3 rounded-lg bg-slate-900">Made in Germany</div>
                <div class="p-3 rounded-lg bg-slate-900">DSGVO‑konform</div>
                <div class="p-3 rounded-lg bg-slate-900">SSL/TLS</div>
                <div class="p-3 rounded-lg bg-slate-900">Support</div>
              </div>
            </section>`,
        });

        bm.add('features-grid', {
          label: 'Features Overview',
          category: 'NeXify',
          content: `
            <section class="bg-slate-900 text-slate-50 py-12">
              <div class="max-w-5xl mx-auto px-6">
                <h2 class="text-2xl font-bold mb-6">Top‑Features</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div class="p-4 rounded-lg bg-slate-800"><h3 class="font-semibold">Auftragsverwaltung</h3><p class="text-slate-300">Komfortable Anlage & Planung</p></div>
                  <div class="p-4 rounded-lg bg-slate-800"><h3 class="font-semibold">GPS‑Tracking</h3><p class="text-slate-300">Live‑Standorte & Routen</p></div>
                  <div class="p-4 rounded-lg bg-slate-800"><h3 class="font-semibold">Rechnungen</h3><p class="text-slate-300">Automatisch & korrekt</p></div>
                  <div class="p-4 rounded-lg bg-slate-800"><h3 class="font-semibold">Kundenportal</h3><p class="text-slate-300">Self‑Service & Übersicht</p></div>
                  <div class="p-4 rounded-lg bg-slate-800"><h3 class="font-semibold">Team‑Chat</h3><p class="text-slate-300">Abstimmung in Echtzeit</p></div>
                  <div class="p-4 rounded-lg bg-slate-800"><h3 class="font-semibold">Statistiken</h3><p class="text-slate-300">Zahlen & Trends</p></div>
                </div>
              </div>
            </section>`,
        });

        bm.add('pricing-cards', {
          label: 'Tarifkarten',
          category: 'NeXify',
          content: `
            <section class="bg-slate-900 text-slate-50 py-12">
              <div class="max-w-5xl mx-auto px-6">
                <h2 class="text-2xl font-bold mb-6">Tarife</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="p-6 rounded-xl bg-slate-800"><h3 class="text-xl font-semibold">Starter</h3><p class="mt-2 text-slate-300">Für den Einstieg</p><a class="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg" href="#">Wählen</a></div>
                  <div class="p-6 rounded-xl bg-slate-800 ring-2 ring-blue-500"><h3 class="text-xl font-semibold">Business</h3><p class="mt-2 text-slate-300">Für Profis</p><a class="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg" href="#">Wählen</a></div>
                  <div class="p-6 rounded-xl bg-slate-800"><h3 class="text-xl font-semibold">Enterprise</h3><p class="mt-2 text-slate-300">Für Teams</p><a class="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg" href="#">Wählen</a></div>
                </div>
              </div>
            </section>`,
        });

        bm.add('faq', {
          label: 'FAQ',
          category: 'NeXify',
          content: `
            <section class="bg-slate-900 text-slate-50 py-12">
              <div class="max-w-5xl mx-auto px-6">
                <h2 class="text-2xl font-bold mb-6">FAQ</h2>
                <dl class="space-y-4">
                  <div>
                    <dt class="font-semibold">Ist MyDispatch mobil nutzbar?</dt>
                    <dd class="text-slate-300">Ja, optimiert für mobile Geräte.</dd>
                  </div>
                  <div>
                    <dt class="font-semibold">Wie sicher sind meine Daten?</dt>
                    <dd class="text-slate-300">DSGVO‑konform, verschlüsselte Übertragung.</dd>
                  </div>
                </dl>
              </div>
            </section>`,
        });

        bm.add('cta', {
          label: 'CTA',
          category: 'NeXify',
          content: `
            <section class="bg-slate-800 text-slate-50 py-12">
              <div class="max-w-5xl mx-auto px-6 text-center">
                <h2 class="text-2xl font-bold">Bereit, loszulegen?</h2>
                <p class="mt-2 text-slate-300">Testen Sie MyDispatch jetzt kostenlos.</p>
                <a class="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg" href="#">Kostenlos testen</a>
              </div>
            </section>`,
        });

        setEditor(e);
      } catch (error) {
        logger.error('[PageBuilder] GrapesJS Init failed', error as Error);
      }
    }

    init();

    return () => {
      disposed = true;
      try {
        editor?.destroy?.();
      } catch {}
    };
  }, []);

  const handleExport = () => {
    try {
      if (!editor) return;
      const html = editor.getHtml();
      const css = editor.getCss();
      logger.info('[PageBuilder] Export', { htmlLength: html.length, cssLength: css.length });
      // Simple developer-friendly export: show in a modal or download
      const blob = new Blob([`<style>${css}</style>\n${html}`], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'page-builder-export.html';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      logger.error('[PageBuilder] Export failed', e as Error);
    }
  };

  const gated = !isEnabled && !force;

  return (
    <StandardPageLayout
      title="Page Builder"
      description="Visueller Seiteneditor (GrapesJS) – hinter Feature-Flag geschützt"
      subtitle="Schnell Inhalte erstellen und fehlerhafte Bereiche ersetzen"
      heroBadge={<Badge className="uppercase">Beta</Badge>}
      searchValue={''}
      onSearchChange={() => {}}
      background="canvas"
      headerExtra={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">Flag:</span>
            <Switch
              checked={Boolean(flags?.page_builder)}
              onCheckedChange={(checked) => toggleFeatureFlag('page_builder', checked)}
            />
            <Badge variant="outline" className="ml-1">
              {flags?.page_builder ? 'Aktiv' : 'Inaktiv'}
            </Badge>
          </div>
          <Button variant="secondary" onClick={handleExport} disabled={!editor}>Exportieren</Button>
        </div>
      }
    >
      {gated ? (
        <Alert className="mb-4">
          <AlertDescription>
            Der Page Builder ist aktuell deaktiviert. Aktivieren Sie den Feature-Flag
            <code className="mx-1">page_builder</code> oder rufen Sie die Seite mit
            <code className="mx-1">?force=1</code> auf.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="rounded-xl border border-slate-800 bg-slate-900/60">
        <div ref={editorEl} className="min-h-[60vh] w-full" />
      </div>
    </StandardPageLayout>
  );
}
