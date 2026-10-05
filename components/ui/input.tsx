"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { useAutosize } from "@/hooks/use-autosize"
import { useComposedRef } from "@/hooks/use-composed-ref"
import { useInvalidShake } from "@/hooks/use-invalid-shake"
import { useMergedRef } from "@/hooks/use-merged-ref"
import { prefersReducedMotion } from "@/lib/motion"

import { NumberFlow } from "@/components/ui/number-flow"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

const inputVariants = cva(
  "w-full min-w-0 rounded-md bg-transparent text-sm text-foreground inset-ring-(length:--hairline) inset-ring-input transition-[color,background-color,box-shadow] duration-150 ease-out-cubic outline-none selection:bg-primary selection:text-primary-foreground file:me-3 file:inline-flex file:h-full file:items-center file:border-0 file:bg-transparent file:p-0 file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground placeholder:transition-opacity placeholder:duration-150 user-invalid:inset-ring-destructive focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-ring focus-visible:outline-hidden focus-visible:placeholder:opacity-70 user-invalid:focus-visible:ring-destructive/70 user-invalid:focus-visible:inset-ring-destructive disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:inset-ring-destructive aria-invalid:focus-visible:ring-destructive/70 aria-invalid:focus-visible:inset-ring-destructive data-invalid:inset-ring-destructive data-invalid:focus-visible:ring-destructive/70 data-invalid:focus-visible:inset-ring-destructive data-shake:motion-safe:animate-button-shake motion-reduce:transition-none dark:bg-input/30 dark:scheme-dark dark:user-invalid:focus-visible:ring-destructive/70 dark:aria-invalid:focus-visible:ring-destructive/70 dark:data-invalid:focus-visible:ring-destructive/70 forced-colors:border pointer-coarse:text-[max(16px,1rem)] [&::-webkit-search-cancel-button]:cursor-pointer [&::-webkit-search-cancel-button]:opacity-50 [&::-webkit-search-cancel-button]:transition-opacity [&::-webkit-search-cancel-button:hover]:opacity-100 [&[readonly]]:bg-muted/40 dark:[&[readonly]]:bg-input/20 [@media(hover:hover)]:hover:not-focus-visible:not-disabled:not-[[readonly]]:not-aria-invalid:not-data-invalid:not-user-invalid:inset-ring-ring/70",
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 file:pe-2.5",
        default: "h-9 px-3",
        lg: "h-10 px-3.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type InputControl = HTMLInputElement | HTMLTextAreaElement

type InputProps = Omit<InputPrimitive.Props, "size"> &
  VariantProps<typeof inputVariants> & {
    htmlSize?: number
    shake?: boolean
  }

function Input({
  className,
  size = "default",
  htmlSize,
  shake = true,
  ref,
  ...props
}: InputProps) {
  const resolvedSize = size ?? "default"
  const [inputRef, setRef] = useComposedRef<HTMLInputElement>(ref)
  useInvalidShake(inputRef, shake)

  return (
    <InputPrimitive
      ref={setRef}
      data-slot="input"
      data-size={resolvedSize}
      size={htmlSize}
      className={mergeClassName(
        inputVariants({ size: resolvedSize }),
        className
      )}
      {...props}
    />
  )
}

function defaultAnnouncement(remaining: number) {
  return remaining === 0
    ? "Character limit reached"
    : `${remaining} ${remaining === 1 ? "character" : "characters"} left`
}

type InputCountProps = Omit<React.ComponentProps<"span">, "children"> & {
  length: number
  maxLength?: number | null
  controlRef?: React.RefObject<InputControl | null>
  threshold?: number
  announcement?: (remaining: number) => string
}

function InputCount({
  className,
  length,
  maxLength = null,
  controlRef,
  threshold,
  announcement = defaultAnnouncement,
  ref,
  ...props
}: InputCountProps) {
  const max = maxLength !== null && maxLength > 0 ? maxLength : null
  const remaining = max === null ? null : Math.max(0, max - length)
  const near =
    max === null
      ? Infinity
      : Math.max(1, threshold ?? Math.ceil(Math.min(max * 0.1, 20)))
  const state =
    remaining === null
      ? undefined
      : remaining === 0
        ? "limit"
        : remaining <= near
          ? "near"
          : undefined

  const [message, setMessage] = React.useState("")
  const [lastState, setLastState] = React.useState(state)
  if (state !== lastState) {
    setLastState(state)
    setMessage(state && remaining !== null ? announcement(remaining) : "")
  }

  const [countRef, setCountRef] = useComposedRef<HTMLSpanElement>(ref)

  React.useEffect(() => {
    const element = controlRef?.current
    const count = countRef.current
    if (!element || !count || max === null) {
      return
    }
    let timer: ReturnType<typeof setTimeout> | undefined
    const onBeforeInput = (event: Event) => {
      const input = event as InputEvent
      if (
        !input.inputType?.startsWith("insert") ||
        element.value.length < max ||
        element.selectionStart !== element.selectionEnd ||
        prefersReducedMotion()
      ) {
        return
      }
      count.removeAttribute("data-bump")
      void count.offsetWidth
      count.setAttribute("data-bump", "")
      clearTimeout(timer)
      timer = setTimeout(() => count.removeAttribute("data-bump"), 400)
    }
    element.addEventListener("beforeinput", onBeforeInput)
    return () => {
      element.removeEventListener("beforeinput", onBeforeInput)
      clearTimeout(timer)
    }
  }, [controlRef, max])

  return (
    <span
      ref={setCountRef}
      data-slot="input-count"
      data-state={state}
      className={cn(
        "inline-flex shrink-0 items-baseline text-xs text-muted-foreground tabular-nums transition-colors duration-200 ease-out-cubic data-bump:animate-button-shake data-[state=limit]:text-destructive data-[state=near]:text-foreground",
        className
      )}
      {...props}
    >
      <span aria-hidden="true" dir="ltr" className="inline-flex items-baseline">
        <NumberFlow value={length} />
        {max !== null && <span>/{max}</span>}
      </span>
      <span role="status" className="sr-only">
        {message}
      </span>
    </span>
  )
}

export {
  Input,
  InputCount,
  useAutosize,
  inputVariants,
  useComposedRef,
  useInvalidShake,
  useMergedRef,
}
export type { InputControl, InputCountProps, InputProps }
