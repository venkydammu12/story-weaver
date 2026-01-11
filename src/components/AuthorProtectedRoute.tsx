import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AuthorProtectedRouteProps {
  children: React.ReactNode;
}

export const AuthorProtectedRoute = ({ children }: AuthorProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const [isAuthor, setIsAuthor] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuthorRole = async () => {
      if (!user) {
        setIsAuthor(false);
        setChecking(false);
        return;
      }

      try {
        // Check if user has author role
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
      } finally {
        setChecking(false);
      }
    };

    if (!authLoading) {
      checkAuthorRole();
    }
  }, [user, authLoading]);

  // Show loading state while checking auth and role
  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-8 h-8 text-red-900" />
          </motion.div>
          <p className="text-neutral-400 text-sm tracking-wider">Verifying access...</p>
        </motion.div>
      </div>
    );
  }

  // Not authenticated - redirect to author page with login prompt
  if (!user) {
    return <Navigate to="/author" state={{ from: location, showLogin: true }} replace />;
  }

  // Not an author - show access denied
  if (!isAuthor) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-900/20 flex items-center justify-center"
            animate={{ 
              boxShadow: ['0 0 20px hsl(0 70% 25% / 0.3)', '0 0 40px hsl(0 70% 25% / 0.5)', '0 0 20px hsl(0 70% 25% / 0.3)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-8 h-8 text-red-500" />
          </motion.div>
          <h1 
            className="text-2xl font-light tracking-wider mb-4 text-white"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Access Restricted
          </h1>
          <p className="text-neutral-400 mb-8">
            The Writer Studio is available only to authorized authors.
          </p>
          <motion.button
            onClick={() => window.history.back()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-red-900/30 border border-red-900/50 rounded-lg text-white hover:bg-red-900/50 transition-colors"
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // User is authenticated and is an author - render children
  return <>{children}</>;
};
