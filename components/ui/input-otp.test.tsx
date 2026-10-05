import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  type InputOTPProps,
} from "./input-otp"

type AnimateCall = {
  element: HTMLElement
  keyframes: Keyframe[]
  options: KeyframeAnimationOptions
  animation: {
    cancel: ReturnType<typeof vi.fn>
    onfinish: (() => void) | null
  }
}

let calls: AnimateCall[] = []

function mockMotion(reduced = false) {
  calls = []
  Object.defineProperty(HTMLElement.prototype, "animate", {
    configurable: true,
    writable: true,
    value: function animate(
      this: HTMLElement,
      keyframes: Keyframe[],
      options: KeyframeAnimationOptions
    ) {
      const animation = { cancel: vi.fn(), onfinish: null }
      calls.push({ element: this, keyframes, options, animation })
      return animation
    },
  })
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches: reduced && query.includes("reduce"),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList
  )
}

function unmockMotion() {
  Reflect.deleteProperty(HTMLElement.prototype, "animate")
}

beforeEach(() => {
  if (typeof window.matchMedia !== "function") {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: () => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    })
  }
})

afterEach(() => {
  cleanup()
  unmockMotion()
  vi.useRealTimers()
})

function Code(props: Partial<InputOTPProps>) {
  return (
    <>
      <label htmlFor="code">Verification code</label>
      <InputOTP id="code" length={6} {...props}>
        <InputOTPGroup>
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
        </InputOTPGroup>
      </InputOTP>
    </>
  )
}

function inputs() {
  return Array.from(
    document.querySelectorAll<HTMLInputElement>("[data-slot=input-otp-input]")
  )
}

function slots() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[data-slot=input-otp-slot]")
  )
}

function root() {
  return document.querySelector<HTMLElement>("[data-slot=input-otp]")!
}

