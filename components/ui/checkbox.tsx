"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Visual checkbox size
      "peer relative h-5 w-5 shrink-0 rounded-radius-sm border transition-all duration-fast",
      // Touch target enhancement - creates larger clickable area
      "after:absolute after:-inset-2.5 after:content-['']",
      // Border and background states
      "border-gray-300 hover:border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary",
      // Focus styles
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      // Disabled state
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300",
      // Text color for checkmark
      "data-[state=checked]:text-primary-foreground",
      // Touch optimization
      "touch-manipulation",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
