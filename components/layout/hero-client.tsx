"use client";

import React from "react";
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils'

interface HeroSlide {
  id: string;
  image: string;
  name: string;
  collectionHandle: string;
  ctaLink: string;
  isSale?: boolean;
}

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
    exploreHats: string;
    exploreBags: string;
    exploreCropTops: string;
    shopSale: string;
    hatsSubtitle: string;
    bagsSubtitle: string;
    cropTopsSubtitle: string;
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
  const tn = useTranslations('nav')
  const locale = useLocale()
  const isBg = locale?.toLowerCase() === 'bg'
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Lock hero height to initial viewport height (ignore URL bar scroll resizes)
  React.useEffect(() => {
    const setInitialVH = () => {
      const h = window.innerHeight;
      document.documentElement.style.setProperty('--hero-vh', `${h}px`);
    };
    // After first paint to capture initial toolbar state
    requestAnimationFrame(setInitialVH);
    // Update only on orientation changes (not on resize)
    const onOrientation = () => setTimeout(setInitialVH, 250);
    window.addEventListener('orientationchange', onOrientation);
    return () => window.removeEventListener('orientationchange', onOrientation);
  }, []);

  React.useEffect(() => {
    if (slides.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative w-full pt-mobile-nav md:pt-0 h-hero-under-nav overflow-hidden bg-neutral-50">
      {/* Frame Border */}
      <div className="absolute inset-4 md:inset-8 border border-black/10 pointer-events-none z-30 rounded-2xl" />
      
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide 
              ? 'opacity-100' 
              : 'opacity-0'
          }`}
        >
          {/* Hero Image */}
          <div className="absolute inset-4 md:inset-8 rounded-2xl overflow-hidden">
            <Image
              src={slide.image}
              alt={`${slide.name} collection`}
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority={index === 0}
              quality={95}
            />
            {/* Subtle Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            
            {/* Sale Badge for sale slide */}
            {slide.isSale && (
              <div className="absolute top-6 right-6 z-10">
                <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold tracking-wider shadow-lg">
                  {isBg ? 'РАЗПРОДАЖБА' : 'SALE'}
                </div>
              </div>
            )}
          </div>

          {/* Content Container */}
          <div className="relative z-20 h-full flex flex-col justify-end p-8 md:p-16 lg:p-20 pb-8 md:pb-12">
            {/* Main Content */}
            <div className="flex items-end justify-between w-full">
              {/* Left Content - ABSOLUTELY FIXED POSITIONING */}
              <div className="absolute bottom-16 md:bottom-20 left-8 md:left-16 lg:left-20 flex flex-col">
                {/* Collection Label - FIXED */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-px bg-white/60" />
                  <span className={cn(
                    'text-white/80 text-xs font-medium tracking-[0.2em]',
                    isBg ? 'normal-case' : 'uppercase'
                  )}>
                    {tn('collections')}
                  </span>
                </div>
                
                {/* Collection Title - FIXED HEIGHT AND POSITION */}
                <div className="mb-4">
                  <h1 className={`text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-tight leading-[0.85] ${
                    slide.isSale ? 'text-red-400 font-black' : ''
                  }`}>
                    {slide.name}
                  </h1>
                </div>

                {/* CTA Button - FIXED */}
                <Link href={slide.ctaLink}>
                  <button className="group relative flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-medium text-sm tracking-wide overflow-hidden">
                    <div className="absolute inset-0 bg-white transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                    <span className="relative whitespace-nowrap tracking-normal transition-colors duration-300 group-hover:text-black">
                      {index === 0 && translations.shopSale}
                      {index === 1 && translations.exploreHats}
                      {index === 2 && translations.exploreBags}
                      {index === 3 && translations.exploreCropTops}
                    </span>
                    <div className="relative w-4 h-4 rounded-full border border-current flex items-center justify-center group-hover:rotate-45 transition-all duration-300 group-hover:border-black">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </div>
                  </button>
                </Link>
              </div>

              {/* Right Side - Desktop Navigation */}
              <div className="hidden md:block absolute bottom-16 md:bottom-20 right-8 md:right-16 lg:right-20">
                <div className="flex flex-col items-end gap-6">
                  {/* Slide Counter */}
                  <div className="text-white/60 text-sm font-light">
                    <span className="text-white font-medium">0{currentSlide + 1}</span>
                    <span className="mx-2">/</span>
                    <span>0{slides.length}</span>
                  </div>

                  {/* Slide Indicators */}
                  <div className="flex flex-col gap-3">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-12 w-px transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-white' 
                            : 'bg-white/30 hover:bg-white/60'
                        }`}
                        aria-label={`Go to ${slides[index].name} collection`}
                      />
                    ))}
                  </div>

                  {/* Collection Names */}
                  <div className="flex flex-col gap-2 text-right">
                    {slides.map((slide, index) => (
                      <button
                        key={slide.id}
                        onClick={() => setCurrentSlide(index)}
                        className={`text-sm font-light transition-all duration-300 ${
                          index === currentSlide 
                            ? 'text-white' 
                            : 'text-white/40 hover:text-white/70'
                        }`}
                      >
                        {slide.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Navigation Dots - Fixed positioning */}
            <div className="md:hidden absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 ${
                    index === currentSlide 
                      ? 'w-8 h-2 bg-white rounded-full' 
                      : 'w-2 h-2 bg-white/60 rounded-full hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
