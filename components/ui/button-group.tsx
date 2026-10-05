"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Separator, type SeparatorProps } from "@/components/ui/separator"

const buttonGroupVariants = cva(
  "group/button-group flex w-fit max-w-full min-w-0 items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*:focus-within]:relative [&>*:focus-within]:z-10 [&>[aria-invalid=true]:not(:focus-within)]:relative [&>[aria-invalid=true]:not(:focus-within)]:z-1 [&>[data-slot=button]:active]:translate-none! [&>[data-slot=button]:active]:scale-none! [&>[data-slot=input]]:min-w-0 [&>[data-slot=input]]:flex-1 [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:min-w-0 [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "flex-row [&:not(:has(>[data-slot=button-group]))>:not([data-slot=button-status],[data-base-ui-focus-guard],span[aria-owns],input[aria-hidden=true],select[aria-hidden=true]):has(~:not([data-slot=button-status],[data-base-ui-focus-guard],span[aria-owns],input[aria-hidden=true],select[aria-hidden=true]))]:rounded-e-none [&:not(:has(>[data-slot=button-group]))>:not([data-slot=button-status],[data-base-ui-focus-guard],span[aria-owns],input[aria-hidden=true],select[aria-hidden=true])~:not([data-slot=button-status],[data-base-ui-focus-guard],span[aria-owns],input[aria-hidden=true],select[aria-hidden=true])]:-ms-(--hairline) [&:not(:has(>[data-slot=button-group]))>:not([data-slot=button-status],[data-base-ui-focus-guard],span[aria-owns],input[aria-hidden=true],select[aria-hidden=true])~:not([data-slot=button-status],[data-base-ui-focus-guard],span[aria-owns],input[aria-hidden=true],select[aria-hidden=true])]:rounded-s-none",
        vertical:
          "flex-col [&:not(:has(>[data-slot=button-group]))>:not([data-slot=button-status],[data-base-ui-focus-guard],span[aria-owns],input[aria-hidden=true],select[aria-hidden=true]):has(~:not([data-slot=button-status],[data-base-ui-focus-guard],span[aria-owns],input[aria-hidden=true],select[aria-hidden=true]))]:rounded-b-none [&:not(:has(>[data-slot=button-group]))>:not([data-slot=button-status],[data-base-ui-focus-guard],span[aria-owns],input[aria-hidden=true],select[aria-hidden=true])~:not([data-slot=button-status],[data-base-ui-focus-guard],span[aria-owns],input[aria-hidden=true],select[aria-hidden=true])]:-mt-(--hairline) [&:not(:has(>[data-slot=button-group]))>:not([data-slot=button-status],[data-base-ui-focus-guard],span[aria-owns],input[aria-hidden=true],select[aria-hidden=true])~:not([data-slot=button-status],[data-base-ui-focus-guard],span[aria-owns],input[aria-hidden=true],select[aria-hidden=true])]:rounded-t-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

type ButtonGroupOrientation = NonNullable<
  VariantProps<typeof buttonGroupVariants>["orientation"]
>

type ButtonGroupProps = useRender.ComponentProps<"div"> & {
  orientation?: ButtonGroupOrientation
}

const ButtonGroupContext =
  React.createContext<ButtonGroupOrientation>("horizontal")

function dataAttributes(slot: string, extra?: Record<string, string>) {
  return { "data-slot": slot, ...extra } as Record<string, string>
}

function ButtonGroup({
  className,
  orientation = "horizontal",
  render,
  ...props
}: ButtonGroupProps) {
  const element = useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        role: "group",
        className: cn(buttonGroupVariants({ orientation }), className),
      },
      props,
      dataAttributes("button-group", { "data-orientation": orientation })
    ),
  })

  return (
    <ButtonGroupContext.Provider value={orientation}>
      {element}
    </ButtonGroupContext.Provider>
  )
}

function ButtonGroupText({
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
          "flex max-w-full min-w-0 shrink-0 items-center gap-2 rounded-md bg-muted px-2.5 text-sm font-medium whitespace-nowrap inset-ring-(length:--hairline) inset-ring-border dark:inset-ring-input forced-colors:border [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
          className
        ),
      },
      props,
      dataAttributes("button-group-text")
    ),
  })
}

type ButtonGroupSeparatorProps = Omit<SeparatorProps, "align" | "children">

function mergeClassName<State>(
  base: string,
  className: string | ((state: State) => string | undefined) | undefined
) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

function ButtonGroupSeparator({
  className,
  orientation,
  ...props
}: ButtonGroupSeparatorProps) {
  const groupOrientation = React.useContext(ButtonGroupContext)
  const resolvedOrientation =
    orientation ??
    (groupOrientation === "horizontal" ? "vertical" : "horizontal")

  return (
    <Separator
      data-slot="button-group-separator"
      orientation={resolvedOrientation}
      className={mergeClassName(
        resolvedOrientation === "horizontal"
          ? "relative z-1 mx-px w-auto self-stretch bg-input"
          : "relative z-1 my-px bg-input",
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
export type {
  ButtonGroupOrientation,
  ButtonGroupProps,
  ButtonGroupSeparatorProps,
}
