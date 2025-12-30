import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

interface CinematicNavigationProps {
  onEnterWorld?: () => void;
}

const NavItem = ({ label, href = "/" }: { label: string; href?: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      className="relative px-6 py-3 cursor-pointer no-underline"
      initial={false}
      animate={{
        scale: isHovered ? 1.08 : 1,
      }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {/* Revolving glow ring */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={false}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-[-4px] rounded-full"
          style={{
            background: "conic-gradient(from 0deg, transparent 0%, hsl(0 100% 25% / 0.6) 25%, transparent 50%, hsl(0 100% 30% / 0.4) 75%, transparent 100%)",
            filter: "blur(3px)",
          }}
          animate={{
            rotate: isHovered ? 360 : 0,
          }}
          transition={{
            duration: 4,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      </motion.div>

      {/* Inner glow background */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, hsl(0 100% 20% / 0.3) 0%, transparent 70%)",
        }}
        initial={false}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.2 : 0.8,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      {/* Subtle border glow */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: "1px solid hsl(0 100% 25% / 0.5)",
          boxShadow: "0 0 20px hsl(0 100% 20% / 0.4), inset 0 0 15px hsl(0 100% 20% / 0.2)",
        }}
        initial={false}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.9,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Text with glow */}
      <motion.span
        className="relative z-10 text-sm font-medium tracking-wide"
        style={{ color: "#ffffff" }}
        animate={{
          textShadow: isHovered 
            ? "0 0 20px hsl(0 100% 30% / 0.8), 0 0 40px hsl(0 100% 25% / 0.5), 0 0 60px hsl(0 100% 20% / 0.3)"
            : "0 0 0px transparent",
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {label}
      </motion.span>
    </motion.a>
  );
};

export const CinematicNavigation = ({ onEnterWorld }: CinematicNavigationProps) => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.1], [-20, 0]);

  return (
    <motion.header
      style={{ opacity, y }}
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6"
    >
      <nav className="flex items-center justify-center max-w-7xl mx-auto relative">
        {/* Nav links - centered */}
        <div className="flex items-center gap-4 md:gap-6">
          <NavItem label="Story Posters" href="/stories" />
          <NavItem label="Author" href="/author" />
          <NavItem label="About" href="/" />
        </div>

        {/* Enter button - positioned right */}
        <motion.button
          onClick={onEnterWorld}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-cinematic text-xs absolute right-0"
        >
          Enter World
        </motion.button>
      </nav>
    </motion.header>
  );
};
