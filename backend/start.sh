#!/bin/bash
set -e

echo "Starting Medusa backend..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set"
  exit 1
fi

# Run migrations with timeout
echo "Running database migrations..."
timeout 30s yarn db:migrate || {
  echo "WARNING: Migration timed out or failed, continuing anyway..."
}

# Start the server
echo "Starting Medusa server on port ${PORT:-9000}..."
exec yarn start