'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  Play, Pause, Code, Eye, Sparkles, Zap, Brain, Database, TestTube, Cloud,
  ArrowRight, CheckCircle, Circle, MessageSquare, Layers, GitBranch, Rocket,
  Menu, X, Home, FolderOpen, Settings, BarChart3, Users, FileCode2,
  Monitor, Smartphone, Tablet, Download, Share2, Copy, Terminal,
  ChevronRight, Activity, Clock, Target, Search, Plus, Filter, MoreHorizontal,
  TrendingUp, Calendar, Star, Trash2, Edit3, LogOut, User, Bell,
  Globe, Shield, CreditCard, HelpCircle, ChevronDown, ExternalLink,
  Folder, Image, FileText, Crown, Award, Mail, Phone, Upload, Command,
  Grid, List, LayoutDashboard, Bot, Package, LifeBuoy, Moon, Sun, Key,
  AlertCircle, Save, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Agent {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  codeOutput?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'building' | 'deployed' | 'error';
  lastModified: string;
  views: number;
  framework: string;
  deployUrl?: string;
  category: string;
  thumbnail: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  downloads: number;
  rating: number;
  premium: boolean;
  price: string;
  features: string[];
  framework: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'active' | 'away' | 'offline';
  lastActive: string;
}

interface ApiKey {
  id: string;
  name: string;
  service: string;
  masked: string;
  lastUsed?: string;
  status: 'active' | 'inactive';
}

