import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles with 44px touch target
          "flex h-11 w-full rounded-radius-md border bg-background px-4 py-2.5 text-base ring-offset-background transition-colors duration-fast",
          // File input styles
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Placeholder styles
          "placeholder:text-muted-foreground",
          // Focus styles
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // Default border
          "border-gray-300 hover:border-gray-400 focus-visible:border-gray-950",
          // Error state
          error && "border-destructive focus-visible:ring-destructive",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300",
          // Touch optimization
          "touch-manipulation",
          className
        )}
        ref={ref}
        aria-invalid={error ? "true" : undefined}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
