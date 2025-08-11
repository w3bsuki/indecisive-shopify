"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const heroSlides = [
  {
    id: 1,
    title: "Minimal Elegance",
    subtitle: "Spring Collection 2025",
    description: "Discover timeless pieces crafted with precision",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=900&fit=crop&q=90",
    cta: "Shop Collection",
    href: "/products",
    accent: "#1a1a1a"
  },
  {
    id: 2,
    title: "Urban Essentials",
    subtitle: "New Arrivals",
    description: "Elevate your everyday with modern minimalism",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&h=900&fit=crop&q=90",
    cta: "Explore Now",
    href: "/products",
    accent: "#2d2d2d"
  },
  {
    id: 3,
    title: "Sustainable Style",
    subtitle: "Eco Collection",
    description: "Fashion forward, earth conscious",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop&q=90",
    cta: "Learn More",
    href: "/products",
    accent: "#1a1a1a"
  }
]

export function ModernHero() {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  React.useEffect(() => {
    const loadImages = async () => {
      const promises = heroSlides.map(slide => {
        return new Promise((resolve) => {
          const img = new window.Image()
          img.onload = resolve
          img.src = slide.image
        })
      })
      await Promise.all(promises)
      setIsLoading(false)
    }
    loadImages()
  }, [])

  const slide = heroSlides[currentSlide]

  return (
    <section className="relative h-screen max-h-[900px] min-h-[600px] w-full overflow-hidden bg-gray-50">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      )}

      {/* Background Images with Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Subtitle */}
                <motion.p 
                  className="text-white/80 text-sm md:text-base font-light tracking-[0.3em] uppercase mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {slide.subtitle}
                </motion.p>

                {/* Title */}
                <motion.h1 
                  className="text-5xl md:text-7xl lg:text-8xl font-extralight text-white mb-6 leading-[0.9]"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {slide.title}
                </motion.h1>

                {/* Description */}
                <motion.p 
                  className="text-lg md:text-xl text-white/90 font-light mb-10 max-w-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {slide.description}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link 
                    href={slide.href}
                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-black font-medium tracking-wide transition-all duration-300 hover:bg-gray-100"
                  >
                    <span className="relative z-10">{slide.cta}</span>
                    <span className="absolute inset-0 border border-white transition-all duration-300 group-hover:scale-105" />
                  </Link>
                  
                  <Link 
                    href="/products"
                    className="group inline-flex items-center justify-center px-8 py-4 border border-white/50 text-white font-medium tracking-wide transition-all duration-300 hover:bg-white/10 hover:border-white"
                  >
                    Browse Catalog
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`relative h-1 transition-all duration-500 ${
              index === currentSlide ? 'w-12 bg-white' : 'w-8 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && (
              <motion.div
                className="absolute inset-0 bg-white"
                layoutId="indicator"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2 text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Side Navigation Dots - Desktop Only */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
        {heroSlides.map((s, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="group relative w-12 h-12 flex items-center justify-center"
            aria-label={`${s.title}`}
          >
            <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-150' : 'bg-white/40 group-hover:bg-white/60'
            }`} />
            <span className="absolute right-full mr-4 text-xs text-white/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {s.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}