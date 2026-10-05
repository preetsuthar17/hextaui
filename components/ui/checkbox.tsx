"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group"
import { IconCheck, IconMinus } from "@tabler/icons-react"
import { cn } from "cn"

function mergeClassName<State>(
  base: string,
  className: string | ((state: State) => string | undefined) | undefined
) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

const checkboxClassName =
  "peer relative inline-flex size-4 shrink-0 items-center justify-center rounded-[calc(var(--radius-sm)*0.5)] inset-ring-(length:--hairline) forced-colors:border inset-ring-muted-foreground/80 bg-background text-primary-foreground transition-[background-color,border-color,box-shadow,scale] duration-150 ease-out-quint outline-none focus-visible:outline-hidden select-none after:absolute after:-inset-2.5 pointer-coarse:after:-inset-3.5 hover:inset-ring-foreground/70 [@media(hover:hover)]:in-[label:hover]:inset-ring-foreground/70 focus-visible:inset-ring-ring focus-visible:ring-3 focus-visible:ring-focus-ring motion-safe:active:scale-95 motion-safe:in-[label:active]:scale-95 data-checked:inset-ring-primary data-checked:bg-primary data-indeterminate:inset-ring-primary data-indeterminate:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:inset-ring-muted-foreground/80 data-disabled:[@media(hover:hover)]:in-[label:hover]:inset-ring-muted-foreground/80 motion-safe:data-disabled:active:scale-100 motion-safe:data-disabled:in-[label:active]:scale-100 data-readonly:cursor-default motion-safe:data-readonly:active:scale-100 motion-safe:data-readonly:in-[label:active]:scale-100 aria-invalid:inset-ring-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-invalid:inset-ring-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:inset-ring-destructive/50 dark:aria-invalid:ring-destructive/40 dark:data-invalid:inset-ring-destructive/50 dark:data-invalid:ring-destructive/40 data-checked:data-invalid:inset-ring-primary data-checked:aria-invalid:inset-ring-primary dark:data-checked:bg-primary dark:data-indeterminate:bg-primary"

function CheckboxMark({ indeterminate }: { indeterminate: boolean }) {
  const markRef = React.useRef<SVGSVGElement>(null)

  React.useLayoutEffect(() => {
    const mark = markRef.current
    const root = mark?.closest("[data-slot=checkbox]")

    if (mark && root?.hasAttribute("data-mounted")) {
      mark.setAttribute("data-draw", "")
    }
  }, [])

  const Icon = indeterminate ? IconMinus : IconCheck

  return (
    <Icon
      ref={markRef}
      aria-hidden
      stroke={2.75}
      className={cn(
        "pointer-events-none size-3.5 motion-safe:data-draw:animate-checkbox-draw",
        indeterminate
          ? "motion-safe:data-draw:[stroke-dasharray:15] motion-safe:data-draw:[stroke-dashoffset:15]"
          : "motion-safe:data-draw:[stroke-dasharray:22] motion-safe:data-draw:[stroke-dashoffset:22]"
      )}
    />
  )
}

function Checkbox({
  className,
  children,
  ref,
  ...props
}: CheckboxPrimitive.Root.Props) {
  const rootRef = React.useRef<HTMLElement | null>(null)

  const setRoot = React.useCallback(
    (node: HTMLElement | null) => {
      rootRef.current = node
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    },
    [ref]
  )

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      rootRef.current?.setAttribute("data-mounted", "")
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <CheckboxPrimitive.Root
      ref={setRoot}
      className={mergeClassName(checkboxClassName, className)}
      {...props}
      data-slot="checkbox"
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-[opacity,scale] duration-100 ease-out-quint data-ending-style:opacity-0 motion-safe:data-ending-style:scale-75"
        render={(indicatorProps, state) => (
          <span {...indicatorProps}>
            <CheckboxMark
              key={state.indeterminate ? "indeterminate" : "checked"}
              indeterminate={state.indeterminate}
            />
          </span>
        )}
      />
      {children}
    </CheckboxPrimitive.Root>
  )
}

function CheckboxGroup({ className, ...props }: CheckboxGroupPrimitive.Props) {
  return (
    <CheckboxGroupPrimitive
      className={mergeClassName("flex flex-col gap-3", className)}
      {...props}
      data-slot="checkbox-group"
    />
  )
}

export { Checkbox, CheckboxGroup }
