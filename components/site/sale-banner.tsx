"use client"

import { IconArrowRight } from "@tabler/icons-react"

import { fill } from "@/components/blocks/block-buy"
import { TrackedLink } from "@/components/site/tracked-link"
import { useChrome } from "@/lib/i18n/chrome"
import {
  formatPrice,
  proPlans,
  sale,
  salePlanIds,
  type SalePlanId,
} from "@/lib/pro/pricing"
import { useSaleActive } from "@/lib/pro/use-sale"

const maxPercentOff = Math.round(
  Math.max(
    ...salePlanIds.map(
      (plan) => (1 - sale.prices[plan] / proPlans[plan].price) * 100
    )
  )
)

function SalePrice({ plan, was }: { plan: SalePlanId; was: string }) {
  return (
    <span className="whitespace-nowrap">
      {proPlans[plan].name}{" "}
      <s className="text-white/45 decoration-white/45">
        <span className="sr-only">{was} </span>${proPlans[plan].price}
      </s>{" "}
      <span className="font-medium text-white tabular-nums">
        {formatPrice(sale.prices[plan])}
      </span>
    </span>
  )
}

function SaleBanner() {
  const active = useSaleActive()
  const c = useChrome()

  if (!active) return null

  const was = c("was")

  return (
    <TrackedLink
      href="/pricing"
      event="Pro link clicked"
      eventProps={{ from: "sale-banner", to: "/pricing" }}
      className="group relative z-50 block bg-brand-ink text-white/75 outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-inset"
    >
      <span className="frame-width flex min-h-10 items-center justify-center gap-x-3 px-4 py-2 text-sm">
        <span className="shrink-0 rounded-full bg-brand px-2 py-0.5 text-xs font-medium text-brand-foreground">
          {c("Black Friday")}
        </span>
        <span className="min-w-0 text-pretty">
          <span className="text-white">
            {fill(c("Up to {percent}% off Pro until Cyber Monday"), {
              percent: maxPercentOff,
            })}
          </span>
          <span className="max-md:hidden">
            <span aria-hidden="true" className="px-2 text-white/30">
              /
            </span>
            <span className="sr-only">, </span>
            <SalePrice plan="solo" was={was} />
            <span aria-hidden="true" className="px-2 text-white/30">
              /
            </span>
            <span className="sr-only">, </span>
            <SalePrice plan="team" was={was} />
          </span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 font-medium text-white max-sm:hidden">
          {c("Get the deal")}
          <IconArrowRight
            aria-hidden="true"
            className="size-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none rtl:-scale-x-100"
          />
        </span>
      </span>
    </TrackedLink>
  )
}

export { SaleBanner }
