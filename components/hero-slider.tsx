"use client"

import { Button } from "@/components/ui/button"
import { HeroSplit, HeroSplitPanel, HeroSplitHandle } from "@/components/ui/hero-split"
import { Marquee, MarqueeItem } from "@/components/ui/marquee"
import { cn } from "@/lib/utils"

export function HeroSlider() {
  return (
    <HeroSplit 
      className={cn(
        "hero-section"
      )}
      defaultPosition={50}
      minPosition={15}
      maxPosition={85}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          .hero-section {
            margin-top: calc(3rem + 4rem);
            height: calc(100vh - 7rem);
          }
          @media (min-width: 768px) {
            .hero-section {
              margin-top: 5rem;
              height: calc(100vh - 5rem);
            }
          }
        `
      }} />

      {/* Left Panel - Essentials */}
      <HeroSplitPanel 
        side="left"
        className="bg-background px-2 sm:px-6 md:px-12 py-8"
      >
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-sm md:max-w-md">
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-tight">
            CAN'T
            <br />
            DECIDE?
          </h1>
          <p className="text-xs sm:text-base md:text-xl text-muted-foreground leading-relaxed">
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
        className="bg-primary px-2 sm:px-6 md:px-12 py-8"
      >
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-sm md:max-w-md">
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-tight text-primary-foreground">
            CHOOSE
            <br />
            CHAOS
          </h1>
          <p className="text-xs sm:text-base md:text-xl text-primary-foreground/80 leading-relaxed">
            Urban streetwear
          </p>
          <Button className="btn-white-sharp">
            SHOP STREETWEAR
          </Button>
        </div>
      </HeroSplitPanel>

      {/* Interactive Handle */}
      <HeroSplitHandle />

      {/* Bottom Marquee */}
      <Marquee className="absolute bottom-0 left-0 right-0">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="flex">
            <MarqueeItem>INDECISIVE WEAR</MarqueeItem>
            <MarqueeItem>CHOOSE BOTH SIDES</MarqueeItem>
            <MarqueeItem>MINIMAL + MAXIMAL</MarqueeItem>
          </span>
        ))}
      </Marquee>
    </HeroSplit>
  )
}