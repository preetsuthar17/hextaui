"use client"

import * as React from "react"
import { cn } from "cn"

import { DocsCopyButton } from "@/components/docs/docs-copy-button"
import { Button } from "@/components/ui/button"

function DocsCodePanel({
  html,
  code,
  collapsible = false,
  copyable = true,
  className,
}: {
  html: string
  code: string
  collapsible?: boolean
  copyable?: boolean
  className?: string
}) {
  const [expanded, setExpanded] = React.useState(false)
  const viewportRef = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || !collapsible) {
      return
    }

    viewport.style.height = expanded ? `${viewport.scrollHeight}px` : ""
  }, [collapsible, expanded])

  return (
    <div
      data-collapsible={collapsible ? "" : undefined}
      data-expanded={expanded ? "" : undefined}
      className={cn("group/code relative min-w-0", className)}
    >
      <div
        ref={viewportRef}
        inert={collapsible && !expanded}
        className="overflow-hidden transition-all duration-300 ease-out-quint group-data-collapsible/code:h-44 group-data-expanded/code:pb-12 motion-reduce:transition-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {collapsible ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-end justify-center bg-linear-to-t from-muted via-muted/80 to-transparent pb-3 transition-opacity duration-300 group-data-expanded/code:bg-none">
          <Button
            variant="outline"
            size="sm"
            aria-expanded={expanded}
            className="pointer-events-auto"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Collapse" : "View code"}
          </Button>
        </div>
      ) : null}
      {copyable ? (
        <span className="absolute end-2 top-2 rounded-md bg-muted">
          <DocsCopyButton value={code} />
        </span>
      ) : null}
    </div>
  )
}

export { DocsCodePanel }
