"use client"

import * as React from "react"
import {
  IconChevronDown,
  IconChevronUp,
  IconMinus,
  IconPlus,
  IconSelector,
} from "@tabler/icons-react"
import * as NumberInputPrimitive from "@ui-sdk/react/number-input"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

type NumberInputGroupVariant = "split" | "stacked" | "plain"

const NumberInputInvalidContext = React.createContext(false)
const NumberInputGroupContext =
  React.createContext<NumberInputGroupVariant>("split")

type NumberInputProps = React.ComponentProps<
  typeof NumberInputPrimitive.NumberInput
> & {
  invalid?: boolean
}

function NumberInput({ className, invalid = false, ...props }: NumberInputProps) {
  return (
    <NumberInputInvalidContext.Provider value={invalid}>
      <NumberInputPrimitive.NumberInput
        data-invalid={invalid ? "" : undefined}
        className={mergeClassName(
          "group/number-input flex w-full min-w-0 flex-col gap-1.5",
          className
        )}
        {...props}
      />
    </NumberInputInvalidContext.Provider>
  )
}

const numberInputGroupVariants = cva(
  "group/number-input-group relative flex h-9 w-full min-w-0 items-center rounded-md bg-transparent text-sm text-foreground inset-ring-(length:--hairline) inset-ring-input transition-[background-color,box-shadow] duration-150 ease-out-cubic group-data-disabled/number-input:cursor-not-allowed group-data-disabled/number-input:opacity-50 group-data-invalid/number-input:inset-ring-destructive group-data-readonly/number-input:bg-muted/40 has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-focus-ring has-[input:focus-visible]:inset-ring-ring has-[input:user-invalid]:inset-ring-destructive group-data-invalid/number-input:has-[input:focus-visible]:ring-destructive/20 group-data-invalid/number-input:has-[input:focus-visible]:inset-ring-destructive data-scrubbing:inset-ring-ring motion-reduce:transition-none dark:bg-input/30 dark:group-data-readonly/number-input:bg-input/20 forced-colors:border pointer-coarse:h-10 [@media(hover:hover)]:hover:not-has-[input:focus-visible]:not-group-data-disabled/number-input:not-group-data-invalid/number-input:inset-ring-ring/70",
  {
    variants: {
      variant: {
        split: "gap-0.5 px-1",
        stacked: "gap-1 ps-0 pe-0.5",
        plain: "gap-1 px-0",
      },
    },
    defaultVariants: {
      variant: "split",
    },
  }
)

function NumberInputGroup({
  className,
  variant = "split",
  ...props
}: React.ComponentProps<typeof NumberInputPrimitive.NumberInputGroup> &
  VariantProps<typeof numberInputGroupVariants>) {
  const resolved = variant ?? "split"
  return (
    <NumberInputGroupContext.Provider value={resolved}>
      <NumberInputPrimitive.NumberInputGroup
        data-variant={resolved}
        className={mergeClassName(
          numberInputGroupVariants({ variant: resolved }),
          className
        )}
        {...props}
      />
    </NumberInputGroupContext.Provider>
  )
}

function NumberInputControl({
  className,
  ...props
}: React.ComponentProps<typeof NumberInputPrimitive.NumberInputControl>) {
  const invalid = React.useContext(NumberInputInvalidContext)
  return (
    <NumberInputPrimitive.NumberInputControl
      aria-invalid={invalid || undefined}
      className={mergeClassName(
        "h-full w-full min-w-0 flex-1 bg-transparent px-2 tabular-nums outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed group-data-[variant=plain]/number-input-group:px-3 group-data-[variant=split]/number-input-group:text-center group-data-[variant=stacked]/number-input-group:ps-3 pointer-coarse:text-touch",
        className
      )}
      {...props}
    />
  )
}

const stepButtonClassName =
  "relative inline-flex shrink-0 items-center justify-center text-muted-foreground transition-[color,background-color,scale,opacity] duration-150 ease-out-quint outline-none select-none after:absolute hover:bg-muted hover:text-foreground active:duration-75 data-disabled:pointer-events-none data-disabled:opacity-40 group-data-readonly/number-input:opacity-40 motion-safe:active:scale-90 dark:hover:bg-muted/60 [&_svg]:pointer-events-none [&_svg]:shrink-0 group-data-[variant=split]/number-input-group:size-7 group-data-[variant=split]/number-input-group:rounded-[calc(var(--radius-md)-var(--spacing))] group-data-[variant=split]/number-input-group:after:-inset-1 group-data-[variant=split]/number-input-group:[&_svg]:size-4 pointer-coarse:group-data-[variant=split]/number-input-group:size-8 group-data-[variant=stacked]/number-input-group:h-1/2 group-data-[variant=stacked]/number-input-group:w-6 group-data-[variant=stacked]/number-input-group:rounded-sm group-data-[variant=stacked]/number-input-group:[&_svg]:size-3.5"

