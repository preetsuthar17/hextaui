import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
  CommandFooter,
  CommandPage,
  CommandShortcut,
  useCommandHotkey,
  useCommandLoading,
  useHotkeyLabel,
} from "./command"

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
  Element.prototype.scrollIntoView ??= function () {}
  Element.prototype.getAnimations ??= function () {
    return []
  }
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function Menu({
  onSelect,
  inputProps,
}: {
  onSelect?: (value: string) => void
  inputProps?: React.ComponentProps<typeof CommandInput>
}) {
  return (
    <Command>
      <CommandInput placeholder="Type a command" {...inputProps} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={onSelect}>Calendar</CommandItem>
          <CommandItem onSelect={onSelect}>Search Emoji</CommandItem>
          <CommandItem disabled>Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={onSelect}>
            Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

function input() {
  return screen.getByRole("combobox") as HTMLInputElement
}

function type(value: string) {
  fireEvent.change(input(), { target: { value } })
}

function selected() {
  return document.querySelector("[data-slot=command-item][data-selected=true]")
    ?.textContent
}

describe("Command", () => {
  it("renders slotted parts with an accessible input name", () => {
    const { container } = render(<Menu />)

    for (const slot of [
      "command",
      "command-input",
      "command-list",
      "command-group",
      "command-item",
      "command-separator",
      "command-shortcut",
    ]) {
      expect(container.querySelector(`[data-slot=${slot}]`)).not.toBeNull()
    }
    expect(screen.getByRole("combobox", { name: "Command menu" })).toBeTruthy()
    expect(screen.getByRole("listbox")).toBeTruthy()
  })

  it("marks selection with string data attributes, so only one item matches", () => {
    const { container } = render(<Menu />)
    const items = container.querySelectorAll("[data-slot=command-item]")

    expect(
      Array.from(items).map((item) => item.getAttribute("data-selected"))
    ).toEqual(["true", "false", "false", "false"])
    expect(selected()).toBe("Calendar")
  })

  it("moves with the arrow keys, skips disabled items and selects on Enter", () => {
    const onSelect = vi.fn()
    render(<Menu onSelect={onSelect} />)

    fireEvent.keyDown(input(), { key: "ArrowDown" })
    expect(selected()).toBe("Search Emoji")
    fireEvent.keyDown(input(), { key: "ArrowDown" })
    expect(selected()).toBe("Profile⌘P")

    fireEvent.keyDown(input(), { key: "Enter" })
    expect(onSelect).toHaveBeenCalledWith("Profile")
  })

  it("does not match items through the letters of their shortcut", () => {
    render(<Menu />)

    type("⌘")

    expect(screen.queryByText("Profile")).toBeNull()
  })

  it("filters items and hides separators while searching", () => {
    const { container } = render(<Menu />)

    type("emo")

    expect(selected()).toBe("Search Emoji")
    expect(screen.queryByText("Calendar")).toBeNull()
    expect(container.querySelector("[data-slot=command-separator]")).toBeNull()

    type("zzz")
    expect(screen.getByText("No results found.")).toBeTruthy()
  })

  it("clears the query on the first Escape and leaves it alone once empty", () => {
    const onKeyDown = vi.fn()
    render(<Menu inputProps={{ onKeyDown }} />)

    type("cal")
    const first = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    })
    act(() => {
      input().dispatchEvent(first)
    })

    expect(input().value).toBe("")
    expect(first.defaultPrevented).toBe(true)

    const second = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    })
    act(() => {
      input().dispatchEvent(second)
    })
    expect(second.defaultPrevented).toBe(false)
    expect(onKeyDown).toHaveBeenCalledTimes(2)
  })

  it("lets the user's onKeyDown take over Escape", () => {
    render(
      <Menu
        inputProps={{
          onKeyDown: (event) =>
            event.key === "Escape" && event.preventDefault(),
        }}
      />
    )

    type("cal")
    fireEvent.keyDown(input(), { key: "Escape" })

    expect(input().value).toBe("cal")
  })

  it("shows a clear button only while there is a query", () => {
    const { container } = render(<Menu />)
    const clear = container.querySelector<HTMLButtonElement>(
      "[data-slot=command-clear]"
    )!

    expect(clear.getAttribute("aria-hidden")).toBe("true")
    expect(clear.tabIndex).toBe(-1)

    type("cal")
    expect(clear.hasAttribute("aria-hidden")).toBe(false)

    fireEvent.click(clear)
    expect(input().value).toBe("")
    expect(document.activeElement).toBe(input())
  })

  it("supports a controlled query", () => {
    const onValueChange = vi.fn()
    render(<Menu inputProps={{ value: "pro", onValueChange }} />)

    expect(selected()).toBe("Profile⌘P")
    type("cal")
    expect(onValueChange).toHaveBeenCalledWith("cal")
    expect(input().value).toBe("pro")
  })

  it("announces the result count once typing pauses", () => {
    vi.useFakeTimers()
    const { container } = render(<Menu />)
    const status = container.querySelector("[data-slot=command-announcer]")!

    type("e")
    expect(status.textContent).toBe("")
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(status.textContent).toMatch(/^\d+ results?$/)

    type("zzz")
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(status.textContent).toBe("No results")

    type("")
    act(() => {
      vi.advanceTimersByTime(0)
    })
    expect(status.textContent).toBe("")
  })

  it("keeps the input at 16px or more on touch devices so iOS does not zoom", () => {
    render(<Menu />)

    expect(input().className).toContain("pointer-coarse:text-[max(16px,1rem)]")
  })

  it("lays the loading spinner beside its text and labels it with the same words", () => {
    const { container } = render(
      <Command>
        <CommandList>
          <CommandLoading>Searching…</CommandLoading>
        </CommandList>
      </Command>
    )
    const loading = container.querySelector("[data-slot=command-loading]")!

    expect(loading.getAttribute("aria-label")).toBe("Searching…")
    expect(loading.className).toContain("[&>div]:flex")
    expect(loading.firstElementChild!.querySelector("svg")).not.toBeNull()
  })

  it("only animates list height once the list has settled on screen", () => {
    const { container } = render(<Menu />)
    const list = container.querySelector("[data-slot=command-list]")!

    expect(list.getAttribute("role")).toBe("listbox")
    expect(list.className).toContain("data-settled:transition-[height]")
    expect(list.className).toContain("data-settled:h-(--cmdk-list-height)")
    expect(list.className).not.toMatch(/(^| )transition-\[height\]/)
  })

  it("scrolls the newly selected item into view, not the previous one", () => {
    const scrolled: string[] = []
    const onKeyDown = vi.fn()
    const { container } = render(<Menu inputProps={{ onKeyDown }} />)
    const items = container.querySelectorAll<HTMLElement>(
      "[data-slot=command-item]"
    )
    items.forEach((item) => {
      const own = item.scrollIntoView
      item.scrollIntoView = (options) => {
        scrolled.push(item.textContent ?? "")
        own.call(item, options)
      }
    })

    fireEvent.keyDown(input(), { key: "End" })
    expect(selected()).toBe("Profile⌘P")
    expect(scrolled.at(-1)).toBe("Profile⌘P")

    fireEvent.keyDown(input(), { key: "Home" })
    expect(scrolled.at(-1)).toBe("Calendar")
  })

  it("scrolls only the list, never the page", () => {
    const pageScroll = vi
      .spyOn(Element.prototype, "scrollIntoView")
      .mockImplementation(() => {})
    const { container } = render(<Menu />)

    fireEvent.keyDown(input(), { key: "End" })
    fireEvent.keyDown(input(), { key: "Home" })

    const items = container.querySelectorAll("[data-slot=command-item]")
    expect(items.length).toBeGreaterThan(0)
    expect(
      pageScroll.mock.contexts.filter(
        (context) =>
          context instanceof Element &&
          context.getAttribute("data-slot") === "command-item"
      )
    ).toHaveLength(0)
    pageScroll.mockRestore()
  })

  it("server renders without errors", () => {
    const html = renderToString(<Menu />)

    expect(html).toContain('data-slot="command"')
    expect(html).toContain("Calendar")
  })
})