// Main Component
const EliteAppBuilder = () => {
  // Authentication
  const { data: session, status } = useSession();

  // Core State
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [agentProgress, setAgentProgress] = useState<Record<string, string>>({});
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedCode, setGeneratedCode] = useState<Record<string, string>>({});

  // UI State
  const [activeTab, setActiveTab] = useState('builder');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [agentViewMode, setAgentViewMode] = useState<'grid' | 'timeline'>('grid');
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Page-specific state
  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  
  // Filters and search
  const [projectFilter, setProjectFilter] = useState('all');
  const [projectSort, setProjectSort] = useState('lastModified');
  const [projectSearch, setProjectSearch] = useState('');
  const [templateCategory, setTemplateCategory] = useState('all');
  const [templateSearch, setTemplateSearch] = useState('');
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState('7d');

  // Modals and dialogs
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');

  // API Key management
  const [newApiKey, setNewApiKey] = useState({ name: '', service: 'cerebras', key: '' });
  
  // Settings
  const [notifications, setNotifications] = useState({
    email: true,
    deployment: true,
    team: false,
    marketing: false
  });

  // Agent Configuration
  const agents: Agent[] = [
    {
      id: 'orchestrator',
      name: 'Project Orchestrator',
      icon: Brain,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      description: 'Analyzing requirements and creating project blueprint',
      codeOutput: '// Project configuration and setup\nconst projectConfig = {\n  name: "TaskManager",\n  framework: "React",\n  styling: "TailwindCSS"\n};'
    },
    {
      id: 'ui',
      name: 'UI/UX Designer',
      icon: Layers,
      color: 'from-sky-500 to-cyan-500',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-300',
      description: 'Crafting beautiful, responsive user interfaces',
      codeOutput: 'const TaskCard = ({ task }) => (\n  <div className="bg-white p-4 rounded-lg shadow-sm border">\n    <h3 className="font-medium">{task.title}</h3>\n  </div>\n);'
    },
    {
      id: 'backend',
      name: 'Backend Architect',
      icon: GitBranch,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-300',
      description: 'Building robust API endpoints and business logic',
      codeOutput: 'const api = {\n  getTasks: async () => {\n    return await fetch("/api/tasks");\n  }\n};'
    },
    {
      id: 'database',
      name: 'Database Engineer',
      icon: Database,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300',
      description: 'Designing optimal data structures',
      codeOutput: 'CREATE TABLE tasks (\n  id SERIAL PRIMARY KEY,\n  title VARCHAR(255) NOT NULL\n);'
    },
    {
      id: 'tester',
      name: 'Quality Assurance',
      icon: TestTube,
      color: 'from-rose-500 to-red-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-300',
      description: 'Ensuring code quality and performance',
      codeOutput: 'test("should render task list", () => {\n  render(<TaskManager />);\n});'
    },
    {
      id: 'deployment',
      name: 'DevOps Specialist',
      icon: Cloud,
      color: 'from-slate-500 to-slate-600',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-300',
      description: 'Preparing production-ready deployment',
      codeOutput: '// vercel.json\n{\n  "builds": [{\n    "src": "package.json"\n  }]\n}'
    }
  ];

  const sidebarMenuItems = [
    { id: 'builder', label: 'AI Builder', icon: Sparkles },
    { id: 'projects', label: 'My Projects', icon: FolderOpen },
    { id: 'templates', label: 'Templates', icon: Layers },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const sampleApps = [
    'A task management app with team collaboration and real-time updates',
    'An e-commerce platform for handmade jewelry with inventory management',
    'A social media dashboard for content creators with analytics',
    'A personal finance tracker with budgeting and investment tools',
    'A recipe sharing platform with meal planning features'
  ];

  // API Functions
  const fetchProjects = useCallback(async () => {
    if (!session?.user) return;
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, [session]);

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await fetch('/api/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  }, []);

  const fetchTeamMembers = useCallback(async () => {
    if (!session?.user) return;
    try {
      const response = await fetch('/api/team');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data.members || []);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  }, [session]);

  const fetchApiKeys = useCallback(async () => {
    if (!session?.user) return;
    try {
      const response = await fetch('/api/api-keys');
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.keys || []);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
    }
  }, [session]);

  // Effects
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (session?.user) {
      fetchProjects();
      fetchTemplates();
      fetchTeamMembers();
      fetchApiKeys();
    }
  }, [session, fetchProjects, fetchTemplates, fetchTeamMembers, fetchApiKeys]);

  // Real AI Generation with Cerebras
  const startGeneration = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setShowPreview(false);
    setCurrentStep(0);
    setCodeLines([]);
    setAgentProgress({});
    setActiveAgent(null);
    setGeneratedCode({});

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) throw new Error('Generation failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            try {
              const data = JSON.parse(line.replace('data: ', ''));
              
              if (data.type === 'agent_start') {
                setActiveAgent(data.agentId);
                setAgentProgress(prev => ({ ...prev, [data.agentId]: 'active' }));
              } else if (data.type === 'agent_progress') {
                setCodeLines(prev => [...prev, data.content]);
              } else if (data.type === 'agent_complete') {
                setAgentProgress(prev => ({ ...prev, [data.agentId]: 'completed' }));
                setGeneratedCode(prev => ({ ...prev, [data.agentId]: data.code }));
              } else if (data.type === 'generation_complete') {
                setIsGenerating(false);
                setShowPreview(true);
                setActiveAgent(null);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Generation error:', error);
      setIsGenerating(false);
    }
  };

  // Component for Agent Card
  const AgentCard: React.FC<{
    agent: Agent;
    isActive: boolean;
    isCompleted: boolean;
    viewMode?: 'grid' | 'timeline';
  }> = ({ agent, isActive, isCompleted, viewMode = 'grid' }) => {
    const Icon = agent.icon;

    if (viewMode === 'timeline') {
      return (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all"
        >
          <div className={`relative p-3 rounded-lg bg-gradient-to-br ${agent.color} shadow-sm flex-shrink-0`}>
            <Icon className="h-5 w-5 text-white" />
            {isActive && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-lg opacity-20"
              />
            )}
            {isCompleted && (
              <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-500 bg-white rounded-full shadow-sm" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900">{agent.name}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="h-3 w-3" /> 
                {isCompleted ? 'Completed' : isActive ? 'Processing...' : 'Pending'}
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-3">{agent.description}</p>
            {isActive && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3" /> Processing...
                  </span>
                  <span>Working</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            )}
            {isCompleted && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Completed successfully</span>
              </div>
            )}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative p-4 rounded-xl border-2 transition-all duration-500 cursor-pointer ${
          isActive
            ? `${agent.borderColor} ${agent.bgColor} shadow-lg scale-105 ring-2 ring-indigo-300`
            : isCompleted
            ? 'border-green-300 bg-green-50 shadow-md'
            : 'border-slate-200 bg-white hover:shadow-md hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`relative p-3 rounded-lg bg-gradient-to-br ${agent.color} shadow-sm`}>
            <Icon className="h-5 w-5 text-white" />
            {isActive && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-lg opacity-20"
              />
            )}
            {isCompleted && (
              <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-500 bg-white rounded-full shadow-sm" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-sm">{agent.name}</h3>
            <p className="text-xs text-slate-600 mt-1 truncate">{agent.description}</p>
            {isActive && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3" /> Processing...
                  </span>
                </div>
                <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            )}
            {isCompleted && (
              <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                <CheckCircle className="h-3 w-3" />
                <span>Completed</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Render functions for different pages
  const renderBuilderContent = () => (
    <div className="flex-1 flex bg-slate-100">
      {/* Left Panel - Agent Orchestration */}
      <div className="w-1/3 p-6 border-r border-slate-200 bg-white">
        <div className="mb-6">
          <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-700 text-sm mb-4">
            <Zap className="h-4 w-4" />
            <span>Powered by <strong>CrewAI + Cerebras</strong></span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Agent Orchestration</h3>
          <p className="text-slate-600 text-sm mb-4">Watch specialized AI agents collaborate to build your application.</p>

          {!isGenerating && !showPreview && (
            <div className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your app idea in detail..."
                className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startGeneration}
                disabled={!prompt.trim() || isGenerating}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate App with AI Agents
                  </>
                )}
              </motion.button>

              <div className="mt-6">
                <p className="text-slate-500 text-sm mb-3">Or try one of these examples:</p>
                <div className="space-y-2">
                  {sampleApps.map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrompt(example)}
                      className="w-full text-left px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-sm"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600 mb-2">AI Agents are building your app...</p>
              <p className="text-slate-500 text-sm">This process uses real AI to generate your application</p>
            </motion.div>
          )}

          {showPreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">Your app is ready!</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                  Deploy Now
                </button>
                <button className="flex-1 border border-slate-300 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-50">
                  Edit Code
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Middle Panel - Agent Progress */}
      <div className="w-1/3 p-6 border-r border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Agent Progress</h3>
          <div className="flex bg-slate-200 rounded-lg p-1">
            <button
              onClick={() => setAgentViewMode('grid')}
              className={`px-3 py-1 rounded text-xs ${
                agentViewMode === 'grid' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setAgentViewMode('timeline')}
              className={`px-3 py-1 rounded text-xs ${
                agentViewMode === 'timeline' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          <AnimatePresence>
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AgentCard
                  agent={agent}
                  isActive={agentProgress[agent.id] === 'active'}
                  isCompleted={agentProgress[agent.id] === 'completed'}
                  viewMode={agentViewMode}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {isGenerating && activeAgent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-slate-900 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">
                {agents.find(a => a.id === activeAgent)?.name} - Live Output
              </span>
            </div>
            <div className="bg-black rounded p-3 font-mono text-sm max-h-32 overflow-y-auto">
              {codeLines.map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-emerald-400"
                >
                  {line}
                  {idx === codeLines.length - 1 && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      |
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Right Panel - Live Preview */}
      <div className="w-1/3 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Eye className="h-5 w-5" /> Live Preview
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-200 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-white shadow-sm' : ''}`}
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
            <button className="p-2 text-slate-500 hover:text-slate-700 border border-slate-300 rounded-lg">
              <Code className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className={`bg-slate-200 rounded-xl p-4 ${
          previewMode === 'mobile' ? 'max-w-sm mx-auto' : 
          previewMode === 'tablet' ? 'max-w-md mx-auto' : ''
        }`}>
          <div className="bg-white rounded-lg min-h-[500px] border-2 border-slate-300 overflow-hidden">
            {showPreview ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4"
              >
                {/* Generated App Preview */}
                <div className="border-b pb-4 mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">Task Manager Pro</h2>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600">
                      <Filter className="h-4 w-4" />
                    </button>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center gap-1">
                      <Plus className="h-4 w-4" /> Add Task
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Search tasks..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">Design new homepage</h3>
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            high
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-2">Create modern, responsive design</p>
                        <div className="text-xs text-slate-500">
                          Assigned to: John Doe • Due: 2025-01-15
                        </div>
                      </div>
                      <span className="px-3 py-1 text-sm bg-sky-100 text-sky-800 rounded-full">
                        in-progress
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">Setup analytics tracking</h3>
                          <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">
                            medium
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-2">Implement Google Analytics</p>
                        <div className="text-xs text-slate-500">
                          Assigned to: Jane Smith • Due: 2025-01-20
                        </div>
                      </div>
                      <span className="px-3 py-1 text-sm bg-slate-100 text-slate-800 rounded-full">
                        pending
                      </span>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-slate-500 mb-2">You have 2 tasks total</p>
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                    View all tasks →
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  {isGenerating ? (
                    <>
                      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-slate-600 mb-2">AI Agents are building your app...</p>
                      <p className="text-slate-500 text-sm">Using real AI to generate your application</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-600">Live preview will appear here</p>
                      <p className="text-slate-500 text-sm">Start by describing your app idea</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // For brevity, I'll implement the other render functions in a simplified way
  // In a real implementation, these would be fully fleshed out
  const renderProjectsContent = () => (
    <div className="p-6 bg-slate-50 flex-1">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">My Projects</h2>
          <p className="text-slate-600">Manage and deploy your AI-generated applications</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowNewProjectModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4" /> New Project
        </motion.button>
      </div>

      {/* Projects grid would go here with real data from projects state */}
      <div className="grid gap-6">
        {projects.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
            <Folder className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No projects yet</h3>
            <p className="text-slate-500 mb-6">Create your first project to get started with AI-powered development</p>
            <button
              onClick={() => setActiveTab('builder')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              Create First Project
            </button>
          </div>
        ) : (
          projects.map(project => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Project card content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{project.name}</h3>
                <p className="text-slate-600 mb-4">{project.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    project.status === 'deployed' ? 'bg-green-100 text-green-800' :
                    project.status === 'building' ? 'bg-sky-100 text-sky-800' :
                    project.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {project.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">
                      Edit
                    </button>
                    {project.deployUrl && (
                      <button className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100">
                        View Live
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );

  // Settings content with API key management
  const renderSettingsContent = () => (
    <div className="p-6 max-w-4xl mx-auto bg-slate-50 flex-1">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
        <p className="text-slate-600">Manage your account preferences and API integrations</p>
      </div>

      <div className="space-y-6">
        {/* API Keys Section */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Key className="h-5 w-5" /> API Keys
                </h3>
                <p className="text-slate-600 text-sm">Manage your AI service API keys</p>
              </div>
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Key
              </button>
            </div>
          </div>
          <div className="p-6">
            {apiKeys.length === 0 ? (
              <div className="text-center py-8">
                <Key className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">No API keys configured</p>
                <p className="text-slate-400 text-sm">Add your Cerebras API key to start generating applications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {apiKeys.map(key => (
                  <div key={key.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Key className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{key.name}</h4>
                        <p className="text-slate-500 text-sm">{key.service} • {key.masked}</p>
                        {key.lastUsed && (
                          <p className="text-slate-400 text-xs">Last used: {key.lastUsed}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        key.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <button className="p-2 text-slate-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Bell className="h-5 w-5" /> Notifications
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-900 capitalize">{key} Notifications</h4>
                  <p className="text-slate-600 text-sm">Receive {key} updates and alerts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={value}
                    onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <User className="h-5 w-5" /> Account Settings
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  defaultValue={session?.user?.name || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  defaultValue={session?.user?.email || ''}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </motion.button>
      </div>
    </div>
  );

  // Simplified implementations for other pages
  const renderTemplatesContent = () => (
    <div className="p-6 bg-slate-50 flex-1">
      <div className="text-center py-16">
        <Layers className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Templates Coming Soon</h3>
        <p className="text-slate-600 mb-6">Professional templates will be available in the next update</p>
        <button
          onClick={() => setActiveTab('builder')}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
        >
          Create Custom App Instead
        </button>
      </div>
    </div>
  );

  const renderAnalyticsContent = () => (
    <div className="p-6 bg-slate-50 flex-1">
      <div className="text-center py-16">
        <BarChart3 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Analytics Dashboard</h3>
        <p className="text-slate-600 mb-6">Detailed analytics will be available once you create projects</p>
        <button
          onClick={() => setActiveTab('builder')}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
        >
          Create Your First Project
        </button>
      </div>
    </div>
  );

  const renderTeamContent = () => (
    <div className="p-6 bg-slate-50 flex-1">
      <div className="text-center py-16">
        <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Team Collaboration</h3>
        <p className="text-slate-600 mb-6">Team features will be available in the Pro plan</p>
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all">
          Upgrade to Pro
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'builder': return renderBuilderContent();
      case 'projects': return renderProjectsContent();
      case 'templates': return renderTemplatesContent();
      case 'analytics': return renderAnalyticsContent();
      case 'team': return renderTeamContent();
      case 'settings': return renderSettingsContent();
      default: return renderBuilderContent();
    }
  };

  // API Key Modal
  const ApiKeyModal = () => (
    <AnimatePresence>
      {showApiKeyModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-xl max-w-md w-full"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Add API Key</h2>
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Key Name</label>
                  <input
                    type="text"
                    value={newApiKey.name}
                    onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                    placeholder="My Cerebras Key"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Service</label>
                  <select
                    value={newApiKey.service}
                    onChange={(e) => setNewApiKey({ ...newApiKey, service: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="cerebras">Cerebras</option>
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">API Key</label>
                  <input
                    type="password"
                    value={newApiKey.key}
                    onChange={(e) => setNewApiKey({ ...newApiKey, key: e.target.value })}
                    placeholder="sk-..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Your API key will be encrypted and stored securely</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={async () => {
                    // Add API key logic here
                    setShowApiKeyModal(false);
                    setNewApiKey({ name: '', service: 'cerebras', key: '' });
                  }}
                  disabled={!newApiKey.name.trim() || !newApiKey.key.trim()}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  Add API Key
                </button>
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading AppGenius...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white flex font-sans">
        {/* Interactive Sidebar */}
        <motion.div
          initial={{ width: sidebarCollapsed ? 80 : 256 }}
          animate={{ width: sidebarCollapsed ? 80 : 256 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-slate-50 border-r border-slate-200 flex flex-col"
        >
          <div className="p-4 border-b border-slate-200 h-20 flex items-center">
            <div className="flex items-center justify-between w-full">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-slate-900">AppGenius</h1>
                    <p className="text-xs text-slate-500">Elite AI Builder</p>
                  </div>
                </motion.div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <motion.div
                  animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
                </motion.div>
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {sidebarMenuItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </motion.button>
              ))}
            </div>
          </nav>

          {/* Profile Section */}
          <div className="p-4 border-t border-slate-200 relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center gap-3 hover:bg-slate-200 rounded-lg p-2 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {session?.user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              {!sidebarCollapsed && (
                <>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-slate-900">
                      {session?.user?.name || 'User'}
                    </p>
                    <p className="text-xs text-slate-500">Free Plan</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </>
              )}
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-medium text-slate-900">{session?.user?.name}</p>
                    <p className="text-sm text-slate-500">{session?.user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2">
                      <User className="h-4 w-4" /> View Profile
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" /> Settings
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" /> Help & Support
                    </button>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-6 h-20 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 capitalize">
                {activeTab.replace('-', ' ')}
              </h2>
              <p className="text-sm text-slate-500">
                {activeTab === 'builder' && 'Create professional apps with AI-powered multi-agent collaboration'}
                {activeTab === 'projects' && 'Manage and deploy your applications'}
                {activeTab === 'templates' && 'Browse professional app templates'}
                {activeTab === 'analytics' && 'Track your app performance metrics'}
                {activeTab === 'team' && 'Collaborate with your team members'}
                {activeTab === 'settings' && 'Configure your account and preferences'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('builder')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all"
              >
                <Plus className="h-4 w-4" /> New Project
              </motion.button>
            </div>
          </header>

          {/* Page Content */}
          <motion.main
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            {renderContent()}
          </motion.main>
        </div>
      </div>

      {/* Modals */}
      <ApiKeyModal />
    </>
  );
};

export default EliteAppBuilder;