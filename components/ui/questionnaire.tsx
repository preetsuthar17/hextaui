"use client"

import * as React from "react"
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire"
import { IconCheck } from "@tabler/icons-react"
import { type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { inputVariants } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import { NumberFlow } from "@/components/ui/number-flow"
import { easeOut, prefersReducedMotion } from "@/lib/motion"

type QuestionnaireTransition = "slide" | "lift"

const itemSelector = "[data-slot=questionnaire-item]"

function ownItems(form: HTMLFormElement) {
  return Array.from(form.querySelectorAll<HTMLElement>(itemSelector)).filter(
    (item) => item.closest("form") === form
  )
}

function activeItem(form: HTMLFormElement) {
  return ownItems(form).find((item) => item.hasAttribute("data-active")) ?? null
}

const leavingProperties = [
  "display",
  "position",
  "top",
  "left",
  "width",
  "pointer-events",
]

function releaseLeaving(item: HTMLElement) {
  for (const property of leavingProperties) {
    item.style.removeProperty(property)
  }
  item.removeAttribute("aria-hidden")
  item.removeAttribute("data-leaving")
}

function releaseEntering(item: HTMLElement) {
  item.style.removeProperty("overflow")
  item.style.removeProperty("overflow-clip-margin")
}

function useQuestionTransition(
  formRef: React.RefObject<HTMLFormElement | null>,
  transition: QuestionnaireTransition,
  onActivate: (item: HTMLElement) => void
) {
  const onActivateRef = React.useRef(onActivate)

  React.useLayoutEffect(() => {
    onActivateRef.current = onActivate
  })

  React.useLayoutEffect(() => {
    const form = formRef.current
    if (!form || typeof MutationObserver === "undefined") {
      return
    }

    let active = activeItem(form)
    if (active) {
      onActivateRef.current(active)
    }
    const animations = new Set<Animation>()
    const leaving = new Set<HTMLElement>()
    const entering = new Set<HTMLElement>()

    const settle = () => {
      for (const animation of animations) {
        animation.cancel()
      }
      animations.clear()
      leaving.forEach(releaseLeaving)
      leaving.clear()
      entering.forEach(releaseEntering)
      entering.clear()
    }

    const track = (animation: Animation, done: () => void) => {
      animations.add(animation)
      animation.onfinish = () => {
        animations.delete(animation)
        done()
      }
    }

    const update = () => {
      const next = activeItem(form)
      if (next === active) {
        return
      }
      const previous = active
      active = next
      settle()
      if (next) {
        onActivateRef.current(next)
      }
      if (
        !previous ||
        !next ||
        !previous.isConnected ||
        prefersReducedMotion() ||
        typeof next.animate !== "function"
      ) {
        return
      }

      previous.style.setProperty("display", "flex", "important")
      previous.setAttribute("aria-hidden", "true")
      previous.setAttribute("data-leaving", "")
      const from = previous.getBoundingClientRect().height
      previous.style.setProperty("position", "absolute")
      previous.style.setProperty("pointer-events", "none")
      const to = next.getBoundingClientRect().height
      previous.style.setProperty("top", `${next.offsetTop}px`)
      previous.style.setProperty("left", `${next.offsetLeft}px`)
      previous.style.setProperty("width", `${next.offsetWidth}px`)
      leaving.add(previous)

      const forward = Boolean(
        previous.compareDocumentPosition(next) &
        Node.DOCUMENT_POSITION_FOLLOWING
      )
      const rtl = getComputedStyle(form).direction === "rtl"
      const lift = transition === "lift"
      const distance = (lift ? 14 : 28) * (forward ? 1 : -1)
      const offset = (amount: number) =>
        lift
          ? `translate3d(0, ${amount}px, 0)`
          : `translate3d(${rtl ? -amount : amount}px, 0, 0)`

      const exit = previous.animate(
        [
          { opacity: 1, transform: "none", filter: "blur(0px)" },
          {
            opacity: 0,
            transform: offset(-distance),
            filter: lift ? "blur(2px)" : "blur(0px)",
          },
        ],
        {
          duration: 180,
          easing: "cubic-bezier(0.4, 0, 1, 1)",
          fill: "forwards",
        }
      )
      track(exit, () => {
        leaving.delete(previous)
        exit.cancel()
        releaseLeaving(previous)
      })

      const enter = next.animate(
        [
          {
            opacity: 0,
            transform: offset(distance),
            filter: lift ? "blur(2px)" : "blur(0px)",
          },
          { opacity: 1, transform: "none", filter: "blur(0px)" },
        ],
        { duration: 340, delay: 50, easing: easeOut, fill: "backwards" }
      )
      track(enter, () => undefined)

      if (Math.abs(from - to) >= 1) {
        next.style.setProperty("overflow", "clip")
        next.style.setProperty("overflow-clip-margin", "8px")
        entering.add(next)
        const grow = next.animate(
          [{ height: `${from}px` }, { height: `${to}px` }],
          { duration: 340, easing: easeOut }
        )
        track(grow, () => {
          entering.delete(next)
          releaseEntering(next)
        })
      }
    }

    const observer = new MutationObserver(update)
    observer.observe(form, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-active"],
    })
    return () => {
      observer.disconnect()
      settle()
    }
  }, [formRef, transition])
}

