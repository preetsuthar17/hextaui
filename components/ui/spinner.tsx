"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import {
  useDelayedLoading,
  type DelayedLoadingOptions,
} from "@/hooks/use-delayed-loading"

const spinnerVariants = cva("shrink-0", {
  variants: {
    size: {
      sm: "size-3.5",
      default: "size-4",
      lg: "size-5",
      xl: "size-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

type SpinnerVariant = "ticks" | "ring"

type SpinnerProps = Omit<React.ComponentProps<"svg">, "children"> &
  VariantProps<typeof spinnerVariants> & {
    variant?: SpinnerVariant
    label?: string
    animated?: boolean
    loading?: boolean
    delay?: number
    minDuration?: number
  }

const ticks = Array.from({ length: 8 }, (_, index) => index)

function Spinner({
  className,
  variant = "ticks",
  size = "default",
  label = "Loading",
  animated = true,
  loading,
  delay,
  minDuration,
  ...props
}: SpinnerProps) {
  const delayed = useDelayedLoading(loading ?? false, { delay, minDuration })
  const shown = loading === undefined || delayed

  if (!shown) {
    return null
  }

  const hidden =
    props["aria-hidden"] === true || props["aria-hidden"] === "true"

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      role={hidden ? undefined : "status"}
      aria-label={hidden ? undefined : label}
      data-slot="spinner"
      data-variant={variant}
      className={cn(
        spinnerVariants({ size }),
        animated &&
          (variant === "ticks"
            ? "motion-safe:animate-spinner-ticks"
            : "motion-safe:animate-spinner-rotate"),
        animated && "motion-reduce:animate-spinner-pulse",
        loading !== undefined &&
          "transition-opacity duration-200 ease-out motion-reduce:transition-none starting:opacity-0",
        className
      )}
      {...props}
    >
      {variant === "ticks" ? (
        ticks.map((index) => (
          <line
            key={index}
            x1="12"
            y1="2.75"
            x2="12"
            y2="6.75"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            opacity={1 - index * 0.11}
            transform={`rotate(${-index * 45} 12 12)`}
          />
        ))
      ) : (
        <>
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="2.5"
            opacity="0.2"
          />
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="16 60"
            transform="rotate(-90 12 12)"
            className={cn(animated && "motion-safe:animate-spinner-dash")}
          />
        </>
      )}
    </svg>
  )
}

export { Spinner, spinnerVariants, useDelayedLoading }
export type { DelayedLoadingOptions, SpinnerProps, SpinnerVariant }
