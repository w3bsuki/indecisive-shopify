#!/bin/bash
set -e

echo "🚀 Starting Render build for Medusa backend..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci || npm install

# Build the project
echo "🔨 Building project..."
npm run build

# List build output
echo "📁 Build output:"
ls -la .medusa/server || true

# Run database migrations
echo "🗄️ Running database migrations..."
npx medusa db:migrate || true

echo "✅ Build completed successfully!"