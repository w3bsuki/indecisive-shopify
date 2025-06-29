const http = require('http');
const os = require('os');

// Log environment details immediately
console.log('=== RAILWAY DEBUG INFO ===');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);
console.log('Platform:', os.platform());
console.log('Architecture:', os.arch());
console.log('\n=== ENVIRONMENT VARIABLES ===');
console.log('PORT:', process.env.PORT || 'NOT SET');
console.log('HOST:', process.env.HOST || 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
console.log('RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT || 'NOT SET');
console.log('RAILWAY_PROJECT_ID:', process.env.RAILWAY_PROJECT_ID || 'NOT SET');
console.log('RAILWAY_SERVICE_ID:', process.env.RAILWAY_SERVICE_ID || 'NOT SET');
console.log('RAILWAY_PUBLIC_DOMAIN:', process.env.RAILWAY_PUBLIC_DOMAIN || 'NOT SET');

// List files in current directory
console.log('\n=== FILES IN CURRENT DIRECTORY ===');
const fs = require('fs');
try {
  const files = fs.readdirSync('.');
  files.forEach(file => {
    const stats = fs.statSync(file);
    console.log(`${file} (${stats.isDirectory() ? 'dir' : 'file'})`);
  });
} catch (e) {
  console.error('Error listing files:', e.message);
}

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

console.log(`\n=== STARTING SERVER ===`);
console.log(`Attempting to bind to ${HOST}:${PORT}`);

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} from ${req.socket.remoteAddress}`);
  
  const response = {
    status: 'ok',
    message: 'Railway debug server is running!',
    timestamp: new Date().toISOString(),
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers
    },
    env: {
      PORT: process.env.PORT,
      HOST: process.env.HOST,
      NODE_ENV: process.env.NODE_ENV,
      RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
      RAILWAY_PUBLIC_DOMAIN: process.env.RAILWAY_PUBLIC_DOMAIN,
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      node: process.version,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }
  };
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response, null, 2));
});

server.on('error', (err) => {
  console.error('SERVER ERROR:', err);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`✅ Server successfully listening on http://${HOST}:${PORT}`);
  console.log('Server is ready to accept connections');
});

// Keep the process alive
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