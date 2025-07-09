'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Cookie, X, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    // Check if user has already made a cookie choice
    const cookieConsent = localStorage.getItem('cookie-consent')
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = () => {
    const preferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    setShowBanner(false)
    // You can trigger analytics initialization here
  }

  const acceptSelected = () => {
    const preferences = {
      ...cookiePreferences,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    setShowBanner(false)
    setShowSettings(false)
  }

  const rejectAll = () => {
    const preferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity",
          showSettings ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setShowSettings(false)}
      />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-slide-up">
        <Card className="max-w-4xl mx-auto border border-gray-300 shadow-xl bg-white/95 backdrop-blur">
          <div className="p-4 sm:p-6">
            {!showSettings ? (
              <>
                {/* Main Banner */}
                <div className="flex items-start gap-4">
                  <Cookie className="h-6 w-6 text-gray-600 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold font-mono mb-2">
                        Cookie Preferences
                      </h3>
                      <p className="text-sm text-gray-600">
                        We use cookies to enhance your shopping experience, analyze site traffic, and personalize content. 
                        By clicking "Accept All", you consent to our use of cookies.
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={acceptAll}
                        className="font-mono"
                        size="sm"
                      >
                        Accept All
                      </Button>
                      <Button
                        onClick={rejectAll}
                        variant="outline"
                        className="font-mono"
                        size="sm"
                      >
                        Reject All
                      </Button>
                      <Button
                        onClick={() => setShowSettings(true)}
                        variant="ghost"
                        className="font-mono"
                        size="sm"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Cookie Settings
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Read more about cookies in our{' '}
                      <Link href="/cookie-policy" className="underline hover:text-gray-700">
                        Cookie Policy
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy-policy" className="underline hover:text-gray-700">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setShowBanner(false)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    aria-label="Close cookie banner"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Cookie Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold font-mono">
                      Cookie Settings
                    </h3>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      aria-label="Close settings"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Necessary Cookies */}
                    <label className="flex items-start gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-not-allowed opacity-75">
                      <input
                        type="checkbox"
                        checked={cookiePreferences.necessary}
                        disabled
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">Necessary Cookies</div>
                        <p className="text-xs text-gray-600 mt-1">
                          Required for the website to function properly. Cannot be disabled.
                        </p>
                      </div>
                    </label>
                    
                    {/* Analytics Cookies */}
                    <label className="flex items-start gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cookiePreferences.analytics}
                        onChange={(e) => setCookiePreferences({
                          ...cookiePreferences,
                          analytics: e.target.checked
                        })}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">Analytics Cookies</div>
                        <p className="text-xs text-gray-600 mt-1">
                          Help us understand how visitors interact with our website.
                        </p>
                      </div>
                    </label>
                    
                    {/* Marketing Cookies */}
                    <label className="flex items-start gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cookiePreferences.marketing}
                        onChange={(e) => setCookiePreferences({
                          ...cookiePreferences,
                          marketing: e.target.checked
                        })}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">Marketing Cookies</div>
                        <p className="text-xs text-gray-600 mt-1">
                          Used to show you relevant ads and measure campaign effectiveness.
                        </p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={acceptSelected}
                      className="font-mono"
                      size="sm"
                    >
                      Save Preferences
                    </Button>
                    <Button
                      onClick={() => setShowSettings(false)}
                      variant="outline"
                      className="font-mono"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </>
  )
}