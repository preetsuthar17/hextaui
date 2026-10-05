"use client"

import * as React from "react"
import {
  DirectionProvider,
  useDirection,
} from "@base-ui/react/direction-provider"
import { mergeProps } from "@base-ui/react/merge-props"
import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field"
import { useRender } from "@base-ui/react/use-render"
import { IconMinus } from "@tabler/icons-react"
import { cva } from "class-variance-authority"
import { cn } from "cn"

import { easeOut, prefersReducedMotion } from "@/lib/motion"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

type InputOTPStatus = "idle" | "loading" | "success" | "error"
type InputOTPVariant = "joined" | "separate"
type InputOTPSize = "sm" | "default" | "lg"

type InputOTPChange = {
  id: number
  kind: "type" | "fill" | "shift" | "clear"
  start: number
  end: number
}

type InputOTPContextValue = {
  animated: boolean
  mask: boolean
  variant: InputOTPVariant
  size: InputOTPSize
  status: InputOTPStatus
  invalid: boolean
  selected: boolean
  change: InputOTPChange
}

const InputOTPContext = React.createContext<InputOTPContextValue | null>(null)

function useInputOTPContext(part: string) {
  const context = React.useContext(InputOTPContext)
  if (!context) {
    throw new Error(`<${part}> must be used within <InputOTP>.`)
  }
  return context
}

const staggerStep = 45
const exitStep = 25
const maxStaggerSteps = 8
const maskCharacter = "•"

const initialChange: InputOTPChange = {
  id: 0,
  kind: "type",
  start: 0,
  end: 0,
}

function describeChange(
  previous: string,
  next: string,
  id: number
): InputOTPChange {
  const before = Array.from(previous)
  const after = Array.from(next)
  let start = 0
  while (
    start < before.length &&
    start < after.length &&
    before[start] === after[start]
  ) {
    start += 1
  }
  if (
    after.length === before.length - 1 &&
    after.join("") ===
      [...before.slice(0, start), ...before.slice(start + 1)].join("")
  ) {
    return { id, kind: "shift", start, end: before.length - 1 }
  }
  let entered = 0
  for (let index = start; index < after.length; index += 1) {
    if (after[index] !== before[index]) {
      entered += 1
    }
  }
  if (entered === 0) {
    return { id, kind: "clear", start, end: before.length - 1 }
  }
  return {
    id,
    kind: entered > 1 ? "fill" : "type",
    start,
    end: after.length - 1,
  }
}

const validationPatterns = {
  numeric: /[^\d]/g,
  alpha: /[^a-zA-Z]/g,
  alphanumeric: /[^a-zA-Z0-9]/g,
}

function normalizeCode(
  raw: string,
  length: number,
  validationType: OTPFieldPrimitive.Root.ValidationType,
  normalizeValue: ((value: string) => string) | undefined
) {
  const pattern =
    validationType === "none" ? null : validationPatterns[validationType]
  const filter = (value: string) =>
    pattern ? value.replace(pattern, "") : value
  let value = filter(raw.replace(/\s/g, ""))
  if (normalizeValue) {
    value = filter(normalizeValue(value))
  }
  return Array.from(value).slice(0, Math.max(length, 0)).join("")
}

function rawInput(details: OTPFieldPrimitive.Root.ChangeEventDetails) {
  if (details.reason === "input-paste") {
    return details.event.clipboardData?.getData("text/plain") ?? ""
  }
  const target = details.event.target
  return target instanceof HTMLInputElement ? target.value : ""
}

function makeDetails(
  reason: "input-change" | "input-clear",
  event: Event,
  target: EventTarget | null
) {
  let canceled = false
  let propagationAllowed = false
  return {
    reason,
    event,
    trigger: target instanceof Element ? target : undefined,
    cancel() {
      canceled = true
    },
    allowPropagation() {
      propagationAllowed = true
    },
    get isCanceled() {
      return canceled
    },
    get isPropagationAllowed() {
      return propagationAllowed
    },
  } as OTPFieldPrimitive.Root.ChangeEventDetails
}

const passiveKeys = new Set(["Shift", "Control", "Alt", "Meta", "CapsLock"])

