/* ==================================================================================
   DAILY.CO ROOM MANAGEMENT - Edge Function
   ==================================================================================
   Erstellt/Verwaltet Daily.co Video-Call-Räume
   ================================================================================== */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DAILY_API_KEY = Deno.env.get("DAILY_API_KEY");
    if (!DAILY_API_KEY) {
      throw new Error("DAILY_API_KEY not configured");
    }

    const { conversationId, participantNames } = await req.json();

    if (!conversationId) {
      throw new Error("conversationId is required");
    }

    const roomName = `mydispatch-${conversationId}`;

    // V18.3: P0.1 - Check if room already exists
    const existingRoomResponse = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
    });

    // If room exists and is not expired, return it
    if (existingRoomResponse.ok) {
      const existingRoom = await existingRoomResponse.json();
      console.log("Daily.co room already exists, reusing:", existingRoom.name);

      return new Response(
        JSON.stringify({
          success: true,
          room: {
            name: existingRoom.name,
            url: existingRoom.url,
            expires: existingRoom.config.exp,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // V18.3: P0.2 - Create new room if it doesn't exist
    console.log("Creating new Daily.co room:", roomName);
    const roomResponse = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        name: roomName,
        privacy: "private",
        properties: {
          max_participants: 10,
          enable_screenshare: true,
          enable_chat: false, // Use our own chat
          enable_knocking: false,
          start_video_off: false,
          start_audio_off: false,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // 2 Stunden Ablauf
        },
      }),
    });

    if (!roomResponse.ok) {
      const errorText = await roomResponse.text();
      console.error("Daily.co API Error:", errorText);
      throw new Error(`Failed to create room: ${roomResponse.status}`);
    }

    const roomData = await roomResponse.json();

    console.log("Daily.co room created:", {
      name: roomData.name,
      url: roomData.url,
      participants: participantNames,
    });

    return new Response(
      JSON.stringify({
        success: true,
        room: {
          name: roomData.name,
          url: roomData.url,
          expires: roomData.config.exp,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating Daily.co room:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
