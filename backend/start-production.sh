#!/bin/bash
set -e

echo "🚀 Starting Medusa deployment..."
echo "📝 Environment variables:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "HOST: $HOST"  
echo "DATABASE_URL: ${DATABASE_URL:0:50}..."
echo "REDIS_URL: ${REDIS_URL:0:50}..."

# Ensure PORT is set (Railway should provide this)
if [ -z "$PORT" ]; then
  echo "⚠️ PORT not set, defaulting to 9000"
  export PORT=9000
fi

# Ensure HOST is set to bind to all interfaces
export HOST="0.0.0.0"

echo "🔄 Running database migrations..."
yarn db:migrate || {
  echo "⚠️ Migration failed, but continuing..."
}

echo "🏃 Starting Medusa server on $HOST:$PORT..."
exec yarn start