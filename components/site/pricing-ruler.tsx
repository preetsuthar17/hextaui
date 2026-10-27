"use client"

import * as React from "react"
import Link from "@/components/site/link"
import { IconCheck } from "@tabler/icons-react"
import { cn } from "cn"

import { useInAppBrowserGate } from "@/components/site/open-in-browser"
import { Button, buttonVariants } from "@/components/ui/button"
import { NumberFlow } from "@/components/ui/number-flow"
import { startCheckout } from "@/lib/auth-client"
import { earlyBirdLastDay, proPlans, type SalePlanId } from "@/lib/pro/pricing"
import { useEarlyBird } from "@/lib/pro/use-early-bird"

type PricingPlanId = "free" | SalePlanId

type PricingPlan = {
  id: PricingPlanId
  name: string
  seats: string
  features: string[]
}

const rulerMax = 300
const rulerTicks = [0, 100, 200, 300]

function planPrices(id: PricingPlanId, early: boolean) {
  if (id === "free") return { now: 0, was: null }
  const plan = proPlans[id]
  return {
    now: early ? plan.earlyPrice : plan.price,
    was: early ? plan.price : null,
  }
}

function cssVars(vars: Record<string, string>) {
  return (node: HTMLElement | null) => {
    if (!node) return
    for (const [key, value] of Object.entries(vars)) {
      node.style.setProperty(key, value)
    }
  }
}

function useInView<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null)
  const [seen, setSeen] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, seen] as const
}

function PlanButton({ plan }: { plan: SalePlanId }) {
  const { guard, dialog } = useInAppBrowserGate()

  return (
    <>
      <Button
        size="lg"
        variant={plan === "solo" ? "default" : "outline"}
        className="w-full"
        feedback
        successLabel="Redirecting…"
        errorLabel="Try again"
        onClick={() => guard("checkout", () => startCheckout(plan))}
      >
        Get {proPlans[plan].name}
      </Button>
      {dialog}
    </>
  )
}

function FreePlanLink() {
  return (
    <Link
      href="/docs/installation"
      className={cn(
        buttonVariants({ size: "lg", variant: "outline" }),
        "w-full"
      )}
    >
      Get started
    </Link>
  )
}

function PricingRuler({ plans }: { plans: PricingPlan[] }) {
  const early = useEarlyBird()
  const [ref, seen] = useInView<HTMLDivElement>()
  const [active, setActive] = React.useState<PricingPlanId | null>(null)
  const rows = plans.map((plan, index) => ({
    plan,
    index,
    ...planPrices(plan.id, early),
  }))
  const state = (id: PricingPlanId) => ({
    "data-active": active === id || undefined,
    "data-dim": (active !== null && active !== id) || undefined,
  })

  return (
    <div
      ref={ref}
      className="flex flex-col"
      data-run={seen || undefined}
      onPointerLeave={() => setActive(null)}
    >
      {early ? (
        <p className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="pricing-ruler-key-dot" aria-hidden="true" />
            Early-bird price
          </span>
          <span className="flex items-center gap-2">
            <span className="pricing-ruler-key-ring" aria-hidden="true" />
            Regular price
          </span>
          <span className="flex items-center gap-2">
            <span className="pricing-ruler-key-stripe" aria-hidden="true" />
            What you save, until {earlyBirdLastDay}
          </span>
        </p>
      ) : null}
      <div className="pricing-ruler-scale" aria-hidden="true">
        <div className="pricing-ruler-track" />
        {rulerTicks.map((value) => (
          <span
            key={value}
            ref={cssVars({ "--p": String(value) })}
            className="pricing-ruler-tick"
            data-edge={
              value === 0 ? "start" : value === rulerMax ? "end" : undefined
            }
          >
            ${value}
          </span>
        ))}
        {rows.map(({ plan, now, was }) =>
          was === null ? null : (
            <React.Fragment key={plan.id}>
              <span
                ref={cssVars({ "--from": String(now), "--to": String(was) })}
                className="pricing-ruler-saving"
                {...state(plan.id)}
              />
              <span
                ref={cssVars({ "--p": String(was) })}
                className="pricing-ruler-ghost"
                {...state(plan.id)}
              />
            </React.Fragment>
          )
        )}
        {rows.map(({ plan, now, was }) => {
          const at = !seen && was !== null ? was : now
          return (
            <span
              key={plan.id}
              ref={cssVars({ "--p": String(at) })}
              className="pricing-ruler-pin"
              data-plan={plan.id}
              onPointerEnter={() => setActive(plan.id)}
              {...state(plan.id)}
            >
              <span className="pricing-ruler-pin-label">
                <span className="text-muted-foreground">{plan.name}</span>
                <NumberFlow
                  value={at}
                  prefix="$"
                  duration={1100}
                  className="font-semibold tabular-nums"
                />
              </span>
            </span>
          )
        })}
      </div>
      <svg
        className="pricing-ruler-links hidden lg:block"
        viewBox="0 0 100 64"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {rows.map(({ plan, index, now }) => {
          const from = (now / rulerMax) * 100
          const to = ((index + 0.5) / rows.length) * 100
          return (
            <path
              key={plan.id}
              className="pricing-ruler-link"
              d={`M ${from} 0 C ${from} 34, ${to} 30, ${to} 64`}
              vectorEffect="non-scaling-stroke"
              {...state(plan.id)}
            />
          )
        })}
      </svg>
      <ul className="mt-10 grid gap-y-12 sm:grid-cols-3 sm:gap-x-8 lg:mt-0 lg:gap-x-0">
        {rows.map(({ plan, now, was }) => (
          <li
            key={plan.id}
            className="pricing-ruler-plan flex flex-col gap-5"
            data-plan={plan.id}
            onPointerEnter={() => setActive(plan.id)}
            onFocus={() => setActive(plan.id)}
            onBlur={() => setActive(null)}
            {...state(plan.id)}
          >
            <div className="flex flex-col gap-1 lg:items-center lg:text-center">
              <h3 className="font-medium">{plan.name}</h3>
              <p className="text-sm text-muted-foreground">{plan.seats}</p>
            </div>
            <div className="flex flex-col gap-1.5 lg:items-center">
              <p className="flex items-baseline gap-2 tabular-nums">
                <span className="marketing-number font-semibold">
                  {was !== null ? (
                    <span className="sr-only">Early bird price </span>
                  ) : null}
                  ${now}
                </span>
                {was !== null ? (
                  <del className="text-sm text-muted-foreground">
                    <span className="sr-only">Regular price </span>${was}
                  </del>
                ) : null}
              </p>
              <p className="text-xs font-medium">
                {was !== null ? (
                  <span className="text-brand-strong">
                    Save ${was - now}, paid once
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    {plan.id === "free" ? "Free forever" : "Paid once"}
                  </span>
                )}
              </p>
            </div>
            <ul className="flex flex-col gap-2 border-t pt-5 text-sm">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-pretty"
                >
                  <IconCheck
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-1">
              {plan.id === "free" ? (
                <FreePlanLink />
              ) : (
                <PlanButton plan={plan.id} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { PricingRuler, type PricingPlan }
