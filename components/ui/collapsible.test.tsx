import * as React from "react"
import { act, cleanup, fireEvent, render } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleTriggerIcon,
} from "./collapsible"

afterEach(() => {
  cleanup()
})

function Basic(props: React.ComponentProps<typeof Collapsible>) {
  return (
    <Collapsible {...props}>
      <CollapsibleTrigger>
        Toggle
        <CollapsibleTriggerIcon />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-2">Body</CollapsibleContent>
    </Collapsible>
  )
}

function parts(container: HTMLElement) {
  const q = (slot: string) =>
    container.querySelector<HTMLElement>(`[data-slot="${slot}"]`)
  return {
    root: q("collapsible"),
    trigger: q("collapsible-trigger")!,
    icon: q("collapsible-trigger-icon"),
    content: q("collapsible-content"),
    inner: q("collapsible-content-inner"),
  }
}

describe("Collapsible", () => {
  it("renders every slot and keeps the closed panel findable", () => {
    const { container } = render(<Basic />)
    const { root, trigger, icon, content, inner } = parts(container)

    expect(root).not.toBeNull()
    expect(trigger.tagName).toBe("BUTTON")
    expect(trigger.getAttribute("aria-expanded")).toBe("false")
    expect(icon?.getAttribute("aria-hidden")).toBe("true")
    expect(icon?.querySelector("svg")).not.toBeNull()
    expect(content?.getAttribute("hidden")).toBe("until-found")
    expect(inner?.className).toContain("px-2")
    expect(content?.className).not.toContain("px-2")
  })

  it("unmounts the closed panel when hiddenUntilFound is off", () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent hiddenUntilFound={false}>Body</CollapsibleContent>
      </Collapsible>
    )

    expect(parts(container).content).toBeNull()
  })

  it("toggles on click and reports the change", () => {
    const onOpenChange = vi.fn()
    const { container } = render(<Basic onOpenChange={onOpenChange} />)
    const { trigger } = parts(container)

    fireEvent.click(trigger)

    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything())
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
    expect(trigger.hasAttribute("data-panel-open")).toBe(true)
    expect(parts(container).content?.hasAttribute("hidden")).toBe(false)
    expect(trigger.getAttribute("aria-controls")).toBe(
      parts(container).content?.id
    )
  })

  it("follows the controlled open prop", () => {
    function Controlled() {
      const [open, setOpen] = React.useState(true)
      return (
        <>
          <button type="button" onClick={() => setOpen(false)}>
            external
          </button>
          <Basic open={open} onOpenChange={setOpen} />
        </>
      )
    }
    const { container, getByText } = render(<Controlled />)

    expect(parts(container).trigger.getAttribute("aria-expanded")).toBe("true")
    fireEvent.click(getByText("external"))
    expect(parts(container).trigger.getAttribute("aria-expanded")).toBe("false")
  })

  it("ignores presses while disabled", () => {
    const onOpenChange = vi.fn()
    const { container } = render(<Basic disabled onOpenChange={onOpenChange} />)

    fireEvent.click(parts(container).trigger)

    expect(onOpenChange).not.toHaveBeenCalled()
    expect(parts(container).trigger.getAttribute("aria-expanded")).toBe("false")
  })

  it("keeps a function className on the trigger and adds the group", () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger
          className={(state) => (state.open ? "is-open" : "is-closed")}
        >
          Toggle
        </CollapsibleTrigger>
      </Collapsible>
    )
    const { trigger } = parts(container)

    expect(trigger.className).toContain("is-open")
    expect(trigger.className).toContain("group/collapsible-trigger")
  })

  it("renders the trigger as another element", () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger
          nativeButton={false}
          render={<span className="underline" />}
        >
          Toggle
        </CollapsibleTrigger>
      </Collapsible>
    )
    const { trigger } = parts(container)

    expect(trigger.tagName).toBe("SPAN")
    expect(trigger.getAttribute("role")).toBe("button")
    expect(trigger.className).toContain("underline")
  })

  it("replaces the icon with children and keeps its slot", () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger>
          <CollapsibleTriggerIcon data-slot="nope" className="text-primary">
            <i data-testid="custom" />
          </CollapsibleTriggerIcon>
        </CollapsibleTrigger>
      </Collapsible>
    )
    const icon = parts(container).icon

    expect(icon).not.toBeNull()
    expect(icon?.className).toContain("text-primary")
    expect(icon?.querySelector("[data-testid=custom]")).not.toBeNull()
    expect(icon?.querySelector("svg")).toBeNull()
  })

  it("forwards refs to the panel and releases them on unmount", () => {
    const objectRef = React.createRef<HTMLDivElement>()
    const callbackRef = vi.fn()
    const { unmount } = render(
      <Collapsible defaultOpen>
        <CollapsibleContent ref={objectRef}>Body</CollapsibleContent>
        <CollapsibleContent ref={callbackRef}>Body</CollapsibleContent>
      </Collapsible>
    )

    expect(objectRef.current?.dataset.slot).toBe("collapsible-content")
    expect(callbackRef).toHaveBeenCalledWith(expect.any(HTMLDivElement))

    unmount()

    expect(objectRef.current).toBeNull()
    expect(callbackRef).toHaveBeenLastCalledWith(null)
  })

  it("measures the parent gap on the side the panel collapses into", () => {
    const { container } = render(
      <Collapsible className="flex flex-col">
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Body</CollapsibleContent>
      </Collapsible>
    )
    const { root } = parts(container)
    root!.style.display = "flex"
    root!.style.flexDirection = "column"
    root!.style.rowGap = "8px"

    act(() => {
      root!.appendChild(document.createElement("div"))
    })

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const content = parts(container).content!
        expect(content.style.getPropertyValue("--collapsible-gap-start")).toBe(
          "8px"
        )
        expect(content.style.getPropertyValue("--collapsible-gap-end")).toBe(
          "0px"
        )
        resolve()
      })
    })
  })

  it("collapses into the next gap when the panel comes first", () => {
    const { container } = render(
      <div>
        <Collapsible defaultOpen>
          <CollapsibleContent>Body</CollapsibleContent>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        </Collapsible>
      </div>
    )
    const { root } = parts(container)
    root!.style.display = "grid"
    root!.style.rowGap = "12px"

    act(() => {
      root!.appendChild(document.createElement("div"))
    })

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const content = parts(container).content!
        expect(content.style.getPropertyValue("--collapsible-gap-start")).toBe(
          "0px"
        )
        expect(content.style.getPropertyValue("--collapsible-gap-end")).toBe(
          "12px"
        )
        resolve()
      })
    })
  })

  it("ignores gaps of horizontal parents", () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Body</CollapsibleContent>
      </Collapsible>
    )
    const { root } = parts(container)
    root!.style.display = "flex"
    root!.style.rowGap = "8px"

    act(() => {
      root!.appendChild(document.createElement("div"))
    })

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(
          parts(container).content!.style.getPropertyValue(
            "--collapsible-gap-start"
          )
        ).toBe("0px")
        resolve()
      })
    })
  })

  it("throws a readable error when parts are used outside the root", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() =>
      render(<CollapsibleTrigger>Toggle</CollapsibleTrigger>)
    ).toThrow()
    spy.mockRestore()
  })

  it("renders on the server without touching the DOM", () => {
    const html = renderToString(<Basic defaultOpen />)

    expect(html).toContain('data-slot="collapsible-content"')
    expect(html).toContain('aria-expanded="true"')
  })

  it("disconnects its observers when the panel unmounts", () => {
    const disconnect = vi.spyOn(MutationObserver.prototype, "disconnect")
    const { unmount } = render(<Basic />)

    unmount()

    expect(disconnect).toHaveBeenCalled()
  })

  it("syncs the gap without leaving a transition override behind", async () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent style={{ transition: "opacity 1s" }}>
          Body
        </CollapsibleContent>
      </Collapsible>
    )
    const { root } = parts(container)
    root!.style.display = "flex"
    root!.style.flexDirection = "column"
    root!.style.rowGap = "8px"

    act(() => {
      root!.appendChild(document.createElement("div"))
    })
    await new Promise((resolve) => setTimeout(resolve))

    const content = parts(container).content!
    expect(content.style.getPropertyValue("--collapsible-gap-start")).toBe(
      "8px"
    )
    expect(content.style.getPropertyValue("transition")).toBe("opacity 1s")
    expect(content.style.getPropertyPriority("transition")).toBe("")
  })

  it("warns instead of crashing when switched to controlled", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    const { container, rerender } = render(<Basic />)

    fireEvent.click(parts(container).trigger)
    rerender(<Basic open={false} />)

    expect(parts(container).trigger.getAttribute("aria-expanded")).toBe("true")
    expect(spy.mock.calls.flat().join(" ")).toMatch(/uncontrolled/i)
    spy.mockRestore()
  })
})