describe("CommandDialog", () => {
  function Palette(props: React.ComponentProps<typeof CommandDialog>) {
    return (
      <CommandDialog {...props}>
        <Menu />
      </CommandDialog>
    )
  }

  it("renders a titled dialog with the input focused", async () => {
    render(<Palette defaultOpen />)

    const dialog = await screen.findByRole("dialog")
    expect(dialog.getAttribute("data-slot")).toBe("command-dialog")
    expect(screen.getByText("Command menu", { selector: "h2" })).toBeTruthy()
  })

  it("opens and closes without any animation", async () => {
    render(<Palette defaultOpen />)
    const dialog = await screen.findByRole("dialog")
    const overlay = document.querySelector(
      "[data-slot=command-dialog-overlay]"
    )!

    for (const node of [dialog, overlay]) {
      expect(node.className).not.toMatch(
        /transition|duration-|starting-style|ending-style|animate-/
      )
    }
  })

  it("clears the query on the first Escape and closes on the second", async () => {
    const onOpenChange = vi.fn()
    render(<Palette defaultOpen onOpenChange={onOpenChange} />)
    await screen.findByRole("dialog")

    type("cal")
    fireEvent.keyDown(input(), { key: "Escape" })

    expect(screen.queryByRole("dialog")).not.toBeNull()
    expect(input().value).toBe("")
    expect(onOpenChange).not.toHaveBeenCalled()

    fireEvent.keyDown(input(), { key: "Escape" })

    expect(onOpenChange).toHaveBeenCalledTimes(1)
    expect(onOpenChange.mock.calls[0][0]).toBe(false)
  })
})

