"use client"

import * as React from "react"
import { flushSync } from "react-dom"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { IconEye, IconEyeOff, IconX } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { easeOut, prefersReducedMotion, useSizeMorph } from "@/lib/motion"

import { Button } from "@/components/ui/button"
import { useAutosize } from "@/hooks/use-autosize"
import { useComposedRef } from "@/hooks/use-composed-ref"
import { useInvalidShake } from "@/hooks/use-invalid-shake"
import { useMergedRef } from "@/hooks/use-merged-ref"
import {
  Input,
  InputCount,
  type InputControl,
  type InputCountProps,
} from "@/components/ui/input"

type InputGroupSize = "sm" | "default" | "lg"

type InputGroupContextValue = {
  size: InputGroupSize
  controlRef: React.RefObject<InputControl | null>
  value: string
  maxLength: number | null
  disabled: boolean
  readOnly: boolean
  revealed: boolean
  setRevealed: (revealed: boolean) => void
  sync: () => void
  clearRef: React.RefObject<(() => void) | null>
}

const InputGroupContext = React.createContext<InputGroupContextValue | null>(
  null
)

function useInputGroup(part: string) {
  const context = React.useContext(InputGroupContext)
  if (!context) {
    throw new Error(`<${part}> must be used within <InputGroup>.`)
  }
  return context
}

function noop() {}

function useControlContext() {
  const context = React.useContext(InputGroupContext)
  const controlRef = React.useRef<InputControl | null>(null)
  const clearRef = React.useRef<(() => void) | null>(null)
  const fallback = React.useMemo<InputGroupContextValue>(
    () => ({
      size: "default",
      controlRef,
      clearRef,
      value: "",
      maxLength: null,
      disabled: false,
      readOnly: false,
      revealed: false,
      setRevealed: noop,
      sync: noop,
    }),
    []
  )
  return context ?? fallback
}

type ControlSnapshot = Pick<
  InputGroupContextValue,
  "value" | "maxLength" | "disabled" | "readOnly"
>

const emptySnapshot: ControlSnapshot = {
  value: "",
  maxLength: null,
  disabled: false,
  readOnly: false,
}

function readControl(control: InputControl | null): ControlSnapshot {
  if (!control) {
    return emptySnapshot
  }
  return {
    value: control.value,
    maxLength: control.maxLength > 0 ? control.maxLength : null,
    disabled: control.disabled,
    readOnly: control.readOnly,
  }
}

function sameSnapshot(a: ControlSnapshot, b: ControlSnapshot) {
  return (
    a.value === b.value &&
    a.maxLength === b.maxLength &&
    a.disabled === b.disabled &&
    a.readOnly === b.readOnly
  )
}

const control = "[data-slot=input-group-control]"

