import React from 'react';
import StudioEditor from '@grapesjs/studio-sdk/react';
import {
  tableComponent,
  listPagesComponent,
  fsLightboxComponent,
  lightGalleryComponent,
  swiperComponent,
  iconifyComponent,
  accordionComponent,
  flexComponent,
  rteProseMirror,
  canvasEmptyState,
  canvasFullSize,
  canvasGridMode,
  layoutSidebarButtons,
  youtubeAssetProvider,
} from '@grapesjs/studio-sdk-plugins';
import '@grapesjs/studio-sdk/style';

import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { useFeatureFlag, useFeatureFlags, toggleFeatureFlag } from '@/lib/feature-flags-client';
import { STUDIO_LICENSE_PUBLIC_KEY, STUDIO_DEFAULTS, getStudioProjectId, getStudioUserId } from '@/config/studio-sdk';

export default function StudioEditorPage() {
  const isEnabled = useFeatureFlag('studio_editor');
  const { flags } = useFeatureFlags();
  const location = useLocation();
  const force = new URLSearchParams(location.search).get('force') === '1';
  const gated = !isEnabled && !force;

  const projectId = getStudioProjectId();
  const userId = getStudioUserId();

  return (
    <StandardPageLayout
      title="Studio Editor"
      subtitle="Lizenzierter Editor mit Cloud‑Assets und erweiterten Komponenten"
      description="GrapesJS Studio SDK – hinter Feature‑Flag geschützt"
      heroBadge={<Badge className="uppercase">Beta</Badge>}
      background="canvas"
      searchValue={''}
      onSearchChange={() => {}}
      headerExtra={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">Studio‑Flag:</span>
            <Switch
              checked={Boolean(flags?.studio_editor)}
              onCheckedChange={(checked) => toggleFeatureFlag('studio_editor', checked)}
            />
            <Badge variant="outline" className="ml-1">
              {flags?.studio_editor ? 'Aktiv' : 'Inaktiv'}
            </Badge>
          </div>
          <Button variant="secondary" onClick={() => window.location.reload()}>Neu laden</Button>
        </div>
      }
    >
      {gated ? (
        <Alert className="mb-4">
          <AlertDescription>
            Der Studio Editor ist aktuell deaktiviert. Aktivieren Sie den Feature‑Flag
            <code className="mx-1">studio_editor</code> oder rufen Sie die Seite mit
            <code className="mx-1">?force=1</code> auf.
          </AlertDescription>
        </Alert>
      ) : null}

      {!gated && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60">
          <StudioEditor
            options={{
              licenseKey: STUDIO_LICENSE_PUBLIC_KEY,
              project: { type: STUDIO_DEFAULTS.projectType, id: projectId },
              identity: { id: userId },
              assets: { storageType: STUDIO_DEFAULTS.storageType },
              storage: {
                type: STUDIO_DEFAULTS.storageType,
                autosaveChanges: STUDIO_DEFAULTS.autosaveChanges,
                autosaveIntervalMs: STUDIO_DEFAULTS.autosaveIntervalMs,
              },
              plugins: [
                tableComponent.init({}),
                listPagesComponent.init({}),
                fsLightboxComponent.init({}),
                lightGalleryComponent.init({}),
                swiperComponent.init({}),
                iconifyComponent.init({}),
                accordionComponent.init({}),
                flexComponent.init({}),
                rteProseMirror.init({}),
                canvasEmptyState.init({}),
                canvasFullSize.init({}),
                canvasGridMode.init({}),
                layoutSidebarButtons.init({}),
                youtubeAssetProvider.init({}),
              ],
            }}
          />
        </div>
      )}
    </StandardPageLayout>
  );
}

