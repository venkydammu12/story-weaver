import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { StoryCard } from "./StoryCard";

interface StoryWorldProps {
  onStorySelect?: (storyId: string) => void;
  onBack?: () => void;
}

const stories = [
  {
    id: "1",
    title: "The Last Light of Hyderabad",
    author: "Raghav Krishna",
    genre: "Drama",
    duration: "25 min read",
  },
  {
    id: "2",
    title: "Whispers in the Godavari",
    author: "Anjali Reddy",
    genre: "Romance",
    duration: "18 min read",
  },
  {
    id: "3",
    title: "The Tiger's Shadow",
    author: "Vikram Rao",
    genre: "Thriller",
    duration: "32 min read",
  },
  {
    id: "4",
    title: "Songs of the Forgotten Temple",
    author: "Priya Devi",
    genre: "Mystery",
    duration: "22 min read",
  },
  {
    id: "5",
    title: "Between Two Monsoons",
    author: "Kiran Varma",
    genre: "Drama",
    duration: "28 min read",
  },
  {
    id: "6",
    title: "The Emperor's Final Dawn",
    author: "Arjun Naidu",
    genre: "Historical",
    duration: "35 min read",
  },
];

export const StoryWorld = ({ onStorySelect, onBack }: StoryWorldProps) => {
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
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-primary animate-glow-pulse" />
              </div>
              <span className="font-display text-lg text-foreground">Narrativa</span>
            </div>
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

        {/* Stories Grid */}
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
      </div>
    </motion.section>
  );
};
