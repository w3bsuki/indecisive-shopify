#!/bin/bash

# Railway Backend Deployment Script
# Fixes the "Could not find root directory: /backend" error

echo "🚀 Deploying Medusa Backend to Railway..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Navigate to backend directory
echo "📁 Navigating to backend directory..."
cd "$(dirname "$0")/backend" || {
    echo "❌ Error: Could not find backend directory"
    exit 1
}

# Verify we're in the right place
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are we in the backend directory?"
    exit 1
fi

if [ ! -f "railway.toml" ]; then
    echo "❌ Error: railway.toml not found. Configuration file missing."
    exit 1
fi

echo "✅ Backend directory verified"
echo "✅ Configuration files found"

# Check Railway CLI status
echo "🔍 Checking Railway CLI connection..."
railway status || {
    echo "❌ Error: Railway CLI not connected. Please run 'railway login' first."
    exit 1
}

echo "✅ Railway CLI connected"

# Deploy the backend
echo "🚀 Starting deployment..."
railway up --verbose

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deployment initiated!"
echo "📊 Monitor deployment:"
echo "   - Build logs: railway logs --build"
echo "   - Deploy logs: railway logs --deployment"
echo "   - Service status: railway status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"