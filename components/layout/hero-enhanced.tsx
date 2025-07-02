"use client";

import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Marquee, MarqueeItem } from "@/components/ui/marquee";
import { getHeroSlides, type HeroSlide } from '@/lib/shopify/hero-products';
import { useMarket } from '@/hooks/use-market';
import { TrendingUp, Users } from 'lucide-react';

export function HeroEnhanced() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [slides, setSlides] = React.useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { formatPrice: _formatPrice } = useMarket();
  
  // Simple state for social proof
  const [customerCount, setCustomerCount] = React.useState(4876);
  
  // Increment customer count randomly
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCustomerCount(prev => prev + Math.floor(Math.random() * 3));
    }, 15000); // Every 15 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Fetch hero slides on component mount
  React.useEffect(() => {
    async function loadHeroSlides() {
      try {
        const heroSlides = await getHeroSlides(5);
        setSlides(heroSlides);
      } catch (_error) {
        setSlides([
          {
            id: 'fallback-1',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=1600&fit=crop',
            name: 'Premium Collection',
          },
          {
            id: 'fallback-2', 
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=1600&fit=crop',
            name: 'Urban Style',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    loadHeroSlides();
  }, []);

  // Auto-play functionality
  React.useEffect(() => {
    if (isLoading || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length, isLoading]);

  if (isLoading) {
    return (
      <section className="relative bg-secondary w-full flex items-center justify-center hero-section">
        <div className="text-center">
          <div className="w-8 h-8 border border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-mono text-sm tracking-wide">Loading...</p>
        </div>
      </section>
    );
  }

  const currentProduct = slides[currentSlide];
  const hasPrice = currentProduct?.price && currentProduct.price !== '$0.00';

  return (
    <section className="relative bg-background w-full hero-section">
      <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Subtle trust indicator - top left */}
        <div className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-sm border border-black/10 hidden md:flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="text-xs font-mono">{customerCount.toLocaleString()} customers</span>
        </div>
        
        {/* Subtle trending indicator - top right */}
        {currentProduct?.handle && (
          <div className="absolute top-4 right-4 z-30 bg-red-500 text-white px-3 py-2 rounded-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-mono font-bold">TRENDING</span>
          </div>
        )}

        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.name}
              fill
              className="object-contain object-center"
              sizes="100vw"
              priority={index < 2}
              style={{
                transform: 'scale(0.7)',
                objectPosition: 'center center'
              }}
            />
            
            {/* Content overlay */}
            <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
              <div className="text-center space-y-4 sm:space-y-6 px-4 relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-mono font-bold text-primary-foreground tracking-tight leading-tight drop-shadow-lg">
                  {slide.name.toUpperCase()}
                </h2>
                
                {/* Enhanced price display with "From" text */}
                {hasPrice && (
                  <div className="space-y-1">
                    <p className="text-xl sm:text-2xl font-mono text-primary-foreground/90 drop-shadow-md">
                      FROM {slide.price}
                    </p>
                    {/* Subtle free shipping indicator */}
                    <p className="text-sm font-mono text-primary-foreground/80">
                      FREE SHIPPING ON ORDERS OVER $100
                    </p>
                  </div>
                )}
                
                {/* CTA buttons with slight enhancement */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                  {slide.handle ? (
                    <>
                      <Link href={`/products/${slide.handle}`}>
                        <Button variant="white-sharp" size="lg" className="shadow-lg min-w-[200px]">
                          SHOP NOW
                        </Button>
                      </Link>
                      <Link href="/new">
                        <Button variant="outline" size="lg" className="shadow-lg border-white text-white hover:bg-white hover:text-black min-w-[200px]">
                          VIEW COLLECTION
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link href="/products">
                      <Button variant="white-sharp" size="lg" className="shadow-lg min-w-[200px]">
                        SHOP COLLECTION
                      </Button>
                    </Link>
                  )}
                </div>
                
                {/* Limited stock indicator - only for products with handle */}
                {slide.handle && index === 0 && (
                  <p className="text-sm font-mono text-primary-foreground/90 animate-pulse">
                    Limited stock available
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Progress indicator */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              className={`w-3 h-3 border border-primary-foreground transition-all duration-500 cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50 shadow-lg ${
                index === currentSlide ? 'bg-primary-foreground scale-125' : 'bg-transparent hover:bg-primary-foreground/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
        
        {/* Enhanced Marquee with offers */}
        <Marquee 
          className="absolute bottom-0 left-0 right-0 z-30 bg-primary text-primary-foreground border-t border-primary-foreground/20"
          speed="normal"
          pauseOnHover
        >
          {[...Array(6)].map((_, i) => (
            <span key={i} className="flex">
              <MarqueeItem className="text-primary-foreground">INDECISIVE WEAR</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">FREE SHIPPING OVER $100</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">30-DAY RETURNS</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">JOIN {customerCount.toLocaleString()}+ CUSTOMERS</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">@INDECISIVEWEAR</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">NEW ARRIVALS WEEKLY</MarqueeItem>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}