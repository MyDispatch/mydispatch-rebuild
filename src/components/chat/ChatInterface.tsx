/* ==================================================================================
   CHAT INTERFACE - V28.1 PROFESSIONAL DESIGN
   ==================================================================================
   ✅ V28.1 Slate Design System
   ✅ Message History with Scroll
   ✅ Input with Send Button
   ✅ Loading States
   ================================================================================== */

import { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";
import { V28Button } from "@/components/design-system/V28Button";
import { Input } from "@/lib/compat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { sanitizeMarkdown } from "@/lib/sanitize";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onClose: () => void;
}

export default function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Guten Tag! 👋

Ich bin MyDispatch AI und unterstütze Sie gerne bei allen Fragen rund um:

• **Funktionen & Features** unserer Dispositionssoftware
• **Tarife & Preise** für Ihr Unternehmen
• **Demo-Termine** vereinbaren
• **Technische Fragen** zur Plattform

MyDispatch – simply arrive

Wie kann ich Ihnen helfen?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestedQuestions = [
    "Wie kann ich MyDispatch testen?",
    "Welche Tarife gibt es?",
    "Ist MyDispatch DSGVO-konform?",
    "Wie funktioniert die Fahrzeugverwaltung?",
  ];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    const inputText = input;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-support-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY}`,
          },
          body: JSON.stringify({
            messages: messages.concat(userMessage).map((m) => ({
              role: m.role,
              content: m.content,
            })),
            context: JSON.stringify({
              page: { title: "Landing Page", description: "MyDispatch Homepage" },
              company: { name: "MyDispatch" },
            }),
            isPublicLanding: true,
            userName: "Besucher",
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Fehler beim Abrufen der Antwort");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let textBuffer = "";

      // Assistant-Message vorbereiten
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);

      // SSE-Stream verarbeiten
      while (true) {
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
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = assistantContent;
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Chat error:", error);
      }
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full sm:h-[450px] sm:max-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />{" "}
          {/* ✅ Status Exception */}
          <h3 className="font-semibold text-slate-900">Support Chat</h3>
        </div>
        <V28Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 rounded-full hover:bg-slate-100"
          aria-label="Chat schließen"
        >
          <X className="h-4 w-4" />
        </V28Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3 sm:p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, idx) => (
            <div key={message.id}>
              <div
                className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4",
                    message.role === "user"
                      ? "bg-slate-700 text-white"
                      : "bg-slate-100 text-slate-900"
                  )}
                >
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: sanitizeMarkdown(message.content) }}
                  />
                  <p
                    className={cn(
                      "text-xs mt-1",
                      message.role === "user" ? "text-slate-300" : "text-slate-500"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString("de-DE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Suggested Questions - only after first assistant message */}
              {idx === 0 && message.role === "assistant" && messages.length === 1 && (
                <div className="space-y-2 mt-4 ml-2">
                  <p className="text-xs text-slate-500 font-medium">Beliebte Fragen:</p>
                  {suggestedQuestions.map((q, i) => (
                    <V28Button
                      key={i}
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setInput(q);
                        setTimeout(() => handleSend(), 100);
                      }}
                      className="w-full text-left justify-start text-xs h-auto py-2 px-3 border-slate-200 hover:bg-slate-50"
                    >
                      {q}
                    </V28Button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 sm:p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nachricht eingeben..."
            disabled={isLoading}
            className="flex-1"
            aria-label="Chat-Nachricht"
          />
          <V28Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="sm"
            variant="primary"
            className="disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shrink-0 h-10 w-10"
            aria-label="Nachricht senden"
          >
            <Send className="h-4 w-4" />
          </V28Button>
        </div>
        <p className="text-xs text-slate-500 mt-2 hidden sm:block">Drücken Sie Enter zum Senden</p>
      </div>
    </div>
  );
}
