#!/bin/bash
set -e

echo "🚀 Starting Medusa deployment..."
echo "📝 Environment variables:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "HOST: $HOST"  
echo "DATABASE_URL: ${DATABASE_URL:0:50}..."
echo "REDIS_URL: ${REDIS_URL:0:50}..."

echo "🔄 Running database migrations..."
yarn db:migrate

echo "🏃 Starting Medusa server..."
exec yarn start