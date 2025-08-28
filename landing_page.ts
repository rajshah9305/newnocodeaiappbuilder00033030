'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { 
  Sparkles, 
  Brain, 
  Zap, 
  Code, 
  Rocket, 
  ArrowRight,
  Github,
  Play,
  CheckCircle,
  Users,
  Globe,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Development',
      description: 'Multi-agent AI system that collaborates to build your applications using CrewAI and Cerebras AI.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate complete applications in minutes, not hours. From idea to deployment in record time.'
    },
    {
      icon: Code,
      title: 'Production Ready',
      description: 'Clean, maintainable code that follows best practices. No placeholders or TODOs.'
    },
    {
      icon: Rocket,
      title: 'One-Click Deploy',
      description: 'Deploy directly to Vercel, Netlify, or any platform. Complete with CI/CD pipelines.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Startup Founder',
      avatar: '👩‍💼',
      quote: 'AppGenius helped me build my MVP in 2 hours. The AI agents work together like a real development team.'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Freelance Developer',
      avatar: '👨‍💻',
      quote: 'The code quality is incredible. I can ship client projects 10x faster now.'
    },
    {
      name: 'Jessica Park',
      role: 'Product Manager',
      avatar: '👩‍🚀',
      quote: 'Finally, a no-code tool that actually produces professional-grade applications.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 text-xl">AppGenius</h1>
                <p className="text-xs text-slate-500">Elite AI Builder</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => signIn('github')}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Github className="h-4 w-4" />
                GitHub
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn('google')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                Build Apps with
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}AI Agents
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
                Watch specialized AI agents collaborate to build your web applications. 
                From idea to deployment in minutes, powered by CrewAI and Cerebras AI.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => signIn('google')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all flex items-center gap-2 text-lg font-semibold"
              >
                <Play className="h-5 w-5" />
                Start Building Free
              </button>
              <button className="border border-slate-300 text-slate-700 px-8 py-4 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 text-lg font-semibold">
                <Play className="h-5 w-5" />
                Watch Demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto border border-slate-200">
                <div className="bg-slate-900 rounded-lg p-6 font-mono text-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-400 ml-4">AI Agent Terminal</span>
                  </div>
                  <div className="text-green-400">
                    <div className="mb-2">→ Project Orchestrator: Analyzing requirements...</div>
                    <div className="mb-2">→ UI Designer: Creating React components...</div>
                    <div className="mb-2">→ Backend Engineer: Setting up API endpoints...</div>
                    <div className="mb-2">→ Database Engineer: Designing schema...</div>
                    <div className="mb-2">→ QA Engineer: Writing tests...</div>
                    <div className="text-indigo-400">✓ Application ready for deployment!</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Powered by Elite AI Technology
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our multi-agent system combines the power of CrewAI orchestration with Cerebras AI inference 
              to deliver unprecedented development speed and quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="inline-flex p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Three simple steps to your dream application</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Describe Your Idea',
                description: 'Tell our AI what you want to build. Be as detailed or as simple as you like.'
              },
              {
                step: '02',
                title: 'Watch Agents Work',
                description: 'Six specialized AI agents collaborate to architect, design, and code your application.'
              },
              {
                step: '03',
                title: 'Deploy & Iterate',
                description: 'Your app is ready to deploy. Make changes and improvements with simple descriptions.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                  <div className="text-6xl font-bold text-indigo-100 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-8 w-8 text-slate-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Loved by Builders</h2>
            <p className="text-xl text-slate-600">See what developers are saying about AppGenius</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-slate-50 p-6 rounded-xl"
              >
                <p className="text-slate-600 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-slate-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of developers using AppGenius to build faster, better applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => signIn('google')}
                className="bg-white text-indigo-600 px-8 py-4 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-lg font-semibold"
              >
                <Sparkles className="h-5 w-5" />
                Start Building Free
              </button>
              <button
                onClick={() => signIn('github')}
                className="border border-indigo-300 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-lg font-semibold"
              >
                <Github className="h-5 w-5" />
                Sign in with GitHub
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl">AppGenius</span>
              </div>
              <p className="text-slate-400">
                Elite AI-powered application builder using multi-agent orchestration.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">© 2025 AppGenius. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;