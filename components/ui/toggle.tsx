"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

const toggleVariants = cva(
  "group/toggle relative isolate inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-clip-padding text-sm font-medium whitespace-nowrap text-muted-foreground inset-ring-(length:--hairline) inset-ring-transparent transition-[color,background-color,box-shadow,opacity,translate,scale] duration-200 ease-out-quint outline-none select-none before:pointer-events-none before:absolute before:inset-(--hairline) before:-z-1 before:rounded-[inherit] before:bg-foreground/8 before:opacity-0 before:transition-[opacity,scale] before:duration-200 before:ease-out-quint hover:text-foreground focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-ring focus-visible:outline-hidden active:duration-100 aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:inset-ring-destructive data-pressed:text-foreground data-pressed:before:opacity-100 motion-safe:before:scale-[0.88] motion-safe:active:not-data-disabled:translate-y-px motion-safe:active:not-data-disabled:scale-[0.97] motion-safe:data-pressed:before:scale-100 dark:before:bg-foreground/12 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:inset-ring-destructive/50 forced-colors:border forced-colors:before:hidden forced-colors:data-pressed:outline-2 forced-colors:data-pressed:-outline-offset-2 forced-colors:data-pressed:outline-solid pointer-coarse:after:absolute pointer-coarse:in-data-[slot=toggle-group]:after:hidden data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:transition-[color,fill] [&_svg]:duration-200 [&_svg]:ease-out-quint [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-muted dark:hover:bg-muted/50",
        outline:
          "bg-background inset-ring-border hover:bg-muted dark:bg-input/30 dark:inset-ring-input dark:hover:bg-input/50",
      },
      size: {
        default: "h-9 min-w-9 px-2 pointer-coarse:after:-inset-1",
        sm: "h-8 min-w-8 rounded-[min(var(--radius-md),10px)] px-1.5 pointer-coarse:after:-inset-1.5",
        lg: "h-10 min-w-10 px-2.5 pointer-coarse:after:-inset-0.5",
      },
      shape: {
        default: "",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
)

type ToggleProps<Value extends string = string> = TogglePrimitive.Props<Value> &
  VariantProps<typeof toggleVariants>

function Toggle<Value extends string = string>({
  className,
  variant = "default",
  size = "default",
  shape = "default",
  ...props
}: ToggleProps<Value>) {
  return (
    <TogglePrimitive
      data-variant={variant}
      data-size={size}
      data-shape={shape ?? "default"}
      className={mergeClassName(
        toggleVariants({ variant, size, shape }),
        className
      )}
      {...props}
      data-slot="toggle"
    />
  )
}

export { Toggle, toggleVariants }
export type { ToggleProps }
