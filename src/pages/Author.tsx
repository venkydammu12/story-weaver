import { motion } from 'framer-motion';
import { CinematicNavigation } from '@/components/CinematicNavigation';
import authorProfile from '@/assets/author-profile.jpeg';

const Author = () => {
  const authorInfo = [
    { label: 'Full Name', value: 'D. Venky' },
    { label: 'Role', value: 'Author / Storyteller / Poet' },
    { label: 'Date of Birth', value: 'August 7, 2004' },
    { label: 'Education', value: 'Bachelor of Arts in Literature' },
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <CinematicNavigation />
      
      {/* Hero Section with Author Portrait */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
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
            className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden"
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
          className="text-lg md:text-xl text-neutral-400 italic text-center max-w-xl"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          "Where words breathe and silence speaks"
        </motion.p>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-16 bg-gradient-to-b from-transparent via-red-900/50 to-transparent"
          />
        </motion.div>
      </section>

      {/* Author Information Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
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
          <div className="space-y-0">
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
      <section className="py-24 px-6 relative">
        {/* Subtle background glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(0 70% 10% / 0.15) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-3xl mx-auto relative">
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
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
              <p 
                className="text-2xl md:text-3xl italic text-neutral-400"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                — D. Venky
              </p>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900/50 to-red-900/30 mt-2" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Quote */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p 
            className="text-xl md:text-2xl text-neutral-500 italic"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            "Every story is a confession. Every word, a heartbeat."
          </p>
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
        <a 
          href="/"
          className="inline-block text-sm tracking-[0.3em] text-neutral-500 hover:text-red-900 transition-colors duration-500 uppercase"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          ← Return to Stories
        </a>
      </motion.div>
    </div>
  );
};

export default Author;