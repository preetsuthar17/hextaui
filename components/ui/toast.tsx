"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import {
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconInfoCircleFilled,
  IconX,
} from "@tabler/icons-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

type ToastType =
  "default" | "success" | "error" | "warning" | "info" | "loading"

type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"

type ToastAction = {
  label: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

type ToastOptions = {
  id?: string
  description?: React.ReactNode
  timeout?: number
  priority?: "low" | "high"
  action?: ToastAction
  onClose?: () => void
  onRemove?: () => void
}

type ToastData = { action?: ToastAction }

const manager = ToastPrimitive.createToastManager<ToastData>()

let counter = 0

function nextId() {
  counter += 1
  return `toast-${counter}`
}

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }
  if (Array.isArray(node)) {
    return node.map(textOf).join(" ")
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return textOf(node.props.children)
  }
  return ""
}

const readingFloor = 5000

function readingTimeout(title: React.ReactNode, description: React.ReactNode) {
  const words = `${textOf(title)} ${textOf(description)}`
    .split(/\s+/)
    .filter(Boolean).length
  const time = Math.min(15000, 2000 + words * 240)
  return time > readingFloor ? time : undefined
}

function toOptions(
  type: ToastType,
  title: React.ReactNode,
  { action, ...options }: ToastOptions = {}
) {
  return {
    ...options,
    type,
    title,
    timeout:
      type === "loading"
        ? 0
        : (options.timeout ?? readingTimeout(title, options.description)),
    data: { action },
  }
}

function show(type: ToastType, title: React.ReactNode, options?: ToastOptions) {
  const id = options?.id ?? nextId()
  manager.add({ id, ...toOptions(type, title, options) })
  return id
}

type PromiseState<Value> =
  | React.ReactNode
  | ((
      value: Value
    ) => React.ReactNode | (ToastOptions & { title: React.ReactNode }))

function resolveState<Value>(
  state: PromiseState<Value>,
  value: Value,
  type: ToastType
) {
  const result = typeof state === "function" ? state(value) : state
  if (
    result !== null &&
    typeof result === "object" &&
    !React.isValidElement(result) &&
    "title" in (result as object)
  ) {
    const { title, ...options } = result as ToastOptions & {
      title: React.ReactNode
    }
    return toOptions(type, title, options)
  }
  return toOptions(type, result as React.ReactNode)
}

const toast = Object.assign(
  (title: React.ReactNode, options?: ToastOptions) =>
    show("default", title, options),
  {
    success: (title: React.ReactNode, options?: ToastOptions) =>
      show("success", title, options),
    error: (title: React.ReactNode, options?: ToastOptions) =>
      show("error", title, { priority: "high", ...options }),
    warning: (title: React.ReactNode, options?: ToastOptions) =>
      show("warning", title, options),
    info: (title: React.ReactNode, options?: ToastOptions) =>
      show("info", title, options),
    loading: (title: React.ReactNode, options?: ToastOptions) =>
      show("loading", title, options),
    promise: <Value,>(
      promise: Promise<Value>,
      states: {
        loading: React.ReactNode
        success: PromiseState<Value>
        error: PromiseState<unknown>
      }
    ) => {
      const tracked = manager.promise(promise, {
        loading: toOptions("loading", states.loading),
        success: (value: Value) =>
          resolveState(states.success, value, "success"),
        error: (error: unknown) => resolveState(states.error, error, "error"),
      })
      promise.catch(() => undefined)
      tracked.catch(() => undefined)
      return tracked
    },
    update: (
      id: string,
      {
        type,
        title,
        ...options
      }: ToastOptions & {
        type?: ToastType
        title?: React.ReactNode
      }
    ) =>
      manager.update(id, {
        ...(type ? { type } : {}),
        ...(title !== undefined ? { title } : {}),
        ...(type && type !== "loading" && options.timeout === undefined
          ? {
              timeout:
                readingTimeout(title, options.description) ?? readingFloor,
            }
          : {}),
        ...options,
        ...(options.action ? { data: { action: options.action } } : {}),
      }),
    dismiss: (id?: string) => manager.close(id),
  }
)

const icons: Partial<Record<ToastType, React.ReactNode>> = {
  success: <IconCircleCheckFilled className="text-success" />,
  error: <IconCircleXFilled className="text-destructive" />,
  warning: <IconAlertTriangleFilled className="text-warning" />,
  info: <IconInfoCircleFilled className="text-info" />,
  loading: (
    <Spinner aria-hidden size={null} className="text-muted-foreground" />
  ),
}

function swipeFor(
  position: ToastPosition
): ToastPrimitive.Root.Props["swipeDirection"] {
  const vertical = position.startsWith("top") ? "up" : "down"
  if (position.endsWith("left")) {
    return [vertical, "left"]
  }
  if (position.endsWith("right")) {
    return [vertical, "right"]
  }
  return [vertical]
}

