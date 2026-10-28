"use client"

import * as React from "react"
import Image from "next/image"
import {
  IconArrowDown,
  IconCheck,
  IconDownload,
  IconLayoutNavbar,
  IconLink,
  IconPalette,
  IconQuote,
  IconSelector,
  type Icon,
} from "@tabler/icons-react"
import { cn } from "cn"

import Link from "@/components/site/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getLiveTools, getToolHref } from "@/lib/tools"

const toolIcons: Record<string, Icon> = {
  "theme-editor": IconPalette,
  "testimonial-wall": IconQuote,
  "page-builder": IconLayoutNavbar,
}

type ToolAppContextValue = {
  slug: string
  sheetOpen: boolean
  setSheetOpen: (open: boolean) => void
}

const ToolAppContext = React.createContext<ToolAppContextValue | null>(null)

function useToolApp() {
  const context = React.useContext(ToolAppContext)
  if (!context) throw new Error("Tool parts must be used within <ToolApp>.")
  return context
}

function ToolApp({
  slug,
  title,
  sheetOpen: controlledSheetOpen,
  onSheetOpenChange,
  className,
  children,
}: {
  slug: string
  title: string
  sheetOpen?: boolean
  onSheetOpenChange?: (open: boolean) => void
  className?: string
  children: React.ReactNode
}) {
  const [innerSheetOpen, setInnerSheetOpen] = React.useState(false)
  const sheetOpen = controlledSheetOpen ?? innerSheetOpen
  const setSheetOpen = React.useCallback(
    (open: boolean) => {
      onSheetOpenChange?.(open)
      if (controlledSheetOpen === undefined) setInnerSheetOpen(open)
    },
    [controlledSheetOpen, onSheetOpenChange]
  )
  const context = React.useMemo(
    () => ({ slug, sheetOpen, setSheetOpen }),
    [slug, sheetOpen, setSheetOpen]
  )

  return (
    <ToolAppContext.Provider value={context}>
      <section
        aria-labelledby="tool-title"
        data-slot="tool-app"
        data-sheet-open={sheetOpen ? "" : undefined}
        className={cn(
          "group/tool-app relative flex h-svh min-h-[32rem] flex-col overflow-hidden bg-background text-foreground",
          className
        )}
      >
        <h1 id="tool-title" className="sr-only">
          {title}
        </h1>
        {children}
      </section>
    </ToolAppContext.Provider>
  )
}

