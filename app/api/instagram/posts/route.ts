import { NextRequest, NextResponse } from 'next/server'
import { instagramClient } from '@/lib/instagram/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '12')
    
    // Validate limit
    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 50' },
        { status: 400 }
      )
    }

    const posts = await instagramClient.getPosts(limit)
    
    return NextResponse.json({
      posts,
      count: posts.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Instagram API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch Instagram posts',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}