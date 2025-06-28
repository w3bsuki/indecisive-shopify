# Production Test Plan - Indecisive Wear

## Overview
This comprehensive testing strategy ensures Indecisive Wear meets production quality standards with 80% test coverage, zero regressions, and robust error handling.

## Test Architecture

### Testing Stack
- **Unit/Component Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **Accessibility**: axe-core + jest-axe
- **Performance**: Lighthouse CI
- **Visual Regression**: Percy (optional)

### Test Categories
1. **Unit Tests**: Pure functions, utilities, hooks
2. **Component Tests**: UI components in isolation
3. **Integration Tests**: API routes, data flows
4. **E2E Tests**: Critical user journeys
5. **Performance Tests**: Load times, bundle sizes
6. **Accessibility Tests**: WCAG 2.1 AA compliance

## Critical Test Coverage Areas

### 1. Cart Management (Priority: CRITICAL)
```typescript
// Test scenarios for cart operations
- Add single item to cart
- Add multiple quantities
- Update item quantity
- Remove item from cart
- Clear entire cart
- Cart persistence across sessions
- Optimistic updates
- Error recovery
- Stock validation
- Price calculations
```

### 2. Product Pages (Priority: HIGH)
```typescript
// Server Component testing
- Product data fetching
- Image loading and optimization
- Variant selection
- Size/color options
- Add to cart functionality
- Social sharing
- Review display
- Related products
```

### 3. Checkout Flow (Priority: CRITICAL)
```typescript
// Complete purchase journey
- Guest checkout
- Registered user checkout
- Address validation
- Shipping calculation
- Payment processing (Stripe)
- Order confirmation
- Email notifications
- Error handling
```

### 4. User Authentication (Priority: HIGH)
```typescript
// Auth flows
- Registration
- Login/logout
- Password reset
- Session management
- Protected routes
- Admin access
```

### 5. Admin Operations (Priority: MEDIUM)
```typescript
// Admin panel functionality
- Product management
- Order management
- Customer management
- Analytics dashboard
- Social automation
```

## Testing Infrastructure Setup

### 1. Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
      },
    }],
  },
};
```

### 2. Testing Library Setup
```typescript
// tests/setup.ts
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/test',
}))
```

### 3. Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
})
```

## Component Test Templates

### 1. Server Component Test Template
```typescript
// tests/components/product-card.test.tsx
import { render } from '@testing-library/react'
import { ProductCard } from '@/components/product-card'

// Mock the async data fetching
jest.mock('@/lib/medusa', () => ({
  getProduct: jest.fn().mockResolvedValue({
    id: '1',
    title: 'Test Product',
    price: { amount: 9999, currency_code: 'USD' },
    thumbnail: '/test.jpg',
  }),
}))

describe('ProductCard', () => {
  it('renders product information correctly', async () => {
    const { container } = render(
      await ProductCard({ productId: '1' })
    )
    
    expect(container).toHaveTextContent('Test Product')
    expect(container).toHaveTextContent('$99.99')
  })
  
  it('handles loading state', () => {
    const { container } = render(
      <Suspense fallback={<div>Loading...</div>}>
        <ProductCard productId="1" />
      </Suspense>
    )
    
    expect(container).toHaveTextContent('Loading...')
  })
})
```

### 2. Client Component Test Template
```typescript
// tests/components/add-to-cart-button.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { useCart } from '@/hooks/use-cart'

jest.mock('@/hooks/use-cart')

describe('AddToCartButton', () => {
  const mockAddItem = jest.fn()
  
  beforeEach(() => {
    (useCart as jest.Mock).mockReturnValue({
      addItem: mockAddItem,
      items: [],
    })
  })
  
  it('calls addItem when clicked', async () => {
    render(
      <AddToCartButton 
        productId="1" 
        variant={{ id: 'v1', price: 9999 }}
      />
    )
    
    const button = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(mockAddItem).toHaveBeenCalledWith({
        productId: '1',
        variantId: 'v1',
        quantity: 1,
      })
    })
  })
  
  it('shows loading state during add', async () => {
    mockAddItem.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<AddToCartButton productId="1" variant={{ id: 'v1' }} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(button).toBeDisabled()
    expect(screen.getByText(/adding/i)).toBeInTheDocument()
  })
})
```

### 3. Accessibility Test Template
```typescript
// tests/accessibility/product-page.test.tsx
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import ProductPage from '@/app/product/[id]/page'

expect.extend(toHaveNoViolations)

describe('Product Page Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      await ProductPage({ params: { id: '1' } })
    )
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
  
  it('has proper heading hierarchy', () => {
    const { container } = render(
      await ProductPage({ params: { id: '1' } })
    )
    
    const h1 = container.querySelector('h1')
    expect(h1).toBeInTheDocument()
    
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let lastLevel = 0
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName[1])
      expect(level).toBeLessThanOrEqual(lastLevel + 1)
      lastLevel = level
    })
  })
})
```

### 4. Mobile Interaction Test Template
```typescript
// tests/mobile/mobile-navigation.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MobileNavigation } from '@/components/mobile-navigation'

// Mock the mobile detection hook
jest.mock('@/hooks/use-mobile', () => ({
  useMobile: () => true,
}))

describe('Mobile Navigation', () => {
  it('opens menu on hamburger click', () => {
    render(<MobileNavigation />)
    
    const hamburger = screen.getByRole('button', { name: /menu/i })
    fireEvent.click(hamburger)
    
    expect(screen.getByRole('navigation')).toHaveAttribute('data-state', 'open')
  })
  
  it('has appropriate touch targets', () => {
    render(<MobileNavigation />)
    
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      const styles = window.getComputedStyle(button)
      const height = parseInt(styles.height)
      const width = parseInt(styles.width)
      
      expect(height).toBeGreaterThanOrEqual(44)
      expect(width).toBeGreaterThanOrEqual(44)
    })
  })
})
```

