import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 shadow-sm hover:shadow-md",
        outline:
          "border border-border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20 dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        // Page-specific variants for better context
        "hero-primary": "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0",
        "hero-outline": "border-2 border-primary/20 bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200",
        "cta-primary": "bg-white text-primary hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0",
        "cta-outline": "border-2 border-white text-white hover:bg-white hover:text-primary shadow-lg hover:shadow-xl transition-all duration-200",
        "form-primary": "bg-primary text-primary-foreground hover:bg-primary/95 shadow-lg hover:shadow-xl transition-all duration-200 border-0 font-semibold py-3 rounded-lg",
        "form-outline": "border-2 border-primary/40 bg-white/95 backdrop-blur-sm text-primary hover:bg-primary hover:text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 font-medium py-3 rounded-lg",
        "dashboard-primary": "bg-primary text-primary-foreground hover:bg-primary/95 shadow-md hover:shadow-lg transition-all duration-200 border-0 font-semibold rounded-lg",
        "dashboard-outline": "border border-border bg-background hover:bg-muted hover:text-foreground shadow-sm hover:shadow-md transition-all duration-200 font-medium rounded-lg",
        // Colorful variants for enhanced UI
        "success": "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-200 border-0 font-semibold rounded-lg",
        "warning": "bg-yellow-500 text-white hover:bg-yellow-600 shadow-md hover:shadow-lg transition-all duration-200 border-0 font-semibold rounded-lg",
        "danger": "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg transition-all duration-200 border-0 font-semibold rounded-lg",
        "gradient-primary": "bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 border-0 font-semibold rounded-lg",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-lg px-8 has-[>svg]:px-6 text-base",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
