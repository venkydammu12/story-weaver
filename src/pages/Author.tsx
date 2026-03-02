import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ArrowLeft, PenTool, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CinematicNavigation } from '@/components/CinematicNavigation';
import { ParallaxImage } from '@/components/ParallaxImage';
import { AuthLogin } from '@/components/AuthLogin';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import authorProfile from '@/assets/author-profile.jpeg';

// Import AI-generated images
import heroImage from '@/assets/author-hero.jpg';
import infoImage from '@/assets/author-info.jpg';
import storyImage from '@/assets/author-story.jpg';
import quoteImage from '@/assets/author-quote.jpg';

// Cinematic floating particles with varied sizes and glow
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(30)].map((_, i) => {
      const size = Math.random() > 0.7 ? 3 : Math.random() > 0.4 ? 2 : 1;
      return (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 
              ? 'hsl(0 70% 50% / 0.4)' 
              : 'hsl(0 0% 100% / 0.15)',
            boxShadow: i % 3 === 0 
              ? '0 0 6px hsl(0 70% 50% / 0.3)' 
              : 'none',
          }}
          animate={{
            y: [0, -(20 + Math.random() * 40), 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [0.1, 0.6, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      );
    })}
  </div>
);

// Animated horizontal divider line
const GlowDivider = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="relative h-px w-full max-w-xs mx-auto my-6 overflow-hidden"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />
    <motion.div
      className="absolute inset-y-0 w-16"
      style={{ background: 'linear-gradient(90deg, transparent, hsl(0 70% 50% / 0.6), transparent)' }}
      animate={{ x: ['-4rem', '20rem'] }}
      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, delay, ease: 'easeInOut' }}
    />
  </motion.div>
);

// Letter-by-letter text reveal
const LetterReveal = ({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) => (
  <span className={className}>
    {text.split('').map((char, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ 
          duration: 0.5, 
          delay: delay + i * 0.06,
          ease: [0.25, 0.46, 0.45, 0.94] 
        }}
        className="inline-block"
        style={{ minWidth: char === ' ' ? '0.3em' : undefined }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ))}
  </span>
);

// Glowing text shimmer effect
const ShimmerText = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.span
    className={`relative ${className}`}
    style={{ display: 'inline-block' }}
  >
    {children}
    <motion.span
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'linear-gradient(90deg, transparent 0%, hsl(0 70% 60% / 0.15) 50%, transparent 100%)',
        backgroundSize: '200% 100%',
      }}
      animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
    />
  </motion.span>
);

