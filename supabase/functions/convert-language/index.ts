import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, targetLanguage } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: "Missing text or targetLanguage" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const languageMap: Record<string, string> = {
      english: "English",
      telugu: "Telugu (తెలుగు)",
      hindi: "Hindi (हिंदी)",
    };

    const targetLangName = languageMap[targetLanguage] || targetLanguage;

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
          { role: "user", content: `Convert this text to proper ${targetLangName}:\n\n${text}` },
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
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI conversion failed");
    }

    const data = await response.json();
    const convertedText = data.choices?.[0]?.message?.content || text;

    return new Response(
      JSON.stringify({ convertedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("convert-language error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
