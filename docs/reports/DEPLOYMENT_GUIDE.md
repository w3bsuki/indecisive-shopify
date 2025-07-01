# Deployment Guide - Indecisive Wear Store

## ✅ Build Status

The production build completes successfully! All TypeScript errors have been resolved.

## 🚀 Deployment Configuration

### Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Shopify Configuration - CRITICAL: Use full domain!
NEXT_PUBLIC_SHOPIFY_DOMAIN=indecisive2x.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-10

# App URL
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

### Important Configuration Notes

1. **Domain Format**: The `NEXT_PUBLIC_SHOPIFY_DOMAIN` must include the full `.myshopify.com` suffix
   - ✅ Correct: `indecisive2x.myshopify.com`
   - ❌ Wrong: `indecisive2x`

2. **API Version**: Use a valid Shopify API version (e.g., `2024-10`, not `2025-04`)

3. **Access Token**: Get this from your Shopify Admin:
   - Go to Settings → Apps and sales channels → Develop apps
   - Create a private app or use existing one
   - Copy the Storefront API access token

## 📦 Deployment Steps

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Railway Deployment

1. Create a new project on Railway
2. Connect your GitHub repository
3. Add environment variables
4. Railway will automatically detect Next.js and deploy

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Post-Deployment Checklist

- [ ] Verify Shopify connection by checking products load
- [ ] Test cart functionality (add, remove, update)
- [ ] Check checkout redirect to Shopify
- [ ] Verify search functionality
- [ ] Test mobile responsiveness
- [ ] Monitor error logs

## 🛠️ Troubleshooting

### Products Not Loading

1. Check browser console for errors
2. Verify environment variables are set correctly
3. Ensure Storefront API token has correct permissions:
   - Read products
   - Read product listings
   - Read collections
   - Manage checkout

### Cart Not Working

1. Clear browser cookies/localStorage
2. Check that Hydrogen React providers are loading
3. Verify domain configuration matches your Shopify store

### Build Errors

The current codebase builds successfully. If you encounter errors:
1. Ensure you're using Node.js 18.x or higher
2. Delete `node_modules` and `.next` folders
3. Run `npm install` fresh
4. Try `npm run build` again

## 📊 Performance Optimization

The build output shows:
- First Load JS: ~279KB (could be optimized further)
- Middleware: 32.3KB

To improve performance:
1. Enable image optimization with Cloudflare or similar CDN
2. Implement incremental static regeneration for product pages
3. Use edge runtime for API routes where possible

## 🔐 Security

- All environment variables with `NEXT_PUBLIC_` prefix are exposed to the browser
- Never expose admin API keys
- Use Shopify's built-in security features
- Implement rate limiting on API routes (already configured in middleware)

## 📱 Features Status

### ✅ Working Features
- Product browsing
- Product detail pages with variants
- Cart management (add, remove, update)
- Quick view dialog
- Search functionality
- Checkout redirect to Shopify
- Mobile responsive design

### 🔧 Configured but Needs Implementation
- Customer authentication (passwordless flow designed)
- Order history
- Wishlist persistence
- Email newsletter signup

### 📝 Future Enhancements
- Shopify Markets for multi-currency
- Customer reviews integration
- Advanced filtering
- Personalized recommendations

## Support

If you encounter issues:
1. Check the browser console for errors
2. Review the `/final-audit.md` for known issues
3. Ensure all environment variables are correctly set
4. Verify your Shopify store settings

The application is production-ready with core e-commerce functionality fully implemented!