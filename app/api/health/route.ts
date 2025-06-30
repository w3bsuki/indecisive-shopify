import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN',
      'NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN'
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

    // Check if we can reach Shopify
    let shopifyStatus = 'unknown'
    try {
      const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
      const response = await fetch(`https://${domain}/api/2025-04/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
        },
        body: JSON.stringify({
          query: `{ shop { name } }`
        }),
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000)
      })
      
      shopifyStatus = response.ok ? 'healthy' : 'unhealthy'
    } catch (_error) {
      shopifyStatus = 'unreachable'
    }

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      shopify: {
        domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
        status: shopifyStatus
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