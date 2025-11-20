/* ==================================================================================
   KOMMUNIKATIONSSYSTEM - Call Interface Component
   ==================================================================================
   Audio/Video-Call UI mit Daily.co WebRTC-Integration
   ================================================================================== */

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/lib/compat";
import { V28Button } from "@/components/design-system/V28Button";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor } from "lucide-react";
import { useDailyCall } from "@/hooks/use-daily-call";

interface CallInterfaceProps {
  open: boolean;
  callType: "audio" | "video";
  conversationId: string;
  participantName: string;
  onClose: () => void;
}

export function CallInterface({
  open,
  callType,
  conversationId,
  participantName,
  onClose,
}: CallInterfaceProps) {
  const [shouldInitCall, setShouldInitCall] = useState(false);

  const { callState, iframeRef, joinCall, leaveCall, toggleVideo, toggleAudio, startScreenShare } =
    useDailyCall({
      conversationId,
      participantNames: [participantName],
      onJoined: () => {
        // Call joined successfully
      },
      onLeft: () => {
        onClose();
      },
      onError: () => {
        // Error handled in useDailyCall Hook
      },
    });

  const handleJoinCall = () => {
    setShouldInitCall(true);
    joinCall();
  };

  const handleEndCall = async () => {
    await leaveCall();
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[700px] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {callType === "video" ? "Videoanruf" : "Sprachanruf"} mit {participantName}
          </DialogTitle>
          <DialogDescription>
            {callState.isConnecting && "Verbinde mit Anruf..."}
            {callState.isConnected && "Verbunden"}
            {callState.error && `Fehler: ${callState.error}`}
          </DialogDescription>
        </DialogHeader>

        {/* Daily.co iFrame Container */}
        <div className="flex-1 bg-video-background relative overflow-hidden">
          {!shouldInitCall && !callState.isConnected && !callState.isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-video-background z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  {callType === "video" ? (
                    <Video className="h-12 w-12 text-video-foreground" />
                  ) : (
                    <Mic className="h-12 w-12 text-video-foreground" />
                  )}
                </div>
                <p className="text-video-foreground text-lg">
                  {callType === "video" ? "Videoanruf" : "Sprachanruf"} mit {participantName}
                </p>
                <V28Button onClick={handleJoinCall} size="lg" variant="primary" className="mt-2">
                  Anruf starten
                </V28Button>
              </div>
            </div>
          )}

          {callState.isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-video-background z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-video-foreground text-lg">Verbinde...</p>
              </div>
            </div>
          )}

          {callState.error && (
            <div className="absolute inset-0 flex items-center justify-center bg-video-background z-10">
              <div className="flex flex-col items-center gap-4 text-center px-4">
                <PhoneOff className="h-16 w-16 text-destructive" />
                <p className="text-video-foreground text-lg">Verbindung fehlgeschlagen</p>
                <p className="text-muted-foreground text-sm">{callState.error}</p>
                <V28Button onClick={handleEndCall} variant="secondary">
                  Schließen
                </V28Button>
              </div>
            </div>
          )}

          {/* Daily.co iFrame */}
          <iframe
            ref={iframeRef}
            className="w-full h-full"
            allow="camera; microphone; fullscreen; display-capture; autoplay"
          />
        </div>

        {/* Custom Controls (Optional - Daily.co has built-in controls) */}
        {callState.isConnected && (
          <div className="flex items-center justify-center gap-3 py-4 px-6 bg-background border-t">
            <V28Button
              variant="secondary"
              size="lg"
              className="rounded-full h-12 w-12"
              onClick={toggleAudio}
            >
              {callState.localParticipant?.audio ? (
                <Mic className="h-5 w-5" />
              ) : (
                <MicOff className="h-5 w-5" />
              )}
            </V28Button>

            {callType === "video" && (
              <>
                <V28Button
                  variant="secondary"
                  size="lg"
                  className="rounded-full h-12 w-12"
                  onClick={toggleVideo}
                >
                  {callState.localParticipant?.video ? (
                    <Video className="h-5 w-5" />
                  ) : (
                    <VideoOff className="h-5 w-5" />
                  )}
                </V28Button>

                <V28Button
                  variant="secondary"
                  size="lg"
                  className="rounded-full h-12 w-12"
                  onClick={startScreenShare}
                >
                  <Monitor className="h-5 w-5" />
                </V28Button>
              </>
            )}

            <V28Button
              variant="primary"
              size="lg"
              className="rounded-full h-12 w-12 bg-red-600 hover:bg-red-700"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-5 w-5" />
            </V28Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
