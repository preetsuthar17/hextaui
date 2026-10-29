"use client"

import * as React from "react"
import { cn } from "cn"

import { useChrome } from "@/lib/i18n/chrome"

const subscribe = () => () => {}

function NewDot({
  until,
  className,
}: {
  until?: string
  className?: string
}) {
  const c = useChrome()
  const fresh = React.useSyncExternalStore(
    subscribe,
    () => (until ? Date.now() < Date.parse(until) : false),
    () => Boolean(until)
  )

  if (!fresh) return null

  return (
    <span
      data-slot="new-dot"
      className={cn(
        "inline-flex size-1.5 shrink-0 rounded-full bg-info forced-colors:border",
        className
      )}
    >
      <span className="sr-only">{c("New")}</span>
    </span>
  )
}

export { NewDot }
