import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; displayName?: string }>({});

  useEffect(() => {
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate('/write');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/write');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }

    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }

    if (!isLogin && !displayName.trim()) {
      newErrors.displayName = 'Please enter your name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
          return;
        }
        
        toast.success('Welcome back!');
        navigate('/write');
      } else {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              display_name: displayName.trim(),
            },
          },
        });
        
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please login instead.');
            setIsLogin(true);
          } else {
            toast.error(error.message);
          }
          return;
        }
        
        toast.success('Account created successfully!');
        navigate('/write');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden"
      style={{ perspective: '2000px' }}
    >
      {/* 3D Background */}
      <motion.div 
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, hsl(350 40% 8% / 0.5) 0%, transparent 50%)',
            transform: 'translateZ(-200px) scale(1.2)',
          }}
        />
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse at 70% 80%, hsl(350 50% 12% / 0.4) 0%, transparent 60%)',
              'radial-gradient(ellipse at 60% 70%, hsl(350 50% 18% / 0.5) 0%, transparent 60%)',
              'radial-gradient(ellipse at 70% 80%, hsl(350 50% 12% / 0.4) 0%, transparent 60%)',
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, hsl(0 0% 0% / 0.9) 100%)',
          }}
        />
      </motion.div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors duration-300 group"
      >
        <motion.div
          whileHover={{ x: -4 }}
          className="p-2 rounded-full border border-neutral-700 group-hover:border-red-900/50 group-hover:bg-red-900/10 transition-all duration-300"
        >
          <ArrowLeft size={20} />
        </motion.div>
        <span className="text-sm tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontFamily: 'Georgia, serif' }}>
          Back
        </span>
      </motion.button>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-md mx-4"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div 
          className="p-8 md:p-10 rounded-2xl"
          style={{
            background: 'linear-gradient(145deg, hsl(0 0% 8%) 0%, hsl(0 0% 4%) 100%)',
            boxShadow: '0 25px 80px -20px hsl(350 60% 20% / 0.4), 0 0 60px hsl(350 50% 15% / 0.2), inset 0 1px 0 hsl(0 0% 15%)',
            border: '1px solid hsl(0 0% 12%)',
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 
              className="text-3xl md:text-4xl tracking-[0.1em] mb-3"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {isLogin ? 'Welcome Back' : 'Join Us'}
            </h1>
            <p className="text-neutral-400 text-sm tracking-wider">
              {isLogin ? 'Enter your writer studio' : 'Create your author account'}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full pl-12 pr-4 py-4 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-900/30 transition-all duration-300"
                      style={{ fontFamily: 'Georgia, serif' }}
                    />
                  </div>
                  {errors.displayName && (
                    <p className="text-red-400 text-xs mt-2 ml-1">{errors.displayName}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-900/30 transition-all duration-300"
                  style={{ fontFamily: 'Georgia, serif' }}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-2 ml-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-4 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-900/30 transition-all duration-300"
                  style={{ fontFamily: 'Georgia, serif' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-2 ml-1">{errors.password}</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 mt-6 bg-gradient-to-r from-red-900/60 to-red-800/40 border border-red-900/40 rounded-lg text-white font-medium tracking-wider hover:from-red-900/80 hover:to-red-800/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              style={{
                boxShadow: '0 10px 30px -10px hsl(350 60% 25% / 0.5)',
              }}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <span style={{ fontFamily: 'Georgia, serif' }}>
                  {isLogin ? 'Enter Studio' : 'Create Account'}
                </span>
              )}
            </motion.button>
          </form>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center mt-8"
          >
            <p className="text-neutral-400 text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="ml-2 text-red-400 hover:text-red-300 transition-colors underline underline-offset-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-1 h-1 rounded-full bg-red-400/30"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
};

export default Auth;
