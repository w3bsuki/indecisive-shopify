'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { HydrogenImageWrapper } from './hydrogen-image'
import type { ShopifyImage } from '@/lib/shopify/types'

interface TouchState {
  startX: number
  startY: number
  startTime: number
}

interface ZoomState {
  scale: number
  translateX: number
  translateY: number
}

interface ProductImageGalleryProps {
  images: ShopifyImage[]
  productTitle: string
}

export function ProductImageGallery({ images, productTitle }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomState, setZoomState] = useState<ZoomState>({ scale: 1, translateX: 0, translateY: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [autoplayEnabled, setAutoplayEnabled] = useState(false)
  const touchStateRef = useRef<TouchState | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const selectedImage = images[selectedIndex]

  // Auto-advance images for galleries with multiple images
  useEffect(() => {
    if (autoplayEnabled && images.length > 1) {
      autoplayIntervalRef.current = setInterval(() => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      }, 4000)
    }

    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current)
      }
    }
  }, [autoplayEnabled, images.length])

  // Reset zoom when changing images
  useEffect(() => {
    setZoomState({ scale: 1, translateX: 0, translateY: 0 })
    setIsZoomed(false)
  }, [selectedIndex])

  // Listen for variant changes to switch to the variant's image
  useEffect(() => {
    const handleVariantChange = (event: CustomEvent) => {
      const variantImage = event.detail.image
      console.log('🔄 Variant changed:', { 
        variantImage: variantImage?.url,
        availableImages: images.map((img, i) => ({ index: i, url: img.url, filename: img.url.split('/').pop() }))
      })
      
      if (variantImage?.url) {
        // Try exact URL match first
        let imageIndex = images.findIndex(img => img.url === variantImage.url)
        
        // If no exact match, try without query parameters
        if (imageIndex === -1) {
          const cleanVariantUrl = variantImage.url.split('?')[0]
          imageIndex = images.findIndex(img => img.url.split('?')[0] === cleanVariantUrl)
        }
        
        // If still no match, try by filename
        if (imageIndex === -1) {
          const variantFilename = variantImage.url.split('/').pop()?.split('?')[0]
          if (variantFilename) {
            imageIndex = images.findIndex(img => {
              const filename = img.url.split('/').pop()?.split('?')[0]
              return filename === variantFilename
            })
          }
        }
        
        console.log('📍 Image match result:', { imageIndex, selectedIndex })
        
        if (imageIndex >= 0 && imageIndex !== selectedIndex) {
          setSelectedIndex(imageIndex)
          console.log('✅ Switched to image index:', imageIndex)
        }
      }
    }

    window.addEventListener('variant-changed', handleVariantChange as EventListener)
    return () => window.removeEventListener('variant-changed', handleVariantChange as EventListener)
  }, [images, selectedIndex])

  const handlePrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  // Touch event handlers for swipe gestures
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStateRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now()
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStateRef.current) return
    
    const touch = e.changedTouches[0]
    const { startX, startY, startTime } = touchStateRef.current
    const endX = touch.clientX
    const endY = touch.clientY
    const endTime = Date.now()
    
    const deltaX = endX - startX
    const deltaY = endY - startY
    const deltaTime = endTime - startTime
    
    // Check if it's a horizontal swipe (not vertical scroll)
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50
    const isQuickSwipe = deltaTime < 300
    
    if (isHorizontalSwipe && isQuickSwipe && images.length > 1) {
      e.preventDefault()
      if (deltaX > 0) {
        handlePrevious()
      } else {
        handleNext()
      }
    }
    
    touchStateRef.current = null
  }, [images.length, handlePrevious, handleNext])

  // Enhanced zoom functionality
  const handleZoomIn = useCallback(() => {
    setZoomState(prev => ({
      ...prev,
      scale: Math.min(prev.scale * 1.5, 3)
    }))
    setIsZoomed(true)
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoomState(prev => ({
      ...prev,
      scale: Math.max(prev.scale / 1.5, 1)
    }))
    if (zoomState.scale <= 1) {
      setIsZoomed(false)
    }
  }, [zoomState.scale])

  const resetZoom = useCallback(() => {
    setZoomState({ scale: 1, translateX: 0, translateY: 0 })
    setIsZoomed(false)
  }, [])

  // Double tap to zoom with enhanced control
  const handleDoubleClick = useCallback(() => {
    if (zoomState.scale === 1) {
      handleZoomIn()
    } else {
      resetZoom()
    }
  }, [zoomState.scale, handleZoomIn, resetZoom])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'Escape') {
        resetZoom()
      }
    }

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen, handlePrevious, handleNext, resetZoom])

  if (!images.length) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-2">👕</div>
          <div>No image available</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4" aria-label={`${productTitle} gallery`}>
      {/* Main Image */}
      <div 
        ref={containerRef}
        className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden group touch-pan-y shadow-sm"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
      >
        <div 
          className={cn(
            "w-full h-full transition-transform duration-300 ease-out product-image",
            isZoomed && "cursor-move"
          )}
          style={{
            transform: `scale(${zoomState.scale}) translate(${zoomState.translateX}px, ${zoomState.translateY}px)`
          }}
        >
          <HydrogenImageWrapper
            data={selectedImage}
            alt={selectedImage.altText || productTitle}
            aspectRatio="1/1"
            priority={selectedIndex === 0}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px"
            className="rounded-lg select-none"
          />
        </div>
        
        {/* Enhanced Controls Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Zoom Controls */}
          <div className="absolute top-2 left-2 flex gap-1">
            {zoomState.scale > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/90 hover:bg-white h-8 w-8"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/90 hover:bg-white h-8 w-8"
                  onClick={resetZoom}
                >
                  <RotateCw className="h-3 w-3" />
                </Button>
              </>
            )}
            {zoomState.scale < 3 && (
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/90 hover:bg-white h-8 w-8"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          {/* Autoplay Toggle */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/90 hover:bg-white h-8 w-8"
              onClick={() => setAutoplayEnabled(!autoplayEnabled)}
              aria-label={autoplayEnabled ? 'Disable autoplay' : 'Enable autoplay'}
            >
              <div className={cn(
                "w-3 h-3 rounded-full transition-colors",
                autoplayEnabled ? "bg-green-500" : "bg-gray-400"
              )} />
            </Button>
          )}
        </div>
        
        {/* Navigation Arrows - Desktop only */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
        
        {/* Mobile swipe indicators - Modern dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300 touch-manipulation",
                  selectedIndex === index 
                    ? "bg-white shadow-lg scale-125" 
                    : "bg-white/60 hover:bg-white/80"
                )}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Enhanced Fullscreen Dialog */}
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-2 right-2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex h-8 w-8"
              aria-label="Open fullscreen"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl w-full h-[90vh] p-0" aria-label={`${productTitle} fullscreen image`}>
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              {/* Fullscreen Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.altText || productTitle}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              
              {/* Fullscreen Controls */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={handleZoomIn}
                  disabled={zoomState.scale >= 3}
                >
                  <ZoomIn className="h-4 w-4 mr-1" />
                  Zoom In
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={handleZoomOut}
                  disabled={zoomState.scale <= 1}
                >
                  <ZoomOut className="h-4 w-4 mr-1" />
                  Zoom Out
                </Button>
              </div>
              
              {/* Navigation in Fullscreen */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white"
                    onClick={handlePrevious}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white"
                    onClick={handleNext}
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {selectedIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Image Counter - Desktop only */}
        {images.length > 1 && (
          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded hidden md:block" aria-live="polite">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
        
        {/* Mobile zoom hint */}
        {!isZoomed && (
          <div className="absolute top-2 right-2 text-white/70 text-xs bg-black/30 px-2 py-1 rounded md:hidden">
            Double tap to zoom
          </div>
        )}
      </div>

      {/* Mobile-First Thumbnail Selection */}
      {images.length > 1 && (
        <div className="mt-4">
          {/* Mobile: Always horizontal scroll for perfect UX */}
          <div className="md:hidden">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide px-2 pb-2 snap-x snap-mandatory">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "relative flex-none w-[68px] h-[68px] rounded-xl overflow-hidden transition-all duration-200 snap-start touch-manipulation border-2",
                    selectedIndex === index 
                      ? "border-black shadow-lg" 
                      : "border-gray-200 hover:border-gray-400"
                  )}
                >
                  <HydrogenImageWrapper
                    data={image}
                    alt={image.altText || `${productTitle} ${index + 1}`}
                    aspectRatio="1/1"
                    sizes="72px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Desktop: Clean grid layout */}
          <div className="hidden md:block">
            <div className={cn(
              "grid gap-3",
              images.length <= 6 ? `grid-cols-${Math.min(images.length, 6)}` : "grid-cols-6"
            )}>
              {images.slice(0, 6).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "relative aspect-square rounded-xl overflow-hidden transition-all duration-200 touch-manipulation border-2",
                    selectedIndex === index 
                      ? "border-black shadow-lg transform scale-105" 
                      : "border-gray-200 hover:border-gray-400 hover:shadow-md"
                  )}
                >
                  <HydrogenImageWrapper
                    data={image}
                    alt={image.altText || `${productTitle} ${index + 1}`}
                    aspectRatio="1/1"
                    sizes="(max-width: 768px) 25vw, 120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Add CSS for custom scrollbar hiding
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .touch-pan-y {
      touch-action: pan-y;
    }
  `
  document.head.appendChild(style)
}
