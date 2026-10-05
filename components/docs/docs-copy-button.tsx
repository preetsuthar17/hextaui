"use client"

import * as React from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

function DocsCopyButton({
  value,
  label = "Copy code",
  className,
}: {
  value: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) {
      return
    }

    const timer = setTimeout(() => setCopied(false), 1500)

    return () => {
      clearTimeout(timer)
    }
  }, [copied])

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
        } catch {
          setCopied(false)
        }
      }}
    >
      <span
        data-copied={copied ? "" : undefined}
        className="group/copy relative grid size-4 place-items-center"
      >
        <IconCopy className="col-start-1 row-start-1 transition-all duration-200 ease-out-quint group-data-copied/copy:scale-50 group-data-copied/copy:opacity-0 motion-reduce:transition-none" />
        <IconCheck className="col-start-1 row-start-1 scale-50 opacity-0 transition-all duration-200 ease-out-quint group-data-copied/copy:scale-100 group-data-copied/copy:opacity-100 motion-reduce:transition-none" />
      </span>
      <span role="status" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </Button>
  )
}

export { DocsCopyButton }
