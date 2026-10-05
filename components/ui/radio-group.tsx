"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "cn"

import { useSlidingHighlight } from "@/lib/motion"

function mergeClassName<State>(
  base: string,
  className: string | ((state: State) => string | undefined) | undefined
) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

type RadioGroupVariant = "default" | "card"

const cardSelector =
  "[data-slot=radio-group-card]:has(> [data-slot=radio-group-item][data-checked])"

type RadioGroupProps<Value> = RadioGroupPrimitive.Props<Value> & {
  variant?: RadioGroupVariant
}

function RadioGroup<Value>({
  className,
  variant = "default",
  children,
  ref,
  ...props
}: RadioGroupProps<Value>) {
  const groupRef = React.useRef<HTMLDivElement | null>(null)
  const highlightRef = React.useRef<HTMLSpanElement | null>(null)
  useSlidingHighlight(groupRef, highlightRef, cardSelector, "data-checked")

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      groupRef.current = node
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

  return (
    <RadioGroupPrimitive
      ref={setRef}
      className={mergeClassName(
        cn(
          "group/radio-group grid w-full min-w-0 gap-3",
          variant === "card" && "relative isolate gap-2"
        ),
        className
      )}
      {...props}
      data-slot="radio-group"
      data-variant={variant}
    >
      {variant === "card" ? (
        <span
          ref={highlightRef}
          aria-hidden="true"
          data-slot="radio-group-highlight"
          className="pointer-events-none absolute top-0 z-1 rounded-xl opacity-0 inset-ring-[1.5px] inset-ring-primary transition-[transform,width,height,opacity] duration-300 ease-out-quint data-instant:transition-opacity data-visible:opacity-100 motion-reduce:transition-opacity"
        />
      ) : null}
      {children}
    </RadioGroupPrimitive>
  )
}

const radioGroupItemClassName =
  "peer relative inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-background text-primary-foreground inset-ring-(length:--hairline) forced-colors:border inset-ring-muted-foreground/80 transition-[background-color,box-shadow,scale] duration-150 ease-out-quint outline-none focus-visible:outline-hidden select-none after:absolute after:-inset-2.5 pointer-coarse:after:-inset-3.5 hover:inset-ring-foreground/70 [@media(hover:hover)]:in-[label:hover]:inset-ring-foreground/70 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-ring motion-safe:active:scale-90 motion-safe:in-[label:active]:scale-90 data-checked:bg-primary data-checked:inset-ring-primary data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:inset-ring-muted-foreground/80 data-disabled:[@media(hover:hover)]:in-[label:hover]:inset-ring-muted-foreground/80 motion-safe:data-disabled:active:scale-100 motion-safe:data-disabled:in-[label:active]:scale-100 data-readonly:cursor-default motion-safe:data-readonly:active:scale-100 motion-safe:data-readonly:in-[label:active]:scale-100 aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:inset-ring-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 data-invalid:inset-ring-destructive dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:inset-ring-destructive/50 dark:data-invalid:ring-destructive/40 dark:data-invalid:inset-ring-destructive/50 data-checked:aria-invalid:inset-ring-primary data-checked:data-invalid:inset-ring-primary dark:data-checked:bg-primary"

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      className={mergeClassName(radioGroupItemClassName, className)}
      {...props}
      data-slot="radio-group-item"
    >
      <RadioPrimitive.Indicator
        keepMounted
        data-slot="radio-group-indicator"
        className="size-1.5 scale-0 rounded-full bg-current opacity-0 transition-[scale,opacity] duration-150 ease-out-quint motion-reduce:transition-none forced-colors:bg-canvas-text data-checked:scale-100 data-checked:opacity-100 data-checked:duration-300 data-checked:ease-spring"
      />
    </RadioPrimitive.Root>
  )
}

type RadioGroupCardProps = Omit<React.ComponentProps<"label">, "onChange"> &
  Pick<
    RadioPrimitive.Root.Props,
    "value" | "disabled" | "readOnly" | "required" | "inputRef" | "id"
  > & {
    radioClassName?: RadioPrimitive.Root.Props["className"]
  }

function RadioGroupCard({
  className,
  children,
  value,
  disabled,
  readOnly,
  required,
  inputRef,
  id,
  radioClassName,
  ...props
}: RadioGroupCardProps) {
  return (
    <label
      data-slot="radio-group-card"
      className={cn(
        "relative flex min-w-0 cursor-pointer items-start gap-3 rounded-xl bg-background p-4 text-sm inset-ring-(length:--hairline) inset-ring-border transition-[background-color,box-shadow] duration-200 ease-out-quint select-none has-focus-visible:ring-3 has-focus-visible:ring-focus-ring has-data-checked:bg-muted/50 has-data-checked:inset-ring-[1.5px] has-data-checked:inset-ring-primary group-has-[>[data-slot=radio-group-highlight][data-visible]]/radio-group:has-data-checked:inset-ring-(length:--hairline) group-has-[>[data-slot=radio-group-highlight][data-visible]]/radio-group:has-data-checked:inset-ring-border has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 dark:bg-input/20 dark:has-data-checked:bg-muted/60 forced-colors:border [@media(hover:hover)]:hover:not-has-data-disabled:not-has-data-checked:bg-muted/30",
        className
      )}
      {...props}
    >
      <RadioGroupItem
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        inputRef={inputRef}
        id={id}
        className={mergeClassName("mt-0.5", radioClassName)}
      />
      <span
        data-slot="radio-group-card-content"
        className="flex min-w-0 flex-1 flex-col gap-0.5 leading-snug wrap-break-word"
      >
        {children}
      </span>
    </label>
  )
}

function RadioGroupCardTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="radio-group-card-title"
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  )
}

function RadioGroupCardDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="radio-group-card-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  RadioGroup,
  RadioGroupCard,
  RadioGroupCardDescription,
  RadioGroupCardTitle,
  RadioGroupItem,
  radioGroupItemClassName,
}
export type { RadioGroupCardProps, RadioGroupProps, RadioGroupVariant }
