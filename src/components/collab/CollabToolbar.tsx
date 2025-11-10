import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Users, Monitor, Smartphone, Tablet, GitCommit } from 'lucide-react';

type Mode = 'code' | 'preview' | 'split';
type Viewport = 'mobile' | 'tablet' | 'desktop';

interface Props {
  mode: Mode;
  onModeChange: (m: Mode) => void;
  viewport: Viewport;
  onViewportChange: (v: Viewport) => void;
  participants: { id: string; name?: string }[];
  onCommitSnapshot: () => void;
  onDeploy?: () => Promise<void> | void;
}

export function CollabToolbar({ mode, onModeChange, viewport, onViewportChange, participants, onCommitSnapshot, onDeploy }: Props) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
      <Tabs value={mode} onValueChange={(v) => onModeChange(v as Mode)}>
        <TabsList>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="preview">Vorschau</TabsTrigger>
          <TabsTrigger value="split">Split</TabsTrigger>
        </TabsList>
      </Tabs>

      <Separator orientation="vertical" className="mx-2 h-6" />

      <div className="flex items-center gap-1">
        <Button variant={viewport === 'mobile' ? 'default' : 'secondary'} size="sm" onClick={() => onViewportChange('mobile')}>
          <Smartphone className="mr-1 h-4 w-4" /> Mobil
        </Button>
        <Button variant={viewport === 'tablet' ? 'default' : 'secondary'} size="sm" onClick={() => onViewportChange('tablet')}>
          <Tablet className="mr-1 h-4 w-4" /> Tablet
        </Button>
        <Button variant={viewport === 'desktop' ? 'default' : 'secondary'} size="sm" onClick={() => onViewportChange('desktop')}>
          <Monitor className="mr-1 h-4 w-4" /> Desktop
        </Button>
      </div>

      <Separator orientation="vertical" className="mx-2 h-6" />

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm"><Users className="mr-1 h-4 w-4" /> Teilnehmer</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2">
            <div className="text-sm mb-2">Verbunden: {participants.length}</div>
            <div className="flex flex-col gap-1">
              {participants.map((p) => (
                <div key={p.id} className="flex items-center gap-2">
                  <Badge variant="secondary">{p.name || 'Anonym'}</Badge>
                  <span className="text-xs text-muted-foreground">{p.id.slice(0, 6)}</span>
                </div>
              ))}
              {participants.length === 0 && <div className="text-xs text-muted-foreground">Keine aktiven Teilnehmer</div>}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" variant="secondary" onClick={onCommitSnapshot}>
          <GitCommit className="mr-1 h-4 w-4" /> Version speichern
        </Button>

        {onDeploy && (
          <Button size="sm" onClick={() => onDeploy()}>
            🚀 Deploy
          </Button>
        )}
      </div>
    </div>
  );
}
