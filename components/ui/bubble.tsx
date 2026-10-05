"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

type BubbleShape = "uniform" | "joined" | "tail"

const BubbleShapeContext = React.createContext<BubbleShape | undefined>(
  undefined
)

const BubbleAlignContext = React.createContext<"start" | "end" | undefined>(
  undefined
)

function dataAttributes(slot: string, extra?: Record<string, string>) {
  return { "data-slot": slot, ...extra } as Record<string, string>
}

type BubbleGroupProps = useRender.ComponentProps<"div"> & {
  shape?: BubbleShape
}

function BubbleGroup({ className, shape, render, ...props }: BubbleGroupProps) {
  const element = useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      { className: cn("flex min-w-0 flex-col gap-1", className) },
      props,
      dataAttributes("bubble-group", shape ? { "data-shape": shape } : {})
    ),
  })

  return (
    <BubbleShapeContext.Provider value={shape}>
      {element}
    </BubbleShapeContext.Provider>
  )
}

const bubbleVariants = cva(
  "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 [--bubble-bg:transparent] [--bubble-border:transparent] [--bubble-fg:currentColor] [--bubble-radius-bottom:var(--bubble-radius)] [--bubble-radius-joined:var(--radius-sm)] [--bubble-radius-top:var(--bubble-radius)] [--bubble-radius:var(--radius-xl)] [--bubble-tail:none] group-data-[align=end]/message:ms-auto in-data-[slot=bubble-content]:[--bubble-radius:max(calc(var(--radius-sm)*0.5),calc(var(--bubble-content-radius)-var(--spacing)*2))]",
  {
    variants: {
      variant: {
        default:
          "[--bubble-bg:var(--color-primary)] [--bubble-fg:var(--color-primary-foreground)]",
        secondary:
          "[--bubble-bg:var(--color-secondary)] [--bubble-fg:var(--color-secondary-foreground)]",
        muted:
          "[--bubble-bg:var(--color-muted)] [--bubble-fg:var(--color-foreground)]",
        tinted:
          "[--bubble-bg:oklch(from_var(--color-primary)_0.94_calc(c*0.4)_h)] [--bubble-fg:var(--color-foreground)] dark:[--bubble-bg:oklch(from_var(--color-primary)_0.3_calc(c*0.4)_h)]",
        outline:
          "[--bubble-bg:var(--color-background)] [--bubble-border:var(--color-border)] [--bubble-fg:var(--color-foreground)] dark:[--bubble-border:var(--color-input)]",
        ghost:
          "max-w-full [--bubble-radius:var(--radius-md)] *:data-[slot=bubble-content]:p-0",
        destructive:
          "[--bubble-accent:var(--color-destructive)] [--bubble-bg:color-mix(in_oklab,var(--color-destructive)_10%,var(--color-background))] [--bubble-fg:var(--color-foreground)] dark:[--bubble-bg:color-mix(in_oklab,var(--color-destructive)_18%,var(--color-background))]",
      },
      align: {
        start:
          "[--bubble-tail-flip:-1] *:data-[slot=bubble-content]:rounded-ss-(--bubble-radius-top) *:data-[slot=bubble-content]:rounded-es-(--bubble-radius-bottom) rtl:[--bubble-tail-flip:1]",
        end: "ms-auto [--bubble-tail-flip:1] *:data-[slot=bubble-content]:self-end *:data-[slot=bubble-content]:rounded-se-(--bubble-radius-top) *:data-[slot=bubble-content]:rounded-ee-(--bubble-radius-bottom) rtl:[--bubble-tail-flip:-1]",
      },
      shape: {
        uniform: "",
        joined: "",
        tail: "[--bubble-tail-cut:calc(var(--spacing)*2)] [--bubble-tail-height:calc(var(--spacing)*5)] [--bubble-tail-overlap:calc(var(--spacing)*2.5)] [--bubble-tail-width:calc(var(--spacing)*1.5)] [--bubble-tail:block] *:data-[slot=bubble-content]:relative *:data-[slot=bubble-content]:overflow-visible *:data-[slot=bubble-content]:after:pointer-events-none *:data-[slot=bubble-content]:after:absolute *:data-[slot=bubble-content]:after:bottom-0 *:data-[slot=bubble-content]:after:[display:var(--bubble-tail)] *:data-[slot=bubble-content]:after:h-(--bubble-tail-height) *:data-[slot=bubble-content]:after:w-[calc(var(--bubble-tail-width)+var(--bubble-tail-overlap))] *:data-[slot=bubble-content]:after:[scale:var(--bubble-tail-flip)_1] *:data-[slot=bubble-content]:after:rounded-bl-[calc(var(--spacing)*3.25)_calc(var(--spacing)*2.75)] *:data-[slot=bubble-content]:after:bg-(--bubble-bg) *:data-[slot=bubble-content]:after:[mask-image:linear-gradient(to_right,black_var(--bubble-tail-overlap),transparent_var(--bubble-tail-overlap)),radial-gradient(circle_var(--bubble-tail-cut)_at_100%_0,transparent_var(--bubble-tail-cut),black_calc(var(--bubble-tail-cut)+0.5px))] *:data-[slot=bubble-content]:after:[mask-size:100%_100%,var(--bubble-tail-cut)_var(--bubble-tail-cut)] *:data-[slot=bubble-content]:after:[mask-position:0_0,var(--bubble-tail-overlap)_100%] *:data-[slot=bubble-content]:after:[mask-repeat:no-repeat]",
      },
    },
    compoundVariants: [
      {
        shape: "joined",
        align: "start",
        className:
          "[[data-slot=bubble-group]>&:has(+[data-slot=bubble][data-align=start])]:[--bubble-radius-bottom:var(--bubble-radius-joined)] [[data-slot=bubble-group]>[data-slot=bubble][data-align=start]+&]:[--bubble-radius-top:var(--bubble-radius-joined)]",
      },
      {
        shape: "joined",
        align: "end",
        className:
          "[[data-slot=bubble-group]>&:has(+[data-slot=bubble][data-align=end])]:[--bubble-radius-bottom:var(--bubble-radius-joined)] [[data-slot=bubble-group]>[data-slot=bubble][data-align=end]+&]:[--bubble-radius-top:var(--bubble-radius-joined)]",
      },
      {
        shape: "tail",
        align: "start",
        className:
          "ps-(--bubble-tail-width) *:data-[slot=bubble-content]:after:start-[calc(var(--bubble-tail-width)*-1)] [[data-slot=bubble-group]>&:has(+[data-slot=bubble][data-align=start])]:[--bubble-tail:none]",
      },
      {
        shape: "tail",
        align: "end",
        className:
          "pe-(--bubble-tail-width) *:data-[slot=bubble-content]:after:end-[calc(var(--bubble-tail-width)*-1)] [[data-slot=bubble-group]>&:has(+[data-slot=bubble][data-align=end])]:[--bubble-tail:none]",
      },
      {
        shape: "tail",
        variant: ["outline", "ghost"],
        className: "[--bubble-tail:none]",
      },
    ],
    defaultVariants: {
      variant: "default",
      align: "start",
      shape: "joined",
    },
  }
)

