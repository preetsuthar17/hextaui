"use client"

import * as React from "react"
import { cn } from "cn"

import { renderNode } from "@/components/page-builder/render-node"
import type { Props } from "@/lib/page-builder/fields"
import { getSection } from "@/lib/page-builder/registry"
import { applyTheme, type ThemeVars } from "@/lib/page-builder/theme"

const thumbWidth = 1280

function ThemedScope({
  vars,
  dark,
  className,
  children,
}: {
  vars: ThemeVars
  dark: boolean
  className?: string
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    if (ref.current) applyTheme(vars, ref.current)
  }, [vars])

  return (
    <div
      ref={ref}
      data-color-scheme={dark ? undefined : "light"}
      className={cn(dark && "dark", "bg-background text-foreground", className)}
    >
      {children}
    </div>
  )
}

function useZoom<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [zoom, setZoom] = React.useState(0)

  React.useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      setZoom(entry.contentRect.width / thumbWidth)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, zoom] as const
}

const LiveSections = React.memo(function LiveSections({
  items,
}: {
  items: { sectionId: string; props: Props }[]
}) {
  return (
    <>
      {items.map((item, index) => {
        const section = getSection(item.sectionId)
        return section ? (
          <React.Fragment key={index}>{renderNode(section.build(item.props))}</React.Fragment>
        ) : null
      })}
    </>
  )
})

function LiveThumb({
  items,
  vars,
  dark,
  align = "center",
  className,
}: {
  items: { sectionId: string; props: Props }[]
  vars: ThemeVars
  dark: boolean
  align?: "center" | "start"
  className?: string
}) {
  const [ref, zoom] = useZoom<HTMLDivElement>()

  return (
    <div
      ref={ref}
      inert
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative overflow-hidden select-none",
        className
      )}
    >
      <ThemedScope
        vars={vars}
        dark={dark}
        className={cn(
          "flex size-full flex-col",
          align === "center" ? "justify-center-safe" : "justify-start"
        )}
      >
        {zoom > 0 ? (
          <div
            className="w-320 shrink-0 [zoom:var(--pb-zoom)]"
            style={{ "--pb-zoom": zoom } as React.CSSProperties}
          >
            <LiveSections items={items} />
          </div>
        ) : null}
      </ThemedScope>
    </div>
  )
}

export { LiveThumb, ThemedScope }
