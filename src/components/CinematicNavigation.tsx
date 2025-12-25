import { motion, useScroll, useTransform } from "framer-motion";

interface CinematicNavigationProps {
  onEnterWorld?: () => void;
}

export const CinematicNavigation = ({ onEnterWorld }: CinematicNavigationProps) => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.1], [-20, 0]);

  return (
    <motion.header
      style={{ opacity, y }}
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6"
    >
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary animate-glow-pulse" />
          </div>
          <span className="font-display text-lg text-foreground">Narrativa</span>
        </motion.div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-12">
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 line-reveal">
            Stories
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 line-reveal">
            Authors
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 line-reveal">
            About
          </button>
        </div>

        {/* Enter button */}
        <motion.button
          onClick={onEnterWorld}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-cinematic text-xs"
        >
          Enter World
        </motion.button>
      </nav>
    </motion.header>
  );
};