function canAnimate() {
  return (
    typeof window !== "undefined" &&
    typeof HTMLElement !== "undefined" &&
    typeof HTMLElement.prototype.animate === "function"
  )
}

const inputOTPGroupVariants = cva("flex min-w-0 items-center", {
  variants: {
    variant: {
      joined: "rounded-md",
      separate: "",
    },
    size: {
      sm: "",
      default: "",
      lg: "",
    },
  },
  compoundVariants: [
    { variant: "separate", size: "sm", className: "gap-1.5" },
    { variant: "separate", size: "default", className: "gap-2" },
    { variant: "separate", size: "lg", className: "gap-2.5" },
  ],
  defaultVariants: {
    variant: "joined",
    size: "default",
  },
})

const inputOTPSlotVariants = cva(
  "group/input-otp-slot relative flex min-w-0 shrink items-center justify-center bg-transparent text-foreground tabular-nums inset-ring-(length:--hairline) inset-ring-input transition-[box-shadow,color,background-color] duration-150 ease-out-cubic select-none [-webkit-tap-highlight-color:transparent] has-[>input:focus]:z-10 has-[>input:focus]:ring-3 has-[>input:focus]:ring-focus-ring has-[>input:focus]:inset-ring-ring has-[>input[aria-invalid=true]]:inset-ring-destructive has-[>input[aria-invalid=true]:focus]:ring-destructive/20 has-[>input[readonly]]:not-data-[status=loading]:bg-muted/40 data-[selected]:bg-primary/10 data-[selected]:inset-ring-ring/70 data-[status=loading]:text-muted-foreground data-[status=success]:inset-ring-success data-[status=success]:has-[>input:focus]:ring-success/20 data-[status=success]:has-[>input:focus]:inset-ring-success motion-reduce:transition-none dark:bg-input/30 dark:has-[>input[aria-invalid=true]:focus]:ring-destructive/40 dark:has-[>input[readonly]]:not-data-[status=loading]:bg-input/20 dark:data-[selected]:bg-primary/20 dark:data-[status=success]:has-[>input:focus]:ring-success/30 forced-colors:border pointer-coarse:text-[max(16px,1rem)] [@media(hover:hover)]:hover:not-has-[>input:focus]:not-has-[>input:disabled]:not-has-[>input[aria-invalid=true]]:not-data-[status=success]:z-1 [@media(hover:hover)]:hover:not-has-[>input:focus]:not-has-[>input:disabled]:not-has-[>input[aria-invalid=true]]:not-data-[status=success]:inset-ring-ring/70",
  {
    variants: {
      variant: {
        joined:
          "not-first:-ms-(--hairline) first:rounded-s-md last:rounded-e-md",
        separate: "rounded-md",
      },
      size: {
        sm: "size-8 text-sm pointer-coarse:size-11",
        default: "size-9 text-base pointer-coarse:size-11",
        lg: "size-10 text-lg pointer-coarse:size-12",
      },
    },
    defaultVariants: {
      variant: "joined",
      size: "default",
    },
  }
)

const inputOTPInputClassName =
  "absolute inset-0 m-0 size-full min-w-0 rounded-[inherit] border-0 bg-transparent p-0 text-center caret-foreground outline-none focus-visible:outline-hidden selection:bg-transparent autofill:transition-[background-color] autofill:duration-[100000s] disabled:cursor-not-allowed read-only:cursor-default"

const inputOTPCharClassName =
  "pointer-events-none absolute inset-0 flex items-center justify-center [animation-delay:calc(var(--input-otp-index,0)*90ms)] group-data-[status=loading]/input-otp-slot:motion-safe:animate-input-otp-wave group-data-[status=loading]/input-otp-slot:motion-reduce:animate-input-otp-pulse group-data-[status=success]/input-otp-slot:motion-safe:animate-input-otp-pop group-data-[status=success]/input-otp-slot:[animation-delay:calc(var(--input-otp-index,0)*40ms)]"

type InputOTPProps = Omit<OTPFieldPrimitive.Root.Props, "aria-invalid"> & {
  variant?: InputOTPVariant
  size?: InputOTPSize
  animated?: boolean
  status?: InputOTPStatus
  loadingLabel?: string
  successLabel?: string
  errorLabel?: string
  "aria-invalid"?: boolean | "true" | "false"
}

