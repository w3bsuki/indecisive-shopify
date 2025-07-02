import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Logout - Clear session cookies
export async function POST(_request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    // Clear the customer token cookie
    cookieStore.delete('customer-token')
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { message: 'An error occurred during logout' },
      { status: 500 }
    )
  }
}

// GET request for logout (alternative method)
export async function GET(request: NextRequest) {
  return POST(request)
}