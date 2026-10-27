"use client"

import * as React from "react"
import { IconX } from "@tabler/icons-react"
import { cn } from "cn"

import { useToolApp } from "@/components/tools/shell/tool-app"
import { useIsPhone } from "@/components/tools/shell/use-tool-shortcut"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

type ToolSheetProps = {
  title: string
  description?: React.ReactNode
  action?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  children: React.ReactNode
}

function SheetPanel({
  title,
  description,
  action,
  footer,
  className,
  children,
}: ToolSheetProps) {
  const { sheetOpen, setSheetOpen } = useToolApp()
  const id = React.useId()
  const panelRef = React.useRef<HTMLDivElement>(null)
  const returnFocus = React.useRef<HTMLElement | null>(null)
  const [visited, setVisited] = React.useState(sheetOpen)
  if (sheetOpen && !visited) setVisited(true)

  React.useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    if (sheetOpen) {
      returnFocus.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null
      panel.focus({ preventScroll: true })
      return
    }
    if (panel.contains(document.activeElement)) {
      returnFocus.current?.focus({ preventScroll: true })
    }
  }, [sheetOpen])

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
      tabIndex={-1}
      inert={!sheetOpen}
      data-open={sheetOpen ? "" : undefined}
      data-slot="tool-sheet"
      onKeyDown={(event) => {
        if (event.key === "Escape" && !event.defaultPrevented) {
          event.stopPropagation()
          setSheetOpen(false)
        }
      }}
      className={cn(
        "pointer-events-none absolute end-3 top-15 bottom-3 z-30 flex w-96 translate-x-4 flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground opacity-0 shadow-lg ring-(length:--hairline) ring-foreground/10 outline-none transition duration-200 ease-out-cubic data-open:pointer-events-auto data-open:translate-x-0 data-open:opacity-100 motion-reduce:translate-x-0 motion-reduce:transition-opacity rtl:-translate-x-4 rtl:data-open:translate-x-0 forced-colors:border forced-colors:not-data-open:hidden",
        className
      )}
    >
      <div className="flex shrink-0 items-start gap-2 border-b px-4 py-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h2 id={`${id}-title`} className="text-sm font-medium">
            {title}
          </h2>
          {description ? (
            <p id={`${id}-description`} className="text-xs text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {action}
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Close"
          className="-me-1.5 -mt-1"
          onClick={() => setSheetOpen(false)}
        >
          <IconX />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {visited ? children : null}
      </div>
      {footer ? <div className="shrink-0 border-t p-3">{footer}</div> : null}
    </div>
  )
}

function SheetDrawer({ title, description, action, footer, children }: ToolSheetProps) {
  const { sheetOpen, setSheetOpen } = useToolApp()

  return (
    <Drawer open={sheetOpen} onOpenChange={setSheetOpen}>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center justify-between gap-2">
            <DrawerTitle>{title}</DrawerTitle>
            {action}
          </div>
          {description ? <DrawerDescription>{description}</DrawerDescription> : null}
        </DrawerHeader>
        <DrawerBody>
          <div className="-mx-4">{children}</div>
        </DrawerBody>
        {footer ? <div className="shrink-0 border-t p-3">{footer}</div> : null}
      </DrawerContent>
    </Drawer>
  )
}

function ToolSheet(props: ToolSheetProps) {
  const isPhone = useIsPhone()
  return isPhone ? <SheetDrawer {...props} /> : <SheetPanel {...props} />
}

export { ToolSheet }
