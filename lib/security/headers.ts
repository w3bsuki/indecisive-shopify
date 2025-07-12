import { NextResponse } from 'next/server'

/**
 * Security headers configuration
 * Following OWASP security best practices
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking attacks
  response.headers.set('X-Frame-Options', 'DENY')
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Restrict browser features and APIs
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(self), usb=(), magnetometer=(), accelerometer=()'
  )
  
  // Remove powered by header
  response.headers.delete('X-Powered-By')
  
  // DNS prefetch control
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  
  // Strict Transport Security (HSTS) - only in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }
  
  return response
}

/**
 * Content Security Policy configuration
 * Strict policy for production, relaxed for development
 */
export function getCSPHeader(): string {
  const isDev = process.env.NODE_ENV === 'development'
  
  // Define allowed sources
  const defaultSrc = ["'self'"]
  const scriptSrc = [
    "'self'",
    "'unsafe-eval'", // Required for Next.js
    "'unsafe-inline'", // Required for Next.js inline scripts in production
    'https://cdn.shopify.com',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://fonts.googleapis.com', // For Google Fonts
    'https://vercel.live', // Vercel Live feedback
    'https://*.vercel.app', // Vercel deployment scripts
    'https://vitals.vercel-insights.com', // Vercel Analytics
    process.env.NEXT_PUBLIC_SENTRY_DSN && 'https://*.sentry.io',
  ].filter(Boolean)
  
  const styleSrc = [
    "'self'",
    "'unsafe-inline'", // Required for styled-jsx and inline styles
    'https://fonts.googleapis.com', // Google Fonts stylesheets
    'https://rsms.me', // Inter font
  ]
  
  const imgSrc = [
    "'self'",
    'data:',
    'blob:',
    'https:',
  ]
  
  const fontSrc = [
    "'self'",
    'data:',
    'https://fonts.gstatic.com', // Google Fonts
  ]
  
  const connectSrc = [
    "'self'",
    'https://*.myshopify.com',
    'https://cdn.shopify.com',
    'https://www.google-analytics.com',
    'https://vitals.vercel-insights.com',
    process.env.NEXT_PUBLIC_SENTRY_DSN && 'https://*.sentry.io',
    isDev && 'ws://localhost:*',
    isDev && 'wss://localhost:*',
  ].filter(Boolean)
  
  const frameSrc = [
    "'self'",
    'https://*.myshopify.com',
    'https://checkout.shopify.com',
    'https://checkout.shopifyplus.com',
    'https://cdn.shopify.com',
    'https://vercel.live', // Vercel Live feedback
  ]
  const objectSrc = ["'none'"]
  const mediaSrc = ["'self'"]
  const workerSrc = ["'self'", 'blob:']
  
  // Build CSP string
  const csp = [
    `default-src ${defaultSrc.join(' ')}`,
    `script-src ${scriptSrc.join(' ')}`,
    `style-src ${styleSrc.join(' ')}`,
    `img-src ${imgSrc.join(' ')}`,
    `font-src ${fontSrc.join(' ')}`,
    `connect-src ${connectSrc.join(' ')}`,
    `frame-src ${frameSrc.join(' ')}`,
    `object-src ${objectSrc.join(' ')}`,
    `media-src ${mediaSrc.join(' ')}`,
    `worker-src ${workerSrc.join(' ')}`,
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    // Only upgrade insecure requests in production
    ...(!isDev ? ["upgrade-insecure-requests"] : []),
  ].join('; ')
  
  return csp
}

/**
 * CORS configuration for API routes
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}