describe("InputOTP", () => {
  it("renders slots, groups and a separator with data slots", () => {
    render(<Code />)

    expect(root().getAttribute("role")).toBe("group")
    expect(root().getAttribute("data-variant")).toBe("joined")
    expect(root().getAttribute("data-size")).toBe("default")
    expect(
      document.querySelectorAll("[data-slot=input-otp-group]")
    ).toHaveLength(2)
    expect(slots()).toHaveLength(6)
    expect(inputs()).toHaveLength(6)
    expect(
      document
        .querySelector("[data-slot=input-otp-separator]")
        ?.getAttribute("role")
    ).toBe("separator")
    expect(slots()[0].className).toContain("size-9")
    expect(slots()[0].className).toContain("first:rounded-s-md")
  })

  it("labels the first slot by the field label and the rest by position", () => {
    render(<Code />)

    expect(screen.getByRole("textbox", { name: "Verification code" })).toBe(
      inputs()[0]
    )
    expect(screen.getByRole("textbox", { name: "Character 2 of 6" })).toBe(
      inputs()[1]
    )
    expect(inputs()[5].getAttribute("aria-label")).toBe("Character 6 of 6")
    expect(inputs()[5].hasAttribute("aria-labelledby")).toBe(false)
  })

  it("keeps a caller's own slot label", () => {
    render(
      <InputOTP length={2} aria-label="Code">
        <InputOTPSlot />
        <InputOTPSlot aria-label="Zweite Ziffer" />
      </InputOTP>
    )
    expect(inputs()[1].getAttribute("aria-label")).toBe("Zweite Ziffer")
  })

  it("puts one-time-code autocomplete on the first slot only", () => {
    render(<Code />)

    expect(inputs()[0].getAttribute("autocomplete")).toBe("one-time-code")
    expect(inputs()[0].getAttribute("maxlength")).toBe("6")
    expect(inputs()[1].getAttribute("autocomplete")).toBe("off")
    expect(inputs()[0].getAttribute("inputmode")).toBe("numeric")
  })

  it("spreads an autofilled code across every slot and completes once", () => {
    const onValueChange = vi.fn()
    const onValueComplete = vi.fn()
    render(
      <Code onValueChange={onValueChange} onValueComplete={onValueComplete} />
    )

    fireEvent.change(inputs()[0], { target: { value: "123456" } })

    expect(inputs().map((input) => input.value)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
    ])
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange.mock.calls[0][0]).toBe("123456")
    expect(onValueComplete).toHaveBeenCalledTimes(1)
    expect(root().hasAttribute("data-complete")).toBe(true)
    expect(slots().every((slot) => slot.hasAttribute("data-filled"))).toBe(true)
  })

  it("accepts a code that lands in the hidden autofill input", () => {
    render(<Code name="code" />)
    const hidden =
      document.querySelector<HTMLInputElement>('input[name="code"]')!

    fireEvent.change(hidden, { target: { value: "654321" } })

    expect(
      inputs()
        .map((input) => input.value)
        .join("")
    ).toBe("654321")
  })

  it("drops characters the validation rejects", () => {
    const onValueInvalid = vi.fn()
    render(<Code onValueInvalid={onValueInvalid} />)

    fireEvent.change(inputs()[0], { target: { value: "12-ab3" } })

    expect(
      inputs()
        .map((input) => input.value)
        .join("")
    ).toBe("123")
    expect(onValueInvalid).toHaveBeenCalledTimes(1)
  })

  it("works controlled and follows outside value changes", () => {
    function Controlled() {
      const [value, setValue] = React.useState("12")
      return (
        <>
          <Code value={value} onValueChange={setValue} />
          <button type="button" onClick={() => setValue("")}>
            Reset
          </button>
          <output>{value}</output>
        </>
      )
    }
    render(<Controlled />)

    expect(inputs()[1].value).toBe("2")
    fireEvent.change(inputs()[2], { target: { value: "3" } })
    expect(screen.getByRole("status").textContent).toBe("123")
    fireEvent.click(screen.getByRole("button", { name: "Reset" }))
    expect(inputs().every((input) => input.value === "")).toBe(true)
  })

  it("moves focus back to the first slot when the code is cleared", () => {
    const { rerender } = render(
      <Code value="123456" onValueChange={() => {}} />
    )
    act(() => {
      inputs()[5].focus()
    })
    expect(document.activeElement).toBe(inputs()[5])

    rerender(<Code value="" onValueChange={() => {}} />)
    expect(document.activeElement).toBe(inputs()[0])
  })

  it("leaves focus alone when the code is cleared while focus is elsewhere", () => {
    const { rerender } = render(
      <>
        <Code value="123" onValueChange={() => {}} />
        <button type="button">Outside</button>
      </>
    )
    const outside = screen.getByRole("button", { name: "Outside" })
    act(() => {
      outside.focus()
    })
    rerender(
      <>
        <Code value="" onValueChange={() => {}} />
        <button type="button">Outside</button>
      </>
    )
    expect(document.activeElement).toBe(outside)
  })

  it("ignores edits when the parent refuses the value", () => {
    render(<Code value="12" onValueChange={() => {}} />)
    fireEvent.change(inputs()[2], { target: { value: "9" } })
    expect(inputs()[2].value).toBe("")
  })

  it("applies the separate variant and each size", () => {
    const { rerender } = render(<Code variant="separate" size="sm" />)

    expect(slots()[0].className).toContain("rounded-md")
    expect(slots()[0].className).toContain("size-8")
    expect(slots()[0].className).not.toContain("first:rounded-s-md")
    expect(
      document.querySelector("[data-slot=input-otp-group]")?.className
    ).toContain("gap-1.5")

    rerender(<Code variant="separate" size="lg" />)
    expect(slots()[0].className).toContain("size-10")
    expect(
      document.querySelector("[data-slot=input-otp-group]")?.className
    ).toContain("gap-2.5")
  })

  it("passes function class names the slot and root state", () => {
    render(
      <InputOTP
        length={2}
        defaultValue="4"
        aria-label="Code"
        className={(state) => (state.filled ? "root-filled" : "root-empty")}
      >
        <InputOTPSlot
          className={(state) =>
            state.filled ? `filled-${state.index}` : `empty-${state.index}`
          }
        />
        <InputOTPSlot
          className={(state) =>
            state.filled ? `filled-${state.index}` : `empty-${state.index}`
          }
        />
      </InputOTP>
    )

    expect(root().className).toContain("root-filled")
    expect(slots()[0].className).toContain("filled-0")
    expect(slots()[1].className).toContain("empty-1")
  })

  it("renders the root and a group as other elements", () => {
    render(
      <InputOTP length={1} aria-label="Code" render={<section />}>
        <InputOTPGroup render={<span />}>
          <InputOTPSlot />
        </InputOTPGroup>
      </InputOTP>
    )
    expect(root().tagName).toBe("SECTION")
    expect(document.querySelector("[data-slot=input-otp-group]")?.tagName).toBe(
      "SPAN"
    )
  })

  it("passes the root state to a render function", () => {
    const renderRoot = vi.fn(
      (props: React.ComponentProps<"div">, state: { value: string }) => (
        <div {...props} data-code-length={state.value.length} />
      )
    )
    render(
      <InputOTP
        length={1}
        defaultValue="7"
        aria-label="Code"
        render={renderRoot}
      >
        <InputOTPSlot />
      </InputOTP>
    )
    expect(renderRoot.mock.calls.at(-1)?.[1]).toMatchObject({
      value: "7",
      complete: true,
    })
  })

  it("flips arrow keys inside a right-to-left container", () => {
    render(
      <div dir="rtl">
        <Code defaultValue="123456" />
      </div>
    )
    const original = window.getComputedStyle
    vi.spyOn(window, "getComputedStyle").mockImplementation((element) => {
      const style = original(element)
      return element === root()
        ? ({ ...style, direction: "rtl" } as CSSStyleDeclaration)
        : style
    })

    act(() => {
      inputs()[2].focus()
    })
    fireEvent.keyDown(inputs()[2], { key: "ArrowLeft" })
    expect(document.activeElement).toBe(inputs()[3])
    fireEvent.keyDown(inputs()[3], { key: "ArrowRight" })
    expect(document.activeElement).toBe(inputs()[2])
  })

  it("never writes the code into a data attribute", () => {
    render(<Code defaultValue="123456" />)
    expect(root().outerHTML).not.toContain('data-value="123456"')
  })

  it("throws a clear error outside the root", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<InputOTPSlot />)).toThrow(
      "<InputOTPSlot> must be used within <InputOTP>."
    )
    expect(() => render(<InputOTPGroup />)).toThrow(
      "<InputOTPGroup> must be used within <InputOTP>."
    )
  })

  it("propagates aria-invalid from the root to every slot", () => {
    render(<Code aria-invalid />)
    expect(
      inputs().every((input) => input.getAttribute("aria-invalid") === "true")
    ).toBe(true)
    expect(root().hasAttribute("aria-invalid")).toBe(false)
  })

  it("disables every slot", () => {
    render(<Code disabled />)
    expect(inputs().every((input) => input.disabled)).toBe(true)
    expect(root().hasAttribute("data-disabled")).toBe(true)
  })
})

