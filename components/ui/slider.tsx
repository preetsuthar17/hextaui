"use client"

import * as React from "react"
import {
  DirectionProvider,
  useDirection,
  type TextDirection,
} from "@base-ui/react/direction-provider"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

const jumpTime = 180

const sliderVariants = cva(
  "group/slider flex min-w-0 data-disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "[--slider-thumb:0.875rem] [--slider-track:0.25rem]",
        default: "[--slider-thumb:1.125rem] [--slider-track:0.375rem]",
        lg: "[--slider-thumb:1.375rem] [--slider-track:0.5rem]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const orientationClasses = {
  horizontal: {
    root: "w-full flex-wrap items-center gap-x-3 gap-y-2",
    control:
      "h-(--slider-thumb) w-full basis-full before:inset-x-0 before:-inset-y-2 pointer-coarse:before:-inset-y-3.5",
    track: "h-(--slider-track) w-full",
    value: "bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 origin-bottom",
  },
  vertical: {
    root: "h-full flex-col items-center gap-3",
    control:
      "min-h-40 w-(--slider-thumb) flex-1 flex-col justify-center before:-inset-x-2 before:inset-y-0 pointer-coarse:before:-inset-x-3.5",
    track: "h-full w-(--slider-track)",
    value:
      "start-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 origin-left rtl:origin-right",
  },
} as const

type SliderValueType = number | readonly number[]

type SliderProps<Value extends SliderValueType = SliderValueType> =
  SliderPrimitive.Root.Props<Value> &
    VariantProps<typeof sliderVariants> & {
      showValue?: boolean
      draggableRange?: boolean
      getAriaLabel?: (index: number) => string
      getAriaValueText?: (
        formattedValue: string,
        value: number,
        index: number
      ) => string
    }

type RangeDrag = {
  id: number
  origin: number
  values: readonly number[]
  scale: number
  valueAt: (position: number) => number
  started: boolean
  last: number[] | null
}

function countThumbs(value: unknown) {
  return Array.isArray(value) ? Math.max(1, Math.min(value.length, 100)) : 1
}

function sameValue(a: unknown, b: unknown) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => item === b[index])
  }
  return a === b
}

function decimalsOf(value: number) {
  return Number.isFinite(value) ? (String(value).split(".")[1] ?? "").length : 0
}

function changeDetails(
  reason: "drag" | "track-press",
  event: PointerEvent,
  trigger: Element
) {
  const details = {
    reason,
    event,
    trigger,
    activeThumbIndex: -1,
    isCanceled: false,
    isPropagationAllowed: false,
    cancel() {
      details.isCanceled = true
    },
    allowPropagation() {
      details.isPropagationAllowed = true
    },
  }
  return details as SliderPrimitive.Root.ChangeEventDetails
}

function useJump(rootRef: React.RefObject<HTMLElement | null>) {
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )
  const drags = React.useRef(0)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const stop = React.useCallback(() => {
    clearTimeout(timer.current)
    rootRef.current?.removeAttribute("data-jump")
  }, [rootRef])

  const start = React.useCallback(() => {
    const root = rootRef.current
    if (!root) {
      return
    }
    clearTimeout(timer.current)
    drags.current = 0
    root.setAttribute("data-jump", "")
    timer.current = setTimeout(stop, jumpTime + 40)
  }, [rootRef, stop])

  const drag = React.useCallback(() => {
    if (!rootRef.current?.hasAttribute("data-jump")) {
      return
    }
    drags.current += 1
    if (drags.current >= 3) {
      stop()
    }
  }, [rootRef, stop])

  return { start, drag, stop }
}

