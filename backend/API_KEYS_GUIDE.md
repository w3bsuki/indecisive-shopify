# 🔑 API Keys Setup Guide

This guide shows you exactly where to get each API key for your backend.

## Required Keys

### 1. **PostgreSQL Database** 
You have 3 options:

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL locally
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medusa-v2
```

**Option B: Supabase Database** (Recommended - Free tier)
- Your Supabase project already includes PostgreSQL!
- Go to Settings → Database
- Copy the connection string (use the "Transaction" mode URL)

**Option C: Render Database**
- Create a PostgreSQL database on Render
- Copy the external connection string

### 2. **Redis** (For caching)
**Option A: Local Redis**
```bash
# Install Redis locally
REDIS_URL=redis://localhost:6379
```

**Option B: Upstash Redis** (Recommended - Free tier)
- Sign up at [upstash.com](https://upstash.com)
- Create a Redis database
- Copy the Redis URL

### 3. **Stripe** (Payment Processing)
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Sign in or create account
3. Click "Developers" → "API keys"
4. Get your keys:
   ```
   STRIPE_API_KEY=sk_test_... (Secret key)
   ```
5. For webhook secret (we'll set this up later):
   - Go to "Webhooks" → "Add endpoint"
   - URL: `https://your-backend.onrender.com/webhooks/stripe`
   - Select events: All payment events
   - Copy the signing secret

### 4. **Supabase** (Auth + Storage + Custom Features)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to "Settings" → "API"
4. Get these keys:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJ... (public anon key)
   SUPABASE_SERVICE_KEY=eyJ... (service role key - keep secret!)
   ```
5. For JWT Secret:
   - Still in Settings → API
   - Scroll to "JWT Settings"
   - Copy the JWT secret

### 5. **Security Keys**
Generate secure random strings:
```bash
# Generate JWT secret
openssl rand -hex 32

# Generate cookie secret  
openssl rand -hex 32
```

Or use an online generator: [randomkeygen.com](https://randomkeygen.com)

## Minimal .env Setup

Here's the minimal setup to get started:

```env
# Database (use Supabase's PostgreSQL)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres

# Redis (use Upstash free tier)
REDIS_URL=redis://default:[YOUR-PASSWORD]@[YOUR-ENDPOINT].upstash.io:6379

# Security
JWT_SECRET=your-generated-jwt-secret
COOKIE_SECRET=your-generated-cookie-secret

# Stripe
STRIPE_API_KEY=sk_test_your-stripe-secret-key

# Supabase
SUPABASE_URL=https://[YOUR-PROJECT].supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Frontend URL
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:3000
```

## Optional Services

### SendGrid (Email) - Skip for now
- Only needed if you want order confirmation emails
- Can use Supabase email triggers instead

### AWS S3 - Not needed!
- We're using Supabase Storage instead
- No additional keys required

## Quick Start Steps

1. **Copy the template**:
   ```bash
   cd backend/medusa-backend
   cp .env.template .env
   ```

2. **Add your keys** to `.env`

3. **Test the connection**:
   ```bash
   yarn dev
   ```

## Free Tier Services Summary

- **Supabase**: Free tier includes auth, database, storage
- **Upstash Redis**: 10,000 commands/day free
- **Stripe**: No fees until you process real payments
- **Render**: Free PostgreSQL database (if not using Supabase's)

That's it! No AWS needed - we're using Supabase for everything! 🚀