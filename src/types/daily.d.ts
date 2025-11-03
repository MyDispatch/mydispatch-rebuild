/* ==================================================================================
   DAILY.CO TYPE DEFINITIONS
   ==================================================================================
   Global Window interface für Daily.co WebRTC SDK
   ================================================================================== */

interface DailyCallFrame {
  join(options?: any): Promise<void>;
  leave(): Promise<void>;
  destroy(): Promise<void>;
  on(event: string, callback: (event?: any) => void): DailyCallFrame;
  off(event: string, callback: (event?: any) => void): DailyCallFrame;
  participants(): Record<string, any>;
  updateInputSettings(settings: any): Promise<void>;
  setLocalVideo(enabled: boolean): Promise<void>;
  setLocalAudio(enabled: boolean): Promise<void>;
}

interface DailyIframeOptions {
  showLeaveButton?: boolean;
  iframeStyle?: {
    width?: string;
    height?: string;
    border?: string;
    borderRadius?: string;
  };
}

interface Window {
  DailyIframe?: {
    createFrame(element: HTMLElement | null, options?: DailyIframeOptions): DailyCallFrame;
    wrap(element: HTMLIFrameElement, options?: any): DailyCallFrame;
  };
}
