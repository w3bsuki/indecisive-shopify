# CLAUDE.md

## Project: Indecisive Wear
E-commerce fashion store with Shopify Storefront API + Next.js 15 + React 19

## Stack
- **Frontend**: Next.js 15.3.4, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Shopify Headless Commerce (Storefront API)
- **Package Manager**: pnpm

## Core Commands
```bash
pnpm dev         # Start dev server
pnpm build       # Build for production
pnpm lint        # Run ESLint
pnpm type-check  # TypeScript check
pnpm test        # Run tests
```

## Critical Rules
1. **SLOW DOWN** - Break complex tasks into smaller steps
2. **PLAN FIRST** - Use plan mode for multi-step tasks
3. **NO MOCKS** - Production-ready code only
4. **TYPE SAFETY** - No `any` types, strict TypeScript
5. **SERVER FIRST** - Default to Server Components

## Workflow
1. **Complex Task?** → Enter plan mode, break it down
2. **Multiple Files?** → Use todo list to track progress
3. **Before Coding** → Search/read existing patterns
4. **After Changes** → Run lint + type-check
5. **New Feature?** → Check existing components first

## Key Patterns
- Server Components by default (only use `'use client'` when needed)
- shadcn/ui components in `/components/ui/`
- Shopify integration in `/lib/shopify/`
- Cart state via React Context (`/hooks/use-cart.tsx`)
- Mobile-first design (44px touch targets)

## Environment Variables
```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
NEXT_PUBLIC_SHOPIFY_API_VERSION=2025-04
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

## Remember
- Slow is smooth, smooth is fast
- One task at a time
- Test after each change
- Production-ready always