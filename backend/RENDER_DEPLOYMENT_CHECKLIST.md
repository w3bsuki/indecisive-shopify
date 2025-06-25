# 🚀 Render Deployment Checklist

## ✅ Fixed Issues

1. **medusa-config not found** - Created `medusa-config.js` (CommonJS version)
2. **TypeScript import error** - Fixed ES module syntax in `medusa-config.ts`
3. **Build process** - Created custom `render-build.sh` script
4. **Health check** - Added `/health` endpoint for monitoring

## 📋 Render Settings

Ensure these are set in your Render dashboard:

### Build & Deploy
- **Root Directory**: `backend/medusa-backend`
- **Build Command**: `./render-build.sh`
- **Start Command**: `npm run start`

### Environment Variables
All 17 variables should be set:
1. ✅ DATABASE_URL
2. ✅ REDIS_URL
3. ✅ JWT_SECRET
4. ✅ COOKIE_SECRET
5. ✅ STRIPE_API_KEY
6. ✅ STRIPE_WEBHOOK_SECRET
7. ✅ SUPABASE_URL
8. ✅ SUPABASE_ANON_KEY
9. ✅ SUPABASE_SERVICE_KEY
10. ✅ SUPABASE_JWT_SECRET
11. ✅ NODE_ENV (production)
12. ✅ PORT (9000)
13. ✅ STORE_CORS (http://localhost:3000)
14. ✅ ADMIN_CORS (https://indecisive-wear-backend.onrender.com)
15. ✅ AUTH_CORS (http://localhost:3000,https://indecisive-wear-backend.onrender.com)
16. ✅ MEDUSA_PUBLISHABLE_KEY (pk_test_fake_publishable_key_123456789)
17. ✅ STORE_URL (http://localhost:3000)

## 🧪 Test Endpoints

Once deployed, test these:
- `https://indecisive-wear-backend.onrender.com/health`
- `https://indecisive-wear-backend.onrender.com/store/products`

## 🔄 Next Steps

1. Monitor deployment logs in Render dashboard
2. Once deployed, create real publishable API key
3. Update frontend to use deployed backend URL