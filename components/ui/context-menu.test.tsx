import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./context-menu"

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  document.body.innerHTML = ""
})

function slot(name: string) {
  return document.querySelector<HTMLElement>(`[data-slot="${name}"]`)
}

function Basic({
  onBack,
  rootProps,
  triggerProps,
}: {
  onBack?: (event: React.MouseEvent) => void
  rootProps?: Partial<React.ComponentProps<typeof ContextMenu>>
  triggerProps?: Partial<React.ComponentProps<typeof ContextMenuTrigger>>
}) {
  return (
    <ContextMenu {...rootProps}>
      <ContextMenuTrigger {...triggerProps}>Area</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Standalone</ContextMenuLabel>
        <ContextMenuItem onClick={onBack}>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>People</ContextMenuLabel>
          <ContextMenuItem inset>Ada</ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}

async function open() {
  await act(async () => {
    fireEvent.contextMenu(screen.getByText("Area"), {
      clientX: 40,
      clientY: 40,
    })
  })
}

describe("ContextMenu", () => {
  it("opens at the pointer and marks the trigger", async () => {
    render(<Basic />)
    expect(slot("context-menu-content")).toBeNull()
    await open()
    expect(slot("context-menu-content")?.getAttribute("role")).toBe("menu")
    expect(slot("context-menu-trigger")?.hasAttribute("data-popup-open")).toBe(
      true
    )
    expect(screen.getAllByRole("menuitem")).toHaveLength(3)
  })

  it("renders variant, inset and shortcut hooks", async () => {
    render(<Basic />)
    await open()
    const del = screen.getByRole("menuitem", { name: "Delete" })
    expect(del.getAttribute("data-variant")).toBe("destructive")
    expect(
      screen.getByRole("menuitem", { name: "Ada" }).hasAttribute("data-inset")
    ).toBe(true)
    expect(slot("context-menu-shortcut")?.hasAttribute("dir")).toBe(false)
    expect(
      slot("context-menu-shortcut")?.firstElementChild?.getAttribute("dir")
    ).toBe("ltr")
  })

  it("labels a group and allows a standalone label", async () => {
    render(<Basic />)
    await open()
    const group = screen.getByRole("group")
    const label = screen.getByText("People")
    expect(group.getAttribute("aria-labelledby")).toBe(label.id)
    expect(screen.getByText("Standalone").dataset.slot).toBe(
      "context-menu-label"
    )
  })

  it("runs the item action and closes", async () => {
    const onBack = vi.fn()
    const onOpenChange = vi.fn()
    render(<Basic onBack={onBack} rootProps={{ onOpenChange }} />)
    await open()
    await act(async () => {
      fireEvent.click(screen.getByRole("menuitem", { name: /Back/ }), {
        detail: 1,
      })
    })
    expect(onBack).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.anything())
  })

  it("marks the chosen item for the blink while the menu exits", async () => {
    render(
      <Basic
        rootProps={{
          onOpenChange: (open, details) => {
            if (!open) {
              details.cancel()
            }
          },
        }}
      />
    )
    await open()
    const back = screen.getByRole("menuitem", { name: /Back/ })
    await act(async () => {
      fireEvent.click(back, { detail: 1 })
    })
    expect(back.hasAttribute("data-chosen")).toBe(true)
    expect(slot("context-menu-content")?.hasAttribute("data-chosen")).toBe(true)
    expect(
      screen
        .getByRole("menuitem", { name: "Delete" })
        .hasAttribute("data-chosen")
    ).toBe(false)
  })

  it("does not blink for keyboard activation or prevented handlers", async () => {
    render(
      <Basic
        onBack={(event) =>
          (
            event as React.MouseEvent & { preventBaseUIHandler: () => void }
          ).preventBaseUIHandler()
        }
      />
    )
    await open()
    const back = screen.getByRole("menuitem", { name: /Back/ })
    await act(async () => {
      fireEvent.click(back, { detail: 1 })
    })
    expect(slot("context-menu-content")).not.toBeNull()
    expect(back.hasAttribute("data-chosen")).toBe(false)
    await act(async () => {
      fireEvent.click(back, { detail: 0 })
    })
    expect(back.hasAttribute("data-chosen")).toBe(false)
  })

  it("resets the chosen mark when reopened", async () => {
    render(<Basic />)
    await open()
    await act(async () => {
      fireEvent.click(screen.getByRole("menuitem", { name: /Back/ }), {
        detail: 1,
      })
    })
    await open()
    expect(
      screen.getByRole("menuitem", { name: /Back/ }).hasAttribute("data-chosen")
    ).toBe(false)
    expect(slot("context-menu-content")?.hasAttribute("data-chosen")).toBe(
      false
    )
  })

  it("keeps the menu open for checkbox and radio items", async () => {
    const onCheckedChange = vi.fn()
    const onValueChange = vi.fn()
    render(
      <ContextMenu>
        <ContextMenuTrigger>Area</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem onCheckedChange={onCheckedChange}>
            Grid
          </ContextMenuCheckboxItem>
          <ContextMenuRadioGroup defaultValue="a" onValueChange={onValueChange}>
            <ContextMenuLabel>Sort</ContextMenuLabel>
            <ContextMenuRadioItem value="a">Name</ContextMenuRadioItem>
            <ContextMenuRadioItem value="b">Date</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    )
    await open()
    const grid = screen.getByRole("menuitemcheckbox", { name: "Grid" })
    await act(async () => {
      fireEvent.click(grid, { detail: 1 })
    })
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
    expect(grid.getAttribute("aria-checked")).toBe("true")
    expect(grid.hasAttribute("data-chosen")).toBe(false)
    expect(
      slot("context-menu-checkbox-item-indicator")?.hasAttribute("data-checked")
    ).toBe(true)

    await act(async () => {
      fireEvent.click(screen.getByRole("menuitemradio", { name: "Date" }), {
        detail: 1,
      })
    })
    expect(onValueChange).toHaveBeenCalledWith("b", expect.anything())
    expect(slot("context-menu-content")).not.toBeNull()
  })

  it("does nothing when disabled", async () => {
    vi.useFakeTimers()
    render(<Basic rootProps={{ disabled: true }} />)
    const trigger = slot("context-menu-trigger")!
    fireEvent.contextMenu(trigger)
    fireEvent.touchStart(trigger, { touches: [{ clientX: 5, clientY: 5 }] })
    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(slot("context-menu-content")).toBeNull()
    expect(trigger.hasAttribute("data-holding")).toBe(false)
  })

  it("composes user handlers on the trigger", async () => {
    const onContextMenu = vi.fn()
    render(<Basic triggerProps={{ onContextMenu }} />)
    await open()
    expect(onContextMenu).toHaveBeenCalledTimes(1)
    expect(slot("context-menu-content")).not.toBeNull()
  })

  it("passes a className function the part state", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger
          className={(state) => (state.open ? "is-open" : "is-closed")}
        >
          Area
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            className={(state) => (state.disabled ? "off" : "on")}
            disabled
          >
            Item
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
    const trigger = slot("context-menu-trigger")!
    expect(trigger.className).toContain("is-closed")
    expect(trigger.className).toContain("select-none")
    await open()
    expect(trigger.className).toContain("is-open")
    expect(slot("context-menu-item")?.className).toContain("off")
    expect(slot("context-menu-item")?.className).toContain("rounded-")
  })

  it("animates right-click opens even though Base UI marks them instant", async () => {
    render(<Basic />)
    await open()
    const content = slot("context-menu-content")!
    expect(content.getAttribute("data-instant")).toBe("click")
    const classes = content.className.split(" ")
    expect(classes).not.toContain("data-instant:transition-none")
    expect(classes).toContain("data-ending-style:data-instant:transition-none")
    expect(classes).toContain(
      "motion-safe:data-[chosen]:data-ending-style:delay-120"
    )
  })

  it("sets RTL on the positioner so alignment flips", async () => {
    render(
      <DirectionProvider direction="rtl">
        <Basic />
      </DirectionProvider>
    )
    await open()
    expect(slot("context-menu-positioner")?.getAttribute("dir")).toBe("rtl")
    expect(slot("context-menu-content")?.closest("[dir=rtl]")).not.toBeNull()
  })

  it("opens a submenu from the keyboard", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Area</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Email</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    )
    await open()
    const share = screen.getByRole("menuitem", { name: "Share" })
    expect(share.getAttribute("aria-haspopup")).toBe("menu")
    await act(async () => {
      share.focus()
      fireEvent.keyDown(share, { key: "ArrowRight" })
    })
    expect(slot("context-menu-sub-content")).not.toBeNull()
    expect(screen.getByRole("menuitem", { name: "Email" })).toBeTruthy()
  })

  it("throws a clear error outside the root", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<ContextMenuTrigger>Area</ContextMenuTrigger>)).toThrow(
      "ContextMenuTrigger must be used within <ContextMenu>."
    )
  })

  it("renders on the server", () => {
    expect(() => renderToString(<Basic />)).not.toThrow()
  })
})

