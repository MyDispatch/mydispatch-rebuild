import { useState, useRef, useEffect } from 'react'
import { useNeXifyAI } from '../hooks/useNeXifyAI'
import { Send, Bot, User } from 'lucide-react'
import type { ChatMessage } from '../types'

export function Chat() {
  const { executeCommand, agentStatus } = useNeXifyAI()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'system',
      content: 'Willkommen! Ich bin NeXifyAI MASTER. Wie kann ich dir helfen?',
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const result = await executeCommand(input)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.result?.message || 'Befehl ausgeführt',
        timestamp: new Date().toISOString(),
        command_id: result.id,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Chat mit NeXifyAI MASTER</h1>
        <p className="mt-2 text-slate-600">
          Status: {agentStatus.online ? (
            <span className="text-green-600">Online</span>
          ) : (
            <span className="text-red-600">Offline</span>
          )}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role !== 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-slate-900 text-white'
                  : message.role === 'system'
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-slate-100 text-slate-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="mt-1 text-xs opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-slate-100 rounded-lg px-4 py-2">
              <p className="text-slate-600">Denkt nach...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Gib einen Befehl ein..."
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          disabled={loading || !agentStatus.online}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim() || !agentStatus.online}
          className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          Senden
        </button>
      </div>
    </div>
  )
}
