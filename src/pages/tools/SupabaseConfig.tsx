import { SupabaseConfigPanel } from '@/components/debug/SupabaseConfigPanel';

export default function SupabaseConfigPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <SupabaseConfigPanel onClose={() => history.back()} />
    </div>
  );
}

