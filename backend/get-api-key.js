// Login with existing admin and create publishable key

async function getApiKey() {
  const BACKEND_URL = 'https://indecisive-wear-backend.onrender.com';
  
  console.log('Enter your admin credentials:');
  console.log('(If you don\'t have credentials, you need to create them via database or seed script)');
  console.log('\nTrying default credentials...');
  
  // Try common default credentials
  const credentials = [
    { email: 'admin@medusa-test.com', password: 'supersecret' },
    { email: 'admin@example.com', password: 'supersecret' },
    { email: 'admin@indecisivewear.com', password: 'supersecret' },
    { email: 'admin@admin.com', password: 'admin' }
  ];
  
  for (const cred of credentials) {
    console.log(`\nTrying ${cred.email}...`);
    
    try {
      const loginRes = await fetch(`${BACKEND_URL}/auth/admin/emailpass`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cred)
      });
      
      const loginData = await loginRes.json();
      
      if (loginData.token) {
        console.log('✅ Login successful!');
        
        // Create publishable key
        const keyRes = await fetch(`${BACKEND_URL}/admin/publishable-api-keys`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.token}`
          },
          body: JSON.stringify({
            title: 'Store Frontend',
            revoked_at: null
          })
        });
        
        const keyData = await keyRes.json();
        
        if (keyData.publishable_api_key) {
          console.log('\n✅ SUCCESS! Your publishable API key is:');
          console.log(keyData.publishable_api_key.id);
          console.log('\nAdd this to your frontend .env.local:');
          console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${keyData.publishable_api_key.id}`);
          console.log(`NEXT_PUBLIC_MEDUSA_BACKEND_URL=${BACKEND_URL}`);
          return;
        } else {
          console.log('Key creation failed:', keyData);
        }
      }
    } catch (error) {
      // Try next credential
    }
  }
  
  console.log('\n❌ Could not login with any default credentials.');
  console.log('You need to:');
  console.log('1. Check your database for existing admin users');
  console.log('2. Or run a seed script to create an admin user');
  console.log('3. Or manually create one in the database');
}

getApiKey();