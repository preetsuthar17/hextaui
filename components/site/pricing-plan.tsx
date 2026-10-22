"use client"

import Link from "@/components/site/link"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { startCheckout } from "@/lib/auth-client"
import { earlyBirdLastDay, proPlans, type ProPlanId } from "@/lib/pro/pricing"
import { useEarlyBird } from "@/lib/pro/use-early-bird"

function PlanPrice({ plan }: { plan: ProPlanId }) {
  const early = useEarlyBird()
  const { earlyPrice, price } = proPlans[plan]

  return (
    <div className="flex flex-col gap-1">
      <p className="flex items-baseline gap-2 tabular-nums">
        <span className="marketing-number">
          {early ? <span className="sr-only">Early bird price </span> : null}$
          {early ? earlyPrice : price}
        </span>
        {early ? (
          <del className="text-sm text-muted-foreground">
            <span className="sr-only">Regular price </span>${price}
          </del>
        ) : null}
        <span className="text-sm text-muted-foreground">once</span>
      </p>
      <p className="text-sm text-muted-foreground">
        {early
          ? `Early bird until ${earlyBirdLastDay}`
          : "One payment, no subscription"}
      </p>
    </div>
  )
}

function EarlyBirdBadge() {
  const early = useEarlyBird()
  if (!early) return null
  return (
    <Badge appearance="muted" shape="pill">
      Early bird
    </Badge>
  )
}

function PlanButton({ plan }: { plan: ProPlanId }) {
  return (
    <Button
      size="lg"
      variant={plan === "solo" ? "default" : "outline"}
      className="w-full"
      feedback
      successLabel="Redirecting…"
      errorLabel="Try again"
      onClick={() => startCheckout(plan)}
    >
      Get {proPlans[plan].name}
    </Button>
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

export { EarlyBirdBadge, FreePlanLink, PlanButton, PlanPrice }
