# Railway Deployment Fix for Medusa Backend

## Issue Resolved
The Railway deployment was failing because:
1. The backend is in a subdirectory (`/backend/medusa-backend/`)
2. Nixpacks couldn't detect the project structure
3. Missing explicit configuration for the build process

## Solution Implemented

### 1. Created `railway.json` (root directory)
This file tells Railway:
- Where to find the application (`backend/medusa-backend`)
- How to build it (using yarn)
- How to start it in production
- Health check configuration

### 2. Created `nixpacks.toml` (root directory)
This file provides explicit instructions for Nixpacks:
- Use Node.js 20
- Install dependencies with yarn
- Build admin panel and backend
- Start command for production

### 3. Environment Variables Required on Railway

```bash
# Database
DATABASE_URL=your_postgres_url

# Redis (optional, will use in-memory if not provided)
REDIS_URL=redis://your-redis-url

# Admin Panel
ADMIN_BACKEND_URL=https://your-app.railway.app
DISABLE_MEDUSA_ADMIN=false

# Stripe
STRIPE_API_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Supabase (for social features)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_BUCKET=your_bucket_name

# JWT Secret
JWT_SECRET=your-secret-key

# Store Configuration
STORE_CORS=https://your-frontend-domain.com
ADMIN_CORS=https://your-app.railway.app
AUTH_CORS=https://your-frontend-domain.com

# Cookie Configuration
COOKIE_SECRET=your-cookie-secret
```

## Deployment Steps

1. **Push the configuration files**:
   ```bash
   git add railway.json nixpacks.toml
   git commit -m "fix: add Railway deployment configuration"
   git push origin main
   ```

2. **In Railway Dashboard**:
   - Go to your project settings
   - Ensure all environment variables above are set
   - The deployment should automatically trigger

3. **Verify Deployment**:
   - Check build logs for any errors
   - Once deployed, visit `https://your-app.railway.app/health`
   - Admin panel: `https://your-app.railway.app/admin`

## Admin Panel Access

The admin panel will be available at `/admin` once deployed. Make sure:
1. `DISABLE_MEDUSA_ADMIN=false` is set
2. `ADMIN_BACKEND_URL` points to your Railway app URL
3. Build completes successfully (check logs)

## Troubleshooting

If admin panel isn't accessible:
1. Check Railway logs for build errors
2. Ensure `medusa build` runs successfully
3. Verify environment variables are set correctly
4. Check that port 9000 is being used

## Additional Notes

- The `yarn build` command now builds both the backend and admin panel
- Health checks are configured to ensure the app is running
- The deployment will automatically restart on failure (up to 10 times)