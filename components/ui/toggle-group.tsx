"use client"

import * as React from "react"
import {
  DirectionProvider,
  useDirection,
} from "@base-ui/react/direction-provider"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { toggleVariants } from "@/components/ui/toggle"
import { prefersReducedMotion } from "@/lib/motion"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

type ToggleGroupVariant = NonNullable<
  VariantProps<typeof toggleVariants>["variant"]
>
type ToggleGroupSize = NonNullable<VariantProps<typeof toggleVariants>["size"]>
type ToggleGroupSpacing = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 6 | 8
type ToggleGroupOrientation = "horizontal" | "vertical"

const spacingClassNames: Record<ToggleGroupSpacing, string> = {
  0: "gap-0",
  0.5: "gap-0.5",
  1: "gap-1",
  1.5: "gap-1.5",
  2: "gap-2",
  2.5: "gap-2.5",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
}

type ToggleGroupContextValue = {
  variant?: ToggleGroupVariant
  size?: ToggleGroupSize
  spacing: ToggleGroupSpacing
  orientation: ToggleGroupOrientation
  joined: boolean
  sliding: boolean
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(
  null
)

const pressedSelector = ":scope > [data-slot=toggle-group-item][data-pressed]"

function useToggleGroupIndicator(
  rootRef: React.RefObject<HTMLElement | null>,
  indicatorRef: React.RefObject<HTMLElement | null>,
  enabled: boolean
) {
  React.useLayoutEffect(() => {
    const root = rootRef.current
    const indicator = indicatorRef.current
    if (!enabled || !root || !indicator) {
      return
    }

    let current: HTMLElement | null = null

    const place = (item: HTMLElement, instant: boolean) => {
      indicator.toggleAttribute(
        "data-instant",
        instant || prefersReducedMotion()
      )
      indicator.toggleAttribute(
        "data-disabled",
        item.hasAttribute("data-disabled")
      )
      const frame = root.getBoundingClientRect()
      const box = item.getBoundingClientRect()
      const layoutWidth = parseFloat(getComputedStyle(root).width)
      const scale =
        layoutWidth > 0 && frame.width > 0 ? frame.width / layoutWidth : 1
      const style = getComputedStyle(item)
      const width = parseFloat(style.width)
      const height = parseFloat(style.height)
      indicator.style.width = `${Number.isFinite(width) ? width : box.width / scale}px`
      indicator.style.height = `${Number.isFinite(height) ? height : box.height / scale}px`
      indicator.style.translate = `${(box.left - frame.left) / scale - root.clientLeft}px ${(box.top - frame.top) / scale - root.clientTop}px`
      indicator.style.borderRadius = style.borderRadius
    }

    const sync = () => {
      const item = root.querySelector<HTMLElement>(pressedSelector)
      if (item === current) {
        if (item) {
          place(item, true)
        }
        return
      }
      const appearing = current === null
      current = item
      if (!item) {
        indicator.removeAttribute("data-visible")
        return
      }
      place(item, appearing)
      if (appearing) {
        void indicator.offsetWidth
      }
      indicator.setAttribute("data-visible", "")
    }

    sync()

    let second = 0
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() =>
        indicator.setAttribute("data-ready", "")
      )
    })

    const mutations = new MutationObserver(sync)
    mutations.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["data-pressed", "data-disabled", "data-size"],
    })
    const resize =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            if (current) {
              place(current, true)
            }
          })
    resize?.observe(root)

    return () => {
      cancelAnimationFrame(first)
      cancelAnimationFrame(second)
      mutations.disconnect()
      resize?.disconnect()
      indicator.removeAttribute("data-ready")
      indicator.removeAttribute("data-visible")
    }
  }, [rootRef, indicatorRef, enabled])
}

function isFocusVisible(element: HTMLElement) {
  try {
    return element.matches(":focus-visible")
  } catch {
    return true
  }
}

function moveFocusToPressed(root: HTMLElement, event: React.FocusEvent) {
  const target = event.target as HTMLElement
  if (
    target.parentElement !== root ||
    target.getAttribute("data-slot") !== "toggle-group-item" ||
    target.hasAttribute("data-pressed") ||
    root.contains(event.relatedTarget as Node | null) ||
    !isFocusVisible(target)
  ) {
    return
  }
  root
    .querySelector<HTMLElement>(
      ":scope > [data-slot=toggle-group-item][data-pressed]:not([data-disabled])"
    )
    ?.focus()
}

type ToggleGroupProps<Value extends string = string> =
  ToggleGroupPrimitive.Props<Value> &
    VariantProps<typeof toggleVariants> & {
      spacing?: ToggleGroupSpacing
      orientation?: ToggleGroupOrientation
    }

