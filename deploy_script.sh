#!/bin/bash

# AppGenius AI Builder Deployment Script
# This script handles the complete deployment process

set -e  # Exit on any error

echo "🚀 Starting AppGenius AI Builder Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
SKIP_TESTS=${SKIP_TESTS:-false}
SKIP_BUILD=${SKIP_BUILD:-false}

echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print colored output
print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
print_step "Checking prerequisites..."

if ! command_exists node; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed"
    exit 1
fi

if [[ "$ENVIRONMENT" == "production" ]] && ! command_exists docker; then
    print_warning "Docker is not installed - Docker deployment will be skipped"
fi

print_success "Prerequisites check completed"

# Check environment variables
print_step "Checking environment variables..."

required_vars=(
    "DATABASE_URL"
    "NEXTAUTH_SECRET"
    "NEXTAUTH_URL"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if [[ -z "${!var}" ]]; then
        missing_vars+=("$var")
    fi
done

if [[ ${#missing_vars[@]} -ne 0 ]]; then
    print_error "Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    echo "Please set these variables and try again."
    exit 1
fi

print_success "Environment variables check completed"

# Install dependencies
print_step "Installing dependencies..."
npm ci --silent
print_success "Dependencies installed"

# Generate Prisma client
print_step "Generating Prisma client..."
npx prisma generate
print_success "Prisma client generated"

# Run database migrations
print_step "Running database migrations..."
npx prisma db push --accept-data-loss
print_success "Database migrations completed"

# Seed database (only if specified)
if [[ "$SEED_DATABASE" == "true" ]]; then
    print_step "Seeding database..."
    npm run db:seed
    print_success "Database seeded"
fi

# Run tests (unless skipped)
if [[ "$SKIP_TESTS" != "true" ]]; then
    print_step "Running tests..."
    npm run lint
    npm run type-check
    
    if command_exists jest; then
        npm run test
    else
        print_warning "Jest not found, skipping unit tests"
    fi
    
    print_success "Tests completed"
else
    print_warning "Tests skipped"
fi

# Build application (unless skipped)
if [[ "$SKIP_BUILD" != "true" ]]; then
    print_step "Building application..."
    npm run build
    print_success "Application built"
else
    print_warning "Build skipped"
fi

# Deploy based on environment
case $ENVIRONMENT in
    "production")
        print_step "Deploying to production..."
        
        # Vercel deployment
        if command_exists vercel; then
            print_step "Deploying to Vercel..."
            vercel --prod --confirm
            print_success "Deployed to Vercel"
        else
            print_warning "Vercel CLI not found, skipping Vercel deployment"
        fi
        
        # Docker deployment
        if command_exists docker; then
            print_step "Building Docker image..."
            docker build -t appgenius-ai-builder:latest .
            print_success "Docker image built"
            
            if [[ -n "$DOCKER_REGISTRY" ]]; then
                print_step "Pushing to Docker registry..."
                docker tag appgenius-ai-builder:latest $DOCKER_REGISTRY/appgenius-ai-builder:latest
                docker push $DOCKER_REGISTRY/appgenius-ai-builder:latest
                print_success "Docker image pushed to registry"
            fi
        fi
        ;;
        
    "staging")
        print_step "Deploying to staging..."
        if command_exists vercel; then
            vercel --confirm
            print_success "Deployed to staging"
        else
            print_warning "Vercel CLI not found, skipping staging deployment"
        fi
        ;;
        
    "development"|"dev")
        print_step "Starting development server..."
        npm run dev
        ;;
        
    *)
        print_error "Unknown environment: $ENVIRONMENT"
        echo "Available environments: production, staging, development"
        exit 1
        ;;
esac

# Health check
if [[ "$ENVIRONMENT" == "production" ]] && [[ -n "$HEALTH_CHECK_URL" ]]; then
    print_step "Running health check..."
    
    max_attempts=30
    attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -f "$HEALTH_CHECK_URL/api/health" >/dev/null 2>&1; then
            print_success "Health check passed"
            break
        else
            print_warning "Health check attempt $attempt/$max_attempts failed, retrying in 10 seconds..."
            sleep 10
            ((attempt++))
        fi
    done
    
    if [[ $attempt -gt $max_attempts ]]; then
        print_error "Health check failed after $max_attempts attempts"
        exit 1
    fi
fi

# Cleanup
print_step "Cleaning up..."
if [[ -d ".next" ]] && [[ "$ENVIRONMENT" != "development" ]]; then
    # Clean up build artifacts if needed
    print_success "Cleanup completed"
fi

# Success message
print_success "🎉 Deployment completed successfully!"

if [[ "$ENVIRONMENT" == "production" ]]; then
    echo -e "${GREEN}"
    echo "================================================"
    echo "🚀 AppGenius AI Builder is now live!"
    echo "================================================"
    echo "Environment: Production"
    echo "Health Check: $HEALTH_CHECK_URL/api/health"
    echo "Application: $NEXTAUTH_URL"
    echo "================================================"
    echo -e "${NC}"
fi

# Post-deployment notifications
if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚀 AppGenius AI Builder deployed successfully to $ENVIRONMENT\"}" \
        "$SLACK_WEBHOOK_URL"
fi

echo "✨ Deployment script completed!"