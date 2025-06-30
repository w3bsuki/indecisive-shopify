"use client"

import { Button } from "@/components/ui/button"
import { HeroSplit, HeroSplitPanel, HeroSplitHandle } from "@/components/ui/hero-split"
import { Marquee, MarqueeItem } from "@/components/ui/marquee"
import { cn } from "@/lib/utils"

export function HeroSlider() {
  return (
    <HeroSplit 
      className={cn(
        "relative w-full",
        // Mobile: account for fixed nav (banner + nav = 104px)
        "h-[calc(100vh-104px)] md:h-[calc(100vh-84px)]"
      )}
      defaultPosition={50}
      minPosition={15}
      maxPosition={85}
    >

      {/* Left Panel - Essentials */}
      <HeroSplitPanel 
        side="left"
        className="bg-background px-4 sm:px-6 md:px-12 py-8 md:py-12"
      >
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-sm md:max-w-md mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-tight">
            CAN&apos;T
            <br />
            DECIDE?
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-muted-foreground leading-relaxed">
            Minimalist essentials
          </p>
          <Button className="btn-primary-sharp">
            SHOP ESSENTIALS
          </Button>
        </div>
      </HeroSplitPanel>

      {/* Right Panel - Streetwear */}
      <HeroSplitPanel 
        side="right"
        className="bg-primary px-4 sm:px-6 md:px-12 py-8 md:py-12"
      >
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-sm md:max-w-md mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-tight text-primary-foreground">
            CHOOSE
            <br />
            CHAOS
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-primary-foreground/80 leading-relaxed">
            Urban streetwear
          </p>
          <Button className="btn-white-sharp">
            SHOP STREETWEAR
          </Button>
        </div>
      </HeroSplitPanel>

      {/* Interactive Handle */}
      <HeroSplitHandle />

      {/* Bottom Marquee - ensure it's visible within viewport */}
      <Marquee 
        className="absolute bottom-0 left-0 right-0 z-10 bg-black text-white border-t-2 border-black"
        speed="normal"
        pauseOnHover
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="flex">
            <MarqueeItem className="text-white">INDECISIVE WEAR</MarqueeItem>
            <MarqueeItem className="text-white">CHOOSE BOTH SIDES</MarqueeItem>
            <MarqueeItem className="text-white">MINIMAL + MAXIMAL</MarqueeItem>
          </span>
        ))}
      </Marquee>
    </HeroSplit>
  )
}