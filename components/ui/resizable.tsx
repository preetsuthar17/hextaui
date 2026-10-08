"use client"

import * as React from "react"
import { cn } from "cn"
import * as ResizablePrimitive from "react-resizable-panels"

function useMergedElementRef<T>(
  own: React.RefObject<T | null>,
  external: React.Ref<T | null> | undefined
) {
  return React.useCallback(
    (node: T | null) => {
      own.current = node
      if (typeof external === "function") {
        return external(node)
      }
      if (external) {
        external.current = node
      }
      return undefined
    },
    [own, external]
  )
}

function ResizablePanelGroup({
  className,
  elementRef,
  groupRef: groupHandleRef,
  defaultLayout,
  onPointerDownCapture,
  onKeyDownCapture,
  ...props
}: ResizablePrimitive.GroupProps) {
  const groupRef = React.useRef<HTMLDivElement | null>(null)
  const setRef = useMergedElementRef(groupRef, elementRef)
  const handleRef =
    React.useRef<ResizablePrimitive.GroupImperativeHandle | null>(null)
  const setHandleRef = useMergedElementRef(handleRef, groupHandleRef)
  const appliedLayout = React.useRef(defaultLayout)
  const interacted = React.useRef(false)

  React.useLayoutEffect(() => {
    const previous = appliedLayout.current
    appliedLayout.current = defaultLayout
    if (
      !defaultLayout ||
      interacted.current ||
      JSON.stringify(defaultLayout) === JSON.stringify(previous)
    ) {
      return
    }
    const element = groupRef.current
    const ready = element?.hasAttribute("data-ready")
    element?.removeAttribute("data-ready")
    handleRef.current?.setLayout(defaultLayout)
    if (ready) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => element?.setAttribute("data-ready", ""))
      })
    }
  }, [defaultLayout])

  React.useEffect(() => {
    let second = 0
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        groupRef.current?.setAttribute("data-ready", "")
      })
    })
    return () => {
      cancelAnimationFrame(first)
      cancelAnimationFrame(second)
    }
  }, [])

  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      elementRef={setRef}
      groupRef={setHandleRef}
      defaultLayout={defaultLayout}
      onPointerDownCapture={(event) => {
        onPointerDownCapture?.(event)
        interacted.current = true
      }}
      onKeyDownCapture={(event) => {
        onKeyDownCapture?.(event)
        interacted.current = true
      }}
      className={cn(
        "flex h-full w-full min-w-0 aria-[orientation=vertical]:flex-col motion-safe:data-ready:not-has-[>[data-separator=active]]:*:data-panel:transition-[flex-grow] motion-safe:data-ready:not-has-[>[data-separator=active]]:*:data-panel:duration-300 motion-safe:data-ready:not-has-[>[data-separator=active]]:*:data-panel:ease-out-quint",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({
  className,
  ...props
}: ResizablePrimitive.PanelProps) {
  return (
    <ResizablePrimitive.Panel
      data-slot="resizable-panel"
      className={cn("min-w-0", className)}
      {...props}
    />
  )
}

type ResizableSizeUnit = "percent" | "pixels"

function useSizeReadout(
  separatorRef: React.RefObject<HTMLDivElement | null>,
  valueRef: React.RefObject<HTMLSpanElement | null>,
  unit: ResizableSizeUnit | null
) {
  React.useEffect(() => {
    const separator = separatorRef.current
    const value = valueRef.current
    if (!unit || !separator || !value) {
      return
    }
    let panel = separator.previousElementSibling
    while (panel && !panel.hasAttribute("data-panel")) {
      panel = panel.previousElementSibling
    }

    const update = () => {
      if (unit === "percent") {
        const now = Number(separator.getAttribute("aria-valuenow"))
        value.textContent = Number.isFinite(now) ? `${Math.round(now)}%` : ""
        return
      }
      if (!panel) {
        value.textContent = ""
        return
      }
      const rect = panel.getBoundingClientRect()
      const vertical =
        separator.getAttribute("aria-orientation") === "horizontal"
      value.textContent = `${Math.round(vertical ? rect.height : rect.width)}px`
    }

    update()
    const mutations = new MutationObserver(update)
    mutations.observe(separator, {
      attributes: true,
      attributeFilter: ["aria-valuenow"],
    })
    const resize =
      typeof ResizeObserver === "undefined" || !panel
        ? null
        : new ResizeObserver(update)
    if (panel) {
      resize?.observe(panel)
    }
    return () => {
      mutations.disconnect()
      resize?.disconnect()
    }
  }, [separatorRef, valueRef, unit])
}

type ResizableHandleProps = ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
  showSize?: boolean | ResizableSizeUnit
}

function ResizableHandle({
  withHandle = false,
  showSize = false,
  className,
  elementRef,
  children,
  ...props
}: ResizableHandleProps) {
  const separatorRef = React.useRef<HTMLDivElement | null>(null)
  const valueRef = React.useRef<HTMLSpanElement | null>(null)
  const setRef = useMergedElementRef(separatorRef, elementRef)
  const unit = showSize === true ? "percent" : showSize || null
  useSizeReadout(separatorRef, valueRef, unit)

  return (
    <ResizablePrimitive.Separator
      aria-label="Resize panels"
      data-slot="resizable-handle"
      data-with-handle={withHandle ? "" : undefined}
      elementRef={setRef}
      className={cn(
        "group/resizable-handle relative z-1 flex w-px shrink-0 items-center justify-center bg-border outline-none [--resizable-line:1px] before:absolute before:inset-y-0 before:start-1/2 before:w-(--resizable-line) before:-translate-x-1/2 before:bg-transparent before:transition-[width,height,background-color] before:duration-150 before:ease-out-quint focus-visible:outline-hidden focus-visible:[--resizable-line:3px] focus-visible:before:bg-focus-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:before:inset-x-0 aria-[orientation=horizontal]:before:inset-y-auto aria-[orientation=horizontal]:before:start-0 aria-[orientation=horizontal]:before:top-1/2 aria-[orientation=horizontal]:before:h-(--resizable-line) aria-[orientation=horizontal]:before:w-auto aria-[orientation=horizontal]:before:translate-x-0 aria-[orientation=horizontal]:before:-translate-y-1/2 data-[separator=active]:[--resizable-line:3px] data-[separator=active]:before:bg-primary data-[separator=disabled]:cursor-default data-[separator=hover]:[--resizable-line:3px] data-[separator=hover]:before:bg-muted-foreground/40 motion-reduce:before:transition-none rtl:before:translate-x-1/2 forced-colors:bg-canvas-text",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="resizable-handle-grip"
        className="pointer-events-none relative h-8 w-1.5 shrink-0 scale-75 rounded-full bg-background opacity-0 inset-ring-(length:--hairline) inset-ring-border transition-[opacity,scale,box-shadow] duration-150 ease-out-quint group-focus-visible/resizable-handle:scale-100 group-focus-visible/resizable-handle:opacity-100 group-aria-[orientation=horizontal]/resizable-handle:h-1.5 group-aria-[orientation=horizontal]/resizable-handle:w-8 group-data-with-handle/resizable-handle:scale-100 group-data-with-handle/resizable-handle:opacity-100 group-data-[separator=active]/resizable-handle:scale-100 group-data-[separator=active]/resizable-handle:opacity-100 group-data-[separator=active]/resizable-handle:inset-ring-primary group-data-[separator=disabled]/resizable-handle:hidden group-data-[separator=hover]/resizable-handle:scale-100 group-data-[separator=hover]/resizable-handle:opacity-100 motion-reduce:transition-none dark:bg-muted forced-colors:border"
      />
      {unit ? (
        <span
          aria-hidden="true"
          data-slot="resizable-handle-size"
          className="pointer-events-none absolute start-1/2 top-1/2 translate-x-[-50%] -translate-y-[calc(50%+1.75rem)] scale-95 rounded-md bg-popover px-1.5 py-0.5 font-mono text-[0.6875rem] whitespace-nowrap text-popover-foreground tabular-nums opacity-0 shadow-sm ring-(length:--hairline) ring-foreground/10 transition-[opacity,scale] duration-150 ease-out-quint group-focus-visible/resizable-handle:scale-100 group-focus-visible/resizable-handle:opacity-100 group-aria-[orientation=horizontal]/resizable-handle:-translate-x-[calc(50%+3rem)] group-aria-[orientation=horizontal]/resizable-handle:-translate-y-1/2 group-data-[separator=active]/resizable-handle:scale-100 group-data-[separator=active]/resizable-handle:opacity-100 motion-reduce:transition-none rtl:translate-x-1/2 forced-colors:border"
        >
          <span ref={valueRef} />
        </span>
      ) : null}
      {children}
    </ResizablePrimitive.Separator>
  )
}

function subscribeNothing() {
  return () => {}
}

type UseDefaultLayoutOptions = Parameters<
  typeof ResizablePrimitive.useDefaultLayout
>[0]

function useDefaultLayout(options: UseDefaultLayoutOptions) {
  const hydrated = React.useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false
  )
  const custom = options.storage
  const storage = React.useMemo<ResizablePrimitive.LayoutStorage>(
    () =>
      custom ?? {
        getItem: (key) => {
          if (!hydrated) {
            return null
          }
          try {
            return window.localStorage.getItem(key)
          } catch {
            return null
          }
        },
        setItem: (key, value) => {
          if (!hydrated) {
            return
          }
          try {
            window.localStorage.setItem(key, value)
          } catch {}
        },
      },
    [custom, hydrated]
  )
  return ResizablePrimitive.useDefaultLayout({ ...options, storage })
}

const usePanelRef = ResizablePrimitive.usePanelRef
const useGroupRef = ResizablePrimitive.useGroupRef

export {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  useDefaultLayout,
  useGroupRef,
  usePanelRef,
}
export type { ResizableHandleProps, ResizableSizeUnit }
