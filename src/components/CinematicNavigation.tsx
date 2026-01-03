import { motion } from "framer-motion";
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
      className="relative px-3 py-2 md:px-5 md:py-3 cursor-pointer no-underline"
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

      {/* Red underline - only on hover */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-[2px] bg-[hsl(0_85%_35%)] rounded-full"
        initial={{ width: 0, x: "-50%", opacity: 0 }}
        animate={{ 
          width: isHovered ? "60%" : "0%", 
          x: "-50%",
          opacity: isHovered ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          boxShadow: "0 0 10px hsl(0 85% 35% / 0.8), 0 0 20px hsl(0 85% 35% / 0.4)",
        }}
      />

      {/* Text with glow */}
      <motion.span
        className="relative z-10 text-xs md:text-sm font-medium tracking-wide whitespace-nowrap"
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
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.2 
      }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-12 py-4 md:py-5"
      style={{
        background: "linear-gradient(to bottom, hsl(0 0% 0% / 0.95) 0%, hsl(0 0% 0% / 0.85) 50%, hsl(0 0% 0% / 0.7) 100%)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid hsl(0 0% 100% / 0.05)",
      }}
    >
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Spacer for symmetry */}
        <div className="w-[100px] md:w-[140px]" />

        {/* Nav links - Center */}
        <div className="flex items-center gap-1 md:gap-4">
          <NavItem label="Story Posters" href="/stories" />
          <NavItem label="Author" href="/author" />
          <NavItem label="About" href="/about" />
        </div>

        {/* Enter World - Right */}
        <motion.button
          onClick={onEnterWorld}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="relative px-4 py-2 md:px-6 md:py-2.5 text-xs md:text-sm font-medium tracking-wider text-white overflow-hidden rounded-full"
          style={{
            background: "linear-gradient(135deg, hsl(0 85% 25% / 0.8) 0%, hsl(0 100% 15% / 0.9) 100%)",
            border: "1px solid hsl(0 85% 35% / 0.5)",
            boxShadow: "0 0 20px hsl(0 85% 25% / 0.3), inset 0 1px 0 hsl(0 85% 45% / 0.2)",
          }}
        >
          <motion.span
            className="absolute inset-0 opacity-0"
            whileHover={{ opacity: 1 }}
            style={{
              background: "radial-gradient(circle at center, hsl(0 85% 40% / 0.4) 0%, transparent 70%)",
            }}
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10">Enter World</span>
        </motion.button>
      </nav>
    </motion.header>
  );
};
