import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const CinematicIntro = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3]);
  const z = useTransform(scrollYProgress, [0, 0.5], [0, 200]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh] flex items-start justify-center overflow-hidden"
    >
      {/* Fixed container for intro */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        {/* Background glow */}
        <motion.div
          style={{ opacity }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(350_40%_15%_/_0.2)_0%,_transparent_60%)]"
        />

        {/* Main intro text */}
        <motion.div
          style={{ 
            opacity,
            scale,
            translateZ: z,
            y: textY,
          }}
          className="relative z-10 text-center px-8 depth-layer"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="text-muted-foreground spacing-cinematic text-xs md:text-sm uppercase mb-8"
          >
            Scroll to enter
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl md:text-6xl lg:text-8xl text-foreground leading-[1.1] mb-6"
          >
            Stories that
            <br />
            <span className="text-primary italic">breathe</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-24 h-px bg-primary/40 mx-auto origin-left"
          />
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                y: [0, -20, 0],
              }}
              transition={{
                delay: i * 0.3,
                duration: 6 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                left: `${15 + i * 18}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              className="absolute w-1 h-1 rounded-full bg-primary/30"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
