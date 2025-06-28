# Testing Infrastructure

## Overview
This directory contains all tests for the Indecisive Wear e-commerce platform. We maintain 80% test coverage across unit, integration, and E2E tests.

## Directory Structure
```
tests/
├── __mocks__/          # Mock files for modules
├── components/         # Component tests
├── hooks/             # Hook tests
├── utils/             # Utility and helper tests
├── e2e/               # End-to-end tests (Playwright)
├── integration/       # Integration tests
└── setup.ts           # Test setup and configuration
```

## Running Tests

### All Tests
```bash
pnpm test                # Run all tests
pnpm test:watch         # Run tests in watch mode
pnpm test:coverage      # Run with coverage report
```

### Specific Test Types
```bash
pnpm test:unit          # Unit tests only
pnpm test:components    # Component tests only
pnpm test:integration   # Integration tests
pnpm test:e2e          # E2E tests (Playwright)
pnpm test:a11y         # Accessibility tests
```

### E2E Tests
```bash
pnpm test:e2e          # Run all E2E tests
pnpm test:e2e:ui       # Open Playwright UI
pnpm test:e2e:debug    # Debug mode
```

## Writing Tests

### Component Tests
```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
})
```

### Hook Tests
```typescript
import { renderHook, act } from '@testing-library/react'
import { useCart } from '@/hooks/use-cart'

describe('useCart', () => {
  it('adds items to cart', () => {
    const { result } = renderHook(() => useCart())
    
    act(() => {
      result.current.addItem({ id: '1', quantity: 1 })
    })
    
    expect(result.current.items).toHaveLength(1)
  })
})
```

### E2E Tests
```typescript
import { test, expect } from '@playwright/test'

test('user can complete checkout', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Shop Now')
  // ... test steps
})
```

## Test Patterns

### Server Components
- Use async rendering for Server Components
- Mock data fetching functions
- Test loading and error states

### Client Components
- Test user interactions
- Verify state changes
- Check accessibility

### Mobile Testing
- Test touch interactions
- Verify responsive behavior
- Check touch target sizes (44x44px minimum)

### Performance Testing
- Keep render time under 16ms
- Monitor bundle size impact
- Test with throttled network

## Coverage Requirements

### Minimum Coverage
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

### Critical Paths (100% Required)
- Cart operations
- Checkout flow
- Payment processing
- User authentication

## CI/CD Integration

Tests run automatically on:
- Every push to main/develop
- All pull requests
- Nightly builds

### Test Pipeline
1. Lint & Type Check
2. Unit Tests
3. Component Tests
4. Integration Tests
5. E2E Tests (parallel shards)
6. Accessibility Tests
7. Performance Tests

## Debugging Tests

### VS Code
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache", "${file}"],
  "console": "integratedTerminal"
}
```

### Browser DevTools
For E2E tests:
```bash
PWDEBUG=1 pnpm test:e2e
```

## Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on user-facing behavior
   - Avoid testing internal state

2. **Use Testing Library Queries**
   - Prefer `getByRole` over `getByTestId`
   - Use accessible queries

3. **Keep Tests Independent**
   - No shared state between tests
   - Clean up after each test

4. **Mock External Dependencies**
   - API calls
   - Browser APIs
   - Third-party services

5. **Write Descriptive Test Names**
   - What is being tested
   - What the expected outcome is
   - Under what conditions

## Troubleshooting

### Common Issues

**Tests failing locally but passing in CI**
- Check Node version matches CI
- Clear test cache: `jest --clearCache`
- Check environment variables

**Flaky E2E Tests**
- Add proper wait conditions
- Use `waitFor` for async operations
- Increase timeout for slow operations

**Coverage not updating**
- Clear coverage directory
- Run with `--no-cache`
- Check coverage ignore patterns

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)