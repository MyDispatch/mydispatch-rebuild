import { FormEvent, useEffect, useRef, useState } from "react";

import {
  bootstrapConversation,
  sendAgentMessage,
  type AgentMessage
} from "@/lib/masterAgent";
import { toast } from "@/lib/toast";

export function ChatPanel() {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("Erstelle einen Master-Statusbericht.");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const bootstrap = await bootstrapConversation();
        setMessages(bootstrap);
      } catch (error) {
        console.error(error);
        toast({
          title: "Agent konnte nicht initialisiert werden",
          description: (error as Error)?.message ?? "Bitte Monitoring prüfen",
          variant: "error"
        });
      }
    }

    init().catch(console.error);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) {
      return;
    }

    const userMessage: AgentMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const assistantMessage = await sendAgentMessage(userMessage.content);
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      toast({
        title: "Antwort fehlgeschlagen",
        description: (error as Error)?.message ?? "Bitte Edge Function prüfen",
        variant: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/70">
      <header className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">NeXifyAI MASTER</h2>
          <p className="text-xs text-slate-400">Forget-Proof Session & Wissens-Checks aktiv</p>
        </div>
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
          Online
        </span>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`max-w-[85%] rounded-xl border px-4 py-3 text-sm leading-relaxed shadow-sm ${
              message.role === "assistant"
                ? "ml-auto border-primary-500/40 bg-primary-500/15 text-primary-50"
                : message.role === "user"
                  ? "border-slate-700 bg-slate-800 text-slate-100"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-100"
            }`}
          >
            <p>{message.content}</p>
            <p className="mt-2 text-[10px] uppercase tracking-wide text-slate-300 opacity-70">
              {message.role} · {new Date(message.createdAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </article>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t border-slate-800 p-4">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Gib dem Master einen Auftrag (z.B. 'Analysiere Deployment-Status')"
            rows={2}
            className="min-h-[72px] flex-1 resize-none rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="h-11 rounded-xl bg-primary-500 px-4 text-sm font-semibold text-white transition hover:bg-primary-400 disabled:opacity-60"
          >
            {isLoading ? "Sendet…" : "Senden"}
          </button>
        </div>
      </form>
    </section>
  );
}
