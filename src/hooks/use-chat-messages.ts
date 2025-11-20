/**
 * PROMETHEUS MISSION II: Chat Messages Hook (P0 Cluster 2)
 *
 * Replaces direct Supabase calls in ChatWindow.tsx
 * with TanStack Query mutations for message operations.
 *
 * Migration: Lines 193, 242 in src/components/chat/ChatWindow.tsx
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { handleError } from "@/lib/error-handler";

interface ChatMessage {
  conversation_id: string;
  sender_id: string;
  message_text: string;
  message_type: "text" | "file";
  file_url?: string;
}

interface UseChatMessagesReturn {
  sendMessage: (message: Omit<ChatMessage, "message_type" | "file_url">) => Promise<void>;
  sendFileMessage: (
    message: Omit<ChatMessage, "message_type"> & { file_url: string }
  ) => Promise<void>;
  isSending: boolean;
}

export function useChatMessages(conversationId: string): UseChatMessagesReturn {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async (message: ChatMessage) => {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert(message)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate messages query to show new message
      queryClient.invalidateQueries({ queryKey: ["chat-messages", conversationId] });
    },
    onError: (error) => {
      handleError(error, "Fehler beim Senden der Nachricht");
      console.error("[ChatMessages] Send failed:", error);
    },
  });

  const sendMessage = async (
    message: Omit<ChatMessage, "message_type" | "file_url">
  ): Promise<void> => {
    await sendMessageMutation.mutateAsync({
      ...message,
      message_type: "text",
    });
  };

  const sendFileMessage = async (
    message: Omit<ChatMessage, "message_type"> & { file_url: string }
  ): Promise<void> => {
    await sendMessageMutation.mutateAsync({
      ...message,
      message_type: "file",
    });
  };

  return {
    sendMessage,
    sendFileMessage,
    isSending: sendMessageMutation.isPending,
  };
}
