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
        {/* Spacer for layout balance */}
        <div />

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 group"
          >
            <span className="relative z-10">Stories</span>
            <motion.div 
              className="absolute inset-0 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            <motion.div 
              className="absolute inset-0 border border-primary/40 rounded-full opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300"
            />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 group"
          >
            <span className="relative z-10">Authors</span>
            <motion.div 
              className="absolute inset-0 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            <motion.div 
              className="absolute inset-0 border border-primary/40 rounded-full opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300"
            />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 group"
          >
            <span className="relative z-10">About</span>
            <motion.div 
              className="absolute inset-0 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            <motion.div 
              className="absolute inset-0 border border-primary/40 rounded-full opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300"
            />
          </motion.button>
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
