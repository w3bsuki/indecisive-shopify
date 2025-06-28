#!/bin/bash

# Vercel Environment Setup Script
# This script helps configure all necessary environment variables for production deployment

set -e

echo "🚀 Setting up Vercel environment variables for production deployment"
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "npm i -g vercel"
    exit 1
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "❌ You're not logged in to Vercel. Please run:"
    echo "vercel login"
    exit 1
fi

echo "✅ Vercel CLI is ready"
echo ""

# Function to safely add environment variable
add_env_var() {
    local name=$1
    local description=$2
    local is_secret=${3:-false}
    local current_value=""
    
    echo "Setting up: $name"
    echo "Description: $description"
    
    if [ "$is_secret" = true ]; then
        echo "⚠️  This is a secret value. It will not be displayed."
        read -s -p "Enter value for $name: " current_value
        echo ""
    else
        read -p "Enter value for $name: " current_value
    fi
    
    if [ -n "$current_value" ]; then
        echo "$current_value" | vercel env add "$name" production
        echo "✅ Added $name"
    else
        echo "⚠️  Skipping $name (empty value)"
    fi
    echo ""
}

echo "Setting up production environment variables..."
echo "You can skip any variable by pressing Enter with no value."
echo ""

# Public environment variables
add_env_var "NEXT_PUBLIC_APP_URL" "Your application URL (e.g., https://your-store.vercel.app)"
add_env_var "NEXT_PUBLIC_MEDUSA_BACKEND_URL" "Medusa backend URL (e.g., https://your-medusa-backend.railway.app)"
add_env_var "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "Stripe publishable key (starts with pk_)" false
add_env_var "NEXT_PUBLIC_SENTRY_DSN" "Sentry DSN for error tracking (optional)" false

# Secret environment variables
add_env_var "REVALIDATE_SECRET" "Secret for Next.js revalidation (generate a random string)" true
add_env_var "CRON_SECRET" "Secret for cron job authentication (generate a random string)" true

echo "🎉 Environment variable setup complete!"
echo ""
echo "Next steps:"
echo "1. Deploy your application: vercel --prod"
echo "2. Check deployment status: vercel ls"
echo "3. View logs: vercel logs"
echo ""
echo "Security reminders:"
echo "- Never commit secrets to git"
echo "- Rotate secrets regularly"
echo "- Use different secrets for different environments"
echo ""
echo "To generate random secrets, you can use:"
echo "openssl rand -base64 32"