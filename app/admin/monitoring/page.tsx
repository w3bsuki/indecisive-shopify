import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getRateLimitStats } from '@/lib/rate-limit'
import { ArrowLeft, AlertCircle, CheckCircle, Clock, Shield } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Monitoring Dashboard - Admin - Indecisive Wear',
  description: 'System monitoring and health status',
}

export default async function MonitoringPage() {
  // Get rate limit stats
  const rateLimitStats = getRateLimitStats()
  
  // Check monitoring services status
  const sentryConfigured = !!(process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN)
  const analyticsConfigured = !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const shopifyConfigured = !!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/account">
          <Button variant="outline" size="sm" className="font-mono border-2 border-black mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account
          </Button>
        </Link>
        
        <h1 className="text-4xl font-bold font-mono">MONITORING DASHBOARD</h1>
        <p className="text-gray-600 mt-2">System health and monitoring status</p>
      </div>

      {/* Service Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-2 border-black">
          <CardHeader className="pb-3">
            <CardTitle className="font-mono text-lg flex items-center gap-2">
              {shopifyConfigured ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-red-600" />}
              Shopify API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={shopifyConfigured ? "default" : "destructive"} className="font-mono">
              {shopifyConfigured ? 'Connected' : 'Not Configured'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-2 border-black">
          <CardHeader className="pb-3">
            <CardTitle className="font-mono text-lg flex items-center gap-2">
              {sentryConfigured ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Clock className="h-5 w-5 text-yellow-600" />}
              Error Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={sentryConfigured ? "default" : "secondary"} className="font-mono">
              {sentryConfigured ? 'Active' : 'Not Configured'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-2 border-black">
          <CardHeader className="pb-3">
            <CardTitle className="font-mono text-lg flex items-center gap-2">
              {analyticsConfigured ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Clock className="h-5 w-5 text-yellow-600" />}
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={analyticsConfigured ? "default" : "secondary"} className="font-mono">
              {analyticsConfigured ? 'Active' : 'Not Configured'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-2 border-black">
          <CardHeader className="pb-3">
            <CardTitle className="font-mono text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Rate Limiting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="default" className="font-mono">Active</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Rate Limit Stats */}
      <Card className="border-2 border-black mb-8">
        <CardHeader>
          <CardTitle className="font-mono">Rate Limit Statistics</CardTitle>
          <CardDescription>Current rate limiting status across endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {rateLimitStats.topEndpoints.map(({ endpoint, requests }) => (
              <div key={endpoint} className="border-2 border-gray-200 p-4">
                <h4 className="font-mono font-medium mb-2">{endpoint}</h4>
                <div className="space-y-1 text-sm">
                  <p>Requests: {requests}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-sm text-gray-600">Total Requests (Last Hour)</p>
                <p className="text-2xl font-bold font-mono">{rateLimitStats.totalRequests}</p>
              </div>
              <div>
                <p className="font-mono text-sm text-gray-600">Blocked Requests (Last Hour)</p>
                <p className="text-2xl font-bold font-mono">{rateLimitStats.blockedRequests}</p>
              </div>
              <div>
                <p className="font-mono text-sm text-gray-600">Unique IPs</p>
                <p className="text-2xl font-bold font-mono">{rateLimitStats.uniqueIPs}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Guide */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="font-mono">Configuration Guide</CardTitle>
          <CardDescription>Set up monitoring services for production</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!sentryConfigured && (
            <div>
              <h4 className="font-mono font-medium mb-2">1. Configure Sentry Error Tracking</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>Sign up at <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="underline">sentry.io</a></li>
                <li>Create a new Next.js project</li>
                <li>Copy your DSN from Project Settings → Client Keys</li>
                <li>Add to your .env.local:
                  <pre className="mt-2 p-2 bg-gray-100 text-xs font-mono">
{`NEXT_PUBLIC_SENTRY_DSN=your-dsn-here
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=your-auth-token`}
                  </pre>
                </li>
              </ol>
            </div>
          )}
          
          {!analyticsConfigured && (
            <div>
              <h4 className="font-mono font-medium mb-2">2. Configure Google Analytics</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>Go to <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Analytics</a></li>
                <li>Create a new GA4 property</li>
                <li>Get your Measurement ID (G-XXXXXXXXXX)</li>
                <li>Add to your .env.local:
                  <pre className="mt-2 p-2 bg-gray-100 text-xs font-mono">
{`NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`}
                  </pre>
                </li>
              </ol>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> After adding environment variables, restart your development server for changes to take effect.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}