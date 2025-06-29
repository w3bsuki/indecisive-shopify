const { Client } = require('pg');

async function createPublishableKey() {
  const client = new Client({
    connectionString: 'postgres://postgres.dpcaixtuyrcjdbcclhwc:941015tyJa7!@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'
  });

  try {
    await client.connect();
    
    const keyId = 'pk_' + Math.random().toString(36).substr(2, 25);
    
    const query = `
      INSERT INTO publishable_api_key (id, title, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING id;
    `;
    
    const result = await client.query(query, [keyId, 'Store Frontend']);
    
    console.log('✅ Created publishable API key:', result.rows[0].id);
    console.log('Add this to your .env and Render:');
    console.log(`MEDUSA_PUBLISHABLE_KEY=${result.rows[0].id}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

createPublishableKey();