function StepIcon({ direction }: { direction: "up" | "down" }) {
  const variant = React.useContext(NumberInputGroupContext)
  if (variant === "stacked") {
    return direction === "up" ? (
      <IconChevronUp aria-hidden="true" />
    ) : (
      <IconChevronDown aria-hidden="true" />
    )
  }
  return direction === "up" ? (
    <IconPlus aria-hidden="true" />
  ) : (
    <IconMinus aria-hidden="true" />
  )
}

function NumberInputIncrement({
  className,
  children,
  "aria-label": ariaLabel = "Increase",
  ...props
}: React.ComponentProps<typeof NumberInputPrimitive.NumberInputIncrement>) {
  return (
    <NumberInputPrimitive.NumberInputIncrement
      aria-label={ariaLabel}
      className={mergeClassName(stepButtonClassName, className)}
      {...props}
    >
      {children ?? <StepIcon direction="up" />}
    </NumberInputPrimitive.NumberInputIncrement>
  )
}

function NumberInputDecrement({
  className,
  children,
  "aria-label": ariaLabel = "Decrease",
  ...props
}: React.ComponentProps<typeof NumberInputPrimitive.NumberInputDecrement>) {
  return (
    <NumberInputPrimitive.NumberInputDecrement
      aria-label={ariaLabel}
      className={mergeClassName(stepButtonClassName, className)}
      {...props}
    >
      {children ?? <StepIcon direction="down" />}
    </NumberInputPrimitive.NumberInputDecrement>
  )
}

function NumberInputStepper({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="number-input-stepper"
      className={cn(
        "flex h-full shrink-0 flex-col justify-center py-0.5",
        className
      )}
      {...props}
    />
  )
}

function NumberInputScrubArea({
  className,
  ...props
}: React.ComponentProps<typeof NumberInputPrimitive.NumberInputScrubArea>) {
  return (
    <NumberInputPrimitive.NumberInputScrubArea
      className={mergeClassName(
        "inline-flex w-fit shrink-0 cursor-ew-resize items-center gap-1.5 select-none data-[orientation=vertical]:cursor-ns-resize group-data-disabled/number-input:cursor-not-allowed group-data-readonly/number-input:cursor-default group-data-[variant=plain]/number-input-group:h-full group-data-[variant=plain]/number-input-group:min-w-8 group-data-[variant=plain]/number-input-group:justify-center group-data-[variant=plain]/number-input-group:rounded-s-md group-data-[variant=plain]/number-input-group:ps-1 group-data-[variant=plain]/number-input-group:text-xs group-data-[variant=plain]/number-input-group:font-medium group-data-[variant=plain]/number-input-group:text-muted-foreground group-data-[variant=plain]/number-input-group:transition-colors group-data-[variant=plain]/number-input-group:hover:text-foreground group-data-[variant=plain]/number-input-group:data-scrubbing:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function NumberInputScrubAreaCursor({
  className,
  children,
  ...props
}: React.ComponentProps<
  typeof NumberInputPrimitive.NumberInputScrubAreaCursor
>) {
  return (
    <NumberInputPrimitive.NumberInputScrubAreaCursor
      className={mergeClassName(
        "z-50 -ms-2.5 -mt-2.5 flex size-5 items-center justify-center text-foreground drop-shadow-[0_0_1px_var(--color-background)] [&_svg]:size-5",
        className
      )}
      {...props}
    >
      {children ?? <IconSelector aria-hidden="true" className="rotate-90" />}
    </NumberInputPrimitive.NumberInputScrubAreaCursor>
  )
}

const createNumberInputController =
  NumberInputPrimitive.createNumberInputController

export {
  NumberInput,
  NumberInputGroup,
  NumberInputControl,
  NumberInputIncrement,
  NumberInputDecrement,
  NumberInputStepper,
  NumberInputScrubArea,
  NumberInputScrubAreaCursor,
  createNumberInputController,
  numberInputGroupVariants,
}
export type { NumberInputProps }
export type {
  NumberInputController,
  NumberInputState,
} from "@ui-sdk/react/number-input"
