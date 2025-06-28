import { fetchProducts, fetchCategories, transformMedusaProduct } from '@/lib/services/medusa-client'

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isNew?: boolean
  isBestSeller?: boolean
  rating: number
  reviews: number
}

export interface Category {
  name: string
  image: string
  count: string
}

// Fetch categories from Medusa or use fallback
export async function getCategories(): Promise<Category[]> {
  try {
    const { product_categories } = await fetchCategories()
    
    // Transform Medusa categories to our format
    return product_categories.map(cat => ({
      name: cat.name.toUpperCase(),
      image: `/placeholder.svg?height=240&width=200&text=${encodeURIComponent(cat.name)}`,
      count: '0 items' // This would need to be calculated separately
    }))
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    // Fallback data
    return [
      { name: "NEW ARRIVALS", image: "/placeholder.svg?height=240&width=200&text=New+Arrivals", count: "24 items" },
      { name: "ESSENTIALS", image: "/placeholder.svg?height=240&width=200&text=Essentials", count: "18 items" },
      { name: "STREETWEAR", image: "/placeholder.svg?height=240&width=200&text=Streetwear", count: "32 items" },
      { name: "OUTERWEAR", image: "/placeholder.svg?height=240&width=200&text=Outerwear", count: "12 items" },
      { name: "BOTTOMS", image: "/placeholder.svg?height=240&width=200&text=Bottoms", count: "16 items" },
      { name: "ACCESSORIES", image: "/placeholder.svg?height=240&width=200&text=Accessories", count: "8 items" },
    ]
  }
}

export async function getBestSellers(): Promise<Product[]> {
  try {
    const { products } = await fetchProducts({ limit: 6 })
    
    // Transform and filter for best sellers
    return products
      .map(transformMedusaProduct)
      .map(product => ({ ...product, isBestSeller: true }))
  } catch (error) {
    console.error('Failed to fetch best sellers:', error)
    // Fallback data
    return [
      {
        id: "1",
        name: "Essential White Tee",
        price: 45,
        originalPrice: 60,
        image: "/placeholder.svg?height=300&width=240",
        category: "Essentials",
        isNew: true,
        rating: 4.8,
        reviews: 124,
        isBestSeller: true,
      },
      {
        id: "2",
        name: "Shadow Bomber",
        price: 120,
        originalPrice: 150,
        image: "/placeholder.svg?height=300&width=240",
        category: "Outerwear",
        rating: 4.9,
        reviews: 67,
        isBestSeller: true,
      },
      {
        id: "3",
        name: "Street Cargo Pants",
        price: 95,
        image: "/placeholder.svg?height=300&width=240",
        category: "Bottoms",
        rating: 4.8,
        reviews: 142,
        isBestSeller: true,
      },
      {
        id: "4",
        name: "Clean Lines Hoodie",
        price: 85,
        image: "/placeholder.svg?height=300&width=240",
        category: "Essentials",
        rating: 4.9,
        reviews: 89,
        isBestSeller: true,
      },
      {
        id: "5",
        name: "Urban Oversized Tee",
        price: 50,
        image: "/placeholder.svg?height=300&width=240",
        category: "Streetwear",
        rating: 4.7,
        reviews: 198,
        isBestSeller: true,
      },
      {
        id: "6",
        name: "Night Rider Hoodie",
        price: 90,
        image: "/placeholder.svg?height=300&width=240",
        category: "Streetwear",
        rating: 4.8,
        reviews: 176,
        isBestSeller: true,
      },
    ]
  }
}

export async function getEssentialsProducts(): Promise<Product[]> {
  try {
    // In a real app, you'd filter by category or collection
    const { products } = await fetchProducts({ limit: 4, offset: 6 })
    
    return products.map(transformMedusaProduct)
  } catch (error) {
    console.error('Failed to fetch essentials:', error)
    // Fallback data
    return [
      {
        id: "7",
        name: "Pure Form Joggers",
        price: 65,
        image: "/placeholder.svg?height=300&width=240",
        category: "Bottoms",
        rating: 4.7,
        reviews: 156,
      },
      {
        id: "8",
        name: "Minimal Crew Neck",
        price: 55,
        image: "/placeholder.svg?height=300&width=240",
        category: "Essentials",
        rating: 4.6,
        reviews: 203,
      },
      {
        id: "9",
        name: "Essential Black Tee",
        price: 45,
        image: "/placeholder.svg?height=300&width=240",
        category: "Essentials",
        rating: 4.8,
        reviews: 189,
      },
      {
        id: "10",
        name: "Clean Cut Shorts",
        price: 38,
        image: "/placeholder.svg?height=300&width=240",
        category: "Bottoms",
        rating: 4.5,
        reviews: 92,
      },
    ]
  }
}

export async function getStreetwearProducts(): Promise<Product[]> {
  try {
    // In a real app, you'd filter by category or collection
    const { products } = await fetchProducts({ limit: 4, offset: 10 })
    
    return products.map(transformMedusaProduct)
  } catch (error) {
    console.error('Failed to fetch streetwear:', error)
    // Fallback data
    return [
      {
        id: "11",
        name: "Graphic Statement Tee",
        price: 48,
        image: "/placeholder.svg?height=300&width=240",
        category: "Streetwear",
        rating: 4.5,
        reviews: 87,
      },
      {
        id: "12",
        name: "Utility Vest",
        price: 110,
        image: "/placeholder.svg?height=300&width=240",
        category: "Outerwear",
        rating: 4.7,
        reviews: 94,
      },
      {
        id: "13",
        name: "Oversized Hoodie",
        price: 95,
        image: "/placeholder.svg?height=300&width=240",
        category: "Streetwear",
        rating: 4.6,
        reviews: 156,
      },
      {
        id: "14",
        name: "Wide Leg Pants",
        price: 88,
        image: "/placeholder.svg?height=300&width=240",
        category: "Bottoms",
        rating: 4.4,
        reviews: 73,
      },
    ]
  }
}