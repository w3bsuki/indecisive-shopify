import { getProductsPaginated } from '@/lib/shopify/api-enhanced'
import { NextResponse } from 'next/server'
import { getSaleInfo } from '@/lib/utils/sale-pricing'

export async function GET() {
  try {
    // Fetch all products without any filters to see what's available
    const { products } = await getProductsPaginated(1, 50, {})
    
    // Check for products with compare-at prices or sale tags
    const productsWithPricing = products.map(product => {
      const saleInfo = getSaleInfo(product)
      
      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        tags: product.tags || [],
        currentPrice: saleInfo.currentPrice,
        originalPrice: saleInfo.originalPrice,
        isOnSale: saleInfo.isOnSale,
        discountPercentage: saleInfo.discountPercentage || 0,
        saleMethod: saleInfo.isOnSale ? (
          product.compareAtPriceRange?.maxVariantPrice ? 'compare-at-price' : 
          product.tags?.some(tag => tag.toLowerCase().match(/^(sale|discount|was)-/)) ? 'tag' :
          'generic-tag'
        ) : 'none'
      }
    })
    
    const saleProducts = productsWithPricing.filter(p => p.isOnSale)
    
    return NextResponse.json({
      totalProducts: products.length,
      totalSaleProducts: saleProducts.length,
      sampleProduct: productsWithPricing[0],
      saleProducts,
      allProducts: productsWithPricing
    })
  } catch (error) {
    console.error('Debug products error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}