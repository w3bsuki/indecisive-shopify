import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/shopify'

export async function GET() {
  try {
    // Fetch all products without filter
    const productsData = await getProducts(100)
    const products = productsData.edges.map(edge => edge.node)
    
    // Group products by tags
    const productsByTag: Record<string, any[]> = {}
    
    products.forEach(product => {
      // Group by tags
      product.tags?.forEach((tag: string) => {
        if (!productsByTag[tag]) {
          productsByTag[tag] = []
        }
        productsByTag[tag].push({
          id: product.id,
          title: product.title,
          tags: product.tags
        })
      })
    })
    
    // Find T-shirt related products
    const tshirtTags = ['tshirt', 't-shirt', 'tshirts', 't-shirts', 'tee', 'tees']
    const tshirtProducts = products.filter(product => 
      product.tags?.some((tag: string) => 
        tshirtTags.includes(tag.toLowerCase())
      )
    )
    
    // Find hat related products
    const hatTags = ['hat', 'hats', 'cap', 'caps', 'headwear']
    const hatProducts = products.filter(product => 
      product.tags?.some((tag: string) => 
        hatTags.includes(tag.toLowerCase())
      )
    )
    
    return NextResponse.json({
      totalProducts: products.length,
      tshirtProducts: {
        count: tshirtProducts.length,
        products: tshirtProducts.slice(0, 5).map(p => ({
          title: p.title,
          tags: p.tags
        }))
      },
      hatProducts: {
        count: hatProducts.length,
        products: hatProducts.slice(0, 5).map(p => ({
          title: p.title,
          tags: p.tags
        }))
      },
      allTags: Object.keys(productsByTag).sort(),
      sampleProducts: products.slice(0, 10).map(p => ({
        title: p.title,
        tags: p.tags
      }))
    })
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}