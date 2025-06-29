console.log('=== RAILWAY DEBUG SERVER STARTING ===');
console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Node version:', process.version);
console.log('Process ID:', process.pid);
console.log('\n=== ENVIRONMENT VARIABLES ===');
Object.keys(process.env).sort().forEach(key => {
  if (!key.includes('SECRET') && !key.includes('KEY') && !key.includes('PASSWORD')) {
    console.log(`${key}:`, process.env[key]);
  }
});

const http = require('http');
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

console.log(`\n=== SERVER CONFIGURATION ===`);
console.log(`PORT: ${PORT} (type: ${typeof PORT})`);
console.log(`HOST: ${HOST}`);

const server = http.createServer((req, res) => {
  console.log(`\n=== REQUEST RECEIVED ===`);
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  if (req.url === '/health') {
    const response = {
      status: 'ok',
      message: 'Debug server is running!',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
        RAILWAY_PROJECT_ID: process.env.RAILWAY_PROJECT_ID,
        RAILWAY_SERVICE_ID: process.env.RAILWAY_SERVICE_ID,
        RAILWAY_REPLICA_ID: process.env.RAILWAY_REPLICA_ID,
      },
      server: {
        platform: process.platform,
        nodeVersion: process.version,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      }
    };
    
    console.log('Sending response:', JSON.stringify(response, null, 2));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response, null, 2));
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Debug server running. Use /health for details.');
  }
});

server.on('error', (err) => {
  console.error('=== SERVER ERROR ===');
  console.error(err);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`\n=== SERVER STARTED SUCCESSFULLY ===`);
  console.log(`Server listening on http://${HOST}:${PORT}`);
  console.log('Server address:', server.address());
  console.log('Ready to receive requests...\n');
});

// Keep the process alive
process.on('SIGTERM', () => {
  console.log('\n=== SIGTERM RECEIVED ===');
  server.close(() => {
    console.log('Server closed gracefully');
    process.exit(0);
  });
});

// Log every 30 seconds to show we're still alive
setInterval(() => {
  console.log(`[${new Date().toISOString()}] Server still running on port ${PORT}`);
}, 30000);