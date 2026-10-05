"use client"

import * as React from "react"
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cn } from "cn"

type SeparatorAlign = "start" | "center" | "end"

type SeparatorOrientation = NonNullable<SeparatorPrimitive.Props["orientation"]>

type SeparatorProps = SeparatorPrimitive.Props & {
  decorative?: boolean
  align?: SeparatorAlign
}

const lineClassName: Record<SeparatorOrientation, string> = {
  horizontal:
    "h-(--hairline) w-full shrink-0 bg-border forced-colors:bg-canvas-text",
  vertical:
    "w-(--hairline) shrink-0 self-stretch bg-border forced-colors:bg-canvas-text",
}

const labelledClassName: Record<SeparatorOrientation, string> = {
  horizontal:
    "flex w-full shrink-0 items-center gap-3 text-xs text-muted-foreground before:h-(--hairline) before:min-w-4 before:flex-1 before:bg-border after:h-(--hairline) after:min-w-4 after:flex-1 after:bg-border data-[align=end]:after:hidden data-[align=start]:before:hidden",
  vertical:
    "flex shrink-0 flex-col items-center gap-3 self-stretch text-xs text-muted-foreground before:min-h-4 before:w-(--hairline) before:flex-1 before:bg-border after:min-h-4 after:w-(--hairline) after:flex-1 after:bg-border data-[align=end]:after:hidden data-[align=start]:before:hidden",
}

const labelAlignClassName: Record<SeparatorAlign, string> = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
}

function mergeClassName<State>(
  base: string,
  className: string | ((state: State) => string | undefined) | undefined
) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

function hasContent(children: React.ReactNode) {
  return React.Children.toArray(children).some(
    (child) => typeof child !== "string" || child.trim() !== ""
  )
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = false,
  align = "center",
  children,
  ...props
}: SeparatorProps) {
  const labelled = hasContent(children)
  const semantics = labelled
    ? { role: undefined, "aria-orientation": undefined }
    : decorative
      ? { role: "none", "aria-orientation": undefined }
      : {}

  return (
    <SeparatorPrimitive
      data-slot="separator"
      data-content={labelled ? "" : undefined}
      data-align={labelled ? align : undefined}
      orientation={orientation}
      className={mergeClassName(
        (labelled ? labelledClassName : lineClassName)[
          orientation === "vertical" ? "vertical" : "horizontal"
        ],
        className
      )}
      {...semantics}
      {...props}
    >
      {labelled ? (
        <span
          data-slot="separator-label"
          className={cn(
            "flex max-w-full min-w-0 items-center gap-1.5 text-pretty wrap-anywhere [&>svg]:size-3.5 [&>svg]:shrink-0",
            labelAlignClassName[align]
          )}
        >
          {children}
        </span>
      ) : null}
    </SeparatorPrimitive>
  )
}

export { Separator }
export type { SeparatorAlign, SeparatorProps }
