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

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Parse and validate request body
    const { title, content, language } = await req.json();

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Title is required and must be a non-empty string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Content is required and must be a non-empty string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize inputs
    const sanitizedTitle = title.trim().slice(0, 200);
    const sanitizedContent = content.trim().slice(0, 100000);
    const sanitizedLanguage = ["english", "telugu", "hindi"].includes(language)
      ? language
      : "english";

    const wordCount = sanitizedContent.split(/\s+/).filter(Boolean).length;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabaseAdmin
      .from("stories")
      .insert({
        title: sanitizedTitle,
        content: sanitizedContent,
        language: sanitizedLanguage,
        word_count: wordCount,
        is_published: true,
      })
      .select("id, title, created_at")
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to publish story" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        story: data,
        message: "Story published successfully!",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("publish-story error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
