# 🚀 Backend Setup Instructions

## ✅ What's Already Done

1. **API Keys Added**:
   - ✅ Stripe API key
   - ✅ Supabase URL and keys
   - ✅ Upstash Redis URL
   - ✅ Security keys (JWT & Cookie)

## 🔴 What You Need to Do

### 1. Get Supabase Database Password
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/dpcaixtuyrcjdbcclhwc/settings/database)
2. Find "Connection string" section
3. Copy your database password
4. Replace `[YOUR-SUPABASE-DB-PASSWORD]` in `.env` file (lines 7-8)

### 2. Get Supabase JWT Secret
1. Go to [Supabase API Settings](https://supabase.com/dashboard/project/dpcaixtuyrcjdbcclhwc/settings/api)
2. Scroll down to "JWT Settings"
3. Copy the JWT secret
4. Replace `your-supabase-jwt-secret-from-settings` in `.env` file (line 26)

### 3. Run Supabase Migration
1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/dpcaixtuyrcjdbcclhwc/sql/new)
2. Copy and paste the contents of:
   ```
   src/migrations/supabase/001_create_reviews_schema.sql
   ```
3. Click "Run" to create the tables

### 4. Start the Backend
```bash
cd backend/medusa-backend

# Install dependencies (if not done already)
yarn install

# Run database migrations
yarn medusa migrations run

# Start development server
yarn dev
```

### 5. Test the Backend
Open another terminal:
```bash
# Health check
curl http://localhost:9000/health

# List products (should return empty array)
curl http://localhost:9000/store/products
```

## 🎯 Next Steps

Once the backend is running:

1. **Create Stripe Webhook** (for production):
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-backend-url.onrender.com/webhooks/stripe`
   - Select all payment events
   - Add the webhook secret to `.env`

2. **Connect Frontend**:
   - Update your frontend to use `http://localhost:9000` as the backend URL
   - The CORS is already configured for `localhost:3000`

3. **Add Sample Data**:
   - Use Medusa Admin at `http://localhost:9000/admin`
   - Create products, categories, etc.

## 📝 Quick Reference

- **Backend URL**: http://localhost:9000
- **Admin Panel**: http://localhost:9000/admin
- **API Docs**: http://localhost:9000/docs

## 🆘 Troubleshooting

**Database connection error?**
- Make sure you added the Supabase database password
- Check if the connection string is correct

**Redis connection error?**
- The Upstash URL should work immediately
- Make sure there are no extra spaces

**Port already in use?**
```bash
# Kill process on port 9000
lsof -ti:9000 | xargs kill -9
```

Ready to go! Just add those 2 missing values and you're all set! 🚀