import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_MEDUSA_BACKEND_URL',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
    ]

    const missingEnvVars = requiredEnvVars.filter(
      envVar => !process.env[envVar]
    )

    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing required environment variables',
          missing: missingEnvVars,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }

    // Check if we can reach the Medusa backend
    let backendStatus = 'unknown'
    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
      const response = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000)
      })
      
      backendStatus = response.ok ? 'healthy' : 'unhealthy'
    } catch (error) {
      backendStatus = 'unreachable'
    }

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      backend: {
        url: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
        status: backendStatus
      },
      build: {
        timestamp: process.env.VERCEL_GIT_COMMIT_DATE || 'unknown',
        commit: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || 'unknown',
        branch: process.env.VERCEL_GIT_COMMIT_REF || 'unknown'
      }
    }

    return NextResponse.json(healthData, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Health-Check': 'true'
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}