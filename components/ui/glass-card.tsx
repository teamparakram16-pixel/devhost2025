"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'minimal';
}

export function GlassCard({ children, className, variant = 'default' }: GlassCardProps) {
  const variants = {
    default: "backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl",
    elevated: "backdrop-blur-2xl bg-white/5 border border-white/10 shadow-3xl",
    minimal: "backdrop-blur-lg bg-white/5 border border-white/10"
  };

  return (
    <div className={cn(
      "rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-4xl",
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
}