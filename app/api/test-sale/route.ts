import { NextResponse } from 'next/server'
import { getSaleInfo } from '@/lib/utils/sale-pricing'

export async function GET() {
  // Test our sale pricing logic with mock products
  const testProducts = [
    {
      id: 'test-1',
      title: 'Test Product - Sale Tag',
      priceRange: { minVariantPrice: { amount: '20.00', currencyCode: 'BGN' } },
      compareAtPriceRange: null,
      tags: ['sale-33'] // 33% off
    },
    {
      id: 'test-2', 
      title: 'Test Product - Was Tag',
      priceRange: { minVariantPrice: { amount: '20.00', currencyCode: 'BGN' } },
      compareAtPriceRange: null,
      tags: ['was-30'] // Was 30, now 20
    },
    {
      id: 'test-3',
      title: 'Test Product - Regular',
      priceRange: { minVariantPrice: { amount: '25.00', currencyCode: 'BGN' } },
      compareAtPriceRange: null,
      tags: ['regular']
    },
    {
      id: 'test-4',
      title: 'Test Product - Generic Sale',
      priceRange: { minVariantPrice: { amount: '18.00', currencyCode: 'BGN' } },
      compareAtPriceRange: null,
      tags: ['sale'] // Generic sale tag
    }
  ]

  const results = testProducts.map(product => ({
    title: product.title,
    tags: product.tags,
    saleInfo: getSaleInfo(product as any)
  }))

  return NextResponse.json({
    message: 'Sale pricing test results',
    results
  })
}