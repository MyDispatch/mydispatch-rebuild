import { ActivityTimeline } from "@/components/panels/ActivityTimeline";
import { ChatPanel } from "@/components/agent/ChatPanel";
import { ContextPanel } from "@/components/agent/ContextPanel";
import { WorkflowLauncher } from "@/components/agent/WorkflowLauncher";
import { SystemStatusBoard } from "@/components/monitoring/SystemStatusBoard";

export default function DashboardPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
        <ChatPanel />
        <WorkflowLauncher />
      </div>
      <div className="space-y-6">
        <ContextPanel />
        <SystemStatusBoard />
        <ActivityTimeline />
      </div>
    </div>
  );
}
