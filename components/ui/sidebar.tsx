"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { useRender } from "@base-ui/react/use-render"
import { IconLayoutSidebar } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { useComposedRef } from "@/hooks/use-composed-ref"
import { matchesHotkey } from "@/lib/hotkey"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  createTooltipHandle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type TooltipContentProps,
} from "@/components/ui/tooltip"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

const SIDEBAR_KEYBOARD_SHORTCUT = "mod+b"
const mobileQuery = "(max-width: 767px)"

function subscribeMobile(onChange: () => void) {
  if (typeof window.matchMedia !== "function") {
    return () => {}
  }
  const media = window.matchMedia(mobileQuery)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

function getMobile() {
  return typeof window.matchMedia === "function"
    ? window.matchMedia(mobileQuery).matches
    : false
}

function useIsMobile() {
  return React.useSyncExternalStore(subscribeMobile, getMobile, () => false)
}

const shortcutOwners = new Map<Element, string>()

function focusOwnsShortcut(wrapper: Element, shortcut: string) {
  const focused = document.activeElement
  let owner =
    focused instanceof Element
      ? focused.closest("[data-slot=sidebar-wrapper]")
      : null
  while (owner) {
    if (shortcutOwners.get(owner) === shortcut) {
      return owner === wrapper
    }
    owner = owner.parentElement?.closest("[data-slot=sidebar-wrapper]") ?? null
  }
  return true
}

function isEditable(target: EventTarget | null) {
  return target instanceof HTMLElement && target.isContentEditable
}

type SidebarState = "expanded" | "collapsed"

type SidebarContextProps = {
  state: SidebarState
  open: boolean
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void
  openMobile: boolean
  setOpenMobile: (open: boolean | ((open: boolean) => boolean)) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

const SidebarWrapperContext = React.createContext<{
  sidebarId: string
  wrapperRef: React.RefObject<HTMLDivElement | null>
  returnFocusRef: React.RefObject<HTMLElement | null>
} | null>(null)

const SidebarTooltipContext = React.createContext<ReturnType<
  typeof createTooltipHandle<React.ReactNode>
> | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

function useSidebarWrapper() {
  const context = React.useContext(SidebarWrapperContext)
  if (!context) {
    throw new Error("Sidebar must be used within a SidebarProvider.")
  }

  return context
}

type SidebarProviderProps = React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  keyboardShortcut?: string | null
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  keyboardShortcut = SIDEBAR_KEYBOARD_SHORTCUT,
  className,
  children,
  ref,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile()
  const sidebarId = React.useId()
  const [wrapperRef, setWrapperRef] = useComposedRef<HTMLDivElement>(ref)
  const [openMobile, setOpenMobileState] = React.useState(false)
  const [wasMobile, setWasMobile] = React.useState(isMobile)
  if (isMobile !== wasMobile) {
    setWasMobile(isMobile)
    if (!isMobile) {
      setOpenMobileState(false)
    }
  }

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const openRef = React.useRef(open)
  const controlledRef = React.useRef(openProp !== undefined)
  const onOpenChangeRef = React.useRef(onOpenChange)

  React.useLayoutEffect(() => {
    openRef.current = open
    controlledRef.current = openProp !== undefined
    onOpenChangeRef.current = onOpenChange
  })

  const setOpen = React.useCallback(
    (value: boolean | ((open: boolean) => boolean)) => {
      const next = typeof value === "function" ? value(openRef.current) : value
      if (next === openRef.current) {
        return
      }
      openRef.current = next
      if (!controlledRef.current) {
        setUncontrolledOpen(next)
      }
      onOpenChangeRef.current?.(next)
    },
    []
  )

  const returnFocusRef = React.useRef<HTMLElement | null>(null)
  const setOpenMobile = React.useCallback(
    (value: boolean | ((open: boolean) => boolean)) => {
      const focused = document.activeElement
      if (!focused?.closest("[data-mobile=true]")) {
        returnFocusRef.current =
          focused instanceof HTMLElement && focused !== document.body
            ? focused
            : null
      }
      setOpenMobileState(value)
    },
    []
  )

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((value) => !value)
    } else {
      setOpen((value) => !value)
    }
  }, [isMobile, setOpen, setOpenMobile])

  const toggleRef = React.useRef(toggleSidebar)
  React.useLayoutEffect(() => {
    toggleRef.current = toggleSidebar
  })

  React.useEffect(() => {
    const wrapper = wrapperRef.current
    if (!keyboardShortcut || !wrapper) {
      return
    }
    shortcutOwners.set(wrapper, keyboardShortcut)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.repeat ||
        isEditable(event.target) ||
        !matchesHotkey(event, keyboardShortcut) ||
        !focusOwnsShortcut(wrapper, keyboardShortcut)
      ) {
        return
      }
      event.preventDefault()
      toggleRef.current()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      shortcutOwners.delete(wrapper)
    }
  }, [keyboardShortcut])

  const state: SidebarState = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  const wrapperValue = React.useMemo(
    () => ({ sidebarId, wrapperRef, returnFocusRef }),
    [sidebarId]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <SidebarWrapperContext.Provider value={wrapperValue}>
        <div
          ref={setWrapperRef}
          data-slot="sidebar-wrapper"
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full [--sidebar-top:0px] [--sidebar-width-icon:3rem] [--sidebar-width-mobile:18rem] [--sidebar-width:16rem] has-[>*>[data-slot=sidebar][data-variant=inset]]:bg-sidebar has-[>[data-slot=sidebar][data-variant=inset]]:bg-sidebar",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </SidebarWrapperContext.Provider>
    </SidebarContext.Provider>
  )
}

