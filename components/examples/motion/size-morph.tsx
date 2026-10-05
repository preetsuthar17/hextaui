"use client"

import * as React from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"

import { useSizeMorph } from "@/lib/motion"

export function MotionSizeMorph() {
  const [copied, setCopied] = React.useState(false)
  const morphRef = useSizeMorph<HTMLButtonElement>({ axis: "width" })

  React.useEffect(() => {
    if (!copied) {
      return
    }
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <button
      ref={morphRef}
      type="button"
      onClick={() => setCopied(true)}
      className="inline-flex h-9 items-center gap-1.5 overflow-hidden rounded-md bg-secondary px-3 text-sm font-medium whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden"
    >
      {copied ? (
        <IconCheck className="size-4 shrink-0" />
      ) : (
        <IconCopy className="size-4 shrink-0" />
      )}
      {copied ? "Copied to clipboard" : "Copy"}
    </button>
  )
}
