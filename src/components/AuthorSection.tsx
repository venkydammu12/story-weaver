import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

const authorText = [
  {
    type: "intro" as const,
    text: "I didn't choose stories.",
  },
  {
    type: "intro" as const,
    text: "Stories chose me.",
  },
  {
    type: "body" as const,
    text: "From the first word I ever wrote, I knew — words are not merely ink on paper. They are heartbeats. Whispers from the soul. Bridges between worlds we can touch and worlds we can only feel.",
  },
  {
    type: "body" as const,
    text: "Every story I craft is a piece of me — my sleepless nights, my silent tears, my unspoken dreams. I write not to be read, but to be felt.",
  },
  {
    type: "body" as const,
    text: "When you read my words, you're not just following a narrative. You're walking through the corridors of my mind, feeling the echoes of emotions I've lived and imagined.",
  },
  {
    type: "quote" as const,
    text: "\"A story is never just a story. It's a soul speaking to another soul.\"",
  },
];

const TextLine = ({ 
  text, 
  type, 
  index 
}: { 
  text: string; 
  type: "intro" | "body" | "quote"; 
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getClassName = () => {
    switch (type) {
      case "intro":
        return "font-display text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight";
      case "quote":
        return "font-display text-xl md:text-2xl italic text-primary/90 mt-8";
      default:
        return "text-muted-foreground text-lg md:text-xl leading-relaxed";
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        filter: "blur(0px)" 
      } : {}}
      transition={{
        duration: 1,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`${getClassName()} ${type === "body" ? "mt-6" : ""}`}
    >
      {type === "intro" ? (
        <span className="relative inline-block">
          {text}
          <motion.span
            className="absolute bottom-0 left-0 h-[2px] bg-primary/60"
            initial={{ width: 0 }}
            animate={isInView ? { width: "100%" } : {}}
            transition={{
              duration: 1.2,
              delay: index * 0.15 + 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </span>
      ) : (
        text
      )}
    </motion.div>
  );
};

export const AuthorSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isImageInView = useInView(imageRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const accentLineWidth = useTransform(scrollYProgress, [0.1, 0.5], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-24 md:py-32 lg:py-40 overflow-hidden"
      style={{ backgroundColor: "#000000" }}
    >
      {/* Ambient background glow */}
      <motion.div
        style={{ opacity: backgroundOpacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div 
          className="absolute top-1/2 left-1/4 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: "radial-gradient(ellipse at center, hsl(0 100% 15% / 0.15) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Scrolling accent line */}
      <motion.div
        className="absolute top-0 left-0 h-[1px]"
        style={{
          width: accentLineWidth,
          background: "linear-gradient(90deg, transparent, hsl(0 100% 30% / 0.6), hsl(0 100% 25% / 0.3))",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-16 lg:gap-24">
          {/* Author portrait */}
          <div 
            ref={imageRef}
            className="flex-shrink-0 flex justify-center lg:justify-start"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isImageInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative group cursor-pointer"
            >
              {/* Outer breathing glow ring */}
              <motion.div
                className="absolute inset-[-12px] rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, hsl(0 100% 20% / 0.4), hsl(0 100% 30% / 0.6), hsl(0 100% 20% / 0.4), hsl(0 100% 25% / 0.5), hsl(0 100% 20% / 0.4))",
                  filter: "blur(8px)",
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />

              {/* Inner glow ring */}
              <motion.div
                className="absolute inset-[-6px] rounded-full"
                style={{
                  background: "radial-gradient(ellipse at center, hsl(0 100% 25% / 0.3) 60%, hsl(0 100% 30% / 0.5) 80%, transparent 100%)",
                }}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />

              {/* Image container */}
              <motion.div
                className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-2 border-primary/30"
                style={{
                  boxShadow: "0 0 40px hsl(0 100% 25% / 0.3), inset 0 0 30px hsl(0 0% 0% / 0.5)",
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                }}
              >
                {/* Placeholder author silhouette */}
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(180deg, hsl(0 0% 8%) 0%, hsl(0 0% 4%) 100%)",
                  }}
                >
                  <svg 
                    viewBox="0 0 100 100" 
                    className="w-3/4 h-3/4 text-primary/20"
                    fill="currentColor"
                  >
                    <circle cx="50" cy="35" r="20" />
                    <ellipse cx="50" cy="85" rx="30" ry="25" />
                  </svg>
                </div>

                {/* Hover overlay glow */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background: "radial-gradient(ellipse at center, hsl(0 100% 30% / 0.2) 0%, transparent 70%)",
                  }}
                />
              </motion.div>

              {/* Author name badge */}
              <motion.div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={isImageInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <span 
                  className="text-xs uppercase tracking-[0.3em] text-primary/70"
                  style={{
                    textShadow: "0 0 20px hsl(0 100% 30% / 0.5)",
                  }}
                >
                  The Storyteller
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Author story text */}
          <div className="flex-1 text-center lg:text-left mt-8 lg:mt-0">
            {/* Section label */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-primary/60 text-xs uppercase tracking-[0.3em] mb-8"
            >
              Author
            </motion.p>

            {/* Text lines with staggered reveal */}
            <div className="space-y-0">
              {authorText.map((line, index) => (
                <TextLine
                  key={index}
                  text={line.text}
                  type={line.type}
                  index={index}
                />
              ))}
            </div>

            {/* Signature element */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-12 flex items-center justify-center lg:justify-start gap-4"
            >
              <div 
                className="w-12 h-[1px]"
                style={{
                  background: "linear-gradient(90deg, hsl(0 100% 30% / 0.6), transparent)",
                }}
              />
              <span className="font-display text-lg italic text-muted-foreground/60">
                — With ink and soul
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom vignette */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, hsl(0 0% 3%), transparent)",
        }}
      />
    </section>
  );
};
