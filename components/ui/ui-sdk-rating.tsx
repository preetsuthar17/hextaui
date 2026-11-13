"use client"

import * as React from "react"
import { IconStarFilled } from "@tabler/icons-react"
import * as RatingPrimitive from "@ui-sdk/react/rating"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

const ratingVariants = cva(
  "group/rating inline-flex w-fit items-center text-(--rating-color) forced-colors:[--rating-color:CanvasText] data-disabled:opacity-50",
  {
    variants: {
      tone: {
        default:
          "[--rating-color:var(--color-amber-400)] dark:[--rating-color:var(--color-amber-300)]",
        neutral: "[--rating-color:var(--color-foreground)]",
        destructive: "[--rating-color:var(--color-destructive)]",
      },
      size: {
        sm: "gap-0 [--rating-star:--spacing(4)]",
        default: "gap-0.5 [--rating-star:--spacing(5)]",
        lg: "gap-0.5 [--rating-star:--spacing(7)]",
      },
    },
    defaultVariants: {
      tone: "default",
      size: "default",
    },
  }
)

type RatingProps = React.ComponentProps<typeof RatingPrimitive.Rating> &
  VariantProps<typeof ratingVariants>

function Rating({
  className,
  size = "default",
  tone = "default",
  ...props
}: RatingProps) {
  return (
    <RatingPrimitive.Rating
      data-size={size}
      data-tone={tone}
      className={mergeClassName(ratingVariants({ size, tone }), className)}
      {...props}
    />
  )
}

function RatingStar() {
  return (
    <>
      <IconStarFilled
        aria-hidden="true"
        className="size-(--rating-star) text-muted-foreground/25 dark:text-muted-foreground/35 forced-colors:text-[GrayText]"
      />
      <IconStarFilled
        aria-hidden="true"
        className="absolute inset-0 m-auto size-(--rating-star) [clip-path:inset(0_calc((1-var(--rating-fill,0))*100%)_0_0)] rtl:[clip-path:inset(0_0_0_calc((1-var(--rating-fill,0))*100%))]"
      />
    </>
  )
}

function RatingItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RatingPrimitive.RatingItem>) {
  return (
    <RatingPrimitive.RatingItem
      className={mergeClassName(
        "group/rating-item relative flex shrink-0 items-center justify-center rounded-sm transition-[scale] duration-150 ease-out-quint outline-none group-data-disabled/rating:cursor-not-allowed has-focus-visible:ring-3 has-focus-visible:ring-focus-ring motion-safe:not-data-readonly:not-data-disabled:active:scale-90 motion-reduce:transition-none pointer-coarse:p-1 [&_[role=radio]]:outline-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [@media(hover:hover)]:motion-safe:not-data-readonly:not-data-disabled:hover:scale-115",
        className
      )}
      {...props}
    >
      {children ?? <RatingStar />}
    </RatingPrimitive.RatingItem>
  )
}

const createRatingController = RatingPrimitive.createRatingController

export { Rating, RatingItem, createRatingController, ratingVariants }
export type { RatingProps }
