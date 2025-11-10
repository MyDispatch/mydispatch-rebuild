import { useState } from 'react';
import { CollabToolbar } from '@/components/collab/CollabToolbar';
import { ResponsivePreview } from '@/components/collab/ResponsivePreview';
import { Textarea } from '@/components/ui/textarea';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useCollabDocument } from '@/hooks/use-collab-document';
import { executeFullGoLive } from '@/lib/run-phase-3-go-live';
import { handleError, handleSuccess } from '@/lib/api-utils';

type Mode = 'code' | 'preview' | 'split';

export default function CollabStudio() {
  const [mode, setMode] = useState<Mode>('split');
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const { state, presence, snapshots, updateSection, commitSnapshot, revertTo } = useCollabDocument({
    docId: 'global-design-session',
    author: 'Designer',
    initial: {
      html: '<section class="p-8"><h1 class="text-2xl font-bold">Neue Seite</h1><p class="mt-2 text-muted-foreground">Bearbeiten Sie HTML, CSS und JS gemeinsam.</p></section>',
      css: '.text-muted-foreground{color:#6b7280}.p-8{padding:2rem}.font-bold{font-weight:700}.text-2xl{font-size:1.5rem}',
      js: 'console.log("Collab Studio ready")',
    },
  });

  const onDeploy = async () => {
    try {
      const result = await executeFullGoLive();
      handleSuccess('Go-Live Prozess gestartet', `Score: ${result.validation.overall_score}`);
    } catch (err) {
      handleError(err, 'Deployment fehlgeschlagen');
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <CollabToolbar
        mode={mode}
        onModeChange={setMode}
        viewport={viewport}
        onViewportChange={setViewport}
        participants={presence}
        onCommitSnapshot={() => commitSnapshot('Design-Checkpoint')}
        onDeploy={onDeploy}
      />

      {mode === 'preview' && (
        <div className="flex-1 min-h-0">
          <ResponsivePreview html={state.html} css={state.css} js={state.js} viewport={viewport} />
        </div>
      )}

      {mode === 'code' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3">
          <div className="flex flex-col">
            <label className="text-sm mb-1">HTML</label>
            <Textarea value={state.html} onChange={(e) => updateSection('html', e.target.value)} className="min-h-[280px]" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm mb-1">CSS</label>
            <Textarea value={state.css} onChange={(e) => updateSection('css', e.target.value)} className="min-h-[280px]" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm mb-1">JavaScript</label>
            <Textarea value={state.js} onChange={(e) => updateSection('js', e.target.value)} className="min-h-[280px]" />
          </div>
        </div>
      )}

      {mode === 'split' && (
        <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
          <ResizablePanel defaultSize={55}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 h-full overflow-auto">
              <div className="flex flex-col">
                <label className="text-sm mb-1">HTML</label>
                <Textarea value={state.html} onChange={(e) => updateSection('html', e.target.value)} className="min-h-[180px]" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm mb-1">CSS</label>
                <Textarea value={state.css} onChange={(e) => updateSection('css', e.target.value)} className="min-h-[180px]" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm mb-1">JavaScript</label>
                <Textarea value={state.js} onChange={(e) => updateSection('js', e.target.value)} className="min-h-[180px]" />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={45}>
            <ResponsivePreview html={state.html} css={state.css} js={state.js} viewport={viewport} />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}

      <div className="px-3 py-2 border-t text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Version: v{state.version}</span>
          <span>Snapshots: {snapshots.length}</span>
        </div>
      </div>
    </div>
  );
}

