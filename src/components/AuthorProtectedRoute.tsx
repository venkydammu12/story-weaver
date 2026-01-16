import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

interface AuthorProtectedRouteProps {
  children: React.ReactNode;
}

export const AuthorProtectedRoute = ({ children }: AuthorProtectedRouteProps) => {
  const location = useLocation();
  
  // Check if user has password access via sessionStorage
  const hasAccess = sessionStorage.getItem('author_access') === 'granted';

  // Not authorized - redirect to author page with login prompt
  if (!hasAccess) {
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
            The Writer Studio requires author access.
          </p>
          <motion.button
            onClick={() => window.location.href = '/author'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-red-900/30 border border-red-900/50 rounded-lg text-white hover:bg-red-900/50 transition-colors"
          >
            Go to Author Page
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // User has password access - render children
  return <>{children}</>;
};
