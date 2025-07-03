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
      <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 w-full flex items-center justify-center hero-section-fixed">
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
    <section className="relative bg-background w-full hero-section-fixed touch-optimized">
      {/* Fixed height container with aspect ratio for stability */}
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

        {/* Image container with fixed aspect ratio */}
        <div className="absolute inset-0">
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
                className="object-cover sm:object-contain object-center"
                sizes="100vw"
                priority={index < 2}
                quality={90}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                style={{
                  objectPosition: 'center 20%'
                }}
              />
            {/* Content overlay with better contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
              {/* Content centered for better visual balance in shorter hero */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-24">
                <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-mono font-bold text-white tracking-tight leading-tight drop-shadow-lg text-center mb-4">
                  {slide.name.toUpperCase()}
                </h2>
                
                {/* Price visible on all devices for e-commerce clarity */}
                {hasPrice && (
                  <p className="text-lg sm:text-xl md:text-2xl font-mono text-white/90 drop-shadow-md mb-6">
                    {t('from')} {slide.price}
                  </p>
                )}
                
                {/* CTA button */}
                <Link href={slide.handle ? `/products/${slide.handle}` : "/new"}>
                  <Button 
                    variant="white-sharp" 
                    size="lg" 
                    className="shadow-lg min-w-[180px] sm:min-w-[220px] h-11 sm:h-12 text-sm sm:text-base"
                  >
                    {t('viewCollection')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          ))}
        </div>
        
        {/* Progress indicator - compact positioning */}
        <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 border border-white transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
        
        {/* Marquee at the very bottom */}
        <Marquee 
          className="absolute bottom-0 left-0 right-0 z-30 bg-primary text-primary-foreground border-y border-primary-foreground/20 h-10 sm:h-12"
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