describe("InputOTP select all", () => {
  function selectAll(from = 5, modifier: "metaKey" | "ctrlKey" = "metaKey") {
    act(() => {
      inputs()[from].focus()
    })
    fireEvent.keyDown(inputs()[from], { key: "a", [modifier]: true })
  }

  function selectedSlots() {
    return slots().filter((slot) => slot.hasAttribute("data-selected")).length
  }

  it("selects every filled slot with Cmd+A or Ctrl+A and focuses the first", () => {
    render(<Code defaultValue="1234" />)
    selectAll(4)
    expect(selectedSlots()).toBe(4)
    expect(document.activeElement).toBe(inputs()[0])

    fireEvent.keyDown(inputs()[0], { key: "ArrowRight" })
    expect(selectedSlots()).toBe(0)

    selectAll(3, "ctrlKey")
    expect(selectedSlots()).toBe(4)
  })

  it("does nothing on an empty code", () => {
    render(<Code />)
    selectAll(0)
    expect(selectedSlots()).toBe(0)
  })

  it("clears everything with Backspace and lands on the first slot", () => {
    const onValueChange = vi.fn()
    render(<Code defaultValue="123456" onValueChange={onValueChange} />)
    selectAll()
    fireEvent.keyDown(inputs()[0], { key: "Backspace" })

    expect(inputs().every((input) => input.value === "")).toBe(true)
    expect(onValueChange).toHaveBeenLastCalledWith("", expect.anything())
    expect(document.activeElement).toBe(inputs()[0])
    expect(selectedSlots()).toBe(0)
  })

  it("clears everything with Delete", () => {
    render(<Code defaultValue="123456" />)
    selectAll()
    fireEvent.keyDown(inputs()[0], { key: "Delete" })
    expect(inputs().every((input) => input.value === "")).toBe(true)
  })

  it("replaces the whole code with a typed character, even the same one", () => {
    render(<Code defaultValue="123456" />)
    selectAll()
    fireEvent.keyDown(inputs()[0], { key: "1" })

    expect(
      inputs()
        .map((input) => input.value)
        .join("")
    ).toBe("1")
    expect(document.activeElement).toBe(inputs()[1])
  })

  it("ignores a rejected character and keeps the selection", () => {
    render(<Code defaultValue="123456" />)
    selectAll()
    fireEvent.keyDown(inputs()[0], { key: "x" })
    expect(
      inputs()
        .map((input) => input.value)
        .join("")
    ).toBe("123456")
    expect(selectedSlots()).toBe(6)
  })

  it("replaces the whole code with input that arrives without a key event", () => {
    render(<Code defaultValue="123456" />)
    selectAll()
    fireEvent.change(inputs()[0], { target: { value: "98" } })
    expect(
      inputs()
        .map((input) => input.value)
        .join("")
    ).toBe("98")
  })

  it("replaces the whole code on paste", () => {
    render(<Code defaultValue="123456" />)
    selectAll()
    fireEvent.paste(inputs()[0], {
      clipboardData: { getData: () => "77" },
    })
    expect(
      inputs()
        .map((input) => input.value)
        .join("")
    ).toBe("77")
    expect(document.activeElement).toBe(inputs()[2])
  })

  it("copies and cuts the whole code", () => {
    render(<Code defaultValue="123456" />)
    selectAll()
    const setData = vi.fn()
    fireEvent.copy(inputs()[0], { clipboardData: { setData } })
    expect(setData).toHaveBeenCalledWith("text/plain", "123456")
    expect(selectedSlots()).toBe(6)

    fireEvent.cut(inputs()[0], { clipboardData: { setData } })
    expect(setData).toHaveBeenCalledTimes(2)
    expect(inputs().every((input) => input.value === "")).toBe(true)
  })

  it("keeps the code while loading but still allows copying", () => {
    render(<Code defaultValue="123456" status="loading" />)
    selectAll()
    fireEvent.keyDown(inputs()[0], { key: "Backspace" })
    fireEvent.keyDown(inputs()[0], { key: "4" })
    expect(
      inputs()
        .map((input) => input.value)
        .join("")
    ).toBe("123456")
  })

  it("drops the selection on click and when focus leaves", () => {
    render(
      <>
        <Code defaultValue="1234" />
        <button type="button">Outside</button>
      </>
    )
    selectAll(4)
    fireEvent.mouseDown(inputs()[2])
    expect(selectedSlots()).toBe(0)

    selectAll(4)
    fireEvent.blur(inputs()[0], {
      relatedTarget: screen.getByRole("button", { name: "Outside" }),
    })
    expect(selectedSlots()).toBe(0)
  })

  it("works controlled", () => {
    function Controlled() {
      const [value, setValue] = React.useState("4321")
      return <Code value={value} onValueChange={setValue} />
    }
    render(<Controlled />)
    selectAll(4)
    fireEvent.keyDown(inputs()[0], { key: "Backspace" })
    expect(inputs().every((input) => input.value === "")).toBe(true)
  })
})

