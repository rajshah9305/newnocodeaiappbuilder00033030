'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading AppGenius</h2>
        <p className="text-slate-600">Preparing your elite AI development environment...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;