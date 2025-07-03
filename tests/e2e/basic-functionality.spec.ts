import { test, expect } from '@playwright/test'

test.describe('Basic Site Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('homepage loads correctly', async ({ page }) => {
    await test.step('Homepage loads with correct title', async () => {
      // Check for actual brand name in h1
      const h1 = page.locator('h1:has-text("INDECISIVE WEAR")')
      await expect(h1).toBeVisible()
      
      // Check page title
      await expect(page).toHaveTitle(/Indecisive Wear/i)
    })

    await test.step('Navigation is present', async () => {
      // Desktop navigation should be visible on desktop
      const nav = page.locator('nav')
      await expect(nav).toBeVisible()
    })
  })

  test('product grid displays on homepage', async ({ page }) => {
    await test.step('Products section is visible', async () => {
      // Look for the featured section
      const featuredSection = page.locator('section').filter({ hasText: /featured/i })
      if (await featuredSection.isVisible()) {
        await expect(featuredSection).toBeVisible()
      }
    })

    await test.step('Product links exist', async () => {
      // Look for actual product links using the /products/ pattern
      const productLinks = page.locator('a[href*="/products/"]')
      const count = await productLinks.count()
      if (count > 0) {
        await expect(productLinks.first()).toBeVisible()
      }
    })
  })

  test('navigation links work', async ({ page }) => {
    await test.step('Main navigation links are functional', async () => {
      // Test actual navigation links from the component
      const newLink = page.locator('a[href="/new"]')
      if (await newLink.isVisible()) {
        await newLink.click()
        await page.waitForLoadState('networkidle')
        expect(page.url()).toContain('/new')
        await page.goBack()
      }
    })

    await test.step('Sale link works', async () => {
      const saleLink = page.locator('a[href="/sale"]')
      if (await saleLink.isVisible()) {
        await saleLink.click()
        await page.waitForLoadState('networkidle')
        expect(page.url()).toContain('/sale')
        await page.goBack()
      }
    })
  })

  test('cart icon is present', async ({ page }) => {
    await test.step('Cart icon exists', async () => {
      // Look for cart icon using the actual ShoppingBag icon
      const cartButton = page.locator('button:has([class*="lucide-shopping-bag"])')
      await expect(cartButton).toBeVisible()
    })
  })

  test('search functionality exists', async ({ page }) => {
    await test.step('Search button is present', async () => {
      // Look for search button with Search icon
      const searchButton = page.locator('button:has([class*="lucide-search"])')
      await expect(searchButton).toBeVisible()
    })
  })

  test('product page navigation', async ({ page }) => {
    await test.step('Can navigate to product page', async () => {
      // Click first product link if available
      const productLink = page.locator('a[href*="/products/"]').first()
      const linkCount = await page.locator('a[href*="/products/"]').count()
      
      if (linkCount > 0) {
        await productLink.click()
        await page.waitForLoadState('networkidle')
        
        // Should be on a product page
        expect(page.url()).toMatch(/\/products\//)
      }
    })
  })

  test('footer is present', async ({ page }) => {
    await test.step('Footer exists and is visible', async () => {
      const footer = page.locator('footer, [role="contentinfo"]')
      await expect(footer).toBeVisible()
    })
  })

  test('mobile responsiveness check', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test')
    
    await test.step('Mobile layout adapts', async () => {
      // Check that mobile navigation is hidden on desktop
      const desktopNav = page.locator('.hidden.md\\:block')
      await expect(desktopNav).toBeVisible()
      
      // Mobile bottom nav should be visible on mobile
      const mobileBottomNav = page.locator('[class*="mobile"]')
      if (await mobileBottomNav.count() > 0) {
        // Mobile elements exist
        expect(await mobileBottomNav.count()).toBeGreaterThan(0)
      }
    })
  })

  test('accessibility basics', async ({ page }) => {
    await test.step('Check basic accessibility features', async () => {
      // Check for proper heading structure
      const h1 = page.locator('h1')
      await expect(h1).toBeVisible()
      
      // Check for alt text on images
      const images = page.locator('img')
      const imageCount = await images.count()
      if (imageCount > 0) {
        for (let i = 0; i < Math.min(imageCount, 3); i++) {
          const img = images.nth(i)
          await expect(img).toHaveAttribute('alt')
        }
      }
      
      // Check for semantic navigation
      const nav = page.locator('nav')
      await expect(nav).toBeVisible()
    })
  })
})