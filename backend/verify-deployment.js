#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Run this to verify Railway deployment is using the correct code
 */

const https = require('https');

const DEPLOYMENT_URL = process.env.DEPLOYMENT_URL || process.argv[2];

if (!DEPLOYMENT_URL) {
  console.error('Please provide the deployment URL as an argument or DEPLOYMENT_URL env var');
  console.error('Usage: node verify-deployment.js https://your-app.railway.app');
  process.exit(1);
}

console.log(`\nVerifying deployment at: ${DEPLOYMENT_URL}\n`);

// Test health endpoint
const healthUrl = new URL('/health', DEPLOYMENT_URL);

https.get(healthUrl.toString(), (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      console.log('Health Check Response:');
      console.log('===================');
      console.log(JSON.stringify(response, null, 2));
      console.log('\n');
      
      // Verify it's the Medusa backend
      if (response.message && response.message.includes('Medusa')) {
        console.log('✅ Medusa backend detected');
      } else if (response.message && response.message.includes('Test server')) {
        console.log('❌ Test server detected - deployment is using old code!');
        console.log('   Railway may be caching an old build.');
        console.log('\nTo fix:');
        console.log('1. Go to Railway dashboard');
        console.log('2. Trigger a new deployment with "Clear build cache" option');
        console.log('3. Or redeploy from the latest commit');
      } else {
        console.log('⚠️  Unknown server type');
      }
      
      if (response.version) {
        console.log(`✅ Version: ${response.version}`);
      }
      
      if (response.deployment) {
        console.log(`✅ Deployment type: ${response.deployment}`);
      }
      
    } catch (error) {
      console.error('Failed to parse response:', error);
      console.log('Raw response:', data);
    }
  });
}).on('error', (err) => {
  console.error('Failed to connect:', err.message);
});