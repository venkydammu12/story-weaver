import { motion } from "framer-motion";
import { ArrowLeft, Headphones, BookOpen } from "lucide-react";
import { useState } from "react";

interface StoryReaderProps {
  onBack?: () => void;
}

const storyContent = {
  title: "The Last Light of Hyderabad",
  author: "Raghav Krishna",
  chapters: [
    {
      title: "Chapter One",
      subtitle: "The Beginning of Dusk",
      paragraphs: [
        "The ancient stones of the Charminar stood silent as the sun began its descent, painting the sky in shades of amber and deep crimson. Arjun watched from the rooftop of his family's haveli, the city spread before him like a tapestry woven with centuries of stories.",
        "He had always loved this hour—the moment when day surrendered to night, when the call to prayer echoed across the old city and the lights began to flicker on like earthbound stars. But tonight, something felt different. A weight hung in the air, heavy with secrets yet to be revealed.",
        "His grandmother had spoken of such nights. Nights when the veil between past and present grew thin, when the ghosts of the Nizam's court still walked the marble halls of the Falaknuma Palace. Arjun had dismissed her tales as the fancies of an aging mind, but now, watching the shadows lengthen across the Musi river, he wasn't so certain.",
        "The letter had arrived that morning—yellowed paper sealed with wax bearing an insignia he didn't recognize. Inside, a single line written in elegant Urdu script: 'The keeper of secrets awaits the heir at the hour of the last light.'",
        "Arjun traced the words again, feeling the slight indentation of the pen strokes beneath his fingertips. Someone knew. Someone remembered what his family had worked so hard to forget.",
      ],
    },
  ],
};

export const StoryReader = ({ onBack }: StoryReaderProps) => {
  const [showControls, setShowControls] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentLine, setCurrentLine] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen"
    >
      {/* Floating back button */}
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </motion.button>

      {/* Story content */}
      <article className="max-w-2xl mx-auto px-8 py-32 md:py-40">
        {/* Title block */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-16 md:mb-24 text-center"
        >
          <p className="text-primary/70 spacing-cinematic text-xs uppercase mb-4">
            {storyContent.author}
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-foreground mb-8">
            {storyContent.title}
          </h1>
          <div className="w-16 h-px bg-primary/30 mx-auto" />
        </motion.header>

        {/* Chapter */}
        {storyContent.chapters.map((chapter, chapterIndex) => (
          <motion.section
            key={chapterIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="mb-12">
              <p className="text-muted-foreground spacing-cinematic text-xs uppercase mb-2">
                {chapter.title}
              </p>
              <h2 className="font-display text-xl md:text-2xl text-foreground italic">
                {chapter.subtitle}
              </h2>
            </div>

            <div className="space-y-6">
              {chapter.paragraphs.map((paragraph, pIndex) => (
                <motion.p
                  key={pIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + pIndex * 0.1 }}
                  className={`text-foreground/90 leading-[1.9] text-lg font-body transition-all duration-500 ${
                    currentLine === pIndex
                      ? "text-foreground bg-primary/5 -mx-4 px-4 py-2 rounded border-l-2 border-primary/40"
                      : ""
                  }`}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </motion.section>
        ))}
      </article>

      {/* Floating control panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex items-center gap-4 bg-card/80 backdrop-blur-lg border border-border/30 rounded-full px-6 py-3">
          {/* Listen button */}
          <motion.button
            onClick={() => {
              setIsListening(!isListening);
              setCurrentLine(isListening ? null : 0);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              isListening
                ? "bg-primary/20 text-primary"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span className="text-xs spacing-cinematic uppercase">
              {isListening ? "Listening" : "Listen"}
            </span>
          </motion.button>

          <div className="w-px h-6 bg-border/50" />

          {/* Read options button */}
          <motion.button
            onClick={() => setShowControls(!showControls)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-xs spacing-cinematic uppercase">Options</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Listening indicator */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-8 right-8 flex items-center gap-3"
        >
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: [8, 16, 8],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-1 bg-primary rounded-full"
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Narrating...</span>
        </motion.div>
      )}
    </motion.div>
  );
};
