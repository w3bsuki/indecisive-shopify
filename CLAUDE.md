# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Indecisive Wear** - E-commerce fashion store with social features and customer engagement tools. This is a headless commerce project using Shopify's Storefront API with Next.js frontend and Supabase for social features.

## Architecture

- **Frontend**: Next.js 15.3.4 with React 19
- **Backend**: Shopify Headless Commerce (Storefront API)
- **Database**: Shopify (products/orders) + Supabase (social features)
- **Styling**: Tailwind CSS + Radix UI components (shadcn/ui)
- **Package Manager**: pnpm

## Development Commands

### Development
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript type checking
```

### Testing
```bash
pnpm test              # Run unit tests
pnpm test:coverage     # Run tests with coverage
pnpm test:e2e          # Run Playwright E2E tests
pnpm test:e2e:ui       # Run E2E tests with UI
```

## Key Directory Structure

### Frontend
- `/app/` - Next.js App Router pages
- `/components/` - Reusable React components
- `/components/ui/` - shadcn/ui components  
- `/hooks/` - Custom React hooks (cart, mobile detection)
- `/lib/` - Utility functions and services
- `/styles/` - Global CSS styles

### API & Services
- `/lib/shopify/` - Shopify Storefront API integration
- `/app/api/` - Next.js API routes
- `/lib/` - Utility functions and services

## Code Patterns

### Component Structure
Components follow shadcn/ui patterns with Radix UI primitives. Always use existing UI components from `/components/ui/` before creating new ones.

### State Management
- Global cart state via React Context (`/hooks/use-cart.tsx`)
- Component state with React hooks
- Forms use React Hook Form + Zod validation

### Styling Guidelines
- Use Tailwind utility classes exclusively
- Follow mobile-first responsive design
- Utilize shadcn/ui design tokens for consistency

### API Integration
Frontend communicates with Shopify Storefront API for commerce operations and Supabase for social features. The headless architecture leverages Shopify's infrastructure while maintaining flexibility for custom features.

## Important Configuration Files

- `package.json` - Frontend dependencies and scripts
- `components.json` - shadcn/ui configuration
- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `eslint.config.js` - ESLint 9 flat config

## Development Notes

- Uses Sora font family for typography
- Cart state persists across sessions
- Mobile-first design with responsive components
- Integration with Stripe for payments
- Supabase integration for file storage and social features

## Environment Variables

Required:
- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` - Shopify store domain
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` - Storefront API token
- `NEXT_PUBLIC_SHOPIFY_API_VERSION` - API version (2025-04)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key

Optional:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Social features
- `REVALIDATE_SECRET` - For on-demand revalidation

## Testing Strategy

Frontend testing with Jest and Playwright:
- Unit tests for hooks and utilities
- Component tests with React Testing Library
- E2E tests for critical user flows
- Accessibility tests with jest-axe
- Performance monitoring with Lighthouse

## Critical Development Rules

### Code Quality Standards
- **NO MOCKS, NO DEMOS** - All code must be production-ready
- **Zero bloat** - Every line of code must have a purpose
- **Clean architecture** - Follow SOLID principles and separation of concerns
- **Type safety** - Full TypeScript coverage, no `any` types
- **Performance first** - Default to Server Components, optimize bundle size

### App Router Best Practices
- Server Components by default, Client Components only when necessary
- Proper data fetching with parallel loading and streaming
- Error boundaries and loading states for all routes
- Server Actions for forms and mutations

### Component Development
- Use existing shadcn/ui components before creating new ones
- Follow compound component patterns for flexibility
- Accessibility-first approach with proper ARIA labels
- Mobile-first responsive design with touch-optimized interactions

### Shopify Integration
- Use Hydrogen React components where applicable
- Cache Shopify API responses appropriately
- Handle rate limiting gracefully
- Optimize GraphQL queries for performance

### DevOps & Deployment
- Environment variables properly configured
- Health checks and monitoring endpoints
- Graceful shutdown handling
- Zero-downtime deployments

## Subagent Architecture

This project uses an orchestrator-worker pattern with specialized subagents:

### Available Subagents
1. **Research Agent** (@agents/research) - Monitors best practices and new patterns
2. **Code Auditor** (@agents/auditor) - Reviews code quality and performance
3. **Testing Agent** (@agents/testing) - Ensures comprehensive test coverage
4. **DevOps Agent** (@agents/devops) - Handles deployment and infrastructure

### Orchestration Rules
- Use subagents for parallel tasks to preserve context
- Research Agent should run before implementing new features
- Code Auditor reviews all changes before deployment
- Testing Agent validates both unit and integration tests

### Invoking Subagents
When facing complex tasks, delegate to appropriate subagents:
- "Research the best way to implement X" → Research Agent
- "Review this code for issues" → Code Auditor
- "Ensure this is properly tested" → Testing Agent
- "Deploy this to production" → DevOps Agent

## Important Documentation

Refer to these documents for detailed guidance:
- @docs/plans/PROJECT_FINALIZATION_PLAN.md - Production deployment roadmap
- @docs/NEXTJS_REACT_BEST_PRACTICES.md - Frontend architecture patterns
- @docs/SHADCN_COMPONENT_ARCHITECTURE.md - Component system guidelines
- @agents/*/CLAUDE.md - Individual agent capabilities

## Key Principles

1. **Plan Mode + Ultrathink** - Always use for complex tasks
2. **Subagent Delegation** - Parallelize research and auditing
3. **Production First** - No mocks, no demos, only real code
4. **Zero Bloat** - Every line must have purpose
5. **Clean Architecture** - Maintain separation of concerns