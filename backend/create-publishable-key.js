const fetch = require('node-fetch');

async function createPublishableKey() {
  try {
    const response = await fetch('https://indecisive-wear-backend.onrender.com/admin/publishable-api-keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Store Frontend',
        revoked_at: null
      })
    });

    const data = await response.json();
    
    if (data.publishable_api_key) {
      console.log('✅ SUCCESS! Your publishable API key is:');
      console.log(data.publishable_api_key.id);
      console.log('\nAdd this to your .env:');
      console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${data.publishable_api_key.id}`);
    } else {
      console.log('Error:', data);
    }
  } catch (error) {
    console.error('Failed:', error.message);
  }
}

createPublishableKey();