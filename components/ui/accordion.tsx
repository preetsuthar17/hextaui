"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { IconChevronDown } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const accordionVariants = cva("flex w-full flex-col", {
  variants: {
    variant: {
      default: "",
      outline:
        "overflow-hidden rounded-lg ring-(length:--hairline) ring-border forced-colors:border [&>[data-slot=accordion-item]:first-child>[data-slot=accordion-header]>[data-slot=accordion-trigger]]:rounded-t-lg [&>[data-slot=accordion-item]:last-child:not([data-open])>[data-slot=accordion-header]>[data-slot=accordion-trigger]]:rounded-b-lg",
      separated: "gap-2",
      ghost: "gap-1",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

type AccordionVariant = NonNullable<
  VariantProps<typeof accordionVariants>["variant"]
>

const AccordionContext = React.createContext<AccordionVariant>("default")

const accordionItemVariants = cva("", {
  variants: {
    variant: {
      default:
        "relative after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:shadow-[inset_0_calc(-1*var(--hairline))_0_var(--color-border)] last:after:hidden",
      outline:
        "relative after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:shadow-[inset_0_calc(-1*var(--hairline))_0_var(--color-border)] last:after:hidden",
      separated:
        "rounded-lg inset-ring-(length:--hairline) inset-ring-border transition-[background-color,box-shadow] duration-150 has-[>[data-slot=accordion-header]>[data-slot=accordion-trigger]:focus-visible]:ring-3 has-[>[data-slot=accordion-header]>[data-slot=accordion-trigger]:focus-visible]:ring-focus-ring has-[>[data-slot=accordion-header]>[data-slot=accordion-trigger]:focus-visible]:inset-ring-ring forced-colors:border data-open:bg-muted/40 [@media(hover:hover)]:has-[>[data-slot=accordion-header]>[data-slot=accordion-trigger]:not([data-disabled]):hover]:bg-muted/40",
      ghost: "rounded-md data-open:bg-muted/50",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const accordionTriggerVariants = cva(
  "group/accordion-trigger relative flex flex-1 items-start gap-4 text-start text-sm font-medium transition-[color,background-color,box-shadow] duration-150 outline-none select-none [-webkit-tap-highlight-color:transparent] focus-visible:z-10 focus-visible:outline-hidden data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "-mx-2 rounded-md px-2 py-4 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:outline-solid",
        outline:
          "px-4 py-4 hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-ring focus-visible:outline-solid focus-visible:ring-inset",
        separated: "rounded-lg px-4 py-4",
        ghost:
          "rounded-md px-3 py-3 transition-[color,box-shadow] hover:bg-muted focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:outline-solid",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const accordionContentVariants = cva(
  "text-sm wrap-anywhere text-muted-foreground [&_a:not([data-slot])]:text-foreground [&_a:not([data-slot])]:underline [&_a:not([data-slot])]:underline-offset-3 [&_a:not([data-slot])]:hover:text-foreground/80 [&>p:not(:last-child)]:mb-3",
  {
    variants: {
      variant: {
        default: "pe-8 pb-4",
        outline: "px-4 pb-4",
        separated: "px-4 pb-4",
        ghost: "px-3 pb-3",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

const navigationKeys = ["ArrowDown", "ArrowUp", "Home", "End"]

function focusAdjacentTrigger(event: React.KeyboardEvent<HTMLDivElement>) {
  const root = event.currentTarget
  const current = event.target as HTMLElement

  if (
    !navigationKeys.includes(event.key) ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    current.dataset.slot !== "accordion-trigger" ||
    current.closest('[data-slot="accordion"]') !== root
  ) {
    return
  }

  const triggers = Array.from(
    root.querySelectorAll<HTMLElement>('[data-slot="accordion-trigger"]')
  ).filter(
    (trigger) =>
      trigger.closest('[data-slot="accordion"]') === root &&
      !trigger.hasAttribute("data-disabled")
  )
  const index = triggers.indexOf(current)
  const last = triggers.length - 1
  const nextIndex = {
    ArrowDown: index === last ? 0 : index + 1,
    ArrowUp: index <= 0 ? last : index - 1,
    Home: 0,
    End: last,
  }[event.key]

  if (nextIndex === undefined || !triggers[nextIndex]) {
    return
  }

  event.preventDefault()
  triggers[nextIndex].focus()
}

type AccordionProps<Value> = AccordionPrimitive.Root.Props<Value> & {
  variant?: AccordionVariant
  hiddenUntilFound?: boolean
}

function Accordion<Value = unknown>({
  className,
  variant = "default",
  hiddenUntilFound = true,
  onKeyDown,
  ...props
}: AccordionProps<Value>) {
  const resolvedVariant = variant ?? "default"

  return (
    <AccordionContext.Provider value={resolvedVariant}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        data-variant={resolvedVariant}
        hiddenUntilFound={hiddenUntilFound}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (!event.defaultPrevented) {
            focusAdjacentTrigger(event)
          }
        }}
        className={mergeClassName(
          accordionVariants({ variant: resolvedVariant }),
          className
        )}
        {...props}
      />
    </AccordionContext.Provider>
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  const variant = React.useContext(AccordionContext)

  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={mergeClassName(accordionItemVariants({ variant }), className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  icon,
  ...props
}: AccordionPrimitive.Trigger.Props & {
  icon?: React.ReactNode
}) {
  const variant = React.useContext(AccordionContext)

  return (
    <AccordionPrimitive.Header data-slot="accordion-header" className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={mergeClassName(
          accordionTriggerVariants({ variant }),
          className
        )}
        {...props}
      >
        <span
          data-slot="accordion-trigger-label"
          className={cn(
            "min-w-0 flex-1 text-pretty wrap-anywhere [&>svg]:me-2 [&>svg]:inline-block [&>svg]:align-[-0.1875em] [&>svg]:text-muted-foreground [&>svg:not([class*='size-'])]:size-4",
            variant === "default" &&
              "underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-150 group-hover/accordion-trigger:decoration-current"
          )}
        >
          {children}
        </span>
        {icon === null ? null : (
          <span
            data-slot="accordion-trigger-icon"
            aria-hidden="true"
            className="ms-auto mt-0.5 flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-[color,translate] duration-150 group-hover/accordion-trigger:text-foreground group-active/accordion-trigger:translate-y-px group-data-panel-open/accordion-trigger:text-foreground motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
          >
            {icon ?? (
              <IconChevronDown className="transition-[rotate] duration-200 ease-spring group-data-panel-open/accordion-trigger:rotate-180 motion-reduce:transition-none" />
            )}
          </span>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function useSettledPanel(panelRef: React.RefObject<HTMLDivElement | null>) {
  React.useLayoutEffect(() => {
    const panel = panelRef.current
    if (!panel) {
      return
    }

    const sync = () => {
      const open =
        panel.hasAttribute("data-open") &&
        !panel.hasAttribute("data-starting-style") &&
        !panel.hasAttribute("data-ending-style")
      const animating =
        typeof panel.getAnimations === "function" &&
        panel
          .getAnimations()
          .some(
            (animation) =>
              "transitionProperty" in animation &&
              animation.transitionProperty === "height"
          )
      panel.toggleAttribute("data-settled", open && !animating)
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(panel, {
      attributes: true,
      attributeFilter: [
        "data-open",
        "data-starting-style",
        "data-ending-style",
        "style",
      ],
    })
    panel.addEventListener("transitionend", sync)
    panel.addEventListener("transitioncancel", sync)

    return () => {
      observer.disconnect()
      panel.removeEventListener("transitionend", sync)
      panel.removeEventListener("transitioncancel", sync)
      panel.removeAttribute("data-settled")
    }
  }, [panelRef])
}

function AccordionContent({
  className,
  children,
  ref,
  ...props
}: Omit<AccordionPrimitive.Panel.Props, "className"> & {
  className?: string
}) {
  const variant = React.useContext(AccordionContext)
  const panelRef = React.useRef<HTMLDivElement>(null)
  const setPanelRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    },
    [ref]
  )
  useSettledPanel(panelRef)

  return (
    <AccordionPrimitive.Panel
      ref={setPanelRef}
      data-slot="accordion-content"
      className="group/accordion-content h-(--accordion-panel-height) overflow-hidden transition-[height] duration-300 ease-spring data-ending-style:h-0 data-ending-style:duration-150 data-settled:overflow-visible data-starting-style:h-0 motion-reduce:transition-none"
      {...props}
    >
      <div
        data-slot="accordion-content-inner"
        className={cn(
          accordionContentVariants({ variant }),
          "transition-[opacity,translate] duration-200 ease-out-quint group-data-ending-style/accordion-content:-translate-y-1 group-data-ending-style/accordion-content:opacity-0 group-data-ending-style/accordion-content:duration-150 group-data-starting-style/accordion-content:-translate-y-1 group-data-starting-style/accordion-content:opacity-0 motion-reduce:transition-none",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionVariants,
}