## E2E Test Scenarios

### 1. Complete Purchase Journey
```typescript
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test('guest checkout with credit card', async ({ page }) => {
    // Browse products
    await page.goto('/')
    await page.click('text=Shop Now')
    
    // Select product
    await page.click('[data-testid="product-card"]:first-child')
    await page.waitForLoadState('networkidle')
    
    // Add to cart
    await page.selectOption('select[name="size"]', 'M')
    await page.click('button:has-text("Add to Cart")')
    
    // Go to cart
    await page.click('[data-testid="cart-icon"]')
    await page.click('text=Checkout')
    
    // Fill shipping info
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="firstName"]', 'Test')
    await page.fill('input[name="lastName"]', 'User')
    await page.fill('input[name="address"]', '123 Test St')
    await page.fill('input[name="city"]', 'Test City')
    await page.fill('input[name="postalCode"]', '12345')
    
    // Payment
    await page.frameLocator('iframe[name="stripe"]').locator('input[name="cardnumber"]').fill('4242424242424242')
    await page.frameLocator('iframe[name="stripe"]').locator('input[name="exp-date"]').fill('12/25')
    await page.frameLocator('iframe[name="stripe"]').locator('input[name="cvc"]').fill('123')
    
    // Complete order
    await page.click('button:has-text("Place Order")')
    
    // Verify confirmation
    await expect(page.locator('h1')).toContainText('Order Confirmed')
    await expect(page.locator('[data-testid="order-number"]')).toBeVisible()
  })
})
```

### 2. Admin Panel Operations
```typescript
// e2e/admin.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/admin/login')
    await page.fill('input[name="email"]', 'admin@test.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button:has-text("Login")')
    await page.waitForURL('/admin/dashboard')
  })
  
  test('create new product', async ({ page }) => {
    await page.click('text=Products')
    await page.click('button:has-text("Add Product")')
    
    await page.fill('input[name="title"]', 'Test Product')
    await page.fill('textarea[name="description"]', 'Test description')
    await page.fill('input[name="price"]', '99.99')
    
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/product.jpg')
    
    await page.click('button:has-text("Save Product")')
    
    await expect(page.locator('.toast')).toContainText('Product created')
  })
})
```

### 3. Error Recovery
```typescript
// e2e/error-recovery.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Error Recovery', () => {
  test('handles network failure during checkout', async ({ page, context }) => {
    // Simulate network failure
    await context.route('**/api/checkout', route => route.abort())
    
    // Attempt checkout
    await page.goto('/cart')
    await page.click('button:has-text("Checkout")')
    
    // Verify error handling
    await expect(page.locator('[role="alert"]')).toContainText('Network error')
    await expect(page.locator('button:has-text("Retry")')).toBeVisible()
    
    // Restore network and retry
    await context.unroute('**/api/checkout')
    await page.click('button:has-text("Retry")')
    
    await expect(page).toHaveURL('/checkout')
  })
})
```

## Performance Testing

### 1. Lighthouse CI Configuration
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm start',
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/product/1',
        'http://localhost:3000/cart',
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.90 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
```

### 2. Load Testing Script
```javascript
// tests/load/checkout-load.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
  },
}

export default function () {
  // Browse products
  const productsRes = http.get('http://localhost:3000/api/products')
  check(productsRes, {
    'products loaded': (r) => r.status === 200,
  })
  
  sleep(1)
  
  // Add to cart
  const cartRes = http.post('http://localhost:3000/api/cart', {
    productId: '1',
    quantity: 1,
  })
  check(cartRes, {
    'added to cart': (r) => r.status === 200,
  })
  
  sleep(1)
}
```

## CI/CD Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
        
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
      
    - name: Run unit tests
      run: pnpm test:unit
      
    - name: Run component tests
      run: pnpm test:components
      
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        token: ${{ secrets.CODECOV_TOKEN }}
        
  e2e:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Install Playwright
      run: npx playwright install --with-deps
      
    - name: Run E2E tests
      run: pnpm test:e2e
      
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        
  lighthouse:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Run Lighthouse CI
      uses: treosh/lighthouse-ci-action@v9
      with:
        configPath: './lighthouserc.js'
```

## Test Execution Strategy

### Daily Testing Routine
1. **Pre-commit**: Lint + unit tests (< 2 min)
2. **PR Review**: Full test suite (< 10 min)
3. **Main Branch**: Full suite + E2E + performance
4. **Nightly**: Extended E2E + load tests

### Test Prioritization
1. **P0 - Critical Path**: Cart, checkout, payment
2. **P1 - Core Features**: Product browsing, search, auth
3. **P2 - Enhanced Features**: Reviews, social, admin
4. **P3 - Edge Cases**: Error states, offline mode

### Regression Prevention
- Snapshot testing for UI components
- Visual regression with Percy
- API contract testing
- Database migration tests

## Monitoring & Reporting

### Test Metrics Dashboard
- Test coverage trends
- Failure rate by component
- Performance regression alerts
- Flaky test detection

### Quality Gates
- No merge without 80% coverage
- All E2E tests must pass
- Performance budgets enforced
- Zero accessibility violations

## Next Steps

1. **Immediate Actions**:
   - Install testing dependencies
   - Set up Jest and Playwright
   - Create first unit tests
   - Configure CI pipeline

2. **Week 1**:
   - Component test coverage to 60%
   - Critical E2E scenarios
   - Accessibility audit

3. **Week 2**:
   - Full 80% coverage
   - Load testing setup
   - Visual regression tests

4. **Ongoing**:
   - Monitor test health
   - Reduce flaky tests
   - Optimize test runtime
   - Expand E2E scenarios