// First create an admin user, then create publishable key

async function createAdminAndKey() {
  const BACKEND_URL = 'https://indecisive-wear-backend.onrender.com';
  
  // Step 1: Create admin user
  console.log('Creating admin user...');
  try {
    const signupRes = await fetch(`${BACKEND_URL}/auth/admin/emailpass/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@indecisivewear.com',
        password: 'admin123!'
      })
    });
    
    const signupData = await signupRes.json();
    console.log('Admin creation response:', signupData);
    
    // Step 2: Login to get token
    console.log('\nLogging in...');
    const loginRes = await fetch(`${BACKEND_URL}/auth/admin/emailpass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@indecisivewear.com',
        password: 'admin123!'
      })
    });
    
    const loginData = await loginRes.json();
    const token = loginData.token;
    
    if (!token) {
      console.log('Login response:', loginData);
      return;
    }
    
    console.log('✅ Logged in successfully!');
    
    // Step 3: Create publishable key
    console.log('\nCreating publishable key...');
    const keyRes = await fetch(`${BACKEND_URL}/admin/publishable-api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
      console.log('\nAdd this to your frontend .env:');
      console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${keyData.publishable_api_key.id}`);
      console.log(`NEXT_PUBLIC_MEDUSA_BACKEND_URL=${BACKEND_URL}`);
    } else {
      console.log('Key creation response:', keyData);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createAdminAndKey();