describe("InputOTP status", () => {
  it("does not render a live region without a status", () => {
    render(<Code />)
    expect(document.querySelector("[data-slot=input-otp-status]")).toBeNull()
  })

  it("locks the slots and announces while loading", () => {
    const { rerender } = render(<Code status="idle" defaultValue="123456" />)
    const region = document.querySelector("[data-slot=input-otp-status]")!

    expect(region.textContent).toBe("")
    expect(region.parentElement).not.toBe(root())

    rerender(<Code status="loading" defaultValue="123456" />)
    expect(root().getAttribute("aria-busy")).toBe("true")
    expect(inputs().every((input) => input.readOnly)).toBe(true)
    expect(slots()[0].getAttribute("data-status")).toBe("loading")
    expect(region.textContent).toBe("Verifying code")

    fireEvent.change(inputs()[0], { target: { value: "9" } })
    expect(inputs()[0].value).toBe("1")
  })

  it("marks slots invalid on error and announces it", () => {
    render(<Code status="error" errorLabel="Wrong code" />)

    expect(
      inputs().every((input) => input.getAttribute("aria-invalid") === "true")
    ).toBe(true)
    expect(
      document.querySelector("[data-slot=input-otp-status]")?.textContent
    ).toBe("Wrong code")
  })

  it("marks success and unlocks the slots", () => {
    render(<Code status="success" />)

    expect(slots()[0].getAttribute("data-status")).toBe("success")
    expect(inputs()[0].readOnly).toBe(false)
    expect(
      document.querySelector("[data-slot=input-otp-status]")?.textContent
    ).toBe("Code verified")
  })

  it("keeps a caller's readOnly after loading ends", () => {
    render(<Code status="idle" readOnly />)
    expect(inputs().every((input) => input.readOnly)).toBe(true)
  })

  it("shakes once when the status becomes error, only when animated", () => {
    vi.useFakeTimers()
    mockMotion()
    const { rerender } = render(<Code animated status="loading" />)

    rerender(<Code animated status="error" />)
    expect(root().hasAttribute("data-shake")).toBe(true)
    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(root().hasAttribute("data-shake")).toBe(false)

    rerender(<Code animated status="error" errorLabel="Still wrong" />)
    expect(root().hasAttribute("data-shake")).toBe(false)

    rerender(<Code status="idle" />)
    rerender(<Code status="error" />)
    expect(root().hasAttribute("data-shake")).toBe(false)
  })

  it("does not shake under reduced motion", () => {
    mockMotion(true)
    const { rerender } = render(<Code animated status="idle" />)
    rerender(<Code animated status="error" />)
    expect(root().hasAttribute("data-shake")).toBe(false)
  })
})