function SidebarTooltips({
  side,
  children,
}: {
  side: "left" | "right"
  children: React.ReactNode
}) {
  const [handle] = React.useState(() => createTooltipHandle<React.ReactNode>())

  return (
    <TooltipProvider closeDelay={100}>
      <SidebarTooltipContext.Provider value={handle}>
        {children}
      </SidebarTooltipContext.Provider>
      <Tooltip handle={handle}>
        {({ payload }) => (
          <TooltipContent side={side === "left" ? "right" : "left"}>
            {payload as React.ReactNode}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

function isLinkNavigation(event: React.MouseEvent) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    !(event.target instanceof Element)
  ) {
    return false
  }
  const link = event.target.closest("a[href]")
  return (
    link instanceof HTMLAnchorElement &&
    link.getAttribute("aria-disabled") !== "true" &&
    !link.hasAttribute("download") &&
    (link.target === "" || link.target === "_self")
  )
}

type SidebarProps = React.ComponentProps<"div"> & {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset" | "plain"
  collapsible?: "offcanvas" | "icon" | "none"
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  dir,
  ...props
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()
  const { sidebarId, wrapperRef, returnFocusRef } = useSidebarWrapper()
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const hidden = collapsible === "offcanvas" && state === "collapsed"

  React.useLayoutEffect(() => {
    const container = containerRef.current
    const focused = document.activeElement
    if (!hidden || !container || !focused || !container.contains(focused)) {
      return
    }
    const trigger = Array.from(
      document.querySelectorAll<HTMLElement>("[data-slot=sidebar-trigger]")
    ).find((node) => node.getAttribute("aria-controls") === sidebarId)
    if (trigger) {
      trigger.focus({ preventScroll: true })
    } else if (focused instanceof HTMLElement) {
      focused.blur()
    }
  }, [hidden, sidebarId])

  const syncMobileWidth = React.useCallback(
    (popup: HTMLDivElement | null) => {
      const wrapper = wrapperRef.current
      if (!popup || !wrapper) {
        return
      }
      const width = getComputedStyle(wrapper)
        .getPropertyValue("--sidebar-width-mobile")
        .trim()
      popup.style.setProperty("--sidebar-width", width || "18rem")
    },
    [wrapperRef]
  )

  if (collapsible === "none") {
    return (
      <SidebarTooltips side={side}>
        <div
          id={sidebarId}
          data-slot="sidebar"
          data-side={side}
          data-variant={variant}
          dir={dir}
          className={cn(
            "group flex h-full w-(--sidebar-width) min-w-0 flex-col text-sidebar-foreground",
            variant !== "plain" && "bg-sidebar",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </SidebarTooltips>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={(open) => setOpenMobile(open)}>
        <SheetContent
          ref={syncMobileWidth}
          finalFocus={() => {
            const previous = returnFocusRef.current
            if (previous?.isConnected) {
              return previous
            }
            return (
              wrapperRef.current?.querySelector<HTMLElement>(
                "[data-slot=sidebar-trigger]"
              ) ?? true
            )
          }}
          dir={dir}
          side={side}
          showCloseButton={false}
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="w-[calc(var(--sidebar-width)+var(--bleed))] max-w-[calc(100%-3rem+var(--bleed))] gap-0 bg-sidebar text-sidebar-foreground"
          onClick={(event) => {
            if (isLinkNavigation(event)) {
              setOpenMobile(false)
            }
          }}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
          </SheetHeader>
          <SidebarTooltips side={side}>
            <div
              data-slot="sidebar-inner"
              data-sidebar="sidebar"
              className="flex h-full w-full min-w-0 flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
            >
              {children}
            </div>
          </SidebarTooltips>
        </SheetContent>
      </Sheet>
    )
  }

  const detached = variant === "floating" || variant === "inset"

  return (
    <div
      data-slot="sidebar"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      className={cn(
        "group peer sticky top-(--sidebar-top) hidden h-[calc(100svh-var(--sidebar-top))] max-h-full w-(--sidebar-width) shrink-0 self-start text-sidebar-foreground transition-[width] duration-250 ease-drawer data-[collapsible=offcanvas]:w-0 motion-reduce:transition-none md:block",
        detached
          ? "data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+--spacing(4))]"
          : "data-[collapsible=icon]:w-(--sidebar-width-icon)"
      )}
    >
      <SidebarTooltips side={side}>
        <div
          ref={containerRef}
          id={sidebarId}
          data-slot="sidebar-container"
          data-side={side}
          dir={dir}
          className={cn(
            "absolute inset-y-0 z-10 flex w-(--sidebar-width) transition-[translate,width] duration-250 ease-drawer data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:-translate-x-full data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:translate-x-full motion-reduce:transition-none",
            detached
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+--spacing(4))]"
              : variant === "plain"
                ? "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
                : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) after:pointer-events-none after:absolute after:inset-y-0 after:w-(--hairline) after:bg-sidebar-border data-[side=left]:after:right-0 data-[side=right]:after:left-0",
            className
          )}
          {...props}
        >
          <div
            data-slot="sidebar-inner"
            data-sidebar="sidebar"
            className="flex size-full min-w-0 flex-col bg-sidebar transition-[visibility] duration-250 group-data-[collapsible=offcanvas]:invisible group-data-[variant=floating]:rounded-xl group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-(length:--hairline) group-data-[variant=floating]:ring-sidebar-border group-data-[variant=plain]:bg-transparent motion-reduce:transition-none"
          >
            {children}
          </div>
        </div>
      </SidebarTooltips>
    </div>
  )
}

function SidebarTrigger({
  className,
  onClick,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, open, openMobile, isMobile } = useSidebar()
  const { sidebarId } = useSidebarWrapper()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      aria-expanded={isMobile ? openMobile : open}
      aria-controls={isMobile ? undefined : sidebarId}
      className={cn("aria-expanded:not-hover:bg-transparent", className)}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          toggleSidebar()
        }
      }}
      {...props}
    >
      {children ?? (
        <>
          <IconLayoutSidebar className="rtl:-scale-x-100" />
          <span className="sr-only">Toggle Sidebar</span>
        </>
      )}
    </Button>
  )
}

