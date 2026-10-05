import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  createHoverCardHandle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./hover-card"

afterEach(() => {
  vi.useRealTimers()
  cleanup()
  document.body.innerHTML = ""
})

function slot(name: string) {
  return document.querySelector<HTMLElement>(`[data-slot="${name}"]`)
}

function Basic({
  rootProps,
  triggerProps,
  contentProps,
}: {
  rootProps?: Partial<React.ComponentProps<typeof HoverCard>>
  triggerProps?: Partial<React.ComponentProps<typeof HoverCardTrigger>>
  contentProps?: Partial<React.ComponentProps<typeof HoverCardContent>>
}) {
  return (
    <HoverCard {...rootProps}>
      <HoverCardTrigger href="/profile" {...triggerProps}>
        @hextaui
      </HoverCardTrigger>
      <HoverCardContent {...contentProps}>Profile preview</HoverCardContent>
    </HoverCard>
  )
}

async function advance(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms)
  })
}

async function hover(element: HTMLElement, pointerType = "mouse") {
  await act(async () => {
    fireEvent.pointerEnter(element, { pointerType })
    fireEvent.mouseEnter(element)
    fireEvent.mouseMove(element)
  })
}

describe("HoverCard", () => {
  it("renders the trigger as a link and nothing else until opened", () => {
    render(<Basic />)
    const trigger = screen.getByRole("link", { name: "@hextaui" })
    expect(trigger.dataset.slot).toBe("hover-card-trigger")
    expect(trigger.getAttribute("href")).toBe("/profile")
    expect(slot("hover-card-content")).toBeNull()
  })

  it("opens after the hover delay, not before", async () => {
    vi.useFakeTimers()
    render(<Basic />)
    const trigger = screen.getByRole("link", { name: "@hextaui" })

    await hover(trigger)
    await advance(500)
    expect(slot("hover-card-content")).toBeNull()

    await advance(200)
    expect(slot("hover-card-content")?.textContent).toBe("Profile preview")
    expect(trigger.hasAttribute("data-popup-open")).toBe(true)
  })

  it("respects a custom delay on the trigger", async () => {
    vi.useFakeTimers()
    render(<Basic triggerProps={{ delay: 100 }} />)

    await hover(screen.getByRole("link", { name: "@hextaui" }))
    await advance(120)
    expect(slot("hover-card-content")).not.toBeNull()
  })

  it("does not open from a touch hover", async () => {
    vi.useFakeTimers()
    render(<Basic triggerProps={{ delay: 0 }} />)

    await hover(screen.getByRole("link", { name: "@hextaui" }), "touch")
    await advance(1000)
    expect(slot("hover-card-content")).toBeNull()
  })

  it("closes on Escape and reports the reason", async () => {
    const onOpenChange = vi.fn()
    render(<Basic rootProps={{ defaultOpen: true, onOpenChange }} />)
    expect(slot("hover-card-content")).not.toBeNull()

    await act(async () => {
      fireEvent.keyDown(document.body, { key: "Escape" })
    })

    expect(onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: "escape-key" })
    )
  })

  it("supports controlled open state", async () => {
    function Controlled() {
      const [open, setOpen] = React.useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Show
          </button>
          <Basic rootProps={{ open, onOpenChange: setOpen }} />
        </>
      )
    }
    render(<Controlled />)
    expect(slot("hover-card-content")).toBeNull()

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Show" }))
    })
    expect(slot("hover-card-content")).not.toBeNull()
  })

  it("positions with the defaults and lets callers override them", () => {
    render(<Basic rootProps={{ defaultOpen: true }} />)
    const positioner = slot("hover-card-positioner")!
    expect(positioner.getAttribute("data-side")).toBe("bottom")
    expect(positioner.getAttribute("data-align")).toBe("center")
    cleanup()

    render(
      <Basic
        rootProps={{ defaultOpen: true }}
        contentProps={{ side: "top", align: "start" }}
      />
    )
    const moved = slot("hover-card-positioner")!
    expect(moved.getAttribute("data-side")).toBe("top")
    expect(moved.getAttribute("data-align")).toBe("start")
  })

  it("merges string and function class names", () => {
    render(
      <Basic
        rootProps={{ defaultOpen: true }}
        contentProps={{ className: "w-80" }}
      />
    )
    const content = slot("hover-card-content")!
    expect(content.className).toContain("w-80")
    expect(content.className).not.toMatch(/(^| )w-64( |$)/)
    expect(content.className).toContain("rounded-lg")
    cleanup()

    render(
      <Basic
        rootProps={{ defaultOpen: true }}
        contentProps={{ className: (state) => (state.open ? "is-open" : "") }}
      />
    )
    const fn = slot("hover-card-content")!
    expect(fn.className).toContain("is-open")
    expect(fn.className).toContain("rounded-lg")
  })

  it("puts dir on the positioner when the trigger sits in an RTL subtree", async () => {
    vi.useFakeTimers()
    render(
      <div dir="rtl">
        <Basic triggerProps={{ delay: 0 }} />
      </div>
    )

    await hover(screen.getByRole("link", { name: "@hextaui" }))
    await advance(50)
    expect(slot("hover-card-positioner")?.getAttribute("dir")).toBe("rtl")
  })

  it("opens a shared card from detached triggers with their payload", async () => {
    vi.useFakeTimers()
    const handle = createHoverCardHandle<{ name: string }>()
    render(
      <>
        <HoverCardTrigger handle={handle} payload={{ name: "Ada" }} delay={0}>
          Ada
        </HoverCardTrigger>
        <HoverCardTrigger handle={handle} payload={{ name: "Grace" }} delay={0}>
          Grace
        </HoverCardTrigger>
        <HoverCard handle={handle}>
          {({ payload }) => (
            <HoverCardContent>{`Hello ${payload?.name ?? ""}`}</HoverCardContent>
          )}
        </HoverCard>
      </>
    )

    await hover(screen.getByText("Grace"))
    await advance(50)
    expect(slot("hover-card-content")?.textContent).toBe("Hello Grace")
  })

  it("keeps long unbroken content inside the card", () => {
    render(
      <HoverCard defaultOpen>
        <HoverCardTrigger href="#">Trigger</HoverCardTrigger>
        <HoverCardContent>{"x".repeat(400)}</HoverCardContent>
      </HoverCard>
    )
    const content = slot("hover-card-content")!
    expect(content.className).toContain("wrap-anywhere")
    expect(content.className).toContain("max-w-(--available-width)")
    expect(content.className).toContain("max-h-(--available-height)")
  })

  it("server renders the trigger without the card", () => {
    const html = renderToString(<Basic />)
    expect(html).toContain('data-slot="hover-card-trigger"')
    expect(html).not.toContain("Profile preview")
  })
})

describe("structure", () => {
  it("wraps content in a viewport and body", () => {
    render(<Basic rootProps={{ defaultOpen: true }} />)

    const body = slot("hover-card-body")!
    expect(body.textContent).toBe("Profile preview")
    expect(body.closest("[data-slot=hover-card-viewport]")).toBeTruthy()
    expect(slot("hover-card-arrow")).toBeNull()
  })

  it("adds an arrow on request", () => {
    render(
      <Basic rootProps={{ defaultOpen: true }} contentProps={{ arrow: true }} />
    )

    const arrow = slot("hover-card-arrow")!
    expect(arrow).toBeTruthy()
    expect(arrow.closest("[data-slot=hover-card-content]")).toBeNull()
    expect(arrow.closest("[data-slot=hover-card-positioner]")).toBeTruthy()
  })
})
