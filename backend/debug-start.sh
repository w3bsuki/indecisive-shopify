#!/bin/bash
set -e

echo "🔍 DEBUG: Starting Medusa deployment debug..."
echo "📝 Full environment check:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "HOST: $HOST"
echo "DATABASE_URL exists: $([ -n "$DATABASE_URL" ] && echo "YES" || echo "NO")"
echo "REDIS_URL exists: $([ -n "$REDIS_URL" ] && echo "YES" || echo "NO")"
echo "JWT_SECRET exists: $([ -n "$JWT_SECRET" ] && echo "YES" || echo "NO")"
echo "COOKIE_SECRET exists: $([ -n "$COOKIE_SECRET" ] && echo "YES" || echo "NO")"
echo "MEDUSA_BACKEND_URL: $MEDUSA_BACKEND_URL"
echo "MEDUSA_WORKER_MODE: $MEDUSA_WORKER_MODE"

# Ensure PORT is set
if [ -z "$PORT" ]; then
  echo "⚠️ PORT not set, defaulting to 9000"
  export PORT=9000
fi

# Ensure HOST is set
export HOST="0.0.0.0"

echo ""
echo "🔄 Testing database connection..."
yarn medusa db:execute "SELECT 1" || {
  echo "❌ Database connection failed!"
  exit 1
}

echo ""
echo "✅ Database connection successful"

echo ""
echo "🔄 Running migrations..."
yarn db:migrate || {
  echo "⚠️ Migration failed, but continuing..."
}

echo ""
echo "🚀 Starting Medusa server on $HOST:$PORT..."
echo "Command: medusa start --host $HOST --port $PORT"

# Start with explicit host and port
exec medusa start --host $HOST --port $PORT