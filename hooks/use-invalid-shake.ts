import * as React from "react"

import { prefersReducedMotion } from "@/lib/motion"

type ShakeControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

const submitSelector =
  'button:not([type]), button[type="submit"], input[type="submit"], input[type="image"]'

function isInvalid(control: ShakeControl) {
  return (
    control.getAttribute("aria-invalid") === "true" ||
    control.hasAttribute("data-invalid") ||
    control.matches(":user-invalid")
  )
}

function useInvalidShake(
  ref: React.RefObject<ShakeControl | null>,
  enabled = true
) {
  React.useEffect(() => {
    const control = ref.current
    const form = control?.form
    if (!enabled || !control || !form) {
      return
    }

    let attempt = 0
    let shaken = 0
    let attemptedAt = -Infinity
    let timer: ReturnType<typeof setTimeout> | undefined
    let frame = 0

    const shake = () => {
      if (shaken === attempt || prefersReducedMotion()) {
        return
      }
      shaken = attempt
      const target =
        control.closest<HTMLElement>("[data-slot=input-group]") ?? control
      target.removeAttribute("data-shake")
      void target.offsetWidth
      target.setAttribute("data-shake", "")
      clearTimeout(timer)
      timer = setTimeout(() => target.removeAttribute("data-shake"), 400)
    }

    const recent = () => performance.now() - attemptedAt < 600

    const check = () => {
      if (recent() && isInvalid(control)) {
        shake()
      }
    }

    const onAttempt = () => {
      attempt += 1
      attemptedAt = performance.now()
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(check)
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null
      if (target?.closest(submitSelector)) {
        onAttempt()
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as Element | null
      if (event.key === "Enter" && target instanceof HTMLInputElement) {
        onAttempt()
      }
    }

    const onInvalid = () => {
      if (recent()) {
        shake()
      }
    }

    const attributes = new MutationObserver(check)
    attributes.observe(control, {
      attributes: true,
      attributeFilter: ["aria-invalid", "data-invalid"],
    })

    form.addEventListener("click", onClick, true)
    form.addEventListener("keydown", onKeyDown, true)
    form.addEventListener("submit", onAttempt, true)
    control.addEventListener("invalid", onInvalid)

    return () => {
      attributes.disconnect()
      form.removeEventListener("click", onClick, true)
      form.removeEventListener("keydown", onKeyDown, true)
      form.removeEventListener("submit", onAttempt, true)
      control.removeEventListener("invalid", onInvalid)
      cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
  }, [ref, enabled])
}

export { useInvalidShake }
export type { ShakeControl }
