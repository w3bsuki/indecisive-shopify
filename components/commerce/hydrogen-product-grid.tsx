'use client';

import { useState } from 'react';
import { 
  Image as ShopifyImage
} from '@shopify/hydrogen-react';
import type { Product } from '@/lib/shopify/storefront-client';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface ProductGridProps {
  products: Product[];
}

export function HydrogenProductGrid({ products }: ProductGridProps) {
  const { addItem, isLoading } = useCart();
  const [loadingVariant, setLoadingVariant] = useState<string | null>(null);

  const handleAddToCart = async (product: Product) => {
    const firstVariant = product.variants.edges[0]?.node;
    if (!firstVariant) return;

    setLoadingVariant(firstVariant.id);
    try {
      await addItem(firstVariant.id);
    } finally {
      setLoadingVariant(null);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => {
        const firstVariant = product.variants.edges[0]?.node;
        const isCurrentLoading = loadingVariant === firstVariant?.id;

        return (
          <div key={product.id} className="group">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg mb-3">
              <Link href={`/products/${product.handle}`}>
                {product.featuredImage ? (
                  <ShopifyImage
                    data={product.featuredImage}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No image
                  </div>
                )}
              </Link>
              
              {/* Quick Actions */}
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              
              {/* Quick Add */}
              {firstVariant && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    className="w-full bg-white text-black hover:bg-gray-100"
                    onClick={() => handleAddToCart(product)}
                    disabled={isLoading || isCurrentLoading || !firstVariant.availableForSale}
                  >
                    {isCurrentLoading ? (
                      'Adding...'
                    ) : !firstVariant.availableForSale ? (
                      'Out of Stock'
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Quick Add
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-medium text-sm mb-1 line-clamp-2">
                <Link href={`/products/${product.handle}`} className="hover:underline">
                  {product.title}
                </Link>
              </h3>
              <div className="flex items-center gap-2">
                <span className="font-bold">
                  {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}