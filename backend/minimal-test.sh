#!/bin/bash
set -e

echo "🔍 MINIMAL TEST: Starting basic HTTP server to test Railway connectivity..."
echo "PORT: $PORT"
echo "HOST: $HOST"

# Create a minimal test server inline
cat > test-server.js << 'EOF'
const http = require('http');

const PORT = process.env.PORT || 9000;
const HOST = '0.0.0.0';

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      message: 'Minimal test server is running',
      timestamp: new Date().toISOString(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        HOST: process.env.HOST,
        DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
        REDIS_URL: process.env.REDIS_URL ? 'Set' : 'Not set',
      }
    }));
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Minimal test server - use /health endpoint');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`🚀 Test server running on ${HOST}:${PORT}`);
  console.log(`📝 NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`📝 PORT: ${process.env.PORT}`);
  console.log(`📝 HOST: ${process.env.HOST}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
EOF

# Run the test server
exec node test-server.js