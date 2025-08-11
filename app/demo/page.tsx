import { getProducts } from '@/lib/shopify'
import Link from 'next/link'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'

export default async function DemoPage() {
  try {
    const productsData = await getProducts(4)
    const products = productsData.edges.map(edge => edge.node)

    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        
        <section className="py-20 text-center">
          <h1 className="text-4xl font-light mb-4">Demo Page</h1>
          <p className="text-gray-600 mb-8">Testing the demo route</p>
          
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl mb-4">Products loaded: {products.length}</h2>
            
            <Link 
              href="/products" 
              className="inline-block px-6 py-3 bg-black text-white hover:bg-gray-800"
            >
              View All Products
            </Link>
          </div>
        </section>
        
        <Footer />
      </div>
    )
  } catch (error) {
    console.error('Demo page error:', error)
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-light mb-4">Error in Demo Page</h1>
            <p className="text-gray-600">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}