function SidebarRail({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      type="button"
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      title="Toggle Sidebar"
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          toggleSidebar()
        }
      }}
      className={cn(
        "visible absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 outline-none after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2 after:transition-colors after:duration-150 hover:after:bg-sidebar-border focus-visible:outline-hidden sm:flex",
        "group-data-[side=left]:-right-4 group-data-[side=left]:cursor-w-resize group-data-[side=right]:left-0 group-data-[side=right]:cursor-e-resize",
        "group-data-[side=left]:group-data-[state=collapsed]:cursor-e-resize group-data-[side=right]:group-data-[state=collapsed]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:transition-colors group-data-[collapsible=offcanvas]:duration-150 group-data-[side=left]:group-data-[collapsible=offcanvas]:after:left-0 group-data-[side=right]:group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar",
        "group-data-[side=right]:group-data-[collapsible=offcanvas]:-left-4",
        className
      )}
      {...props}
    />
  )
}

function SidebarInset({
  className,
  render,
  ...props
}: useRender.ComponentProps<"main">) {
  return useRender({
    defaultTagName: "main",
    render,
    props: mergeProps<"main">(
      {
        className: cn(
          "relative flex w-full min-w-0 flex-1 flex-col bg-background motion-reduce:transition-none md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ms-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:ring-(length:--hairline) md:peer-data-[variant=inset]:ring-sidebar-border md:peer-data-[variant=inset]:duration-250 md:peer-data-[variant=inset]:ease-drawer md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-2 motion-safe:md:peer-data-[variant=inset]:transition-[margin]",
          className
        ),
      },
      props,
      { "data-slot": "sidebar-inset" } as React.ComponentProps<"main">
    ),
  })
}

