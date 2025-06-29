// Create admin user locally
const { execSync } = require('child_process');

console.log('Creating admin user...');
console.log('This will create an admin user with:');
console.log('Email: admin@medusa-test.com');
console.log('Password: supersecret');

try {
  // Run medusa user command
  execSync('npx medusa user -e admin@medusa-test.com -p supersecret', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('\n✅ Admin user created successfully!');
  console.log('You can now login at: https://indecisive-wear-backend.onrender.com/app');
} catch (error) {
  console.error('Failed to create admin user:', error.message);
  console.log('\nAlternatively, you can:');
  console.log('1. SSH into your Render service');
  console.log('2. Run: npx medusa user -e admin@medusa-test.com -p supersecret');
}