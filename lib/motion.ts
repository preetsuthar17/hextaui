import * as React from "react"

const easeOut = "cubic-bezier(0.23, 1, 0.32, 1)"
const easeInOut = "cubic-bezier(0.77, 0, 0.175, 1)"
const easeSpring =
  "linear(0, 0.015 2%, 0.0532 4%, 0.1065 6%, 0.1686 8%, 0.2351 10%, 0.3363 13%, 0.4332 16%, 0.5495 20%, 0.648 24%, 0.7287 28%, 0.807 33%, 0.8646 38%, 0.9128 44%, 0.9447 50%, 0.968 57%, 0.9834 65%, 0.9924 74%, 0.9975 85%, 1)"

const duration = {
  press: 100,
  release: 200,
  hover: 150,
  enter: 200,
  exit: 150,
  morph: 300,
} as const

function prefersReducedMotion() {
  return (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

type SizeAxis = "width" | "height"

type SizeMorphOptions = {
  axis: SizeAxis
  enabled?: boolean
  duration?: number
  easing?: string
}

function readSize(element: HTMLElement, axis: SizeAxis) {
  const value = parseFloat(getComputedStyle(element)[axis])
  if (Number.isFinite(value)) {
    return value
  }
  const rect = element.getBoundingClientRect()
  return axis === "width" ? rect.width : rect.height
}

function attachSizeMorph(
  element: HTMLElement,
  axis: SizeAxis,
  time: number,
  easing: string
) {
  if (
    typeof MutationObserver === "undefined" ||
    typeof element.animate !== "function"
  ) {
    return undefined
  }

  let settled = readSize(element, axis)
  let animation: Animation | null = null

  const morph = () => {
    const from = animation ? readSize(element, axis) : settled
    animation?.cancel()
    animation = null
    const to = readSize(element, axis)
    settled = to

    if (
      Math.abs(from - to) < 0.5 ||
      prefersReducedMotion() ||
      !element.isConnected ||
      element.getClientRects().length === 0
    ) {
      element.removeAttribute("data-morphing")
      return
    }

    element.setAttribute("data-morphing", "")
    const running = element.animate(
      [{ [axis]: `${from}px` }, { [axis]: `${to}px` }],
      { duration: time, easing }
    )
    animation = running
    running.onfinish = () => {
      if (animation === running) {
        animation = null
        element.removeAttribute("data-morphing")
        settled = readSize(element, axis)
      }
    }
  }

  const mutations = new MutationObserver(morph)
  mutations.observe(element, {
    childList: true,
    subtree: true,
    characterData: true,
  })

  const resize =
    typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(() => {
          if (!animation) {
            settled = readSize(element, axis)
          }
        })
  resize?.observe(element)

  return () => {
    mutations.disconnect()
    resize?.disconnect()
    animation?.cancel()
    element.removeAttribute("data-morphing")
  }
}

function useSizeMorph<T extends HTMLElement>({
  axis,
  enabled = true,
  duration: time = duration.morph,
  easing = easeOut,
}: SizeMorphOptions): React.RefCallback<T> {
  return React.useCallback(
    (element: T | null) => {
      if (!element || !enabled) {
        return undefined
      }
      return attachSizeMorph(element, axis, time, easing)
    },
    [axis, enabled, time, easing]
  )
}

function useSlidingHighlight(
  barRef: React.RefObject<HTMLElement | null>,
  highlightRef: React.RefObject<HTMLElement | null>,
  selector: string,
  attribute = "data-popup-open"
) {
  React.useLayoutEffect(() => {
    const bar = barRef.current
    const highlight = highlightRef.current
    if (!bar || !highlight) {
      return
    }

    let current: HTMLElement | null = null

    const place = (trigger: HTMLElement, instant: boolean) => {
      if (instant || prefersReducedMotion()) {
        highlight.setAttribute("data-instant", "")
      } else {
        highlight.removeAttribute("data-instant")
      }
      const frame = bar.getBoundingClientRect()
      const box = trigger.getBoundingClientRect()
      const scale = bar.offsetWidth > 0 ? frame.width / bar.offsetWidth : 1
      highlight.style.left = "0px"
      highlight.style.width = `${box.width / scale}px`
      highlight.style.height = `${box.height / scale}px`
      highlight.style.transform = `translate(${(box.left - frame.left) / scale - bar.clientLeft}px, ${(box.top - frame.top) / scale - bar.clientTop}px)`
    }

    const sync = () => {
      const trigger = bar.querySelector<HTMLElement>(selector)
      if (trigger === current) {
        if (trigger) {
          place(trigger, true)
        }
        return
      }
      const appearing = current === null
      current = trigger
      if (!trigger) {
        highlight.removeAttribute("data-visible")
        return
      }
      place(trigger, appearing)
      if (appearing) {
        void highlight.offsetWidth
      }
      highlight.setAttribute("data-visible", "")
    }

    sync()
    const mutations = new MutationObserver(sync)
    mutations.observe(bar, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: [attribute],
    })
    const resize =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            if (current) {
              place(current, true)
            }
          })
    resize?.observe(bar)
    const onScroll = () => {
      if (current) {
        place(current, true)
      }
    }
    bar.addEventListener("scroll", onScroll, { capture: true, passive: true })

    return () => {
      mutations.disconnect()
      resize?.disconnect()
      bar.removeEventListener("scroll", onScroll, { capture: true })
    }
  }, [barRef, highlightRef, selector, attribute])
}

export {
  duration,
  easeInOut,
  easeOut,
  easeSpring,
  prefersReducedMotion,
  useSizeMorph,
  useSlidingHighlight,
}
export type { SizeMorphOptions }
