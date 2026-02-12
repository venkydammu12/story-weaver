import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ArrowLeft, PenTool } from 'lucide-react';
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

// Floating particles component for ambient animation
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-red-500/30 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.6, 0.2],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 4 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

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
  
  const heroY = useTransform(heroProgress, [0, 1], [0, 150]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  // Check if redirected here with showLogin state
  useEffect(() => {
    if (location.state?.showLogin) {
      setShowLoginModal(true);
      // Clear the state to prevent modal from showing again on refresh
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

        if (error) {
          console.error('Error checking author role:', error);
          setIsAuthor(false);
        } else {
          setIsAuthor(!!data);
        }
      } catch (err) {
        console.error('Failed to check author status:', err);
        setIsAuthor(false);
      }
    };

    if (!authLoading) {
      checkAuthorRole();
    }
  }, [user, authLoading]);

  const handleWriteClick = () => {
    // Check if already has access via password
    if (sessionStorage.getItem('author_access') === 'granted') {
      navigate('/write');
      return;
    }

    // Open modal on next tick to avoid the opening click immediately bubbling
    // into the modal overlay and closing it.
    window.setTimeout(() => setShowLoginModal(true), 0);
  };

  const handleLoginSuccess = () => {
    // After login, navigate to write if user is author
    // The useEffect will update isAuthor state
    toast.success('Welcome back!');
  };

  const authorInfo = [
    { label: 'Full Name', value: 'D. Venky' },
    { label: 'Role', value: 'Author / Storyteller / Poet' },
    { label: 'Date of Birth', value: 'August 7, 2004' },
    { label: 'Education', value: 'BTech Graduate' },
    { label: 'Languages', value: 'English, Telugu' },
    { label: 'Genres', value: 'Romance, Drama, Poetry, Emotional Fiction' },
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
    {/* Auth Login Modal - OUTSIDE perspective container so fixed positioning works */}
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
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        onClick={() => navigate(-1)}
        className="fixed top-24 left-6 z-40 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-300 group"
      >
        <motion.div
          whileHover={{ x: -4 }}
          transition={{ duration: 0.2 }}
          className="p-2 rounded-full border border-neutral-700 group-hover:border-red-900/50 group-hover:bg-red-900/10 transition-all duration-300"
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
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Animated background glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-900/0 via-red-900/30 to-red-900/0 pointer-events-none"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          {/* Pen icon with animation */}
          <motion.div
            className="pointer-events-none"
            animate={{
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <PenTool size={20} className="relative z-10 text-neutral-400 group-hover:text-red-400 transition-colors duration-300" />
          </motion.div>
        </motion.div>
        {/* Floating sparkle effect */}
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full pointer-events-none"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.button>

      {/* Auth Login Modal moved outside perspective container */}
      
      {/* Hero Section with Author Portrait */}
      <section 
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden"
      >
        {/* Hero background image with parallax */}
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0"
        >
          <img 
            src={heroImage} 
            alt="Writer's sanctuary"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, hsl(0 0% 0% / 0.6) 0%, hsl(0 0% 0% / 0.75) 50%, hsl(0 0% 0% / 0.9) 100%)",
            }}
          />
        </motion.div>

        {/* Floating particles */}
        <FloatingParticles />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10">
          {/* Author Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative mb-12"
          >
            {/* Outer Glow Ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, transparent 60%, hsl(0 70% 25% / 0.3) 100%)',
                filter: 'blur(20px)',
                transform: 'scale(1.3)',
              }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1.3, 1.35, 1.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Portrait Container */}
            <motion.div
              className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden mx-auto"
              style={{
                boxShadow: '0 0 60px hsl(0 70% 25% / 0.4), 0 0 120px hsl(0 70% 20% / 0.2), inset 0 0 60px hsl(0 70% 15% / 0.3)',
                border: '2px solid hsl(0 70% 30% / 0.5)',
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <img 
                src={authorProfile} 
                alt="Venky - Author" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Author Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.15em] text-center mb-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            D. Venky
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-lg md:text-xl text-neutral-400 italic text-center max-w-xl mx-auto"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            "Where words breathe and silence speaks"
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-16 bg-gradient-to-b from-transparent via-red-900/50 to-transparent"
          />
        </motion.div>
      </section>

      {/* Author Information Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background image */}
        <ParallaxImage
          src={infoImage}
          alt="Books and typewriter"
          speed={0.15}
          overlayOpacity={0.85}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-16"
          >
            <h2 
              className="text-2xl md:text-3xl font-light tracking-[0.2em] text-center mb-2"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              THE AUTHOR
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-red-900 to-transparent mx-auto" />
          </motion.div>

          {/* Book-style Info Grid */}
          <div className="space-y-0 backdrop-blur-sm bg-black/30 rounded-2xl p-6 md:p-8 border border-white/5">
            {authorInfo.map((info, index) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94] 
                }}
                className="py-6 border-b border-red-900/20 last:border-b-0"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <span 
                    className="text-sm tracking-[0.3em] text-red-900/80 uppercase w-40 flex-shrink-0"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {info.label}
                  </span>
                  <span 
                    className="text-lg md:text-xl text-neutral-200 font-light"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {info.value}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Author - Emotional Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background image */}
        <ParallaxImage
          src={storyImage}
          alt="Poet writing with floating words"
          speed={0.2}
          overlayOpacity={0.8}
        />

        {/* Floating particles for this section */}
        <FloatingParticles />

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-16"
          >
            <h2 
              className="text-2xl md:text-3xl font-light tracking-[0.2em] text-center mb-2"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              ABOUT THE AUTHOR
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-red-900 to-transparent mx-auto" />
          </motion.div>

          {/* Poetic paragraphs with line-by-line reveal */}
          <div className="space-y-8">
            {aboutParagraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94] 
                }}
                className={`text-lg md:text-xl leading-relaxed ${
                  index === 0 
                    ? 'text-2xl md:text-3xl text-white italic' 
                    : 'text-neutral-300'
                }`}
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* Signature */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-16 text-right"
          >
            <div className="inline-block">
              <motion.p 
                className="text-2xl md:text-3xl italic text-neutral-400"
                style={{ fontFamily: 'Georgia, serif' }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                — D. Venky
              </motion.p>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900/50 to-red-900/30 mt-2" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Quote */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background image */}
        <ParallaxImage
          src={quoteImage}
          alt="Heart made of words"
          speed={0.1}
          overlayOpacity={0.75}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="max-w-2xl mx-auto text-center relative z-10"
        >
          {/* Animated quote marks */}
          <motion.span
            className="block text-6xl md:text-8xl text-red-900/30 font-serif leading-none mb-4"
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            "
          </motion.span>
          
          <motion.p 
            className="text-xl md:text-2xl text-neutral-300 italic"
            style={{ fontFamily: 'Georgia, serif' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Every story is a confession. Every word, a heartbeat.
          </motion.p>
          
          <motion.span
            className="block text-6xl md:text-8xl text-red-900/30 font-serif leading-none mt-4 rotate-180"
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            "
          </motion.span>
        </motion.div>
      </section>

      {/* Bottom Navigation Back */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="pb-16 text-center"
      >
        <motion.a 
          href="/"
          className="inline-block text-sm tracking-[0.3em] text-neutral-500 hover:text-red-900 transition-colors duration-500 uppercase"
          style={{ fontFamily: 'Georgia, serif' }}
          whileHover={{ scale: 1.05 }}
        >
          ← Return to Stories
        </motion.a>
      </motion.div>
    </div>
    </>
  );
};

export default Author;
