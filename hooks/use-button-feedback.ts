import * as React from "react"

type ButtonStatus = "idle" | "loading" | "success" | "error"

type ButtonResetAfter = number | { success?: number; error?: number }

type ButtonFeedbackOptions = {
  resetAfter?: ButtonResetAfter
  onStatusChange?: (status: ButtonStatus) => void
  onError?: (error: unknown) => void
}

const spinnerDelay = 150
const minimumSpinnerTime = 400
const resumeResetDelay = 600
const defaultResetAfter = { success: 2000, error: 4000 }

function resolveResetAfter(
  resetAfter: ButtonResetAfter | undefined,
  outcome: "success" | "error"
) {
  if (typeof resetAfter === "number") {
    return resetAfter
  }
  return resetAfter?.[outcome] ?? defaultResetAfter[outcome]
}

function useButtonFeedback(options: ButtonFeedbackOptions = {}) {
  const [status, setStatus] = React.useState<ButtonStatus>("idle")
  const [error, setError] = React.useState<unknown>(undefined)
  const optionsRef = React.useRef(options)
  const runRef = React.useRef(0)
  const inFlightRef = React.useRef(false)
  const timersRef = React.useRef<ReturnType<typeof setTimeout>[]>([])
  const holdRef = React.useRef({ hovered: false, focused: false })
  const resetPendingRef = React.useRef(false)
  const statusRef = React.useRef<ButtonStatus>("idle")

  React.useLayoutEffect(() => {
    optionsRef.current = options
  })

  const clearTimers = React.useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  React.useEffect(
    () => () => {
      runRef.current += 1
      clearTimers()
    },
    [clearTimers]
  )

  const update = React.useCallback((next: ButtonStatus) => {
    statusRef.current = next
    setStatus(next)
    optionsRef.current.onStatusChange?.(next)
  }, [])

  const later = React.useCallback((callback: () => void, delay: number) => {
    const run = runRef.current
    timersRef.current.push(
      setTimeout(() => {
        if (run === runRef.current) {
          callback()
        }
      }, delay)
    )
  }, [])

  const isHeld = React.useCallback(
    () =>
      statusRef.current === "error" &&
      (holdRef.current.hovered || holdRef.current.focused),
    []
  )

  const resume = React.useCallback(() => {
    if (resetPendingRef.current && !isHeld()) {
      resetPendingRef.current = false
      later(() => update("idle"), resumeResetDelay)
    }
  }, [isHeld, later, update])

  const track = React.useCallback(
    (action: PromiseLike<unknown> | (() => PromiseLike<unknown>)) => {
      if (inFlightRef.current) {
        return
      }
      const run = ++runRef.current
      let spinnerShownAt: number | null = null

      inFlightRef.current = true
      resetPendingRef.current = false
      clearTimers()

      later(() => {
        spinnerShownAt = Date.now()
        update("loading")
      }, spinnerDelay)

      const settle = (outcome: "success" | "error", reason?: unknown) => {
        if (run !== runRef.current) {
          return
        }
        clearTimers()
        const remaining =
          spinnerShownAt === null
            ? 0
            : Math.max(0, minimumSpinnerTime - (Date.now() - spinnerShownAt))

        later(() => {
          inFlightRef.current = false
          if (outcome === "error") {
            setError(reason)
            optionsRef.current.onError?.(reason)
          }
          update(outcome)
          later(
            () => {
              if (isHeld()) {
                resetPendingRef.current = true
              } else {
                update("idle")
              }
            },
            resolveResetAfter(optionsRef.current.resetAfter, outcome)
          )
        }, remaining)
      }

      try {
        const promise = typeof action === "function" ? action() : action
        Promise.resolve(promise).then(
          () => settle("success"),
          (reason: unknown) => settle("error", reason)
        )
      } catch (reason) {
        settle("error", reason)
      }
    },
    [clearTimers, isHeld, later, update]
  )

  const reset = React.useCallback(() => {
    runRef.current += 1
    clearTimers()
    inFlightRef.current = false
    resetPendingRef.current = false
    update("idle")
  }, [clearTimers, update])

  const handlers = React.useMemo(
    () => ({
      onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
        if (event.pointerType === "mouse") {
          holdRef.current.hovered = true
        }
      },
      onPointerLeave: () => {
        holdRef.current.hovered = false
        resume()
      },
      onFocus: (event: React.FocusEvent<HTMLElement>) => {
        holdRef.current.focused = event.currentTarget.matches(":focus-visible")
      },
      onBlur: () => {
        holdRef.current.focused = false
        resume()
      },
    }),
    [resume]
  )

  return {
    status,
    error,
    track,
    reset,
    isPending: () => inFlightRef.current,
    buttonProps: { status, ...handlers },
  }
}

export { useButtonFeedback }
export type { ButtonFeedbackOptions, ButtonResetAfter, ButtonStatus }
