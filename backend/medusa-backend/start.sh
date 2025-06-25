#!/bin/bash
# Start script for production

echo "Starting Medusa server..."

# Ensure build directory exists
if [ ! -d ".medusa/server" ]; then
  echo "Build directory not found. Running build..."
  npm run build
fi

# Start the server
exec medusa start