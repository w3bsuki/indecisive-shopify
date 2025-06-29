# Shopify Headless Commerce Implementation Plan

## Overview
Switching from Medusa v2 to Shopify Headless Commerce for the Indecisive Wear Store backend.

## Benefits of Shopify Headless
- **Zero backend maintenance** - Shopify handles all infrastructure
- **Instant deployment** - No Railway/Docker headaches
- **Built-in features** - Payments, inventory, shipping, taxes out of the box
- **99.99% uptime** - Enterprise-grade reliability
- **GraphQL Storefront API** - Modern, fast API for headless commerce

## Implementation Steps

### Phase 1: Shopify Store Setup (30 minutes)
1. **Create Shopify Store**
   - Sign up at partners.shopify.com for development store
   - Choose "Build a custom storefront" option
   - Set up basic store information

2. **Install Required Apps**
   - Shopify Hydrogen (optional - for SSR)
   - Custom Storefront App for API access
   - Any additional apps (reviews, wishlist, etc.)

3. **Configure Products**
   - Import product catalog
   - Set up collections
   - Configure variants and inventory

### Phase 2: API Integration (1 hour)
1. **Create Private App**
   ```
   Shopify Admin → Apps → Develop apps
   - Create app
   - Configure Storefront API scopes:
     - Read products
     - Read collections
     - Read customers
     - Manage checkouts
     - Read orders
   ```

2. **Get API Credentials**
   - Storefront Access Token
   - GraphQL Endpoint: `https://your-store.myshopify.com/api/2024-01/graphql.json`

3. **Environment Variables**
   ```env
   NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
   SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-token
   ```

### Phase 3: Frontend Integration (2 hours)

1. **Install Shopify SDK**
   ```bash
   npm install @shopify/shopify-api @shopify/storefront-api-client
   ```

2. **Create Shopify Client** (`lib/shopify.ts`)
   ```typescript
   import { createStorefrontApiClient } from '@shopify/storefront-api-client';

   export const shopifyClient = createStorefrontApiClient({
     domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!,
     publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
     apiVersion: '2024-01',
   });
   ```

3. **GraphQL Queries** (`lib/shopify/queries.ts`)
   ```typescript
   export const PRODUCTS_QUERY = `
     query Products($first: Int!) {
       products(first: $first) {
         edges {
           node {
             id
             title
             handle
             description
             priceRange {
               minVariantPrice {
                 amount
                 currencyCode
               }
             }
             images(first: 1) {
               edges {
                 node {
                   url
                   altText
                 }
               }
             }
           }
         }
       }
     }
   `;
   ```

4. **Update Components**
   - Replace Medusa API calls with Shopify GraphQL
   - Update cart functionality to use Shopify Checkout API
   - Implement customer authentication with Shopify

### Phase 4: Cart & Checkout (1 hour)

1. **Cart Management**
   ```typescript
   // Create cart
   const createCart = async () => {
     const { data } = await shopifyClient.request(CREATE_CART_MUTATION);
     return data.cartCreate.cart;
   };

   // Add to cart
   const addToCart = async (cartId: string, variantId: string) => {
     const { data } = await shopifyClient.request(ADD_TO_CART_MUTATION, {
       variables: { cartId, variantId, quantity: 1 }
     });
     return data.cartLinesAdd.cart;
   };
   ```

2. **Checkout Flow**
   - Use Shopify's hosted checkout (easiest)
   - Or build custom checkout with Checkout API

### Phase 5: Additional Features

1. **Customer Accounts**
   - Login/Register with Shopify Customer API
   - Order history
   - Address management

2. **Search & Filtering**
   - Use Shopify Search & Discovery API
   - Implement filters for collections, price, etc.

3. **Webhooks** (optional)
   - Order notifications
   - Inventory updates
   - Customer events

## Environment Setup

### Development
```env
# .env.local
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-dev-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=dev-token
SHOPIFY_WEBHOOK_SECRET=webhook-secret
```

### Production
```env
# Vercel Environment Variables
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=prod-token
SHOPIFY_WEBHOOK_SECRET=webhook-secret
```

## Key Differences from Medusa

| Feature | Medusa | Shopify |
|---------|---------|----------|
| Hosting | Self-hosted (Railway) | Shopify-hosted |
| API | REST + Custom | GraphQL Storefront API |
| Database | PostgreSQL | Managed by Shopify |
| Payments | Stripe integration | Built-in + Shopify Payments |
| Admin | Custom/Medusa Admin | Shopify Admin |
| Cost | Hosting + Maintenance | Monthly subscription |

## Quick Start Commands

```bash
# Install dependencies
npm install @shopify/shopify-api @shopify/storefront-api-client graphql-request

# Create Shopify service
mkdir lib/shopify
touch lib/shopify/client.ts
touch lib/shopify/queries.ts
touch lib/shopify/mutations.ts

# Update environment variables
echo "NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com" >> .env.local
echo "NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token" >> .env.local
```

## Resources
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Hydrogen Framework](https://hydrogen.shopify.dev/)
- [Shopify GraphQL Explorer](https://shopify.dev/docs/apps/tools/graphiql-admin-api)
- [Shopify Partner Dashboard](https://partners.shopify.com)

## Timeline
- Day 1: Shopify store setup + API integration
- Day 2: Frontend integration + Cart functionality
- Day 3: Testing + Production deployment

No more Railway deployment hell. Just clean, simple, working e-commerce.