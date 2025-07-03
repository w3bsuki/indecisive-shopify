'use client'

import { useState, useEffect } from 'react'

export interface CookieConsentData {
  analytics: boolean
  marketing: boolean
}

const CONSENT_COOKIE_NAME = 'cookie-consent'

/**
 * Get cookie consent data from localStorage
 */
export function getCookieConsent(): CookieConsentData | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(CONSENT_COOKIE_NAME)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

/**
 * Hook for managing cookie consent
 */
export function useCookieConsent() {
  const [consentData, setConsentData] = useState<CookieConsentData | null>(null)
  
  useEffect(() => {
    setConsentData(getCookieConsent())
  }, [])
  
  const updateConsent = (data: CookieConsentData) => {
    localStorage.setItem(CONSENT_COOKIE_NAME, JSON.stringify(data))
    setConsentData(data)
    
    // Reload page to apply consent changes
    window.location.reload()
  }
  
  return {
    consentData,
    updateConsent,
  }
}