type InputOTPFrameProps = {
  rootProps: React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>
  }
  state: OTPFieldPrimitive.Root.State
  render: OTPFieldPrimitive.Root.Props["render"]
  settings: Omit<InputOTPContextValue, "change">
  announcement: string | null
}

function InputOTPFrame({
  rootProps,
  state,
  render,
  settings,
  announcement,
}: InputOTPFrameProps) {
  const [tracked, setTracked] = React.useState({
    value: state.value,
    change: initialChange,
  })
  let change = tracked.change
  if (tracked.value !== state.value) {
    change = describeChange(tracked.value, state.value, tracked.change.id + 1)
    setTracked({ value: state.value, change })
  }

  const rootRef = React.useRef<HTMLDivElement>(null)
  const { status, animated } = settings
  const previousStatus = React.useRef(status)

  React.useEffect(() => {
    const previous = previousStatus.current
    previousStatus.current = status
    const root = rootRef.current
    if (
      !root ||
      !animated ||
      status !== "error" ||
      previous === "error" ||
      prefersReducedMotion()
    ) {
      return
    }
    root.removeAttribute("data-shake")
    void root.offsetWidth
    root.setAttribute("data-shake", "")
    const timer = setTimeout(() => root.removeAttribute("data-shake"), 400)
    return () => {
      clearTimeout(timer)
      root.removeAttribute("data-shake")
    }
  }, [animated, status])

  React.useLayoutEffect(() => {
    const root = rootRef.current
    const active = root?.ownerDocument.activeElement
    if (state.value !== "" || !root || !active || !root.contains(active)) {
      return
    }
    const first = root.querySelector<HTMLInputElement>(
      "[data-slot=input-otp-input]"
    )
    if (first && active !== first) {
      first.focus()
    }
  }, [state.value])

  const { ref: forwardedRef, ...props } = rootProps
  const element = useRender({
    defaultTagName: "div",
    render:
      typeof render === "function"
        ? (renderProps) => render(renderProps, state)
        : render,
    ref: forwardedRef ? [forwardedRef, rootRef] : rootRef,
    props,
  })

  const context = React.useMemo(
    () => ({ ...settings, change }),
    [settings, change]
  )

  return (
    <InputOTPContext.Provider value={context}>
      {element}
      {announcement !== null && (
        <span data-slot="input-otp-status" role="status" className="sr-only">
          {announcement}
        </span>
      )}
    </InputOTPContext.Provider>
  )
}

