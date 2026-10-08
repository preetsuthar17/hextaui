"use client"

import * as React from "react"
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { IconChevronDown } from "@tabler/icons-react"
import { cva } from "class-variance-authority"
import { cn } from "cn"

import { SafeAreaOverlay } from "@/components/ui/safe-area"

import { useSlidingHighlight } from "@/lib/motion"

type NavigationMenuVariant = "dropdown" | "panel"

const NavigationMenuContext =
  React.createContext<NavigationMenuVariant>("dropdown")

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

type NavigationMenuProps = NavigationMenuPrimitive.Root.Props &
  Pick<
    NavigationMenuPrimitive.Positioner.Props,
    "align" | "sideOffset" | "alignOffset" | "collisionPadding"
  > & {
    variant?: NavigationMenuVariant
    showSafeArea?: boolean
  }

function NavigationMenu({
  variant = "dropdown",
  align,
  sideOffset,
  alignOffset,
  collisionPadding,
  className,
  children,
  value: valueProp,
  defaultValue,
  onValueChange,
  showSafeArea = false,
  ref,
  ...props
}: NavigationMenuProps) {
  const rootRef = React.useRef<HTMLElement | null>(null)
  const popupRef = React.useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = React.useState(
    defaultValue != null && valueProp === undefined
  )
  const getElements = React.useCallback(() => {
    const reference = rootRef.current?.querySelector(
      "[data-slot=navigation-menu-trigger][data-popup-open]"
    )
    const floating = popupRef.current
    return reference && floating ? { reference, floating } : null
  }, [])

  const highlightRef = React.useRef<HTMLSpanElement | null>(null)
  useSlidingHighlight(
    rootRef,
    highlightRef,
    "[data-slot=navigation-menu-trigger][data-popup-open]"
  )

  const setRef = React.useCallback(
    (node: HTMLElement | null) => {
      rootRef.current = node
      if (typeof ref === "function") {
        return ref(node as never)
      }
      if (ref) {
        ;(ref as React.RefObject<HTMLElement | null>).current = node
      }
      return undefined
    },
    [ref]
  )

  return (
    <NavigationMenuContext.Provider value={variant}>
      <NavigationMenuPrimitive.Root
        ref={setRef}
        data-slot="navigation-menu"
        data-variant={variant}
        value={valueProp}
        defaultValue={defaultValue}
        onValueChange={(next, details) => {
          onValueChange?.(next, details)
          if (!details.isCanceled) {
            setOpen(next != null)
          }
        }}
        className={mergeClassName(
          cn(
            "group/navigation-menu relative isolate flex min-w-0 flex-1 items-center",
            variant === "panel"
              ? "w-full max-w-none"
              : "max-w-max justify-center"
          ),
          className
        )}
        {...props}
      >
        <span
          ref={highlightRef}
          aria-hidden="true"
          data-slot="navigation-menu-highlight"
          className="pointer-events-none absolute top-0 -z-1 rounded-md bg-accent opacity-0 transition-[transform,width,height,opacity] duration-300 ease-out-quint data-instant:transition-opacity data-visible:opacity-100 motion-reduce:transition-opacity"
        />
        {children}
        <NavigationMenuPositioner
          align={align ?? (variant === "panel" ? "center" : "start")}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
          anchor={variant === "panel" ? rootRef : undefined}
          popupRef={popupRef}
        />
        {showSafeArea &&
        (valueProp === undefined ? open : valueProp != null) ? (
          <SafeAreaOverlay getElements={getElements} />
        ) : null}
      </NavigationMenuPrimitive.Root>
    </NavigationMenuContext.Provider>
  )
}