const inputGroupVariants = cva(
  "group/input-group relative flex w-full min-w-0 items-center rounded-(--input-group-radius) bg-transparent text-sm inset-ring-(length:--hairline) inset-ring-input transition-[color,background-color,box-shadow] duration-150 ease-out-cubic outline-none [--input-group-radius:var(--radius-md)] focus-visible:outline-hidden has-[[data-slot=input-group-control]:disabled]:cursor-not-allowed has-[[data-slot=input-group-control]:disabled]:opacity-50 has-[[data-slot=input-group-control]:focus]:ring-3 has-[[data-slot=input-group-control]:focus]:ring-focus-ring has-[[data-slot=input-group-control]:focus]:inset-ring-ring has-[[data-slot=input-group-control]:user-invalid]:inset-ring-destructive has-[[data-slot=input-group-control]:user-invalid:focus]:ring-destructive/20 has-[[data-slot=input-group-control][aria-invalid=true]]:inset-ring-destructive has-[[data-slot=input-group-control][aria-invalid=true]:focus]:ring-destructive/20 has-[[data-slot=input-group-control][data-invalid]]:inset-ring-destructive has-[[data-slot=input-group-control][data-invalid]:focus]:ring-destructive/20 has-[[data-slot=input-group-control][readonly]]:bg-muted/40 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:items-stretch has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:items-stretch has-[>textarea]:h-auto has-[>textarea]:items-stretch data-shake:motion-safe:animate-button-shake motion-reduce:transition-none dark:bg-input/30 dark:has-[[data-slot=input-group-control]:user-invalid:focus]:ring-destructive/40 dark:has-[[data-slot=input-group-control][aria-invalid=true]:focus]:ring-destructive/40 dark:has-[[data-slot=input-group-control][data-invalid]:focus]:ring-destructive/40 dark:has-[[data-slot=input-group-control][readonly]]:bg-input/20 forced-colors:border data-disabled:cursor-not-allowed data-disabled:opacity-50 [@media(hover:hover)]:hover:not-has-[[data-slot=input-group-control]:focus]:not-has-[[data-slot=input-group-control][aria-invalid=true]]:not-has-[[data-slot=input-group-control][data-invalid]]:not-has-[[data-slot=input-group-control]:user-invalid]:not-has-[[data-slot=input-group-control]:disabled]:not-has-[[data-slot=input-group-control][readonly]]:not-data-disabled:inset-ring-ring/70",
  {
    variants: {
      size: {
        sm: "h-(--input-group-height) [--input-group-height:calc(var(--spacing)*8)]",
        default:
          "h-(--input-group-height) [--input-group-height:calc(var(--spacing)*9)]",
        lg: "h-(--input-group-height) [--input-group-height:calc(var(--spacing)*10)]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type InputGroupProps = React.ComponentProps<"div"> &
  VariantProps<typeof inputGroupVariants>

function InputGroup({
  className,
  size = "default",
  ...props
}: InputGroupProps) {
  const resolvedSize = size ?? "default"
  const controlRef = React.useRef<InputControl | null>(null)
  const clearRef = React.useRef<(() => void) | null>(null)
  const [snapshot, setSnapshot] = React.useState(emptySnapshot)
  const [revealed, setRevealed] = React.useState(false)

  const sync = React.useCallback(() => {
    const next = readControl(controlRef.current)
    setSnapshot((previous) => (sameSnapshot(previous, next) ? previous : next))
  }, [])

  const context = React.useMemo<InputGroupContextValue>(
    () => ({
      size: resolvedSize,
      controlRef,
      ...snapshot,
      revealed,
      setRevealed,
      sync,
      clearRef,
    }),
    [resolvedSize, snapshot, revealed, sync]
  )

  return (
    <InputGroupContext.Provider value={context}>
      <div
        role="group"
        data-slot="input-group"
        data-size={resolvedSize}
        data-filled={snapshot.value ? "" : undefined}
        className={cn(inputGroupVariants({ size: resolvedSize }), className)}
        {...props}
      />
    </InputGroupContext.Provider>
  )
}

function useControlSync(
  context: InputGroupContextValue,
  value: unknown,
  extra: { disabled?: boolean; readOnly?: boolean; maxLength?: number }
) {
  const { controlRef, sync, setRevealed } = context

  React.useLayoutEffect(() => {
    sync()
  }, [sync, value, extra.disabled, extra.readOnly, extra.maxLength])

  React.useEffect(() => {
    const element = controlRef.current
    if (!element) {
      return
    }
    const form = element.form
    let timer: ReturnType<typeof setTimeout> | undefined

    const onReset = () => {
      clearTimeout(timer)
      timer = setTimeout(sync)
    }
    const onSubmit = () => {
      flushSync(() => setRevealed(false))
    }

    const onInput = (event: Event) => {
      if (event.target === element) {
        sync()
      }
    }

    window.addEventListener("input", onInput)
    form?.addEventListener("reset", onReset)
    form?.addEventListener("submit", onSubmit)

    return () => {
      window.removeEventListener("input", onInput)
      form?.removeEventListener("reset", onReset)
      form?.removeEventListener("submit", onSubmit)
      clearTimeout(timer)
    }
  }, [controlRef, sync, setRevealed])
}

function handleClearKey(
  event: React.KeyboardEvent<InputControl>,
  context: InputGroupContextValue
) {
  if (
    event.key !== "Escape" ||
    event.defaultPrevented ||
    event.nativeEvent.isComposing ||
    !context.clearRef.current ||
    !event.currentTarget.value ||
    event.currentTarget.readOnly
  ) {
    return
  }
  event.preventDefault()
  event.stopPropagation()
  context.clearRef.current()
}

const buttonSizes =
  "has-[>[data-addon-button][data-size=xs]]:[--input-group-button-size:calc(var(--spacing)*6)] has-[>[data-addon-button][data-size=icon-xs]]:[--input-group-button-size:calc(var(--spacing)*6)] has-[>[data-addon-button][data-size=sm]]:[--input-group-button-size:calc(var(--spacing)*8)] has-[>[data-addon-button][data-size=icon-sm]]:[--input-group-button-size:calc(var(--spacing)*8)] has-[>kbd]:[--input-group-button-size:calc(var(--spacing)*5)]"

const insetAddon =
  "has-[>[data-addon-button]]:ps-(--input-group-addon-inset) has-[>kbd]:ps-(--input-group-addon-inset)"

const insetBlockEdges =
  "has-[>[data-addon-button]:first-child]:ps-(--input-group-addon-inset) has-[>[data-addon-button]:last-child]:pe-(--input-group-addon-inset)"

const inputGroupAddonVariants = cva(
  cn(
    "flex h-auto min-w-0 cursor-text items-center gap-1.5 text-sm text-muted-foreground select-none [--input-group-addon-inset:max(calc(var(--spacing)*0.5),calc((var(--input-group-height)-var(--input-group-button-size,calc(var(--spacing)*6)))/2))] group-has-[[data-slot=input-group-control]:disabled]/input-group:cursor-not-allowed group-data-disabled/input-group:cursor-not-allowed data-morphing:overflow-clip [&>kbd]:inline-flex [&>kbd]:h-5 [&>kbd]:min-w-5 [&>kbd]:items-center [&>kbd]:justify-center [&>kbd]:rounded-[max(calc(var(--radius-sm)*0.5),calc(var(--input-group-radius)-var(--input-group-addon-inset)))] [&>kbd]:bg-muted [&>kbd]:px-1 [&>kbd]:font-sans [&>kbd]:text-xs [&>kbd]:text-muted-foreground [&>kbd]:inset-ring-(length:--hairline) [&>kbd]:inset-ring-border [&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg:not([class*='size-'])]:size-4",
    buttonSizes
  ),
  {
    variants: {
      align: {
        "inline-start": cn(
          "order-first shrink-0 self-stretch ps-3",
          insetAddon
        ),
        "inline-end":
          "order-last shrink-0 self-stretch pe-3 has-[>[data-addon-button]]:pe-(--input-group-addon-inset) has-[>kbd]:pe-(--input-group-addon-inset)",
        "block-start": cn(
          "order-first w-full justify-start px-3 pt-2.5 [--input-group-addon-inset:max(calc(var(--spacing)*1.5),calc((var(--input-group-height)-var(--input-group-button-size,calc(var(--spacing)*6)))/2))] has-[>[data-addon-button]]:pt-(--input-group-addon-inset) data-separator:pb-2.5 data-separator:shadow-[inset_0_calc(-1*var(--hairline))_0_var(--color-border)] has-[>[data-addon-button]]:data-separator:pb-(--input-group-addon-inset)",
          insetBlockEdges
        ),
        "block-end": cn(
          "order-last w-full justify-start px-3 pb-2.5 [--input-group-addon-inset:max(calc(var(--spacing)*1.5),calc((var(--input-group-height)-var(--input-group-button-size,calc(var(--spacing)*6)))/2))] has-[>[data-addon-button]]:pb-(--input-group-addon-inset) data-separator:pt-2.5 data-separator:shadow-[inset_0_var(--hairline)_0_var(--color-border)] has-[>[data-addon-button]]:data-separator:pt-(--input-group-addon-inset)",
          insetBlockEdges
        ),
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

type InputGroupAddonProps = React.ComponentProps<"div"> &
  VariantProps<typeof inputGroupAddonVariants> & {
    separator?: boolean
  }

function focusControl(event: React.MouseEvent<HTMLDivElement>) {
  const target = event.target as HTMLElement
  if (target.closest("button, a, input, textarea, select, [tabindex]")) {
    return
  }
  const group = event.currentTarget.closest("[data-slot=input-group]")
  const field = group?.querySelector<HTMLElement>(control)
  if (field && !field.matches(":disabled")) {
    event.preventDefault()
    field.focus()
  }
}

function InputGroupAddon({
  className,
  align = "inline-start",
  separator = false,
  onMouseDown,
  ref,
  ...props
}: InputGroupAddonProps) {
  const resolvedAlign = align ?? "inline-start"
  const morphRef = useSizeMorph<HTMLDivElement>({
    axis: "width",
    enabled: resolvedAlign.startsWith("inline"),
    duration: 220,
  })
  const setRef = useMergedRef(ref, morphRef)

  return (
    <div
      ref={setRef}
      role="group"
      data-slot="input-group-addon"
      data-align={resolvedAlign}
      data-separator={separator ? "" : undefined}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onMouseDown={(event) => {
        onMouseDown?.(event)
        if (!event.defaultPrevented) {
          focusControl(event)
        }
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  "rounded-[max(calc(var(--radius-sm)*0.5),calc(var(--input-group-radius)-var(--input-group-addon-inset)))]"
)

type InputGroupButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "size"
> & {
  size?: "xs" | "sm" | "icon-xs" | "icon-sm"
}

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: InputGroupButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      data-slot="input-group-button"
      data-addon-button=""
      data-size={size}
      className={cn(inputGroupButtonVariants(), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn(
        "flex min-w-0 items-center gap-1.5 overflow-hidden text-sm whitespace-nowrap text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  type,
  ref,
  onKeyDown,
  ...props
}: React.ComponentProps<typeof Input>) {
  const context = useControlContext()
  const [, setRef] = useComposedRef<HTMLInputElement>(ref)
  const setControl = React.useCallback(
    (node: HTMLInputElement | null) => {
      context.controlRef.current = node
      setRef(node)
    },
    [context.controlRef, setRef]
  )
  useControlSync(context, props.value, {
    disabled: props.disabled,
    readOnly: props.readOnly,
    maxLength: props.maxLength,
  })

  return (
    <Input
      ref={setControl}
      data-slot="input-group-control"
      size={context.size}
      type={type === "password" && context.revealed ? "text" : type}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        handleClearKey(event, context)
      }}
      className={cn(
        "h-auto min-h-(--input-group-height) min-w-16 flex-1 self-stretch rounded-none bg-transparent! inset-ring-0 group-has-[>[data-align=inline-end]]/input-group:pe-2 group-has-[>[data-align=inline-start]]/input-group:ps-2 focus-visible:ring-0 disabled:opacity-100 group-has-[[data-slot=input-group-clear]]/input-group:[&::-webkit-search-cancel-button]:appearance-none",
        className
      )}
      {...props}
    />
  )
}

type InputGroupTextareaProps = React.ComponentProps<"textarea"> & {
  autoResize?: boolean
  shake?: boolean
}

function InputGroupTextarea({
  className,
  autoResize = true,
  shake = true,
  ref,
  onKeyDown,
  ...props
}: InputGroupTextareaProps) {
  const context = useControlContext()
  const [textareaRef, setRef] = useComposedRef<HTMLTextAreaElement>(ref)
  const setControl = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      context.controlRef.current = node
      setRef(node)
    },
    [context.controlRef, setRef]
  )
  useAutosize(textareaRef, autoResize, props.value)
  useInvalidShake(textareaRef, shake)
  useControlSync(context, props.value, {
    disabled: props.disabled,
    readOnly: props.readOnly,
    maxLength: props.maxLength,
  })

  return (
    <InputPrimitive
      data-slot="input-group-control"
      render={<textarea ref={setControl} />}
      onKeyDown={(event) => {
        const keyEvent =
          event as unknown as React.KeyboardEvent<HTMLTextAreaElement>
        onKeyDown?.(keyEvent)
        handleClearKey(keyEvent, context)
      }}
      className={cn(
        "max-h-64 min-h-16 w-full min-w-0 flex-1 resize-none overscroll-none rounded-none bg-transparent px-3 py-2.5 text-sm text-foreground outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:outline-hidden disabled:cursor-not-allowed pointer-coarse:text-[max(16px,1rem)]",
        className
      )}
      {...(props as InputPrimitive.Props)}
    />
  )
}

function setControlValue(element: InputControl, value: string) {
  element.focus()
  element.select()
  let done = false
  try {
    done =
      typeof document.execCommand === "function" &&
      document.execCommand(value ? "insertText" : "delete", false, value)
  } catch {
    done = false
  }
  if (done && element.value === value) {
    return
  }
  const prototype =
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(prototype, "value")?.set?.call(element, value)
  element.dispatchEvent(new Event("input", { bubbles: true }))
}

const reveal =
  "transition-[opacity,scale,filter] duration-200 ease-out-quint motion-reduce:transition-none"

type InputGroupClearProps = Omit<InputGroupButtonProps, "size" | "children"> & {
  onClear?: () => void
  children?: React.ReactNode
}

function InputGroupClear({
  className,
  onClear,
  onClick,
  onMouseDown,
  children,
  "aria-label": ariaLabel = "Clear",
  ...props
}: InputGroupClearProps) {
  const context = useInputGroup("InputGroupClear")
  const { controlRef, clearRef } = context
  const visible = Boolean(
    context.value && !context.disabled && !context.readOnly
  )

  const clear = React.useCallback(() => {
    const element = controlRef.current
    if (!element) {
      return
    }
    setControlValue(element, "")
    onClear?.()
  }, [controlRef, onClear])

  React.useLayoutEffect(() => {
    clearRef.current = clear
    return () => {
      if (clearRef.current === clear) {
        clearRef.current = null
      }
    }
  }, [clearRef, clear])

  return (
    <InputGroupButton
      size="icon-xs"
      tabIndex={-1}
      aria-label={ariaLabel}
      aria-hidden={visible ? undefined : true}
      data-slot="input-group-clear"
      data-visible={visible ? "" : undefined}
      className={cn(
        reveal,
        "text-muted-foreground not-data-visible:pointer-events-none not-data-visible:scale-50 not-data-visible:opacity-0 not-data-visible:blur-[2px] hover:text-foreground",
        className
      )}
      onMouseDown={(event) => {
        onMouseDown?.(event)
        if (!event.defaultPrevented) {
          event.preventDefault()
        }
      }}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          clear()
        }
      }}
      {...props}
    >
      {children ?? <IconX />}
    </InputGroupButton>
  )
}

type InputGroupPasswordToggleProps = Omit<
  InputGroupButtonProps,
  "size" | "children"
> & {
  revealed?: boolean
  onRevealedChange?: (revealed: boolean) => void
}

function InputGroupPasswordToggle({
  className,
  revealed: revealedProp,
  onRevealedChange,
  onClick,
  onMouseDown,
  "aria-label": ariaLabel = "Show password",
  ...props
}: InputGroupPasswordToggleProps) {
  const context = useInputGroup("InputGroupPasswordToggle")
  const { controlRef, setRevealed } = context
  const revealed = revealedProp ?? context.revealed

  React.useLayoutEffect(() => {
    if (revealedProp !== undefined) {
      setRevealed(revealedProp)
    }
  }, [revealedProp, setRevealed])

  React.useEffect(() => () => setRevealed(false), [setRevealed])

  return (
    <InputGroupButton
      size="icon-xs"
      aria-label={ariaLabel}
      aria-pressed={revealed}
      disabled={context.disabled}
      data-slot="input-group-password-toggle"
      data-revealed={revealed ? "" : undefined}
      className={cn("grid *:col-start-1 *:row-start-1", className)}
      onMouseDown={(event) => {
        onMouseDown?.(event)
        if (
          !event.defaultPrevented &&
          controlRef.current === document.activeElement
        ) {
          event.preventDefault()
        }
      }}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) {
          return
        }
        const element = controlRef.current
        const start = element?.selectionStart ?? null
        const end = element?.selectionEnd ?? null
        const next = !revealed
        if (revealedProp === undefined) {
          flushSync(() => setRevealed(next))
        }
        onRevealedChange?.(next)
        if (element && start !== null && end !== null) {
          try {
            element.setSelectionRange(start, end)
          } catch {}
        }
      }}
      {...props}
    >
      <IconEye
        aria-hidden="true"
        className={cn(reveal, revealed && "scale-50 opacity-0 blur-[2px]")}
      />
      <IconEyeOff
        aria-hidden="true"
        className={cn(reveal, !revealed && "scale-50 opacity-0 blur-[2px]")}
      />
    </InputGroupButton>
  )
}

type InputGroupCountProps = Omit<
  InputCountProps,
  "length" | "maxLength" | "controlRef"
>

function InputGroupCount(props: InputGroupCountProps) {
  const context = useInputGroup("InputGroupCount")

  return (
    <InputCount
      data-slot="input-group-count"
      length={context.value.length}
      maxLength={context.maxLength}
      controlRef={context.controlRef}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupClear,
  InputGroupCount,
  InputGroupInput,
  InputGroupPasswordToggle,
  InputGroupText,
  InputGroupTextarea,
  inputGroupAddonVariants,
  inputGroupButtonVariants,
  inputGroupVariants,
  useInputGroup,
}
export type {
  InputGroupAddonProps,
  InputGroupButtonProps,
  InputGroupClearProps,
  InputGroupCountProps,
  InputGroupPasswordToggleProps,
  InputGroupProps,
  InputGroupTextareaProps,
}
