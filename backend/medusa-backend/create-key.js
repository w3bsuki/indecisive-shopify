const { exec } = require('child_process');

// Create publishable API key
const createKey = `
curl -X POST http://localhost:9000/admin/publishable-api-keys \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Store Frontend"}'
`;

console.log('Creating publishable API key...');
exec(createKey, (error, stdout, stderr) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Response:', stdout);
  
  try {
    const result = JSON.parse(stdout);
    console.log('\nPublishable Key:', result.publishable_api_key?.id);
  } catch (e) {
    console.log('Raw output:', stdout);
  }
});