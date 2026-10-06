import * as React from "react"
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { Button, useButtonFeedback, type ButtonStatus } from "./button"

function deferred() {
  let resolve!: () => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<void>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe("useButtonFeedback", () => {
  it("skips the spinner when the action settles before the delay", async () => {
    const changes: ButtonStatus[] = []
    const { result } = renderHook(() =>
      useButtonFeedback({ onStatusChange: (status) => changes.push(status) })
    )
    const action = deferred()

    act(() => result.current.track(action.promise))
    await advance(80)
    action.resolve()
    await advance(0)

    expect(result.current.status).toBe("success")
    await advance(2000)
    expect(changes).toEqual(["success", "idle"])
  })

  it("keeps the spinner visible for a minimum time once shown", async () => {
    const { result } = renderHook(() => useButtonFeedback())
    const action = deferred()

    act(() => result.current.track(action.promise))
    await advance(150)
    expect(result.current.status).toBe("loading")

    action.resolve()
    await advance(100)
    expect(result.current.status).toBe("loading")

    await advance(300)
    expect(result.current.status).toBe("success")
  })

  it("reports errors and resets after the error delay", async () => {
    const onError = vi.fn()
    const { result } = renderHook(() => useButtonFeedback({ onError }))
    const reason = new Error("Network down")

    act(() => result.current.track(Promise.reject(reason)))
    await advance(0)

    expect(result.current.status).toBe("error")
    expect(result.current.error).toBe(reason)
    expect(onError).toHaveBeenCalledWith(reason)

    await advance(3999)
    expect(result.current.status).toBe("error")
    await advance(1)
    expect(result.current.status).toBe("idle")
  })

  it("holds the error while hovered and resumes after leaving", async () => {
    const { result } = renderHook(() => useButtonFeedback())

    act(() => result.current.track(Promise.reject(new Error("x"))))
    await advance(0)
    act(() =>
      result.current.buttonProps.onPointerEnter({
        pointerType: "mouse",
      } as React.PointerEvent<HTMLElement>)
    )

    await advance(10000)
    expect(result.current.status).toBe("error")

    act(() => result.current.buttonProps.onPointerLeave())
    await advance(600)
    expect(result.current.status).toBe("idle")
  })

  it("ignores a second track while one is in flight", async () => {
    const onStatusChange = vi.fn()
    const { result } = renderHook(() => useButtonFeedback({ onStatusChange }))
    const first = deferred()
    const second = deferred()

    act(() => result.current.track(first.promise))
    act(() => result.current.track(second.promise))
    second.promise.catch(() => {})
    second.reject(new Error("ignored"))
    await advance(0)
    expect(result.current.status).toBe("idle")

    first.resolve()
    await advance(0)
    expect(result.current.status).toBe("success")
  })

  it("ignores results from a run that was reset", async () => {
    const { result } = renderHook(() => useButtonFeedback())
    const action = deferred()

    act(() => result.current.track(action.promise))
    await advance(200)
    act(() => result.current.reset())
    action.resolve()
    await advance(1000)

    expect(result.current.status).toBe("idle")
  })

  it("uses the latest onStatusChange", async () => {
    const first = vi.fn()
    const second = vi.fn()
    const action = deferred()
    const { result, rerender } = renderHook(
      ({ onStatusChange }) => useButtonFeedback({ onStatusChange }),
      { initialProps: { onStatusChange: first } }
    )

    act(() => result.current.track(action.promise))
    rerender({ onStatusChange: second })
    action.resolve()
    await advance(0)

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledWith("success")
  })
})

describe("Button", () => {
  it("rounds fully with the pill shape at every size", () => {
    render(
      <>
        <Button shape="pill" size="sm">
          Small
        </Button>
        <Button shape="pill" size="icon-sm" aria-label="Add">
          +
        </Button>
      </>
    )
    for (const name of ["Small", "Add"]) {
      const button = screen.getByRole("button", { name })
      expect(button.getAttribute("data-shape")).toBe("pill")
      const classes = button.className.split(" ")
      expect(classes).toContain("rounded-full")
      expect(classes.some((item) => item.startsWith("rounded-[min"))).toBe(false)
    }
  })

  it("leaves plain buttons untouched", () => {
    render(<Button onClick={async () => {}}>Save</Button>)
    const button = screen.getByRole("button", { name: "Save" })

    fireEvent.click(button)

    expect(button.hasAttribute("data-status")).toBe(false)
    expect(screen.queryByRole("status")).toBeNull()
  })

  it("runs the feedback flow and keeps focus while loading", async () => {
    const action = deferred()
    render(
      <Button feedback onClick={() => action.promise}>
        Save
      </Button>
    )
    const button = screen.getByRole("button", { name: "Save" })
    button.focus()

    fireEvent.click(button)
    await advance(150)

    expect(button.getAttribute("data-status")).toBe("loading")
    expect(button.getAttribute("aria-busy")).toBe("true")
    expect(button.hasAttribute("disabled")).toBe(false)
    expect(document.activeElement).toBe(button)

    action.resolve()
    await advance(400)

    expect(button.getAttribute("data-status")).toBe("success")
    expect(screen.getByRole("status").textContent).toBe("Done")
  })

  it("keeps the native disabled attribute when disabled", () => {
    render(
      <Button feedback disabled>
        Save
      </Button>
    )

    expect(screen.getByRole("button").hasAttribute("disabled")).toBe(true)
  })

  it("passes the error to a function errorLabel", async () => {
    render(
      <Button
        feedback
        errorLabel={(error) => (error as Error).message}
        onClick={() => Promise.reject(new Error("Card declined"))}
      >
        Pay
      </Button>
    )

    fireEvent.click(screen.getByRole("button"))
    await advance(0)

    expect(screen.getByRole("status").textContent).toBe("Card declined")
  })

  it("colors only the text on quiet variants", async () => {
    render(
      <Button feedback variant="ghost" onClick={() => Promise.resolve()}>
        Save
      </Button>
    )
    const button = screen.getByRole("button")

    fireEvent.click(button)
    await advance(0)

    expect(button.className).toContain("text-success")
    expect(button.className).not.toContain("bg-success")
  })
})
