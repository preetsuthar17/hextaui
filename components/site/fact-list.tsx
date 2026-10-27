import type * as React from "react"
import { cn } from "cn"

type Fact = { label: string; value: React.ReactNode }

const factLinkClassName =
  "rounded-sm text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors duration-150 ease-out-cubic outline-none hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden motion-reduce:transition-none"

function FactList({
  facts,
  label,
  className,
}: {
  facts: Fact[]
  label: string
  className?: string
}) {
  return (
    <dl
      aria-label={label}
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3",
        className
      )}
    >
      {facts.map((fact) => (
        <div key={fact.label} className="flex min-w-0 flex-col gap-0.5">
          <dt className="text-muted-foreground">{fact.label}</dt>
          <dd className="min-w-0 text-pretty text-foreground tabular-nums">
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export { FactList, factLinkClassName, type Fact }
