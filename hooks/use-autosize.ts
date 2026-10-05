import * as React from "react"

import { easeOut, prefersReducedMotion } from "@/lib/motion"

function useAutosize(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  enabled: boolean,
  value: unknown
) {
  const fitRef = React.useRef<((animate: boolean) => void) | null>(null)

  React.useLayoutEffect(() => {
    const textarea = ref.current
    if (!enabled || !textarea) {
      return
    }

    let animation: Animation | null = null
    let settled = 0
    let width = 0

    const fit = (animate: boolean) => {
      const from = animation
        ? parseFloat(getComputedStyle(textarea).height)
        : settled
      animation?.cancel()
      animation = null

      textarea.style.height = "auto"
      const style = getComputedStyle(textarea)
      const border =
        parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
      const max = parseFloat(style.maxHeight)
      const min = parseFloat(style.minHeight)
      const natural = textarea.scrollHeight + border
      const capped = Number.isFinite(max) ? Math.min(natural, max) : natural
      const target = Number.isFinite(min) ? Math.max(capped, min) : capped
      textarea.style.height = `${target}px`
      textarea.style.overflowY = natural > target + 1 ? "auto" : "hidden"
      settled = target

      if (
        animate &&
        from > 0 &&
        Math.abs(from - target) > 0.5 &&
        typeof textarea.animate === "function" &&
        !prefersReducedMotion()
      ) {
        const overflow = textarea.style.overflowY
        textarea.style.overflowY = "hidden"
        const running = textarea.animate(
          [{ height: `${from}px` }, { height: `${target}px` }],
          { duration: 180, easing: easeOut }
        )
        animation = running
        running.onfinish = () => {
          if (animation === running) {
            animation = null
            textarea.style.overflowY = overflow
          }
        }
      }
    }

    fitRef.current = fit
    fit(false)

    const onInput = (event: Event) => {
      if (event.target === textarea) {
        fit(true)
      }
    }
    window.addEventListener("input", onInput)
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            if (textarea.clientWidth !== width) {
              width = textarea.clientWidth
              if (!animation) {
                fit(false)
              }
            }
          })
    observer?.observe(textarea)

    return () => {
      fitRef.current = null
      window.removeEventListener("input", onInput)
      observer?.disconnect()
      animation?.cancel()
      textarea.style.height = ""
      textarea.style.overflowY = ""
    }
  }, [enabled, ref])

  React.useLayoutEffect(() => {
    fitRef.current?.(true)
  }, [value])
}

export { useAutosize }
