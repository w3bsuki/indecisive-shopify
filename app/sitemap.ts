import { MetadataRoute } from 'next'
import { getProducts, getCollections } from '@/lib/shopify'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indecisivewear.com'
  
  // Fetch all products and collections
  const [productsData, collectionsData] = await Promise.all([
    getProducts(100),
    getCollections(50)
  ])
  
  const products = productsData.edges.map(({ node }) => ({
    url: `${baseUrl}/products/${node.handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }))
  
  const collections = collectionsData.edges.map(({ node }) => ({
    url: `${baseUrl}/collections/${node.handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }))
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5
    }
  ]
  
  return [...staticPages, ...products, ...collections]
}