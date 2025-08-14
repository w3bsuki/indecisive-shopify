"use client";

import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Marquee, MarqueeItem } from "@/components/ui/marquee";
import type { HeroSlide } from '@/lib/shopify/hero-products';

interface HeroClientProps {
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
      followInstagram: string;
      beMinimalBold: string;
      stayIndecisive: string;
    };
    brand: {
      name: string;
      socialHandle: string;
    };
  };
}

export function HeroClient({ slides, translations }: HeroClientProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [imagesLoaded, setImagesLoaded] = React.useState(false);

  // Preload next slide image
  React.useEffect(() => {
    if (slides.length <= 1) return;
    
    const nextIndex = (currentSlide + 1) % slides.length;
    const img = new window.Image();
    img.src = slides[nextIndex].image;
  }, [currentSlide, slides]);

  // Auto-play functionality with reduced motion support
  React.useEffect(() => {
    if (slides.length === 0) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Track when first image loads
  React.useEffect(() => {
    if (slides.length === 0) return;
    
    const img = new window.Image();
    img.onload = () => setImagesLoaded(true);
    img.src = slides[0].image;
  }, [slides]);

  // Removed dynamic viewport height adjustment to keep hero static

  return (
    <>
    <section className="relative bg-black w-full hero-section-fixed">
      <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
        
        {/* Collection Name Headline - Dynamic */}
        <div className="absolute top-8 sm:top-12 lg:top-6 left-0 right-0 z-40 flex flex-col items-center gap-2">
          {/* Collection Badge - Mobile Only */}
          <div className="sm:hidden bg-black text-white px-3 py-1 text-xs font-bold tracking-wider">
            ХУЛИГАНКА
          </div>
          <h1 className="text-3xl sm:text-7xl lg:text-8xl font-black text-black tracking-wide font-mono transition-all duration-500 px-2 whitespace-nowrap">
            {slides[currentSlide]?.name || 'COLLECTIONS'}
          </h1>
        </div>

        {/* Loading skeleton */}
        {!imagesLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
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
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
              quality={90}
              style={{
                transform: 'scale(0.95)',
                objectPosition: 'center center'
              }}
            />
            
            {/* Content overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent">
              {/* CTA button */}
              <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex flex-col items-center gap-2 px-4">
                
                {/* CTA Button */}
                <Link href="/products?category=bucket-hats">
                  <Button 
                    variant="white-sharp" 
                    size="lg" 
                    className="shadow-lg min-w-[200px] sm:min-w-[240px] h-12 sm:h-14 text-sm sm:text-base font-medium tracking-wider uppercase hover:scale-[1.02] transition-all bg-white/95 backdrop-blur-sm border-2 border-white/20"
                    emphasis="strong"
                    animation="scale"
                  >
                    {translations.viewCollection}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Progress indicator */}
        <div className="absolute bottom-20 sm:bottom-24 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-30">
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
        
      </div>
    </section>
    
    {/* Marquee - with better spacing after hero */}
    <Marquee 
      className="bg-black text-white py-3 sm:py-4"
      speed="normal"
      pauseOnHover
    >
      {[...Array(6)].map((_, i) => (
        <span key={i} className="flex">
          <MarqueeItem className="text-white">{translations.brand.name}</MarqueeItem>
          <MarqueeItem className="text-white">{translations.marquee.followInstagram}</MarqueeItem>
          <MarqueeItem className="text-white">{translations.marquee.beMinimalBold}</MarqueeItem>
          <MarqueeItem className="text-white">{translations.marquee.freeShipping}</MarqueeItem>
          <MarqueeItem className="text-white">{translations.marquee.returns}</MarqueeItem>
          <MarqueeItem className="text-white">{translations.brand.socialHandle}</MarqueeItem>
          <MarqueeItem className="text-white">{translations.marquee.stayIndecisive}</MarqueeItem>
        </span>
      ))}
    </Marquee>
    </>
  );
}