function restartAttribute(element: Element, name: string) {
  element.removeAttribute(name)
  void (element as HTMLElement).offsetWidth
  element.setAttribute(name, "")
}

type QuestionnaireProps = React.ComponentProps<
  typeof QuestionnairePrimitive.Root
> & {
  transition?: QuestionnaireTransition
  autoAdvance?: boolean
}

function Questionnaire({
  className,
  transition = "slide",
  autoAdvance = false,
  onKeyDown,
  onKeyDownCapture,
  onKeyUp,
  onClick,
  onChange,
  onMouseDown,
  ref,
  ...props
}: QuestionnaireProps) {
  const formRef = React.useRef<HTMLFormElement | null>(null)
  const answeredOnArrival = React.useRef(new WeakMap<HTMLElement, boolean>())
  const advanceTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelAdvance = () => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
  }

  useQuestionTransition(formRef, transition, (item) => {
    cancelAdvance()
    answeredOnArrival.current.set(
      item,
      item.getAttribute("data-status") !== "unanswered"
    )
  })

  React.useEffect(() => cancelAdvance, [])

  const setRef = React.useCallback(
    (node: HTMLFormElement | null) => {
      formRef.current = node
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

  const shakeIfInvalid = () => {
    requestAnimationFrame(() => {
      const form = formRef.current
      const item = form ? activeItem(form) : null
      if (item?.hasAttribute("data-invalid") && !prefersReducedMotion()) {
        restartAttribute(item, "data-shake")
      }
    })
  }

  const shortcutFor = (key: string) => {
    const form = formRef.current
    const item = form ? activeItem(form) : null
    if (!item || key.length !== 1) {
      return null
    }
    return item.querySelector<HTMLElement>(
      `kbd[data-shortcut="${CSS.escape(key.toUpperCase())}"]`
    )
  }

  const handleKeys = (event: React.KeyboardEvent<HTMLFormElement>) => {
    const form = formRef.current
    const item = form ? activeItem(form) : null
    if (!form || !item || event.defaultPrevented || event.altKey) {
      return
    }
    const target = event.target as HTMLElement
    const typing = target.matches(
      "input:not([type=radio]):not([type=checkbox]), textarea, select, [contenteditable=true]"
    )
    if (event.metaKey || event.ctrlKey) {
      if (event.key === "Enter") {
        shakeIfInvalid()
      }
      return
    }
    const take = () => {
      event.preventDefault()
      event.stopPropagation()
    }
    const answers = Array.from(
      item.querySelectorAll<HTMLElement>(
        "input[type=radio]:not(:disabled), input[type=checkbox]:not(:disabled), [data-slot=questionnaire-input]:not(:disabled)"
      )
    )
    const index = answers.indexOf(target)
    const visible = (slot: string) =>
      form.querySelector<HTMLElement>(`[data-slot=${slot}][data-visible]`)
    const advance = () => {
      const before = document.activeElement as HTMLElement | null
      ;(
        visible("questionnaire-next") ?? visible("questionnaire-submit")
      )?.click()
      requestAnimationFrame(() => {
        if (
          before &&
          before !== document.activeElement &&
          item.contains(before) &&
          activeItem(form) === item &&
          item.hasAttribute("data-invalid")
        ) {
          before.focus()
        }
      })
    }

    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        if (target.tagName === "TEXTAREA" || answers.length === 0) {
          return
        }
        take()
        const step = event.key === "ArrowDown" ? 1 : -1
        const next =
          index === -1
            ? step === 1
              ? 0
              : answers.length - 1
            : Math.min(answers.length - 1, Math.max(0, index + step))
        answers[next]?.focus()
        return
      }
      case "Home":
      case "End": {
        if (typing || answers.length === 0) {
          return
        }
        take()
        answers[event.key === "Home" ? 0 : answers.length - 1]?.focus()
        return
      }
      case "ArrowLeft":
      case "ArrowRight": {
        if (typing) {
          return
        }
        take()
        const rtl = getComputedStyle(form).direction === "rtl"
        const forward = (event.key === "ArrowRight") !== rtl
        if (event.repeat) {
          return
        }
        if (forward) {
          advance()
        } else {
          visible("questionnaire-previous")?.click()
        }
        return
      }
      case "Enter": {
        if (target.closest("button, a, textarea")) {
          return
        }
        take()
        if (event.repeat) {
          return
        }
        const input = target as HTMLInputElement
        if (input.type === "radio" && !input.checked) {
          input.click()
          cancelAdvance()
          setTimeout(advance, 0)
          return
        }
        advance()
        return
      }
      case "Escape": {
        if (typing) {
          take()
          item.focus()
        }
        return
      }
    }
  }

  return (
    <QuestionnairePrimitive.Root
      ref={setRef}
      data-slot="questionnaire"
      data-transition={transition}
      className={cn(
        "group/questionnaire relative flex w-full min-w-0 flex-col gap-5",
        className
      )}
      onKeyDownCapture={(event) => {
        onKeyDownCapture?.(event)
        handleKeys(event)
      }}
      onMouseDown={(event) => {
        onMouseDown?.(event)
        const form = formRef.current
        const item = form ? activeItem(form) : null
        const target = event.target as HTMLElement
        if (
          !event.defaultPrevented &&
          event.button === 0 &&
          item &&
          !item.contains(target) &&
          !target.closest(
            "input, textarea, select, button, a, label, [contenteditable=true]"
          )
        ) {
          event.preventDefault()
          item.focus({ preventScroll: true })
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        const target = event.target as HTMLElement
        const typing = target.matches(
          "input:not([type=radio]):not([type=checkbox]), textarea, select"
        )
        if (!typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
          shortcutFor(event.key)?.setAttribute("data-pressed", "")
        }
      }}
      onKeyUp={(event) => {
        onKeyUp?.(event)
        shortcutFor(event.key)?.removeAttribute("data-pressed")
      }}
      onClick={(event) => {
        onClick?.(event)
        if (
          (event.target as Element).closest(
            "[data-slot=questionnaire-next], [data-slot=questionnaire-submit]"
          )
        ) {
          cancelAdvance()
          shakeIfInvalid()
        }
      }}
      onChange={(event) => {
        onChange?.(event)
        cancelAdvance()
        const input = event.target as unknown as HTMLInputElement
        const form = formRef.current
        const item = input.closest<HTMLElement>(itemSelector)
        if (
          !autoAdvance ||
          !form ||
          input.type !== "radio" ||
          !input.checked ||
          !item ||
          item !== activeItem(form) ||
          answeredOnArrival.current.get(item)
        ) {
          return
        }
        advanceTimer.current = setTimeout(() => {
          advanceTimer.current = null
          if (activeItem(form) !== item || !input.checked) {
            return
          }
          form
            .querySelector<HTMLElement>(
              "[data-slot=questionnaire-next][data-visible]"
            )
            ?.click()
        }, 350)
      }}
      {...props}
    />
  )
}

