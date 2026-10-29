"use client"

import { cn } from "cn"

import { useInAppBrowserGate } from "@/components/site/open-in-browser"
import { Button, buttonVariants } from "@/components/ui/button"
import { startCheckout } from "@/lib/auth-client"
import { proPlans, refundDays, type SalePlanId } from "@/lib/pro/pricing"
import { useEarlyBird } from "@/lib/pro/use-early-bird"

function usePlanPrice(plan: SalePlanId) {
  const early = useEarlyBird()
  return early ? proPlans[plan].earlyPrice : proPlans[plan].price
}

function CheckoutButton({
  plan,
  className,
}: {
  plan: SalePlanId
  className?: string
}) {
  const { guard, dialog } = useInAppBrowserGate()
  const price = usePlanPrice(plan)
  const primary = plan === "solo"

  return (
    <>
      <Button
        size="lg"
        variant={primary ? "default" : "outline"}
        className={className}
        feedback
        successLabel="Redirecting…"
        errorLabel="Try again"
        onClick={() => guard("checkout", () => startCheckout(plan))}
      >
        {primary
          ? `Get ${proPlans[plan].name} for $${price}`
          : `Get ${proPlans[plan].name}`}
      </Button>
      {dialog}
    </>
  )
}

function PricingActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-start gap-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <CheckoutButton plan="solo" />
        <a
          href="#pricing-blocks"
          className={buttonVariants({ size: "lg", variant: "ghost" })}
        >
          See what’s included
        </a>
      </div>
      <p className="text-sm text-muted-foreground">
        One payment, no subscription. {refundDays}-day refund, no questions
        asked.
      </p>
    </div>
  )
}

export { CheckoutButton, PricingActions }
