import { getProducts, formatPrice } from './api';
import type { Product } from './storefront-client';

export interface HeroSlide {
  id: string;
  image: string;
  name: string;
  handle?: string;
  price?: string;
}

// Fallback fashion images that match the store's streetwear aesthetic
const FALLBACK_HERO_IMAGES: HeroSlide[] = [
  {
    id: 'hero-1',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=1600&fit=crop&crop=center',
    name: 'Streetwear Collection',
  },
  {
    id: 'hero-2', 
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=1200&h=1600&fit=crop&crop=center',
    name: 'Statement Pieces',
  },
  {
    id: 'hero-3',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=1200&h=1600&fit=crop&crop=center', 
    name: 'Bold Graphics',
  },
  {
    id: 'hero-4',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&h=1600&fit=crop&crop=center',
    name: 'Urban Essentials',
  },
  {
    id: 'hero-5',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=1600&fit=crop&crop=center',
    name: 'Attitude Wear',
  },
];

/**
 * Get hero carousel slides from Shopify products with fallback to curated images
 * @param maxSlides Maximum number of slides to return
 * @returns Promise<HeroSlide[]>
 */
export async function getHeroSlides(maxSlides: number = 5): Promise<HeroSlide[]> {
  try {
    // Try to fetch products from Shopify
    const productsData = await getProducts(maxSlides);
    const products = productsData.edges.map(edge => edge.node);
    
    // Filter products that have featured images
    const productsWithImages = products.filter(
      (product: Product) => product.featuredImage?.url
    );
    
    if (productsWithImages.length >= 3) {
      // We have enough products with images, use them
      console.log(`Using ${productsWithImages.length} product images for hero carousel`);
      
      return productsWithImages.slice(0, maxSlides).map((product: Product) => ({
        id: product.id,
        image: product.featuredImage!.url,
        name: product.title,
        handle: product.handle,
        price: product.priceRange?.minVariantPrice?.amount 
          ? formatPrice(
              product.priceRange.minVariantPrice.amount,
              product.priceRange.minVariantPrice.currencyCode
            )
          : undefined,
      }));
    } else {
      // Not enough product images available, use fallbacks
      console.log('Not enough product images available, using fallback images for hero carousel');
      return FALLBACK_HERO_IMAGES.slice(0, maxSlides);
    }
    
  } catch (error) {
    console.error('Failed to fetch products for hero carousel:', error);
    console.log('Using fallback images for hero carousel');
    return FALLBACK_HERO_IMAGES.slice(0, maxSlides);
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
    
  } catch (error) {
    console.error('Failed to fetch product images:', error);
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