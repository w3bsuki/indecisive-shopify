import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "xs": "475px",
        "2xl": "1400px",
      },
    },
    fontFamily: {
      sans: ["var(--font-family-sans)"],
      mono: ["var(--font-family-mono)"],
      serif: ["var(--font-family-serif)"],
    },
    extend: {
      // Enhanced Color System with Design Tokens
      colors: {
        // Primitive Grayscale Palette
        gray: {
          0: "hsl(var(--gray-0))",
          50: "hsl(var(--gray-50))",
          100: "hsl(var(--gray-100))",
          200: "hsl(var(--gray-200))",
          300: "hsl(var(--gray-300))",
          400: "hsl(var(--gray-400))",
          500: "hsl(var(--gray-500))",
          600: "hsl(var(--gray-600))",
          700: "hsl(var(--gray-700))",
          800: "hsl(var(--gray-800))",
          900: "hsl(var(--gray-900))",
          950: "hsl(var(--gray-950))",
        },
        
        // Semantic Colors
        background: {
          DEFAULT: "hsl(var(--background))",
          subtle: "hsl(var(--background-subtle))",
          muted: "hsl(var(--background-muted))",
          elevated: "hsl(var(--background-elevated))",
          overlay: "hsl(var(--background-overlay))",
        },
        
        surface: {
          DEFAULT: "hsl(var(--surface))",
          subtle: "hsl(var(--surface-subtle))",
          muted: "hsl(var(--surface-muted))",
          raised: "hsl(var(--surface-raised))",
          overlay: "hsl(var(--surface-overlay))",
        },
        
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          tertiary: "hsl(var(--text-tertiary))",
          quaternary: "hsl(var(--text-quaternary))",
          disabled: "hsl(var(--text-disabled))",
          inverse: "hsl(var(--text-inverse))",
        },
        
        // Border Colors
        border: {
          DEFAULT: "hsl(var(--border))",
          primary: "hsl(var(--border-primary))",
          secondary: "hsl(var(--border-secondary))",
          strong: "hsl(var(--border-strong))",
          inverse: "hsl(var(--border-inverse))",
        },
        
        // Interactive Colors
        interactive: {
          primary: {
            DEFAULT: "hsl(var(--interactive-primary))",
            hover: "hsl(var(--interactive-primary-hover))",
            active: "hsl(var(--interactive-primary-active))",
            disabled: "hsl(var(--interactive-primary-disabled))",
          },
          secondary: {
            DEFAULT: "hsl(var(--interactive-secondary))",
            hover: "hsl(var(--interactive-secondary-hover))",
            active: "hsl(var(--interactive-secondary-active))",
          },
        },
        
        // E-commerce Specific Colors
        price: "hsl(var(--color-price))",
        "sale-price": "hsl(var(--color-sale-price))",
        "original-price": "hsl(var(--color-original-price))",
        "discount-badge": "hsl(var(--color-discount-badge))",
        "in-stock": "hsl(var(--color-in-stock))",
        "low-stock": "hsl(var(--color-low-stock))",
        "out-of-stock": "hsl(var(--color-out-of-stock))",
        wishlist: "hsl(var(--color-wishlist))",
        
        // Component Colors (shadcn compatibility)
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      
      // Enhanced Typography with Fluid Scaling
      fontSize: {
        xs: ["var(--font-size-xs)", { lineHeight: "var(--line-height-tight)" }],
        sm: ["var(--font-size-sm)", { lineHeight: "var(--line-height-snug)" }],
        base: ["var(--font-size-base)", { lineHeight: "var(--line-height-normal)" }],
        lg: ["var(--font-size-lg)", { lineHeight: "var(--line-height-normal)" }],
        xl: ["var(--font-size-xl)", { lineHeight: "var(--line-height-snug)" }],
        "2xl": ["var(--font-size-2xl)", { lineHeight: "var(--line-height-tight)" }],
        "3xl": ["var(--font-size-3xl)", { lineHeight: "var(--line-height-tight)" }],
        "4xl": ["var(--font-size-4xl)", { lineHeight: "var(--line-height-tight)" }],
        "5xl": ["var(--font-size-5xl)", { lineHeight: "var(--line-height-none)" }],
      },
      
      // Extended Spacing Scale
      spacing: {
        "0": "var(--spacing-0)",
        "px": "var(--spacing-px)",
        "0.5": "var(--spacing-0_5)",
        "1": "var(--spacing-1)",
        "1.5": "var(--spacing-1_5)",
        "2": "var(--spacing-2)",
        "2.5": "var(--spacing-2_5)",
        "3": "var(--spacing-3)",
        "3.5": "var(--spacing-3_5)",
        "4": "var(--spacing-4)",
        "5": "var(--spacing-5)",
        "6": "var(--spacing-6)",
        "7": "var(--spacing-7)",
        "8": "var(--spacing-8)",
        "9": "var(--spacing-9)",
        "10": "var(--spacing-10)",
        "11": "var(--spacing-11)",
        "12": "var(--spacing-12)",
        "14": "var(--spacing-14)",
        "16": "var(--spacing-16)",
        "20": "var(--spacing-20)",
        "24": "var(--spacing-24)",
        "28": "var(--spacing-28)",
        "32": "var(--spacing-32)",
      },
      
      // Component Heights with Touch Optimization
      height: {
        "button-sm": "var(--button-height-sm)",
        "button-md": "var(--button-height-md)",
        "button-lg": "var(--button-height-lg)",
        "button-touch": "var(--button-height-touch)",
      },
      
      minHeight: {
        "button-sm": "var(--button-height-sm)",
        "button-md": "var(--button-height-md)",
        "button-lg": "var(--button-height-lg)",
        "button-touch": "var(--button-height-touch)",
        "touch-target": "48px",
      },
      
      minWidth: {
        "touch-target": "48px",
      },
      
      // Letter Spacing Scale
      letterSpacing: {
        "tighter": "var(--letter-spacing-tighter)",
        "tight": "var(--letter-spacing-tight)",
        "normal": "var(--letter-spacing-normal)",
        "wide": "var(--letter-spacing-wide)",
        "wider": "var(--letter-spacing-wider)",
        "widest": "var(--letter-spacing-widest)",
        "luxury": "var(--letter-spacing-luxury)",
      },
      
      // Line Heights
      lineHeight: {
        "none": "var(--line-height-none)",
        "tight": "var(--line-height-tight)",
        "snug": "var(--line-height-snug)",
        "normal": "var(--line-height-normal)",
        "relaxed": "var(--line-height-relaxed)",
        "loose": "var(--line-height-loose)",
      },
      
      // Font Weights
      fontWeight: {
        "thin": "var(--font-weight-thin)",
        "light": "var(--font-weight-light)",
        "normal": "var(--font-weight-normal)",
        "medium": "var(--font-weight-medium)",
        "semibold": "var(--font-weight-semibold)",
        "bold": "var(--font-weight-bold)",
        "black": "var(--font-weight-black)",
      },
      
      // Border Radius (Sharp Design System)
      borderRadius: {
        "none": "0",
        "sm": "0",
        "md": "0", 
        "lg": "0",
        "xl": "0",
        "2xl": "0",
        "3xl": "0",
        "full": "0",
      },
      
      // Border Widths
      borderWidth: {
        "thin": "var(--border-width-thin)",
        "thick": "var(--border-width-thick)",
        "thicker": "var(--border-width-thicker)",
      },
      
      // Box Shadows
      boxShadow: {
        "subtle": "var(--card-shadow-subtle)",
        "medium": "var(--card-shadow-medium)",
        "strong": "var(--card-shadow-strong)",
      },
      
      // Aspect Ratios for E-commerce
      aspectRatio: {
        "product": "var(--product-card-aspect-ratio)",
        "4/5": "4 / 5",
        "3/4": "3 / 4",
        "1/1": "1 / 1",
      },
      
      // Transition Durations
      transitionDuration: {
        "fast": "var(--transition-fast)",
        "normal": "var(--transition-normal)",
        "slow": "var(--transition-slow)",
        "slower": "var(--transition-slower)",
      },
      
      // Transition Timing Functions
      transitionTimingFunction: {
        "smooth": "var(--transition-timing)",
        "spring": "var(--transition-spring)",
      },
      
      // Z-Index Scale
      zIndex: {
        "dropdown": "var(--z-index-dropdown)",
        "sticky": "var(--z-index-sticky)",
        "fixed": "var(--z-index-fixed)",
        "modal-backdrop": "var(--z-index-modal-backdrop)",
        "modal": "var(--z-index-modal)",
        "popover": "var(--z-index-popover)",
        "tooltip": "var(--z-index-tooltip)",
        "toast": "var(--z-index-toast)",
        "notification": "var(--z-index-notification)",
        "max": "var(--z-index-max)",
      },
      
      // Enhanced Animations
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "scale-out": {
          from: { transform: "scale(1)", opacity: "1" },
          to: { transform: "scale(0.95)", opacity: "0" },
        },
        "magnetic": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-2px, -2px) scale(1.02)" },
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in var(--transition-normal) var(--transition-timing)",
        "fade-out": "fade-out var(--transition-normal) var(--transition-timing)",
        "slide-in-from-top": "slide-in-from-top var(--transition-normal) var(--transition-timing)",
        "slide-in-from-bottom": "slide-in-from-bottom var(--transition-normal) var(--transition-timing)",
        "scale-in": "scale-in var(--transition-fast) var(--transition-timing)",
        "scale-out": "scale-out var(--transition-fast) var(--transition-timing)",
        "magnetic": "magnetic 0.3s var(--transition-spring)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom plugin for utilities
    function({ addUtilities }: any) {
      addUtilities({
        '.touch-target': {
          'min-height': '48px',
          'min-width': '48px',
        },
        '.product-card-ratio': {
          'aspect-ratio': 'var(--product-card-aspect-ratio)',
        },
        '.text-balance': {
          'text-wrap': 'balance',
        },
      })
    }
  ],
} satisfies Config

export default config
