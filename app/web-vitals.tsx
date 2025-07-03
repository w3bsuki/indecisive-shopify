'use client'

import { useEffect } from 'react'
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'
import { reportWebVitals, observeLongTasks, observeResourceTiming } from '@/lib/performance/monitor'

export function WebVitals() {
  useEffect(() => {
    // Report Core Web Vitals
    onCLS(reportWebVitals)
    onFCP(reportWebVitals)
    onINP(reportWebVitals)
    onLCP(reportWebVitals)
    onTTFB(reportWebVitals)
    
    // Additional performance monitoring
    observeLongTasks()
    observeResourceTiming()
  }, [])
  
  return null
}