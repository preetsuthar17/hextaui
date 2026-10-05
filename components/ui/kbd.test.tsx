import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Button } from "./button"
import { Kbd, KbdGroup } from "./kbd"

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function setPlatform(platform: string) {
  vi.stubGlobal("navigator", { ...navigator, platform, userAgent: platform })
}

function caps() {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-slot=kbd]"))
}

describe("Kbd", () => {
  it("renders a keycap by default with slot, variant and size", () => {
    render(<Kbd>K</Kbd>)
    const kbd = caps()[0]

    expect(kbd.tagName).toBe("KBD")
    expect(kbd.getAttribute("data-variant")).toBe("keycap")
    expect(kbd.getAttribute("data-size")).toBe("default")
    expect(kbd.textContent).toBe("K")
  })

  it("supports the flat variant and sizes", () => {
    render(
      <Kbd variant="flat" size="lg">
        Esc
      </Kbd>
    )
    expect(caps()[0].getAttribute("data-variant")).toBe("flat")
    expect(caps()[0].getAttribute("data-size")).toBe("lg")
  })

  it("formats keys for Apple platforms with spoken names", () => {
    setPlatform("MacIntel")
    render(<Kbd keys="mod+shift+p" />)

    const kbd = caps()[0]
    expect(kbd.querySelector("[aria-hidden]")?.textContent).toBe("⇧⌘P")
    expect(kbd.querySelector(".sr-only")?.textContent).toBe("Shift Command P")
  })

  it("formats keys for other platforms", () => {
    setPlatform("Win32")
    render(<Kbd keys="mod+k" />)

    const kbd = caps()[0]
    expect(kbd.querySelector("[aria-hidden]")?.textContent).toBe("Ctrl+K")
    expect(kbd.querySelector(".sr-only")?.textContent).toBe("Control K")
  })

  it("skips the hidden copy when the label is already a word", () => {
    render(<Kbd keys="tab" />)
    expect(caps()[0].textContent).toBe("Tab")
    expect(caps()[0].querySelector(".sr-only")).toBeNull()
  })
})

describe("KbdGroup", () => {
  it("splits a combo into caps and sequences with a separator", () => {
    setPlatform("MacIntel")
    render(<KbdGroup keys="g d" variant="flat" size="sm" />)

    const group = document.querySelector("[data-slot=kbd-group]")!
    expect(group.tagName).toBe("KBD")
    expect(caps().map((cap) => cap.textContent)).toEqual(["G", "D"])
    expect(caps().every((cap) => cap.dataset.variant === "flat")).toBe(true)
    expect(caps().every((cap) => cap.dataset.size === "sm")).toBe(true)
    expect(
      document.querySelector("[data-slot=kbd-separator]")?.textContent
    ).toBe("then")
  })

  it("renders one cap per key in a chord", () => {
    setPlatform("MacIntel")
    render(<KbdGroup keys="mod+k" />)
    expect(
      caps().map(
        (cap) =>
          cap.querySelector("[aria-hidden]")?.textContent ?? cap.textContent
      )
    ).toEqual(["⌘", "K"])
  })
})

