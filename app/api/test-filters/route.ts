import { getProductsPaginated } from '@/lib/shopify/api-enhanced'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const rawCategory = searchParams.get('category') || 'all'
  const category = ['tees', 'tshirts', 'tees-1'].includes(rawCategory) ? 'tshirts' : rawCategory
  
  try {
    console.log('Testing category:', category)
    
    // Test the exact same logic as the main products page
    const filters = {
      ...(category === 'crop-tops' && {
        tags: ['crop top']
      }),
      ...(category === 'tshirts' && {
        tags: ['tee']
      })
    }
    
    console.log('Filters applied:', filters)
    
    const { products, totalCount } = await getProductsPaginated(1, 20, filters)
    
    const productInfo = products.map(product => ({
      title: product.title,
      tags: product.tags,
      handle: product.handle
    }))
    
    return NextResponse.json({
      category,
      filters,
      totalCount,
      productCount: products.length,
      products: productInfo
    })
  } catch (error) {
    console.error('Filter test error:', error)
    return NextResponse.json({ 
      error: 'Failed to test filters',
      category,
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
