import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from homepage
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('complete guest checkout with credit card', async ({ page }) => {
    // Browse products
    await test.step('Browse and select product', async () => {
      await page.click('text=Shop Now')
      await page.waitForURL('**/shop')
      
      // Click first product
      await page.click('[data-testid="product-card"]:first-child')
      await page.waitForLoadState('networkidle')
    })

    // Add to cart
    await test.step('Add product to cart', async () => {
      // Select size if available
      const sizeSelector = page.locator('select[name="size"]')
      if (await sizeSelector.isVisible()) {
        await sizeSelector.selectOption({ index: 1 })
      }
      
      // Select color if available
      const colorSelector = page.locator('select[name="color"]')
      if (await colorSelector.isVisible()) {
        await colorSelector.selectOption({ index: 1 })
      }
      
      // Add to cart
      await page.click('button:has-text("Add to Cart")')
      
      // Wait for cart update
      await page.waitForSelector('[data-testid="cart-count"]')
      const cartCount = await page.textContent('[data-testid="cart-count"]')
      expect(parseInt(cartCount || '0')).toBeGreaterThan(0)
    })

    // Navigate to cart
    await test.step('View cart', async () => {
      await page.click('[data-testid="cart-icon"]')
      await page.waitForURL('**/cart')
      
      // Verify cart contents
      await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)
      await expect(page.locator('[data-testid="cart-total"]')).toBeVisible()
    })

    // Proceed to checkout
    await test.step('Proceed to checkout', async () => {
      await page.click('button:has-text("Checkout")')
      await page.waitForURL('**/checkout')
    })

    // Fill shipping information
    await test.step('Fill shipping information', async () => {
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="firstName"]', 'Test')
      await page.fill('input[name="lastName"]', 'User')
      await page.fill('input[name="address"]', '123 Test Street')
      await page.fill('input[name="city"]', 'Test City')
      await page.fill('input[name="state"]', 'CA')
      await page.fill('input[name="postalCode"]', '12345')
      await page.fill('input[name="phone"]', '555-1234')
      
      await page.click('button:has-text("Continue to Payment")')
    })

    // Fill payment information
    await test.step('Fill payment information', async () => {
      // Wait for Stripe iframe to load
      await page.waitForSelector('iframe[name*="stripe"]')
      
      // Fill card details
      const cardFrame = page.frameLocator('iframe[name*="stripe"]').first()
      await cardFrame.locator('input[name="cardnumber"]').fill('4242424242424242')
      await cardFrame.locator('input[name="exp-date"]').fill('12/25')
      await cardFrame.locator('input[name="cvc"]').fill('123')
      await cardFrame.locator('input[name="postal"]').fill('12345')
    })

    // Complete order
    await test.step('Place order', async () => {
      // Review order
      await expect(page.locator('[data-testid="order-summary"]')).toBeVisible()
      
      // Accept terms if required
      const termsCheckbox = page.locator('input[name="terms"]')
      if (await termsCheckbox.isVisible()) {
        await termsCheckbox.check()
      }
      
      // Place order
      await page.click('button:has-text("Place Order")')
      
      // Wait for confirmation
      await page.waitForURL('**/order-confirmation/**', { timeout: 30000 })
    })

    // Verify order confirmation
    await test.step('Verify order confirmation', async () => {
      await expect(page.locator('h1')).toContainText('Order Confirmed')
      
      // Check order number
      const orderNumber = page.locator('[data-testid="order-number"]')
      await expect(orderNumber).toBeVisible()
      const orderText = await orderNumber.textContent()
      expect(orderText).toMatch(/^[A-Z0-9]+$/)
      
      // Check confirmation email message
      await expect(page.locator('text=confirmation email')).toBeVisible()
    })
  })

  test('handle payment failure', async ({ page }) => {
    // Quick path to checkout
    await page.goto('/checkout')
    
    // Fill minimal required fields
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="firstName"]', 'Test')
    await page.fill('input[name="lastName"]', 'User')
    await page.fill('input[name="address"]', '123 Test St')
    await page.fill('input[name="city"]', 'Test City')
    await page.fill('input[name="postalCode"]', '12345')
    
    await page.click('button:has-text("Continue to Payment")')
    
    // Use declined card
    const cardFrame = page.frameLocator('iframe[name*="stripe"]').first()
    await cardFrame.locator('input[name="cardnumber"]').fill('4000000000000002')
    await cardFrame.locator('input[name="exp-date"]').fill('12/25')
    await cardFrame.locator('input[name="cvc"]').fill('123')
    
    await page.click('button:has-text("Place Order")')
    
    // Verify error message
    await expect(page.locator('[role="alert"]')).toContainText('declined')
    
    // Verify user can retry
    await expect(page.locator('button:has-text("Place Order")')).toBeEnabled()
  })

  test('handle network error during checkout', async ({ page, context }) => {
    // Go to checkout
    await page.goto('/checkout')
    
    // Block API calls
    await context.route('**/api/checkout/**', route => route.abort())
    
    // Fill form and submit
    await page.fill('input[name="email"]', 'test@example.com')
    await page.click('button:has-text("Continue")')
    
    // Verify error handling
    await expect(page.locator('[role="alert"]')).toBeVisible()
    await expect(page.locator('text=network error')).toBeVisible()
    
    // Verify retry button
    await expect(page.locator('button:has-text("Retry")')).toBeVisible()
  })

  test('validate required fields', async ({ page }) => {
    await page.goto('/checkout')
    
    // Try to submit without filling fields
    await page.click('button:has-text("Continue")')
    
    // Check validation messages
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=First name is required')).toBeVisible()
    await expect(page.locator('text=Last name is required')).toBeVisible()
    await expect(page.locator('text=Address is required')).toBeVisible()
  })

  test('apply discount code', async ({ page }) => {
    // Add item to cart and go to checkout
    await page.goto('/product/test-product')
    await page.click('button:has-text("Add to Cart")')
    await page.goto('/checkout')
    
    // Apply discount code
    await page.click('button:has-text("Add discount code")')
    await page.fill('input[name="discountCode"]', 'TESTCODE10')
    await page.click('button:has-text("Apply")')
    
    // Verify discount applied
    await expect(page.locator('[data-testid="discount-amount"]')).toBeVisible()
    await expect(page.locator('[data-testid="order-total"]')).toContainText('$')
  })

  test('mobile checkout flow', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only test')
    
    // Similar to desktop but verify mobile-specific UI
    await page.goto('/')
    
    // Use mobile menu
    await page.click('[data-testid="mobile-menu-button"]')
    await page.click('text=Shop')
    
    // Select product
    await page.click('[data-testid="product-card"]:first-child')
    
    // Add to cart
    await page.click('button:has-text("Add to Cart")')
    
    // Use mobile cart sheet
    await page.click('[data-testid="mobile-cart-button"]')
    await expect(page.locator('[data-testid="cart-sheet"]')).toBeVisible()
    
    await page.click('button:has-text("Checkout")')
    
    // Continue with checkout...
  })
})