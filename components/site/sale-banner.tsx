"use client"

import { IconArrowRight } from "@tabler/icons-react"

import { TrackedLink } from "@/components/site/tracked-link"
import {
  formatPrice,
  proPlans,
  sale,
  salePlanIds,
} from "@/lib/pro/pricing"
import { useSaleActive } from "@/lib/pro/use-sale"

const maxPercentOff = Math.round(
  Math.max(
    ...salePlanIds.map(
      (plan) => (1 - sale.prices[plan] / proPlans[plan].price) * 100
    )
  )
)

function SaleBanner() {
  const active = useSaleActive()

  if (!active) return null

  return (
    <TrackedLink
      href="/pricing"
      event="Pro link clicked"
      eventProps={{ from: "sale-banner", to: "/pricing" }}
      className="group flex min-h-9 items-center justify-center gap-x-2 bg-foreground px-4 py-2 text-center text-sm text-background outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-inset"
    >
      <span className="text-pretty">
        <span className="font-semibold">
          {sale.name}: up to {maxPercentOff}% off HextaUI Pro
        </span>
        <span className="max-sm:hidden">
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          Solo{" "}
          <s className="opacity-60">
            <span className="sr-only">was </span>${proPlans.solo.price}
          </s>{" "}
          <span className="tabular-nums">{formatPrice(sale.prices.solo)}</span>
          , Team{" "}
          <s className="opacity-60">
            <span className="sr-only">was </span>${proPlans.team.price}
          </s>{" "}
          <span className="tabular-nums">{formatPrice(sale.prices.team)}</span>
        </span>
        <span aria-hidden="true"> · </span>
        <span className="sr-only">, </span>
        <span className="opacity-75">Ends {sale.endsLabel}</span>
      </span>
      <IconArrowRight
        aria-hidden="true"
        className="size-3.5 shrink-0 transition-transform duration-150 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none rtl:-scale-x-100"
      />
    </TrackedLink>
  )
}

export { SaleBanner }
