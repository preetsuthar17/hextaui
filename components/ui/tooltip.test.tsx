import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  createTooltipHandle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"

afterEach(() => {
  vi.useRealTimers()
  cleanup()
  document.body.innerHTML = ""
})

function slot(name: string) {
  return document.querySelector<HTMLElement>(`[data-slot="${name}"]`)
}

function openContent() {
  return document.querySelector<HTMLElement>(
    '[data-slot="tooltip-content"][data-open]'
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

async function leave(element: HTMLElement) {
  await act(async () => {
    fireEvent.pointerLeave(element, { pointerType: "mouse" })
    fireEvent.mouseLeave(element)
  })
}

function Basic({
  rootProps,
  triggerProps,
  contentProps,
}: {
  rootProps?: Partial<React.ComponentProps<typeof Tooltip>>
  triggerProps?: Partial<React.ComponentProps<typeof TooltipTrigger>>
  contentProps?: Partial<React.ComponentProps<typeof TooltipContent>>
}) {
  return (
    <Tooltip {...rootProps}>
      <TooltipTrigger aria-label="Undo" {...triggerProps}>
        U
      </TooltipTrigger>
      <TooltipContent {...contentProps}>Undo</TooltipContent>
    </Tooltip>
  )
}

describe("Tooltip", () => {
  it("renders a typed button trigger and nothing else until opened", () => {
    render(<Basic />)
    const trigger = screen.getByRole("button", { name: "Undo" })
    expect(trigger.dataset.slot).toBe("tooltip-trigger")
    expect(trigger.getAttribute("type")).toBe("button")
    expect(slot("tooltip-content")).toBeNull()
  })

  it("does not add a type to custom render elements", () => {
    render(<Basic triggerProps={{ render: <span tabIndex={0} /> }} />)
    const trigger = slot("tooltip-trigger")
    expect(trigger?.tagName).toBe("SPAN")
    expect(trigger?.hasAttribute("type")).toBe(false)
  })

  it("opens after the short default delay without a provider", async () => {
    vi.useFakeTimers()
    render(<Basic />)
    const trigger = screen.getByRole("button", { name: "Undo" })

    await hover(trigger)
    await advance(250)
    expect(openContent()).toBeNull()

    await advance(100)
    expect(openContent()?.textContent).toBe("Undo")
    expect(trigger.hasAttribute("data-popup-open")).toBe(true)
  })

  it("uses the provider delay and lets a trigger override it", async () => {
    vi.useFakeTimers()
    render(
      <TooltipProvider delay={800}>
        <Basic />
        <Tooltip>
          <TooltipTrigger aria-label="Fast" delay={50}>
            F
          </TooltipTrigger>
          <TooltipContent>Fast</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    await hover(screen.getByRole("button", { name: "Undo" }))
    await advance(500)
    expect(openContent()).toBeNull()
    await advance(400)
    expect(openContent()?.textContent).toBe("Undo")

    await leave(screen.getByRole("button", { name: "Undo" }))
    await advance(1000)
    await hover(screen.getByRole("button", { name: "Fast" }))
    await advance(60)
    expect(openContent()?.textContent).toBe("Fast")
  })

  it("switches instantly between tooltips that share a provider", async () => {
    vi.useFakeTimers()
    render(
      <TooltipProvider>
        <Basic />
        <Tooltip>
          <TooltipTrigger aria-label="Redo">R</TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    const undo = screen.getByRole("button", { name: "Undo" })
    const redo = screen.getByRole("button", { name: "Redo" })

    await hover(undo)
    await advance(350)
    expect(openContent()?.textContent).toBe("Undo")

    await leave(undo)
    await hover(redo)
    await advance(0)
    const content = openContent()
    expect(content?.textContent).toBe("Redo")
    expect(content?.dataset.instant).toBe("delay")
  })

  it("does not open from touch", async () => {
    vi.useFakeTimers()
    render(<Basic />)
    const trigger = screen.getByRole("button", { name: "Undo" })

    await act(async () => {
      fireEvent.pointerEnter(trigger, { pointerType: "touch" })
      fireEvent.pointerDown(trigger, { pointerType: "touch" })
      fireEvent.click(trigger)
    })
    await advance(1000)
    expect(openContent()).toBeNull()
  })

  it("closes on Escape and when the trigger is pressed", async () => {
    vi.useFakeTimers()
    render(<Basic />)
    const trigger = screen.getByRole("button", { name: "Undo" })

    await hover(trigger)
    await advance(350)
    expect(openContent()).not.toBeNull()

    await act(async () => {
      fireEvent.keyDown(document.body, { key: "Escape" })
    })
    await advance(300)
    expect(openContent()).toBeNull()

    await leave(trigger)
    await hover(trigger)
    await advance(350)
    expect(openContent()).not.toBeNull()
    await act(async () => {
      fireEvent.pointerDown(trigger, { pointerType: "mouse" })
      fireEvent.mouseDown(trigger)
      fireEvent.click(trigger)
    })
    await advance(300)
    expect(openContent()).toBeNull()
  })

  it("never opens while disabled", async () => {
    vi.useFakeTimers()
    render(<Basic rootProps={{ disabled: true }} />)
    const trigger = screen.getByRole("button", { name: "Undo" })
    await hover(trigger)
    await advance(1000)
    expect(openContent()).toBeNull()
    expect(trigger.hasAttribute("data-trigger-disabled")).toBe(true)
  })

  it("supports controlled open state and reports the reason", async () => {
    vi.useFakeTimers()
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <Basic rootProps={{ open: false, onOpenChange }} />
    )
    await hover(screen.getByRole("button", { name: "Undo" }))
    await advance(350)
    expect(onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: "trigger-hover" })
    )
    expect(openContent()).toBeNull()

    rerender(<Basic rootProps={{ open: true, onOpenChange }} />)
    await advance(0)
    expect(openContent()?.textContent).toBe("Undo")
  })

  it("places content on the requested side with an optional arrow", async () => {
    render(
      <Basic
        rootProps={{ defaultOpen: true }}
        contentProps={{ side: "bottom", arrow: true }}
      />
    )
    await act(async () => {})
    expect(slot("tooltip-positioner")?.dataset.side).toBe("bottom")
    expect(slot("tooltip-arrow")?.getAttribute("aria-hidden")).toBe("true")
  })

  it("merges function and string class names", async () => {
    render(
      <Basic
        rootProps={{ defaultOpen: true }}
        contentProps={{
          className: (state) => (state.open ? "is-open" : "is-closed"),
        }}
      />
    )
    await act(async () => {})
    const content = slot("tooltip-content")
    expect(content?.classList.contains("is-open")).toBe(true)
    expect(content?.classList.contains("bg-foreground")).toBe(true)
  })

  it("copies a right-to-left trigger direction to the portaled positioner", async () => {
    render(
      <div dir="rtl">
        <Basic rootProps={{ defaultOpen: true }} />
      </div>
    )
    await act(async () => {})
    expect(slot("tooltip-positioner")?.getAttribute("dir")).toBe("rtl")
  })

  it("shares one tooltip between detached triggers with payloads", async () => {
    vi.useFakeTimers()
    const handle = createTooltipHandle<string>()
    render(
      <>
        <TooltipTrigger handle={handle} payload="Ada" aria-label="Ada">
          A
        </TooltipTrigger>
        <TooltipTrigger handle={handle} payload="Grace" aria-label="Grace">
          G
        </TooltipTrigger>
        <Tooltip handle={handle}>
          {({ payload }) => <TooltipContent>{payload}</TooltipContent>}
        </Tooltip>
      </>
    )

    await hover(screen.getByRole("button", { name: "Grace" }))
    await advance(250)
    expect(openContent()).toBeNull()
    await advance(100)
    expect(openContent()?.textContent).toBe("Grace")
  })

  it("composes the user's ref", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Basic triggerProps={{ ref }} />)
    expect(ref.current?.dataset.slot).toBe("tooltip-trigger")
  })

  it("server renders only the trigger", () => {
    const html = renderToString(<Basic />)
    expect(html).toContain('data-slot="tooltip-trigger"')
    expect(html).not.toContain("tooltip-content")
  })
})