// Section transition wrapper with cinematic entry
const CinematicSection = ({ 
  children, 
  className = '',
  direction = 'up' 
}: { 
  children: React.ReactNode; 
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'scale';
}) => {
  const variants = {
    up: { initial: { opacity: 0, y: 80 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 } },
    scale: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
  };

  return (
    <motion.div
      initial={variants[direction].initial}
      whileInView={variants[direction].animate}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Author = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const heroRef = useRef<HTMLDivElement>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const [isAuthor, setIsAuthor] = useState<boolean | null>(null);
  
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const heroY = useTransform(heroProgress, [0, 1], [0, 200]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);
  const heroBlur = useTransform(heroProgress, [0, 1], [0, 8]);

  // Mouse parallax for hero portrait
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [mouseX, mouseY]);

  // Check if redirected here with showLogin state
  useEffect(() => {
    if (location.state?.showLogin) {
      setShowLoginModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Check author status when user changes
  useEffect(() => {
    const checkAuthorRole = async () => {
      if (!user) {
        setIsAuthor(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'author')
          .maybeSingle();
        setIsAuthor(error ? false : !!data);
      } catch {
        setIsAuthor(false);
      }
    };
    if (!authLoading) checkAuthorRole();
  }, [user, authLoading]);

  const handleWriteClick = () => {
    if (sessionStorage.getItem('author_access') === 'granted') {
      navigate('/write');
      return;
    }
    window.setTimeout(() => setShowLoginModal(true), 0);
  };

  const handleLoginSuccess = () => {
    toast.success('Welcome back!');
  };

  const authorInfo = [
    { label: 'Full Name', value: 'D. Venky', icon: '✦' },
    { label: 'Role', value: 'Author / Storyteller / Poet', icon: '✧' },
    { label: 'Date of Birth', value: 'August 7, 2004', icon: '✦' },
    { label: 'Education', value: 'BTech Graduate', icon: '✧' },
    { label: 'Languages', value: 'English, Telugu', icon: '✦' },
    { label: 'Genres', value: 'Romance, Drama, Poetry, Emotional Fiction', icon: '✧' },
  ];

  const aboutParagraphs = [
    "I didn't choose stories. Stories chose me.",
    "From the quiet corners of childhood, words became my refuge — a place where emotions found their voice, where silence learned to speak.",
    "Every story I write carries a piece of my soul. Not because I seek to be heard, but because some truths can only be told through fiction.",
    "I write for those who feel deeply, who carry unspoken words in their hearts, who find home in the pages of a book.",
    "My pen doesn't chase fame. It chases feeling. It chases the moment when a reader pauses, breathes, and whispers — 'This is exactly how I felt.'",
    "To me, storytelling isn't a craft. It's a calling. A way of living. A way of loving.",
  ];

  return (
    <>
    <AuthLogin 
      isOpen={showLoginModal} 
      onClose={() => setShowLoginModal(false)}
      onSuccess={handleLoginSuccess}
    />
    <div 
      className="min-h-screen bg-black text-white overflow-x-hidden"
      style={{ perspective: '2000px' }}
    >
      <CinematicNavigation />
      
      {/* Back Navigation Arrow */}
      <motion.button
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => navigate(-1)}
        className="fixed top-24 left-6 z-40 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-300 group"
      >
        <motion.div
          whileHover={{ x: -6, scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="p-2 rounded-full border border-neutral-700 group-hover:border-red-900/50 group-hover:bg-red-900/10 transition-all duration-300"
          style={{ boxShadow: '0 0 0px transparent' }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={20} />
        </motion.div>
        <span 
          className="text-sm tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Back
        </span>
      </motion.button>

      {/* Write Stories Button - Top Right */}
      <motion.button
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => {
          console.log('Write button clicked');
          handleWriteClick();
        }}
        className="fixed top-24 right-6 z-50 flex items-center gap-3 group cursor-pointer"
        style={{ pointerEvents: 'auto' }}
      >
        <motion.span 
          className="text-sm tracking-[0.2em] uppercase text-neutral-400 group-hover:text-white transition-colors duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Write Stories
        </motion.span>
        <motion.div
          className="relative p-3 rounded-full border border-neutral-700 group-hover:border-red-900/50 transition-all duration-300 overflow-hidden pointer-events-none"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle, hsl(0 70% 40% / 0.3) 0%, transparent 70%)' }}
            animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="pointer-events-none"
            animate={{ rotate: [0, -8, 8, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <PenTool size={20} className="relative z-10 text-neutral-400 group-hover:text-red-400 transition-colors duration-300" />
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute -top-1 -right-1 pointer-events-none"
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles size={10} className="text-red-500" />
        </motion.div>
      </motion.button>

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section 
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden"
      >
        {/* Hero background with parallax + blur */}
        <motion.div
          style={{ y: heroY, scale: heroScale, filter: useTransform(heroBlur, v => `blur(${v}px)`) }}
          className="absolute inset-0"
        >
          <img src={heroImage} alt="Writer's sanctuary" className="w-full h-full object-cover" />
          <div 
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, hsl(0 0% 0% / 0.5) 0%, hsl(0 0% 0% / 0.7) 50%, hsl(0 0% 0% / 0.95) 100%)" }}
          />
        </motion.div>

        <FloatingParticles />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 flex flex-col items-center">
          {/* Author Portrait with mouse parallax */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-14"
            style={{ x: springX, y: springY }}
          >
            {/* Outer pulsing glow rings */}
            {[1.4, 1.55, 1.7].map((s, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, transparent 55%, hsl(0 70% ${30 - i * 5}% / ${0.15 - i * 0.03}) 100%)`,
                  transform: `scale(${s})`,
                  filter: `blur(${10 + i * 5}px)`,
                }}
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [s, s + 0.05, s] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              />
            ))}
            
            {/* Rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: '1px solid hsl(0 70% 40% / 0.2)',
                transform: 'scale(1.25)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />

            {/* Portrait Container */}
            <motion.div
              className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden mx-auto"
              style={{
                boxShadow: '0 0 60px hsl(0 70% 25% / 0.5), 0 0 120px hsl(0 70% 20% / 0.2), inset 0 0 60px hsl(0 70% 15% / 0.3)',
                border: '2px solid hsl(0 70% 35% / 0.5)',
              }}
              whileHover={{ scale: 1.08, boxShadow: '0 0 80px hsl(0 70% 30% / 0.6), 0 0 160px hsl(0 70% 25% / 0.3)' }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <img src={authorProfile} alt="Venky - Author" className="w-full h-full object-cover" />
              {/* Subtle overlay shimmer */}
              <motion.div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, transparent 40%, hsl(0 70% 50% / 0.1) 50%, transparent 60%)' }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>

          {/* Author Name — letter by letter */}
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.15em] text-center mb-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            <ShimmerText>
              <LetterReveal text="D. Venky" delay={0.6} />
            </ShimmerText>
          </h1>

          <GlowDivider delay={1.2} />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-neutral-400 italic text-center max-w-xl mx-auto"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            "Where words breathe and silence speaks"
          </motion.p>
        </motion.div>

        {/* Scroll Indicator — animated line + pulse */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <motion.span
            className="text-[10px] tracking-[0.4em] uppercase text-neutral-600"
            style={{ fontFamily: 'Georgia, serif' }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll
          </motion.span>
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-16 bg-gradient-to-b from-red-900/60 via-red-900/30 to-transparent"
          />
        </motion.div>
      </section>

      {/* ═══════════ AUTHOR INFO SECTION ═══════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        <ParallaxImage src={infoImage} alt="Books and typewriter" speed={0.15} overlayOpacity={0.85} />
        <FloatingParticles />

        <div className="max-w-4xl mx-auto relative z-10">
          <CinematicSection direction="scale">
            <h2 
              className="text-2xl md:text-3xl font-light tracking-[0.25em] text-center mb-2"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              THE AUTHOR
            </h2>
            <GlowDivider />
          </CinematicSection>

          {/* Info Cards with staggered reveal */}
          <div className="mt-16 space-y-0 backdrop-blur-md bg-black/40 rounded-2xl p-6 md:p-10 border border-white/5"
            style={{ boxShadow: '0 0 40px hsl(0 0% 0% / 0.5), inset 0 0 40px hsl(0 0% 100% / 0.02)' }}
          >
            {authorInfo.map((info, index) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ 
                  duration: 0.7, 
                  delay: index * 0.12,
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className="group py-6 border-b border-red-900/15 last:border-b-0 relative"
              >
                {/* Hover glow */}
                <motion.div 
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, hsl(0 70% 30% / 0.05), hsl(0 70% 30% / 0.1), hsl(0 70% 30% / 0.05))' }}
                />
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 relative z-10">
                  <div className="flex items-center gap-3 w-44 flex-shrink-0">
                    <motion.span 
                      className="text-red-900/50 text-xs"
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
                    >
                      {info.icon}
                    </motion.span>
                    <span 
                      className="text-sm tracking-[0.3em] text-red-900/70 uppercase"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {info.label}
                    </span>
                  </div>
                  <motion.span 
                    className="text-lg md:text-xl text-neutral-200 font-light group-hover:text-white transition-colors duration-300"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {info.value}
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ABOUT SECTION ═══════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        <ParallaxImage src={storyImage} alt="Poet writing with floating words" speed={0.2} overlayOpacity={0.8} />
        <FloatingParticles />

        <div className="max-w-3xl mx-auto relative z-10">
          <CinematicSection direction="up">
            <h2 
              className="text-2xl md:text-3xl font-light tracking-[0.25em] text-center mb-2"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              ABOUT THE AUTHOR
            </h2>
            <GlowDivider />
          </CinematicSection>

          {/* Poetic paragraphs with cinematic reveal */}
          <div className="mt-16 space-y-10">
            {aboutParagraphs.map((paragraph, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ 
                  duration: 0.9, 
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className="relative"
              >
                {/* Decorative left bar for first paragraph */}
                {index === 0 && (
                  <motion.div 
                    className="absolute -left-6 top-0 bottom-0 w-0.5"
                    style={{ background: 'linear-gradient(to bottom, hsl(0 70% 40% / 0.5), transparent)' }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <p
                  className={`text-lg md:text-xl leading-relaxed ${
                    index === 0 
                      ? 'text-2xl md:text-3xl text-white italic pl-4' 
                      : 'text-neutral-300'
                  }`}
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {paragraph}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Signature with glow */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 text-right"
          >
            <div className="inline-block relative">
              <motion.p 
                className="text-2xl md:text-3xl italic text-neutral-400"
                style={{ fontFamily: 'Georgia, serif' }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                — D. Venky
              </motion.p>
              <motion.div 
                className="h-px mt-2"
                style={{ background: 'linear-gradient(to right, transparent, hsl(0 70% 35% / 0.5), hsl(0 70% 35% / 0.3))' }}
                initial={{ scaleX: 0, originX: 1 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FOOTER QUOTE ═══════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        <ParallaxImage src={quoteImage} alt="Heart made of words" speed={0.1} overlayOpacity={0.75} />
        <FloatingParticles />

        <CinematicSection direction="scale" className="max-w-2xl mx-auto text-center relative z-10">
          {/* Animated quote marks */}
          <motion.span
            className="block text-7xl md:text-9xl text-red-900/25 font-serif leading-none mb-6"
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.08, 1],
              textShadow: [
                '0 0 20px hsl(0 70% 30% / 0)',
                '0 0 40px hsl(0 70% 30% / 0.3)',
                '0 0 20px hsl(0 70% 30% / 0)',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            "
          </motion.span>
          
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl text-neutral-300 italic leading-relaxed"
            style={{ fontFamily: 'Georgia, serif' }}
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Every story is a confession. Every word, a heartbeat.
          </motion.p>
          
          <motion.span
            className="block text-7xl md:text-9xl text-red-900/25 font-serif leading-none mt-6 rotate-180"
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.08, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            "
          </motion.span>
        </CinematicSection>
      </section>

      {/* Bottom Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="pb-20 text-center"
      >
        <motion.a 
          href="/"
          className="inline-flex items-center gap-3 text-sm tracking-[0.3em] text-neutral-500 hover:text-red-400 transition-colors duration-500 uppercase group"
          style={{ fontFamily: 'Georgia, serif' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            className="inline-block"
            animate={{ x: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ←
          </motion.span>
          <span className="relative">
            Return to Stories
            <motion.span 
              className="absolute bottom-0 left-0 h-px bg-red-900/50 origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.4 }}
              style={{ width: '100%' }}
            />
          </span>
        </motion.a>
      </motion.div>
    </div>
    </>
  );
};

export default Author;
