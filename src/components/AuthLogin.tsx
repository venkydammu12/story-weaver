import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AuthLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AUTHOR_PASSWORD = 'Venkydammu04@';

export const AuthLogin = ({ isOpen, onClose, onSuccess }: AuthLoginProps) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === AUTHOR_PASSWORD) {
      // Store access in sessionStorage (cleared when browser closes)
      sessionStorage.setItem('author_access', 'granted');
      onSuccess?.();
      onClose();
      navigate('/write');
    } else {
      setError('Access Denied');
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setPassword('');
    setError('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md p-8 rounded-2xl bg-neutral-900/90 border border-red-900/30 backdrop-blur-xl"
            style={{
              boxShadow: "0 0 60px hsl(0 70% 20% / 0.4), 0 0 120px hsl(0 70% 15% / 0.2)",
            }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-red-900/80 text-xs tracking-[0.3em] uppercase mb-2">
                Author Access
              </p>
              <h2 
                className="text-2xl md:text-3xl font-light tracking-[0.1em]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Writer Studio
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-neutral-400" style={{ fontFamily: 'Georgia, serif' }}>
                  Enter Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-black/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-red-900/50"
                    required
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm text-center font-medium"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-900/30 border border-red-900/50 hover:bg-red-900/50 text-white transition-all duration-300"
                style={{
                  boxShadow: "0 0 20px hsl(0 70% 25% / 0.3)",
                }}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Enter Studio'
                )}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