describe("useCommandHotkey", () => {
  function Probe({ hotkey, onFire }: { hotkey: string; onFire: () => void }) {
    useCommandHotkey(hotkey, onFire)
    return <input aria-label="field" />
  }

  function setPlatform(platform: string) {
    Object.defineProperty(navigator, "platform", {
      configurable: true,
      value: platform,
    })
  }

  it("maps mod to ⌘ on Apple platforms and Ctrl elsewhere", () => {
    const onFire = vi.fn()
    render(<Probe hotkey="mod+k" onFire={onFire} />)

    setPlatform("MacIntel")
    fireEvent.keyDown(document, { key: "k", ctrlKey: true })
    expect(onFire).not.toHaveBeenCalled()
    fireEvent.keyDown(document, { key: "k", metaKey: true })
    expect(onFire).toHaveBeenCalledTimes(1)

    setPlatform("Win32")
    fireEvent.keyDown(document, { key: "k", ctrlKey: true })
    expect(onFire).toHaveBeenCalledTimes(2)
  })

  it("ignores key repeat and extra modifiers", () => {
    const onFire = vi.fn()
    setPlatform("MacIntel")
    render(<Probe hotkey="mod+k" onFire={onFire} />)

    fireEvent.keyDown(document, { key: "k", metaKey: true, repeat: true })
    fireEvent.keyDown(document, { key: "k", metaKey: true, shiftKey: true })

    expect(onFire).not.toHaveBeenCalled()
  })

  it("does not steal single-key hotkeys while typing", () => {
    const onFire = vi.fn()
    render(<Probe hotkey="/" onFire={onFire} />)

    fireEvent.keyDown(screen.getByLabelText("field"), { key: "/" })
    expect(onFire).not.toHaveBeenCalled()

    fireEvent.keyDown(document.body, { key: "/" })
    expect(onFire).toHaveBeenCalledTimes(1)
  })
})

function setPlatformGlobal(platform: string) {
  Object.defineProperty(navigator, "platform", {
    configurable: true,
    value: platform,
  })
}

function allowMotion() {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: () => ({ matches: false }),
  })
}

function dropMotionMock() {
  delete (window as { matchMedia?: unknown }).matchMedia
}

describe("Item shortcuts", () => {
  afterEach(dropMotionMock)

  function Shortcuts({ onSelect }: { onSelect: (value: string) => void }) {
    return (
      <Command>
        <CommandInput />
        <CommandList>
          <CommandItem shortcut="mod+p" onSelect={onSelect}>
            Profile
          </CommandItem>
          <CommandItem shortcut="mod+b" disabled onSelect={onSelect}>
            Billing
          </CommandItem>
        </CommandList>
      </Command>
    )
  }

  it("formats the label for the platform and exposes aria-keyshortcuts", () => {
    setPlatformGlobal("MacIntel")
    const { container, unmount } = render(<Shortcuts onSelect={() => {}} />)
    const item = container.querySelector("[data-slot=command-item]")!

    expect(
      item.querySelector("[data-slot=command-shortcut]")!.textContent
    ).toBe("⌘P")
    expect(item.getAttribute("aria-keyshortcuts")).toBe("Meta+p")
    unmount()

    setPlatformGlobal("Win32")
    render(<Shortcuts onSelect={() => {}} />)
    expect(
      document.querySelector("[data-slot=command-shortcut]")!.textContent
    ).toBe("Ctrl+P")
  })

  it("runs the item while focus is inside the command, but not when disabled", () => {
    setPlatformGlobal("MacIntel")
    const onSelect = vi.fn()
    render(<Shortcuts onSelect={onSelect} />)

    fireEvent.keyDown(input(), { key: "p", metaKey: true })
    fireEvent.keyDown(input(), { key: "b", metaKey: true })

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith("Profile")
  })

  it("formats hotkeys with useHotkeyLabel", () => {
    setPlatformGlobal("MacIntel")
    function Label() {
      return <span>{useHotkeyLabel("shift+mod+k")}</span>
    }
    render(<Label />)
    expect(screen.getByText("⇧⌘K")).toBeTruthy()
  })
})