function ToggleGroup<Value extends string = string>({
  className,
  variant,
  size,
  spacing = 0,
  orientation = "horizontal",
  multiple = false,
  children,
  ref,
  onFocus,
  ...props
}: ToggleGroupProps<Value>) {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const indicatorRef = React.useRef<HTMLSpanElement | null>(null)
  const inherited = useDirection()
  const [domDirection, setDomDirection] = React.useState<"ltr" | "rtl">()
  const direction = domDirection === "rtl" ? "rtl" : inherited

  const resolvedVariant = variant ?? "default"
  const joined = spacing === 0
  const outlineJoined = joined && resolvedVariant === "outline"
  const sliding = !multiple && (joined || resolvedVariant !== "outline")

  useToggleGroupIndicator(rootRef, indicatorRef, sliding)

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node
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

  const context = React.useMemo<ToggleGroupContextValue>(
    () => ({
      variant: variant ?? undefined,
      size: size ?? undefined,
      spacing,
      orientation,
      joined,
      sliding,
    }),
    [variant, size, spacing, orientation, joined, sliding]
  )

  const vertical = orientation === "vertical"

  return (
    <DirectionProvider direction={direction}>
      <ToggleGroupContext.Provider value={context}>
        <ToggleGroupPrimitive
          ref={setRef}
          multiple={multiple}
          orientation={orientation}
          onFocus={(event) => {
            onFocus?.(event)
            const next =
              getComputedStyle(event.currentTarget).direction === "rtl"
                ? "rtl"
                : "ltr"
            if (next !== domDirection) {
              setDomDirection(next)
            }
            if (!multiple) {
              moveFocusToPressed(event.currentTarget, event)
            }
          }}
          className={mergeClassName(
            cn(
              "group/toggle-group relative isolate flex w-fit max-w-full min-w-0 items-center [--toggle-group-radius:var(--radius-md)] data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
              size === "sm" &&
                "[--toggle-group-radius:min(var(--radius-md),10px)]",
              spacingClassNames[spacing] ?? "gap-0",
              !joined && !vertical && "flex-wrap",
              outlineJoined &&
                "rounded-(--toggle-group-radius) bg-background dark:bg-input/30 [&>[data-slot=toggle-group-item]]:rounded-none",
              outlineJoined &&
                !vertical &&
                "[&>[data-slot=toggle-group-item]:not(:has(~[data-slot=toggle-group-item]))]:rounded-e-(--toggle-group-radius) [&>[data-slot=toggle-group-item]:not([data-slot=toggle-group-item]~*)]:rounded-s-(--toggle-group-radius) [&>[data-slot=toggle-group-item]~[data-slot=toggle-group-item]]:-ms-(--hairline)",
              outlineJoined &&
                vertical &&
                "[&>[data-slot=toggle-group-item]:not(:has(~[data-slot=toggle-group-item]))]:rounded-b-(--toggle-group-radius) [&>[data-slot=toggle-group-item]:not([data-slot=toggle-group-item]~*)]:rounded-t-(--toggle-group-radius) [&>[data-slot=toggle-group-item]~[data-slot=toggle-group-item]]:-mt-(--hairline)"
            ),
            className
          )}
          {...props}
          data-slot="toggle-group"
          data-variant={resolvedVariant}
          data-size={size ?? "default"}
          data-spacing={spacing}
        >
          {children}
          {sliding ? (
            <span
              ref={indicatorRef}
              aria-hidden="true"
              data-slot="toggle-group-indicator"
              className="pointer-events-none absolute top-0 left-0 -z-1 box-border bg-foreground/8 bg-clip-content p-(--hairline) opacity-0 data-ready:transition-[translate,width,height,border-radius,opacity,scale] data-ready:duration-300 data-ready:ease-out-quint data-ready:data-instant:transition-[opacity,scale] data-ready:data-instant:duration-200 data-visible:opacity-100 motion-safe:scale-[0.88] motion-safe:group-has-[>[data-slot=toggle-group-item][data-pressed]:active]/toggle-group:scale-[0.97] motion-safe:data-visible:scale-100 motion-reduce:data-ready:transition-opacity dark:bg-foreground/12 data-visible:data-disabled:opacity-50"
            />
          ) : null}
        </ToggleGroupPrimitive>
      </ToggleGroupContext.Provider>
    </DirectionProvider>
  )
}

type ToggleGroupItemProps<Value extends string = string> =
  TogglePrimitive.Props<Value> & VariantProps<typeof toggleVariants>

function ToggleGroupItem<Value extends string = string>({
  className,
  variant,
  size,
  ...props
}: ToggleGroupItemProps<Value>) {
  const context = React.useContext(ToggleGroupContext)
  if (!context) {
    throw new Error("ToggleGroupItem must be used within ToggleGroup.")
  }
  const resolvedVariant = context.variant ?? variant ?? "default"
  const resolvedSize = context.size ?? size ?? "default"
  const vertical = context.orientation === "vertical"
  const outlineJoined = context.joined && resolvedVariant === "outline"

  return (
    <TogglePrimitive
      className={mergeClassName(
        cn(
          toggleVariants({ variant: resolvedVariant, size: resolvedSize }),
          "pointer-coarse:in-data-[slot=toggle-group]:after:block",
          vertical
            ? "pointer-coarse:after:inset-y-0"
            : "pointer-coarse:after:inset-x-0",
          outlineJoined &&
            "bg-transparent motion-safe:active:not-data-disabled:translate-y-0 motion-safe:active:not-data-disabled:scale-100 dark:bg-transparent",
          context.sliding &&
            "group-has-[>[data-slot=toggle-group-indicator][data-visible]]/toggle-group:before:opacity-0 group-has-[>[data-slot=toggle-group-indicator][data-visible]]/toggle-group:before:transition-none data-pressed:hover:bg-transparent dark:data-pressed:hover:bg-transparent forced-colors:border-0"
        ),
        className
      )}
      {...props}
      data-slot="toggle-group-item"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }
export type {
  ToggleGroupItemProps,
  ToggleGroupOrientation,
  ToggleGroupProps,
  ToggleGroupSize,
  ToggleGroupSpacing,
  ToggleGroupVariant,
}
