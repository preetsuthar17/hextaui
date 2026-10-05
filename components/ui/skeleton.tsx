"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const skeletonVariants = cva(
  "relative overflow-hidden rounded-md bg-muted motion-safe:animate-in motion-safe:animation-duration-300 motion-safe:fade-in-0 motion-safe:fill-mode-backwards motion-safe:[animation-delay:150ms] rtl:[--skeleton-dir:-1] [&:where(span)]:inline-block [&:where(span)]:align-bottom",
  {
    variants: {
      animation: {
        shimmer:
          "after:pointer-events-none after:absolute after:inset-0 after:[translate:-100%_0] after:bg-linear-to-r after:from-transparent after:via-foreground/8 after:to-transparent motion-safe:after:animate-shimmer dark:after:via-foreground/10",
        pulse:
          "after:pointer-events-none after:absolute after:inset-0 after:bg-background after:opacity-0 motion-safe:after:animate-skeleton-pulse",
        none: "",
      },
    },
    defaultVariants: {
      animation: "shimmer",
    },
  }
)

type SkeletonAnimation = NonNullable<
  VariantProps<typeof skeletonVariants>["animation"]
>

type SkeletonProps = useRender.ComponentProps<"div"> & {
  animation?: SkeletonAnimation
  loading?: boolean
}

function useReveal(loading: boolean | undefined) {
  const [previous, setPrevious] = React.useState(loading)
  const [revealed, setRevealed] = React.useState(false)

  if (loading !== previous) {
    setPrevious(loading)
    setRevealed(previous === true && loading === false)
  }

  return revealed
}

function Skeleton({
  className,
  animation = "shimmer",
  loading,
  render,
  children,
  ...props
}: SkeletonProps) {
  const revealed = useReveal(loading)
  const wraps = loading !== undefined
  const showsSkeleton = !wraps || loading

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        ...({ "data-slot": "skeleton" } as Record<string, string>),
        className: cn(
          wraps && "w-fit max-w-full",
          showsSkeleton && skeletonVariants({ animation }),
          wraps &&
            !loading &&
            revealed &&
            "motion-safe:animate-in motion-safe:ease-out-quint motion-safe:animation-duration-200 motion-safe:fade-in-0",
          className
        ),
        "aria-hidden": wraps ? undefined : true,
        "aria-busy": loading || undefined,
        children: wraps ? (
          <span
            data-slot="skeleton-content"
            className={cn("contents", loading && "invisible")}
            inert={loading || undefined}
            aria-hidden={loading || undefined}
          >
            {children}
          </span>
        ) : (
          children
        ),
      },
      props,
      {
        "data-animation": showsSkeleton ? animation : undefined,
        "data-loading": wraps ? String(Boolean(loading)) : undefined,
      } as Record<string, string | undefined>
    ),
  })
}

type SkeletonTextProps = React.ComponentProps<"div"> & {
  lines?: number
  animation?: SkeletonAnimation
}

function SkeletonText({
  className,
  lines = 3,
  animation,
  ...props
}: SkeletonTextProps) {
  const count = Math.min(
    50,
    Math.max(1, Math.floor(Number.isFinite(lines) ? lines : 1))
  )

  return (
    <div
      data-slot="skeleton-text"
      aria-hidden="true"
      className={cn("flex w-full flex-col", className)}
      {...props}
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex h-[1lh] items-center">
          <Skeleton
            animation={animation}
            className={cn(
              "h-[0.8em] rounded-sm",
              count > 1 && index === count - 1 ? "w-3/5" : "w-full"
            )}
          />
        </div>
      ))}
    </div>
  )
}

export { Skeleton, SkeletonText, skeletonVariants }
export type { SkeletonProps, SkeletonTextProps, SkeletonAnimation }