describe("Confirm flash", () => {
  afterEach(dropMotionMock)

  it("blinks the chosen row, then runs once", () => {
    allowMotion()
    vi.useFakeTimers()
    const onSelect = vi.fn()
    render(<Menu onSelect={onSelect} />)
    const calendar = screen
      .getByText("Calendar")
      .closest("[data-slot=command-item]")!

    fireEvent.keyDown(input(), { key: "Enter" })
    fireEvent.keyDown(input(), { key: "Enter" })

    expect(calendar.hasAttribute("data-confirming")).toBe(true)
    expect(onSelect).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(60)
    })
    expect(calendar.hasAttribute("data-confirming")).toBe(false)
    expect(onSelect).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(60)
    })
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it("runs immediately with reduced motion or confirm={false}", () => {
    const onSelect = vi.fn()
    render(
      <Command>
        <CommandInput />
        <CommandList>
          <CommandItem confirm={false} onSelect={onSelect}>
            Now
          </CommandItem>
        </CommandList>
      </Command>
    )
    allowMotion()

    fireEvent.keyDown(input(), { key: "Enter" })

    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})

describe("Loading", () => {
  it("waits before showing the spinner and keeps it up for a minimum time", () => {
    vi.useFakeTimers()
    function Probe({ loading }: { loading: boolean }) {
      return <span>{useCommandLoading(loading) ? "shown" : "hidden"}</span>
    }
    const { rerender } = render(<Probe loading />)

    act(() => {
      vi.advanceTimersByTime(140)
    })
    expect(screen.getByText("hidden")).toBeTruthy()
    act(() => {
      vi.advanceTimersByTime(20)
    })
    expect(screen.getByText("shown")).toBeTruthy()

    rerender(<Probe loading={false} />)
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(screen.getByText("shown")).toBeTruthy()
    act(() => {
      vi.advanceTimersByTime(60)
    })
    expect(screen.getByText("hidden")).toBeTruthy()
  })

  it("never flashes for fast responses and keeps Empty suppressed while pending", () => {
    vi.useFakeTimers()
    const { container, rerender } = render(
      <Command>
        <CommandList>
          <CommandLoading loading>Searching…</CommandLoading>
          <CommandEmpty>No results</CommandEmpty>
        </CommandList>
      </Command>
    )
    const loading = container.querySelector("[data-slot=command-loading]")!

    expect(loading.hasAttribute("data-pending")).toBe(true)

    rerender(
      <Command>
        <CommandList>
          <CommandLoading loading={false}>Searching…</CommandLoading>
          <CommandEmpty>No results</CommandEmpty>
        </CommandList>
      </Command>
    )
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(container.querySelector("[data-slot=command-loading]")).toBeNull()
  })
})

describe("Highlight", () => {
  const registry = new Map<string, unknown>()

  beforeAll(() => {
    Object.defineProperty(globalThis, "CSS", {
      configurable: true,
      value: {
        highlights: {
          set: (name: string, value: unknown) => registry.set(name, value),
          delete: (name: string) => registry.delete(name),
        },
      },
    })
    Object.defineProperty(globalThis, "Highlight", {
      configurable: true,
      value: class {
        ranges: Range[]
        constructor(...ranges: Range[]) {
          this.ranges = ranges
        }
      },
    })
  })

  it("paints the matched characters and clears when the query empties", () => {
    const { container } = render(
      <Command highlight>
        <CommandInput />
        <CommandList>
          <CommandItem>
            Settings
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          <CommandItem>Profile</CommandItem>
        </CommandList>
      </Command>
    )
    const root = container.querySelector("[cmdk-root]")!

    type("set")

    const painted = registry.get("command-match") as { ranges: Range[] }
    expect(painted.ranges.map((range) => range.toString()).join("")).toBe("Set")
    expect(root.hasAttribute("data-highlighting")).toBe(true)

    type("")
    expect(registry.has("command-match")).toBe(false)
    expect(root.hasAttribute("data-highlighting")).toBe(false)
  })

  it("falls back to an in-order fuzzy match", () => {
    render(
      <Command highlight>
        <CommandInput />
        <CommandList>
          <CommandItem>Search Emoji</CommandItem>
        </CommandList>
      </Command>
    )

    type("smj")

    const painted = registry.get("command-match") as { ranges: Range[] }
    expect(painted.ranges.map((range) => range.toString())).toEqual([
      "S",
      "m",
      "j",
    ])
  })
})

