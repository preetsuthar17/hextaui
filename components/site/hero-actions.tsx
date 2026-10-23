"use client"

import Link from "@/components/site/link"
import { cn } from "cn"

import { TrackedLink } from "@/components/site/tracked-link"
import { useChrome } from "@/lib/i18n/chrome"
import { useSoloPrice } from "@/lib/pro/use-early-bird"

function ProPriceLink({ from, className }: { from: string; className: string }) {
  const c = useChrome()
  const price = useSoloPrice()

  return (
    <TrackedLink
      href="/pricing"
      event="Pro link clicked"
      eventProps={{ from, to: "/pricing" }}
      className={className}
    >
      {c("Get Pro")}
      <span className="hero-cta-price">${price}</span>
    </TrackedLink>
  )
}

function HeroActions() {
  const c = useChrome()

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Link href="/blocks" className="hero-cta">
        {c("Browse blocks")}
      </Link>
      <ProPriceLink from="home-hero" className="hero-cta-secondary" />
    </div>
  )
}

function StartActions({ className }: { className?: string }) {
  const c = useChrome()

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Link href="/docs/installation" className="cta-primary">
        {c("Get started")}
      </Link>
      <ProPriceLink from="home-start" className="cta-secondary" />
    </div>
  )
}

export { HeroActions, StartActions }
