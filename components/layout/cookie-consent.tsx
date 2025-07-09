'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useMarket } from '@/hooks/use-market'
import { SUPPORTED_MARKETS } from '@/lib/shopify/markets'
import { Globe, ChevronDown } from 'lucide-react'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [showRegionSelector, setShowRegionSelector] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always required
    analytics: false,
    marketing: false
  })
  const { market, setMarket } = useMarket()

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowBanner(true)
    } else {
      // Load saved preferences and apply them
      const savedPrefs = JSON.parse(consent)
      setPreferences(savedPrefs)
      applyCookiePreferences(savedPrefs)
    }
  }, [])

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // This is where you would enable/disable tracking scripts
    if (prefs.analytics) {
      // Enable Google Analytics
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted'
        })
      }
    } else {
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'denied'
        })
      }
    }

    if (prefs.marketing) {
      // Enable Meta Pixel and other marketing cookies
      if (window.fbq) {
        window.fbq('consent', 'grant')
      }
    } else {
      if (window.fbq) {
        window.fbq('consent', 'revoke')
      }
    }
  }

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true
    }
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted))
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setPreferences(allAccepted)
    applyCookiePreferences(allAccepted)
    setShowBanner(false)
    setShowPreferences(false)
  }

  const rejectAll = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      marketing: false
    }
    localStorage.setItem('cookie-consent', JSON.stringify(onlyEssential))
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setPreferences(onlyEssential)
    applyCookiePreferences(onlyEssential)
    setShowBanner(false)
    setShowPreferences(false)
  }

  const savePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    applyCookiePreferences(preferences)
    setShowBanner(false)
    setShowPreferences(false)
  }

  if (!showBanner) return null

  return (
    <>
      {/* Main Cookie Banner */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-300 shadow-lg p-4 md:p-6",
        "transform transition-transform duration-300",
        showBanner ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-mono font-bold text-sm">WE VALUE YOUR PRIVACY</h3>
                <button
                  onClick={() => setShowRegionSelector(!showRegionSelector)}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-mono border border-gray-300 hover:border-gray-400 rounded transition-colors"
                >
                  <Globe className="h-3 w-3" />
                  {market.flag} {market.name}
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                We use cookies to enhance your shopping experience, analyze site traffic, and personalize content. 
                By clicking &quot;Accept All&quot;, you consent to our use of cookies. 
                <Link href="/privacy-policy" className="underline ml-1">Privacy Policy</Link>
                <span className="mx-1">·</span>
                <Link href="/cookie-policy" className="underline">Cookie Policy</Link>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreferences(!showPreferences)}
                className="font-mono text-xs min-h-[44px] sm:min-h-[36px]"
              >
                MANAGE PREFERENCES
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={rejectAll}
                className="font-mono text-xs min-h-[44px] sm:min-h-[36px]"
              >
                REJECT ALL
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={acceptAll}
                className="font-mono text-xs min-h-[44px] sm:min-h-[36px]"
              >
                ACCEPT ALL
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-[51] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-300 shadow-xl rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="font-mono font-bold text-lg mb-4">COOKIE PREFERENCES</h3>
              
              <div className="space-y-4">
                {/* Essential Cookies */}
                <div className="border border-gray-300 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-mono font-medium text-sm mb-1">Essential Cookies</h4>
                      <p className="text-xs text-gray-600">
                        Required for the website to function properly. These cannot be disabled.
                      </p>
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        checked={preferences.essential}
                        disabled
                        className="w-5 h-5 text-black border border-gray-400 rounded cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-gray-300 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-mono font-medium text-sm mb-1">Analytics Cookies</h4>
                      <p className="text-xs text-gray-600">
                        Help us understand how visitors interact with our website by collecting anonymous information.
                      </p>
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                        className="w-5 h-5 text-black border border-gray-400 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-gray-300 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-mono font-medium text-sm mb-1">Marketing Cookies</h4>
                      <p className="text-xs text-gray-600">
                        Used to deliver personalized advertisements and track campaign effectiveness.
                      </p>
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                        className="w-5 h-5 text-black border border-gray-400 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowPreferences(false)}
                  className="flex-1 font-mono text-xs"
                >
                  CANCEL
                </Button>
                <Button
                  variant="default"
                  onClick={savePreferences}
                  className="flex-1 font-mono text-xs"
                >
                  SAVE PREFERENCES
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Region Selector Dropdown */}
      {showRegionSelector && (
        <div className="fixed bottom-20 left-4 z-[52] bg-white border border-gray-300 shadow-lg rounded-lg p-2 min-w-[200px]">
          <div className="text-xs font-mono font-bold text-gray-600 px-2 py-1 mb-1">
            SELECT REGION
          </div>
          {SUPPORTED_MARKETS.map((marketOption) => (
            <button
              key={marketOption.id}
              onClick={() => {
                setMarket(marketOption)
                setShowRegionSelector(false)
              }}
              className={cn(
                "w-full text-left px-2 py-2 text-sm hover:bg-gray-100 rounded transition-colors flex items-center gap-2",
                market.id === marketOption.id && "bg-gray-100 font-medium"
              )}
            >
              <span>{marketOption.flag}</span>
              <span>{marketOption.name}</span>
              <span className="text-xs text-gray-500 ml-auto">{marketOption.currencyCode}</span>
            </button>
          ))}
        </div>
      )}
    </>
  )
}