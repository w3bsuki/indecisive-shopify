# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Indecisive Wear** - E-commerce fashion store with social features and customer engagement tools. This is a hybrid architecture project combining Next.js frontend with Medusa v2 backend and Supabase for social features.

## Architecture

- **Frontend**: Next.js 15.2.4 with React 19
- **Backend**: Medusa v2 e-commerce framework
- **Database**: PostgreSQL (via Medusa) + Supabase for social features
- **Styling**: Tailwind CSS + Radix UI components (shadcn/ui)
- **Package Manager**: pnpm (frontend), yarn (backend)

## Development Commands

### Frontend (Root Directory)
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Backend (./backend/)
```bash
cd backend
yarn dev          # Start Medusa development server
yarn build        # Build Medusa application
yarn start        # Start production server
yarn seed         # Run database seeding script
```

### Testing (Backend)
```bash
cd backend
yarn test:unit                    # Run unit tests
yarn test:integration:http        # Run HTTP integration tests  
yarn test:integration:modules     # Run module integration tests
```

### Docker Development
```bash
docker-compose up    # Start full stack (Medusa + PostgreSQL + Redis)
```

## Key Directory Structure

### Frontend
- `/app/` - Next.js App Router pages
- `/components/` - Reusable React components
- `/components/ui/` - shadcn/ui components  
- `/hooks/` - Custom React hooks (cart, mobile detection)
- `/lib/` - Utility functions and services
- `/styles/` - Global CSS styles

### Backend  
- `/backend/src/api/` - API route handlers
- `/backend/src/modules/` - Custom Medusa modules
- `/backend/src/workflows/` - Business logic workflows
- `/backend/src/admin/` - Admin dashboard customizations
- `/backend/src/scripts/` - Database seeding and utility scripts

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
Frontend communicates with Medusa backend APIs and Supabase for social features. The hybrid architecture separates e-commerce (Medusa) from social/user features (Supabase).

## Important Configuration Files

- `package.json` - Frontend dependencies and scripts
- `backend/package.json` - Backend dependencies and Medusa configuration  
- `backend/medusa-config.ts` - Medusa framework configuration
- `docker-compose.yml` - Development environment setup
- `components.json` - shadcn/ui configuration

## Development Notes

- Uses Sora font family for typography
- Cart state persists across sessions
- Mobile-first design with responsive components
- Integration with Stripe for payments
- Supabase integration for file storage and social features

## Environment Variables

Backend requires:
- `DATABASE_URL` - PostgreSQL connection
- `STRIPE_API_KEY` & `STRIPE_WEBHOOK_SECRET` - Payment processing
- `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_BUCKET` - Social features

## Testing Strategy

Backend has comprehensive test setup with Jest. Run integration tests when modifying API routes or core business logic. Frontend components should be tested for accessibility and responsive behavior.

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

### Backend Development
- Follow Medusa v2 patterns and conventions
- Proper error handling and logging
- Database queries optimized with proper indexes
- API responses follow consistent structure

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
- @docs/MASTER_IMPLEMENTATION_PLAN.md - Comprehensive implementation roadmap
- @docs/NEXTJS_REACT_BEST_PRACTICES.md - Frontend architecture patterns
- @docs/SHADCN_COMPONENT_ARCHITECTURE.md - Component system guidelines
- @agents/*/CLAUDE.md - Individual agent capabilities

## Key Principles

1. **Plan Mode + Ultrathink** - Always use for complex tasks
2. **Subagent Delegation** - Parallelize research and auditing
3. **Production First** - No mocks, no demos, only real code
4. **Zero Bloat** - Every line must have purpose
5. **Clean Architecture** - Maintain separation of concerns