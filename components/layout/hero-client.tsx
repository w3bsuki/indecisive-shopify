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
    };
    brand: {
      name: string;
      socialHandle: string;
    };
  };
}

export function HeroClient({ slides, translations }: HeroClientProps) {
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

  // Add viewport height fix for mobile browsers
  React.useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
    
    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);

  return (
    <section className="relative bg-black w-full hero-section-fixed">
      <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">

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
                transform: 'scale(0.95)',
                objectPosition: 'center center'
              }}
            />
            
            {/* Content overlay with gradient - more subtle for better image visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
              {/* CTA button and price positioned at bottom */}
              <div className="absolute bottom-28 sm:bottom-32 left-0 right-0 flex flex-col items-center gap-4 px-4">
                {/* Price */}
                {hasPrice && (
                  <p className="text-xl sm:text-2xl font-mono text-white/90 drop-shadow-lg">
                    {translations.from} {slide.price}
                  </p>
                )}
                
                {/* CTA Button */}
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
        
        {/* Progress indicator - closer to CTA button */}
        <div className="absolute bottom-20 sm:bottom-24 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-20">
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
          className="absolute bottom-0 left-0 right-0 z-30 bg-black text-white py-3 sm:py-4"
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