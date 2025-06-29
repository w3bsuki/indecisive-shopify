#!/bin/sh
# Start script for Railway deployment
# Railway provides PORT env var

echo "Starting Medusa on port ${PORT:-9000}"

# Export PORT for Medusa to use
export MEDUSA_PORT=${PORT:-9000}

# Run migrations and start
exec yarn start