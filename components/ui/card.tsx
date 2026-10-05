"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

function dataAttributes(slot: string, extra?: Record<string, string>) {
  return { "data-slot": slot, ...extra } as Record<string, string>
}

const CardLinkContext = React.createContext<React.Dispatch<
  React.SetStateAction<number>
> | null>(null)

const cardVariants = cva(
  "group/card relative flex flex-col gap-(--card-spacing) overflow-hidden rounded-(--card-radius) py-(--card-spacing) text-sm text-card-foreground transition-[box-shadow,background-color] duration-150 ease-out-quint in-data-[slot=card-content]:[--card-radius:max(var(--radius-md),calc(var(--card-parent-radius)-var(--card-parent-spacing)))] has-[>:is(img,video,picture,[data-slot=aspect-ratio]):first-child]:pt-0 has-[>:is(img,video,picture,[data-slot=aspect-ratio]):last-child]:pb-0 data-link:has-[[data-slot=card-link]:focus-visible]:ring-3 data-link:has-[[data-slot=card-link]:focus-visible]:inset-ring-1 data-link:has-[[data-slot=card-link]:focus-visible]:ring-focus-ring data-link:has-[[data-slot=card-link]:focus-visible]:inset-ring-ring data-link:[&_:where(a[href],button,input,select,textarea,summary,label,[role=button],[tabindex]):not([data-slot=card-link])]:relative data-link:[&_:where(a[href],button,input,select,textarea,summary,label,[role=button],[tabindex]):not([data-slot=card-link])]:z-2",
  {
    variants: {
      variant: {
        default:
          "bg-card ring-(length:--hairline) ring-foreground/10 data-link:hover:ring-foreground/15 forced-colors:border",
        outline:
          "bg-transparent ring-(length:--hairline) ring-foreground/10 data-link:hover:bg-muted/50 forced-colors:border",
        muted:
          "bg-muted text-foreground data-link:hover:bg-[color-mix(in_oklch,var(--color-muted),var(--color-foreground)_4%)]",
      },
      size: {
        default:
          "[--card-radius:var(--radius-xl)] [--card-spacing:--spacing(6)] [--card-title-size:var(--text-base)]",
        sm: "[--card-radius:var(--radius-lg)] [--card-spacing:--spacing(4)] [--card-title-size:var(--text-sm)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type CardVariant = NonNullable<VariantProps<typeof cardVariants>["variant"]>
type CardSize = NonNullable<VariantProps<typeof cardVariants>["size"]>

type CardProps = useRender.ComponentProps<"div"> & {
  variant?: CardVariant
  size?: CardSize
}

function Card({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: CardProps) {
  const [links, setLinks] = React.useState(0)

  const element = useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      { className: cn(cardVariants({ variant, size }), className) },
      props,
      dataAttributes("card", {
        "data-variant": variant,
        "data-size": size,
        ...(links > 0 ? { "data-link": "" } : {}),
      })
    ),
  })

  return (
    <CardLinkContext.Provider value={setLinks}>
      {element}
    </CardLinkContext.Provider>
  )
}

function CardHeader({
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
          "group/card-header grid auto-rows-min items-start gap-1 px-(--card-spacing) has-[>[data-slot=card-action]]:grid-cols-[minmax(0,1fr)_auto] has-[>[data-slot=card-description]]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
          className
        ),
      },
      props,
      dataAttributes("card-header")
    ),
  })
}

function CardTitle({
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
          "min-w-0 font-heading text-(length:--card-title-size) leading-normal font-medium text-pretty wrap-anywhere",
          className
        ),
      },
      props,
      dataAttributes("card-title")
    ),
  })
}

function CardDescription({
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
          "min-w-0 text-sm text-pretty wrap-anywhere text-muted-foreground",
          className
        ),
      },
      props,
      dataAttributes("card-description")
    ),
  })
}

function CardAction({
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
          "relative z-2 col-start-2 row-span-2 row-start-1 self-start justify-self-end",
          className
        ),
      },
      props,
      dataAttributes("card-action")
    ),
  })
}

function CardContent({
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
          "flex min-w-0 flex-col gap-3 px-(--card-spacing) [--card-parent-radius:var(--card-radius)] [--card-parent-spacing:var(--card-spacing)]",
          className
        ),
      },
      props,
      dataAttributes("card-content")
    ),
  })
}

function CardFooter({
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
          "flex min-w-0 items-center gap-2 px-(--card-spacing) [.border-t]:pt-(--card-spacing)",
          className
        ),
      },
      props,
      dataAttributes("card-footer")
    ),
  })
}

function CardLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  const setLinks = React.useContext(CardLinkContext)

  React.useLayoutEffect(() => {
    if (!setLinks) {
      return
    }

    setLinks((count) => count + 1)

    return () => setLinks((count) => count - 1)
  }, [setLinks])

  return useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">(
      {
        className: cn(
          "outline-none [-webkit-tap-highlight-color:transparent] after:absolute after:inset-0 after:z-1 focus-visible:outline-hidden",
          className
        ),
      },
      props,
      dataAttributes("card-link")
    ),
  })
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLink,
  CardTitle,
  cardVariants,
}
export type { CardProps, CardSize, CardVariant }
