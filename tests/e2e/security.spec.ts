import { test, expect } from '@playwright/test'

test.describe('Security Tests', () => {
  test('security headers are present', async ({ page }) => {
    await test.step('Check security headers on main pages', async () => {
      const urls = ['/', '/shop', '/login', '/register']
      
      for (const url of urls) {
        const response = await page.goto(url)
        const headers = response?.headers() || {}
        
        // Check for essential security headers
        expect(headers['x-frame-options']).toBeDefined()
        expect(headers['x-content-type-options']).toBe('nosniff')
        expect(headers['referrer-policy']).toBeDefined()
        expect(headers['content-security-policy']).toBeDefined()
        
        // X-Powered-By should be removed
        expect(headers['x-powered-by']).toBeUndefined()
        
        // HSTS should be present in production
        if (page.url().startsWith('https://')) {
          expect(headers['strict-transport-security']).toBeDefined()
        }
      }
    })
  })

  test('content security policy prevents XSS', async ({ page }) => {
    await test.step('Test CSP blocks inline scripts', async () => {
      await page.goto('/')
      
      // Try to inject inline script (should be blocked by CSP)
      const scriptBlocked = await page.evaluate(() => {
        try {
          const script = document.createElement('script')
          script.innerHTML = '(window as any).xssTest = true;'
          document.head.appendChild(script)
          return !(window as any).xssTest
        } catch (e) {
          return true // Script was blocked
        }
      })
      
      expect(scriptBlocked).toBe(true)
    })

    await test.step('Check CSP violations are reported', async () => {
      let cspViolations = 0
      
      page.on('console', msg => {
        if (msg.text().includes('Content Security Policy')) {
          cspViolations++
        }
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // There should be no CSP violations on normal page load
      expect(cspViolations).toBe(0)
    })
  })

  test('authentication forms use HTTPS', async ({ page }) => {
    await test.step('Check login form security', async () => {
      await page.goto('/login')
      
      const loginForm = page.locator('form')
      if (await loginForm.isVisible()) {
        // Password input should have proper type
        const passwordInput = page.locator('input[type="password"]')
        await expect(passwordInput).toBeVisible()
        
        // Form should use HTTPS or be prepared for HTTPS
        const formAction = await loginForm.getAttribute('action')
        if (formAction) {
          expect(formAction).not.toContain('http://')
        }
      }
    })

    await test.step('Check registration form security', async () => {
      await page.goto('/register')
      
      const form = page.locator('form')
      if (await form.isVisible()) {
        const passwordInputs = page.locator('input[type="password"]')
        const count = await passwordInputs.count()
        
        // Should have password and confirm password fields
        expect(count).toBeGreaterThanOrEqual(1)
      }
    })
  })

  test('no sensitive data in client-side code', async ({ page }) => {
    await test.step('Check for exposed secrets', async () => {
      await page.goto('/')
      
      const pageContent = await page.content()
      const scriptTags = await page.locator('script').allTextContents()
      const allContent = pageContent + scriptTags.join(' ')
      
      // Check for common secret patterns (case insensitive)
      const secretPatterns = [
        /api[_-]?key.*=.*['"'][a-zA-Z0-9]{20,}['"']/i,
        /secret[_-]?key.*=.*['"'][a-zA-Z0-9]{20,}['"']/i,
        /password.*=.*['"'][a-zA-Z0-9]{8,}['"']/i,
        /sk_live_[a-zA-Z0-9]+/i, // Stripe live keys
        /pk_live_[a-zA-Z0-9]+/i  // Stripe live public keys (less critical but still shouldn't be exposed unnecessarily)
      ]
      
      secretPatterns.forEach(pattern => {
        expect(allContent).not.toMatch(pattern)
      })
    })

    await test.step('Check environment variables are not exposed', async () => {
      const envVars = await page.evaluate(() => {
        // Check if process.env is accessible (it shouldn't be in browser)
        try {
          return typeof process !== 'undefined' && process.env
        } catch {
          return false
        }
      })
      
      expect(envVars).toBeFalsy()
    })
  })

  test('input validation and sanitization', async ({ page }) => {
    await test.step('Test XSS prevention in forms', async () => {
      await page.goto('/contact') // or any form page
      
      const form = page.locator('form')
      if (await form.isVisible()) {
        const textInputs = form.locator('input[type="text"], input[type="email"], textarea')
        const inputCount = await textInputs.count()
        
        if (inputCount > 0) {
          const xssPayload = '<script>alert("XSS")</script>'
          
          // Fill form with XSS payload
          await textInputs.first().fill(xssPayload)
          
          // Submit if possible
          const submitButton = form.locator('button[type="submit"], input[type="submit"]')
          if (await submitButton.isVisible()) {
            await submitButton.click()
            await page.waitForTimeout(1000)
            
            // Check that script didn't execute
            const alertFired = await page.evaluate(() => window.alert.toString().includes('XSS'))
            expect(alertFired).toBe(false)
          }
        }
      }
    })

    await test.step('Test SQL injection protection', async () => {
      // Test search functionality with SQL injection patterns
      const searchInput = page.locator('input[type="search"]')
      if (await searchInput.isVisible()) {
        const sqlPayloads = [
          "'; DROP TABLE users; --",
          "' OR '1'='1",
          "admin'/*"
        ]
        
        for (const payload of sqlPayloads) {
          await searchInput.fill(payload)
          await page.keyboard.press('Enter')
          await page.waitForTimeout(1000)
          
          // Page should handle gracefully, not crash
          const errorMessages = await page.locator('text=error, text=exception').count()
          expect(errorMessages).toBe(0)
        }
      }
    })
  })

  test('session security', async ({ page }) => {
    await test.step('Check cookie security attributes', async () => {
      await page.goto('/')
      
      const cookies = await page.context().cookies()
      
      cookies.forEach(cookie => {
        if (cookie.name.includes('session') || cookie.name.includes('auth')) {
          // Authentication cookies should be secure
          expect(cookie.secure).toBe(true)
          expect(cookie.httpOnly).toBe(true)
          expect(cookie.sameSite).toBeDefined()
        }
      })
    })

    await test.step('Test session timeout', async () => {
      // This would require implementing session timeout logic
      // For now, just check that session-related endpoints exist
      const response = await page.request.get('/api/auth/session', { failOnStatusCode: false })
      
      // Should have proper status codes
      expect([200, 401, 404]).toContain(response.status())
    })
  })

  test('file upload security (if applicable)', async ({ page }) => {
    await test.step('Check for file upload functionality', async () => {
      // Look for file inputs across the site
      await page.goto('/account') // Account page might have avatar upload
      
      const fileInputs = page.locator('input[type="file"]')
      const count = await fileInputs.count()
      
      if (count > 0) {
        // Check file type restrictions
        const accept = await fileInputs.first().getAttribute('accept')
        if (accept) {
          // Should have file type restrictions
          expect(accept).toBeDefined()
          expect(accept.length).toBeGreaterThan(0)
        }
      }
    })
  })

  test('information disclosure protection', async ({ page }) => {
    await test.step('Check error pages don\'t leak info', async () => {
      // Test various error conditions
      const errorUrls = [
        '/nonexistent-page',
        '/api/nonexistent-endpoint',
        '/admin',
        '/../../../etc/passwd'
      ]
      
      for (const url of errorUrls) {
        const response = await page.goto(url, { waitUntil: 'networkidle' })
        const content = await page.content()
        
        // Error pages shouldn't reveal sensitive information
        expect(content).not.toContain('stack trace')
        expect(content).not.toContain('internal server error')
        expect(content).not.toContain('database')
        expect(content).not.toContain('sql')
        
        // Should return appropriate status codes
        if (response) {
          expect([404, 403, 400]).toContain(response.status())
        }
      }
    })

    await test.step('Check debug information is not exposed', async () => {
      await page.goto('/')
      const content = await page.content()
      
      // Should not expose debug information
      expect(content).not.toContain('DEBUG=')
      expect(content).not.toContain('development')
      expect(content).not.toContain('NODE_ENV=development')
      expect(content).not.toContain('console.log')
    })
  })

  test('rate limiting protection', async ({ page }) => {
    await test.step('Test API rate limiting', async () => {
      // Test rate limiting on a public endpoint
      const requests = []
      
      // Make multiple rapid requests
      for (let i = 0; i < 20; i++) {
        requests.push(page.request.get('/api/products', { failOnStatusCode: false }))
      }
      
      const responses = await Promise.all(requests)
      
      // Some requests should be rate limited (429 status)
      const rateLimitedRequests = responses.filter(r => r.status() === 429)
      
      // If rate limiting is implemented, should see some 429s
      // If not implemented, should still not crash the server
      responses.forEach(response => {
        expect([200, 429, 404]).toContain(response.status())
      })
    })
  })

  test('third-party integration security', async ({ page }) => {
    await test.step('Check external resource loading', async () => {
      await page.goto('/')
      
      const externalResources = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource')
        return resources
          .filter((r: any) => !r.name.includes(location.hostname))
          .map((r: any) => r.name)
      })
      
      // External resources should use HTTPS
      externalResources.forEach(url => {
        if (!url.startsWith('data:')) {
          expect(url).toMatch(/^https:\/\//)
        }
      })
    })

    await test.step('Check iframe security', async () => {
      const iframes = page.locator('iframe')
      const count = await iframes.count()
      
      for (let i = 0; i < count; i++) {
        const iframe = iframes.nth(i)
        const src = await iframe.getAttribute('src')
        const sandbox = await iframe.getAttribute('sandbox')
        
        if (src && !src.startsWith('data:')) {
          // External iframes should use HTTPS
          expect(src).toMatch(/^https:\/\//)
          
          // Should have sandbox attribute for security
          expect(sandbox).toBeDefined()
        }
      }
    })
  })
})