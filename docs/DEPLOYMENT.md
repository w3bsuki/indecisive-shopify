# Production Deployment Guide

## Deployment Architecture

- **Frontend**: Vercel (Next.js optimization)
- **Backend**: Railway (Node.js + PostgreSQL)
- **Database**: Railway PostgreSQL
- **CDN**: Vercel Edge Network

## Frontend Deployment (Vercel)

### Automatic Deployment
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploys automatically on push to `main`

### Environment Variables
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_SENTRY_DSN=https://...
```

### Vercel Configuration
File: `vercel.json`
- Handles redirects and headers
- Optimizes static assets
- Configures security headers

## Backend Deployment (Railway)

### Setup
1. Connect GitHub repository to Railway
2. Set root directory to `backend/medusa-backend`
3. Configure environment variables
4. Auto-deploys on push to `main`

### Required Environment Variables
```bash
# Database (Railway provides automatically)
DATABASE_URL=postgres://...

# Security
JWT_SECRET=your-secret-key
COOKIE_SECRET=your-cookie-secret

# CORS
STORE_CORS=https://your-frontend.vercel.app
ADMIN_CORS=https://your-backend.railway.app
AUTH_CORS=https://your-frontend.vercel.app,https://your-backend.railway.app

# Stripe
STRIPE_API_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional
REDIS_URL=redis://... (if using Redis)
```

### Railway Configuration
File: `backend/medusa-backend/railway.json`
- Defines build and start commands
- Sets up health checks
- Configures restart policies

## Database Setup

### Migrations
```bash
# Automatic on deployment
npx medusa db:migrate
```

### Seeding (Optional)
```bash
# Run once after first deployment
npx medusa exec ./src/scripts/seed.ts
```

## Admin Panel Setup

### Create Admin User
After backend deployment, visit:
```
https://your-backend.railway.app/admin/create-user?secret=create-admin-now
```

### Access Admin Panel
```
https://your-backend.railway.app/admin
```

## SSL & Security

### Automatic SSL
- Vercel: Automatic SSL certificates
- Railway: Automatic SSL certificates

### Security Headers
Configured in `vercel.json`:
- Content Security Policy
- XSS Protection
- Frame Options

## Monitoring & Logging

### Error Tracking
- Frontend: Sentry (optional)
- Backend: Railway logs

### Performance Monitoring
- Vercel Analytics
- Railway metrics

## Custom Domain Setup

### Frontend (Vercel)
1. Add domain in Vercel dashboard
2. Configure DNS records
3. SSL automatically provisioned

### Backend (Railway)
1. Add custom domain in Railway dashboard
2. Configure CNAME record
3. Update `ADMIN_CORS` environment variable

## Troubleshooting

### Common Issues

**Build Failures**
- Check build logs in respective platforms
- Verify environment variables
- Check Node.js version compatibility

**CORS Errors**
- Verify CORS environment variables
- Check domain configurations
- Ensure HTTPS usage

**Database Connection**
- Verify `DATABASE_URL` in Railway
- Check database availability
- Run migrations if needed

**Admin Panel Access**
- Check `ADMIN_CORS` configuration
- Verify admin user creation
- Check JWT/Cookie secrets

### Health Checks

**Frontend Health**
```bash
curl https://your-frontend.vercel.app/api/health
```

**Backend Health**
```bash
curl https://your-backend.railway.app/health
```

## Scaling

### Frontend
- Vercel handles automatic scaling
- Edge functions for API routes
- CDN for static assets

### Backend
- Railway auto-scaling based on usage
- Database connection pooling
- Horizontal scaling available

## Backup & Recovery

### Database Backups
- Railway automatic daily backups
- Manual backups via Railway dashboard

### Code Backups
- GitHub repository (primary)
- Deployment rollbacks via platform dashboards

## Environment Promotion

### Development → Staging → Production
1. Deploy to staging branch first
2. Run integration tests
3. Promote to production branch
4. Monitor deployment health

## Cost Optimization

### Estimated Monthly Costs
- **Vercel**: $0-20 (Pro plan for team features)
- **Railway**: $5-20 (backend + database)
- **Total**: $5-40/month

### Cost Monitoring
- Set up billing alerts
- Monitor usage in dashboards
- Optimize resource allocation