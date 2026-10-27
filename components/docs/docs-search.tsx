"use client"

import * as React from "react"
import { IconSearch } from "@tabler/icons-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { KbdGroup } from "@/components/ui/kbd"
import { matchesHotkey } from "@/lib/hotkey"
import { useChrome } from "@/lib/i18n/chrome"

const loadDialog = () => import("@/components/docs/docs-search-dialog")

const DocsSearchDialog = React.lazy(() =>
  loadDialog().then((module) => ({ default: module.DocsSearchDialog }))
)

function prefetchSearch() {
  loadDialog()
    .then((module) => module.prefetchIndex())
    .catch(() => {})
}

type DocsSearchContextValue = {
  open: () => void
}

const DocsSearchContext = React.createContext<DocsSearchContextValue | null>(
  null
)

function isEditable(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.closest("input, textarea, select, [contenteditable='true']") !==
        null)
  )
}

function whenIdle(callback: () => void) {
  if (typeof requestIdleCallback === "function") {
    const id = requestIdleCallback(callback, { timeout: 4000 })
    return () => cancelIdleCallback(id)
  }
  const id = setTimeout(callback, 2000)
  return () => clearTimeout(id)
}

function DocsSearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  const show = React.useCallback(() => {
    setMounted(true)
    setOpen(true)
  }, [])

  React.useEffect(() => {
    let cancel = () => {}
    const prefetch = () => {
      cancel = whenIdle(() => {
        loadDialog().catch(() => {})
      })
    }
    if (document.readyState === "complete") prefetch()
    else window.addEventListener("load", prefetch, { once: true })
    return () => {
      window.removeEventListener("load", prefetch)
      cancel()
    }
  }, [])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        document.querySelector("[data-block-preview]")
      ) {
        return
      }
      if (matchesHotkey(event, "mod+k")) {
        event.preventDefault()
        setMounted(true)
        setOpen((current) => !current)
      } else if (matchesHotkey(event, "/") && !isEditable(event.target)) {
        event.preventDefault()
        setMounted(true)
        setOpen(true)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const context = React.useMemo(() => ({ open: show }), [show])

  return (
    <DocsSearchContext.Provider value={context}>
      {children}
      {mounted ? (
        <React.Suspense fallback={null}>
          <DocsSearchDialog open={open} onOpenChange={setOpen} />
        </React.Suspense>
      ) : null}
    </DocsSearchContext.Provider>
  )
}

function useDocsSearch() {
  const context = React.useContext(DocsSearchContext)
  if (!context) {
    throw new Error("useDocsSearch must be used within <DocsSearchProvider>.")
  }
  return context
}

function DocsSearchTrigger({ className }: { className?: string }) {
  const { open } = useDocsSearch()
  const c = useChrome()

  return (
    <button
      type="button"
      onClick={open}
      onPointerEnter={prefetchSearch}
      onFocus={prefetchSearch}
      aria-keyshortcuts="Meta+K Control+K /"
      className={cn(
        "flex h-8 w-full items-center gap-2 rounded-md bg-muted/60 ps-2 pe-1.5 text-sm text-muted-foreground transition-colors duration-150 outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden motion-reduce:transition-none",
        className
      )}
    >
      <IconSearch aria-hidden="true" className="size-4 shrink-0" />
      <span className="flex-1 truncate text-start">{c("Search docs")}</span>
      <KbdGroup aria-hidden="true" variant="keycap" size="sm" keys="mod+k" />
    </button>
  )
}

function DocsSearchButton({ className }: { className?: string }) {
  const { open } = useDocsSearch()

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Search docs"
      aria-keyshortcuts="Meta+K Control+K /"
      onClick={open}
      onPointerEnter={prefetchSearch}
      onFocus={prefetchSearch}
      className={className}
    >
      <IconSearch />
    </Button>
  )
}

export { DocsSearchButton, DocsSearchProvider, DocsSearchTrigger }
