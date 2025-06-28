# Vercel Production Deployment Guide

This guide provides step-by-step instructions for deploying the e-commerce frontend to Vercel with production-ready configuration.

## 📋 Prerequisites

1. **Vercel Account**: [Sign up at vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally
   ```bash
   npm i -g vercel
   ```
3. **Medusa Backend**: Running and accessible (Railway deployment)
4. **Environment Variables**: Prepared according to this guide

## 🚀 Quick Deployment

### 1. Login to Vercel
```bash
vercel login
```

### 2. Configure Environment Variables
Run the automated setup script:
```bash
./scripts/setup-vercel-env.sh
```

Or manually set variables:
```bash
# Public variables
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_MEDUSA_BACKEND_URL production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add NEXT_PUBLIC_SENTRY_DSN production

# Secret variables  
vercel env add REVALIDATE_SECRET production
vercel env add CRON_SECRET production
```

### 3. Deploy to Production
```bash
vercel --prod
```

## 🔧 Environment Variables Reference

### Required Variables

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `NEXT_PUBLIC_APP_URL` | Your application URL | `https://store.vercel.app` | Production |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | Medusa backend URL | `https://backend.railway.app` | All |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | `pk_live_...` | Production |
| `REVALIDATE_SECRET` | Next.js revalidation secret | `random-32-char-string` | All |
| `CRON_SECRET` | Cron job authentication | `random-32-char-string` | All |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SENTRY_DSN` | Error tracking | `https://...@sentry.io/...` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics | `G-XXXXXXXXXX` |

### Generating Secrets
```bash
# Generate random secrets
openssl rand -base64 32
```

## 🛡️ Security Configuration

The deployment includes enterprise-grade security headers:

### Security Headers Configured
- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `DENY`
- **X-XSS-Protection**: `1; mode=block`
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Permissions-Policy**: Restricts sensitive features

### Cache Configuration
- **Static Assets**: 1 year cache with immutable
- **API Routes**: No cache for dynamic content
- **Pages**: Next.js automatic optimization

## 📊 Monitoring & Health Checks

### Built-in Health Checks
- **Application Health**: `/api/health`
- **Automated Monitoring**: Every 5 minutes via cron
- **Backend Connectivity**: Automatic backend health verification

### Health Check Response
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "backend": {
    "status": "healthy",
    "url": "https://backend.railway.app"
  },
  "build": {
    "commit": "abc1234",
    "branch": "main"
  }
}
```

## 🔄 Deployment Workflow

### Automatic Deployments
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and feature branches
- **Type Checking**: Automatic TypeScript validation

### Manual Deployment
```bash
# Deploy specific branch
vercel --prod

# Deploy with specific build command
vercel --prod --build-env NODE_ENV=production

# Deploy and set environment variable
echo "value" | vercel env add VARIABLE_NAME production
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs
vercel logs [deployment-url]

# Local build test
npm run build
npm run type-check
```

#### 2. Environment Variable Issues
```bash
# List all environment variables
vercel env ls

# Remove incorrect variable
vercel env rm VARIABLE_NAME production

# Update variable
vercel env add VARIABLE_NAME production
```

#### 3. Backend Connection Issues
- Verify Medusa backend is running
- Check CORS configuration in Medusa
- Validate backend URL accessibility

### Performance Monitoring
```bash
# Check deployment performance
vercel logs --follow

# Analyze bundle size
npm run analyze
```

## 📈 Post-Deployment Checklist

### ✅ Verification Steps
1. **Application Loads**: Visit your deployment URL
2. **Health Check**: Visit `/api/health`
3. **Backend Connection**: Verify product data loads
4. **Error Tracking**: Check Sentry dashboard
5. **Performance**: Run Lighthouse audit

### ✅ Security Verification
```bash
# Check security headers
curl -I https://your-app.vercel.app

# Verify CSP headers
curl -H "Accept: text/html" https://your-app.vercel.app
```

### ✅ Monitoring Setup
1. **Sentry Integration**: Verify error reporting
2. **Health Monitoring**: Confirm cron jobs running
3. **Performance Alerts**: Set up Core Web Vitals monitoring

## 🔄 Maintenance

### Regular Tasks
- **Weekly**: Review deployment logs and performance
- **Monthly**: Rotate secrets and check security
- **Quarterly**: Update dependencies and run security audit

### Scaling Considerations
- **Function Duration**: Monitor API response times
- **Bandwidth**: Track static asset delivery
- **Build Performance**: Optimize build times

## 🆘 Emergency Procedures

### Rollback Deployment
```bash
# List recent deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Quick Debug
```bash
# Real-time logs
vercel logs --follow

# Function logs
vercel logs [deployment-url] --limit=100
```

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel Security Headers](https://vercel.com/docs/edge-network/headers)

---

**Note**: This deployment configuration follows enterprise security and performance best practices. All secrets should be rotated regularly and never committed to version control.