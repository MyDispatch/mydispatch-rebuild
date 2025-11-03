/* ==================================================================================
   AI CHAT DIALOG - VOLLSTÄNDIGES CHAT-MODAL
   ==================================================================================
   ✅ Großes zentriertes Modal (800x600px)
   ✅ useAIChat Hook für State-Management
   ✅ V28.1 Design System
   ✅ Streaming-Antworten
   ================================================================================== */

import { useAIChat } from '@/hooks/use-ai-chat';
import { V28Button } from '@/components/design-system/V28Button';
import { V28DialogWrapper } from '@/components/dialogs/V28DialogWrapper';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIChatDialog({ open, onOpenChange }: AIChatDialogProps) {
  const { messages, input, setInput, isLoading, sendMessage, messagesEndRef } = useAIChat();

  return (
    <V28DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      title="AI-Assistent"
      description="Stellen Sie Fragen zu MyDispatch und erhalten Sie sofortige Hilfe"
      size="xl"
      closeOnOutsideClick={false}
    >
      <div className="flex flex-col h-[500px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-slate-50 rounded-lg">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                'flex gap-3',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-slate-700" />
                </div>
              )}
              <div
                className={cn(
                  'px-4 py-3 rounded-lg text-sm max-w-[70%]',
                  msg.role === 'user'
                    ? 'bg-slate-700 text-white'
                    : 'bg-white text-slate-900 border border-slate-200'
                )}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ihre Frage..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-700 disabled:opacity-50"
          />
          <V28Button
            variant="primary"
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            Senden
          </V28Button>
        </div>
      </div>
    </V28DialogWrapper>
  );
}
