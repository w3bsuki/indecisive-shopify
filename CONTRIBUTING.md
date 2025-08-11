# Contributing to Indecisive Wear

Thank you for your interest in contributing to Indecisive Wear! This guide will help you get started with development and ensure consistent code quality.

## Development Setup

### Prerequisites

- Node.js 18+ and pnpm
- Git
- Shopify Partner account (for API access)

### Initial Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/indecisive-wear-store.git
cd indecisive-wear-store

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Shopify credentials

# Start development server
pnpm dev
```

## Development Workflow

### 1. Branch Strategy

- `main` - Production branch (protected)
- `develop` - Development branch for features
- `feature/feature-name` - Feature branches
- `fix/bug-description` - Bug fix branches
- `hotfix/critical-fix` - Critical production fixes

### 2. Before Making Changes

```bash
# Always start from the latest main
git checkout main
git pull origin main

# Create a feature branch
git checkout -b feature/your-feature-name
```

### 3. Development Standards

#### Code Quality Checklist

- [ ] TypeScript strict mode (no `any` types)
- [ ] ESLint passes (`pnpm lint`)
- [ ] TypeScript compiles (`pnpm type-check`)
- [ ] Tests pass (`pnpm test`)
- [ ] Components are properly typed
- [ ] Server Components used by default
- [ ] Accessibility guidelines followed

#### Component Guidelines

```typescript
// ✅ Good: Server Component by default
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  
  return (
    <div>
      <ProductInfo product={product} />
      <AddToCartButton productId={product.id} />
    </div>
  );
}

// ✅ Good: Client Component for interactivity only
'use client';

interface AddToCartButtonProps {
  productId: string;
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  
  // Client-side logic here
}
```

#### Styling Guidelines

- Use Tailwind CSS classes
- Follow mobile-first approach
- Use shadcn/ui components when possible
- Maintain 44px touch targets for mobile
- Ensure proper contrast ratios (WCAG 2.1)

#### Performance Guidelines

- Server Components for data fetching
- Use Suspense boundaries for loading states
- Optimize images with next/image
- Minimize client-side JavaScript
- Use dynamic imports for heavy components

### 4. Testing Requirements

#### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test suite
pnpm test:unit
```

Test Requirements:
- All utilities must have unit tests
- Complex components should have component tests
- Critical business logic must be tested
- Aim for 80%+ test coverage

#### E2E Tests

```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui
```

E2E Test Requirements:
- Critical user journeys (product view, add to cart, checkout)
- Accessibility compliance testing
- Mobile and desktop viewport testing

### 5. Commit Standards

Use conventional commits:

```bash
# Feature
git commit -m "feat: add product filtering functionality"

# Bug fix
git commit -m "fix: resolve cart total calculation error"

# Documentation
git commit -m "docs: update API integration guide"

# Refactor
git commit -m "refactor: optimize product card component"

# Test
git commit -m "test: add unit tests for cart utilities"
```

### 6. Pull Request Process

#### Before Submitting

```bash
# Ensure code quality
pnpm lint
pnpm type-check
pnpm test
pnpm build

# Update documentation if needed
# Add tests for new functionality
```

#### PR Checklist

- [ ] Descriptive title and description
- [ ] Links to related issues
- [ ] Screenshots for UI changes
- [ ] Tests pass in CI
- [ ] No TypeScript errors
- [ ] Accessibility tested
- [ ] Mobile responsive
- [ ] Performance impact considered

#### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Screenshots
(For UI changes)

## Checklist
- [ ] Code follows project standards
- [ ] Self-review completed
- [ ] Tests pass
- [ ] Documentation updated
```

## Code Architecture

### File Organization

```
├── app/                    # Next.js App Router
│   ├── (shop)/            # Shop routes group
│   ├── account/           # Account pages
│   ├── api/               # API routes
│   └── actions/           # Server Actions
├── components/
│   ├── ui/                # Base components (shadcn/ui)
│   ├── commerce/          # E-commerce components
│   ├── layout/            # Layout components
│   └── [feature]/         # Feature-specific components
├── hooks/                 # Custom hooks
├── lib/
│   ├── shopify/           # Shopify integration
│   ├── utils/             # Utility functions
│   └── validations/       # Zod schemas
└── types/                 # TypeScript type definitions
```

### Naming Conventions

- **Components**: PascalCase (`ProductCard.tsx`)
- **Hooks**: camelCase starting with 'use' (`useCart.ts`)
- **Utils**: camelCase (`formatPrice.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **Types**: PascalCase with descriptive names (`ProductVariant`)

### Import Organization

```typescript
// 1. React imports
import { useState, useEffect } from 'react';

// 2. Next.js imports
import Image from 'next/image';
import Link from 'next/link';

// 3. Third-party imports
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

// 4. Local imports
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types/shopify';
```

## Common Patterns

### Server Actions

```typescript
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const updateProfileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function updateProfile(formData: FormData) {
  const parsed = updateProfileSchema.parse({
    name: formData.get('name'),
    email: formData.get('email'),
  });

  // Update logic here
  
  revalidatePath('/profile');
  
  return { success: true };
}
```

### Error Handling

```typescript
// pages/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Loading States

```typescript
// pages/loading.tsx
export default function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-gray-200 animate-pulse rounded" />
      ))}
    </div>
  );
}
```

## Deployment Guidelines

### Environment Variables

Never commit secrets. Use `.env.local` for development and configure production variables in your deployment platform.

### Performance Monitoring

- Monitor Core Web Vitals
- Use Lighthouse for performance audits
- Test on real devices and slow networks
- Monitor bundle size with `pnpm analyze`

### Security Checklist

- [ ] No secrets in code or commits
- [ ] Input validation with Zod
- [ ] CSRF protection for forms
- [ ] Content Security Policy configured
- [ ] HTTPS enforced

## Getting Help

- Check existing issues and discussions
- Read the documentation thoroughly
- Ask questions in discussions before creating issues
- Provide detailed reproduction steps for bugs

## Recognition

Contributors will be recognized in:
- Repository contributors list
- Release notes for significant contributions
- Project documentation

Thank you for contributing to Indecisive Wear! 🚀