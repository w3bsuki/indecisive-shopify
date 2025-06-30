"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface HeroSplitContextValue {
  position: number
  setPosition: (position: number) => void
  isDragging: boolean
  setIsDragging: (dragging: boolean) => void
}

const HeroSplitContext = React.createContext<HeroSplitContextValue | null>(null)

const useHeroSplit = () => {
  const context = React.useContext(HeroSplitContext)
  if (!context) {
    throw new Error("useHeroSplit must be used within a HeroSplit")
  }
  return context
}

interface HeroSplitProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultPosition?: number
  minPosition?: number
  maxPosition?: number
  children: React.ReactNode
}

const HeroSplit = React.forwardRef<HTMLDivElement, HeroSplitProps>(
  ({ className, defaultPosition = 50, minPosition = 15, maxPosition = 85, children, ...props }, ref) => {
    const [position, setPosition] = React.useState(defaultPosition)
    const [isDragging, setIsDragging] = React.useState(false)

    const handlePointerMove = React.useCallback((e: React.PointerEvent) => {
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
      
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = Math.max(minPosition, Math.min(maxPosition, (x / rect.width) * 100))
      setPosition(percentage)
    }, [minPosition, maxPosition])

    const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      setIsDragging(true)
      e.preventDefault()
    }, [])

    const handlePointerUp = React.useCallback(() => {
      setIsDragging(false)
    }, [])

    return (
      <HeroSplitContext.Provider value={{ position, setPosition, isDragging, setIsDragging }}>
        <div
          ref={ref}
          className={cn(
            "relative flex overflow-hidden touch-none select-none",
            className
          )}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          {...props}
        >
          {children}
        </div>
      </HeroSplitContext.Provider>
    )
  }
)
HeroSplit.displayName = "HeroSplit"

interface HeroSplitPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  side: "left" | "right"
  children: React.ReactNode
}

const HeroSplitPanel = React.forwardRef<HTMLDivElement, HeroSplitPanelProps>(
  ({ className, side, children, style, ...props }, ref) => {
    const { position } = useHeroSplit()
    
    const panelStyle = React.useMemo(() => ({
      width: side === "left" ? `${position}%` : `${100 - position}%`,
      ...style
    }), [position, side, style])

    return (
      <div
        ref={ref}
        className={cn("flex flex-col justify-center items-center", className)}
        style={panelStyle}
        {...props}
      >
        {children}
      </div>
    )
  }
)
HeroSplitPanel.displayName = "HeroSplitPanel"

interface HeroSplitHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const HeroSplitHandle = React.forwardRef<HTMLDivElement, HeroSplitHandleProps>(
  ({ className, children, ...props }, ref) => {
    const { position, setPosition, isDragging } = useHeroSplit()
    
    const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setPosition(Math.max(15, position - 5))
      } else if (e.key === 'ArrowRight') {
        setPosition(Math.min(85, position + 5))
      }
    }, [position, setPosition])

    return (
      <div
        ref={ref}
        className={cn(
          "absolute top-0 bottom-12 z-20 cursor-col-resize group",
          className
        )}
        style={{ left: `${position}%` }}
        role="slider"
        aria-label="Adjust split position"
        aria-valuemin={15}
        aria-valuemax={85}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {/* Visual divider using design tokens */}
        <div className="absolute left-1/2 top-0 bottom-4 w-0.5 bg-foreground/30 -translate-x-px" />
        
        {/* Handle using design system classes */}
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-8 h-14 sm:w-10 sm:h-16 md:w-12 md:h-20",
          "bg-foreground/10 backdrop-blur-md border border-foreground/20",
          "hover:bg-foreground/20 active:bg-foreground/30 transition-colors",
          "flex items-center justify-center touch-target",
          isDragging && "bg-foreground/30"
        )}>
          {children || (
            <div className="flex flex-col gap-0.5 sm:gap-1">
              <div className="w-3 h-0.5 sm:w-4 sm:h-0.5 bg-foreground/70 rounded-full" />
              <div className="w-3 h-0.5 sm:w-4 sm:h-0.5 bg-foreground/70 rounded-full" />
              <div className="w-3 h-0.5 sm:w-4 sm:h-0.5 bg-foreground/70 rounded-full" />
            </div>
          )}
        </div>

        {/* Extended touch area */}
        <div className="absolute -left-4 -right-4 sm:-left-5 sm:-right-5 md:-left-6 md:-right-6 top-0 bottom-0" />
      </div>
    )
  }
)
HeroSplitHandle.displayName = "HeroSplitHandle"

export { HeroSplit, HeroSplitPanel, HeroSplitHandle, useHeroSplit }