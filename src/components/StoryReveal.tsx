import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface StoryRevealProps {
  title: string;
  subtitle: string;
  description: string;
  index: number;
}

export const StoryReveal = ({ title, subtitle, description, index }: StoryRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.3, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -50 : 50, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], [10, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x }}
      className="relative py-32 md:py-48"
    >
      {/* Background accent */}
      <motion.div
        style={{ opacity: useTransform(scrollYProgress, [0, 0.8], [0, 0.1]) }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(350_50%_20%_/_0.15)_0%,_transparent_50%)]"
      />

      <div className="max-w-4xl mx-auto px-8 md:px-16">
        {/* Number indicator */}
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.15 }}
          transition={{ duration: 1 }}
          className="font-display text-[120px] md:text-[200px] absolute -left-4 md:left-0 top-20 text-primary select-none pointer-events-none"
        >
          {String(index + 1).padStart(2, '0')}
        </motion.span>

        <div className="relative z-10">
          <motion.p
            style={{ filter: `blur(${blur}px)` }}
            className="text-primary/80 spacing-cinematic text-xs uppercase mb-4"
          >
            {subtitle}
          </motion.p>
          
          <motion.h2
            style={{ filter: `blur(${blur}px)` }}
            className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground mb-8 leading-[1.15]"
          >
            {title}
          </motion.h2>
          
          <motion.p
            style={{ filter: `blur(${blur}px)` }}
            className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl"
          >
            {description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};
