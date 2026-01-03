import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number; // Parallax speed multiplier (default 0.3)
  overlay?: boolean; // Add dark overlay
  overlayOpacity?: number;
}

export const ParallaxImage = ({
  src,
  alt,
  className = "",
  speed = 0.3,
  overlay = true,
  overlayOpacity = 0.6,
}: ParallaxImageProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax movement based on scroll
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        style={{ y, scale }}
        className="absolute inset-[-20%] w-[140%] h-[140%]"
      >
        <motion.img
          src={src}
          alt={alt}
          style={{ opacity }}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Dark overlay for text readability */}
      {overlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, 
              hsl(0 0% 0% / ${overlayOpacity + 0.2}) 0%, 
              hsl(0 0% 0% / ${overlayOpacity}) 30%, 
              hsl(0 0% 0% / ${overlayOpacity}) 70%, 
              hsl(0 0% 0% / ${overlayOpacity + 0.2}) 100%)`,
          }}
        />
      )}
    </div>
  );
};