describe("listen", () => {
  it("presses caps while the physical keys are held and never blocks them", () => {
    setPlatform("MacIntel")
    render(<KbdGroup keys="mod+k" listen />)
    const [mod, k] = caps()

    const down = new KeyboardEvent("keydown", {
      key: "Meta",
      code: "MetaLeft",
      cancelable: true,
    })
    act(() => {
      window.dispatchEvent(down)
    })
    expect(down.defaultPrevented).toBe(false)
    expect(mod.hasAttribute("data-pressed")).toBe(true)
    expect(k.hasAttribute("data-pressed")).toBe(false)

    act(() => {
      fireEvent.keyDown(window, { key: "k", code: "KeyK" })
    })
    expect(k.hasAttribute("data-pressed")).toBe(true)

    act(() => {
      fireEvent.keyUp(window, { key: "Meta", code: "MetaLeft" })
    })
    expect(mod.hasAttribute("data-pressed")).toBe(false)
    expect(k.hasAttribute("data-pressed")).toBe(false)
  })

  it("matches letters by physical key, so Option-modified letters still count", () => {
    render(<Kbd listen keys="p" />)
    act(() => {
      fireEvent.keyDown(window, { key: "π", code: "KeyP", altKey: true })
    })
    expect(caps()[0].hasAttribute("data-pressed")).toBe(true)
    act(() => {
      fireEvent.keyUp(window, { key: "π", code: "KeyP" })
    })
    expect(caps()[0].hasAttribute("data-pressed")).toBe(false)
  })

  it("releases everything when the window loses focus", () => {
    render(<Kbd listen>Shift</Kbd>)
    act(() => {
      fireEvent.keyDown(window, { key: "Shift", code: "ShiftLeft" })
    })
    expect(caps()[0].hasAttribute("data-pressed")).toBe(true)
    act(() => {
      fireEvent.blur(window)
    })
    expect(caps()[0].hasAttribute("data-pressed")).toBe(false)
  })

  it("does nothing without listen", () => {
    render(<Kbd>Shift</Kbd>)
    act(() => {
      fireEvent.keyDown(window, { key: "Shift", code: "ShiftLeft" })
    })
    expect(caps()[0].hasAttribute("data-pressed")).toBe(false)
    act(() => {
      fireEvent.keyUp(window, { key: "Shift", code: "ShiftLeft" })
    })
  })
})

describe("context", () => {
  it("renders inside a button and on the server", () => {
    render(
      <Button>
        Search <Kbd keys="mod+k" />
      </Button>
    )
    expect(
      screen.getByRole("button").querySelector("[data-slot=kbd]")
    ).toBeTruthy()

    const html = renderToString(<KbdGroup keys="mod+shift+p" listen />)
    expect(html).toContain('data-slot="kbd-group"')
    expect(html).not.toContain("data-pressed=")
  })
})

describe("hostile input", () => {
  it("survives empty, whitespace and plus-sign keys", () => {
    setPlatform("MacIntel")
    render(
      <>
        <Kbd keys="" />
        <Kbd keys="   " />
        <KbdGroup keys="mod++" />
        <KbdGroup keys="" />
      </>
    )

    const plus = caps().find((cap) => cap.textContent?.includes("+"))
    expect(plus?.textContent).toBe("+")
    expect(caps().map((cap) => cap.textContent)).not.toContain("undefined")
  })

  it("shares one listener across many caps and removes it on unmount", () => {
    const add = vi.spyOn(window, "addEventListener")
    const remove = vi.spyOn(window, "removeEventListener")
    const { unmount } = render(
      <KbdGroup listen>
        {Array.from({ length: 50 }, (_, index) => (
          <Kbd key={index}>A</Kbd>
        ))}
      </KbdGroup>
    )

    expect(add.mock.calls.filter(([type]) => type === "keydown")).toHaveLength(
      1
    )
    act(() => {
      fireEvent.keyDown(window, { key: "a", code: "KeyA" })
    })
    expect(caps().every((cap) => cap.hasAttribute("data-pressed"))).toBe(true)

    unmount()
    expect(
      remove.mock.calls.filter(([type]) => type === "keydown")
    ).toHaveLength(1)
    render(<Kbd listen>A</Kbd>)
    expect(caps()[0].hasAttribute("data-pressed")).toBe(false)
  })

  it("ignores key repeat", () => {
    render(<Kbd listen>A</Kbd>)
    act(() => {
      fireEvent.keyDown(window, { key: "a", code: "KeyA" })
      fireEvent.keyDown(window, { key: "a", code: "KeyA", repeat: true })
      fireEvent.keyUp(window, { key: "a", code: "KeyA" })
    })
    expect(caps()[0].hasAttribute("data-pressed")).toBe(false)
  })
})
