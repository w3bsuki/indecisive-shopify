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
    
    // Find T-shirt related products (now includes crop tops as updated in tshirts page)
    const tshirtTags = ['tshirt', 't-shirt', 'tshirts', 't-shirts', 'tee', 'tees', 'crop top', 'crop-top', 'croptop']
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
    
    // Find crop top related products
    const cropTopTags = ['crop top', 'crop-top', 'croptop', 'crop tops', 'crop-tops', 'croptops']
    const cropTopProducts = products.filter(product => 
      product.tags?.some((tag: string) => 
        cropTopTags.includes(tag.toLowerCase())
      )
    )
    
    // Find products that could be t-shirts (including crop tops)
    const potentialTshirtTags = [...tshirtTags, ...cropTopTags]
    const potentialTshirtProducts = products.filter(product => 
      product.tags?.some((tag: string) => 
        potentialTshirtTags.includes(tag.toLowerCase())
      )
    )
    
    return NextResponse.json({
      totalProducts: products.length,
      tshirtProducts: {
        count: tshirtProducts.length,
        products: tshirtProducts.map(p => ({
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
      cropTopProducts: {
        count: cropTopProducts.length,
        products: cropTopProducts.map(p => ({
          title: p.title,
          tags: p.tags
        }))
      },
      potentialTshirtProducts: {
        count: potentialTshirtProducts.length,
        products: potentialTshirtProducts.map(p => ({
          title: p.title,
          tags: p.tags
        }))
      },
      allTags: Object.keys(productsByTag).sort(),
      tagBreakdown: Object.entries(productsByTag).map(([tag, products]) => ({
        tag,
        count: products.length,
        products: products.slice(0, 3).map(p => p.title)
      })),
      allProducts: products.map(p => ({
        title: p.title,
        tags: p.tags,
        handle: p.handle
      }))
    })
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}