module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm start',
      startServerReadyPattern: 'ready on',
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/shop',
        'http://localhost:3000/product/1',
        'http://localhost:3000/cart',
        'http://localhost:3000/checkout',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.90 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        
        // Additional performance metrics
        'server-response-time': ['error', { maxNumericValue: 600 }],
        'interactive': ['error', { maxNumericValue: 3800 }],
        'max-potential-fid': ['error', { maxNumericValue: 130 }],
        
        // Resource optimization
        'uses-responsive-images': 'error',
        'uses-optimized-images': 'error',
        'uses-text-compression': 'error',
        'uses-rel-preconnect': 'warn',
        'font-display': 'warn',
        
        // Accessibility
        'color-contrast': 'error',
        'heading-order': 'error',
        'image-alt': 'error',
        'link-name': 'error',
        'meta-viewport': 'error',
        
        // Best practices
        'errors-in-console': 'error',
        'no-document-write': 'error',
        'geolocation-on-start': 'error',
        'doctype': 'error',
        'charset': 'error',
        
        // SEO
        'document-title': 'error',
        'meta-description': 'error',
        'crawlable-anchors': 'error',
        'canonical': 'warn',
        'robots-txt': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}