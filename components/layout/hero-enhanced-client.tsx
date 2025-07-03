"use client";

import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Marquee, MarqueeItem } from "@/components/ui/marquee";
import type { HeroSlide } from '@/lib/shopify/hero-products';
import { TrendingUp, Users } from 'lucide-react';

interface HeroEnhancedClientProps {
  slides: HeroSlide[];
  translations: {
    customers: string;
    trending: string;
    from: string;
    freeShipping: string;
    shopNow: string;
    viewCollection: string;
    shopCollection: string;
    limitedStock: string;
    marquee: {
      freeShipping: string;
      returns: string;
      joinCustomers: string;
      newArrivals: string;
    };
    brand: {
      name: string;
      socialHandle: string;
    };
  };
}

export function HeroEnhancedClient({ slides, translations }: HeroEnhancedClientProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [customerCount, setCustomerCount] = React.useState(4876);
  
  // Increment customer count randomly
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCustomerCount(prev => prev + Math.floor(Math.random() * 3));
    }, 15000); // Every 15 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Auto-play functionality
  React.useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const currentProduct = slides[currentSlide];
  const hasPrice = currentProduct?.price && currentProduct.price !== '$0.00';

  return (
    <section className="relative bg-background w-full hero-section">
      <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Subtle trust indicator - top left */}
        <div className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-sm border border-black/10 hidden md:flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="text-xs font-mono">{customerCount.toLocaleString()} {translations.customers}</span>
        </div>
        
        {/* Subtle trending indicator - top right */}
        {currentProduct?.handle && (
          <div className="absolute top-4 right-4 z-30 bg-red-500 text-white px-3 py-2 rounded-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-mono font-bold">{translations.trending}</span>
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
                      {translations.from} {slide.price}
                    </p>
                    {/* Subtle free shipping indicator */}
                    <p className="text-sm font-mono text-primary-foreground/80">
                      {translations.freeShipping}
                    </p>
                  </div>
                )}
                
                {/* CTA buttons with slight enhancement */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                  {slide.handle ? (
                    <>
                      <Link href={`/products/${slide.handle}`}>
                        <Button variant="white-sharp" size="lg" className="shadow-lg min-w-[200px]">
                          {translations.shopNow}
                        </Button>
                      </Link>
                      <Link href="/new">
                        <Button variant="outline" size="lg" className="shadow-lg border-white text-white hover:bg-white hover:text-black min-w-[200px]">
                          {translations.viewCollection}
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link href="/products">
                      <Button variant="white-sharp" size="lg" className="shadow-lg min-w-[200px]">
                        {translations.shopCollection}
                      </Button>
                    </Link>
                  )}
                </div>
                
                {/* Limited stock indicator - only for products with handle */}
                {slide.handle && index === 0 && (
                  <p className="text-sm font-mono text-primary-foreground/90 animate-pulse">
                    {translations.limitedStock}
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
              <MarqueeItem className="text-primary-foreground">{translations.brand.name}</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">{translations.marquee.freeShipping}</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">{translations.marquee.returns}</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">{translations.marquee.joinCustomers.replace('{count}', customerCount.toLocaleString())}</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">{translations.brand.socialHandle}</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">{translations.marquee.newArrivals}</MarqueeItem>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}