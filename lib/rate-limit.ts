import { NextRequest } from 'next/server'

// Rate limiting utilities and monitoring

export interface RateLimitInfo {
  key: string
  count: number
  limit: number
  windowMs: number
  resetTime: number
  blocked: boolean
  endpoint: string
}

export interface RateLimitStats {
  totalRequests: number
  blockedRequests: number
  uniqueIPs: number
  topEndpoints: Array<{ endpoint: string; requests: number }>
  recentBlocks: Array<{ key: string; endpoint: string; timestamp: number }>
}

// In-memory store for development (use Redis in production)
const rateLimitStore = new Map<string, { 
  count: number
  lastReset: number
  blocked: boolean
  endpoint: string
}>()

const rateLimitLogs: Array<{
  key: string
  endpoint: string
  timestamp: number
  action: 'request' | 'block' | 'reset'
}> = []

// Configuration for different endpoint types
export const RATE_LIMIT_CONFIGS = {
  DEFAULT: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    message: 'Too many requests. Please try again later.'
  },
  
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
    message: 'Too many authentication attempts. Please try again later.'
  },
  
  PAYMENT: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    blockDurationMs: 10 * 60 * 1000, // 10 minutes
    message: 'Payment request limit exceeded. Please wait before trying again.'
  },
  
  SEARCH: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    message: 'Search rate limit exceeded. Please slow down your requests.'
  },
  
  CONTACT: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    blockDurationMs: 24 * 60 * 60 * 1000, // 24 hours
    message: 'Contact form submission limit reached. Please try again tomorrow.'
  }
} as const

export type RateLimitConfigType = keyof typeof RATE_LIMIT_CONFIGS

/**
 * Get client identifier for rate limiting
 */
export function getClientId(request: NextRequest): string {
  // Try to get IP address from various headers
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             request.headers.get('cf-connecting-ip') || // Cloudflare
             request.headers.get('x-client-ip') ||
             'unknown'
  
  return ip
}

/**
 * Generate rate limit key
 */
export function generateRateLimitKey(
  clientId: string,
  endpoint: string,
  additionalKey?: string
): string {
  const baseKey = `${clientId}:${endpoint}`
  return additionalKey ? `${baseKey}:${additionalKey}` : baseKey
}

/**
 * Check if request should be rate limited
 */
export function shouldRateLimit(request: NextRequest): boolean {
  const pathname = new URL(request.url).pathname
  
  // Skip rate limiting for health checks from monitoring services
  if (pathname === '/api/health' && isMonitoringService(request)) {
    return false
  }
  
  // Skip for authenticated admin users (implement your own logic)
  if (isAdminUser(request)) {
    return false
  }
  
  return true
}

/**
 * Check if request is from a monitoring service
 */
function isMonitoringService(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''
  
  const monitoringAgents = [
    'uptimerobot',
    'pingdom',
    'statuspage',
    'newrelic',
    'datadog',
    'prometheus',
    'vercel-edge'
  ]
  
  return monitoringAgents.some(agent => userAgent.includes(agent))
}

/**
 * Check if user is authenticated admin (implement your own logic)
 */
function isAdminUser(request: NextRequest): boolean {
  // Implement your authentication check here
  // For example, check for admin JWT token
  const authHeader = request.headers.get('authorization')
  
  // This is a placeholder - implement your actual admin check
  return authHeader?.includes('admin-token') || false
}

/**
 * Get rate limit statistics
 */
export function getRateLimitStats(): RateLimitStats {
  const now = Date.now()
  const oneHour = 60 * 60 * 1000
  
  // Filter recent logs (last hour)
  const recentLogs = rateLimitLogs.filter(log => now - log.timestamp < oneHour)
  
  const totalRequests = recentLogs.filter(log => log.action === 'request').length
  const blockedRequests = recentLogs.filter(log => log.action === 'block').length
  
  // Count unique IPs
  const uniqueIPs = new Set(
    recentLogs.map(log => log.key.split(':')[0])
  ).size
  
  // Top endpoints by request count
  const endpointCounts = new Map<string, number>()
  recentLogs.forEach(log => {
    if (log.action === 'request') {
      endpointCounts.set(log.endpoint, (endpointCounts.get(log.endpoint) || 0) + 1)
    }
  })
  
  const topEndpoints = Array.from(endpointCounts.entries())
    .map(([endpoint, requests]) => ({ endpoint, requests }))
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 10)
  
  // Recent blocks
  const recentBlocks = recentLogs
    .filter(log => log.action === 'block')
    .slice(-20) // Last 20 blocks
    .map(({ key, endpoint, timestamp }) => ({ key, endpoint, timestamp }))
  
  return {
    totalRequests,
    blockedRequests,
    uniqueIPs,
    topEndpoints,
    recentBlocks
  }
}

/**
 * Get current rate limit info for a key
 */
export function getRateLimitInfo(key: string): RateLimitInfo | null {
  const data = rateLimitStore.get(key)
  if (!data) return null
  
  return {
    key,
    count: data.count,
    limit: 0, // This would need to be stored or calculated based on endpoint
    windowMs: 0, // This would need to be stored or calculated
    resetTime: data.lastReset,
    blocked: data.blocked,
    endpoint: data.endpoint
  }
}

/**
 * Clear rate limit for a specific key (admin function)
 */
export function clearRateLimit(key: string): boolean {
  return rateLimitStore.delete(key)
}

/**
 * Clear all rate limits (admin function)
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear()
  rateLimitLogs.length = 0
}

/**
 * Log rate limit event
 */
export function logRateLimitEvent(
  key: string,
  endpoint: string,
  action: 'request' | 'block' | 'reset'
): void {
  rateLimitLogs.push({
    key,
    endpoint,
    timestamp: Date.now(),
    action
  })
  
  // Keep only last 1000 logs to prevent memory leaks
  if (rateLimitLogs.length > 1000) {
    rateLimitLogs.splice(0, rateLimitLogs.length - 1000)
  }
}

/**
 * Create rate limit response headers
 */
export function createRateLimitHeaders(rateLimitResult: {
  limit: number
  remaining: number
  resetTime: number
  retryAfter?: number
}): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': rateLimitResult.limit.toString(),
    'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
    'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
  }
  
  if (rateLimitResult.retryAfter) {
    headers['Retry-After'] = rateLimitResult.retryAfter.toString()
  }
  
  return headers
}

/**
 * Enhanced rate limit error with detailed information
 */
export class RateLimitError extends Error {
  constructor(
    message: string,
    public readonly limit: number,
    public readonly resetTime: number,
    public readonly retryAfter?: number
  ) {
    super(message)
    this.name = 'RateLimitError'
  }
}

interface RateLimitDetails {
  allowed: boolean
  limit: number
  remaining: number
  resetTime: number
  retryAfter?: number
}

/**
 * Send rate limit alert (integrate with your monitoring service)
 */
export async function sendRateLimitAlert(
  key: string,
  endpoint: string,
  details: RateLimitDetails
): Promise<void> {
  // This is where you would integrate with your alerting system
  // For example: Slack, PagerDuty, email, etc.
  
  console.warn('Rate limit alert:', {
    key,
    endpoint,
    details,
    timestamp: new Date().toISOString()
  })
  
  // Example integration with external service:
  // await sendSlackNotification({
  //   text: `Rate limit exceeded for ${endpoint}`,
  //   details: { key, ...details }
  // })
}