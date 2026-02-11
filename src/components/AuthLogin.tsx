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
          className="fixed inset-0 z-[200] flex items-center justify-center px-6"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/60 backdrop-blur-md" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-[201] w-full max-w-md p-8 rounded-2xl bg-gradient-to-b from-card to-background text-foreground ring-2 ring-primary/30 border border-border/60"
            style={{
              boxShadow:
                '0 0 0 1px hsl(var(--border) / 0.5), 0 25px 60px -20px hsl(0 0% 0% / 0.85), 0 0 80px hsl(var(--primary) / 0.20)',
            }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-primary/80 text-xs tracking-[0.3em] uppercase mb-2">
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
                <label className="text-sm text-muted-foreground" style={{ fontFamily: 'Georgia, serif' }}>
                  Enter Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-background/40"
                    required
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-sm text-center font-medium"
                >
                  {error}
                </motion.p>
              )}

              <Button type="submit" disabled={loading} className="w-full">
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
