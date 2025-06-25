#!/bin/bash
# Start script for production

echo "Starting Medusa server..."
echo "Current directory: $(pwd)"
echo "Contents:"
ls -la

# Check if build exists
if [ ! -d ".medusa/server" ]; then
  echo "ERROR: Build directory not found!"
  echo "Contents of current directory:"
  find . -name "*.js" -type f | grep -E "(route|api)" | head -20
  exit 1
fi

echo "Build directory contents:"
ls -la .medusa/server/src/api/ || echo "No API directory"

# Start the server
exec medusa start