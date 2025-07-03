import { NextRequest, NextResponse } from 'next/server'
import { getCustomerToken } from '@/lib/auth/token'

export async function GET(_request: NextRequest) {
  try {
    const token = await getCustomerToken()
    
    return NextResponse.json({ 
      success: true,
      token: token || null
    })
  } catch (_error) {
    return NextResponse.json({ 
      success: false,
      token: null 
    }, { status: 500 })
  }
}