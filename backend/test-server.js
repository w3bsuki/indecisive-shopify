const http = require('http');

const PORT = process.env.PORT || 9000;
const HOST = '0.0.0.0';

console.log('=== Railway Test Server Starting ===');
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Configured PORT: ${PORT}`);
console.log(`Configured HOST: ${HOST}`);
console.log(`Process ID: ${process.pid}`);

const server = http.createServer((req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} from ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`);
  
  if (req.url === '/health') {
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'X-Powered-By': 'Railway-Test-Server'
    });
    res.end(JSON.stringify({
      status: 'healthy',
      message: 'Railway test server is operational',
      timestamp: timestamp,
      uptime: process.uptime(),
      environment: {
        NODE_ENV: process.env.NODE_ENV || 'not set',
        PORT: process.env.PORT || 'not set',
        HOST: process.env.HOST || 'not set',
        DATABASE_URL: process.env.DATABASE_URL ? 'configured' : 'not configured',
        REDIS_URL: process.env.REDIS_URL ? 'configured' : 'not configured',
        RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT || 'not set',
        RAILWAY_PROJECT_ID: process.env.RAILWAY_PROJECT_ID || 'not set',
      },
      memory: {
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + ' MB',
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      }
    }, null, 2));
  } else if (req.url === '/') {
    res.writeHead(200, { 
      'Content-Type': 'text/plain',
      'X-Powered-By': 'Railway-Test-Server'
    });
    res.end(`Railway Test Server\n\nRunning on ${HOST}:${PORT}\nCheck /health for detailed status`);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found - Use / or /health endpoints');
  }
});

// Error handling
server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
});

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`✅ Test server successfully listening on ${HOST}:${PORT}`);
  console.log(`🔍 Health check endpoint: http://${HOST}:${PORT}/health`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n${signal} received, starting graceful shutdown...`);
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Log unhandled errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});