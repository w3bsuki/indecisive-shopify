# Shopify Store Migration - January 2025

## New Store Configuration

The project has been migrated to a new Shopify store with the following configuration:

### Store Details
- **Store Domain**: `checkout-indecisive.myshopify.com`
- **Storefront API Access Token**: `074a323cc25b1f247a24ca454d9d1f7e`
- **API Version**: `2025-04`
- **Default Currency**: BGN (Bulgarian Lev)

### Environment Variables to Update

Update your `.env.local` file with:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=checkout-indecisive.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=074a323cc25b1f247a24ca454d9d1f7e
NEXT_PUBLIC_SHOPIFY_API_VERSION=2025-04
```

### Deployment Notes

When deploying to Vercel or other platforms, make sure to update the environment variables in the deployment settings.

### Store Setup Requirements

The new store needs to have:
1. Products added with proper variants
2. Shipping zones configured
3. Payment methods enabled
4. Markets/regions configured if using multi-market features

### Migration Date
- **Date**: January 2025
- **Reason**: Billing issues with previous store
- **Status**: ✅ Successfully connected and tested