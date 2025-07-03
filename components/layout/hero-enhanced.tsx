"use client";

import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Marquee, MarqueeItem } from "@/components/ui/marquee";
import { getHeroSlides, type HeroSlide } from '@/lib/shopify/hero-products';
import { useMarket } from '@/hooks/use-market';
import { useTranslations } from 'next-intl';
import { TrendingUp, Users } from 'lucide-react';

export function HeroEnhanced() {
  const t = useTranslations('hero');
  const tb = useTranslations('brand');
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
        <div className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur-sm px-2 py-1 border border-black/10 hidden md:flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="text-xs font-mono">{customerCount.toLocaleString()} {t('customers')}</span>
        </div>
        
        {/* Subtle trending indicator - top right */}
        {currentProduct?.handle && (
          <div className="absolute top-4 right-4 z-30 bg-red-500 text-white px-2 py-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs font-mono font-bold">{t('trending')}</span>
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
                transform: 'scale(0.85)',
                objectPosition: 'center center'
              }}
            />
            
            {/* Content overlay with better contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
              {/* Content positioned higher on mobile for better product visibility */}
              <div className="absolute top-0 left-0 right-0 text-center px-4 pt-20 sm:pt-24 md:pt-32">
                <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-mono font-bold text-white tracking-tight leading-tight drop-shadow-lg">
                  {slide.name.toUpperCase()}
                </h2>
                
                {/* Price only on desktop */}
                {hasPrice && (
                  <p className="hidden sm:block text-xl sm:text-2xl font-mono text-white/90 drop-shadow-md mt-4">
                    {t('from')} {slide.price}
                  </p>
                )}
              </div>
              
              {/* CTA positioned lower, above carousel indicators */}
              <div className="absolute bottom-32 sm:bottom-36 left-0 right-0 flex items-center justify-center px-4">
                <Link href={slide.handle ? `/products/${slide.handle}` : "/new"}>
                  <Button 
                    variant="white-sharp" 
                    size="lg" 
                    className="shadow-lg min-w-[200px] sm:min-w-[250px] h-12 sm:h-14 text-base sm:text-lg"
                  >
                    {t('viewCollection')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Progress indicator - positioned higher on mobile */}
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
          className="absolute bottom-12 left-0 right-0 z-30 bg-primary text-primary-foreground border-t border-primary-foreground/20"
          speed="normal"
          pauseOnHover
        >
          {[...Array(6)].map((_, i) => (
            <span key={i} className="flex">
              <MarqueeItem className="text-primary-foreground">{tb('name')}</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">{t('marquee.freeShipping')}</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">{t('marquee.returns')}</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">{t('marquee.joinCustomers', { count: customerCount.toLocaleString() })}</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">{tb('social.handle')}</MarqueeItem>
              <MarqueeItem className="text-primary-foreground">{t('marquee.newArrivals')}</MarqueeItem>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}