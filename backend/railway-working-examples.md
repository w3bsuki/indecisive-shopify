# Working Railway + Medusa v2 Configuration Examples

## Example 1: Single Instance Deployment

### railway.json
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "yarn install && yarn build"
  },
  "deploy": {
    "startCommand": "yarn db:migrate && yarn start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "on-failure"
  }
}
```

### Environment Variables
```env
DATABASE_URL=${{ Postgres.DATABASE_PUBLIC_URL }}
REDIS_URL=${{ Redis.REDIS_PUBLIC_URL }}?family=0
JWT_SECRET=supersecretjwttoken123456789
COOKIE_SECRET=supersecretcookietoken123456789
STORE_CORS=https://${{ RAILWAY_PUBLIC_DOMAIN }}
ADMIN_CORS=https://${{ RAILWAY_PUBLIC_DOMAIN }}
AUTH_CORS=https://${{ RAILWAY_PUBLIC_DOMAIN }}
MEDUSA_BACKEND_URL=https://${{ RAILWAY_PUBLIC_DOMAIN }}
NODE_ENV=production
```

## Example 2: Server + Worker Mode Deployment

### Server Instance (railway-server.json)
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "medusa start --mode server",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300
  }
}
```

### Worker Instance (railway-worker.json)
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "medusa start --mode worker"
  }
}
```

### Server Environment Variables
```env
DATABASE_URL=${{ Postgres.DATABASE_PUBLIC_URL }}
REDIS_URL=${{ Redis.REDIS_PUBLIC_URL }}?family=0
MEDUSA_WORKER_MODE=server
DISABLE_MEDUSA_ADMIN=false
JWT_SECRET=shared-secret-between-instances
COOKIE_SECRET=shared-secret-between-instances
STORE_CORS=https://${{ RAILWAY_PUBLIC_DOMAIN }}
ADMIN_CORS=https://${{ RAILWAY_PUBLIC_DOMAIN }}
MEDUSA_BACKEND_URL=https://${{ RAILWAY_PUBLIC_DOMAIN }}
```

### Worker Environment Variables
```env
DATABASE_URL=${{ Postgres.DATABASE_PUBLIC_URL }}
REDIS_URL=${{ Redis.REDIS_PUBLIC_URL }}?family=0
MEDUSA_WORKER_MODE=worker
DISABLE_MEDUSA_ADMIN=true
JWT_SECRET=shared-secret-between-instances
COOKIE_SECRET=shared-secret-between-instances
```

## Example 3: Production-Ready Configuration

### railway.json
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "yarn install --production=false && yarn build:all"
  },
  "deploy": {
    "startCommand": "yarn start:prod",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "on-failure",
    "restartPolicyMaxRetries": 3
  }
}
```

### package.json additions
```json
{
  "scripts": {
    "start:prod": "yarn db:migrate && NODE_ENV=production medusa start",
    "build:all": "medusa build && medusa build --admin-only"
  }
}
```

### Environment Variables
```env
# Database & Cache
DATABASE_URL=${{ Postgres.DATABASE_PUBLIC_URL }}
REDIS_URL=${{ Redis.REDIS_PUBLIC_URL }}?family=0

# Security
JWT_SECRET=your-super-secure-jwt-secret-here
COOKIE_SECRET=your-super-secure-cookie-secret-here

# CORS
STORE_CORS=https://your-frontend-domain.vercel.app,https://${{ RAILWAY_PUBLIC_DOMAIN }}
ADMIN_CORS=https://${{ RAILWAY_PUBLIC_DOMAIN }}
AUTH_CORS=https://${{ RAILWAY_PUBLIC_DOMAIN }}

# Admin
MEDUSA_BACKEND_URL=https://${{ RAILWAY_PUBLIC_DOMAIN }}
MEDUSA_ADMIN_BACKEND_URL=https://${{ RAILWAY_PUBLIC_DOMAIN }}
DISABLE_MEDUSA_ADMIN=false

# Payment (Stripe)
STRIPE_API_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Storage (Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_BUCKET=your-bucket-name

# Environment
NODE_ENV=production
PORT=${{ PORT }}
```

## Example 4: Minimal Configuration

### railway.json
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "startCommand": "medusa start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300
  }
}
```

### Minimal Environment Variables
```env
DATABASE_URL=${{ Postgres.DATABASE_PUBLIC_URL }}
JWT_SECRET=minimum-32-character-secret-here
COOKIE_SECRET=minimum-32-character-secret-here
ADMIN_CORS=*
STORE_CORS=*
```

## Common Issues & Solutions

### Issue: Redis Connection Fails
**Solution**: Add `?family=0` to REDIS_URL
```env
REDIS_URL=${{ Redis.REDIS_PUBLIC_URL }}?family=0
```

### Issue: Health Check Timeout
**Solution**: Increase timeout for migrations
```json
{
  "deploy": {
    "healthcheckTimeout": 600
  }
}
```

### Issue: Build Fails with Memory Error
**Solution**: Use production dependencies only
```json
{
  "build": {
    "buildCommand": "yarn install --production=false && yarn build && yarn install --production=true"
  }
}
```

### Issue: Admin Panel CORS Error
**Solution**: Set proper CORS domains
```env
ADMIN_CORS=https://${{ RAILWAY_PUBLIC_DOMAIN }}
MEDUSA_ADMIN_BACKEND_URL=https://${{ RAILWAY_PUBLIC_DOMAIN }}
```

## Testing Your Configuration

1. **Local Test**: `yarn build && yarn start`
2. **Health Check**: `curl http://localhost:9000/health`
3. **Admin Access**: Navigate to `http://localhost:9000/app`
4. **API Test**: `curl http://localhost:9000/store/products`

## Deployment Verification

After deployment, verify these endpoints:
- `https://your-app.railway.app/health` - Should return 200 OK
- `https://your-app.railway.app/app` - Admin panel access
- `https://your-app.railway.app/store/products` - API functionality

## Performance Recommendations

1. Use Redis for caching and session storage
2. Enable connection pooling for PostgreSQL
3. Set appropriate restart policies
4. Monitor memory usage during builds
5. Use yarn for faster dependency installation