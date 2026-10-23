"use client"

import { UnlessPro } from "@/components/blocks/unless-pro"
import { TrackedLink } from "@/components/site/tracked-link"
import { Button } from "@/components/ui/button"
import { useChrome } from "@/lib/i18n/chrome"
import { earlyBirdLastDay, proPlans, refundDays } from "@/lib/pro/pricing"
import { useEarlyBird, useSoloPrice } from "@/lib/pro/use-early-bird"

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

function BlockBuyBar({ name, count }: { name: string; count: number }) {
  const c = useChrome()

  return (
    <UnlessPro>
      <div className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-sm font-medium">
            {c("This preview is the real block, running live.")}
          </p>
          <p className="text-sm text-pretty text-muted-foreground">
            <BlockPriceNote count={count} />
          </p>
        </div>
        <div className="shrink-0">
          <BlockBuyButton name={name} from="block-preview" />
        </div>
      </div>
    </UnlessPro>
  )
}

export { BlockBuyBar, BlockBuyButton, BlockPriceNote, fill }
