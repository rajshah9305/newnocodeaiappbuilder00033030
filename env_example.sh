# Database
DATABASE_URL="postgresql://username:password@localhost:5432/appgenius?schema=public"

# Next Auth
NEXTAUTH_SECRET="your-nextauth-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

GITHUB_ID="your-github-oauth-app-id"
GITHUB_SECRET="your-github-oauth-app-secret"

# Email (Optional - for magic link login)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@appgenius.ai"

# AI API Keys
CEREBRAS_API_KEY="your-cerebras-api-key"
OPENAI_API_KEY="your-openai-api-key"  # Fallback/optional
ANTHROPIC_API_KEY="your-anthropic-api-key"  # Fallback/optional

# Encryption
ENCRYPTION_KEY="your-32-character-encryption-key-here"

# File Storage (Optional)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_BUCKET_NAME="appgenius-files"
AWS_REGION="us-east-1"

# Analytics (Optional)
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
POSTHOG_KEY="your-posthog-key"

# Deployment
VERCEL_URL="your-production-domain.com"

# Rate Limiting
REDIS_URL="redis://localhost:6379"  # Optional for rate limiting

# Monitoring (Optional)
SENTRY_DSN="your-sentry-dsn"
LOGTAIL_TOKEN="your-logtail-token"

# Feature Flags
ENABLE_TEAM_FEATURES="true"
ENABLE_PREMIUM_TEMPLATES="true"
ENABLE_ANALYTICS_DASHBOARD="true"