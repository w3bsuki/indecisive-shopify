import { NextRequest, NextResponse } from 'next/server'
import { getCurrentCustomer } from '@/app/actions/auth'

export async function GET(_request: NextRequest) {
  try {
    const customer = await getCurrentCustomer()
    
    return NextResponse.json({ 
      authenticated: !!customer,
      customer: customer ? {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName
      } : null
    })
  } catch (_error) {
    // If there's an error checking auth, assume not authenticated
    return NextResponse.json({ 
      authenticated: false, 
      customer: null 
    })
  }
}