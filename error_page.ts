'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h1>
            <p className="text-slate-600 mb-6">
              We encountered an unexpected error. Our AI agents are working to fix this issue.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
                <code className="text-sm text-red-700 break-all">{error.message}</code>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={reset}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/'}
                className="border border-slate-300 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </motion.button>
            </div>

            <p className="text-xs text-slate-500 mt-6">
              Error ID: {error.digest || 'Unknown'}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}