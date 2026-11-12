"use client"

import Link from "@/components/site/link"
import { cn } from "cn"

import { TrackedLink } from "@/components/site/tracked-link"
import { useChrome } from "@/lib/i18n/chrome"
import { proPlans } from "@/lib/pro/pricing"

function ProPriceLink({ from, className }: { from: string; className: string }) {
  const c = useChrome()
  const price = proPlans.solo.price

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

function HeroActions({
  label,
  payment,
  refund,
}: {
  label: string
  payment: string
  refund: string
}) {
  const price = proPlans.solo.price

  return (
    <div className="flex flex-col items-center gap-3">
      <TrackedLink
        href="/pricing"
        event="Pro link clicked"
        eventProps={{ from: "home-hero", to: "/pricing" }}
        className="hero-cta"
      >
        {label}
      </TrackedLink>
      <p className="text-sm text-white/75">
        {payment} · <span className="tabular-nums">${price}</span> · {refund}
      </p>
    </div>
  )
}

function StartActions({ className }: { className?: string }) {
  const c = useChrome()

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Link
        href="/docs/installation"
        className="cta-primary"
        data-ml-goal="get_started_click"
      >
        {c("Get started")}
      </Link>
      <ProPriceLink from="home-start" className="cta-secondary" />
    </div>
  )
}

export { HeroActions, StartActions }
