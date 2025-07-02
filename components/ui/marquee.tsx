import * as React from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  speed?: "slow" | "normal" | "fast"
  direction?: "left" | "right"
  pauseOnHover?: boolean
}

const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  ({ 
    className, 
    children, 
    speed = "normal", 
    direction = "left", 
    pauseOnHover = false,
    ...props 
  }, ref) => {
    const speedClasses = {
      slow: "animate-marquee-slow",
      normal: "animate-marquee", 
      fast: "animate-marquee-fast"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden bg-primary text-primary-foreground",
          "py-3 sm:py-4 md:py-5",
          className
        )}
        role="marquee"
        aria-label="Scrolling text"
        {...props}
      >
        <div 
          className={cn(
            "flex whitespace-nowrap",
            speedClasses[speed],
            direction === "right" && "reverse",
            pauseOnHover && "hover:pause"
          )}
          aria-hidden="true"
        >
          {/* Duplicate content for seamless infinite scroll */}
          <div className="flex whitespace-nowrap">
            {children}
          </div>
          <div className="flex whitespace-nowrap">
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Marquee.displayName = "Marquee"

interface MarqueeItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
}

const MarqueeItem = React.forwardRef<HTMLSpanElement, MarqueeItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "text-sm sm:text-base md:text-lg lg:text-xl font-mono font-bold",
          "tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em]",
          "mx-3 sm:mx-6 md:mx-8",
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)
MarqueeItem.displayName = "MarqueeItem"

export { Marquee, MarqueeItem }