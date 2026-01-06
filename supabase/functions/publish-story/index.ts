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
    const { title, content, language } = await req.json();

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: "Title and content are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role key for admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create a system user ID for published stories (author without login)
    const authorUserId = "00000000-0000-0000-0000-000000000001";

    // Check if author profile exists, create if not
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", authorUserId)
      .single();

    if (!existingProfile) {
      await supabase.from("profiles").insert({
        user_id: authorUserId,
        display_name: "Author",
        email: "author@stories.app",
        is_author: true,
      });
    }

    // Calculate word count
    const wordCount = content.split(/\s+/).filter(Boolean).length;

    // Insert the published story
    const { data, error } = await supabase
      .from("stories")
      .insert({
        user_id: authorUserId,
        title,
        content,
        language: language || "english",
        word_count: wordCount,
        is_published: true,
      })
      .select("id, title, created_at")
      .single();

    if (error) {
      console.error("Database error:", error);
      throw new Error("Failed to publish story");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        story: data,
        message: "Story published successfully!" 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("publish-story error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
