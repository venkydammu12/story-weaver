import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CinematicIntro } from "@/components/CinematicIntro";
import { CinematicNavigation } from "@/components/CinematicNavigation";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { StoryReveal } from "@/components/StoryReveal";

import { FinalInvitation } from "@/components/FinalInvitation";
import { StoryWorld } from "@/components/StoryWorld";
import { StoryReader } from "@/components/StoryReader";

type View = "landing" | "world" | "story";

const storyContent = [
  {
    title: "Where words become worlds",
    subtitle: "The Vision",
    description:
      "Every story deserves to be felt, not just read. We transform written narratives into immersive experiences that resonate with the soul.",
  },
  {
    title: "Voice. Emotion. Depth.",
    subtitle: "The Difference",
    description:
      "Our narrations are crafted with cinematic precision—mass intensity, emotional peaks, natural pauses. Stories that move you, literally.",
  },
  {
    title: "Your pace, your way",
    subtitle: "The Experience",
    description:
      "Read in silence or listen with emotion. Choose your tone, your language, your moment. The story adapts to you.",
  },
];

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState<View>("landing");
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  // Handle query param for entering world from other pages
  useEffect(() => {
    if (searchParams.get("view") === "world") {
      setCurrentView("world");
      // Clear the query param
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleEnterWorld = () => {
    setCurrentView("world");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStorySelect = (storyId: string) => {
    setSelectedStory(storyId);
    setCurrentView("story");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToWorld = () => {
    setCurrentView("world");
    setSelectedStory(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main 
      className="relative bg-background min-h-screen overflow-x-hidden"
      style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
    >
      <ParallaxBackground />

      <AnimatePresence mode="wait">
        {currentView === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <CinematicNavigation onEnterWorld={handleEnterWorld} />

            {/* Cinematic intro */}
            <CinematicIntro />

            {/* Story reveals */}
            {storyContent.map((content, index) => (
              <StoryReveal
                key={index}
                title={content.title}
                subtitle={content.subtitle}
                description={content.description}
                index={index}
              />
            ))}


            {/* Final invitation */}
            <FinalInvitation onEnter={handleEnterWorld} />

            {/* Footer */}
            <footer className="py-16 text-center">
              <p className="text-muted-foreground/50 text-xs spacing-cinematic uppercase">
                Narrativa — Stories that breathe
              </p>
            </footer>
          </motion.div>
        )}

        {currentView === "world" && (
          <motion.div
            key="world"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <StoryWorld 
              onStorySelect={handleStorySelect} 
              onBack={() => setCurrentView("landing")}
            />
          </motion.div>
        )}

        {currentView === "story" && selectedStory && (
          <motion.div
            key="story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <StoryReader storyId={selectedStory} onBack={handleBackToWorld} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Index;
