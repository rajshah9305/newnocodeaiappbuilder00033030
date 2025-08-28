'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Home, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-xl">AppGenius</span>
          </div>

          {/* 404 Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <div className="text-8xl font-bold text-slate-200 mb-4">404</div>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-6" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Page Not Found</h1>
            <p className="text-slate-600 mb-8 leading-relaxed">
              The page you're looking for seems to have been moved, deleted, or doesn't exist. 
              Our AI agents couldn't locate it either!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.history.back()}
                className="w-full sm:w-auto border border-slate-300 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </motion.button>
            </div>

            {/* Search Suggestion */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-center gap-2 text-slate-600 mb-2">
                <Search className="h-4 w-4" />
                <span className="font-medium">Looking for something specific?</span>
              </div>
              <p className="text-sm text-slate-500">
                Try searching our AI Builder or check out our templates to get started.
              </p>
            </div>

            {/* Quick Links */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'AI Builder', href: '/?tab=builder' },
                { label: 'Templates', href: '/?tab=templates' },
                { label: 'Projects', href: '/?tab=projects' }
              ].map((link, index) => (
                <Link key={index} href={link.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="text-center p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-medium text-slate-700">{link.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}