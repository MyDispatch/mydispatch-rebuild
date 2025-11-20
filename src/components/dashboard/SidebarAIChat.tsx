/* ==================================================================================
   SIDEBAR AI CHAT - KOMPAKTES CHAT-WIDGET FÜR DASHBOARD-SIDEBAR
   ==================================================================================
   ✅ Lovable AI Integration (google/gemini-2.5-flash)
   ✅ Streaming-Antworten
   ✅ Kompaktes Design für Sidebar (320px)
   ✅ Automatische Scroll-to-Bottom
   ✅ V28.1 Design System
   ================================================================================== */

import { useState, useRef, useEffect } from "react";
import { V28Button } from "@/components/design-system/V28Button";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function SidebarAIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hallo! Ich bin Ihr MyDispatch-Assistent. Wie kann ich Ihnen helfen?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dashboard-ai-assistant`;
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (response.status === 429) {
        toast({
          title: "Rate Limit erreicht",
          description: "Bitte versuchen Sie es in Kürze erneut.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (response.status === 402) {
        toast({
          title: "Credits aufgebraucht",
          description: "Bitte laden Sie Ihr Lovable AI Guthaben auf.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!response.ok || !response.body) {
        throw new Error("Stream-Fehler");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let assistantContent = "";

      // Erstelle leere Assistant-Message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content && typeof content === "string") {
              assistantContent += content;
              setMessages((prev) =>
                prev.map((m, i) =>
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                )
              );
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Fehler",
        description: "Nachricht konnte nicht gesendet werden.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border-b border-slate-200">
        <Bot className="h-4 w-4 text-slate-700" />
        <span className="text-sm font-semibold text-slate-900">AI-Assistent</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                <Bot className="h-3 w-3 text-slate-700" />
              </div>
            )}
            <div
              className={cn(
                "px-3 py-2 rounded-lg text-xs max-w-[80%]",
                msg.role === "user" ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-900"
              )}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-2 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Frage stellen..."
            disabled={isLoading}
            className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-700 disabled:opacity-50"
          />
          <V28Button
            variant="primary"
            size="sm"
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-3"
          >
            <Send className="h-3 w-3" />
          </V28Button>
        </div>
      </div>
    </div>
  );
}