const rootClassName =
  "group/toast absolute inset-x-0 z-[calc(1000-var(--toast-index))] h-(--height) w-full rounded-xl bg-popover text-popover-foreground shadow-lg ring-(length:--hairline) forced-colors:border ring-foreground/10 select-none [--gap:0.625rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--peek:0.625rem] [--scale:calc(max(0,1-(var(--toast-index)*0.06)))] [--shrink:calc(1-var(--scale))] [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+var(--toast-dir)*(var(--toast-index)*var(--peek)+var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_450ms_cubic-bezier(0.22,1,0.36,1),opacity_350ms,height_200ms_cubic-bezier(0.22,1,0.36,1)] group-data-[position^=bottom]/toaster:bottom-0 group-data-[position^=bottom]/toaster:origin-bottom group-data-[position^=top]/toaster:top-0 group-data-[position^=top]/toaster:origin-top after:absolute after:inset-x-0 after:h-[calc(var(--gap)+1px)] group-data-[position^=bottom]/toaster:after:top-full group-data-[position^=top]/toaster:after:bottom-full data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-dir)*(var(--toast-offset-y)+var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y)))] data-limited:opacity-0 data-starting-style:[transform:translateY(calc(var(--toast-dir)*-150%))] data-ending-style:opacity-0 [&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(calc(var(--toast-dir)*-150%))] data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))] data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))] data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))] data-swiping:[transition:none] motion-reduce:[transition:opacity_200ms]"

function ToastItem({
  item,
  position,
}: {
  item: ToastPrimitive.Root.ToastObject<ToastData>
  position: ToastPosition
}) {
  const type = (item.type ?? "default") as ToastType
  const icon = icons[type]
  const action = item.data?.action

  return (
    <ToastPrimitive.Root
      toast={item}
      swipeDirection={swipeFor(position)}
      data-slot="toast"
      className={rootClassName}
    >
      <ToastPrimitive.Content
        data-slot="toast-content"
        className="flex items-start gap-3 overflow-hidden p-4 transition-opacity duration-250 data-behind:opacity-0 data-expanded:opacity-100"
      >
        {icon ? (
          <span
            key={type}
            data-slot="toast-icon"
            className="mt-px flex size-4 shrink-0 items-center justify-center motion-safe:animate-in motion-safe:animation-duration-300 motion-safe:fade-in-0 motion-safe:zoom-in-50 [&_svg]:size-4"
          >
            {icon}
          </span>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <ToastPrimitive.Title
            data-slot="toast-title"
            className="text-sm leading-5 font-medium wrap-break-word"
          />
          <ToastPrimitive.Description
            data-slot="toast-description"
            className="text-sm leading-5 wrap-break-word text-muted-foreground"
          />
        </div>
        {action ? (
          <ToastPrimitive.Action
            data-slot="toast-action"
            className={cn(
              buttonVariants({ variant: "outline", size: "xs" }),
              "-my-0.5 shrink-0"
            )}
            onClick={(event) => {
              action.onClick?.(event)
              if (!event.defaultPrevented) {
                manager.close(item.id)
              }
            }}
          >
            {action.label}
          </ToastPrimitive.Action>
        ) : null}
        <ToastPrimitive.Close
          data-slot="toast-close"
          aria-label="Dismiss"
          className="relative -me-1.5 -mt-1 flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity duration-150 outline-none group-hover/toast:opacity-100 after:absolute after:-inset-1.5 hover:bg-muted hover:text-foreground focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden pointer-coarse:opacity-100 [&_svg]:size-3.5"
        >
          <IconX />
        </ToastPrimitive.Close>
      </ToastPrimitive.Content>
    </ToastPrimitive.Root>
  )
}

function ToastList({ position }: { position: ToastPosition }) {
  const { toasts } = ToastPrimitive.useToastManager<ToastData>()
  return toasts.map((item) => (
    <ToastItem key={item.id} item={item} position={position} />
  ))
}

const positionClassName: Record<ToastPosition, string> = {
  "top-left": "top-4 sm:top-6 sm:left-6",
  "top-center": "top-4 sm:top-6 sm:left-1/2 sm:-translate-x-1/2",
  "top-right": "top-4 sm:top-6 sm:right-6",
  "bottom-left": "bottom-4 sm:bottom-6 sm:left-6",
  "bottom-center": "bottom-4 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2",
  "bottom-right": "bottom-4 sm:bottom-6 sm:right-6",
}

type ToasterProps = Omit<
  ToastPrimitive.Viewport.Props,
  "children" | "className"
> & {
  className?: string
  position?: ToastPosition
  limit?: number
  timeout?: number
}

function Toaster({
  className,
  position = "bottom-right",
  limit = 3,
  timeout = 5000,
  ...props
}: ToasterProps) {
  return (
    <ToastPrimitive.Provider
      toastManager={manager}
      limit={limit}
      timeout={timeout}
    >
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport
          data-slot="toaster"
          data-position={position}
          className={cn(
            "group/toaster fixed inset-x-4 z-100 mx-auto outline-none focus-visible:outline-hidden data-[position^=bottom]:[--toast-dir:-1] data-[position^=top]:[--toast-dir:1] sm:inset-x-auto sm:w-[22.5rem]",
            positionClassName[position],
            className
          )}
          {...props}
        >
          <ToastList position={position} />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  )
}

export { Toaster, toast }
export type {
  ToastAction,
  ToastOptions,
  ToastPosition,
  ToasterProps,
  ToastType,
}
