import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  createDialogHandle,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

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
  footerProps,
}: {
  rootProps?: Partial<React.ComponentProps<typeof Dialog>>
  contentProps?: Partial<React.ComponentProps<typeof DialogContent>>
  footerProps?: Partial<React.ComponentProps<typeof DialogFooter>>
}) {
  return (
    <Dialog {...rootProps}>
      <DialogTrigger>Edit profile</DialogTrigger>
      <DialogContent {...contentProps}>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <input aria-label="Name" defaultValue="Olivia" />
        </DialogBody>
        <DialogFooter {...footerProps}>
          <DialogClose>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

async function click(element: HTMLElement) {
  await act(async () => {
    fireEvent.click(element, { detail: 1 })
  })
}

async function flush() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

describe("Dialog", () => {
  it("opens from the trigger as a labelled, described dialog", async () => {
    render(<Basic />)
    await click(screen.getByRole("button", { name: "Edit profile" }))

    const dialog = screen.getByRole("dialog")
    expect(dialog.getAttribute("data-slot")).toBe("dialog-content")
    expect(dialog.getAttribute("data-size")).toBe("default")
    expect(
      document.getElementById(dialog.getAttribute("aria-labelledby") ?? "")
        ?.textContent
    ).toBe("Edit profile")
    expect(
      document.getElementById(dialog.getAttribute("aria-describedby") ?? "")
        ?.textContent
    ).toBe("Make changes to your profile.")
  })

  it("renders every part with its data-slot", async () => {
    render(<Basic rootProps={{ defaultOpen: true }} />)
    await flush()

    for (const name of [
      "dialog-content",
      "dialog-header",
      "dialog-title",
      "dialog-description",
      "dialog-body",
      "dialog-footer",
      "dialog-close",
      "sheet-overlay",
    ]) {
      expect(slot(name), name).not.toBeNull()
    }
  })

  it("shows a labelled close button by default and pads the header for it", async () => {
    render(<Basic rootProps={{ defaultOpen: true }} />)
    await flush()

    expect(screen.getByRole("button", { name: "Close" })).toBeTruthy()
    expect(slot("dialog-header")?.className).toContain("pe-12")
  })

  it("hides the close button with showCloseButton={false}", async () => {
    render(
      <Basic
        rootProps={{ defaultOpen: true }}
        contentProps={{ showCloseButton: false }}
      />
    )
    await flush()

    expect(screen.queryByRole("button", { name: "Close" })).toBeNull()
    expect(slot("dialog-header")?.className).not.toContain("pe-12")
  })

  it("adds a Close button to the footer with showCloseButton", async () => {
    render(
      <Basic
        rootProps={{ defaultOpen: true }}
        contentProps={{ showCloseButton: false }}
        footerProps={{ showCloseButton: true }}
      />
    )
    await flush()

    const close = screen.getByRole("button", { name: "Close" })
    expect(slot("dialog-footer")?.contains(close)).toBe(true)
  })

  it("applies the size variant", async () => {
    render(
      <Basic rootProps={{ defaultOpen: true }} contentProps={{ size: "sm" }} />
    )
    await flush()

    const content = slot("dialog-content")
    expect(content?.getAttribute("data-size")).toBe("sm")
    expect(content?.className).toContain("sm:max-w-sm")
  })

  it("closes from DialogClose and reports the change", async () => {
    const onOpenChange = vi.fn()
    render(<Basic rootProps={{ defaultOpen: true, onOpenChange }} />)
    await flush()

    await click(screen.getByRole("button", { name: "Cancel" }))
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything())
  })

  it("closes on Escape", async () => {
    const onOpenChange = vi.fn()
    render(<Basic rootProps={{ defaultOpen: true, onOpenChange }} />)
    await flush()

    await act(async () => {
      fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" })
    })
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything())
  })

  it("works controlled", async () => {
    function Controlled() {
      const [open, setOpen] = React.useState(false)
      return (
        <>
          <button onClick={() => setOpen(true)}>Open from state</button>
          <Basic rootProps={{ open, onOpenChange: setOpen }} />
        </>
      )
    }

    render(<Controlled />)
    expect(screen.queryByRole("dialog")).toBeNull()
    await click(screen.getByRole("button", { name: "Open from state" }))
    expect(screen.getByRole("dialog")).toBeTruthy()
    await click(screen.getByRole("button", { name: "Cancel" }))
    await flush()
    expect(
      screen.queryByRole("dialog")?.hasAttribute("data-closed") ?? true
    ).toBe(true)
  })

  it("passes a function className the popup state", async () => {
    const className = vi.fn(() => "custom-state-class")
    render(
      <Basic rootProps={{ defaultOpen: true }} contentProps={{ className }} />
    )
    await flush()

    expect(className).toHaveBeenCalled()
    const content = slot("dialog-content")
    expect(content?.className).toContain("custom-state-class")
    expect(content?.className).toContain("sm:max-w-lg")
  })

  it("forwards the ref to the popup", async () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Basic rootProps={{ defaultOpen: true }} contentProps={{ ref }} />)
    await flush()

    expect(ref.current).toBe(slot("dialog-content"))
  })

  it("shares one dialog between detached triggers through a handle", async () => {
    const handle = createDialogHandle<{ name: string }>()
    render(
      <>
        <DialogTrigger handle={handle} payload={{ name: "Ada" }}>
          Ada
        </DialogTrigger>
        <DialogTrigger handle={handle} payload={{ name: "Linus" }}>
          Linus
        </DialogTrigger>
        <Dialog handle={handle}>
          {({ payload }) => (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{payload?.name}</DialogTitle>
              </DialogHeader>
            </DialogContent>
          )}
        </Dialog>
      </>
    )

    await click(screen.getByRole("button", { name: "Linus" }))
    expect(screen.getByRole("dialog").textContent).toContain("Linus")
  })

  it("renders a lighter backdrop for a nested dialog", async () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Parent</DialogTitle>
          <Dialog defaultOpen>
            <DialogContent>
              <DialogTitle>Child</DialogTitle>
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>
    )
    await flush()

    const overlays = document.querySelectorAll('[data-slot="sheet-overlay"]')
    expect(overlays.length).toBe(2)
    expect(overlays[1].hasAttribute("data-nested")).toBe(true)
  })

  it("renders on the server without crashing", () => {
    expect(() => renderToString(<Basic />)).not.toThrow()
    expect(() =>
      renderToString(<Basic rootProps={{ defaultOpen: true }} />)
    ).not.toThrow()
  })
})
