import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PosterCard } from "@/components/PosterCard";
import { LanguageSelector } from "@/components/LanguageSelector";
import { stories, Language } from "@/data/stories";

const StoriesPosters = () => {
  const [language, setLanguage] = useState<Language>("en");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 bg-background/80 backdrop-blur-xl border-b border-border/20"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate("/")}
            whileHover={{ x: -4 }}
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </motion.button>

          {/* Language Selector */}
          <LanguageSelector
            currentLanguage={language}
            onLanguageChange={setLanguage}
          />
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16 md:mb-24 text-center"
          >
            <p className="text-primary/70 spacing-cinematic text-xs uppercase mb-4">
              The Collection
            </p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground mb-6">
              Story Posters
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
              Explore our cinematic collection of stories. Each poster represents a unique journey waiting to unfold.
            </p>
          </motion.header>

          {/* Poster Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {stories.map((story, index) => (
              <PosterCard
                key={story.id}
                story={story}
                language={language}
                index={index}
              />
            ))}
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-24 text-center"
          >
            <p className="text-muted-foreground/50 text-xs spacing-cinematic uppercase">
              More stories coming soon
            </p>
          </motion.div>
        </div>
      </main>

      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {/* Top gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-[50vh]"
          style={{
            background: "radial-gradient(ellipse at top, hsl(350 40% 8% / 0.5) 0%, transparent 70%)",
          }}
        />
        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[30vh]"
          style={{
            background: "linear-gradient(to top, hsl(0 0% 0%) 0%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
};

export default StoriesPosters;
