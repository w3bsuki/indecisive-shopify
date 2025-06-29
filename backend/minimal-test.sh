#!/bin/bash
set -e

echo "🔍 MINIMAL TEST: Starting basic HTTP server to test Railway connectivity..."
echo "PORT: $PORT"
echo "HOST: $HOST"

# Run the test server
exec node test-server.js