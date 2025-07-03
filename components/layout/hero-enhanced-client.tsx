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
      <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Subtle trust indicator - top left */}
        <div className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur-sm px-2 py-1 border border-black/10 hidden md:flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="text-xs font-mono">{customerCount.toLocaleString()} {translations.customers}</span>
        </div>
        
        {/* Subtle trending indicator - top right */}
        {currentProduct?.handle && (
          <div className="absolute top-4 right-4 z-30 bg-red-500 text-white px-2 py-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs font-mono font-bold">{translations.trending}</span>
          </div>
        )}

        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ${
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
                transform: 'scale(0.85)',
                objectPosition: 'center center'
              }}
            />
            
            {/* Content overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
              {/* Title positioned at top for visibility */}
              <div className="absolute top-0 left-0 right-0 text-center px-4 pt-20 sm:pt-24 md:pt-32">
                <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-mono font-bold text-black tracking-tight leading-tight">
                  {slide.name.toUpperCase()}
                </h2>
                
                {/* Price only on larger screens */}
                {hasPrice && (
                  <p className="hidden sm:block text-xl sm:text-2xl font-mono text-black/80 mt-4">
                    {translations.from} {slide.price}
                  </p>
                )}
              </div>
              
              {/* Single CTA button positioned lower */}
              <div className="absolute bottom-32 sm:bottom-36 left-0 right-0 flex items-center justify-center px-4">
                <Link href={slide.handle ? `/products/${slide.handle}` : "/new"}>
                  <Button 
                    variant="white-sharp" 
                    size="lg" 
                    className="shadow-lg min-w-[200px] sm:min-w-[250px] h-12 sm:h-14 text-base sm:text-lg"
                  >
                    {translations.viewCollection}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Progress indicator - higher on mobile */}
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-20">
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
          className="absolute bottom-0 left-0 right-0 z-30 bg-black text-white border-t border-black py-4 sm:py-5"
          speed="normal"
          pauseOnHover
        >
          {[...Array(6)].map((_, i) => (
            <span key={i} className="flex">
              <MarqueeItem className="text-white">{translations.brand.name}</MarqueeItem>
              <MarqueeItem className="text-white">{translations.marquee.freeShipping}</MarqueeItem>
              <MarqueeItem className="text-white">{translations.marquee.returns}</MarqueeItem>
              <MarqueeItem className="text-white">{translations.marquee.joinCustomers.replace('{count}', customerCount.toLocaleString())}</MarqueeItem>
              <MarqueeItem className="text-white">{translations.brand.socialHandle}</MarqueeItem>
              <MarqueeItem className="text-white">{translations.marquee.newArrivals}</MarqueeItem>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}