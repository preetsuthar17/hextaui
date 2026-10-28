"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "cn"

import { applyTheme, type ThemeVars } from "@/lib/page-builder/theme"

const frameDocument =
  '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div data-pb-root=""></div></body></html>'

function syncStyles(target: Document) {
  const head = target.head
  for (const node of Array.from(head.querySelectorAll("[data-pb-style]")))
    node.remove()
  for (const node of Array.from(
    document.head.querySelectorAll('link[rel="stylesheet"], style')
  )) {
    const copy = node.cloneNode(true) as HTMLElement
    copy.setAttribute("data-pb-style", "")
    head.appendChild(copy)
  }
}

function syncRootClass(target: Document, dark: boolean) {
  const classes = Array.from(document.documentElement.classList).filter(
    (name) => name !== "dark" && name !== "light"
  )
  target.documentElement.className = [...classes, dark ? "dark" : "light"].join(
    " "
  )
  target.documentElement.style.colorScheme = dark ? "dark" : "light"
  target.documentElement.style.scrollbarGutter = "auto"
  target.documentElement.style.overflow = "hidden"
}

type FrameDevice = "desktop" | "tablet" | "phone"

function CanvasFrame({
  width,
  device,
  dark,
  theme,
  title,
  onKeyDown,
  onScale,
  overlay,
  children,
}: {
  width: number
  device: FrameDevice
  dark: boolean
  theme: ThemeVars
  title: string
  onKeyDown?: (event: KeyboardEvent) => void
  onScale?: (scale: number) => void
  overlay?: React.ReactNode
  children: React.ReactNode
}) {
  const frameRef = React.useRef<HTMLIFrameElement>(null)
  const outerRef = React.useRef<HTMLDivElement>(null)
  const [mount, setMount] = React.useState<HTMLElement | null>(null)
  const [height, setHeight] = React.useState(720)
  const [available, setAvailable] = React.useState(0)
  const keyHandler = React.useRef(onKeyDown)

  React.useEffect(() => {
    keyHandler.current = onKeyDown
  }, [onKeyDown])

  const attach = React.useCallback(() => {
    const target = frameRef.current?.contentDocument
    const root = target?.querySelector<HTMLElement>("[data-pb-root]")
    if (!target || !root) return
    syncStyles(target)
    setMount(root)
  }, [])

  React.useEffect(() => {
    if (!mount) return
    const target = mount.ownerDocument
    const observer = new MutationObserver(() => syncStyles(target))
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
      attributeFilter: ["href", "media", "disabled"],
    })
    const view = target.defaultView
    const onKey = (event: KeyboardEvent) => keyHandler.current?.(event)
    view?.addEventListener("keydown", onKey)
    const resize = new ResizeObserver(() => {
      setHeight(Math.max(320, Math.ceil(mount.getBoundingClientRect().height)))
    })
    resize.observe(mount)
    return () => {
      observer.disconnect()
      resize.disconnect()
      view?.removeEventListener("keydown", onKey)
    }
  }, [mount])

  React.useEffect(() => {
    if (!mount) return
    syncRootClass(mount.ownerDocument, dark)
  }, [mount, dark])

  React.useEffect(() => {
    if (!mount) return
    applyTheme(theme, mount.ownerDocument.documentElement)
  }, [mount, theme])

  const scale = available > 0 ? Math.min(1, available / width) : 1

  React.useEffect(() => {
    onScale?.(scale)
  }, [onScale, scale])

  React.useEffect(() => {
    const outer = outerRef.current
    if (!outer) return
    const observer = new ResizeObserver(([entry]) => {
      setAvailable(Math.floor(entry.contentRect.width))
    })
    observer.observe(outer)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={outerRef} className="flex w-full justify-center">
      <div
        data-pb-device={device}
        className="relative h-(--pb-outer-h) w-(--pb-outer-w) shrink-0 motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out-cubic"
        style={
          {
            "--pb-outer-w": `${width * scale}px`,
            "--pb-outer-h": `${height * scale}px`,
            "--pb-frame-w": `${width}px`,
            "--pb-frame-h": `${height}px`,
            "--pb-scale": scale,
          } as React.CSSProperties
        }
      >
        <div
          className={cn(
            "absolute inset-0 overflow-hidden bg-background ring-(length:--hairline) ring-foreground/10 forced-colors:border",
            device === "phone"
              ? "rounded-3xl"
              : device === "tablet"
                ? "rounded-2xl"
                : "rounded-xl"
          )}
        >
          <iframe
            ref={frameRef}
            title={title}
            srcDoc={frameDocument}
            onLoad={attach}
            className="absolute top-0 left-0 block h-(--pb-frame-h) w-(--pb-frame-w) origin-top-left scale-(--pb-scale) border-0 motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out-cubic"
          />
        </div>
        {mount ? overlay : null}
        {mount ? createPortal(children, mount) : null}
      </div>
    </div>
  )
}

export { CanvasFrame, type FrameDevice }
