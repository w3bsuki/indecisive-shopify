import { test, expect } from '@playwright/test'

test.describe('Basic Site Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('homepage loads and displays products', async ({ page }) => {
    // Verify homepage loads
    await test.step('Homepage loads correctly', async () => {
      await expect(page.locator('h1')).toContainText(['Fashion', 'Indecisive', 'Style'])
      await expect(page).toHaveTitle(/Indecisive Wear/)
    })

    // Verify products are displayed
    await test.step('Products grid displays', async () => {
      const productElements = page.locator('[data-testid="product-card"], .product-card, .grid > div')
      await expect(productElements.first()).toBeVisible({ timeout: 10000 })
    })

    // Test navigation
    await test.step('Navigation is accessible', async () => {
      const navigation = page.locator('nav, [role="navigation"]')
      await expect(navigation).toBeVisible()
    })
  })

  test('cart functionality works', async ({ page }) => {
    await test.step('Cart starts empty', async () => {
      // Look for cart indicator (could be various formats)
      const cartButton = page.locator('[data-testid="cart"], .cart, button:has-text("Cart")')
      if (await cartButton.isVisible()) {
        const cartText = await cartButton.textContent()
        expect(cartText).toMatch(/0|Cart|empty/i)
      }
    })
  })

  test('search functionality', async ({ page }) => {
    await test.step('Search is available', async () => {
      const searchInput = page.locator('input[type="search"], input[placeholder*="search"], [data-testid="search"]')
      if (await searchInput.isVisible()) {
        await searchInput.fill('test')
        await page.keyboard.press('Enter')
        await page.waitForLoadState('networkidle')
        // Should navigate to search page or show results
        expect(page.url()).toMatch(/search|results/i)
      }
    })
  })

  test('mobile responsiveness', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test')
    
    await test.step('Mobile navigation works', async () => {
      // Look for mobile menu button
      const mobileMenuButton = page.locator('[data-testid="mobile-menu"], .mobile-menu, button:has-text("Menu")')
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click()
        await expect(page.locator('[role="dialog"], .menu-open, .nav-open')).toBeVisible()
      }
    })
  })

  test('product page loads', async ({ page }) => {
    await test.step('Navigate to a product', async () => {
      // Click first product link we can find
      const productLink = page.locator('a[href*="/product"], a:has([data-testid="product-card"])')
      if (await productLink.first().isVisible()) {
        await productLink.first().click()
        await page.waitForLoadState('networkidle')
        
        // Should be on a product page
        expect(page.url()).toMatch(/\/product/)
      }
    })
  })

  test('accessibility basics', async ({ page }) => {
    await test.step('Check basic accessibility', async () => {
      // Check for basic accessibility features
      await expect(page.locator('main, [role="main"]')).toBeVisible()
      
      // Check for proper heading structure
      const h1 = page.locator('h1')
      await expect(h1).toBeVisible()
      
      // Check for alt text on images (if any)
      const images = page.locator('img')
      const imageCount = await images.count()
      if (imageCount > 0) {
        const firstImage = images.first()
        await expect(firstImage).toHaveAttribute('alt')
      }
    })
  })
})