describe("ContextMenuTrigger hold feedback", () => {
  function touch(x: number, y: number) {
    return { touches: [{ clientX: x, clientY: y }] }
  }

  it("presses in after a short hold and releases on lift", () => {
    vi.useFakeTimers()
    render(<Basic />)
    const trigger = slot("context-menu-trigger")!
    fireEvent.touchStart(trigger, touch(10, 10))
    act(() => {
      vi.advanceTimersByTime(119)
    })
    expect(trigger.hasAttribute("data-holding")).toBe(false)
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(trigger.hasAttribute("data-holding")).toBe(true)
    fireEvent.touchEnd(trigger, { touches: [] })
    expect(trigger.hasAttribute("data-holding")).toBe(false)
  })

  it("never presses for a quick tap", () => {
    vi.useFakeTimers()
    render(<Basic />)
    const trigger = slot("context-menu-trigger")!
    fireEvent.touchStart(trigger, touch(10, 10))
    act(() => {
      vi.advanceTimersByTime(60)
    })
    fireEvent.touchEnd(trigger, { touches: [] })
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(trigger.hasAttribute("data-holding")).toBe(false)
  })

  it("releases when the finger scrolls or a second finger lands", () => {
    vi.useFakeTimers()
    render(<Basic />)
    const trigger = slot("context-menu-trigger")!
    fireEvent.touchStart(trigger, touch(10, 10))
    act(() => {
      vi.advanceTimersByTime(200)
    })
    fireEvent.touchMove(trigger, touch(14, 16))
    expect(trigger.hasAttribute("data-holding")).toBe(true)
    fireEvent.touchMove(trigger, touch(10, 30))
    expect(trigger.hasAttribute("data-holding")).toBe(false)

    fireEvent.touchStart(trigger, touch(10, 10))
    act(() => {
      vi.advanceTimersByTime(200)
    })
    fireEvent.touchMove(trigger, {
      touches: [
        { clientX: 10, clientY: 10 },
        { clientX: 50, clientY: 50 },
      ],
    })
    expect(trigger.hasAttribute("data-holding")).toBe(false)
  })

  it("can be turned off and clears its timer on unmount", () => {
    vi.useFakeTimers()
    const { unmount } = render(<Basic triggerProps={{ holdFeedback: false }} />)
    const trigger = slot("context-menu-trigger")!
    fireEvent.touchStart(trigger, touch(10, 10))
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(trigger.hasAttribute("data-holding")).toBe(false)
    unmount()

    render(<Basic />)
    fireEvent.touchStart(slot("context-menu-trigger")!, touch(10, 10))
    cleanup()
    expect(() =>
      act(() => {
        vi.advanceTimersByTime(300)
      })
    ).not.toThrow()
  })
})
