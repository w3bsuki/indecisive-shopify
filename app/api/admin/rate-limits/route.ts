import { NextRequest, NextResponse } from 'next/server'
import { 
  getRateLimitStats, 
  clearRateLimit, 
  clearAllRateLimits,
  getRateLimitInfo 
} from '@/lib/rate-limit'

// Simple admin authentication (replace with your actual auth system)
function isAdminAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const adminToken = process.env.ADMIN_TOKEN || 'admin-secret-token'
  
  return authHeader === `Bearer ${adminToken}`
}

/**
 * GET /api/admin/rate-limits
 * Get rate limiting statistics and current limits
 */
export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const stats = getRateLimitStats()
    
    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to get rate limit stats',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/rate-limits
 * Manage rate limits (clear specific key or all)
 */
export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { action, key } = body

    switch (action) {
      case 'clear':
        if (key) {
          const cleared = clearRateLimit(key)
          return NextResponse.json({
            success: true,
            message: cleared ? `Rate limit cleared for key: ${key}` : `No rate limit found for key: ${key}`
          })
        } else {
          return NextResponse.json(
            { error: 'Key is required for clear action' },
            { status: 400 }
          )
        }

      case 'clear-all':
        clearAllRateLimits()
        return NextResponse.json({
          success: true,
          message: 'All rate limits cleared'
        })

      case 'get-info':
        if (key) {
          const info = getRateLimitInfo(key)
          return NextResponse.json({
            success: true,
            info
          })
        } else {
          return NextResponse.json(
            { error: 'Key is required for get-info action' },
            { status: 400 }
          )
        }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: clear, clear-all, get-info' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to process rate limit action',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/rate-limits
 * Clear all rate limits
 */
export async function DELETE(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    clearAllRateLimits()
    
    return NextResponse.json({
      success: true,
      message: 'All rate limits cleared',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to clear rate limits',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}