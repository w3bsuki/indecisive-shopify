import { getProductsPaginated } from '@/lib/shopify/api-enhanced'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch all products without any filters to see what's available
    const { products } = await getProductsPaginated(1, 50, {})
    
    // Extract all unique tags from all products
    const allTags = new Set<string>()
    const productInfo = products.map(product => {
      const tags = product.tags || []
      tags.forEach(tag => allTags.add(tag))
      
      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        tags: tags
      }
    })
    
    return NextResponse.json({
      totalProducts: products.length,
      allTags: Array.from(allTags).sort(),
      products: productInfo
    })
  } catch (error) {
    console.error('Debug products error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}