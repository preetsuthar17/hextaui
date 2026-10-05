import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  createPopoverHandle,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./popover"

afterEach(() => {
  cleanup()
  document.body.innerHTML = ""
})

function slot(name: string) {
  return document.querySelector<HTMLElement>(`[data-slot="${name}"]`)
}

function Basic({
  rootProps,
  contentProps,
  children,
}: {
  rootProps?: Partial<React.ComponentProps<typeof Popover>>
  contentProps?: Partial<React.ComponentProps<typeof PopoverContent>>
  children?: React.ReactNode
}) {
  return (
    <Popover {...rootProps}>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent {...contentProps}>
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the layer size.</PopoverDescription>
        </PopoverHeader>
        {children}
        <PopoverClose>Done</PopoverClose>
      </PopoverContent>
    </Popover>
  )
}

async function click(element: HTMLElement) {
  await act(async () => {
    fireEvent.click(element, { detail: 1 })
  })
}

describe("Popover", () => {
  it("opens from the trigger as a labelled dialog", async () => {
    render(<Basic />)
    const trigger = screen.getByRole("button", { name: "Open" })
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog")
    expect(slot("popover-content")).toBeNull()

    await click(trigger)

    const dialog = screen.getByRole("dialog")
    expect(dialog.dataset.slot).toBe("popover-content")
    expect(dialog.getAttribute("aria-labelledby")).toBe(
      screen.getByText("Dimensions").id
    )
    expect(dialog.getAttribute("aria-describedby")).toBe(
      screen.getByText("Set the layer size.").id
    )
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
    expect(trigger.hasAttribute("data-popup-open")).toBe(true)
  })

  it("wraps content in a sizer that inherits the gap", async () => {
    render(<Basic rootProps={{ defaultOpen: true }} />)
    const sizer = slot("popover-content-sizer")!
    expect(sizer.parentElement).toBe(slot("popover-content"))
    expect(sizer.className).toContain("gap-[inherit]")
    expect(sizer.firstElementChild?.getAttribute("data-slot")).toBe(
      "popover-header"
    )
  })

  it("closes from PopoverClose and Escape", async () => {
    const onOpenChange = vi.fn()
    render(<Basic rootProps={{ onOpenChange }} />)
    await click(screen.getByRole("button", { name: "Open" }))
    await click(screen.getByRole("button", { name: "Done" }))
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.anything())
    expect(onOpenChange.mock.lastCall?.[1].reason).toBe("close-press")

    await click(screen.getByRole("button", { name: "Open" }))
    await act(async () => {
      fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" })
    })
    expect(onOpenChange.mock.lastCall?.[1].reason).toBe("escape-key")
  })

  it("supports controlled open state", async () => {
    function Controlled() {
      const [open, setOpen] = React.useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            External
          </button>
          <Basic rootProps={{ open, onOpenChange: setOpen }} />
        </>
      )
    }
    render(<Controlled />)
    await click(screen.getByRole("button", { name: "External" }))
    expect(slot("popover-content")).not.toBeNull()
  })

  it("lets onOpenChange cancel opening", async () => {
    render(
      <Basic rootProps={{ onOpenChange: (_, details) => details.cancel() }} />
    )
    await click(screen.getByRole("button", { name: "Open" }))
    expect(slot("popover-content")).toBeNull()
  })

  it("passes positioning props to the positioner", async () => {
    render(
      <Basic
        rootProps={{ defaultOpen: true }}
        contentProps={{ side: "top", align: "start" }}
      />
    )
    const positioner = slot("popover-positioner")!
    expect(positioner.getAttribute("data-side")).toBe("top")
    expect(positioner.getAttribute("data-align")).toBe("start")
  })

  it("merges className strings and functions", async () => {
    const { rerender } = render(
      <Basic
        rootProps={{ defaultOpen: true }}
        contentProps={{ className: "w-80 p-0" }}
      />
    )
    const content = slot("popover-content")!
    const classes = content.className.split(" ")
    expect(classes).toContain("w-80")
    expect(classes).toContain("p-0")
    expect(classes).not.toContain("w-72")
    expect(classes).not.toContain("p-2.5")
    expect(classes).toContain("gap-2.5")

    rerender(
      <Basic
        rootProps={{ defaultOpen: true }}
        contentProps={{
          className: (state) => (state.open ? "is-open" : "is-closed"),
        }}
      />
    )
    expect(slot("popover-content")!.className).toContain("is-open")
    expect(slot("popover-content")!.className).toContain("rounded-lg")
  })

  it("opens from a detached trigger with a payload", async () => {
    const handle = createPopoverHandle<{ name: string }>()
    render(
      <>
        <PopoverTrigger handle={handle} payload={{ name: "Ada" }}>
          Ada
        </PopoverTrigger>
        <PopoverTrigger handle={handle} payload={{ name: "Grace" }}>
          Grace
        </PopoverTrigger>
        <Popover handle={handle}>
          {({ payload }) => (
            <PopoverContent>
              <PopoverTitle>{payload?.name}</PopoverTitle>
            </PopoverContent>
          )}
        </Popover>
      </>
    )
    await click(screen.getByRole("button", { name: "Grace" }))
    expect(screen.getByRole("dialog").textContent).toContain("Grace")
  })

  it("keeps a nested popover open without closing its parent", async () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Parent</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Parent content</PopoverTitle>
          <Popover>
            <PopoverTrigger>Child</PopoverTrigger>
            <PopoverContent>
              <PopoverTitle>Child content</PopoverTitle>
            </PopoverContent>
          </Popover>
        </PopoverContent>
      </Popover>
    )
    await click(screen.getByRole("button", { name: "Child" }))
    expect(screen.getByText("Child content")).toBeTruthy()
    expect(screen.getByText("Parent content")).toBeTruthy()
  })

  it("sets the direction on the positioner so alignment flips in RTL", async () => {
    render(
      <DirectionProvider direction="rtl">
        <Basic rootProps={{ defaultOpen: true }} />
      </DirectionProvider>
    )
    expect(slot("popover-positioner")!.getAttribute("dir")).toBe("rtl")
    cleanup()
    render(<Basic rootProps={{ defaultOpen: true }} />)
    expect(slot("popover-positioner")!.hasAttribute("dir")).toBe(false)
  })

  it("cleans up its observer, timers and listeners when unmounted open", async () => {
    vi.useFakeTimers()
    const disconnect = vi.fn()
    const observe = vi.fn()
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe = observe
        disconnect = disconnect
        unobserve() {}
      }
    )
    const { unmount } = render(<Basic rootProps={{ defaultOpen: true }} />)
    expect(observe).toHaveBeenCalledWith(slot("popover-content-sizer"))
    unmount()
    expect(disconnect).toHaveBeenCalled()
    expect(() => vi.runAllTimers()).not.toThrow()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it("renders on the server", () => {
    expect(() =>
      renderToString(<Basic rootProps={{ defaultOpen: true }} />)
    ).not.toThrow()
  })
})
