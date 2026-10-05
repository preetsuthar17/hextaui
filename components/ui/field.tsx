"use client"

import * as React from "react"
import { Field as FieldPrimitive } from "@base-ui/react/field"
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { IconAlertCircle, IconCheck } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { useSizeMorph } from "@/lib/motion"

import { useComposedRef } from "@/hooks/use-composed-ref"
import { useMergedRef } from "@/hooks/use-merged-ref"
import {
  InputCount,
  type InputControl,
  type InputCountProps,
} from "@/components/ui/input"
import { Separator, type SeparatorProps } from "@/components/ui/separator"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

const FieldContext = React.createContext(false)

type FieldIndicator = "required" | "optional"

const FieldIndicatorContext = React.createContext<FieldIndicator | null>(null)

function IndicatorScope({
  indicator,
  children,
}: {
  indicator: FieldIndicator | null | undefined
  children: React.ReactNode
}) {
  if (indicator === undefined) {
    return children
  }
  return (
    <FieldIndicatorContext.Provider value={indicator}>
      {children}
    </FieldIndicatorContext.Provider>
  )
}

type FieldSetProps = FieldsetPrimitive.Root.Props & {
  indicator?: FieldIndicator | null
}

function FieldSet({ className, indicator, ...props }: FieldSetProps) {
  return (
    <IndicatorScope indicator={indicator}>
      <FieldSetRoot className={className} {...props} />
    </IndicatorScope>
  )
}

function FieldSetRoot({ className, ...props }: FieldsetPrimitive.Root.Props) {
  return (
    <FieldsetPrimitive.Root
      data-slot="field-set"
      className={mergeClassName(
        "flex min-w-0 flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3 data-[slot=checkbox-group]:gap-3 data-[slot=radio-group]:gap-3",
        className
      )}
      {...props}
    />
  )
}

type FieldLegendProps = FieldsetPrimitive.Legend.Props & {
  variant?: "legend" | "label"
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: FieldLegendProps) {
  return (
    <FieldsetPrimitive.Legend
      data-slot="field-legend"
      data-variant={variant}
      className={mergeClassName(
        "mb-3 font-medium text-pretty wrap-anywhere text-foreground data-[variant=label]:text-sm data-[variant=legend]:text-base data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

type FieldGroupProps = useRender.ComponentProps<"div"> & {
  indicator?: FieldIndicator | null
}

function FieldGroup({ indicator, ...props }: FieldGroupProps) {
  return (
    <IndicatorScope indicator={indicator}>
      <FieldGroupRoot {...props} />
    </IndicatorScope>
  )
}

function FieldGroupRoot({
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
          "group/field-group @container/field-group flex w-full min-w-0 flex-col gap-7 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
          className
        ),
      },
      props,
      { "data-slot": "field-group" } as React.ComponentProps<"div">
    ),
  })
}

const fieldVariants = cva(
  "group/field flex w-full min-w-0 gap-3 [--field-gap:calc(var(--spacing)*3)]",
  {
    variants: {
      orientation: {
        vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
        horizontal:
          "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[data-slot=checkbox],[role=checkbox],[role=radio]]:mt-px",
        responsive:
          "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[data-slot=checkbox],[role=checkbox],[role=radio]]:mt-px",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

type FieldOrientation = NonNullable<
  VariantProps<typeof fieldVariants>["orientation"]
>

type FieldProps = FieldPrimitive.Root.Props & {
  orientation?: FieldOrientation | null
  indicator?: FieldIndicator | null
}

function Field({
  className,
  orientation = "vertical",
  indicator,
  ...props
}: FieldProps) {
  const resolvedOrientation = orientation ?? "vertical"

  return (
    <IndicatorScope indicator={indicator}>
      <FieldContext.Provider value>
        <FieldPrimitive.Root
          data-slot="field"
          data-orientation={resolvedOrientation}
          className={mergeClassName(
            fieldVariants({ orientation: resolvedOrientation }),
            className
          )}
          {...props}
        />
      </FieldContext.Provider>
    </IndicatorScope>
  )
}

function FieldItem({ className, ...props }: FieldPrimitive.Item.Props) {
  return (
    <FieldPrimitive.Item
      data-slot="field-item"
      className={mergeClassName(
        "flex min-w-0 items-start gap-3 has-[>[data-slot=field-content]]:[&>[data-slot=checkbox],[role=checkbox],[role=radio]]:mt-px",
        className
      )}
      {...props}
    />
  )
}

function FieldContent({
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
          "group/field-content flex min-w-0 flex-1 flex-col gap-1 leading-snug [--field-gap:calc(var(--spacing)*1)]",
          className
        ),
      },
      props,
      { "data-slot": "field-content" } as React.ComponentProps<"div">
    ),
  })
}

