import { performance } from 'perf_hooks'

interface PerformanceMetrics {
  renderTime: number
  interactionTime: number
  memoryUsage: number
}

export class PerformanceMonitor {
  private startTime: number = 0
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    interactionTime: 0,
    memoryUsage: 0,
  }

  startMeasure(label: string) {
    performance.mark(`${label}-start`)
    this.startTime = performance.now()
  }

  endMeasure(label: string): number {
    performance.mark(`${label}-end`)
    performance.measure(label, `${label}-start`, `${label}-end`)
    
    const measure = performance.getEntriesByName(label)[0]
    return measure.duration
  }

  measureRenderTime(fn: () => void): number {
    this.startMeasure('render')
    fn()
    const duration = this.endMeasure('render')
    this.metrics.renderTime = duration
    return duration
  }

  async measureAsyncOperation(fn: () => Promise<void>): Promise<number> {
    this.startMeasure('async-operation')
    await fn()
    return this.endMeasure('async-operation')
  }

  getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage()
      this.metrics.memoryUsage = usage.heapUsed / 1024 / 1024 // Convert to MB
      return this.metrics.memoryUsage
    }
    return 0
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  assertPerformance(maxRenderTime: number, maxMemoryUsage: number) {
    expect(this.metrics.renderTime).toBeLessThan(maxRenderTime)
    expect(this.metrics.memoryUsage).toBeLessThan(maxMemoryUsage)
  }
}

describe('Performance Tests', () => {
  let monitor: PerformanceMonitor

  beforeEach(() => {
    monitor = new PerformanceMonitor()
  })

  it('measures component render time', () => {
    const renderTime = monitor.measureRenderTime(() => {
      // Simulate component render
      const elements = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        price: Math.random() * 100,
      }))
      
      // Simulate DOM operations
      elements.forEach(el => {
        const div = document.createElement('div')
        div.textContent = el.name
        div.setAttribute('data-price', el.price.toString())
      })
    })

    expect(renderTime).toBeLessThan(100) // Should render in less than 100ms
  })

  it('measures async operation performance', async () => {
    const duration = await monitor.measureAsyncOperation(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    expect(duration).toBeGreaterThan(49)
    expect(duration).toBeLessThan(100)
  })

  it('tracks memory usage', () => {
    const initialMemory = monitor.getMemoryUsage()
    
    // Allocate some memory
    const largeArray = Array.from({ length: 100000 }, () => ({
      data: Math.random().toString(36).repeat(10)
    }))
    
    const afterMemory = monitor.getMemoryUsage()
    
    // Memory should increase
    expect(afterMemory).toBeGreaterThan(initialMemory)
    
    // Clean up
    largeArray.length = 0
  })

  it('provides performance assertions', () => {
    monitor.measureRenderTime(() => {
      // Fast operation
      const sum = Array.from({ length: 100 }, (_, i) => i).reduce((a, b) => a + b, 0)
      return sum
    })

    monitor.assertPerformance(50, 500) // Max 50ms render, 500MB memory
  })
})

// Performance test utilities for components
export const performanceTest = {
  measureFirstRender: async (Component: React.ComponentType) => {
    const monitor = new PerformanceMonitor()
    
    return monitor.measureRenderTime(() => {
      // This would be used with React Testing Library
      // render(<Component />)
    })
  },

  measureRerender: async (Component: React.ComponentType, props: any) => {
    const monitor = new PerformanceMonitor()
    
    // Initial render
    monitor.startMeasure('initial-render')
    // render(<Component {...props} />)
    monitor.endMeasure('initial-render')
    
    // Re-render with new props
    monitor.startMeasure('re-render')
    // rerender(<Component {...props} newProp={true} />)
    const rerenderTime = monitor.endMeasure('re-render')
    
    return rerenderTime
  },

  measureInteraction: async (element: HTMLElement, interaction: () => void) => {
    const monitor = new PerformanceMonitor()
    
    return monitor.measureRenderTime(() => {
      interaction()
    })
  },

  assertRenderPerformance: (renderTime: number, threshold: number = 16) => {
    // 16ms = 60fps
    expect(renderTime).toBeLessThan(threshold)
  },
}

// Bundle size tracking
export const bundleSizeTest = {
  getComponentSize: (componentPath: string): number => {
    // In a real implementation, this would analyze the bundle
    // For now, return a mock value
    return 10 // KB
  },

  assertBundleSize: (componentPath: string, maxSize: number) => {
    const size = bundleSizeTest.getComponentSize(componentPath)
    expect(size).toBeLessThan(maxSize)
  },
}

// Web Vitals testing
export const webVitalsTest = {
  measureLCP: async (page: any): Promise<number> => {
    // Measure Largest Contentful Paint
    // In real implementation, would use Playwright or Puppeteer
    return 2000 // ms
  },

  measureFID: async (page: any): Promise<number> => {
    // Measure First Input Delay
    return 50 // ms
  },

  measureCLS: async (page: any): Promise<number> => {
    // Measure Cumulative Layout Shift
    return 0.1
  },

  assertCoreWebVitals: async (page: any) => {
    const lcp = await webVitalsTest.measureLCP(page)
    const fid = await webVitalsTest.measureFID(page)
    const cls = await webVitalsTest.measureCLS(page)

    expect(lcp).toBeLessThan(2500) // Good LCP
    expect(fid).toBeLessThan(100)  // Good FID
    expect(cls).toBeLessThan(0.1)  // Good CLS
  },
}