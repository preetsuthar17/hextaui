"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cn } from "cn"

type LabelIndicator = "required" | "optional"

type ControlState = {
  disabled: boolean
  required: boolean
  invalid: boolean
  readOnly: boolean
}

const idleState: ControlState = {
  disabled: false,
  required: false,
  invalid: false,
  readOnly: false,
}

const controlSelector =
  'input:not([type="hidden"]), textarea, select, button, meter, output, progress, [role="checkbox"], [role="switch"], [role="radio"], [role="combobox"], [role="slider"]'

function findControl(label: HTMLLabelElement) {
  if (label.htmlFor) {
    return document.getElementById(label.htmlFor)
  }
  return label.querySelector<HTMLElement>(controlSelector)
}

function readState(control: HTMLElement | null): ControlState {
  if (!control) {
    return idleState
  }
  return {
    disabled:
      control.matches(":disabled") ||
      control.hasAttribute("data-disabled") ||
      control.getAttribute("aria-disabled") === "true",
    required:
      control.matches(":required") ||
      control.getAttribute("aria-required") === "true" ||
      control.hasAttribute("data-required"),
    invalid:
      control.getAttribute("aria-invalid") === "true" ||
      control.hasAttribute("data-invalid") ||
      control.matches(":user-invalid"),
    readOnly:
      control.matches(":read-only:is(input, textarea)") ||
      control.getAttribute("aria-readonly") === "true" ||
      control.hasAttribute("data-readonly"),
  }
}

function sameState(a: ControlState, b: ControlState) {
  return (
    a.disabled === b.disabled &&
    a.required === b.required &&
    a.invalid === b.invalid &&
    a.readOnly === b.readOnly
  )
}

function useControlState(
  labelRef: React.RefObject<HTMLLabelElement | null>,
  htmlFor: string | undefined
) {
  const [state, setState] = React.useState(idleState)

  React.useEffect(() => {
    const label = labelRef.current
    if (!label) {
      return
    }

    let control: HTMLElement | null = null
    let frame = 0
    const attributes = new MutationObserver(() => sync())
    const children = new MutationObserver(() => connect())

    const sync = () => {
      const next = readState(control)
      setState((previous) => (sameState(previous, next) ? previous : next))
    }

    const connect = () => {
      const found = findControl(label)
      if (found === control) {
        return
      }
      control = found
      attributes.disconnect()
      if (control) {
        attributes.observe(control, {
          attributes: true,
          attributeFilter: [
            "disabled",
            "required",
            "readonly",
            "aria-disabled",
            "aria-required",
            "aria-invalid",
            "aria-readonly",
            "data-disabled",
            "data-required",
            "data-invalid",
            "data-readonly",
          ],
        })
      }
      sync()
    }

    const onFieldEvent = (event: Event) => {
      if (control && event.target === control) {
        sync()
      }
    }

    connect()
    if (!control) {
      frame = requestAnimationFrame(connect)
    }
    if (!htmlFor) {
      children.observe(label, { childList: true, subtree: true })
    }
    window.addEventListener("input", onFieldEvent)
    window.addEventListener("change", onFieldEvent)
    window.addEventListener("focusout", onFieldEvent)
    window.addEventListener("invalid", onFieldEvent, true)

    return () => {
      cancelAnimationFrame(frame)
      attributes.disconnect()
      children.disconnect()
      window.removeEventListener("input", onFieldEvent)
      window.removeEventListener("change", onFieldEvent)
      window.removeEventListener("focusout", onFieldEvent)
      window.removeEventListener("invalid", onFieldEvent, true)
    }
  }, [labelRef, htmlFor])

  return state
}

type LabelProps = useRender.ComponentProps<"label"> & {
  indicator?: LabelIndicator
  optionalText?: React.ReactNode
}

function Label({
  className,
  indicator,
  optionalText = "Optional",
  render,
  children,
  htmlFor,
  onMouseDown,
  ref,
  ...props
}: LabelProps) {
  const labelRef = React.useRef<HTMLLabelElement | null>(null)
  const state = useControlState(labelRef, htmlFor)
  const setRef = React.useCallback(
    (node: HTMLLabelElement | null) => {
      labelRef.current = node
      if (typeof ref === "function") {
        return ref(node)
      }
      if (ref) {
        ref.current = node
      }
      return undefined
    },
    [ref]
  )

  const mark =
    indicator === "required" && state.required ? (
      <span
        aria-hidden="true"
        data-slot="label-indicator"
        data-indicator="required"
        className="-ms-1.5 shrink-0 self-start font-normal whitespace-nowrap text-muted-foreground"
      >
        *
      </span>
    ) : indicator === "optional" && !state.required ? (
      <span
        aria-hidden="true"
        data-slot="label-indicator"
        data-indicator="optional"
        className="shrink-0 self-start font-normal whitespace-nowrap text-muted-foreground"
      >
        {optionalText}
      </span>
    ) : null

  return useRender({
    defaultTagName: "label",
    render,
    ref: setRef,
    props: mergeProps<"label">(
      {
        htmlFor,
        className: cn(
          "inline-flex w-fit max-w-full min-w-0 items-center gap-2 text-sm leading-snug font-medium text-pretty wrap-anywhere text-foreground select-none data-disabled:cursor-not-allowed data-disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground",
          className
        ),
        onMouseDown: (event) => {
          onMouseDown?.(event)
          const target = event.target as Element
          if (
            !event.defaultPrevented &&
            event.detail > 1 &&
            !target.closest(controlSelector)
          ) {
            event.preventDefault()
          }
        },
        children: (
          <>
            {children}
            {mark}
          </>
        ),
      },
      props,
      {
        "data-slot": "label",
        ...(state.disabled ? { "data-disabled": "" } : {}),
        ...(state.required ? { "data-required": "" } : {}),
        ...(state.invalid ? { "data-invalid": "" } : {}),
        ...(state.readOnly ? { "data-readonly": "" } : {}),
      } as React.ComponentProps<"label">
    ),
  })
}

export { Label }
export type { LabelIndicator, LabelProps }
