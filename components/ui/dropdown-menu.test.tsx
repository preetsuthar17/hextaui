import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  createDropdownMenuHandle,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu"

afterEach(() => {
  cleanup()
  document.body.innerHTML = ""
})

function slot(name: string) {
  return document.querySelector<HTMLElement>(`[data-slot="${name}"]`)
}

function Basic({
  onProfile,
  rootProps,
  triggerProps,
}: {
  onProfile?: (event: React.MouseEvent) => void
  rootProps?: Partial<React.ComponentProps<typeof DropdownMenu>>
  triggerProps?: Partial<React.ComponentProps<typeof DropdownMenuTrigger>>
}) {
  return (
    <DropdownMenu {...rootProps}>
      <DropdownMenuTrigger {...triggerProps}>Account</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuItem onClick={onProfile}>
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Team</DropdownMenuLabel>
          <DropdownMenuItem inset>Invite</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

async function click(element: HTMLElement, detail = 1) {
  await act(async () => {
    fireEvent.click(element, { detail })
  })
}

async function open() {
  await click(screen.getByRole("button", { name: "Account" }))
}

describe("DropdownMenu", () => {
  it("opens a menu from the trigger button", async () => {
    render(<Basic />)
    const trigger = screen.getByRole("button", { name: "Account" })
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu")
    expect(slot("dropdown-menu-content")).toBeNull()
    await open()
    expect(slot("dropdown-menu-content")?.getAttribute("role")).toBe("menu")
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
    expect(screen.getAllByRole("menuitem")).toHaveLength(3)
  })

  it("places the menu below and start-aligned by default", async () => {
    render(<Basic rootProps={{ defaultOpen: true }} />)
    const positioner = slot("dropdown-menu-positioner")!
    expect(positioner.getAttribute("data-side")).toBe("bottom")
    expect(positioner.getAttribute("data-align")).toBe("start")
    expect(slot("dropdown-menu-content")!.className.split(" ")).toContain(
      "min-w-[max(var(--anchor-width),10rem)]"
    )
  })

  it("renders variant, inset, shortcut and labels", async () => {
    render(<Basic />)
    await open()
    expect(
      screen
        .getByRole("menuitem", { name: "Log out" })
        .getAttribute("data-variant")
    ).toBe("destructive")
    expect(
      screen
        .getByRole("menuitem", { name: "Invite" })
        .hasAttribute("data-inset")
    ).toBe(true)
    expect(
      slot("dropdown-menu-shortcut")?.firstElementChild?.getAttribute("dir")
    ).toBe("ltr")
    expect(screen.getByRole("group").getAttribute("aria-labelledby")).toBe(
      screen.getByText("Team").id
    )
    expect(screen.getByText("My account").dataset.slot).toBe(
      "dropdown-menu-label"
    )
  })

  it("runs the item action, marks it chosen and closes", async () => {
    const onProfile = vi.fn()
    const onOpenChange = vi.fn()
    render(<Basic onProfile={onProfile} rootProps={{ onOpenChange }} />)
    await open()
    await click(screen.getByRole("menuitem", { name: /Profile/ }))
    expect(onProfile).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.anything())
  })

  it("blinks only pointer-chosen items that close the menu", async () => {
    render(
      <Basic
        rootProps={{
          onOpenChange: (next, details) => {
            if (!next) {
              details.cancel()
            }
          },
        }}
      />
    )
    await open()
    const profile = screen.getByRole("menuitem", { name: /Profile/ })
    await click(profile, 0)
    expect(profile.hasAttribute("data-chosen")).toBe(false)
    await click(profile)
    expect(profile.hasAttribute("data-chosen")).toBe(true)
    expect(slot("dropdown-menu-content")?.hasAttribute("data-chosen")).toBe(
      true
    )
  })

  it("resets the chosen mark when reopened", async () => {
    render(<Basic />)
    await open()
    await click(screen.getByRole("menuitem", { name: /Profile/ }))
    await open()
    expect(
      screen
        .getByRole("menuitem", { name: /Profile/ })
        .hasAttribute("data-chosen")
    ).toBe(false)
  })

  it("keeps the menu open for checkbox and radio items", async () => {
    const onCheckedChange = vi.fn()
    const onValueChange = vi.fn()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Account</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem onCheckedChange={onCheckedChange}>
            Status bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup
            defaultValue="top"
            onValueChange={onValueChange}
          >
            <DropdownMenuLabel>Panel</DropdownMenuLabel>
            <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    await open()
    const status = screen.getByRole("menuitemcheckbox", { name: "Status bar" })
    await click(status)
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
    expect(status.hasAttribute("data-chosen")).toBe(false)
    await click(screen.getByRole("menuitemradio", { name: "Bottom" }))
    expect(onValueChange).toHaveBeenCalledWith("bottom", expect.anything())
    expect(slot("dropdown-menu-content")).not.toBeNull()
  })

  it("opens a submenu from the keyboard", async () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Account</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Email</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    const sub = screen.getByRole("menuitem", { name: "Invite users" })
    await act(async () => {
      sub.focus()
      fireEvent.keyDown(sub, { key: "ArrowRight" })
    })
    expect(slot("dropdown-menu-sub-content")).not.toBeNull()
    expect(slot("dropdown-menu-sub-positioner")).not.toBeNull()
  })

  it("does not open when the trigger is disabled", async () => {
    render(<Basic triggerProps={{ disabled: true }} />)
    await open()
    expect(slot("dropdown-menu-content")).toBeNull()
  })

  it("opens from a detached trigger with a payload", async () => {
    const handle = createDropdownMenuHandle<{ id: string }>()
    render(
      <>
        <DropdownMenuTrigger handle={handle} payload={{ id: "row-2" }}>
          Row 2
        </DropdownMenuTrigger>
        <DropdownMenu handle={handle}>
          {({ payload }) => (
            <DropdownMenuContent>
              <DropdownMenuItem>Edit {payload?.id}</DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </>
    )
    await click(screen.getByRole("button", { name: "Row 2" }))
    expect(screen.getByRole("menuitem").textContent).toBe("Edit row-2")
  })

  it("sets RTL on the positioner so alignment flips", async () => {
    render(
      <DirectionProvider direction="rtl">
        <Basic rootProps={{ defaultOpen: true }} />
      </DirectionProvider>
    )
    expect(slot("dropdown-menu-positioner")?.getAttribute("dir")).toBe("rtl")
  })

  it("passes a className function the part state", async () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Account</DropdownMenuTrigger>
        <DropdownMenuContent
          className={(state) => (state.open ? "is-open" : "is-closed")}
        >
          <DropdownMenuItem
            disabled
            className={(state) => (state.disabled ? "off" : "on")}
          >
            Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(slot("dropdown-menu-content")!.className).toContain("is-open")
    expect(slot("dropdown-menu-content")!.className).toContain("rounded-lg")
    expect(slot("dropdown-menu-item")!.className).toContain("off")
  })

  it("throws a clear error for content outside the root", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() =>
      render(
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      )
    ).toThrow("DropdownMenuContent must be used within <DropdownMenu>.")
  })

  it("renders on the server", () => {
    expect(() => renderToString(<Basic />)).not.toThrow()
  })
})
