import * as React from "react"
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog"
import {
  createDrawerHandle,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerVirtualKeyboardProvider,
} from "./drawer"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./sheet"

afterEach(() => {
  cleanup()
  document.body.innerHTML = ""
})

function slots(name: string) {
  return Array.from(
    document.querySelectorAll<HTMLElement>(`[data-slot="${name}"]`)
  )
}

function slot(name: string) {
  return slots(name)[0] ?? null
}

async function click(element: HTMLElement) {
  await act(async () => {
    fireEvent.click(element, { detail: 1 })
  })
}

function Basic({
  rootProps,
  contentProps,
}: {
  rootProps?: Partial<React.ComponentProps<typeof Drawer>>
  contentProps?: Partial<React.ComponentProps<typeof DrawerContent>>
}) {
  return (
    <Drawer {...rootProps}>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent {...contentProps}>
        <DrawerHeader>
          <DrawerTitle>Move goal</DrawerTitle>
          <DrawerDescription>Set your daily goal.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>Body</DrawerBody>
        <DrawerFooter>
          <DrawerClose>Done</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

describe("Drawer", () => {
  it("opens from the trigger as a labelled dialog and closes again", async () => {
    render(<Basic />)
    await click(screen.getByRole("button", { name: "Open" }))

    const dialog = screen.getByRole("dialog")
    expect(dialog.getAttribute("data-slot")).toBe("drawer-popup")
    expect(dialog.getAttribute("aria-labelledby")).toBe(
      screen.getByText("Move goal").id
    )
    expect(dialog.getAttribute("aria-describedby")).toBe(
      screen.getByText("Set your daily goal.").id
    )
    for (const part of [
      "drawer-overlay",
      "drawer-viewport",
      "drawer-content",
      "drawer-header",
      "drawer-body",
      "drawer-footer",
      "drawer-title",
      "drawer-description",
      "drawer-close",
    ]) {
      expect(slot(part), part).not.toBeNull()
    }

    await click(screen.getByRole("button", { name: "Done" }))
    expect(dialog.hasAttribute("data-closed")).toBe(true)
  })

  it("defaults to a bottom drawer with a handle", async () => {
    render(<Basic rootProps={{ defaultOpen: true }} />)
    const popup = slot("drawer-popup")!
    expect(popup.getAttribute("data-swipe-direction")).toBe("down")
    expect(popup.getAttribute("data-swipe-axis")).toBe("y")
    expect(slot("drawer-swipe-handle")?.getAttribute("aria-hidden")).toBe(
      "true"
    )
  })

  it.each([
    ["up", "y", true],
    ["left", "x", false],
    ["right", "x", false],
  ] as const)(
    "swipeDirection %s sets the %s axis and handle=%s",
    async (direction, axis, handle) => {
      render(
        <Basic rootProps={{ defaultOpen: true, swipeDirection: direction }} />
      )
      const popup = slot("drawer-popup")!
      expect(popup.getAttribute("data-swipe-direction")).toBe(direction)
      expect(popup.getAttribute("data-swipe-axis")).toBe(axis)
      expect(slot("drawer-swipe-handle") !== null).toBe(handle)
    }
  )

  it("lets showSwipeHandle override the default either way", () => {
    const { unmount } = render(
      <Basic rootProps={{ defaultOpen: true, showSwipeHandle: false }} />
    )
    expect(slot("drawer-swipe-handle")).toBeNull()
    unmount()
    render(
      <Basic
        rootProps={{
          defaultOpen: true,
          swipeDirection: "right",
          showSwipeHandle: true,
        }}
      />
    )
    expect(slot("drawer-swipe-handle")).not.toBeNull()
  })

  it("renders no overlay when not modal", () => {
    render(<Basic rootProps={{ defaultOpen: true, modal: false }} />)
    expect(slot("drawer-overlay")).toBeNull()
    expect(slot("drawer-viewport")?.hasAttribute("data-modal")).toBe(false)
  })

  it("marks snap point drawers", () => {
    render(
      <Basic rootProps={{ defaultOpen: true, snapPoints: ["20rem", 1] }} />
    )
    expect(slot("drawer-popup")?.hasAttribute("data-snap-points")).toBe(true)
    expect(slot("drawer-overlay")?.hasAttribute("data-snap-points")).toBe(true)
  })

  it("supports controlled state", async () => {
    const onOpenChange = vi.fn()

    function Controlled() {
      const [open, setOpen] = React.useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            External
          </button>
          <Basic
            rootProps={{
              open,
              onOpenChange: (next, details) => {
                onOpenChange(next, details)
                setOpen(next)
              },
            }}
          />
        </>
      )
    }

    render(<Controlled />)
    expect(screen.queryByRole("dialog")).toBeNull()
    await click(screen.getByRole("button", { name: "External" }))
    expect(screen.getByRole("dialog")).not.toBeNull()
    await click(screen.getByRole("button", { name: "Done" }))
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.anything())
  })

  it("merges string and function class names onto the popup", () => {
    const { unmount } = render(
      <Basic
        rootProps={{ defaultOpen: true }}
        contentProps={{ className: "h-80" }}
      />
    )
    const popup = slot("drawer-popup")!
    expect(popup.className).toContain("h-80")
    expect(popup.className).not.toContain("h-(--drawer-content-height)")
    unmount()
    render(
      <Basic
        rootProps={{ defaultOpen: true }}
        contentProps={{
          className: (state) => (state.open ? "is-open" : undefined),
        }}
      />
    )
    expect(slot("drawer-popup")?.className).toContain("is-open")
    expect(slot("drawer-popup")?.className).toContain("bg-popover")
  })

  it("stacks a nested drawer of the same direction", () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent>
          <DrawerTitle>Parent</DrawerTitle>
          <Drawer defaultOpen>
            <DrawerContent>
              <DrawerTitle>Child</DrawerTitle>
            </DrawerContent>
          </Drawer>
        </DrawerContent>
      </Drawer>
    )
    const [parent, child] = slots("drawer-popup")
    expect(parent.hasAttribute("data-stack")).toBe(true)
    expect(child.hasAttribute("data-stack")).toBe(false)
    expect(slots("drawer-overlay")).toHaveLength(1)
  })

  it("does not stack a nested drawer from another direction", () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent>
          <DrawerTitle>Parent</DrawerTitle>
          <Drawer defaultOpen swipeDirection="right">
            <DrawerContent>
              <DrawerTitle>Child</DrawerTitle>
            </DrawerContent>
          </Drawer>
        </DrawerContent>
      </Drawer>
    )
    const [parent] = slots("drawer-popup")
    expect(parent.hasAttribute("data-stack")).toBe(false)
    const overlays = slots("drawer-overlay")
    expect(overlays).toHaveLength(2)
    expect(overlays[1].hasAttribute("data-nested")).toBe(true)
  })

  it("does not stack an alert dialog opened from a drawer", async () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent>
          <DrawerTitle>Parent</DrawerTitle>
          <AlertDialog>
            <AlertDialogTrigger>Delete</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Delete?</AlertDialogTitle>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialog>
        </DrawerContent>
      </Drawer>
    )
    await click(screen.getByRole("button", { name: "Delete" }))
    expect(slot("drawer-popup")?.hasAttribute("data-stack")).toBe(false)
    expect(slot("sheet-overlay")?.hasAttribute("data-nested")).toBe(true)
  })

  it("gets a lighter overlay when opened from a sheet", async () => {
    render(
      <Sheet defaultOpen>
        <SheetContent>
          <SheetTitle>Sheet</SheetTitle>
          <Drawer>
            <DrawerTrigger>Open drawer</DrawerTrigger>
            <DrawerContent>
              <DrawerTitle>Drawer</DrawerTitle>
            </DrawerContent>
          </Drawer>
        </SheetContent>
      </Sheet>
    )
    await click(screen.getByRole("button", { name: "Open drawer" }))
    expect(slot("drawer-overlay")?.hasAttribute("data-nested")).toBe(true)
  })

  it("renders a sheet opened from a drawer with a nested overlay", async () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent>
          <DrawerTitle>Drawer</DrawerTitle>
          <Sheet>
            <SheetTrigger>Open sheet</SheetTrigger>
            <SheetContent>
              <SheetTitle>Sheet</SheetTitle>
            </SheetContent>
          </Sheet>
        </DrawerContent>
      </Drawer>
    )
    await click(screen.getByRole("button", { name: "Open sheet" }))
    expect(slot("sheet-overlay")?.hasAttribute("data-nested")).toBe(true)
  })

  it("shares one drawer between detached triggers with a payload", async () => {
    const handle = createDrawerHandle<string>()
    render(
      <>
        <DrawerTrigger handle={handle} payload="Alpha">
          Alpha
        </DrawerTrigger>
        <DrawerTrigger handle={handle} payload="Beta">
          Beta
        </DrawerTrigger>
        <Drawer handle={handle}>
          {({ payload }) => (
            <DrawerContent>
              <DrawerTitle>{payload ?? "None"}</DrawerTitle>
            </DrawerContent>
          )}
        </Drawer>
      </>
    )
    await click(screen.getByRole("button", { name: "Beta" }))
    expect(screen.getByRole("dialog").textContent).toContain("Beta")
  })

  it("keeps fields usable inside the keyboard provider", async () => {
    function Form() {
      const [value, setValue] = React.useState("")
      return (
        <Drawer defaultOpen>
          <DrawerVirtualKeyboardProvider>
            <DrawerContent>
              <DrawerTitle>Address</DrawerTitle>
              <DrawerBody>
                <label>
                  City
                  <input
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                  />
                </label>
              </DrawerBody>
            </DrawerContent>
          </DrawerVirtualKeyboardProvider>
        </Drawer>
      )
    }

    render(<Form />)
    const input = screen.getByLabelText("City") as HTMLInputElement
    await waitFor(() =>
      expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(
        true
      )
    )
    await act(async () => {
      input.focus()
      fireEvent.change(input, { target: { value: "Lisbon" } })
    })
    expect(document.activeElement).toBe(input)
    expect(input.value).toBe("Lisbon")
    expect(screen.getByRole("dialog").contains(input)).toBe(true)
  })

  it("requires a drawer around the keyboard provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() =>
      render(
        <DrawerVirtualKeyboardProvider>
          <span />
        </DrawerVirtualKeyboardProvider>
      )
    ).toThrow()
  })

  it("throws a helpful error outside a drawer", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<DrawerContent />)).toThrow(
      "<DrawerContent> must be used within <Drawer>."
    )
  })

  it("server renders the closed state without errors", () => {
    expect(() => renderToString(<Basic />)).not.toThrow()
    expect(renderToString(<Basic />)).toContain('data-slot="drawer-trigger"')
  })
})
