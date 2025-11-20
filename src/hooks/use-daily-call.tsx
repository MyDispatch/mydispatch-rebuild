/* ==================================================================================
   DAILY.CO CALL HOOK
   ==================================================================================
   React Hook für Daily.co WebRTC-Integration
   ================================================================================== */

import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { handleError, handleSuccess, handleInfo } from "@/lib/error-handler";
import { logger } from "@/lib/logger";

interface DailyCallOptions {
  conversationId: string;
  participantNames?: string[];
  onJoined?: () => void;
  onLeft?: () => void;
  onParticipantJoined?: (participant: any) => void;
  onParticipantLeft?: (participant: any) => void;
  onError?: (error: Error) => void;
}

interface CallState {
  isConnecting: boolean;
  isConnected: boolean;
  roomUrl: string | null;
  participants: any[];
  localParticipant: any | null;
  error: string | null;
}

export function useDailyCall(options: DailyCallOptions) {
  // CRITICAL FIX V18.2.28: Defensive React Check (präventiv)
  if (typeof React === "undefined" || !React.useState || !React.useEffect) {
    logger.error("[useDailyCall] React Hooks nicht verfügbar", undefined, {
      component: "useDailyCall",
    });
    // Fallback: Return dummy state
    return {
      callState: {
        isConnecting: false,
        isConnected: false,
        roomUrl: null,
        participants: [],
        localParticipant: null,
        error: "React nicht verfügbar",
      },
      iframeRef: { current: null },
      joinCall: async () => {},
      leaveCall: async () => {},
      toggleVideo: async () => {},
      toggleAudio: async () => {},
      startScreenShare: async () => {},
      stopScreenShare: async () => {},
    };
  }

  const [callState, setCallState] = React.useState<CallState>({
    isConnecting: false,
    isConnected: false,
    roomUrl: null,
    participants: [],
    localParticipant: null,
    error: null,
  });

  const callFrameRef = React.useRef<any>(null);
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

  // Load Daily.co script
  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@daily-co/daily-js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const createRoom = React.useCallback(async () => {
    try {
      setCallState((prev) => ({ ...prev, isConnecting: true, error: null }));

      const { data, error } = await supabase.functions.invoke("create-daily-room", {
        body: {
          conversationId: options.conversationId,
          participantNames: options.participantNames,
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Failed to create room");

      return data.room.url;
    } catch (error: any) {
      const errorMsg = error.message || "Fehler beim Erstellen des Raums";
      handleError(error, errorMsg);
      setCallState((prev) => ({ ...prev, error: errorMsg, isConnecting: false }));
      options.onError?.(error);
      return null;
    }
  }, [options]);

  const joinCall = React.useCallback(async () => {
    try {
      // Check if Daily.co SDK is loaded
      const DailyIframe = (window as any).DailyIframe;
      if (!DailyIframe) {
        throw new Error("Daily.co SDK not loaded");
      }

      const roomUrl = await createRoom();
      if (!roomUrl) return;

      const callFrame = DailyIframe.createFrame(iframeRef.current, {
        showLeaveButton: true,
        iframeStyle: {
          width: "100%",
          height: "100%",
          border: "0",
          borderRadius: "8px",
        },
      });

      callFrameRef.current = callFrame;

      // Event Listeners
      callFrame.on("joined-meeting", (event: any) => {
        setCallState((prev) => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          localParticipant: event.participants.local,
        }));
        options.onJoined?.();
        handleSuccess("Mit Anruf verbunden");
      });

      callFrame.on("participant-joined", (event: any) => {
        setCallState((prev) => ({
          ...prev,
          participants: [...prev.participants, event.participant],
        }));
        options.onParticipantJoined?.(event.participant);
      });

      callFrame.on("participant-left", (event: any) => {
        setCallState((prev) => ({
          ...prev,
          participants: prev.participants.filter(
            (p) => p.session_id !== event.participant.session_id
          ),
        }));
        options.onParticipantLeft?.(event.participant);
      });

      callFrame.on("left-meeting", () => {
        setCallState((prev) => ({
          ...prev,
          isConnected: false,
          roomUrl: null,
          participants: [],
          localParticipant: null,
        }));
        options.onLeft?.();
        handleInfo("Anruf beendet");
      });

      callFrame.on("error", (event: any) => {
        const error = new Error(event.errorMsg || "Call error");
        handleError(error, "Anruffehler: " + event.errorMsg);
        setCallState((prev) => ({ ...prev, error: event.errorMsg }));
        options.onError?.(error);
      });

      // Join the room
      await callFrame.join({ url: roomUrl });

      setCallState((prev) => ({ ...prev, roomUrl }));
    } catch (error: any) {
      handleError(error, "Fehler beim Beitritt: " + error.message);
      setCallState((prev) => ({
        ...prev,
        error: error.message,
        isConnecting: false,
      }));
      options.onError?.(error);
    }
  }, [createRoom, options]);

  const leaveCall = React.useCallback(async () => {
    try {
      if (callFrameRef.current) {
        await callFrameRef.current.leave();
        await callFrameRef.current.destroy();
        callFrameRef.current = null;
      }
    } catch (error: any) {
      handleError(error, "Fehler beim Verlassen des Anrufs");
    }
  }, []);

  const toggleVideo = React.useCallback(async () => {
    if (!callFrameRef.current) return;
    try {
      const localVideo = callFrameRef.current.localVideo();
      await callFrameRef.current.setLocalVideo(!localVideo);
    } catch (error: any) {
      handleError(error, "Fehler beim Umschalten des Videos", { showToast: false });
    }
  }, []);

  const toggleAudio = React.useCallback(async () => {
    if (!callFrameRef.current) return;
    try {
      const localAudio = callFrameRef.current.localAudio();
      await callFrameRef.current.setLocalAudio(!localAudio);
    } catch (error: any) {
      handleError(error, "Fehler beim Umschalten des Audios", { showToast: false });
    }
  }, []);

  const startScreenShare = React.useCallback(async () => {
    if (!callFrameRef.current) return;
    try {
      await callFrameRef.current.startScreenShare();
      handleSuccess("Bildschirmfreigabe gestartet");
    } catch (error: any) {
      handleError(error, "Bildschirmfreigabe fehlgeschlagen");
    }
  }, []);

  const stopScreenShare = React.useCallback(async () => {
    if (!callFrameRef.current) return;
    try {
      await callFrameRef.current.stopScreenShare();
      handleInfo("Bildschirmfreigabe beendet");
    } catch (error: any) {
      handleError(error, "Fehler beim Beenden der Bildschirmfreigabe");
    }
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.destroy();
      }
    };
  }, []);

  return {
    callState,
    iframeRef,
    joinCall,
    leaveCall,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare,
  };
}