function InputOTP({
  className,
  variant = "joined",
  size = "default",
  animated = false,
  status,
  loadingLabel = "Verifying code",
  successLabel = "Code verified",
  errorLabel = "Code is incorrect",
  mask = false,
  readOnly = false,
  render,
  "aria-invalid": ariaInvalid,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  length,
  validationType = "numeric",
  normalizeValue,
  disabled = false,
  onFocus,
  onBlur,
  onKeyDownCapture,
  onMouseDownCapture,
  onCopyCapture,
  onCutCapture,
  ...props
}: InputOTPProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const controlled = valueProp !== undefined
  const value = controlled ? valueProp : uncontrolled
  const [selected, setSelected] = React.useState(false)
  const pendingFocus = React.useRef<{
    root: HTMLElement
    index: number
  } | null>(null)

  const focusSoon = (root: Element | null | undefined, index: number) => {
    if (root instanceof HTMLElement) {
      pendingFocus.current = { root, index }
    }
  }
  const locked = readOnly || status === "loading"

  const commit = (
    next: string,
    details: OTPFieldPrimitive.Root.ChangeEventDetails
  ) => {
    onValueChange?.(next, details)
    if (details.isCanceled) {
      return
    }
    if (!controlled) {
      setUncontrolled(next)
    }
  }

  const handleValueChange = (
    next: string,
    details: OTPFieldPrimitive.Root.ChangeEventDetails
  ) => {
    if (!selected) {
      commit(next, details)
      return
    }
    setSelected(false)
    const replacement =
      details.reason === "input-change" || details.reason === "input-paste"
        ? normalizeCode(
            rawInput(details),
            length,
            validationType,
            normalizeValue
          )
        : ""
    const target = details.event.target
    focusSoon(
      target instanceof Element
        ? target.closest("[data-slot=input-otp]")
        : null,
      Math.min(Array.from(replacement).length, length - 1)
    )
    commit(replacement, details)
  }

  const code = normalizeCode(value, length, validationType, normalizeValue)

  React.useLayoutEffect(() => {
    const pending = pendingFocus.current
    pendingFocus.current = null
    if (!pending || !pending.root.contains(document.activeElement)) {
      return
    }
    pending.root
      .querySelectorAll<HTMLInputElement>("[data-slot=input-otp-input]")
      [pending.index]?.focus()
  })
  const inherited = useDirection()
  const [domDirection, setDomDirection] = React.useState<"ltr" | "rtl">()
  const direction = domDirection ?? inherited
  const resolvedStatus = status ?? "idle"
  const invalid =
    resolvedStatus === "error" || ariaInvalid === true || ariaInvalid === "true"

  const settings = React.useMemo(
    () => ({
      animated,
      mask,
      variant,
      size,
      status: resolvedStatus,
      invalid,
      selected: selected && code !== "",
    }),
    [animated, mask, variant, size, resolvedStatus, invalid, selected, code]
  )

  const announcement =
    status === undefined
      ? null
      : resolvedStatus === "loading"
        ? loadingLabel
        : resolvedStatus === "success"
          ? successLabel
          : resolvedStatus === "error"
            ? errorLabel
            : ""

  return (
    <DirectionProvider direction={direction}>
      <OTPFieldPrimitive.Root
        data-slot="input-otp"
        data-variant={variant}
        data-size={size}
        data-status={status}
        data-animated={animated ? "" : undefined}
        aria-busy={resolvedStatus === "loading" ? true : undefined}
        mask={mask}
        value={value}
        onValueChange={handleValueChange}
        length={length}
        validationType={validationType}
        normalizeValue={normalizeValue}
        disabled={disabled}
        readOnly={locked}
        onKeyDownCapture={(event) => {
          onKeyDownCapture?.(event)
          if (event.defaultPrevented || disabled) {
            return
          }
          const command =
            (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey
          const key = event.key.toLowerCase()
          if (command && key === "a") {
            event.preventDefault()
            if (code === "") {
              return
            }
            setSelected(true)
            const first = event.currentTarget.querySelector<HTMLInputElement>(
              "[data-slot=input-otp-input]"
            )
            if (first && first !== event.target) {
              first.focus()
            } else {
              first?.select()
            }
            return
          }
          if (!selected || passiveKeys.has(event.key)) {
            return
          }
          if (command && (key === "c" || key === "x")) {
            return
          }
          if (event.key === "Backspace" || event.key === "Delete") {
            return
          }
          if (event.key.length === 1 && !command) {
            event.preventDefault()
            if (locked) {
              return
            }
            const replacement = normalizeCode(
              event.key,
              length,
              validationType,
              normalizeValue
            )
            if (replacement === "") {
              return
            }
            setSelected(false)
            focusSoon(event.currentTarget, Math.min(1, length - 1))
            commit(
              replacement,
              makeDetails("input-change", event.nativeEvent, event.target)
            )
            return
          }
          setSelected(false)
        }}
        onMouseDownCapture={(event) => {
          onMouseDownCapture?.(event)
          if (selected) {
            setSelected(false)
          }
        }}
        onCopyCapture={(event) => {
          onCopyCapture?.(event)
          if (!selected || event.defaultPrevented) {
            return
          }
          event.preventDefault()
          event.clipboardData.setData("text/plain", code)
        }}
        onCutCapture={(event) => {
          onCutCapture?.(event)
          if (!selected || event.defaultPrevented) {
            return
          }
          event.preventDefault()
          event.clipboardData.setData("text/plain", code)
          if (!locked) {
            setSelected(false)
            commit(
              "",
              makeDetails("input-clear", event.nativeEvent, event.target)
            )
            focusSoon(event.currentTarget, 0)
          }
        }}
        onBlur={(event) => {
          onBlur?.(event)
          if (
            selected &&
            !event.currentTarget.contains(event.relatedTarget as Node | null)
          ) {
            setSelected(false)
          }
        }}
        onFocus={(event) => {
          onFocus?.(event)
          const next =
            getComputedStyle(event.currentTarget).direction === "rtl"
              ? "rtl"
              : "ltr"
          if (next !== domDirection) {
            setDomDirection(next)
          }
        }}
        className={mergeClassName(
          "flex w-fit max-w-full min-w-0 items-center gap-2 data-shake:motion-safe:animate-button-shake data-disabled:cursor-not-allowed data-disabled:opacity-50",
          className
        )}
        render={(rootProps, state) => (
          <InputOTPFrame
            rootProps={rootProps}
            state={state}
            render={render}
            settings={settings}
            announcement={announcement}
          />
        )}
        {...props}
      />
    </DirectionProvider>
  )
}

type InputOTPGroupProps = useRender.ComponentProps<"div">

function InputOTPGroup({ className, render, ...props }: InputOTPGroupProps) {
  const { variant, size } = useInputOTPContext("InputOTPGroup")
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(inputOTPGroupVariants({ variant, size }), className),
      },
      props,
      { "data-slot": "input-otp-group" } as React.ComponentProps<"div">
    ),
  })
}

