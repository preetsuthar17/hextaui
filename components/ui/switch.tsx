"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { IconCheck } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Spinner } from "@/components/ui/spinner"
import { prefersReducedMotion } from "@/lib/motion"

const switchVariants = cva(
  "group/switch peer relative inline-flex h-(--switch-h) w-(--switch-w) shrink-0 cursor-pointer items-center rounded-full bg-foreground/20 p-0.5 transition-[background-color,box-shadow] duration-200 ease-out-quint outline-none select-none [--switch-dir:1] [--switch-stretch:0px] [--switch-thumb-w:var(--switch-thumb)] [--switch-x:0px] after:absolute after:-inset-1.5 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-dragging:[--switch-x:var(--switch-drag)] data-invalid:ring-3 data-invalid:ring-destructive/20 data-pending:cursor-progress data-readonly:cursor-default data-[drag=off]:bg-foreground/20 data-[drag=on]:bg-primary data-shake:motion-safe:animate-button-shake rtl:[--switch-dir:-1] dark:bg-foreground/25 dark:data-[drag=off]:bg-foreground/25 dark:data-[drag=on]:bg-primary forced-colors:border pointer-coarse:after:-inset-3 data-checked:bg-primary data-checked:[--switch-x:calc(var(--switch-w)-var(--switch-thumb-w)-4px-var(--switch-stretch))] dark:data-checked:bg-primary forced-colors:data-checked:bg-highlight data-disabled:cursor-not-allowed data-disabled:opacity-50 [&:active:not([data-disabled]):not([data-readonly]):not([data-pending])]:[--switch-stretch:4px]",
  {
    variants: {
      variant: {
        default: "",
        ios: "bg-foreground/10 inset-ring-(length:--hairline) inset-ring-foreground/5 [--switch-thumb-w:calc(var(--switch-thumb)*1.5)] data-[drag=off]:bg-foreground/10 data-[drag=on]:bg-success dark:bg-foreground/20 dark:data-[drag=off]:bg-foreground/20 dark:data-[drag=on]:bg-success forced-colors:border data-checked:bg-success data-checked:inset-ring-transparent dark:data-checked:bg-success",
      },
      size: {
        sm: "[--switch-h:1rem] [--switch-thumb:0.75rem] [--switch-w:1.75rem]",
        default:
          "[--switch-h:1.25rem] [--switch-thumb:1rem] [--switch-w:2.25rem]",
        lg: "[--switch-h:1.5rem] [--switch-thumb:1.25rem] [--switch-w:2.75rem]",
      },
    },
    compoundVariants: [
      {
        variant: "ios",
        size: "sm",
        className:
          "[--switch-h:1.5rem] [--switch-thumb:1.25rem] [--switch-w:3.5rem]",
      },
      {
        variant: "ios",
        size: "default",
        className:
          "[--switch-h:1.75rem] [--switch-thumb:1.5rem] [--switch-w:4rem]",
      },
      {
        variant: "ios",
        size: "lg",
        className:
          "[--switch-h:2rem] [--switch-thumb:1.75rem] [--switch-w:4.5rem]",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type SwitchProps = Omit<SwitchPrimitive.Root.Props, "onCheckedChange"> &
  VariantProps<typeof switchVariants> & {
    icons?: boolean
    onCheckedChange?: (
      checked: boolean,
      eventDetails: SwitchPrimitive.Root.ChangeEventDetails
    ) => unknown
  }

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as PromiseLike<unknown>).then === "function"
  )
}

function useThumbDrag(
  rootRef: React.RefObject<HTMLElement | null>,
  canDrag: () => boolean
) {
  const drag = React.useRef<{
    id: number
    startX: number
    from: boolean
    max: number
    moved: boolean
    position: number
  } | null>(null)
  const suppressClick = React.useRef(false)
  const pendingToggle = React.useRef(false)

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    const root = rootRef.current
    if (!root || event.button !== 0 || !canDrag()) {
      return
    }
    drag.current = {
      id: event.pointerId,
      startX: event.clientX,
      from: root.hasAttribute("data-checked"),
      max: 0,
      moved: false,
      position: 0,
    }
  }

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const state = drag.current
    const root = rootRef.current
    if (!state || !root || event.pointerId !== state.id) {
      return
    }
    const rtl = getComputedStyle(root).direction === "rtl"
    const delta = (event.clientX - state.startX) * (rtl ? -1 : 1)
    if (!state.moved && Math.abs(delta) < 3) {
      return
    }
    if (!state.moved) {
      const thumb = root.querySelector<HTMLElement>("[data-slot=switch-thumb]")
      state.max = Math.max(0, root.clientWidth - (thumb?.offsetWidth ?? 0) - 4)
      state.moved = true
      root.setPointerCapture?.(event.pointerId)
      root.setAttribute("data-dragging", "")
    }
    const base = state.from ? state.max : 0
    state.position = Math.min(state.max, Math.max(0, base + delta))
    root.setAttribute(
      "data-drag",
      state.position > state.max / 2 ? "on" : "off"
    )
    root.style.setProperty("--switch-drag", `${state.position}px`)
  }

  const finish = (event: React.PointerEvent<HTMLElement>) => {
    const state = drag.current
    const root = rootRef.current
    drag.current = null
    if (!state || !root || !state.moved) {
      return
    }
    root.removeAttribute("data-dragging")
    root.removeAttribute("data-drag")
    root.style.removeProperty("--switch-drag")
    if (root.hasPointerCapture?.(event.pointerId)) {
      root.releasePointerCapture(event.pointerId)
    }
    const to = state.position > state.max / 2
    suppressClick.current = true
    pendingToggle.current = to !== state.from && event.type === "pointerup"
    setTimeout(() => {
      suppressClick.current = false
      if (pendingToggle.current) {
        pendingToggle.current = false
        root.click()
      }
    }, 0)
  }

  const onClickCapture = (event: React.MouseEvent<HTMLElement>) => {
    if (suppressClick.current) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: finish,
    onPointerCancel: finish,
    onClickCapture,
  }
}

