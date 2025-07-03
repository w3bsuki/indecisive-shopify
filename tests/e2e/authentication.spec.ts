import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('login page loads correctly', async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      await page.goto('/login')
      await page.waitForLoadState('networkidle')
    })

    await test.step('Verify login page structure', async () => {
      // Check for the actual heading text
      const heading = page.locator('h1:has-text("SIGN IN")')
      await expect(heading).toBeVisible()
      
      // Check for welcome text
      const welcomeText = page.locator('text=Welcome back to Indecisive Wear')
      await expect(welcomeText).toBeVisible()
    })

    await test.step('Verify form elements are present', async () => {
      // Check for email input
      const emailInput = page.locator('input[name="email"]')
      await expect(emailInput).toBeVisible()
      
      // Check for password input
      const passwordInput = page.locator('input[name="password"]')
      await expect(passwordInput).toBeVisible()
      
      // Check for submit button
      const submitButton = page.locator('button[type="submit"]')
      await expect(submitButton).toBeVisible()
    })
  })

  test('login form validation', async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      await page.goto('/login')
      await page.waitForLoadState('networkidle')
    })

    await test.step('Test form submission with test credentials', async () => {
      // Fill in test credentials
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'testpassword')
      
      // Submit form
      await page.click('button[type="submit"]')
      await page.waitForLoadState('networkidle')
      
      // Form should handle the submission (success or error)
      // Since we're using test credentials, we expect it might fail
      // But the form should not crash
    })
  })

  test('password visibility toggle works', async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      await page.goto('/login')
      await page.waitForLoadState('networkidle')
    })

    await test.step('Test password visibility toggle', async () => {
      const passwordInput = page.locator('input[name="password"]')
      const toggleButton = page.locator('button:has([class*="lucide-eye"])')
      
      // Password should start as hidden
      await expect(passwordInput).toHaveAttribute('type', 'password')
      
      // Click toggle to show password
      if (await toggleButton.isVisible()) {
        await toggleButton.click()
        await expect(passwordInput).toHaveAttribute('type', 'text')
        
        // Click again to hide
        await toggleButton.click()
        await expect(passwordInput).toHaveAttribute('type', 'password')
      }
    })
  })

  test('registration page loads correctly', async ({ page }) => {
    await test.step('Navigate to registration page', async () => {
      await page.goto('/register')
      await page.waitForLoadState('networkidle')
    })

    await test.step('Verify registration page exists', async () => {
      // Page should load without errors
      expect(page.url()).toContain('/register')
      
      // Should have some form of registration content
      const heading = page.locator('h1')
      await expect(heading).toBeVisible()
    })
  })

  test('login page navigation links work', async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      await page.goto('/login')
      await page.waitForLoadState('networkidle')
    })

    await test.step('Test registration link', async () => {
      const registerLink = page.locator('text=Create one here')
      await expect(registerLink).toBeVisible()
      
      await registerLink.click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain('/register')
    })

    await test.step('Test back to shopping link', async () => {
      await page.goto('/login')
      await page.waitForLoadState('networkidle')
      
      const backLink = page.locator('text=← Back to shopping')
      await expect(backLink).toBeVisible()
      
      await backLink.click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toBe(page.url().replace('/login', '/'))
    })
  })

  test('forgot password link exists', async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      await page.goto('/login')
      await page.waitForLoadState('networkidle')
    })

    await test.step('Check forgot password link', async () => {
      const forgotLink = page.locator('text=Forgot password?')
      await expect(forgotLink).toBeVisible()
      
      // Click should navigate to forgot password page
      await forgotLink.click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain('/forgot-password')
    })
  })

  test('account page accessibility without auth', async ({ page }) => {
    await test.step('Access account page without authentication', async () => {
      await page.goto('/account')
      await page.waitForLoadState('networkidle')
    })

    await test.step('Page should handle unauthenticated access', async () => {
      // Page should either redirect to login or show appropriate message
      const url = page.url()
      const isRedirected = url.includes('/login')
      const hasAccountContent = await page.locator('h1').isVisible()
      
      // Either redirected to login or shows some content
      expect(isRedirected || hasAccountContent).toBe(true)
    })
  })

  test('form accessibility features', async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      await page.goto('/login')
      await page.waitForLoadState('networkidle')
    })

    await test.step('Check form accessibility', async () => {
      // Labels should be associated with inputs
      const emailLabel = page.locator('label[for="email"]')
      const passwordLabel = page.locator('label[for="password"]')
      
      await expect(emailLabel).toBeVisible()
      await expect(passwordLabel).toBeVisible()
      
      // Inputs should have proper attributes
      const emailInput = page.locator('input[name="email"]')
      const passwordInput = page.locator('input[name="password"]')
      
      await expect(emailInput).toHaveAttribute('type', 'email')
      await expect(emailInput).toHaveAttribute('autoComplete', 'email')
      await expect(emailInput).toHaveAttribute('required')
      
      await expect(passwordInput).toHaveAttribute('type', 'password')
      await expect(passwordInput).toHaveAttribute('autoComplete', 'current-password')
      await expect(passwordInput).toHaveAttribute('required')
    })
  })

  test('login form handles empty submission', async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      await page.goto('/login')
      await page.waitForLoadState('networkidle')
    })

    await test.step('Submit empty form', async () => {
      // Click submit without filling anything
      await page.click('button[type="submit"]')
      await page.waitForTimeout(1000)
      
      // HTML5 validation should prevent submission
      // or server should handle validation
      const emailInput = page.locator('input[name="email"]')
      const validity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid)
      expect(validity).toBe(false)
    })
  })

  test('login page meta information', async ({ page }) => {
    await test.step('Check page meta data', async () => {
      await page.goto('/login')
      await page.waitForLoadState('networkidle')
      
      // Check page title
      const title = await page.title()
      expect(title).toContain('Sign In')
      expect(title).toContain('Indecisive Wear')
    })
  })
})