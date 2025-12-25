import { motion } from "framer-motion";

interface StoryCardProps {
  title: string;
  author: string;
  genre: string;
  duration: string;
  index: number;
  onClick?: () => void;
}

export const StoryCard = ({ title, author, genre, duration, index, onClick }: StoryCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.15, 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      viewport={{ once: true, margin: "-50px" }}
      onClick={onClick}
      className="story-card group cursor-pointer rounded-lg border border-border/30 p-6 md:p-8"
    >
      {/* Genre tag */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs spacing-cinematic uppercase text-primary/70">
          {genre}
        </span>
        <span className="text-xs text-muted-foreground">
          {duration}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display text-xl md:text-2xl lg:text-3xl text-foreground mb-3 group-hover:text-primary transition-colors duration-500">
        {title}
      </h3>

      {/* Author */}
      <p className="text-muted-foreground text-sm">
        by <span className="text-foreground/80">{author}</span>
      </p>

      {/* Hover line */}
      <div className="mt-6 pt-6 border-t border-border/20">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors duration-500">
            Enter story
          </span>
          <motion.div
            initial={{ width: 0 }}
            whileHover={{ width: 40 }}
            className="h-px bg-primary/50"
          />
        </div>
      </div>
    </motion.article>
  );
};
