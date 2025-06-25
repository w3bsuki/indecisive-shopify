#!/bin/bash
set -e

echo "🚀 Starting Render build for Medusa backend..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci || npm install

# Run database migrations
echo "🗄️ Running database migrations..."
npm run medusa db:migrate || true

# Build the project
echo "🔨 Building project..."
npm run build

echo "✅ Build completed successfully!"