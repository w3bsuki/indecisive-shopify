# Custom Products Setup Guide

## Shopify Admin Setup

### Option 1: Using Base Products with Variants (Recommended)

1. **Create Base Products in Shopify Admin**:
   - Create a product called "Custom T-Shirt"
   - Add variants for each color: Black, White, Gray, Navy, Red
   - Set base price (35 лв)
   
   - Create a product called "Custom Hat"
   - Add variants for each color: Black, White, Beige, Navy, Green
   - Set base price (30 лв)
   
   - Create a product called "Custom Bag"
   - Add variants for each color: Natural, Black, Navy, Olive
   - Set base price (25 лв)

2. **Add Custom Line Item Properties**:
   - Shopify supports custom line item properties automatically
   - The properties we send (Custom Text, Text Color, Position, etc.) will appear in the order

3. **Get Variant IDs**:
   - Go to each product in Shopify Admin
   - Click on each variant
   - Copy the variant ID from the URL or use GraphQL to query them
   
4. **Update the Code**:
   Replace the placeholder variant IDs in `/components/custom/custom-product-configurator.tsx`:
   ```typescript
   const variantMap: Record<string, string> = {
     'tshirt-black': 'gid://shopify/ProductVariant/YOUR_ACTUAL_ID',
     'tshirt-white': 'gid://shopify/ProductVariant/YOUR_ACTUAL_ID',
     // ... etc
   }
   ```

### Option 2: Using Draft Orders API (Advanced)

1. **Create an API Route**:
   - Set up a backend endpoint that creates draft orders
   - Use Shopify Admin API (not Storefront API)
   - Requires private app credentials

2. **Draft Order Flow**:
   - Customer submits custom product request
   - Your backend creates a draft order with custom line items
   - Send invoice to customer or convert to regular order

### Option 3: Using Third-Party Apps

Consider Shopify apps like:
- **Product Customizer** by Zepto
- **Infinite Options** by ShopPad
- **Product Personalizer** by Qstomizer

These apps handle the entire customization flow and integrate directly with Shopify.

## Current Implementation

The current implementation:
1. Stores custom product requests in localStorage
2. Shows a success message that the team will contact them
3. Supports adding to cart if variant IDs are configured

## Next Steps

1. **Quick Start** (No Shopify changes):
   - Current implementation works as-is
   - Custom requests are saved locally
   - Team contacts customers manually

2. **Full Integration**:
   - Create the base products in Shopify
   - Get the variant IDs
   - Update the variantMap in the code
   - Custom attributes will appear in orders automatically

## Testing

1. Test with real variant IDs:
   ```typescript
   // Example with real IDs
   const variantMap: Record<string, string> = {
     'tshirt-black': 'gid://shopify/ProductVariant/12345678901234',
     'tshirt-white': 'gid://shopify/ProductVariant/12345678901235',
   }
   ```

2. The custom attributes will appear in:
   - Cart page
   - Checkout
   - Order confirmation
   - Shopify Admin order details