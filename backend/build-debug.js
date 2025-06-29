const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Debug Build Script ===');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);

try {
  console.log('\n=== Running medusa build ===');
  execSync('npx medusa build', { stdio: 'inherit' });
  
  console.log('\n=== Checking build outputs ===');
  const adminDir = path.join(process.cwd(), '.medusa', 'admin');
  
  if (fs.existsSync(adminDir)) {
    console.log('✓ Admin directory exists at:', adminDir);
    const indexPath = path.join(adminDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('✓ index.html found');
    } else {
      console.log('✗ index.html NOT found');
    }
  } else {
    console.log('✗ Admin directory NOT found at:', adminDir);
  }
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}