function SidebarInput({
  className,
  size = "sm",
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      size={size}
      className={mergeClassName("w-full bg-background", className)}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex min-w-0 flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex min-w-0 flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

function SidebarSeparator({ className, ...props }: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={mergeClassName(
        "mx-2 h-(--hairline) w-auto shrink-0 bg-sidebar-border",
        className
      )}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 [scrollbar-width:thin] [scrollbar-color:var(--color-sidebar-border)_transparent] flex-col gap-2 overflow-x-hidden overflow-y-auto overscroll-contain group-data-[collapsible=icon]:overflow-y-hidden group-data-[variant=plain]:no-scrollbar supports-[animation-timeline:scroll()]:scroll-fade-y",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
}

const iconCollapseFade =
  "transition-[opacity,visibility] delay-150 duration-150 ease-out-cubic group-data-[collapsible=icon]:invisible group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:delay-0 group-data-[collapsible=icon]:duration-100 motion-reduce:transition-none"

function SidebarGroupLabel({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex h-8 min-w-0 shrink-0 items-center gap-2 overflow-hidden rounded-md px-2 text-start text-xs font-medium whitespace-nowrap text-sidebar-foreground/70 inset-ring-(length:--hairline) inset-ring-transparent transition-[margin,opacity,visibility,color,box-shadow] duration-250 ease-drawer outline-none [-webkit-tap-highlight-color:transparent] group-data-[collapsible=icon]:invisible group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-sidebar-ring focus-visible:outline-hidden motion-reduce:transition-none forced-colors:border [&>svg]:size-4 [&>svg]:shrink-0",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "sidebar-group-label",
      sidebar: "group-label",
    },
  })
}

function SidebarGroupAction({
  className,
  render,
  ...props
}: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? undefined : "button",
        className: cn(
          "absolute end-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground inset-ring-(length:--hairline) inset-ring-transparent outline-none [-webkit-tap-highlight-color:transparent] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-sidebar-ring focus-visible:outline-hidden forced-colors:border pointer-coarse:after:absolute pointer-coarse:after:-inset-2 [&>svg]:size-4 [&>svg]:shrink-0",
          iconCollapseFade,
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "sidebar-group-action",
      sidebar: "group-action",
    },
  })
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full min-w-0 text-sm", className)}
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn(
        "flex w-full min-w-0 flex-col gap-1 group-data-[variant=plain]:gap-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative min-w-0", className)}
      {...props}
    />
  )
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button group/menu-button flex w-full min-w-0 items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm inset-ring-(length:--hairline) inset-ring-transparent transition-[width,height,padding,background-color,color,box-shadow] duration-[250ms,250ms,250ms,100ms,100ms,100ms] ease-drawer outline-none [-webkit-tap-highlight-color:transparent] group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-has-data-[sidebar=menu-badge]/menu-item:pe-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-sidebar-ring focus-visible:outline-hidden active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground motion-reduce:transition-none forced-colors:border data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground forced-colors:data-active:outline-2 forced-colors:data-active:-outline-offset-2 forced-colors:data-active:outline-solid [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>span:last-child]:truncate",
  {
    variants: {
      variant: {
        default: "",
        outline:
          "bg-background inset-ring-sidebar-border hover:inset-ring-sidebar-accent dark:bg-input/30",
      },
      size: {
        default: "h-8 text-sm pointer-coarse:h-10",
        sm: "h-7 text-xs pointer-coarse:h-9",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function isTooltipProps(
  tooltip: React.ReactNode | TooltipContentProps
): tooltip is TooltipContentProps {
  return (
    typeof tooltip === "object" &&
    tooltip !== null &&
    !React.isValidElement(tooltip) &&
    !(Symbol.iterator in tooltip) &&
    !("then" in tooltip)
  )
}

type SidebarMenuButtonProps = useRender.ComponentProps<"button"> &
  VariantProps<typeof sidebarMenuButtonVariants> & {
    isActive?: boolean
    tooltip?: React.ReactNode | TooltipContentProps
  }

function SidebarMenuButton({
  render,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: SidebarMenuButtonProps) {
  const { isMobile, state } = useSidebar()
  const handle = React.useContext(SidebarTooltipContext)
  const hasTooltip =
    tooltip !== undefined && tooltip !== null && tooltip !== false
  const custom = hasTooltip && (isTooltipProps(tooltip) || handle === null)
  const tooltipDisabled = state !== "collapsed" || isMobile

  const element = useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render || hasTooltip ? undefined : "button",
        "aria-current": isActive ? "page" : undefined,
        className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      },
      props
    ),
    render: !hasTooltip ? (
      render
    ) : custom ? (
      <TooltipTrigger render={render} disabled={tooltipDisabled} />
    ) : (
      <TooltipTrigger
        render={render}
        handle={handle ?? undefined}
        payload={tooltip as React.ReactNode}
        disabled={tooltipDisabled}
      />
    ),
    state: {
      slot: "sidebar-menu-button",
      sidebar: "menu-button",
      size,
      active: isActive,
    },
  })

  if (!custom) {
    return element
  }

  const content = isTooltipProps(tooltip)
    ? tooltip
    : { children: tooltip as React.ReactNode }

  return (
    <Tooltip>
      {element}
      <TooltipContent side="right" {...content} />
    </Tooltip>
  )
}

