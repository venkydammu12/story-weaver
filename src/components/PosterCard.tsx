import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { Story, Language } from "@/data/stories";

interface PosterCardProps {
  story: Story;
  language: Language;
  index: number;
  onClick?: () => void;
}

// Cinematic poster gradients for each story
const posterGradients: Record<string, string> = {
  "1": "linear-gradient(135deg, hsl(25 80% 20%) 0%, hsl(350 60% 15%) 50%, hsl(0 0% 5%) 100%)",
  "2": "linear-gradient(135deg, hsl(200 40% 15%) 0%, hsl(220 50% 20%) 50%, hsl(0 0% 5%) 100%)",
  "3": "linear-gradient(135deg, hsl(120 30% 12%) 0%, hsl(80 40% 15%) 50%, hsl(0 0% 5%) 100%)",
  "4": "linear-gradient(135deg, hsl(40 50% 18%) 0%, hsl(30 60% 15%) 50%, hsl(0 0% 5%) 100%)",
  "5": "linear-gradient(135deg, hsl(220 50% 20%) 0%, hsl(260 40% 18%) 50%, hsl(0 0% 5%) 100%)",
  "6": "linear-gradient(135deg, hsl(35 70% 22%) 0%, hsl(15 60% 18%) 50%, hsl(0 0% 5%) 100%)",
  "7": "linear-gradient(135deg, hsl(20 50% 18%) 0%, hsl(350 40% 15%) 50%, hsl(0 0% 5%) 100%)",
  "8": "linear-gradient(135deg, hsl(280 40% 18%) 0%, hsl(320 50% 15%) 50%, hsl(0 0% 5%) 100%)",
};

// Decorative elements for posters
const posterPatterns: Record<string, React.ReactNode> = {
  "1": (
    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 150">
      <path d="M50 20 L70 60 L50 100 L30 60 Z" stroke="currentColor" fill="none" strokeWidth="0.5" />
      <circle cx="50" cy="60" r="15" stroke="currentColor" fill="none" strokeWidth="0.3" />
    </svg>
  ),
  "2": (
    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 150">
      <path d="M0 100 Q50 80 100 100" stroke="currentColor" fill="none" strokeWidth="0.5" />
      <path d="M0 110 Q50 90 100 110" stroke="currentColor" fill="none" strokeWidth="0.3" />
      <circle cx="50" cy="40" r="12" stroke="currentColor" fill="none" strokeWidth="0.5" />
    </svg>
  ),
  "3": (
    <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 100 150">
      <ellipse cx="50" cy="60" rx="20" ry="10" stroke="currentColor" fill="none" strokeWidth="0.5" />
      <ellipse cx="50" cy="60" rx="10" ry="5" stroke="currentColor" fill="none" strokeWidth="0.5" />
    </svg>
  ),
  "4": (
    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 150">
      <polygon points="50,10 60,40 90,40 65,60 75,90 50,70 25,90 35,60 10,40 40,40" stroke="currentColor" fill="none" strokeWidth="0.3" />
    </svg>
  ),
  "5": (
    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 150">
      <path d="M20 120 Q50 80 80 120" stroke="currentColor" fill="none" strokeWidth="0.5" />
      <circle cx="30" cy="30" r="8" stroke="currentColor" fill="none" strokeWidth="0.3" />
      <circle cx="70" cy="50" r="5" stroke="currentColor" fill="none" strokeWidth="0.3" />
    </svg>
  ),
  "6": (
    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 150">
      <rect x="30" y="40" width="40" height="60" stroke="currentColor" fill="none" strokeWidth="0.5" />
      <path d="M30 40 L50 20 L70 40" stroke="currentColor" fill="none" strokeWidth="0.5" />
    </svg>
  ),
  "7": (
    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 150">
      <path d="M10 100 L30 80 L50 90 L70 70 L90 85" stroke="currentColor" fill="none" strokeWidth="0.5" />
    </svg>
  ),
  "8": (
    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 150">
      <line x1="20" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="0.3" />
      <line x1="20" y1="60" x2="80" y2="60" stroke="currentColor" strokeWidth="0.3" />
      <line x1="20" y1="80" x2="80" y2="80" stroke="currentColor" strokeWidth="0.3" />
    </svg>
  ),
};

export const PosterCard = ({ story, language, index, onClick }: PosterCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse position for 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring config for smooth animation
  const springConfig = { stiffness: 150, damping: 15 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ 
        rotateX: isHovered ? rotateX : 0, 
        rotateY: isHovered ? rotateY : 0,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      whileHover={{ scale: 1.05, z: 50 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      {/* Poster Container */}
      <div
        className="relative aspect-[2/3] rounded-lg overflow-hidden"
        style={{
          background: posterGradients[story.id] || posterGradients["1"],
        }}
      >
        {/* Ambient Glow on Hover */}
        <motion.div
          className="absolute -inset-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
          style={{
            background: "radial-gradient(circle, hsl(350 65% 45% / 0.4) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        {/* Inner Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, hsl(350 65% 45% / 0.2) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* Decorative Pattern */}
        <div className="absolute inset-0 text-foreground">
          {posterPatterns[story.id]}
        </div>

        {/* Vignette Effect */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 30%, hsl(0 0% 0% / 0.6) 100%)",
          }}
        />

        {/* Genre Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-medium bg-primary/20 text-primary border border-primary/30 rounded-full backdrop-blur-sm">
            {story.genre}
          </span>
        </div>

        {/* Duration Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground bg-background/30 backdrop-blur-sm rounded-full">
            {story.duration}
          </span>
        </div>

        {/* Title Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 pt-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <motion.h3
            key={`${story.id}-${language}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-display text-xl md:text-2xl text-foreground leading-tight group-hover:text-glow transition-all duration-500"
          >
            {story.title[language]}
          </motion.h3>

          {/* Subtle underline on hover */}
          <motion.div
            className="h-px bg-primary/50 mt-3 origin-left"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Border Glow on Hover */}
        <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-primary/40 transition-colors duration-500" />
      </div>
    </motion.div>
  );
};