function Switch({
  className,
  size = "default",
  variant = "default",
  icons = false,
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  readOnly,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onClickCapture,
  onAnimationEnd,
  ref,
  ...props
}: SwitchProps) {
  const rootRef = React.useRef<HTMLElement | null>(null)
  const [internal, setInternal] = React.useState(defaultChecked)
  const [pending, setPending] = React.useState(false)
  const controlled = checkedProp !== undefined
  const checked = controlled ? checkedProp : internal
  const latest = React.useRef(0)

  const blocked = Boolean(disabled || readOnly || pending)
  const dragHandlers = useThumbDrag(rootRef, () => !blocked)

  const setRef = React.useCallback(
    (node: HTMLElement | null) => {
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

  const handleChange = (
    next: boolean,
    details: SwitchPrimitive.Root.ChangeEventDetails
  ) => {
    if (pending) {
      details.cancel()
      return
    }
    if (!controlled) {
      setInternal(next)
    }
    const result = onCheckedChange?.(next, details)
    if (!isThenable(result)) {
      return
    }
    const id = ++latest.current
    setPending(true)
    Promise.resolve(result).then(
      () => {
        if (latest.current === id) {
          setPending(false)
        }
      },
      () => {
        if (latest.current !== id) {
          return
        }
        setPending(false)
        if (!controlled) {
          setInternal(!next)
        }
        const root = rootRef.current
        if (root && !prefersReducedMotion()) {
          root.removeAttribute("data-shake")
          void root.offsetWidth
          root.setAttribute("data-shake", "")
        }
      }
    )
  }

  return (
    <SwitchPrimitive.Root
      ref={setRef}
      checked={checked}
      onCheckedChange={handleChange}
      disabled={disabled}
      readOnly={readOnly}
      aria-busy={pending || undefined}
      data-pending={pending ? "" : undefined}
      data-size={size}
      data-variant={variant}
      className={(state) =>
        cn(
          switchVariants({ variant, size }),
          typeof className === "function" ? className(state) : className
        )
      }
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (!event.defaultPrevented) {
          dragHandlers.onPointerDown(event)
        }
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event)
        dragHandlers.onPointerMove(event)
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event)
        dragHandlers.onPointerUp(event)
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event)
        dragHandlers.onPointerCancel(event)
      }}
      onClickCapture={(event) => {
        onClickCapture?.(event)
        dragHandlers.onClickCapture(event)
      }}
      onAnimationEnd={(event) => {
        onAnimationEnd?.(event)
        if (event.target === event.currentTarget) {
          event.currentTarget.removeAttribute("data-shake")
        }
      }}
      {...props}
      data-slot="switch"
    >
      {icons ? (
        <span
          aria-hidden="true"
          data-slot="switch-icons"
          className="pointer-events-none absolute inset-0 flex items-center justify-between px-[calc((var(--switch-h)-0.625rem)/2)] text-primary-foreground group-data-[variant=ios]/switch:text-success-foreground [&_svg]:size-2.5"
        >
          <IconCheck
            stroke={3}
            className="opacity-0 transition-opacity duration-200 group-data-[drag=off]/switch:opacity-0 group-data-[drag=on]/switch:opacity-100 group-data-checked/switch:opacity-100"
          />
          <span className="size-2 rounded-full opacity-100 inset-ring-[1.5px] inset-ring-muted-foreground transition-opacity duration-200 group-data-[drag=off]/switch:opacity-100 group-data-[drag=on]/switch:opacity-0 group-data-checked/switch:opacity-0" />
        </span>
      ) : null}
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none relative z-1 flex h-(--switch-thumb) w-[calc(var(--switch-thumb-w)+var(--switch-stretch))] translate-x-[calc(var(--switch-x)*var(--switch-dir))] items-center justify-center rounded-full bg-background ring-(length:--hairline) ring-foreground/5 transition-[translate,width] duration-300 ease-spring group-data-dragging/switch:transition-none motion-reduce:transition-none dark:bg-foreground dark:group-data-[drag=off]/switch:bg-foreground dark:group-data-[drag=on]/switch:bg-primary-foreground dark:group-data-[variant=ios]/switch:group-data-[drag=on]/switch:bg-foreground dark:group-data-checked/switch:bg-primary-foreground dark:group-data-[variant=ios]/switch:group-data-checked/switch:bg-foreground forced-colors:border forced-colors:bg-canvas-text"
      >
        {pending ? (
          <Spinner
            aria-hidden
            size={null}
            className="size-[calc(var(--switch-thumb)-0.375rem)] text-muted-foreground"
          />
        ) : null}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch, switchVariants }
export type { SwitchProps }
