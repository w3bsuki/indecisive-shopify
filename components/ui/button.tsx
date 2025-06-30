"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles - sharp, sophisticated, touch-optimized
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        // Primary - Bold black button
        default: "bg-interactive-primary text-text-inverse hover:bg-interactive-primary-hover active:bg-interactive-primary-active disabled:bg-interactive-primary-disabled border-2 border-transparent",
        
        // Destructive - Red accent for dangerous actions
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive border-2 border-transparent",
        
        // Outline - Sharp bordered button
        outline: "border-2 border-border-strong bg-transparent text-text-primary hover:bg-gray-950 hover:text-text-inverse active:bg-gray-900 active:text-text-inverse",
        
        // Secondary - Subtle gray button
        secondary: "bg-gray-100 text-text-primary hover:bg-gray-200 active:bg-gray-300 border-2 border-transparent",
        
        // Ghost - Minimal hover state
        ghost: "bg-transparent text-text-primary hover:bg-gray-100 active:bg-gray-200 border-2 border-transparent",
        
        // Link - Text-only button
        link: "text-text-primary underline-offset-4 hover:underline active:no-underline border-2 border-transparent bg-transparent",
        
        // Sharp variants for e-commerce
        "primary-sharp": "bg-gray-950 text-text-inverse hover:bg-gray-800 active:bg-gray-900 border-2 border-gray-950 hover:border-gray-800 active:border-gray-900",
        
        "outline-sharp": "border-2 border-gray-950 bg-transparent text-gray-950 hover:bg-gray-950 hover:text-text-inverse active:bg-gray-800 active:border-gray-800",
        
        "white-sharp": "bg-gray-0 text-gray-950 hover:bg-gray-50 active:bg-gray-100 border-2 border-gray-200 hover:border-gray-300",
        
        // E-commerce specific variants
        "add-to-cart": "bg-gray-950 text-text-inverse hover:bg-gray-800 active:bg-gray-900 border-2 border-gray-950 font-semibold tracking-wide",
        
        "wishlist": "bg-transparent text-gray-600 hover:text-wishlist hover:bg-gray-50 active:bg-gray-100 border-2 border-gray-200 hover:border-wishlist/20",
        
        "sale": "bg-sale-price text-text-inverse hover:bg-red-600 active:bg-red-700 border-2 border-transparent font-bold tracking-wider",
      },
      size: {
        sm: "h-button-sm px-3 text-xs font-medium",
        default: "h-button-md px-4 text-sm font-medium",
        lg: "h-button-lg px-6 text-base font-semibold",
        icon: "h-button-md w-button-md p-0",
        
        // Touch-optimized sizes
        touch: "h-button-touch px-4 text-sm font-medium min-w-touch-target",
        "touch-sm": "h-button-touch px-3 text-xs font-medium min-w-touch-target",
        "touch-lg": "h-button-touch px-6 text-base font-semibold min-w-touch-target",
        
        // Full width variants
        full: "w-full h-button-md px-4 text-sm font-medium",
        "full-lg": "w-full h-button-lg px-6 text-base font-semibold",
        "full-touch": "w-full h-button-touch px-4 text-sm font-medium",
      },
      
      // New dimension for emphasis
      emphasis: {
        none: "",
        subtle: "shadow-subtle",
        medium: "shadow-medium",
        strong: "shadow-strong hover:shadow-medium active:shadow-subtle",
      },
      
      // Animation variants
      animation: {
        none: "",
        scale: "hover:scale-[1.02] active:scale-[0.98] transition-transform duration-fast",
        magnetic: "hover:animate-magnetic",
        slide: "hover:-translate-y-0.5 active:translate-y-0 transition-transform duration-fast",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      emphasis: "none",
      animation: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    emphasis,
    animation,
    asChild = false, 
    loading = false,
    loadingText,
    icon,
    iconPosition = "left",
    fullWidth = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Determine if button is disabled
    const isDisabled = disabled || loading
    
    // Adjust size for full width
    const adjustedSize = fullWidth ? 
      (size === "lg" ? "full-lg" : 
       size === "touch" || size === "touch-lg" || size === "touch-sm" ? "full-touch" : 
       "full") : 
      size

    // Loading spinner component
    const LoadingSpinner = () => (
      <svg 
        className="animate-spin h-4 w-4" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )

    // Render content with loading state
    const renderContent = () => {
      if (loading) {
        return (
          <>
            <LoadingSpinner />
            <span className="sr-only">Loading</span>
            {loadingText && <span>{loadingText}</span>}
          </>
        )
      }

      if (icon && iconPosition === "left") {
        return (
          <>
            {icon}
            {children}
          </>
        )
      }

      if (icon && iconPosition === "right") {
        return (
          <>
            {children}
            {icon}
          </>
        )
      }

      return children
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ 
            variant, 
            size: adjustedSize, 
            emphasis, 
            animation,
            className 
          })
        )}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        data-loading={loading}
        {...props}
      >
        {renderContent()}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