function Slider<Value extends SliderValueType>({
  className,
  children,
  size = "default",
  showValue = false,
  draggableRange = false,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  minStepsBetweenValues = 0,
  orientation = "horizontal",
  thumbAlignment = "edge",
  locale = "en-US",
  format,
  disabled,
  onValueChange,
  onValueCommitted,
  getAriaLabel,
  getAriaValueText,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ref,
  ...props
}: SliderProps<Value>) {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const inherited = useDirection()
  const [domDirection, setDomDirection] = React.useState<TextDirection>("ltr")
  const direction = domDirection === "rtl" ? "rtl" : inherited
  const jump = useJump(rootRef)
  const controlled = value !== undefined
  const [internal, setInternal] = React.useState<SliderValueType>(
    defaultValue ?? min
  )
  const current = controlled ? value : internal
  const emitted = React.useRef<unknown>(current)
  const previous = React.useRef<unknown>(current)
  const rangeDrag = React.useRef<RangeDrag | null>(null)
  const thumbs = countThumbs(current)
  const layout = orientationClasses[orientation]
  const vertical = orientation === "vertical"
  const rangeEnabled = draggableRange && !disabled && thumbs > 1

  const formatter = React.useMemo(() => {
    try {
      return new Intl.NumberFormat(locale, format)
    } catch {
      return new Intl.NumberFormat("en-US")
    }
  }, [locale, format])

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node
      if (node?.isConnected) {
        setDomDirection(
          getComputedStyle(node).direction === "rtl" ? "rtl" : "ltr"
        )
      }
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

  const blockTouchPress = React.useCallback((control: HTMLElement | null) => {
    if (!control) {
      return undefined
    }
    const onTouchStart = (event: TouchEvent) => {
      if (rangeDrag.current) {
        event.stopImmediatePropagation()
        event.stopPropagation()
      }
    }
    control.addEventListener("touchstart", onTouchStart, {
      capture: true,
      passive: true,
    })
    return () => control.removeEventListener("touchstart", onTouchStart, true)
  }, [])

  React.useLayoutEffect(() => {
    if (sameValue(current, previous.current)) {
      return
    }
    previous.current = current
    if (!sameValue(current, emitted.current)) {
      jump.start()
    }
  }, [current, jump])

  const handleValueChange = (
    next: number | readonly number[],
    details: SliderPrimitive.Root.ChangeEventDetails
  ) => {
    onValueChange?.(next as never, details)
    if (details.isCanceled) {
      return false
    }
    emitted.current = next
    if (!controlled) {
      setInternal(next)
    }
    if (details.reason === "drag") {
      jump.drag()
    } else {
      jump.start()
    }
    return true
  }

  const axisOf = (event: { clientX: number; clientY: number }) =>
    vertical ? event.clientY : event.clientX

  const startRangeDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      !rangeEnabled ||
      event.button !== 0 ||
      !Array.isArray(current) ||
      !(event.target instanceof Element) ||
      event.target.closest("[data-slot=slider-thumb]")
    ) {
      return
    }
    const control = event.currentTarget
    const handles = control.querySelectorAll<HTMLElement>(
      "[data-slot=slider-thumb]"
    )
    const first = handles[0]?.getBoundingClientRect()
    const last = handles[handles.length - 1]?.getBoundingClientRect()
    if (!first || !last) {
      return
    }
    const thumbSize = vertical ? first.height : first.width
    const centers = [first, last].map((rect) =>
      vertical ? rect.top + rect.height / 2 : rect.left + rect.width / 2
    )
    const position = axisOf(event)
    if (
      position <= Math.min(...centers) + thumbSize / 2 ||
      position >= Math.max(...centers) - thumbSize / 2
    ) {
      return
    }
    const rect = control.getBoundingClientRect()
    const inset = thumbAlignment === "center" ? 0 : thumbSize
    const length = (vertical ? rect.height : rect.width) - inset
    if (length <= 0 || max <= min) {
      return
    }
    event.preventDefault()
    const sign = vertical || direction === "rtl" ? -1 : 1
    const startEdge = vertical
      ? rect.bottom
      : direction === "rtl"
        ? rect.right
        : rect.left
    control.setPointerCapture?.(event.pointerId)
    rangeDrag.current = {
      id: event.pointerId,
      origin: position,
      values: current,
      scale: ((max - min) / length) * sign,
      valueAt: (at) =>
        min +
        Math.min(
          1,
          Math.max(0, ((at - startEdge) * sign - inset / 2) / length)
        ) *
          (max - min),
      started: false,
      last: null,
    }
  }

  const moveRange = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = rangeDrag.current
    if (!state || event.pointerId !== state.id) {
      return
    }
    const distance = axisOf(event) - state.origin
    if (!state.started) {
      if (Math.abs(distance) < 3) {
        return
      }
      state.started = true
      jump.stop()
      rootRef.current?.setAttribute("data-range-dragging", "")
    }
    const values = state.values
    const precision = Math.max(decimalsOf(step), decimalsOf(min))
    const snapped = Math.round((distance * state.scale) / step) * step
    const delta = Math.min(
      max - values[values.length - 1],
      Math.max(min - values[0], snapped)
    )
    const next = values.map((item) => Number((item + delta).toFixed(precision)))
    if (sameValue(next, state.last ?? values)) {
      return
    }
    if (
      handleValueChange(
        next,
        changeDetails("drag", event.nativeEvent, event.currentTarget)
      )
    ) {
      state.last = next
    }
  }

  const endRange = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = rangeDrag.current
    if (!state || event.pointerId !== state.id) {
      return
    }
    rangeDrag.current = null
    rootRef.current?.removeAttribute("data-range-dragging")
    const control = event.currentTarget
    if (control.hasPointerCapture?.(event.pointerId)) {
      control.releasePointerCapture(event.pointerId)
    }
    if (state.started) {
      if (state.last) {
        onValueCommitted?.(state.last as never, {
          reason: "drag",
          event: event.nativeEvent,
        })
      }
      return
    }
    if (event.type !== "pointerup") {
      return
    }
    const values = state.values
    const precision = Math.max(decimalsOf(step), decimalsOf(min))
    const raw =
      min + Math.round((state.valueAt(axisOf(event)) - min) / step) * step
    let index = 0
    values.forEach((item, i) => {
      if (Math.abs(item - raw) <= Math.abs(values[index] - raw)) {
        index = i
      }
    })
    const gap = minStepsBetweenValues * step
    const floor = index > 0 ? values[index - 1] + gap : min
    const ceiling = index < values.length - 1 ? values[index + 1] - gap : max
    const target = Number(
      Math.min(ceiling, Math.max(floor, raw)).toFixed(precision)
    )
    const next = values.map((item, i) => (i === index ? target : item))
    control
      .querySelectorAll<HTMLElement>("[data-slot=slider-thumb]")
      [index]?.querySelector("input")
      ?.focus({ preventScroll: true, focusVisible: false } as FocusOptions)
    if (
      !sameValue(next, values) &&
      handleValueChange(
        next,
        changeDetails("track-press", event.nativeEvent, control)
      )
    ) {
      onValueCommitted?.(next as never, {
        reason: "track-press",
        event: event.nativeEvent,
      })
    }
  }

  return (
    <DirectionProvider direction={direction}>
      <SliderPrimitive.Root
        ref={setRef}
        value={current as Value}
        min={min}
        max={max}
        step={step}
        minStepsBetweenValues={minStepsBetweenValues}
        orientation={orientation}
        thumbAlignment={thumbAlignment}
        locale={locale}
        format={format}
        disabled={disabled}
        onValueChange={handleValueChange}
        onValueCommitted={onValueCommitted}
        data-size={size}
        className={mergeClassName(
          cn(sliderVariants({ size }), layout.root),
          className
        )}
        {...props}
        data-slot="slider"
      >
        {children}
        <SliderPrimitive.Control
          ref={rangeEnabled ? blockTouchPress : undefined}
          data-slot="slider-control"
          onPointerDown={rangeEnabled ? startRangeDrag : undefined}
          onPointerMove={rangeEnabled ? moveRange : undefined}
          onPointerUp={rangeEnabled ? endRange : undefined}
          onPointerCancel={rangeEnabled ? endRange : undefined}
          className={cn(
            "relative flex cursor-pointer touch-none items-center select-none [-webkit-tap-highlight-color:transparent] group-data-dragging/slider:cursor-grabbing group-data-range-dragging/slider:cursor-grabbing before:absolute data-disabled:cursor-not-allowed",
            layout.control
          )}
        >
          <SliderPrimitive.Track
            data-slot="slider-track"
            className={cn(
              "relative grow overflow-hidden rounded-full bg-foreground/10 select-none dark:bg-foreground/15 forced-colors:border",
              layout.track
            )}
          >
            <SliderPrimitive.Indicator
              data-slot="slider-range"
              className={cn(
                "bg-primary select-none motion-safe:group-data-jump/slider:transition-[width,height,left,right,bottom] motion-safe:group-data-jump/slider:duration-180 motion-safe:group-data-jump/slider:ease-out-quint forced-colors:bg-highlight",
                rangeEnabled &&
                  "cursor-grab group-data-range-dragging/slider:cursor-grabbing"
              )}
            />
          </SliderPrimitive.Track>
          {Array.from({ length: thumbs }, (_, index) => (
            <SliderPrimitive.Thumb
              key={index}
              index={index}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledBy}
              getAriaLabel={getAriaLabel}
              getAriaValueText={getAriaValueText}
              data-slot="slider-thumb"
              className="group/slider-thumb relative block size-(--slider-thumb) shrink-0 cursor-grab rounded-full border border-foreground/20 bg-background bg-clip-padding transition-[box-shadow,border-color] duration-150 ease-out-quint outline-none select-none group-data-dragging/slider:cursor-grabbing group-data-range-dragging/slider:ring-6 group-data-range-dragging/slider:ring-foreground/8 after:absolute after:-inset-1.5 hover:ring-4 hover:ring-foreground/6 focus-visible:outline-hidden has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-focus-ring data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 motion-safe:group-data-jump/slider:transition-[box-shadow,border-color,left,right,bottom] motion-safe:group-data-jump/slider:duration-[150ms,150ms,180ms,180ms,180ms] dark:border-background/60 dark:bg-foreground dark:group-data-range-dragging/slider:ring-foreground/15 dark:hover:ring-foreground/10 dark:data-invalid:ring-destructive/40 pointer-coarse:after:-inset-3.5 data-disabled:cursor-not-allowed data-disabled:hover:ring-0 group-data-dragging/slider:data-active:ring-6 group-data-dragging/slider:data-active:ring-foreground/8 dark:group-data-dragging/slider:data-active:ring-foreground/15"
              render={(thumbProps, state) => (
                <div
                  {...thumbProps}
                  data-active={
                    state.activeThumbIndex === index ? "" : undefined
                  }
                >
                  {showValue ? (
                    <span
                      aria-hidden="true"
                      dir="auto"
                      data-slot="slider-thumb-value"
                      className={cn(
                        "pointer-events-none absolute rounded-md bg-foreground px-1.5 py-0.5 text-xs/4 font-medium whitespace-nowrap text-background tabular-nums opacity-0 shadow-md/10 transition-[opacity,scale] duration-100 ease-out-quint group-has-[:focus-visible]/slider-thumb:opacity-100 group-has-[:focus-visible]/slider-thumb:duration-150 group-data-range-dragging/slider:opacity-100 group-data-range-dragging/slider:duration-150 group-data-dragging/slider:group-data-active/slider-thumb:opacity-100 group-data-dragging/slider:group-data-active/slider-thumb:duration-150 motion-safe:scale-96 motion-safe:group-has-[:focus-visible]/slider-thumb:scale-100 motion-safe:group-data-range-dragging/slider:scale-100 motion-safe:group-data-dragging/slider:group-data-active/slider-thumb:scale-100",
                        layout.value
                      )}
                    >
                      {Number.isFinite(state.values[index])
                        ? formatter.format(state.values[index])
                        : null}
                    </span>
                  ) : null}
                  {thumbProps.children}
                </div>
              )}
            />
          ))}
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
    </DirectionProvider>
  )
}

function SliderLabel({ className, ...props }: SliderPrimitive.Label.Props) {
  return (
    <SliderPrimitive.Label
      data-slot="slider-label"
      className={mergeClassName(
        "min-w-0 flex-1 text-sm font-medium wrap-anywhere select-none",
        className
      )}
      {...props}
    />
  )
}

function SliderValue({ className, ...props }: SliderPrimitive.Value.Props) {
  return (
    <SliderPrimitive.Value
      data-slot="slider-value"
      className={mergeClassName(
        "ms-auto shrink-0 text-sm text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    />
  )
}

export { Slider, SliderLabel, SliderValue, sliderVariants }
export type { SliderProps }
