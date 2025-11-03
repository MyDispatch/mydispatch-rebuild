/* ==================================================================================
   SIDEBAR AI CHAT TRIGGER - KOMPAKTER CHAT-TRIGGER FÜR SIDEBAR
   ==================================================================================
   ✅ Fake-Input öffnet großes Modal
   ✅ Kompaktes Design für Sidebar (320px)
   ✅ V28.1 Design System
   ================================================================================== */

import { useState } from 'react';
import { Bot } from 'lucide-react';
import { AIChatDialog } from './AIChatDialog';

export function SidebarAIChatTrigger() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700">AI-Assistent</label>
        <div
          onClick={() => setModalOpen(true)}
          className="cursor-pointer p-3 border border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-slate-500" />
            <input
              placeholder="Frage stellen..."
              className="pointer-events-none bg-transparent text-sm text-slate-500 w-full outline-none"
              readOnly
            />
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Klicken Sie hier, um den AI-Chat zu öffnen
        </p>
      </div>

      <AIChatDialog open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
