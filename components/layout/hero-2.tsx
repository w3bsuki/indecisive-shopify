"use client";

import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Marquee, MarqueeItem } from "@/components/ui/marquee";
import { getHeroSlides, type HeroSlide } from '@/lib/shopify/hero-products';

export function Hero2() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [slides, setSlides] = React.useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch hero slides on component mount
  React.useEffect(() => {
    async function loadHeroSlides() {
      try {
        const heroSlides = await getHeroSlides(5);
        setSlides(heroSlides);
        // Hero slides loaded successfully
      } catch (_error) {
        // Fallback slides if everything fails
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

  // Auto-play functionality - only start when slides are loaded
  React.useEffect(() => {
    if (isLoading || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % slides.length;
        // Auto-advancing to next slide
        return next;
      });
    }, 5000); // 5 seconds per slide for better readability

    return () => clearInterval(interval);
  }, [slides.length, isLoading]);

  // Show loading state with design tokens
  if (isLoading) {
    return (
      <section 
        className="relative bg-secondary w-full flex items-center justify-center"
        style={{
          height: 'calc(100vh - 104px)',
          minHeight: '400px'
        }}
      >
        <div className="text-center">
          <div className="w-8 h-8 border border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-mono text-sm tracking-wide">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="relative bg-background w-full border-l border-r border-primary"
      style={{
        height: 'calc(100vh - 104px)', // Back to original height
        minHeight: '400px'
      }}
    >
      <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
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
                transform: 'scale(0.7)', // Smaller scale to show whole product
                objectPosition: 'center center'
              }}
            />
            
            {/* Remove unnecessary inner border */}
            
            {/* Content overlay with design tokens */}
            <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
              <div className="text-center space-y-4 sm:space-y-6 px-4 relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-mono font-bold text-primary-foreground tracking-tight leading-tight drop-shadow-lg">
                  {slide.name.toUpperCase()}
                </h2>
                
                {/* Show price if available */}
                {slide.price && (
                  <p className="text-xl sm:text-2xl font-mono text-primary-foreground/90 drop-shadow-md">
                    FROM {slide.price}
                  </p>
                )}
                
                {/* Dynamic button - links to product page if handle exists */}
                {slide.handle ? (
                  <Link href={`/products/${slide.handle}`}>
                    <Button variant="white-sharp" size="lg" className="shadow-lg">
                      SHOP NOW
                    </Button>
                  </Link>
                ) : (
                  <Link href="/products">
                    <Button variant="white-sharp" size="lg" className="shadow-lg">
                      SHOP COLLECTION
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Progress indicator with design tokens */}
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
        
        {/* Bottom Marquee - Social Media & Brand */}
        <Marquee 
          className="absolute bottom-0 left-0 right-0 z-30 bg-primary text-primary-foreground border-t border-primary-foreground/20"
          speed="normal"
          pauseOnHover
        >
          {[...Array(6)].map((_, i) => (
            <span key={i} className="flex">
              <MarqueeItem className="text-primary-foreground">INDECISIVE WEAR</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">FOLLOW OUR INSTAGRAM</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">FOLLOW US ON TIKTOK</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">STREETWEAR WITH ATTITUDE</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">@INDECISIVEWEAR</MarqueeItem>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}