"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

function dataAttributes(slot: string, extra?: Record<string, string>) {
  return { "data-slot": slot, ...extra } as Record<string, string>
}

const emptyVariants = cva(
  "group/empty flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-(--empty-gap) rounded-xl p-(--empty-padding) text-center text-balance",
  {
    variants: {
      variant: {
        default:
          "[--empty-media-bg:var(--color-muted)] [--empty-media-ring:0px]",
        outline:
          "border-(length:--hairline) border-dashed border-border [--empty-media-bg:var(--color-muted)] [--empty-media-ring:0px]",
        muted:
          "bg-muted/50 [--empty-media-bg:var(--color-background)] [--empty-media-ring:var(--hairline)]",
      },
      size: {
        default:
          "[--empty-gap:--spacing(6)] [--empty-media-gap:--spacing(2)] [--empty-media-radius:var(--radius-lg)] [--empty-media-size:--spacing(10)] [--empty-padding:--spacing(12)] [--empty-title-size:var(--text-lg)]",
        sm: "[--empty-gap:--spacing(4)] [--empty-media-gap:--spacing(1)] [--empty-media-radius:var(--radius-md)] [--empty-media-size:--spacing(9)] [--empty-padding:--spacing(6)] [--empty-title-size:var(--text-base)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type EmptyVariant = NonNullable<VariantProps<typeof emptyVariants>["variant"]>
type EmptySize = NonNullable<VariantProps<typeof emptyVariants>["size"]>

type EmptyProps = useRender.ComponentProps<"div"> & {
  variant?: EmptyVariant
  size?: EmptySize
  animated?: boolean
}

function Empty({
  className,
  variant = "default",
  size = "default",
  animated = true,
  render,
  ...props
}: EmptyProps) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      { className: cn(emptyVariants({ variant, size }), className) },
      props,
      dataAttributes("empty", {
        "data-variant": variant,
        "data-size": size,
        ...(animated ? { "data-animated": "" } : {}),
      })
    ),
  })
}

const enter = "group-data-animated/empty:motion-safe:animate-empty-in"

function EmptyHeader({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(
          "flex w-full max-w-sm min-w-0 flex-col items-center gap-2",
          className
        ),
      },
      props,
      dataAttributes("empty-header")
    ),
  })
}

const emptyMediaVariants = cva(
  "mb-[var(--empty-media-gap,--spacing(2))] flex shrink-0 items-center justify-center [--empty-delay:0ms] group-data-animated/empty:motion-safe:animate-empty-in [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "size-[var(--empty-media-size,--spacing(10))] rounded-[var(--empty-media-radius,var(--radius-lg))] bg-[var(--empty-media-bg,var(--color-muted))] text-foreground ring-[length:var(--empty-media-ring,0px)] ring-foreground/10 [&_svg:not([class*='size-'])]:size-5",
        stack:
          "relative isolate mx-[calc(var(--empty-media-size,--spacing(10))*0.4)] size-[calc(var(--empty-media-size,--spacing(10))*1.2)] rounded-[var(--empty-media-radius,var(--radius-lg))] text-foreground before:absolute before:inset-0 before:translate-x-[-28%] before:translate-y-[6%] before:scale-90 before:-rotate-10 before:rounded-[inherit] before:bg-muted before:ring-(length:--hairline) before:ring-foreground/8 before:transition-[rotate,translate,scale] before:duration-500 before:ease-spring after:absolute after:inset-0 after:translate-x-[28%] after:translate-y-[6%] after:scale-90 after:rotate-10 after:rounded-[inherit] after:bg-muted after:ring-(length:--hairline) after:ring-foreground/8 after:transition-[rotate,translate,scale] after:duration-500 after:ease-spring motion-reduce:before:transition-none motion-reduce:after:transition-none [&_svg:not([class*='size-'])]:size-5 [@media(hover:hover)]:group-hover/empty:before:translate-x-[-42%] [@media(hover:hover)]:group-hover/empty:before:-rotate-16 [@media(hover:hover)]:group-hover/empty:after:translate-x-[42%] [@media(hover:hover)]:group-hover/empty:after:rotate-16",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type EmptyMediaVariant = NonNullable<
  VariantProps<typeof emptyMediaVariants>["variant"]
>

type EmptyMediaProps = useRender.ComponentProps<"div"> & {
  variant?: EmptyMediaVariant
}

function EmptyMedia({
  className,
  variant = "default",
  render,
  children,
  ...props
}: EmptyMediaProps) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(emptyMediaVariants({ variant }), className),
        ...(variant !== "default" ? { "aria-hidden": true } : {}),
        children:
          variant === "stack" ? (
            <span
              data-slot="empty-icon-tile"
              className="relative z-10 grid size-full place-items-center rounded-[inherit] bg-card ring-(length:--hairline) ring-foreground/10 forced-colors:border"
            >
              {children}
            </span>
          ) : (
            children
          ),
      },
      props,
      dataAttributes("empty-icon", { "data-variant": variant })
    ),
  })
}

function EmptyTitle({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(
          "max-w-full min-w-0 font-heading text-[length:var(--empty-title-size,var(--text-lg))] leading-snug font-medium tracking-tight wrap-anywhere text-foreground [--empty-delay:60ms]",
          enter,
          className
        ),
      },
      props,
      dataAttributes("empty-title")
    ),
  })
}

function EmptyDescription({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(
          enter,
          "max-w-full min-w-0 text-sm/relaxed wrap-anywhere text-muted-foreground [--empty-delay:110ms] [&_a:not([data-slot])]:text-foreground [&_a:not([data-slot])]:underline [&_a:not([data-slot])]:decoration-foreground/30 [&_a:not([data-slot])]:underline-offset-4 [&_a:not([data-slot])]:transition-colors [&_a:not([data-slot])]:hover:decoration-foreground [&_a:not([data-slot])]:focus-visible:rounded-xs [&_a:not([data-slot])]:focus-visible:ring-3 [&_a:not([data-slot])]:focus-visible:ring-focus-ring [&_a:not([data-slot])]:focus-visible:outline-hidden [&>p:not(:last-child)]:mb-2",
          className
        ),
      },
      props,
      dataAttributes("empty-description")
    ),
  })
}

function EmptyContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(
          "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance [--empty-delay:170ms]",
          enter,
          className
        ),
      },
      props,
      dataAttributes("empty-content")
    ),
  })
}

export {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  emptyVariants,
  emptyMediaVariants,
}
export type { EmptyProps, EmptyMediaProps }
