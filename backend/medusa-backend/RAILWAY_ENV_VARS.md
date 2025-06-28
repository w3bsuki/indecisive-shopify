# Required Railway Environment Variables

Add these environment variables in your Railway project settings:

## Core Database
```
DATABASE_URL=<Railway provides this>
```

## Admin Panel CORS (CRITICAL for fixing UNAUTHORIZED)
```
ADMIN_CORS=https://medusa-starter-default-production-3201.up.railway.app
STORE_CORS=https://medusa-starter-default-production-3201.up.railway.app,https://your-frontend.vercel.app
AUTH_CORS=https://medusa-starter-default-production-3201.up.railway.app
```

## Admin Panel Configuration
```
MEDUSA_ADMIN_BACKEND_URL=https://medusa-starter-default-production-3201.up.railway.app
DISABLE_MEDUSA_ADMIN=false
```

## Security (Generate these)
```
JWT_SECRET=<generate-a-long-random-string>
COOKIE_SECRET=<generate-another-long-random-string>
```

## Admin User Credentials
```
ADMIN_EMAIL=admin@indecisive-wear.com
ADMIN_PASSWORD=<set-a-secure-password>
```

## Optional
```
REDIS_URL=<if you have Redis>
NODE_ENV=production
PORT=9000
```

## To Create Admin User

After deployment, visit:
https://medusa-starter-default-production-3201.up.railway.app/admin/create-user?secret=create-admin-now

This will create the admin user with the credentials specified in environment variables.