function NavigationMenuList({
  className,
  ...props
}: NavigationMenuPrimitive.List.Props) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={mergeClassName(
        "-m-1 flex min-w-0 flex-1 scroll-p-1 [scrollbar-width:none] list-none items-center gap-0.5 overflow-x-auto overscroll-x-none p-1 group-data-[orientation=vertical]/navigation-menu:flex-col group-data-[orientation=vertical]/navigation-menu:items-stretch",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: NavigationMenuPrimitive.Item.Props) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={mergeClassName("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center gap-1 rounded-md px-3 text-sm font-medium whitespace-nowrap outline-none select-none focus-visible:ring-3 focus-visible:inset-ring-(length:--hairline) focus-visible:ring-focus-ring focus-visible:inset-ring-ring focus-visible:outline-hidden data-popup-open:text-accent-foreground data-[active]:text-foreground pointer-coarse:h-11 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [@media(hover:hover)]:group-not-has-[[data-popup-open]]/navigation-menu:hover:bg-muted/70"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={mergeClassName(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children}
      <IconChevronDown
        aria-hidden="true"
        data-slot="navigation-menu-trigger-icon"
        className="size-3.5 text-muted-foreground transition-transform duration-300 ease-out-quint group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-popup-open/navigation-menu-trigger:text-accent-foreground motion-reduce:transition-none"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

const contentSlide =
  "transition-[opacity,translate,filter] duration-300 ease-out-quint data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:data-ending-style:blur-[2px] motion-safe:data-starting-style:blur-[2px] motion-safe:data-starting-style:data-[activation-direction=left]:-translate-x-12 motion-safe:data-starting-style:data-[activation-direction=right]:translate-x-12 motion-safe:data-ending-style:data-[activation-direction=left]:translate-x-12 motion-safe:data-ending-style:data-[activation-direction=right]:-translate-x-12 motion-safe:data-starting-style:data-[activation-direction=up]:-translate-y-6 motion-safe:data-starting-style:data-[activation-direction=down]:translate-y-6 motion-safe:data-ending-style:data-[activation-direction=up]:translate-y-6 motion-safe:data-ending-style:data-[activation-direction=down]:-translate-y-6 motion-reduce:transition-opacity"

const linkSelector = "[data-slot=navigation-menu-link]"

const arrowKeys = new Set(["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"])

function nearestLink(from: HTMLElement, links: HTMLElement[], key: string) {
  const origin = from.getBoundingClientRect()
  const ox = origin.left + origin.width / 2
  const oy = origin.top + origin.height / 2
  const vertical = key === "ArrowDown" || key === "ArrowUp"
  let best: HTMLElement | null = null
  let bestScore = Infinity
  for (const link of links) {
    if (link === from) {
      continue
    }
    const rect = link.getBoundingClientRect()
    const dx = rect.left + rect.width / 2 - ox
    const dy = rect.top + rect.height / 2 - oy
    const ahead =
      key === "ArrowDown"
        ? dy > 1
        : key === "ArrowUp"
          ? dy < -1
          : key === "ArrowRight"
            ? dx > 1
            : dx < -1
    if (!ahead) {
      continue
    }
    const score = vertical
      ? Math.abs(dy) + Math.abs(dx) * 2
      : Math.abs(dx) + Math.abs(dy) * 2
    if (score < bestScore) {
      bestScore = score
      best = link
    }
  }
  return best
}

function NavigationMenuContent({
  className,
  children,
  onPointerOver,
  onPointerLeave,
  onFocus,
  onKeyDown,
  ref,
  ...props
}: NavigationMenuPrimitive.Content.Props) {
  const variant = React.useContext(NavigationMenuContext)
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const highlightRef = React.useRef<HTMLSpanElement | null>(null)
  const [contentNode, setContentNode] = React.useState<HTMLDivElement | null>(
    null
  )
  const mountedRef = React.useMemo(
    () => ({ current: contentNode }),
    [contentNode]
  )
  useSlidingHighlight(
    mountedRef,
    highlightRef,
    "[data-slot=navigation-menu-link][data-highlighted]",
    "data-highlighted"
  )

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      contentRef.current = node
      setContentNode(node)
      if (typeof ref === "function") {
        return ref(node)
      }
      if (ref) {
        ref.current = node
      }
      return undefined
    },
    [ref]
  )

  const highlight = (link: Element | null) => {
    const content = contentRef.current
    if (!content) {
      return
    }
    for (const current of content.querySelectorAll("[data-highlighted]")) {
      if (current !== link) {
        current.removeAttribute("data-highlighted")
      }
    }
    link?.setAttribute("data-highlighted", "")
  }

  const focused = () =>
    contentRef.current?.querySelector(`${linkSelector}:focus-visible`) ?? null

  return (
    <NavigationMenuPrimitive.Content
      ref={setRef}
      data-slot="navigation-menu-content"
      data-variant={variant}
      className={mergeClassName(
        cn(
          "relative isolate",
          "h-full p-2 [--navigation-menu-link-radius:max(calc(var(--radius-sm)*0.5),calc(var(--radius-xl)-var(--spacing)*2))]",
          variant === "panel" ? "w-(--anchor-width) p-3" : "w-max",
          contentSlide
        ),
        className
      )}
      onPointerOver={(event) => {
        onPointerOver?.(event)
        if (event.pointerType !== "touch") {
          highlight(
            (event.target as Element).closest(linkSelector) ?? focused()
          )
        }
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        highlight(focused())
      }}
      onFocus={(event) => {
        onFocus?.(event)
        const target = event.target as Element
        if (target.matches(linkSelector) && target.matches(":focus-visible")) {
          highlight(target)
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        const content = contentRef.current
        const target = event.target as HTMLElement
        if (
          event.defaultPrevented ||
          !content ||
          !arrowKeys.has(event.key) ||
          !target.matches(linkSelector)
        ) {
          return
        }
        const links = Array.from(
          content.querySelectorAll<HTMLElement>(linkSelector)
        ).filter((link) => link.getClientRects().length > 0)
        const next = nearestLink(target, links, event.key)
        if (next) {
          event.preventDefault()
          event.preventBaseUIHandler?.()
          next.focus()
          highlight(next)
        }
      }}
      {...props}
    >
      <span
        ref={highlightRef}
        aria-hidden="true"
        data-slot="navigation-menu-link-highlight"
        className="pointer-events-none absolute top-0 -z-1 rounded-(--navigation-menu-link-radius) bg-muted opacity-0 transition-[transform,width,height,opacity] duration-200 ease-out-quint data-instant:transition-opacity data-visible:opacity-100 motion-reduce:transition-opacity"
      />
      {children}
    </NavigationMenuPrimitive.Content>
  )
}

function NavigationMenuPositioner({
  className,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset = 0,
  collisionPadding = 8,
  anchor,
  popupRef,
  ...props
}: NavigationMenuPrimitive.Positioner.Props & {
  popupRef?: React.Ref<HTMLDivElement>
}) {
  const variant = React.useContext(NavigationMenuContext)

  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        data-slot="navigation-menu-positioner"
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        anchor={anchor}
        className={mergeClassName(
          cn(
            "isolate z-50 h-(--positioner-height) max-w-(--available-width) transition-[top,left,right,bottom] duration-300 ease-out-quint data-instant:transition-none motion-reduce:transition-none",
            variant === "panel"
              ? "w-(--anchor-width)"
              : "w-(--positioner-width)"
          ),
          className
        )}
        {...props}
      >
        <NavigationMenuPrimitive.Popup
          ref={popupRef}
          data-slot="navigation-menu-popup"
          className={cn(
            "relative h-(--popup-height) max-h-(--available-height) origin-(--transform-origin) overflow-hidden rounded-xl bg-popover text-popover-foreground shadow-md ring-(length:--hairline) ring-foreground/10 transition-[opacity,scale,width,height] duration-300 ease-out-quint outline-none focus-visible:outline-hidden data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-97 motion-safe:data-starting-style:scale-97 motion-reduce:transition-opacity forced-colors:border",
            variant === "panel" ? "w-full" : "w-(--popup-width)"
          )}
        >
          <NavigationMenuPrimitive.Viewport
            data-slot="navigation-menu-viewport"
            className="relative size-full overflow-x-hidden overflow-y-auto overscroll-contain"
          />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={mergeClassName(
        "flex min-w-0 items-center gap-2 rounded-(--navigation-menu-link-radius,var(--radius-md)) p-2 text-sm transition-colors duration-150 outline-none not-in-data-[slot=navigation-menu-content]:h-9 not-in-data-[slot=navigation-menu-content]:px-3 not-in-data-[slot=navigation-menu-content]:py-0 not-in-data-[slot=navigation-menu-content]:font-medium focus-visible:ring-3 focus-visible:inset-ring-(length:--hairline) focus-visible:ring-focus-ring focus-visible:inset-ring-ring focus-visible:outline-hidden data-[active]:bg-muted/60 motion-reduce:transition-none pointer-coarse:not-in-data-[slot=navigation-menu-content]:h-11 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [@media(hover:hover)]:not-in-data-[slot=navigation-menu-content]:hover:bg-muted",
        className
      )}
      {...props}
    />
  )
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
}
export type { NavigationMenuProps, NavigationMenuVariant }
