import { motion } from "framer-motion";
import { StoryCard } from "./StoryCard";

interface StoryWorldProps {
  onStorySelect?: (storyId: string) => void;
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

export const StoryWorld = ({ onStorySelect }: StoryWorldProps) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen py-24 md:py-32 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
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
