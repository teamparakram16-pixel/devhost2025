"use client";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./button";
import { cva, type VariantProps } from "class-variance-authority";

const premiumButtonVariants = cva(
  "relative overflow-hidden group transition-all duration-300",
  {
    variants: {
      variant: {
        "magnetic": [
          "bg-primary text-primary-foreground",
          "hover:shadow-2xl hover:shadow-primary/25",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
          "before:translate-x-[-100%] hover:before:translate-x-[100%]",
          "before:transition-transform before:duration-700",
          "transform hover:scale-105 active:scale-95"
        ],
        "glow": [
          "bg-primary text-primary-foreground",
          "shadow-lg shadow-primary/20",
          "hover:shadow-3xl hover:shadow-primary/40",
          "ring-2 ring-primary/20 hover:ring-primary/40",
          "transition-all duration-300"
        ],
        "liquid": [
          "bg-primary text-primary-foreground",
          "relative overflow-hidden",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary-foreground/0 before:via-primary-foreground/10 before:to-primary-foreground/0",
          "before:translate-x-[-100%] hover:before:translate-x-[100%]",
          "before:transition-transform before:duration-1000",
          "hover:shadow-xl hover:shadow-primary/30"
        ]
      },
      size: {
        default: "h-12 px-8",
        sm: "h-9 px-6",
        lg: "h-14 px-10",
        xl: "h-16 px-12 text-lg"
      }
    },
    defaultVariants: {
      variant: "magnetic",
      size: "default"
    }
  }
);

interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof premiumButtonVariants> {
  children: React.ReactNode;
}

export function PremiumButton({
  className,
  variant,
  size,
  children,
  ...props
}: PremiumButtonProps) {
  return (
    <button
      className={cn(premiumButtonVariants({ variant, size }), className)}
      {...props}
    >
      <span className="relative z-10 font-semibold">{children}</span>
    </button>
  );
}