const fieldLabelClassName =
  "group/field-label peer/field-label flex w-fit min-w-0 items-center gap-2 text-sm leading-snug font-medium text-pretty wrap-anywhere text-foreground select-none group-data-disabled/field:cursor-not-allowed group-data-disabled/field:opacity-50 has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:items-stretch has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:inset-ring-(length:--hairline) has-[>[data-slot=field]]:inset-ring-border has-[>[data-slot=field]]:transition-[background-color,box-shadow] has-[>[data-slot=field]]:duration-150 has-[>[data-slot=field]]:ease-out-cubic has-[>[data-slot=field]]:has-focus-visible:ring-3 has-[>[data-slot=field]]:has-focus-visible:ring-focus-ring has-[>[data-slot=field]]:has-focus-visible:inset-ring-ring has-[>[data-slot=field]]:has-data-checked:bg-muted/60 has-[>[data-slot=field]]:has-data-checked:inset-ring-foreground/25 has-[>[data-slot=field]]:has-[[data-disabled]]:cursor-not-allowed has-[>[data-slot=field]]:has-[[data-disabled]]:opacity-50 *:data-[slot=field]:p-3 has-[>[data-slot=field]]:motion-reduce:transition-none data-disabled:cursor-not-allowed data-disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground [@media(hover:hover)]:has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-muted/50"

function StandaloneFieldLabel({
  className,
  render,
  nativeLabel: _nativeLabel,
  ...props
}: FieldPrimitive.Label.Props) {
  const resolved = mergeClassName(fieldLabelClassName, className)

  return useRender({
    defaultTagName: "label",
    render: render as useRender.ComponentProps<"label">["render"],
    props: mergeProps<"label">(
      {
        className:
          typeof resolved === "function"
            ? resolved({} as FieldPrimitive.Label.State)
            : resolved,
      },
      props as React.ComponentProps<"label">,
      { "data-slot": "field-label" } as React.ComponentProps<"label">
    ),
  })
}

function FieldIndicatorMark({
  indicator,
  optionalText,
}: {
  indicator: FieldIndicator
  optionalText: React.ReactNode
}) {
  return (
    <span
      aria-hidden="true"
      data-slot="field-indicator"
      data-indicator={indicator}
      className={cn(
        "shrink-0 self-start font-normal whitespace-nowrap text-muted-foreground group-has-[>[data-slot=field]]/field-label:hidden",
        indicator === "required"
          ? "-ms-1.5 hidden group-has-[:required,[aria-required=true]]/field:inline"
          : "group-has-[:required,[aria-required=true]]/field:hidden"
      )}
    >
      {indicator === "required" ? "*" : optionalText}
    </span>
  )
}

type FieldLabelProps = FieldPrimitive.Label.Props & {
  optionalText?: React.ReactNode
}

function FieldLabel({
  className,
  children,
  optionalText = "Optional",
  ...props
}: FieldLabelProps) {
  const inField = React.useContext(FieldContext)
  const indicator = React.useContext(FieldIndicatorContext)

  if (!inField) {
    return (
      <StandaloneFieldLabel className={className} {...props}>
        {children}
      </StandaloneFieldLabel>
    )
  }

  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={mergeClassName(fieldLabelClassName, className)}
      {...props}
    >
      {children}
      {indicator && (
        <FieldIndicatorMark indicator={indicator} optionalText={optionalText} />
      )}
    </FieldPrimitive.Label>
  )
}

