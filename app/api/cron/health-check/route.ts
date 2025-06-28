import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request from Vercel
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Perform health checks
    const healthChecks = []

    // Check application health
    try {
      const appHealthResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/health`,
        { 
          method: 'GET',
          signal: AbortSignal.timeout(10000) // 10 second timeout
        }
      )
      
      healthChecks.push({
        service: 'frontend',
        status: appHealthResponse.ok ? 'healthy' : 'unhealthy',
        responseTime: performance.now(),
        statusCode: appHealthResponse.status
      })
    } catch (error) {
      healthChecks.push({
        service: 'frontend',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Check Medusa backend health
    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
      if (backendUrl) {
        const backendHealthResponse = await fetch(`${backendUrl}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(10000)
        })
        
        healthChecks.push({
          service: 'medusa_backend',
          status: backendHealthResponse.ok ? 'healthy' : 'unhealthy',
          responseTime: performance.now(),
          statusCode: backendHealthResponse.status
        })
      }
    } catch (error) {
      healthChecks.push({
        service: 'medusa_backend',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Send alerts if critical services are down
    const criticalServices = healthChecks.filter(
      check => check.service === 'frontend' || check.service === 'medusa_backend'
    )
    
    const unhealthyServices = criticalServices.filter(
      check => check.status !== 'healthy'
    )

    if (unhealthyServices.length > 0) {
      // In a real application, you would send alerts here
      // For example, to Slack, PagerDuty, or email
      console.error('Critical services are down:', unhealthyServices)
      
      // Could integrate with external monitoring services:
      // await sendSlackAlert(unhealthyServices)
      // await sendPagerDutyAlert(unhealthyServices)
    }

    const overallStatus = unhealthyServices.length === 0 ? 'healthy' : 'degraded'

    return NextResponse.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: healthChecks,
      summary: {
        total: healthChecks.length,
        healthy: healthChecks.filter(c => c.status === 'healthy').length,
        unhealthy: healthChecks.filter(c => c.status !== 'healthy').length
      }
    })
  } catch (error) {
    console.error('Health check cron failed:', error)
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Cron health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Prevent this endpoint from being cached
export const revalidate = 0