type Segment = { status: string; active: boolean; invalid: boolean }

function readSegments(form: HTMLFormElement): Segment[] {
  return ownItems(form)
    .filter((item) => !item.hasAttribute("disabled"))
    .map((item) => ({
      status: item.getAttribute("data-status") ?? "unanswered",
      active: item.hasAttribute("data-active"),
      invalid: item.hasAttribute("data-invalid"),
    }))
}

function useSegments(ref: React.RefObject<HTMLElement | null>) {
  const [segments, setSegments] = React.useState<Segment[] | null>(null)

  React.useEffect(() => {
    const form = ref.current?.closest("form")
    if (!form || typeof MutationObserver === "undefined") {
      return
    }
    let last = ""
    const read = () => {
      const next = readSegments(form)
      const key = JSON.stringify(next)
      if (key !== last) {
        last = key
        setSegments(next)
      }
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(form, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: [
        "data-status",
        "data-active",
        "data-invalid",
        "disabled",
      ],
    })
    return () => observer.disconnect()
  }, [ref])

  return segments
}

type QuestionnaireProgressProps = React.ComponentProps<
  typeof QuestionnairePrimitive.Progress
> & {
  variant?: "segments" | "bar"
}

function QuestionnaireProgress({
  className,
  variant = "segments",
  ref,
  ...props
}: QuestionnaireProgressProps) {
  const ownRef = React.useRef<HTMLDivElement | null>(null)
  const segments = useSegments(ownRef)

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      ownRef.current = node
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

  return (
    <QuestionnairePrimitive.Progress
      ref={setRef}
      data-slot="questionnaire-progress"
      data-variant={variant}
      className={cn("flex w-full min-w-0 items-center gap-3", className)}
      render={(renderProps, state) => {
        const list =
          segments && segments.length === state.total
            ? segments
            : Array.from({ length: state.total }, (_, index) => ({
                status: index < state.current - 1 ? "answered" : "unanswered",
                active: index === state.current - 1,
                invalid: false,
              }))
        const done = list.filter((item) => item.status !== "unanswered").length
        return (
          <div {...renderProps}>
            {variant === "segments" ? (
              <span
                aria-hidden="true"
                data-slot="questionnaire-progress-track"
                className="flex h-1 min-w-0 flex-1 gap-1"
              >
                {list.map((segment, index) => (
                  <span
                    key={index}
                    data-slot="questionnaire-progress-segment"
                    data-status={segment.status}
                    data-active={segment.active ? "" : undefined}
                    data-invalid={segment.invalid ? "" : undefined}
                    className="relative min-w-0 flex-1 overflow-hidden rounded-full bg-muted transition-colors duration-300 data-invalid:bg-destructive/30 motion-reduce:transition-none data-active:bg-primary/20"
                  >
                    <span className="absolute inset-0 origin-left scale-x-0 rounded-full bg-primary transition-[scale,background-color] duration-500 ease-out-quint in-data-[status=answered]:scale-x-100 in-data-[status=skipped]:scale-x-100 in-data-[status=skipped]:bg-muted-foreground/30 motion-reduce:transition-none rtl:origin-right" />
                  </span>
                ))}
              </span>
            ) : (
              <span
                aria-hidden="true"
                data-slot="questionnaire-progress-track"
                className="relative h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-muted"
              >
                <span
                  style={
                    {
                      "--questionnaire-progress":
                        state.total > 0 ? done / state.total : 0,
                    } as React.CSSProperties
                  }
                  className="absolute inset-0 origin-left scale-x-(--questionnaire-progress) rounded-full bg-primary transition-[scale] duration-500 ease-out-quint motion-reduce:transition-none rtl:origin-right"
                />
              </span>
            )}
            <span
              aria-hidden="true"
              data-slot="questionnaire-progress-label"
              className="shrink-0 text-xs font-medium text-muted-foreground tabular-nums"
            >
              <span dir="ltr" className="inline-flex gap-1">
                <NumberFlow value={state.current} />
                <span className="text-muted-foreground/60">/</span>
                {state.total}
              </span>
            </span>
            <span className="sr-only">
              {renderProps.children as React.ReactNode}
            </span>
          </div>
        )
      }}
      {...props}
    />
  )
}