describe("InputOTP animation", () => {
  function charAnimations() {
    return calls.filter(
      (call) => call.element.getAttribute("data-slot") === "input-otp-char"
    )
  }

  function ghostAnimations() {
    return calls.filter(
      (call) => call.element.getAttribute("data-slot") === "input-otp-ghost"
    )
  }

  it("is off by default: no overlay, no motion, visible native text", () => {
    mockMotion()
    render(<Code />)
    fireEvent.change(inputs()[0], { target: { value: "123456" } })

    expect(document.querySelector("[data-slot=input-otp-char]")).toBeNull()
    expect(calls).toHaveLength(0)
    expect(inputs()[0].className).not.toContain("text-transparent")
  })

  it("draws characters in an aria-hidden overlay over a transparent input", () => {
    mockMotion()
    render(<Code animated defaultValue="12" />)
    const chars = document.querySelectorAll("[data-slot=input-otp-char]")

    expect(chars).toHaveLength(6)
    expect(chars[0].textContent).toBe("1")
    expect(chars[0].getAttribute("aria-hidden")).toBe("true")
    expect(inputs()[0].className).toContain("text-transparent")
    expect(calls).toHaveLength(0)
  })

  it("rises one typed character in without delay", () => {
    mockMotion()
    render(<Code animated />)
    fireEvent.change(inputs()[0], { target: { value: "4" } })

    expect(charAnimations()).toHaveLength(1)
    expect(charAnimations()[0].options.delay).toBe(0)
    expect(charAnimations()[0].keyframes[0]).toMatchObject({ opacity: 0 })
    expect(String(charAnimations()[0].keyframes[0].transform)).toContain(
      "translateY"
    )
  })

  it("cascades an autofilled code from the first changed slot", () => {
    mockMotion()
    render(<Code animated />)
    fireEvent.change(inputs()[0], { target: { value: "123456" } })

    expect(charAnimations().map((call) => call.options.delay)).toEqual([
      0, 45, 90, 135, 180, 225,
    ])
    expect(charAnimations()[0].options.fill).toBe("backwards")
  })

  it("cascades a paste from where it lands", () => {
    mockMotion()
    render(<Code animated defaultValue="12" />)
    fireEvent.change(inputs()[2], { target: { value: "3456" } })

    expect(charAnimations().map((call) => call.options.delay)).toEqual([
      0, 45, 90, 135,
    ])
  })

  it("cascades a code set from outside, such as the WebOTP API", () => {
    mockMotion()
    const { rerender } = render(<Code animated value="" />)
    rerender(<Code animated value="987654" />)
    expect(charAnimations()).toHaveLength(6)
    expect(charAnimations()[5].options.delay).toBe(225)
  })

  it("fades a deleted character down and slides the rest left", () => {
    mockMotion()
    render(<Code animated defaultValue="123456" />)

    fireEvent.keyDown(inputs()[2], { key: "Backspace" })

    expect(
      inputs()
        .map((input) => input.value)
        .join("")
    ).toBe("12456")
    const ghosts = ghostAnimations()
    expect(ghosts).toHaveLength(1)
    expect(ghosts[0].element.textContent).toBe("3")
    expect(String(ghosts[0].keyframes[1].transform)).toContain(
      "translateY(35%)"
    )
    const slides = charAnimations()
    expect(slides).toHaveLength(3)
    expect(
      slides.every((call) =>
        String(call.keyframes[0].transform).startsWith("translateX(")
      )
    ).toBe(true)
  })

  it("rolls the old character up when one is overwritten", () => {
    mockMotion()
    render(<Code animated defaultValue="12" />)
    fireEvent.change(inputs()[1], { target: { value: "7" } })

    const ghosts = ghostAnimations()
    expect(ghosts).toHaveLength(1)
    expect(ghosts[0].element.textContent).toBe("2")
    expect(String(ghosts[0].keyframes[1].transform)).toContain(
      "translateY(-35%)"
    )
    expect(charAnimations()).toHaveLength(1)
  })

  it("clears from the end backwards", () => {
    mockMotion()
    const { rerender } = render(<Code animated value="1234" />)
    rerender(<Code animated value="" />)

    const delays = ghostAnimations().map((call) => [
      call.element.textContent,
      call.options.delay,
    ])
    expect(delays).toEqual([
      ["1", 75],
      ["2", 50],
      ["3", 25],
      ["4", 0],
    ])
  })

  it("removes a ghost once its exit finishes", () => {
    mockMotion()
    render(<Code animated defaultValue="1" />)
    fireEvent.keyDown(inputs()[0], { key: "Backspace" })

    expect(
      document.querySelectorAll("[data-slot=input-otp-ghost]")
    ).toHaveLength(1)
    act(() => {
      ghostAnimations()[0].animation.onfinish?.()
    })
    expect(
      document.querySelectorAll("[data-slot=input-otp-ghost]")
    ).toHaveLength(0)
  })

  it("cancels running motion when a slot changes again or unmounts", () => {
    mockMotion()
    const { unmount } = render(<Code animated />)
    fireEvent.change(inputs()[0], { target: { value: "1" } })
    const first = charAnimations()[0]
    fireEvent.change(inputs()[0], { target: { value: "2" } })
    expect(first.animation.cancel).toHaveBeenCalled()

    const latest = charAnimations().at(-1)!
    unmount()
    expect(latest.animation.cancel).toHaveBeenCalled()
  })

  it("fades without movement or delay under reduced motion", () => {
    mockMotion(true)
    render(<Code animated defaultValue="123456" />)
    fireEvent.change(inputs()[0], { target: { value: "987654" } })

    expect(
      charAnimations().every(
        (call) =>
          call.options.delay === 0 &&
          call.keyframes.every((frame) => frame.transform === undefined)
      )
    ).toBe(true)

    calls = []
    fireEvent.keyDown(inputs()[2], { key: "Backspace" })
    expect(charAnimations()).toHaveLength(0)
  })

  it("shows a bullet in the overlay when masked", () => {
    mockMotion()
    render(<Code animated mask defaultValue="12" />)
    const chars = document.querySelectorAll("[data-slot=input-otp-char]")
    expect(chars[0].textContent).toBe("•")
    expect(inputs()[0].type).toBe("password")
  })

  it("drops ghosts when animation is switched off", () => {
    mockMotion()
    const { rerender } = render(<Code animated value="12" />)
    rerender(<Code animated value="1" />)
    expect(
      document.querySelectorAll("[data-slot=input-otp-ghost]")
    ).toHaveLength(1)
    rerender(<Code value="1" />)
    expect(
      document.querySelectorAll("[data-slot=input-otp-ghost]")
    ).toHaveLength(0)
  })

  it("renders on the server without animating the initial value", () => {
    const html = renderToString(<Code animated defaultValue="123" />)
    expect(html).toContain('data-slot="input-otp-char"')
    expect(html).toContain(">1</span>")
  })
})
