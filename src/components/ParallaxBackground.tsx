import { motion, useScroll, useTransform } from "framer-motion";

export const ParallaxBackground = () => {
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 0.2, 0.1, 0]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Deep background layer */}
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-[80px]" />
      </motion.div>

      {/* Middle layer */}
      <motion.div
        style={{ y: y2 }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/3 rounded-full blur-[60px]" />
      </motion.div>

      {/* Vignette overlay */}
      <div className="vignette absolute inset-0" />

      {/* Grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