type BubbleVariant = NonNullable<VariantProps<typeof bubbleVariants>["variant"]>
type BubbleAlign = NonNullable<VariantProps<typeof bubbleVariants>["align"]>

type BubbleProps = useRender.ComponentProps<"div"> & {
  variant?: BubbleVariant
  align?: BubbleAlign
  shape?: BubbleShape
}

function Bubble({
  className,
  variant = "default",
  align: alignProp,
  shape: shapeProp,
  render,
  ...props
}: BubbleProps) {
  const groupShape = React.useContext(BubbleShapeContext)
  const inheritedAlign = React.useContext(BubbleAlignContext)
  const align = alignProp ?? inheritedAlign ?? "start"
  const shape = shapeProp ?? groupShape ?? "joined"

  const element = useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      { className: cn(bubbleVariants({ variant, align, shape }), className) },
      props,
      dataAttributes("bubble", {
        "data-variant": variant,
        "data-align": align,
        "data-shape": shape,
      })
    ),
  })

  return (
    <BubbleShapeContext.Provider value={undefined}>
      {element}
    </BubbleShapeContext.Provider>
  )
}

function BubbleContent({
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
          "w-fit max-w-full min-w-0 overflow-hidden rounded-(--bubble-radius) bg-(--bubble-bg) px-3 py-2 text-sm leading-relaxed wrap-anywhere text-(--bubble-fg) inset-ring-(length:--hairline) inset-ring-(--bubble-border) outline-none [--bubble-content-radius:var(--bubble-radius)] focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-ring focus-visible:outline-hidden forced-colors:border [&:is(button,a)]:text-start [&>svg]:inline-block [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:align-[-0.1875rem] [&>svg]:text-(--bubble-accent,currentColor)",
          className
        ),
      },
      props,
      dataAttributes("bubble-content")
    ),
  })
}

const bubbleReactionsVariants = cva(
  "relative z-10 flex w-max max-w-[calc(100%-var(--spacing)*3)] flex-wrap items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-sm leading-5 ring-3 ring-background select-none has-[>button]:p-0 *:data-[slot=button]:rounded-full",
  {
    variants: {
      side: {
        top: "order-first -mb-2.5",
        bottom: "-mt-2.5",
      },
      align: {
        start: "ms-3 self-start",
        end: "me-3 self-end",
      },
    },
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  }
)

type BubbleReactionsProps = useRender.ComponentProps<"div"> & {
  side?: NonNullable<VariantProps<typeof bubbleReactionsVariants>["side"]>
  align?: NonNullable<VariantProps<typeof bubbleReactionsVariants>["align"]>
}

function BubbleReactions({
  className,
  side = "bottom",
  align = "end",
  render,
  ...props
}: BubbleReactionsProps) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(bubbleReactionsVariants({ side, align }), className),
      },
      props,
      dataAttributes("bubble-reactions", {
        "data-side": side,
        "data-align": align,
      })
    ),
  })
}

export {
  Bubble,
  BubbleAlignContext,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
  bubbleReactionsVariants,
  bubbleVariants,
}
export type {
  BubbleAlign,
  BubbleGroupProps,
  BubbleProps,
  BubbleReactionsProps,
  BubbleShape,
  BubbleVariant,
}
