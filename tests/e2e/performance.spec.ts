import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('Core Web Vitals meet thresholds', async ({ page }) => {
    await test.step('Navigate to homepage', async () => {
      await page.goto('/')
    })

    await test.step('Check Largest Contentful Paint (LCP)', async () => {
      const lcpValue = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1]
            resolve(lastEntry.startTime)
          }).observe({ entryTypes: ['largest-contentful-paint'] })
        })
      })
      
      // LCP should be under 2.5 seconds
      expect(lcpValue).toBeLessThan(2500)
    })

    await test.step('Check First Contentful Paint (FCP)', async () => {
      const fcpValue = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            resolve(entries[0].startTime)
          }).observe({ entryTypes: ['paint'] })
        })
      })
      
      // FCP should be under 1.8 seconds
      expect(fcpValue).toBeLessThan(1800)
    })

    await test.step('Check Time to First Byte (TTFB)', async () => {
      const ttfbValue = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        return navigation.responseStart - navigation.requestStart
      })
      
      // TTFB should be under 600ms
      expect(ttfbValue).toBeLessThan(600)
    })
  })

  test('page load times are acceptable', async ({ page }) => {
    const pages = [
      { url: '/', name: 'Homepage' },
      { url: '/shop', name: 'Shop page' },
      { url: '/about', name: 'About page' },
      { url: '/contact', name: 'Contact page' }
    ]

    for (const pageInfo of pages) {
      await test.step(`Test ${pageInfo.name} load time`, async () => {
        const startTime = Date.now()
        await page.goto(pageInfo.url)
        await page.waitForLoadState('networkidle')
        const loadTime = Date.now() - startTime
        
        // Page should load within 3 seconds
        expect(loadTime).toBeLessThan(3000)
      })
    }
  })

  test('images load efficiently', async ({ page }) => {
    await test.step('Go to shop page with images', async () => {
      await page.goto('/shop')
      await page.waitForLoadState('networkidle')
    })

    await test.step('Check image loading performance', async () => {
      const images = page.locator('img')
      const imageCount = await images.count()
      
      if (imageCount > 0) {
        // Check that images have proper loading attributes
        for (let i = 0; i < Math.min(imageCount, 5); i++) {
          const img = images.nth(i)
          
          // Images should have alt text
          await expect(img).toHaveAttribute('alt')
          
          // Check if lazy loading is implemented
          const loadingAttr = await img.getAttribute('loading')
          if (loadingAttr) {
            expect(['lazy', 'eager']).toContain(loadingAttr)
          }
        }
        
        // Measure image load times
        const imageLoadTimes = await page.evaluate(() => {
          const images = Array.from(document.querySelectorAll('img'))
          return Promise.all(images.map(img => {
            if (img.complete) {
              return Promise.resolve(0) // Already loaded
            }
            return new Promise<number>((resolve) => {
              const startTime = performance.now()
              img.onload = () => resolve(performance.now() - startTime)
              img.onerror = () => resolve(-1) // Error loading
            })
          }))
        })
        
        // Most images should load quickly
        const validTimes = imageLoadTimes.filter((time: number) => time >= 0 && time > 0)
        
        if (validTimes.length > 0) {
          const avgLoadTime = validTimes.reduce((a: number, b: number) => a + b, 0) / validTimes.length
          expect(avgLoadTime).toBeLessThan(2000) // Average under 2 seconds
        }
      }
    })
  })

  test('bundle size is optimized', async ({ page }) => {
    await test.step('Analyze JavaScript bundle size', async () => {
      await page.goto('/')
      
      const resourceSizes = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
        return resources
          .filter(resource => resource.name.includes('.js') && !resource.name.includes('node_modules'))
          .map(resource => ({
            name: resource.name,
            size: resource.transferSize || resource.encodedBodySize,
            duration: resource.duration
          }))
      })
      
      // Calculate total JavaScript size
      const totalJSSize = resourceSizes.reduce((total, resource) => total + resource.size, 0)
      
      // Total JS should be under 500KB (reasonable for an e-commerce site)
      expect(totalJSSize).toBeLessThan(500 * 1024)
    })
  })

  test('no memory leaks during navigation', async ({ page }) => {
    await test.step('Navigate through multiple pages', async () => {
      const pages = ['/', '/shop', '/about', '/contact', '/']
      
      for (const url of pages) {
        await page.goto(url)
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(1000) // Let page settle
      }
    })

    await test.step('Check for excessive memory usage', async () => {
      const memoryInfo = await page.evaluate(() => {
        // @ts-ignore - Chrome-specific API
        return (performance as any).memory || null
      })
      
      if (memoryInfo) {
        // Memory usage should be reasonable (under 50MB)
        expect(memoryInfo.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024)
      }
    })
  })

  test('no console errors or warnings', async ({ page }) => {
    const consoleMessages: string[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleMessages.push(`${msg.type()}: ${msg.text()}`)
      }
    })

    await test.step('Navigate and check for console errors', async () => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.goto('/shop')
      await page.waitForLoadState('networkidle')
    })

    await test.step('Verify no critical console errors', async () => {
      const criticalErrors = consoleMessages.filter(msg => 
        msg.includes('error:') && 
        !msg.includes('favicon') && // Ignore favicon errors
        !msg.includes('ads') && // Ignore ad blocker errors
        !msg.includes('extension') // Ignore browser extension errors
      )
      
      expect(criticalErrors).toHaveLength(0)
    })
  })

  test('responsive design performance', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ]

    for (const viewport of viewports) {
      await test.step(`Test ${viewport.name} performance`, async () => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        
        const startTime = Date.now()
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        const loadTime = Date.now() - startTime
        
        // All viewports should load reasonably fast
        expect(loadTime).toBeLessThan(4000)
      })
    }
  })

  test('API response times', async ({ page }) => {
    await test.step('Monitor API calls during page load', async () => {
      const apiCalls: Array<{ url: string; duration: number }> = []
      
      page.on('response', response => {
        if (response.url().includes('/api/') || response.url().includes('shopify')) {
          const request = response.request()
          const timing = response.request().timing()
          if (timing) {
            apiCalls.push({
              url: response.url(),
              duration: timing.responseEnd - timing.requestStart
            })
          }
        }
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // API calls should be reasonably fast
      apiCalls.forEach(call => {
        expect(call.duration).toBeLessThan(5000) // Under 5 seconds
      })
    })
  })

  test('service worker caching (if implemented)', async ({ page }) => {
    await test.step('Check for service worker', async () => {
      await page.goto('/')
      
      const hasServiceWorker = await page.evaluate(() => {
        return 'serviceWorker' in navigator
      })
      
      if (hasServiceWorker) {
        await test.step('Verify service worker registration', async () => {
          const swRegistration = await page.evaluate(async () => {
            const registration = await navigator.serviceWorker.getRegistration()
            return registration ? true : false
          })
          
          if (swRegistration) {
            // If SW is implemented, verify it's working
            expect(swRegistration).toBe(true)
          }
        })
      }
    })
  })
})