type InputOTPGhostState = {
  key: number
  char: string
  delay: number
  direction: "up" | "down"
}

function InputOTPGhost({
  ghost,
  onDone,
}: {
  ghost: InputOTPGhostState
  onDone: (key: number) => void
}) {
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useLayoutEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }
    const reduce = prefersReducedMotion()
    const offset = ghost.direction === "up" ? "-35%" : "35%"
    const animation = element.animate(
      reduce
        ? [{ opacity: 1 }, { opacity: 0 }]
        : [
            { opacity: 1, transform: "none", filter: "blur(0px)" },
            {
              opacity: 0,
              transform: `translateY(${offset}) scale(0.8)`,
              filter: "blur(3px)",
            },
          ],
      {
        duration: reduce ? 100 : 180,
        delay: reduce ? 0 : ghost.delay,
        easing: easeOut,
        fill: "both",
      }
    )
    animation.onfinish = () => onDone(ghost.key)
    return () => animation.cancel()
  }, [ghost, onDone])

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-slot="input-otp-ghost"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      {ghost.char}
    </span>
  )
}

type InputOTPSlotProps = Omit<
  OTPFieldPrimitive.Input.Props,
  "className" | "render"
> & {
  className?: ClassName<OTPFieldPrimitive.Input.State>
}

type InputOTPSlotFrameProps = {
  inputProps: React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: React.Ref<HTMLInputElement>
  }
  state: OTPFieldPrimitive.Input.State
  className: InputOTPSlotProps["className"]
  labelled: boolean
}

