"use client"

import { UnlessPro } from "@/components/blocks/unless-pro"
import { TrackedLink } from "@/components/site/tracked-link"
import { useInAppBrowserGate } from "@/components/site/open-in-browser"
import { Button } from "@/components/ui/button"
import { startCheckout } from "@/lib/auth-client"
import { useChrome } from "@/lib/i18n/chrome"
import { earlyBirdLastDay, proPlans, refundDays } from "@/lib/pro/pricing"
import { useEarlyBird, useSoloPrice } from "@/lib/pro/use-early-bird"
import { track } from "@/lib/track"

function fill(text: string, values: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  )
}

function BlockBuyButton({
  name,
  from,
  size = "default",
  short = false,
  pro = false,
}: {
  name?: string
  from: string
  size?: "sm" | "default"
  short?: boolean
  pro?: boolean
}) {
  const c = useChrome()
  const price = useSoloPrice()

  return (
    <Button
      size={size}
      nativeButton={false}
      render={
        <TrackedLink
          href="/pricing"
          event="Pro link clicked"
          eventProps={{ from, to: "/pricing", ...(name ? { block: name } : {}) }}
        />
      }
    >
      {pro ? (
        c("Get Pro")
      ) : short ? (
        <>
          <span className="sm:hidden">{c("Get Pro")}</span>
          <span className="max-sm:hidden">{c("Get the full block")}</span>
        </>
      ) : (
        c("Get the full block")
      )}
      <span aria-hidden="true">—</span>
      <span className="tabular-nums">${price}</span>
    </Button>
  )
}

function BlockPriceNote({ count }: { count: number }) {
  const c = useChrome()
  const early = useEarlyBird()
  const price = useSoloPrice()

  return (
    <>
      {fill(
        c(
          "One payment of {price} unlocks the source of this block and all {count} others, plus every block added later."
        ),
        { price: `$${price}`, count: count - 1 }
      )}{" "}
      {early
        ? fill(c("Early-bird price until {date}, then {regular}."), {
            date: earlyBirdLastDay,
            regular: `$${proPlans.solo.price}`,
          })
        : null}{" "}
      {fill(c("Refundable within {days} days."), { days: refundDays })}
    </>
  )
}

function BlockCheckoutButton({ name, from }: { name: string; from: string }) {
  const c = useChrome()
  const { guard, dialog } = useInAppBrowserGate()

  return (
    <>
      <Button
        size="sm"
        feedback
        successLabel={c("Redirecting…")}
        errorLabel={c("Try again")}
        onClick={() => {
          track("Pro link clicked", { from, to: "checkout", block: name })
          return guard("checkout", () => startCheckout("solo"))
        }}
      >
        {c("Get Pro")}
      </Button>
      {dialog}
    </>
  )
}

function BlockBuyBar({
  name,
  count,
  free = false,
}: {
  name: string
  count: number
  free?: boolean
}) {
  const c = useChrome()
  const early = useEarlyBird()
  const price = useSoloPrice()

  return (
    <UnlessPro
      fallback={
        <p className="text-sm text-muted-foreground">
          {c("Included in your HextaUI Pro.")}{" "}
          <a
            href="#installation"
            className="text-foreground underline underline-offset-4"
          >
            {c("Install it")}
          </a>
        </p>
      }
    >
      <div className="flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="min-w-0 text-sm text-pretty text-muted-foreground">
          <span className="font-medium text-foreground">
            {free
              ? c("Free to install")
              : c("Part of HextaUI Pro")}
          </span>
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          {free
            ? fill(c("The other {count} blocks come with Pro"), { count })
            : fill(c("all {count} blocks"), { count })}
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          <span className="tabular-nums">
            {early ? <del>${proPlans.solo.price}</del> : null}
            {early ? " " : null}
            {fill(c("{price} one-time"), { price: `$${price}` })}
          </span>
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          <TrackedLink
            href="/pricing"
            event="Pro link clicked"
            eventProps={{ from: "block-preview", to: "/pricing", block: name }}
            className="text-foreground underline underline-offset-4"
          >
            {c("Compare plans")}
          </TrackedLink>
        </p>
        <div className="shrink-0">
          <BlockCheckoutButton name={name} from="block-preview" />
        </div>
      </div>
    </UnlessPro>
  )
}

export { BlockBuyBar, BlockBuyButton, BlockPriceNote, fill }