function SidebarMenuAction({
  className,
  render,
  showOnHover = false,
  ...props
}: useRender.ComponentProps<"button"> & {
  showOnHover?: boolean
}) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? undefined : "button",
        className: cn(
          "absolute end-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground inset-ring-(length:--hairline) inset-ring-transparent outline-none [-webkit-tap-highlight-color:transparent] peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-3.5 peer-data-[size=sm]/menu-button:top-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-sidebar-ring focus-visible:outline-hidden forced-colors:border pointer-coarse:peer-data-[size=default]/menu-button:top-2.5 pointer-coarse:peer-data-[size=sm]/menu-button:top-2 pointer-coarse:after:absolute pointer-coarse:after:-inset-2 [&>svg]:size-4 [&>svg]:shrink-0",
          iconCollapseFade,
          showOnHover &&
            "delay-0 peer-data-active/menu-button:text-sidebar-accent-foreground pointer-fine:opacity-0 pointer-fine:group-focus-within/menu-item:opacity-100 pointer-fine:group-hover/menu-item:opacity-100 pointer-fine:aria-expanded:opacity-100 pointer-fine:data-popup-open:opacity-100",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "sidebar-menu-action",
      sidebar: "menu-action",
    },
  })
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute end-1 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-3.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-sidebar-accent-foreground pointer-coarse:peer-data-[size=default]/menu-button:top-2.5 pointer-coarse:peer-data-[size=sm]/menu-button:top-2",
        iconCollapseFade,
        className
      )}
      {...props}
    />
  )
}

const skeletonWidths = [
  "max-w-[52%]",
  "max-w-[60%]",
  "max-w-[68%]",
  "max-w-[76%]",
  "max-w-[84%]",
  "max-w-[90%]",
]

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean
}) {
  const id = React.useId()
  let hash = 0
  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      aria-hidden="true"
      className={cn(
        "flex h-8 items-center gap-2 rounded-md px-2 pointer-coarse:h-10",
        className
      )}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 shrink-0 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className={cn(
          "h-4 flex-1 group-data-[collapsible=icon]:hidden",
          skeletonWidths[hash % skeletonWidths.length]
        )}
        data-sidebar="menu-skeleton-text"
      />
    </div>
  )
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 overflow-clip border-s border-sidebar-border px-2.5 py-0.5 transition-[height,padding,opacity,visibility] duration-250 ease-drawer [interpolate-size:allow-keywords] [overflow-clip-margin:3px] group-data-[collapsible=icon]:invisible group-data-[collapsible=icon]:h-0 group-data-[collapsible=icon]:py-0 group-data-[collapsible=icon]:opacity-0 motion-reduce:transition-none rtl:-translate-x-px",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative min-w-0", className)}
      {...props}
    />
  )
}

function SidebarMenuSubButton({
  render,
  size = "md",
  isActive = false,
  className,
  ...props
}: useRender.ComponentProps<"a"> & {
  size?: "sm" | "md"
  isActive?: boolean
}) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        "aria-current": isActive ? "page" : undefined,
        className: cn(
          "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-start text-sidebar-foreground inset-ring-(length:--hairline) inset-ring-transparent transition-[background-color,color,box-shadow] duration-100 outline-none [-webkit-tap-highlight-color:transparent] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-sidebar-ring focus-visible:outline-hidden active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[size=md]:text-sm data-[size=sm]:text-xs motion-reduce:transition-none rtl:translate-x-px forced-colors:border pointer-coarse:h-9 data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground forced-colors:data-active:outline-2 forced-colors:data-active:-outline-offset-2 forced-colors:data-active:outline-solid [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "sidebar-menu-sub-button",
      sidebar: "menu-sub-button",
      size,
      active: isActive,
    },
  })
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  sidebarMenuButtonVariants,
  useSidebar,
}
export type {
  SidebarMenuButtonProps,
  SidebarProps,
  SidebarProviderProps,
  SidebarState,
}
