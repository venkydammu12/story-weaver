import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { StoryCard } from "./StoryCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StoryWorldProps {
  onStorySelect?: (storyId: string) => void;
  onBack?: () => void;
}

export const StoryWorld = ({ onStorySelect, onBack }: StoryWorldProps) => {
  // Fetch published stories from database
  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["published-stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stories")
        .select("id, title, content, language, word_count, created_at")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data.map((story) => ({
        id: story.id,
        title: story.title,
        author: "Author",
        genre: "Story",
        duration: `${Math.ceil((story.word_count || 0) / 200)} min read`,
      }));
    },
  });

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen py-24 md:py-32 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Navigation Bar */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 bg-background/80 backdrop-blur-md border-b border-border/20"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm">Back</span>
            </button>
            
            <div />
          </div>
        </motion.nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <p className="text-primary/70 spacing-cinematic text-xs uppercase mb-4">
            The Collection
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground">
            Discover Stories
          </h2>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && stories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground text-lg">No published stories yet.</p>
            <p className="text-muted-foreground/60 text-sm mt-2">Be the first to publish a story!</p>
          </motion.div>
        )}

        {/* Stories Grid */}
        {!isLoading && stories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {stories.map((story, index) => (
              <StoryCard
                key={story.id}
                title={story.title}
                author={story.author}
                genre={story.genre}
                duration={story.duration}
                index={index}
                onClick={() => onStorySelect?.(story.id)}
              />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};