function FieldStatus({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-slot="field-status"
      className={cn(
        "inline-grid size-4 shrink-0 place-items-center *:col-start-1 *:row-start-1 *:size-4",
        className
      )}
      {...props}
    >
      <IconCheck className="hidden text-success group-data-dirty/field:group-data-valid/field:block motion-safe:animate-checkbox-draw motion-safe:[stroke-dasharray:22] motion-safe:[stroke-dashoffset:22]" />
      <IconAlertCircle className="hidden text-destructive group-data-invalid/field:block motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-50" />
    </span>
  )
}

const counterControl =
  "textarea, input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=file])"

type FieldCounterProps = Omit<
  InputCountProps,
  "length" | "maxLength" | "controlRef"
>

function FieldCounter({ ref, ...props }: FieldCounterProps) {
  const [counterRef, setRef] = useComposedRef<HTMLSpanElement>(ref)
  const controlRef = React.useRef<InputControl | null>(null)
  const [count, setCount] = React.useState({
    length: 0,
    maxLength: null as number | null,
  })

  React.useEffect(() => {
    const field = counterRef.current?.closest("[data-slot=field]")
    const control = field?.querySelector<InputControl>(counterControl)
    if (!control) {
      return
    }
    controlRef.current = control
    let timer: ReturnType<typeof setTimeout> | undefined

    const sync = () => {
      const length = control.value.length
      const maxLength = control.maxLength > 0 ? control.maxLength : null
      setCount((previous) =>
        previous.length === length && previous.maxLength === maxLength
          ? previous
          : { length, maxLength }
      )
    }
    const onReset = () => {
      clearTimeout(timer)
      timer = setTimeout(sync)
    }

    const onInput = (event: Event) => {
      if (event.target === control) {
        sync()
      }
    }

    sync()
    window.addEventListener("input", onInput)
    control.form?.addEventListener("reset", onReset)
    return () => {
      window.removeEventListener("input", onInput)
      control.form?.removeEventListener("reset", onReset)
      clearTimeout(timer)
      controlRef.current = null
    }
  }, [counterRef])

  return (
    <InputCount
      ref={setRef}
      data-slot="field-counter"
      length={count.length}
      maxLength={count.maxLength}
      controlRef={controlRef}
      {...props}
    />
  )
}

function FieldTitle({
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
          "flex w-fit min-w-0 items-center gap-2 text-sm leading-snug font-medium text-pretty wrap-anywhere text-foreground group-data-disabled/field:opacity-50",
          className
        ),
      },
      props,
      { "data-slot": "field-title" } as React.ComponentProps<"div">
    ),
  })
}

const fieldDescriptionClassName =
  "min-w-0 text-start text-sm leading-normal font-normal text-pretty wrap-anywhere text-muted-foreground group-data-[orientation=horizontal]/field:text-balance group-data-disabled/field:opacity-50 [&_a:not([data-slot])]:text-foreground [&_a:not([data-slot])]:underline [&_a:not([data-slot])]:decoration-foreground/40 [&_a:not([data-slot])]:underline-offset-4 [&_a:not([data-slot])]:hover:decoration-foreground [[data-variant=legend]+&]:-mt-1.5"

function FieldDescription({
  className,
  render,
  ...props
}: FieldPrimitive.Description.Props) {
  const inField = React.useContext(FieldContext)
  const resolved = mergeClassName(fieldDescriptionClassName, className)
  const standalone = useRender({
    defaultTagName: "p",
    render: render as useRender.ComponentProps<"p">["render"],
    enabled: !inField,
    props: mergeProps<"p">(
      {
        className:
          typeof resolved === "function"
            ? resolved({} as FieldPrimitive.Description.State)
            : resolved,
      },
      props as React.ComponentProps<"p">,
      { "data-slot": "field-description" } as React.ComponentProps<"p">
    ),
  })

  if (!inField) {
    return standalone
  }

  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={resolved}
      render={render}
      {...props}
    />
  )
}

