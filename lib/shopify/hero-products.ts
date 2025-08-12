import { getProducts, formatPrice, getCollections } from './api';
import type { Product } from './storefront-client';

export interface HeroSlide {
  id: string;
  image: string;
  name: string;
  handle?: string;
  price?: string;
}

// Custom product names for hero rotation
const _CUSTOM_HERO_NAMES = [
  'ХУЛИГАНКА',
  'DADDY ISSUES',
  'DO NOT DISTURB',
  'DADDY CHILL',
  'BITE ME',
];

// Fallback fashion images that match the store's streetwear aesthetic
const FALLBACK_HERO_IMAGES: HeroSlide[] = [
  {
    id: 'hero-1',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=1600&fit=crop&crop=center',
    name: 'ХУЛИГАНКА',
  },
  {
    id: 'hero-2', 
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=1200&h=1600&fit=crop&crop=center',
    name: 'DADDY ISSUES',
  },
  {
    id: 'hero-3',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=1200&h=1600&fit=crop&crop=center', 
    name: 'DO NOT DISTURB',
  },
  {
    id: 'hero-4',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&h=1600&fit=crop&crop=center',
    name: 'DADDY CHILL',
  },
  {
    id: 'hero-5',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=1600&fit=crop&crop=center',
    name: 'BITE ME',
  },
];

/**
 * Get hero carousel slides from Shopify collections
 * @param maxSlides Maximum number of slides to return
 * @returns Promise<HeroSlide[]>
 */
export async function getHeroSlides(maxSlides: number = 3): Promise<HeroSlide[]> {
  try {
    // Fetch collections from Shopify
    const collectionsData = await getCollections();
    const collections = collectionsData.edges.map(edge => edge.node);
    
    // Define the collections we want to show in order
    const targetCollections = ['hats', 'tshirts', 'bags', 'accessories', 'bottoms'];
    
    // Find matching collections
    const heroSlides: HeroSlide[] = [];
    
    for (const targetHandle of targetCollections) {
      const collection = collections.find(c => 
        c.handle.toLowerCase() === targetHandle || 
        c.handle.toLowerCase().includes(targetHandle)
      );
      
      if (collection && collection.image?.url) {
        heroSlides.push({
          id: collection.id,
          image: collection.image.url,
          name: collection.title.toUpperCase(),
          handle: `/collections/${collection.handle}`,
        });
      }
    }
    
    // If we have at least 3 collections, use them
    if (heroSlides.length >= 3) {
      return heroSlides.slice(0, maxSlides);
    }
    
    // Otherwise, use fallback with better names
    return [
      {
        id: 'hero-hats',
        image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=1200&h=1600&fit=crop&crop=center',
        name: 'HATS',
        handle: '/hats',
      },
      {
        id: 'hero-tshirts', 
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=1600&fit=crop&crop=center',
        name: 'T-SHIRTS',
        handle: '/tshirts',
      },
      {
        id: 'hero-bags',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&h=1600&fit=crop&crop=center',
        name: 'BAGS',
        handle: '/accessories',
      },
    ];
    
  } catch (_error) {
    // Failed to fetch collections, using fallback images
    return [
      {
        id: 'hero-hats',
        image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=1200&h=1600&fit=crop&crop=center',
        name: 'HATS',
        handle: '/hats',
      },
      {
        id: 'hero-tshirts', 
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=1600&fit=crop&crop=center',
        name: 'T-SHIRTS',
        handle: '/tshirts',
      },
      {
        id: 'hero-bags',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&h=1600&fit=crop&crop=center',
        name: 'BAGS',
        handle: '/accessories',
      },
    ];
  }
}

/**
 * Get featured product images from first 10 products  
 * @returns Promise<string[]> Array of image URLs
 */
export async function getFeaturedProductImages(): Promise<string[]> {
  try {
    const productsData = await getProducts(10);
    const products = productsData.edges.map(edge => edge.node);
    
    const imageUrls: string[] = [];
    
    products.forEach((product: Product) => {
      // Add featured image
      if (product.featuredImage?.url) {
        imageUrls.push(product.featuredImage.url);
      }
      
      // Add additional product images (up to 2 per product)
      if (product.images?.edges) {
        product.images.edges.slice(0, 2).forEach(imageEdge => {
          if (imageEdge.node.url && !imageUrls.includes(imageEdge.node.url)) {
            imageUrls.push(imageEdge.node.url);
          }
        });
      }
    });
    
    return imageUrls.slice(0, 20); // Return up to 20 unique images
    
  } catch (_error) {
    // Failed to fetch product images
    return [];
  }
}

/**
 * Check if we have access to Shopify data
 */
export function hasShopifyAccess(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN &&
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
  );
}