import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CinematicNavigation } from "@/components/CinematicNavigation";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { ParallaxImage } from "@/components/ParallaxImage";

// Import AI-generated images
import heroImage from "@/assets/about-hero.jpg";
import ideaImage from "@/assets/about-idea.jpg";
import experienceImage from "@/assets/about-experience.jpg";
import invitationImage from "@/assets/about-invitation.jpg";

// Cinematic section component with scroll animations
const CinematicSection = ({ 
  children, 
  className = "",
  image,
  imageAlt = "",
}: { 
  children: React.ReactNode; 
  className?: string;
  image?: string;
  imageAlt?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -30]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 1.02]);

  return (
    <section
      ref={ref}
      className={`relative py-24 md:py-32 lg:py-40 overflow-hidden ${className}`}
    >
      {/* Parallax background image */}
      {image && (
        <ParallaxImage
          src={image}
          alt={imageAlt}
          speed={0.2}
          overlayOpacity={0.7}
        />
      )}
      
      {/* Content with animations */}
      <motion.div
        style={{ opacity, y, scale }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </section>
  );
};

// Animated text line component
const AnimatedLine = ({ 
  children, 
  delay = 0,
  className = ""
}: { 
  children: React.ReactNode; 
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Feature card with glow effect
const FeatureCard = ({ 
  title, 
  description, 
  delay = 0 
}: { 
  title: string; 
  description: string; 
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    whileHover={{ scale: 1.02, y: -5 }}
    className="relative p-6 md:p-8 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md group cursor-default"
    style={{
      boxShadow: "0 0 40px hsl(0 0% 0% / 0.5)",
    }}
  >
    {/* Hover glow */}
    <motion.div
      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background: "radial-gradient(circle at center, hsl(0 85% 25% / 0.2) 0%, transparent 70%)",
        boxShadow: "inset 0 0 30px hsl(0 85% 30% / 0.15)",
      }}
    />
    
    <h3 className="font-display text-xl md:text-2xl text-foreground mb-3 relative z-10">
      {title}
    </h3>
    <p className="text-muted-foreground text-sm md:text-base leading-relaxed relative z-10">
      {description}
    </p>
  </motion.div>
);

const About = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const heroY = useTransform(heroProgress, [0, 1], [0, 200]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  return (
    <main 
      className="relative bg-background min-h-screen overflow-x-hidden"
      style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
    >
      <ParallaxBackground />
      <CinematicNavigation />

      {/* Hero Section - What This Is */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Hero background image with parallax */}
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0"
        >
          <img 
            src={heroImage} 
            alt="Cinematic story world entrance"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, hsl(0 0% 0% / 0.5) 0%, hsl(0 0% 0% / 0.7) 50%, hsl(0 0% 0% / 0.9) 100%)",
            }}
          />
        </motion.div>

        {/* Subtle radial glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 50%, hsl(0 85% 20% / 0.1) 0%, transparent 60%)",
          }}
        />

        <motion.div 
          style={{ opacity: heroOpacity }}
          className="max-w-4xl mx-auto text-center relative z-10 px-6"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-primary/70 text-xs md:text-sm tracking-[0.3em] uppercase mb-6"
          >
            Welcome to
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-8"
          >
            A World Built for{" "}
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, hsl(0 85% 45%) 0%, hsl(0 70% 35%) 100%)",
              }}
            >
              Stories
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            This is not just a website. This is a cinematic universe where every word breathes, every story moves, and every reader becomes part of something greater.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2"
            >
              <motion.div className="w-1 h-2 bg-primary/50 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* The Idea - Why It Exists */}
      <CinematicSection image={ideaImage} imageAlt="Floating story pages">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <AnimatedLine>
            <p className="text-primary/70 text-xs tracking-[0.3em] uppercase mb-4">
              The Idea
            </p>
          </AnimatedLine>
          
          <AnimatedLine delay={0.1}>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-8 leading-[1.15]">
              Why This Exists
            </h2>
          </AnimatedLine>

          <div className="space-y-6 text-muted-foreground text-base md:text-lg leading-relaxed">
            <AnimatedLine delay={0.2}>
              <p>
                Stories have always been the heartbeat of human connection. But somewhere along the way, we started treating them like ordinary content — rushed, skimmed, forgotten.
              </p>
            </AnimatedLine>
            
            <AnimatedLine delay={0.3}>
              <p>
                I wanted to change that. I wanted to create a space where stories are not just read — they are <em className="text-foreground">experienced</em>. Where every scroll feels like turning a page in a world that exists just for you.
              </p>
            </AnimatedLine>
            
            <AnimatedLine delay={0.4}>
              <p>
                This platform was born from a simple belief: <span className="text-foreground font-medium">stories deserve more</span>. More emotion. More depth. More presence.
              </p>
            </AnimatedLine>
          </div>
        </div>
      </CinematicSection>

      {/* The Experience - How It Feels */}
      <CinematicSection image={experienceImage} imageAlt="Immersive reading experience">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <AnimatedLine>
            <p className="text-primary/70 text-xs tracking-[0.3em] uppercase mb-4">
              The Experience
            </p>
          </AnimatedLine>
          
          <AnimatedLine delay={0.1}>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-8 leading-[1.15]">
              How It Feels
            </h2>
          </AnimatedLine>

          <div className="space-y-6 text-muted-foreground text-base md:text-lg leading-relaxed">
            <AnimatedLine delay={0.2}>
              <p>
                When you scroll, you're not just moving down a page. You're <span className="text-foreground">traveling through layers</span> — scenes emerge from darkness, words reveal themselves with intention, and the story unfolds at your pace.
              </p>
            </AnimatedLine>
            
            <AnimatedLine delay={0.3}>
              <p>
                When you read, you feel the rhythm. The pauses. The weight of silence between moments. It's designed to slow you down, to make you <em className="text-foreground">feel</em> what you're reading.
              </p>
            </AnimatedLine>
            
            <AnimatedLine delay={0.4}>
              <p>
                This is storytelling as cinema. Every element — the motion, the depth, the darkness — exists to serve one purpose: <span className="text-foreground font-medium">immersion</span>.
              </p>
            </AnimatedLine>
          </div>
        </div>
      </CinematicSection>

      {/* What Makes It Different */}
      <CinematicSection>
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <AnimatedLine className="text-center mb-12 md:mb-16">
            <p className="text-primary/70 text-xs tracking-[0.3em] uppercase mb-4">
              What Makes It Different
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground leading-[1.15]">
              Not Just Another Website
            </h2>
          </AnimatedLine>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <FeatureCard
              title="Visual Storytelling"
              description="Every story is presented with cinematic depth. Words don't just sit on a page — they move, breathe, and reveal themselves with purpose."
              delay={0.1}
            />
            
            <FeatureCard
              title="Cinematic Motion"
              description="Smooth, intentional animations guide your journey. No jarring transitions. No distractions. Just pure, flowing narrative."
              delay={0.2}
            />
            
            <FeatureCard
              title="Story-First Design"
              description="The design serves the story, never the other way around. Every color, every shadow, every pause exists to enhance your experience."
              delay={0.3}
            />
            
            <FeatureCard
              title="Mass & Class"
              description="Content that resonates with everyone — emotional depth that moves the heart, wrapped in premium presentation that elevates the mind."
              delay={0.4}
            />
          </div>
        </div>
      </CinematicSection>

      {/* Author Login Section */}

      {/* Closing Statement */}
      <section className="relative py-32 md:py-48 px-6 overflow-hidden">
        {/* Background image */}
        <ParallaxImage
          src={invitationImage}
          alt="Portal to story world"
          speed={0.15}
          overlayOpacity={0.75}
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="text-primary/70 text-xs tracking-[0.3em] uppercase mb-6">
              The Invitation
            </p>
            
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground leading-[1.1] mb-8">
              Enter the World
            </h2>
            
            <p className="text-muted-foreground text-lg md:text-xl mb-12 leading-relaxed">
              This is where stories come alive. Where words become worlds. Where you become part of something extraordinary.
            </p>

            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-primary/30 rounded-full text-foreground font-medium tracking-wide transition-all duration-300 hover:border-primary/60 hover:bg-primary/5 group"
              style={{
                boxShadow: "0 0 30px hsl(0 85% 30% / 0.3)",
              }}
            >
              <span>Begin Your Journey</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center border-t border-white/5">
        <p className="text-muted-foreground/50 text-xs tracking-[0.2em] uppercase">
          Narrativa — Stories that breathe
        </p>
      </footer>
    </main>
  );
};

export default About;
