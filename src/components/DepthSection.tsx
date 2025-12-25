import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface DepthSectionProps {
  children: ReactNode;
  className?: string;
  offset?: [string, string];
}

export const DepthSection = ({ 
  children, 
  className = "",
  offset = ["start end", "end start"]
}: DepthSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -60]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale, y }}
      className={`relative min-h-screen flex items-center justify-center ${className}`}
    >
      {children}
    </motion.section>
  );
};