function ToolSwitcher() {
  const { slug } = useToolApp()
  const tools = getLiveTools()
  const current = tools.find((tool) => tool.slug === slug)
  const CurrentIcon = toolIcons[slug] ?? IconPalette

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
<Button variant="ghost" size="sm" />
        }
      >
        <CurrentIcon aria-hidden="true" className="text-muted-foreground" />
        <span className="truncate">{current?.title ?? "Tools"}</span>
        <IconSelector aria-hidden="true" className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={6} className="w-60">
        {tools.map((tool) => {
          const ToolIcon = toolIcons[tool.slug] ?? IconPalette
          return (
            <DropdownMenuItem
              key={tool.slug}
              render={<Link href={getToolHref(tool.slug)} />}
            >
              <ToolIcon aria-hidden="true" />
              <span className="flex-1 truncate">{tool.title}</span>
              {tool.slug === slug ? (
                <IconCheck aria-label="Current tool" className="ms-auto" />
              ) : null}
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/tools" />}>
          All free tools
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ToolTopBar({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <header
      data-slot="tool-top-bar"
      className={cn(
        "relative z-20 flex h-12 shrink-0 items-center gap-1 border-b bg-background px-2 sm:px-3",
        className
      )}
    >
      <Link
        href="/"
        aria-label="HextaUI home"
        className="grid size-8 shrink-0 place-items-center rounded-md outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-focus-ring forced-colors:border"
      >
        <Image
          src="/hextaui-logo.svg"
          alt=""
          width={20}
          height={20}
          unoptimized
          className="size-5"
        />
      </Link>
      <span aria-hidden="true" className="text-sm text-border select-none">
        /
      </span>
      <ToolSwitcher />
      <div className="ms-auto flex shrink-0 items-center gap-1.5">
        {children}
      </div>
    </header>
  )
}

function ToolShareButton({
  getUrl,
  onShare,
  label = "Share",
}: {
  getUrl: () => string | Promise<string>
  onShare?: () => void
  label?: string
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={label}
      onClick={async () => {
        const { toast } = await import("@/components/ui/toast")
        try {
          const url = await getUrl()
          await navigator.clipboard.writeText(url)
          toast.success("Link copied", {
            description: "Anyone with the link sees this exact setup.",
          })
          onShare?.()
        } catch {
          toast.error("Couldn’t copy the link")
        }
      }}
    >
      <IconLink data-icon="inline-start" />
      <span className="max-sm:sr-only">{label}</span>
    </Button>
  )
}

function ToolExportButton({
  label = "Export",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children"> & {
  label?: string
}) {
  return (
    <Button size="sm" {...props}>
      <IconDownload data-icon="inline-start" />
      {label}
    </Button>
  )
}

const canvasBackgrounds = {
  dots: "bg-[color-mix(in_oklab,var(--color-muted)_55%,var(--color-background))] bg-[radial-gradient(circle,var(--tool-dot)_0.75px,transparent_1px)] bg-size-[18px_18px] [--tool-dot:color-mix(in_oklab,var(--color-foreground)_14%,transparent)] dark:bg-[color-mix(in_oklab,var(--color-muted)_30%,var(--color-background))] dark:[--tool-dot:color-mix(in_oklab,var(--color-foreground)_12%,transparent)]",
  muted:
    "bg-[color-mix(in_oklab,var(--color-muted)_55%,var(--color-background))] dark:bg-[color-mix(in_oklab,var(--color-muted)_30%,var(--color-background))]",
  plain: "bg-background",
}

function ToolCanvas({
  ref,
  background = "dots",
  label,
  dock,
  aside,
  className,
  contentClassName,
  style,
  children,
}: {
  ref?: React.Ref<HTMLDivElement>
  background?: keyof typeof canvasBackgrounds
  label: string
  dock?: React.ReactNode
  aside?: React.ReactNode
  className?: string
  contentClassName?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <div
      data-slot="tool-stage"
      className="relative min-h-0 flex-1 lg:group-data-sheet-open/tool-app:pe-99"
    >
      <div className="relative size-full">
        <div
          ref={ref}
          role="region"
          aria-label={label}
          data-slot="tool-canvas"
          style={style}
          className={cn(
            "absolute inset-0 overflow-auto text-foreground [scrollbar-gutter:stable_both-edges] [scrollbar-width:thin]",
            canvasBackgrounds[background],
            className
          )}
        >
          <div
            className={cn(
              "flex min-h-full flex-col items-center px-3 pt-4 pb-20 sm:px-8 sm:pt-8 sm:pb-24",
              contentClassName
            )}
          >
            <div className="my-auto flex w-full min-w-0 flex-col items-center">
              {children}
            </div>
          </div>
        </div>
        {aside}
        {dock}
      </div>
    </div>
  )
}

function ToolMoreBelow({
  href = "#about",
  label = "How it works",
}: {
  href?: string
  label?: string
}) {
  return (
    <a
      href={href}
      className="absolute end-4 bottom-5 z-10 hidden items-center gap-1 rounded-md px-1.5 py-1 text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring lg:inline-flex"
    >
      {label}
      <IconArrowDown aria-hidden="true" className="size-3.5" />
    </a>
  )
}

function ToolBelowFold({
  id = "about",
  className,
  children,
}: {
  id?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      id={id}
      data-slot="tool-below-fold"
      className={cn(
        "flex scroll-mt-4 flex-col border-t pt-6 pb-8 sm:pt-10",
        className
      )}
    >
      {children}
    </div>
  )
}

export {
  ToolApp,
  ToolBelowFold,
  ToolCanvas,
  ToolExportButton,
  ToolMoreBelow,
  ToolShareButton,
  ToolSwitcher,
  ToolTopBar,
  toolIcons,
  useToolApp,
}