function InputOTPSlotFrame({
  inputProps,
  state,
  className,
  labelled,
}: InputOTPSlotFrameProps) {
  const { animated, mask, variant, size, status, invalid, selected, change } =
    useInputOTPContext("InputOTPSlot")
  const { index, length } = state
  const char = state.value
  const display = mask && char ? maskCharacter : char

  const [shown, setShown] = React.useState(char)
  const [ghosts, setGhosts] = React.useState<InputOTPGhostState[]>([])
  if (char !== shown) {
    setShown(char)
    if (
      animated &&
      shown &&
      canAnimate() &&
      !(change.kind === "shift" && index > change.start)
    ) {
      setGhosts([
        ...ghosts.slice(-2),
        {
          key: change.id,
          char: mask ? maskCharacter : shown,
          delay:
            change.kind === "clear"
              ? Math.min(Math.max(change.end - index, 0), maxStaggerSteps) *
                exitStep
              : 0,
          direction: char && change.kind !== "shift" ? "up" : "down",
        },
      ])
    }
  }
  if (!animated && ghosts.length > 0) {
    setGhosts([])
  }

  const removeGhost = React.useCallback((key: number) => {
    setGhosts((current) => current.filter((ghost) => ghost.key !== key))
  }, [])

  const slotRef = React.useRef<HTMLDivElement>(null)
  const charRef = React.useRef<HTMLSpanElement>(null)
  const previousChar = React.useRef(char)
  const motion = React.useRef<Animation | null>(null)

  React.useLayoutEffect(() => {
    const previous = previousChar.current
    previousChar.current = char
    const element = charRef.current
    const slot = slotRef.current
    if (
      !animated ||
      !char ||
      char === previous ||
      !element ||
      !slot ||
      typeof element.animate !== "function"
    ) {
      return
    }
    motion.current?.cancel()
    const reduce = prefersReducedMotion()

    if (change.kind === "shift" && index >= change.start) {
      if (reduce) {
        return
      }
      const slots = slot
        .closest("[data-slot=input-otp]")
        ?.querySelectorAll("[data-slot=input-otp-slot]")
      const from = slots?.[index + 1]
      if (!from) {
        return
      }
      const distance =
        from.getBoundingClientRect().left - slot.getBoundingClientRect().left
      motion.current = element.animate(
        [{ transform: `translateX(${distance}px)` }, { transform: "none" }],
        { duration: 240, easing: easeOut }
      )
      return
    }

    const delay =
      change.kind === "fill"
        ? Math.min(Math.max(index - change.start, 0), maxStaggerSteps) *
          staggerStep
        : 0
    motion.current = element.animate(
      reduce
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            {
              opacity: 0,
              transform: "translateY(40%) scale(0.8)",
              filter: "blur(4px)",
            },
            { opacity: 1, transform: "none", filter: "blur(0px)" },
          ],
      {
        duration: reduce ? 150 : 340,
        delay: reduce ? 0 : delay,
        easing: easeOut,
        fill: "backwards",
      }
    )
  }, [animated, change, char, index])

  React.useEffect(() => () => motion.current?.cancel(), [])

  const resolvedClassName =
    typeof className === "function" ? className(state) : className
  const slotLabel =
    !labelled &&
    (index > 0 ||
      (inputProps["aria-labelledby"] === undefined &&
        inputProps["aria-label"] === undefined))
      ? {
          "aria-label": `Character ${index + 1} of ${length}`,
          "aria-labelledby": undefined,
        }
      : null

  return (
    <div
      ref={slotRef}
      data-slot="input-otp-slot"
      data-filled={state.filled ? "" : undefined}
      data-selected={selected && state.filled ? "" : undefined}
      data-status={status === "idle" ? undefined : status}
      style={{ "--input-otp-index": index } as React.CSSProperties}
      className={cn(inputOTPSlotVariants({ variant, size }), resolvedClassName)}
    >
      <input
        {...inputProps}
        {...slotLabel}
        aria-invalid={invalid || inputProps["aria-invalid"] ? true : undefined}
        className={cn(
          inputOTPInputClassName,
          animated && "text-transparent [-webkit-text-fill-color:transparent]"
        )}
      />
      {animated && (
        <span
          ref={charRef}
          aria-hidden="true"
          data-slot="input-otp-char"
          className={inputOTPCharClassName}
        >
          {display}
        </span>
      )}
      {ghosts.map((ghost) => (
        <InputOTPGhost key={ghost.key} ghost={ghost} onDone={removeGhost} />
      ))}
    </div>
  )
}

function InputOTPSlot({ className, ...props }: InputOTPSlotProps) {
  useInputOTPContext("InputOTPSlot")
  const labelled =
    props["aria-label"] !== undefined || props["aria-labelledby"] !== undefined
  return (
    <OTPFieldPrimitive.Input
      data-slot="input-otp-input"
      {...props}
      render={(inputProps, state) => (
        <InputOTPSlotFrame
          inputProps={inputProps}
          state={state}
          className={className}
          labelled={labelled}
        />
      )}
    />
  )
}

function InputOTPSeparator({
  className,
  children,
  ...props
}: OTPFieldPrimitive.Separator.Props) {
  return (
    <OTPFieldPrimitive.Separator
      data-slot="input-otp-separator"
      className={mergeClassName(
        "flex shrink-0 items-center text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children ?? <IconMinus aria-hidden="true" />}
    </OTPFieldPrimitive.Separator>
  )
}

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  inputOTPGroupVariants,
  inputOTPSlotVariants,
}
export type {
  InputOTPGroupProps,
  InputOTPProps,
  InputOTPSize,
  InputOTPSlotProps,
  InputOTPStatus,
  InputOTPVariant,
}
