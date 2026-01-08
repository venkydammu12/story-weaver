import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Headphones, Languages, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StoryReaderProps {
  storyId?: string;
  onBack?: () => void;
}

type Language = "english" | "telugu" | "hindi";

const languageLabels: Record<Language, string> = {
  english: "English",
  telugu: "తెలుగు",
  hindi: "हिंदी",
};

export const StoryReader = ({ storyId, onBack }: StoryReaderProps) => {
  const [showLanguagePanel, setShowLanguagePanel] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("english");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fetch story from database
  const { data: story, isLoading } = useQuery({
    queryKey: ["story", storyId],
    queryFn: async () => {
      if (!storyId) return null;
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("id", storyId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!storyId,
  });

  const handleLanguageChange = (language: Language) => {
    if (language === selectedLanguage) {
      setShowLanguagePanel(false);
      return;
    }
    
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedLanguage(language);
      setIsTransitioning(false);
      setShowLanguagePanel(false);
    }, 300);
  };

  // Split content into paragraphs
  const paragraphs = story?.content?.split('\n').filter(p => p.trim()) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Story not found</p>
        <button onClick={onBack} className="text-primary hover:underline">
          Go back
        </button>
      </div>
    );
  }

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

      {/* Current language indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed top-8 right-8 z-40"
      >
        <span className="text-xs text-muted-foreground spacing-cinematic uppercase">
          {languageLabels[selectedLanguage]}
        </span>
      </motion.div>

      {/* Story content */}
      <motion.article 
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto px-8 py-32 md:py-40"
      >
        {/* Title block */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-16 md:mb-24 text-center"
        >
          <p className="text-primary/70 spacing-cinematic text-xs uppercase mb-4">
            Author
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-foreground mb-8">
            {story.title}
          </h1>
          <div className="w-16 h-px bg-primary/30 mx-auto" />
        </motion.header>

        {/* Story paragraphs */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="space-y-6">
            {paragraphs.map((paragraph, pIndex) => (
              <motion.p
                key={pIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + pIndex * 0.05 }}
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
      </motion.article>

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

          {/* Language options button */}
          <motion.button
            onClick={() => setShowLanguagePanel(!showLanguagePanel)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              showLanguagePanel
                ? "bg-primary/20 text-primary"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Languages className="w-4 h-4" />
            <span className="text-xs spacing-cinematic uppercase">Language</span>
          </motion.button>
        </div>

        {/* Language selection panel */}
        <AnimatePresence>
          {showLanguagePanel && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-card/95 backdrop-blur-lg border border-border/30 rounded-2xl p-2 min-w-[200px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
                <span className="text-xs text-muted-foreground spacing-cinematic uppercase">
                  Select Language
                </span>
                <button
                  onClick={() => setShowLanguagePanel(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Language options */}
              <div className="p-2 space-y-1">
                {(Object.keys(languageLabels) as Language[]).map((lang) => (
                  <motion.button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    whileHover={{ x: 4 }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                      selectedLanguage === lang
                        ? "bg-primary/15 text-primary"
                        : "hover:bg-muted/50 text-foreground/80 hover:text-foreground"
                    }`}
                  >
                    <span className="font-medium">{languageLabels[lang]}</span>
                    {selectedLanguage === lang && (
                      <motion.div
                        layoutId="selectedLang"
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Listening indicator */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-card/80 backdrop-blur-lg border border-border/30 rounded-full px-4 py-2"
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
