import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface FinalInvitationProps {
  onEnter?: () => void;
}

export const FinalInvitation = ({ onEnter }: FinalInvitationProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale }}
      className="min-h-screen flex items-center justify-center px-8"
    >
      <div className="text-center max-w-3xl">
        {/* Decorative element */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-px h-24 bg-gradient-to-b from-transparent via-primary/40 to-transparent mx-auto mb-12 origin-top"
        />

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground mb-6"
        >
          Your story
          <br />
          <span className="text-primary italic">awaits</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          viewport={{ once: true }}
          className="text-muted-foreground text-lg mb-12"
        >
          Enter a world where stories come alive through voice and emotion
        </motion.p>

        <motion.button
          onClick={onEnter}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-cinematic"
        >
          Begin Journey
        </motion.button>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          transition={{ delay: 1, duration: 1.5 }}
          viewport={{ once: true }}
          className="mt-24 flex items-center justify-center gap-2"
        >
          <div className="w-1 h-1 rounded-full bg-primary/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
          <div className="w-1 h-1 rounded-full bg-primary/50" />
        </motion.div>
      </div>
    </motion.section>
  );
};
