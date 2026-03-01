import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Reject non-POST methods
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Validate that a valid authorization header is present (accepts anon key or user JWT)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { text, targetLanguage } = body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate inputs
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!targetLanguage || typeof targetLanguage !== "string") {
      return new Response(
        JSON.stringify({ error: "Target language is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize and limit input length
    const sanitizedText = text.trim().slice(0, 50000);
    const validLanguages = ["english", "telugu", "hindi"];
    const sanitizedLanguage = validLanguages.includes(targetLanguage.toLowerCase()) 
      ? targetLanguage.toLowerCase() 
      : "english";

    const languageMap: Record<string, string> = {
      english: "English",
      telugu: "Telugu (తెలుగు)",
      hindi: "Hindi (हिंदी)",
    };

    const targetLangName = languageMap[sanitizedLanguage] || "English";

    const systemPrompt = `You are a professional language editor and translator. Your task is to convert WhatsApp-style, informal, or transliterated text into proper, formal ${targetLangName}.

Rules:
1. If the input is in English letters representing ${targetLangName} sounds (like "nenu ela unnanu" for Telugu or "main kaise hoon" for Hindi), convert it to proper ${targetLangName} script.
2. Fix grammar, spelling, and punctuation.
3. Preserve the original meaning and emotional tone.
4. Make the text flow naturally and professionally.
5. If the text is already in proper ${targetLangName}, just clean it up for better readability.
6. For English target, convert informal/WhatsApp style to proper English.
7. Return ONLY the converted text, no explanations or notes.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Convert this text to proper ${targetLangName}:\n\n${sanitizedText}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "Conversion failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const convertedText = data.choices?.[0]?.message?.content || sanitizedText;

    return new Response(
      JSON.stringify({ convertedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Generic error - no stack traces
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
