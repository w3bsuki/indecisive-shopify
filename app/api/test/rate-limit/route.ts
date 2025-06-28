import { NextRequest, NextResponse } from 'next/server'

/**
 * Test endpoint to demonstrate rate limiting
 * This endpoint has a low rate limit for testing purposes
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Rate limiting test endpoint',
    timestamp: new Date().toISOString(),
    clientIP: request.ip || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    rateLimitInfo: {
      endpoint: '/api/test/rate-limit',
      limits: {
        window: '1 minute',
        maxRequests: 10,
        message: 'This endpoint is rate limited to 10 requests per minute for testing'
      }
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    return NextResponse.json({
      message: 'POST request successful',
      timestamp: new Date().toISOString(),
      receivedData: body,
      rateLimitInfo: {
        endpoint: '/api/test/rate-limit',
        method: 'POST',
        limits: {
          window: '1 minute',
          maxRequests: 10
        }
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Invalid JSON in request body',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    )
  }
}