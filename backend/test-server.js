const http = require('http');

const PORT = process.env.PORT || 9000;
const HOST = '0.0.0.0';

console.log('🚀 Starting test server...');
console.log(`Environment: NODE_ENV=${process.env.NODE_ENV}`);
console.log(`Port configuration: PORT=${PORT}`);
console.log(`Host configuration: HOST=${HOST}`);

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      message: 'Test server is running successfully!',
      timestamp: new Date().toISOString(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        HOST: process.env.HOST,
        DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
        REDIS_URL: process.env.REDIS_URL ? 'Set' : 'Not set',
        RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
        RAILWAY_PROJECT_ID: process.env.RAILWAY_PROJECT_ID,
        RAILWAY_SERVICE_ID: process.env.RAILWAY_SERVICE_ID,
      },
      memory: process.memoryUsage(),
    }));
  } else if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Test server is running! Use /health endpoint for detailed info.');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`✅ Test server listening on http://${HOST}:${PORT}`);
  console.log('📝 Available endpoints:');
  console.log('   - / (root)');
  console.log('   - /health (health check)');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});