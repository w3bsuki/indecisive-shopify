/**
 * Performance monitoring utilities
 * Tracks Core Web Vitals and custom metrics
 */

import type { Metric } from 'web-vitals'

/**
 * Report web vitals to analytics
 */
export function reportWebVitals(metric: Metric) {
  // Send to Google Analytics if available
  if (window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    })
  }
  
  // Send to Sentry if available
  if (window.Sentry) {
    window.Sentry.addBreadcrumb({
      category: 'web-vitals',
      message: `${metric.name}: ${metric.value}`,
      level: 'info',
      data: {
        metric: metric.name,
        value: metric.value,
        id: metric.id,
      },
    })
  }
  
  // Log poor performance
  const thresholds = {
    FCP: 2500,
    LCP: 4000,
    TTFB: 800,
    CLS: 0.25,
    INP: 500,
  }
  
  if (metric.value > (thresholds[metric.name as keyof typeof thresholds] || 0)) {
    console.warn(`Poor ${metric.name} performance:`, metric.value)
  }
}

/**
 * Custom performance marks for tracking specific features
 */
export const performanceMark = {
  start(name: string) {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-start`)
    }
  },
  
  end(name: string) {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-end`)
      try {
        window.performance.measure(name, `${name}-start`, `${name}-end`)
        const measure = window.performance.getEntriesByName(name)[0]
        
        if (measure && window.gtag) {
          window.gtag('event', 'timing_complete', {
            name,
            value: Math.round(measure.duration),
            event_category: 'Performance',
          })
        }
      } catch (_e) {
        // Ignore errors from missing marks
      }
    }
  },
}

/**
 * Track long tasks that block the main thread
 */
export function observeLongTasks() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return
  }
  
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Report tasks longer than 50ms
        if (entry.duration > 50) {
          console.warn('Long task detected:', {
            duration: entry.duration,
            startTime: entry.startTime,
          })
          
          if (window.gtag) {
            window.gtag('event', 'long_task', {
              event_category: 'Performance',
              value: Math.round(entry.duration),
              event_label: 'main-thread-blocking',
            })
          }
        }
      }
    })
    
    observer.observe({ entryTypes: ['longtask'] })
  } catch (_e) {
    // PerformanceObserver not supported
  }
}

/**
 * Resource timing for tracking slow resources
 */
export function observeResourceTiming() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return
  }
  
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Report slow resources (>1 second)
        if (entry.duration > 1000) {
          console.warn('Slow resource:', {
            name: entry.name,
            duration: entry.duration,
            type: (entry as PerformanceResourceTiming).initiatorType,
          })
        }
      }
    })
    
    observer.observe({ entryTypes: ['resource'] })
  } catch (_e) {
    // PerformanceObserver not supported
  }
}