function hasContent(children: React.ReactNode) {
  return React.Children.toArray(children).some(
    (child) => typeof child !== "string" || child.trim() !== ""
  )
}

function FieldSeparator({ className, children, ...props }: SeparatorProps) {
  return (
    <Separator
      data-slot="field-separator"
      className={mergeClassName(
        hasContent(children) ? "-my-2 min-h-5 text-sm" : "my-0.5",
        className
      )}
      {...props}
    >
      {children}
    </Separator>
  )
}

type FieldErrorMessage = { message?: string } | undefined | null

type FieldErrorProps = Omit<FieldPrimitive.Error.Props, "children"> & {
  children?: React.ReactNode
  errors?: FieldErrorMessage[]
}

function uniqueMessages(errors: FieldErrorMessage[] | undefined) {
  if (!errors) {
    return []
  }
  const messages = errors
    .map((error) => error?.message?.trim())
    .filter((message): message is string => Boolean(message))
  return [...new Set(messages)]
}

function renderMessages(messages: string[]) {
  if (messages.length === 0) {
    return null
  }
  if (messages.length === 1) {
    return messages[0]
  }
  return (
    <ul>
      {messages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  )
}

const fieldErrorClassName =
  "grid min-w-0 grid-rows-[1fr] text-sm leading-normal font-normal text-pretty wrap-anywhere text-destructive transition-[grid-template-rows,opacity,margin-top] duration-200 ease-out-quint data-ending-style:-mt-(--field-gap) data-ending-style:grid-rows-[0fr] data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:-mt-(--field-gap) data-starting-style:grid-rows-[0fr] data-starting-style:opacity-0 motion-reduce:transition-none [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1 [&_ul]:ps-4"

function FieldError({
  className,
  children,
  errors,
  match,
  render,
  ref,
  ...props
}: FieldErrorProps) {
  const external = errors !== undefined
  const messages = uniqueMessages(errors)
  const messageKey = messages.join("\u0000")
  const [shown, setShown] = React.useState<string[]>(messages)
  const [shownKey, setShownKey] = React.useState(messageKey)

  if (messages.length > 0 && messageKey !== shownKey) {
    setShownKey(messageKey)
    setShown(messages)
  }

  const content = children ?? (external ? renderMessages(shown) : undefined)
  const morphRef = useSizeMorph<HTMLDivElement>({
    axis: "height",
    duration: 200,
  })
  const errorRef = useMergedRef(ref, morphRef)
  const resolvedMatch = external
    ? messages.length > 0 || (children !== undefined && match === true)
    : match

  return (
    <FieldPrimitive.Error
      ref={errorRef}
      data-slot="field-error"
      match={resolvedMatch}
      className={mergeClassName(fieldErrorClassName, className)}
      render={(errorProps, state) => {
        const inner = (
          <div
            data-slot="field-error-content"
            className="min-h-0 overflow-hidden"
          >
            <div
              key={external ? shownKey : undefined}
              className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-1"
            >
              {errorProps.children}
            </div>
          </div>
        )
        const props = errorProps
        if (typeof render === "function") {
          return render({ ...props, children: inner }, state)
        }
        if (React.isValidElement(render)) {
          return React.cloneElement(render, props, inner)
        }
        return <div {...props}>{inner}</div>
      }}
      {...props}
      {...(content === undefined ? {} : { children: content })}
    />
  )
}

const FieldValidity = FieldPrimitive.Validity

export {
  Field,
  FieldContent,
  FieldCounter,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldItem,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldStatus,
  FieldTitle,
  FieldValidity,
  fieldVariants,
}
export type {
  FieldCounterProps,
  FieldErrorProps,
  FieldGroupProps,
  FieldIndicator,
  FieldLabelProps,
  FieldLegendProps,
  FieldOrientation,
  FieldProps,
  FieldSetProps,
}
