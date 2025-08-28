// Database types (should match Prisma schema)
export interface User {
  id: string;
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  bio?: string;
  plan: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  prompt: string;
  status: ProjectStatus;
  framework: string;
  category: string;
  deployUrl?: string;
  repository?: string;
  thumbnail?: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: User;
  agents?: AgentExecution[];
  codeFiles?: CodeFile[];
  analytics?: ProjectAnalytics;
}

export type ProjectStatus = 'draft' | 'building' | 'deployed' | 'error';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  framework: string;
  image?: string;
  premium: boolean;
  price: string;
  features: string[];
  downloads: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  codeFiles?: CodeFile[];
}

export interface AgentExecution {
  id: string;
  agentId: string;
  agentName: string;
  status: AgentStatus;
  progress: number;
  output?: string;
  error?: string;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  projectId: string;
  project?: Project;
}

export type AgentStatus = 'pending' | 'active' | 'completed' | 'error';

export interface CodeFile {
  id: string;
  filename: string;
  content: string;
  language: string;
  agent: string;
  projectId?: string;
  templateId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatar?: string;
  status: MemberStatus;
  lastActive: string;
  joinedAt: Date;
}

export type TeamRole = 'owner' | 'admin' | 'member' | 'viewer';
export type MemberStatus = 'active' | 'inactive' | 'pending';

export interface ApiKey {
  id: string;
  name: string;
  service: string;
  masked: string;
  lastUsed?: string;
  status: ApiKeyStatus;
  createdAt: Date;
}

export type ApiKeyStatus = 'active' | 'inactive' | 'expired';

export interface NotificationSettings {
  id: string;
  email: boolean;
  deployment: boolean;
  team: boolean;
  marketing: boolean;
  userId: string;
}

export interface UserAnalytics {
  id: string;
  totalProjects: number;
  totalViews: number;
  totalDownloads: number;
  activeProjects: number;
  userId: string;
}

export interface ProjectAnalytics {
  id: string;
  views: number;
  uniqueVisitors: number;
  deployments: number;
  lastDeployed?: Date;
  buildTime?: number;
  errorCount: number;
  projectId: string;
}

// AI Agent types
export interface Agent {
  id: string;
  name: string;
  icon: any; // Lucide icon component
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  role: string;
  goal: string;
  backstory: string;
  tools: string[];
  maxExecutionTime: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Generation types
export interface GenerationRequest {
  prompt: string;
  framework?: string;
  features?: string[];
  template?: string;
}

export interface GenerationResponse {
  projectId: string;
  status: ProjectStatus;
  agents: AgentExecution[];
}

export interface GenerationEvent {
  type: 'agent_start' | 'agent_progress' | 'agent_complete' | 'agent_error' | 'generation_complete' | 'generation_error';
  agentId?: string;
  agentName?: string;
  content?: string;
  code?: string;
  error?: string;
  timestamp: string;
  projectId?: string;
}

// UI State types
export interface UIState {
  activeTab: string;
  sidebarCollapsed: boolean;
  darkMode: boolean;
  isLoading: boolean;
  showProfileMenu: boolean;
  agentViewMode: 'grid' | 'timeline';
  previewMode: 'desktop' | 'tablet' | 'mobile';
}

export interface FilterState {
  projectFilter: string;
  projectSort: string;
  projectSearch: string;
  templateCategory: string;
  templateSearch: string;
  analyticsTimeRange: string;
}

// Form types
export interface ProjectForm {
  name: string;
  description: string;
  framework: string;
  category: string;
  prompt?: string;
}

export interface TeamInviteForm {
  email: string;
  role: TeamRole;
  message?: string;
}

export interface ApiKeyForm {
  name: string;
  service: string;
  key: string;
}

export interface SettingsForm {
  name?: string;
  email?: string;
  bio?: string;
  notifications: NotificationSettings;
}

// Chart data types
export interface ChartDataPoint {
  date: string;
  projects: number;
  views: number;
  deployments: number;
}

export interface AnalyticsData {
  overview: {
    totalProjects: number;
    activeProjects: number;
    totalViews: number;
    totalDeployments: number;
    growthRate: number;
  };
  chartData: ChartDataPoint[];
  recentActivity: ActivityItem[];
  topProjects: TopProject[];
  performanceMetrics: {
    averageBuildTime: number;
    successRate: number;
    popularFramework: string;
  };
  timeRange: string;
}

export interface ActivityItem {
  id: string;
  type: 'deployment' | 'building' | 'error' | 'created';
  message: string;
  timestamp: string;
  project: string;
}

export interface TopProject {
  id: string;
  name: string;
  views: number;
  status: ProjectStatus;
  framework: string;
}

// Error types
export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: any;
}

// Session types (extending NextAuth)
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string;
      email: string;
      image?: string;
      plan?: string;
      analytics?: UserAnalytics;
    };
  }

  interface User {
    id: string;
    plan?: string;
    analytics?: UserAnalytics;
  }
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PageProps {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Configuration types
export interface AppConfig {
  name: string;
  description: string;
  url: string;
  version: string;
  features: {
    teams: boolean;
    analytics: boolean;
    premiumTemplates: boolean;
  };
  limits: {
    freeProjects: number;
    proProjects: number;
    maxTeamMembers: number;
  };
}

// Webhook types
export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  userId?: string;
  projectId?: string;
}

// File upload types
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

// Search types
export interface SearchResult {
  id: string;
  type: 'project' | 'template' | 'user';
  title: string;
  description: string;
  url: string;
  image?: string;
  score: number;
}

export interface SearchFilters {
  type?: string[];
  category?: string[];
  framework?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
}