describe("Link items", () => {
  it("renders an anchor and follows it on Enter, or opens a new tab with mod+Enter", () => {
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {})
    const open = vi.spyOn(window, "open").mockImplementation(() => null)
    render(
      <Command>
        <CommandInput />
        <CommandList>
          <CommandItem href="/docs">Docs</CommandItem>
        </CommandList>
      </Command>
    )
    const link = screen.getByText("Docs").closest("a")!

    expect(link.getAttribute("href")).toBe("/docs")
    expect(link.getAttribute("data-slot")).toBe("command-item")

    fireEvent.keyDown(input(), { key: "Enter" })
    expect(click).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(input(), { key: "Enter", metaKey: true })
    expect(open).toHaveBeenCalledWith("/docs", "_blank", "noopener")
  })
})

describe("Pages", () => {
  function Paged() {
    return (
      <Command>
        <CommandInput />
        <CommandList>
          <CommandEmpty>
            {(search) => `No results for “${search}”`}
          </CommandEmpty>
          <CommandGroup heading="General">
            <CommandItem page="theme" pageTitle="Theme">
              Change theme
            </CommandItem>
            <CommandItem>Profile</CommandItem>
          </CommandGroup>
          <CommandPage id="theme">
            <CommandGroup heading="Theme">
              <CommandItem>Light</CommandItem>
              <CommandItem>Dark</CommandItem>
            </CommandGroup>
          </CommandPage>
        </CommandList>
        <CommandFooter />
      </Command>
    )
  }

  it("pushes a page, shows its chip, and pops with Backspace on an empty query", () => {
    render(<Paged />)

    expect(screen.queryByText("Light")).toBeNull()
    type("cha")
    fireEvent.keyDown(input(), { key: "Enter" })

    expect(screen.getByText("Light")).toBeTruthy()
    expect(screen.queryByText("Profile")).toBeNull()
    expect(input().value).toBe("")
    expect(screen.getByRole("button", { name: "Back from Theme" })).toBeTruthy()
    expect(screen.getAllByText("Back").length).toBeGreaterThan(0)

    expect(selected()).toBe("Light")

    fireEvent.keyDown(input(), { key: "Backspace" })

    expect(screen.getByText("Profile")).toBeTruthy()
    expect(screen.queryByRole("button", { name: "Back from Theme" })).toBeNull()
    expect(selected()).toBe("Change theme")
  })

  it("goes back with the chip", () => {
    render(<Paged />)
    fireEvent.keyDown(input(), { key: "Enter" })

    fireEvent.click(screen.getByRole("button", { name: "Back from Theme" }))

    expect(screen.getByText("Profile")).toBeTruthy()
    expect(document.activeElement).toBe(input())
  })

  it("echoes the query in the empty state", () => {
    render(<Paged />)
    type("zzz")
    expect(screen.getByText("No results for “zzz”")).toBeTruthy()
  })

  it("in a dialog, Escape clears, then goes back, then closes", async () => {
    const onOpenChange = vi.fn()
    render(
      <CommandDialog defaultOpen onOpenChange={onOpenChange}>
        <Paged />
      </CommandDialog>
    )
    await screen.findByRole("dialog")
    fireEvent.keyDown(input(), { key: "Enter" })
    type("li")

    fireEvent.keyDown(input(), { key: "Escape" })
    expect(input().value).toBe("")
    expect(screen.getByText("Light")).toBeTruthy()

    fireEvent.keyDown(input(), { key: "Escape" })
    expect(screen.getByText("Profile")).toBeTruthy()
    expect(onOpenChange).not.toHaveBeenCalled()

    fireEvent.keyDown(input(), { key: "Escape" })
    expect(onOpenChange).toHaveBeenCalledTimes(1)
  })
})

describe("preserveSearch", () => {
  it("keeps the query across close and reopen", async () => {
    function Harness() {
      const [open, setOpen] = React.useState(true)
      return (
        <>
          <button type="button" onClick={() => setOpen((o) => !o)}>
            toggle
          </button>
          <CommandDialog preserveSearch open={open} onOpenChange={setOpen}>
            <Menu />
          </CommandDialog>
        </>
      )
    }
    render(<Harness />)
    await screen.findByRole("dialog")
    type("cal")

    fireEvent.click(screen.getByText("toggle"))
    fireEvent.click(screen.getByText("toggle"))
    await screen.findByRole("dialog")

    expect(input().value).toBe("cal")
  })
})