function QuestionnaireItem({
  className,
  onAnimationEnd,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Item>) {
  return (
    <QuestionnairePrimitive.Item
      data-slot="questionnaire-item"
      className={cn(
        "flex min-w-0 flex-col gap-4 border-0 p-0 outline-none focus-visible:outline-hidden data-shake:motion-safe:animate-button-shake",
        className
      )}
      onAnimationEnd={(event) => {
        onAnimationEnd?.(event)
        if (event.target === event.currentTarget) {
          event.currentTarget.removeAttribute("data-shake")
        }
      }}
      {...props}
    />
  )
}

function QuestionnaireTitle({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Title>) {
  return (
    <QuestionnairePrimitive.Title
      data-slot="questionnaire-title"
      className={cn(
        "mb-1.5 text-base leading-snug font-medium text-pretty wrap-break-word [&:not(:has(~[data-slot=questionnaire-description]))]:mb-4",
        className
      )}
      {...props}
    />
  )
}

function QuestionnaireDescription({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Description>) {
  return (
    <QuestionnairePrimitive.Description
      data-slot="questionnaire-description"
      className={cn(
        "text-sm text-pretty wrap-break-word text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function QuestionnaireChoices({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choices>) {
  return (
    <QuestionnairePrimitive.Choices
      data-slot="questionnaire-choices"
      className={cn("grid min-w-0 gap-2", className)}
      {...props}
    />
  )
}

function QuestionnaireChoice({
  className,
  children,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choice>) {
  return (
    <QuestionnairePrimitive.Choice
      data-slot="questionnaire-choice"
      className={cn(
        "group/questionnaire-choice relative flex min-h-11 min-w-0 cursor-pointer items-center gap-3 rounded-lg bg-background px-3 py-2.5 text-start text-sm inset-ring-(length:--hairline) inset-ring-border transition-[background-color,box-shadow,scale] duration-150 ease-out-cubic select-none has-data-[slot=questionnaire-choice-description]:items-start has-[>input:focus-visible]:ring-3 has-[>input:focus-visible]:ring-focus-ring has-[>input:focus-visible]:inset-ring-ring data-invalid:inset-ring-destructive/60 motion-safe:active:scale-[0.99] motion-reduce:transition-none dark:bg-input/20 forced-colors:border data-checked:bg-muted/70 data-checked:inset-ring-foreground/20 dark:data-checked:bg-muted data-disabled:pointer-events-none data-disabled:opacity-50 [@media(hover:hover)]:hover:bg-muted/50",
        className
      )}
      {...props}
    >
      <QuestionnairePrimitive.ChoiceInput
        data-slot="questionnaire-choice-input"
        className="absolute inset-0 z-1 size-full cursor-pointer appearance-none rounded-[inherit] opacity-0 outline-none focus-visible:outline-hidden"
      />
      <span
        aria-hidden="true"
        data-slot="questionnaire-choice-indicator"
        className="relative flex size-4 shrink-0 items-center justify-center rounded-full bg-background inset-ring-(length:--hairline) inset-ring-input transition-[background-color,box-shadow] duration-150 group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:mt-0.5 group-data-invalid/questionnaire-choice:inset-ring-destructive group-data-[type=checkbox]/questionnaire-choice:rounded-[4px] group-data-checked/questionnaire-choice:bg-primary group-data-checked/questionnaire-choice:text-primary-foreground group-data-checked/questionnaire-choice:inset-ring-primary dark:bg-input/30 dark:group-data-checked/questionnaire-choice:bg-primary forced-colors:border"
      >
        <span className="size-1.5 scale-0 rounded-full bg-current transition-[scale] duration-300 ease-spring group-data-[type=checkbox]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:scale-100 motion-reduce:transition-none" />
        <IconCheck
          stroke={3}
          className="hidden size-3 opacity-0 group-data-[type=checkbox]/questionnaire-choice:block group-data-checked/questionnaire-choice:opacity-100 motion-safe:group-data-checked/questionnaire-choice:animate-checkbox-draw motion-safe:group-data-checked/questionnaire-choice:[stroke-dasharray:22] motion-safe:group-data-checked/questionnaire-choice:[stroke-dashoffset:22]"
        />
      </span>
      <QuestionnairePrimitive.ChoiceLabel
        data-slot="questionnaire-choice-label"
        className="flex min-w-0 flex-1 flex-col gap-0.5 leading-snug wrap-break-word"
      >
        {children}
      </QuestionnairePrimitive.ChoiceLabel>
      <QuestionnairePrimitive.ChoiceShortcut
        data-slot="questionnaire-choice-shortcut"
        render={<Kbd />}
        className="opacity-50 transition-opacity duration-200 group-focus-within/questionnaire:opacity-100 group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:mt-px pointer-coarse:hidden"
      />
    </QuestionnairePrimitive.Choice>
  )
}

function QuestionnaireChoiceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="questionnaire-choice-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

function QuestionnaireInput({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Input>) {
  return (
    <QuestionnairePrimitive.Input
      data-slot="questionnaire-input"
      className={cn(
        inputVariants({ size: "default" }),
        "h-11 sm:h-10",
        className
      )}
      {...props}
    />
  )
}

function QuestionnaireError({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Error>) {
  return (
    <QuestionnairePrimitive.Error
      data-slot="questionnaire-error"
      className={cn(
        "-mt-1 text-sm text-destructive motion-safe:animate-in motion-safe:animation-duration-200 motion-safe:fade-in-0 motion-safe:slide-in-from-top-1",
        className
      )}
      {...props}
    />
  )
}

function QuestionnaireActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="questionnaire-actions"
      className={cn(
        "grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2",
        className
      )}
      {...props}
    />
  )
}

type NavigationProps = Pick<
  VariantProps<typeof buttonVariants>,
  "size" | "variant"
>

const navigationClassName = "pointer-coarse:h-11"

function QuestionnairePrevious({
  children,
  className,
  size = "default",
  variant = "ghost",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Previous> &
  NavigationProps) {
  return (
    <QuestionnairePrimitive.Previous
      data-slot="questionnaire-previous"
      className={cn(
        buttonVariants({ size, variant }),
        navigationClassName,
        "col-start-1 row-start-1 justify-self-start",
        className
      )}
      {...props}
    >
      {children ?? "Previous"}
    </QuestionnairePrimitive.Previous>
  )
}

function QuestionnaireSkip({
  children,
  className,
  size = "default",
  variant = "ghost",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Skip> & NavigationProps) {
  return (
    <QuestionnairePrimitive.Skip
      data-slot="questionnaire-skip"
      className={cn(
        buttonVariants({ size, variant }),
        navigationClassName,
        "col-start-2 row-start-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      {children ?? "Skip"}
    </QuestionnairePrimitive.Skip>
  )
}

function QuestionnaireNext({
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Next> & NavigationProps) {
  return (
    <QuestionnairePrimitive.Next
      data-slot="questionnaire-next"
      className={cn(
        buttonVariants({ size, variant }),
        navigationClassName,
        "col-start-3 row-start-1 min-w-20 justify-self-end",
        className
      )}
      {...props}
    >
      {children ?? "Next"}
    </QuestionnairePrimitive.Next>
  )
}

function QuestionnaireSubmit({
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Submit> &
  NavigationProps) {
  return (
    <QuestionnairePrimitive.Submit
      data-slot="questionnaire-submit"
      className={cn(
        buttonVariants({ size, variant }),
        navigationClassName,
        "col-start-3 row-start-1 min-w-20 justify-self-end",
        className
      )}
      {...props}
    >
      {children ?? "Submit"}
    </QuestionnairePrimitive.Submit>
  )
}

export {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
}
export type {
  QuestionnaireProgressProps,
  QuestionnaireProps,
  QuestionnaireTransition,
}
