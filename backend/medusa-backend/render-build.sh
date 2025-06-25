#!/bin/bash
set -e

echo "🚀 Starting Render build for Medusa backend..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci || npm install

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .medusa/server

# Build the project
echo "🔨 Building project..."
npm run build

# Verify build output
echo "📁 Verifying build output..."
if [ ! -d ".medusa/server" ]; then
  echo "❌ Build failed - no output directory"
  exit 1
fi

echo "📂 API routes:"
find .medusa/server/src/api -name "*.js" -type f || echo "No API routes found"

# Run database migrations
echo "🗄️ Running database migrations..."
npx medusa db:migrate || true

echo "✅ Build completed successfully!"