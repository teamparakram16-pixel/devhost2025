"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

function FloatingElement({ children, delay = 0, duration = 3, className }: FloatingElementProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={cn(
        "transition-all duration-1000 ease-out",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
      style={{
        animationDelay: `${delay}s`,
        animation: `float ${duration}s ease-in-out infinite`
      }}
    >
      {children}
    </div>
  );
}

interface PremiumHeroProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  backgroundElements?: React.ReactNode;
  className?: string;
}

export function PremiumHero({
  title,
  subtitle,
  description,
  ctaText,
  ctaHref,
  onCtaClick,
  backgroundElements,
  className
}: PremiumHeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className={cn("relative min-h-screen flex items-center justify-center overflow-hidden", className)}>
      {/* Background Elements */}
      {backgroundElements}

      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0077B6_1px,transparent_1px),linear-gradient(to_bottom,#0077B6_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FloatingElement delay={0.2}>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-8">
            <span className="text-primary font-medium text-sm">{subtitle}</span>
          </div>
        </FloatingElement>

        <FloatingElement delay={0.4}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-tight">
            {title.split(' ').map((word, index) => (
              <span
                key={index}
                className="inline-block transition-all duration-700 hover:scale-105"
              >
                {word}{' '}
              </span>
            ))}
          </h1>
        </FloatingElement>

        <FloatingElement delay={0.6}>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            {description}
          </p>
        </FloatingElement>

        <FloatingElement delay={0.8}>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {ctaHref ? (
              <Link
                href={ctaHref}
                className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 overflow-hidden inline-block"
              >
                <span className="relative z-10">{ctaText}</span>
                <div className="absolute inset-0 bg-linear-to-r from-primary-foreground/0 via-primary-foreground/10 to-primary-foreground/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
            ) : (
              <button
                onClick={onCtaClick}
                className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 overflow-hidden"
              >
                <span className="relative z-10">{ctaText}</span>
                <div className="absolute inset-0 bg-linear-to-r from-primary-foreground/0 via-primary-foreground/10 to-primary-foreground/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            )}

            <button className="px-8 py-4 border-2 border-primary/20 text-primary rounded-xl font-semibold text-lg hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 backdrop-blur-sm">
              Learn More
            </button>
          </div>
        </FloatingElement>
      </div>
    </section>
  );
}