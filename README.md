# AppGenius - Elite AI App Builder

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/appgenius-ai-builder)

**AppGenius** is a cutting-edge AI-powered application builder that uses multi-agent orchestration to create production-ready web applications. Powered by CrewAI and Cerebras AI, it features specialized AI agents that collaborate like a real development team.

## ✨ Features

- 🤖 **Multi-Agent AI System** - Six specialized AI agents working together
- ⚡ **Lightning Fast** - Generate complete apps in minutes
- 🎨 **Beautiful UI** - Modern, responsive designs with Tailwind CSS
- 🔐 **Secure Authentication** - OAuth with Google, GitHub, and email
- 📊 **Analytics Dashboard** - Track performance and usage metrics
- 🚀 **One-Click Deploy** - Direct deployment to Vercel, Netlify
- 🔑 **API Key Management** - Secure encrypted storage of AI service keys
- 📱 **Responsive Design** - Works perfectly on all devices

## 🤖 AI Agents

1. **Project Orchestrator** - Analyzes requirements and creates project architecture
2. **UI/UX Designer** - Creates beautiful, responsive React components
3. **Backend Architect** - Builds robust API endpoints and business logic
4. **Database Engineer** - Designs optimal database schemas
5. **Quality Assurance** - Ensures code quality and writes tests
6. **DevOps Specialist** - Prepares production-ready deployments

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (compatible with Neon, Supabase, PlanetScale)
- **AI**: Cerebras AI, CrewAI for orchestration
- **Authentication**: NextAuth.js with OAuth providers
- **Deployment**: Vercel, Netlify compatible
- **Styling**: Tailwind CSS, Framer Motion

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17+ and npm/yarn/pnpm
- PostgreSQL database (or use Neon/Supabase)
- Cerebras API key ([Get one here](https://inference.cerebras.ai/))
- OAuth app credentials (Google/GitHub)

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/appgenius-ai-builder.git
cd appgenius-ai-builder
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/appgenius"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"

# AI
CEREBRAS_API_KEY="your-cerebras-api-key"

# Encryption
ENCRYPTION_KEY="your-32-character-key-for-api-encryption"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed the database
npm run db:seed
```

### 4. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start building!

## 🔧 Configuration

### OAuth Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

### Cerebras AI Setup
1. Sign up at [Cerebras Inference](https://inference.cerebras.ai/)
2. Get your API key from the dashboard
3. Add it to your environment variables

## 📦 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/appgenius-ai-builder)

1. Click the "Deploy" button above
2. Connect your GitHub repository
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

```bash
# Build the project
npm run build

# Start production server
npm start
```

### Environment Variables for Production

Ensure all environment variables are set in your production environment:

- `DATABASE_URL` - Your production database URL
- `NEXTAUTH_SECRET` - A secure random string
- `NEXTAUTH_URL` - Your production domain
- `CEREBRAS_API_KEY` - Your Cerebras API key
- OAuth credentials for your production domain

## 🎯 Usage

### Creating Your First App

1. **Sign in** with Google or GitHub
2. **Describe your app** - "Create a task management app with team collaboration"
3. **Watch AI agents work** - See real-time progress as agents build your app
4. **Review and deploy** - Get a live preview and deploy with one click

### Managing API Keys

1. Go to Settings → API Keys
2. Add your Cerebras API key
3. Keys are encrypted and stored securely
4. Monitor usage and manage multiple keys

### Customizing Generated Apps

- **Edit code directly** - Built-in Monaco editor
- **Regenerate components** - Ask AI to modify specific parts
- **Add features** - Describe new functionality to add
- **Deploy updates** - Push changes directly to your hosting

## 🏗️ Project Structure

```
appgenius-ai-builder/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication
│   │   ├── generate/     # AI generation
│   │   ├── projects/     # Project management
│   │   └── templates/    # Template system
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── EliteAppBuilder.tsx # Main application
│   ├── LandingPage.tsx   # Marketing page
│   ├── providers/        # Context providers
│   └── ui/               # Reusable UI components
├── lib/                   # Utility libraries
│   ├── prisma.ts         # Database client
│   ├── encryption.ts     # API key encryption
│   └── crewai.ts         # AI orchestration
├── prisma/               # Database schema
│   ├── schema.prisma     # Prisma schema
│   └── seed.ts           # Database seeding
└── public/               # Static assets
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage
```

## 📝 API Documentation

### Generate App
```
POST /api/generate
Content-Type: application/json

{
  "prompt": "Create a task management app with real-time collaboration"
}
```

### List Projects
```
GET /api/projects?filter=deployed&search=task
```

### Manage API Keys
```
POST /api/api-keys
{
  "name": "My Cerebras Key",
  "service": "cerebras",
  "key": "your-api-key"
}
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Run tests** (`npm test`)
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write tests for new features
- Update documentation as needed
- Follow conventional commit messages

## 🔒 Security

- API keys are encrypted using AES-256-GCM
- All user data is stored securely with PostgreSQL
- OAuth authentication with secure session management
- Input validation and sanitization on all endpoints
- HTTPS enforced in production

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CrewAI** for multi-agent orchestration
- **Cerebras** for lightning-fast AI inference
- **Vercel** for seamless deployment
- **Tailwind CSS** for beautiful styling
- **Next.js** for the amazing framework

## 📞 Support

- 📧 Email: support@appgenius.ai
- 💬 Discord: [Join our community](https://discord.gg/appgenius)
- 📖 Docs: [docs.appgenius.ai](https://docs.appgenius.ai)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/appgenius-ai-builder/issues)

---

<div align="center">
  <strong>Built with ❤️ by the AppGenius Team</strong>
  <br>
  <a href="https://appgenius.ai">appgenius.ai</a> • 
  <a href="https://twitter.com/appgenius">@appgenius</a>
</div>
