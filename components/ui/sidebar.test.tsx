import * as React from "react"
import { act, cleanup, fireEvent, render } from "@testing-library/react"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { isApplePlatform } from "@/lib/hotkey"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "./sidebar"

afterEach(() => {
  cleanup()
})

function mockViewport(mobile: boolean) {
  const listeners = new Set<() => void>()
  let matches = mobile
  vi.stubGlobal("matchMedia", (query: string) => ({
    get matches() {
      return query.includes("max-width") ? matches : false
    },
    media: query,
    addEventListener: (_: string, listener: () => void) =>
      listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) =>
      listeners.delete(listener),
  }))
  return (next: boolean) => {
    matches = next
    act(() => listeners.forEach((listener) => listener()))
  }
}

function pressShortcut(target: EventTarget = document.body, init = {}) {
  const apple = isApplePlatform()
  const event = new KeyboardEvent("keydown", {
    key: "b",
    metaKey: apple,
    ctrlKey: !apple,
    bubbles: true,
    cancelable: true,
    ...init,
  })
  act(() => {
    target.dispatchEvent(event)
  })
  return event
}

function App({
  collapsible,
  children,
  ...props
}: React.ComponentProps<typeof SidebarProvider> & {
  collapsible?: "offcanvas" | "icon" | "none"
}) {
  return (
    <SidebarProvider {...props}>
      <Sidebar collapsible={collapsible}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive tooltip="Home">
                  Home
                </SidebarMenuButton>
                <SidebarMenuBadge>3</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton render={<a href="#inbox" />}>
                  Inbox
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

function slot(root: ParentNode, name: string) {
  return root.querySelector<HTMLElement>(`[data-slot="${name}"]`)!
}

describe("Sidebar", () => {
  it("renders the desktop layout with a labelled, connected trigger", () => {
    mockViewport(false)
    const { container } = render(<App />)
    const sidebar = slot(container, "sidebar")
    const trigger = slot(container, "sidebar-trigger")
    const containerEl = slot(container, "sidebar-container")

    expect(sidebar.dataset.state).toBe("expanded")
    expect(sidebar.dataset.collapsible).toBe("")
    expect(sidebar.dataset.variant).toBe("sidebar")
    expect(sidebar.dataset.side).toBe("left")
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
    expect(trigger.getAttribute("aria-controls")).toBe(containerEl.id)
    expect(trigger.textContent).toBe("Toggle Sidebar")
    expect(slot(container, "sidebar-rail").tabIndex).toBe(-1)
  })

  it("toggles uncontrolled and still reports onOpenChange", () => {
    mockViewport(false)
    const onOpenChange = vi.fn()
    const { container } = render(<App onOpenChange={onOpenChange} />)
    const trigger = slot(container, "sidebar-trigger")

    fireEvent.click(trigger)
    expect(slot(container, "sidebar").dataset.state).toBe("collapsed")
    expect(slot(container, "sidebar").dataset.collapsible).toBe("offcanvas")
    expect(trigger.getAttribute("aria-expanded")).toBe("false")
    expect(onOpenChange).toHaveBeenLastCalledWith(false)

    fireEvent.click(slot(container, "sidebar-rail"))
    expect(slot(container, "sidebar").dataset.state).toBe("expanded")
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
  })

  it("respects a controlled open value", () => {
    mockViewport(false)
    const onOpenChange = vi.fn()
    const { container, rerender } = render(
      <App open onOpenChange={onOpenChange} />
    )

    fireEvent.click(slot(container, "sidebar-trigger"))
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(slot(container, "sidebar").dataset.state).toBe("expanded")

    rerender(<App open={false} onOpenChange={onOpenChange} />)
    expect(slot(container, "sidebar").dataset.state).toBe("collapsed")
    fireEvent.click(slot(container, "sidebar-trigger"))
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
  })

  it("lets the trigger's onClick cancel the toggle", () => {
    mockViewport(false)
    const { container } = render(
      <SidebarProvider>
        <Sidebar />
        <SidebarTrigger onClick={(event) => event.preventDefault()} />
      </SidebarProvider>
    )

    fireEvent.click(slot(container, "sidebar-trigger"))
    expect(slot(container, "sidebar").dataset.state).toBe("expanded")
  })

  it("toggles with the keyboard shortcut and ignores repeats and editors", () => {
    mockViewport(false)
    const { container } = render(
      <App>
        <div
          data-testid="editor"
          contentEditable
          suppressContentEditableWarning
        >
          Text
        </div>
      </App>
    )
    const sidebar = () => slot(container, "sidebar")

    const event = pressShortcut()
    expect(event.defaultPrevented).toBe(true)
    expect(sidebar().dataset.state).toBe("collapsed")

    pressShortcut(document.body, { repeat: true })
    expect(sidebar().dataset.state).toBe("collapsed")

    pressShortcut(document.body, { shiftKey: true })
    expect(sidebar().dataset.state).toBe("collapsed")

    const editor = container.querySelector<HTMLElement>("[data-testid=editor]")!
    Object.defineProperty(editor, "isContentEditable", { value: true })
    const typed = pressShortcut(editor)
    expect(typed.defaultPrevented).toBe(false)
    expect(sidebar().dataset.state).toBe("collapsed")

    const handled = new KeyboardEvent("keydown", {
      key: "b",
      metaKey: isApplePlatform(),
      ctrlKey: !isApplePlatform(),
      cancelable: true,
    })
    handled.preventDefault()
    act(() => {
      window.dispatchEvent(handled)
    })
    expect(sidebar().dataset.state).toBe("collapsed")

    pressShortcut()
    expect(sidebar().dataset.state).toBe("expanded")
  })

  it("supports a custom shortcut and turning it off", () => {
    mockViewport(false)
    const { container, rerender } = render(<App keyboardShortcut="mod+j" />)

    pressShortcut()
    expect(slot(container, "sidebar").dataset.state).toBe("expanded")
    pressShortcut(document.body, { key: "j" })
    expect(slot(container, "sidebar").dataset.state).toBe("collapsed")

    rerender(<App keyboardShortcut={null} />)
    pressShortcut(document.body, { key: "j" })
    expect(slot(container, "sidebar").dataset.state).toBe("collapsed")
  })

  it("toggles only one sidebar per shortcut, preferring the focused one", () => {
    mockViewport(false)
    const { container } = render(
      <>
        <App />
        <App />
      </>
    )
    const sidebars = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>('[data-slot="sidebar"]')
      ).map((element) => element.dataset.state)

    pressShortcut()
    expect(sidebars()).toEqual(["collapsed", "expanded"])

    const second = container.querySelectorAll<HTMLElement>(
      '[data-slot="sidebar-trigger"]'
    )[1]
    second.focus()
    pressShortcut(second)
    expect(sidebars()).toEqual(["collapsed", "collapsed"])
  })

  it("moves focus to the trigger when an off-canvas sidebar hides it", () => {
    mockViewport(false)
    const { container } = render(<App />)
    const button = container.querySelector<HTMLElement>(
      '[data-sidebar="menu-button"]'
    )!
    button.focus()
    expect(document.activeElement).toBe(button)

    pressShortcut(button)
    expect(document.activeElement).toBe(slot(container, "sidebar-trigger"))
  })

  it("keeps focus when collapsing to icons", () => {
    mockViewport(false)
    const { container } = render(<App collapsible="icon" />)
    const button = container.querySelector<HTMLElement>(
      '[data-sidebar="menu-button"]'
    )!
    button.focus()
    pressShortcut(button)
    expect(slot(container, "sidebar").dataset.collapsible).toBe("icon")
    expect(document.activeElement).toBe(button)
  })

  it("marks the active item and enables tooltips only while collapsed to icons", () => {
    mockViewport(false)
    const { container } = render(<App collapsible="icon" />)
    const button = container.querySelector<HTMLElement>(
      '[data-sidebar="menu-button"]'
    )!

    expect(button.getAttribute("aria-current")).toBe("page")
    expect(button.hasAttribute("data-active")).toBe(true)
    expect(button.dataset.size).toBe("default")
    expect(button.hasAttribute("data-trigger-disabled")).toBe(true)

    fireEvent.click(slot(container, "sidebar-trigger"))
    expect(button.hasAttribute("data-trigger-disabled")).toBe(false)

    const inbox = container.querySelectorAll<HTMLElement>(
      '[data-sidebar="menu-button"]'
    )[1]
    expect(inbox.tagName).toBe("A")
    expect(inbox.hasAttribute("aria-current")).toBe(false)
    expect(inbox.hasAttribute("data-trigger-disabled")).toBe(false)
  })

  it("gives buttons a type and composes render props", () => {
    mockViewport(false)
    const onClick = vi.fn()
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarGroup>
            <SidebarGroupAction aria-label="Add" onClick={onClick} />
          </SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Plain</SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton href="#a" isActive size="sm">
                    Sub
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>
    )

    const action = slot(container, "sidebar-group-action")
    expect(action.getAttribute("type")).toBe("button")
    fireEvent.click(action)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(slot(container, "sidebar-menu-button").getAttribute("type")).toBe(
      "button"
    )
    const sub = slot(container, "sidebar-menu-sub-button")
    expect(sub.tagName).toBe("A")
    expect(sub.getAttribute("aria-current")).toBe("page")
    expect(sub.dataset.size).toBe("sm")
  })

  it("renders a sheet on phones that closes when a link is followed", async () => {
    mockViewport(true)
    const { container } = render(<App />)
    const trigger = slot(container, "sidebar-trigger")

    expect(container.querySelector('[data-slot="sidebar-container"]')).toBe(
      null
    )
    expect(trigger.getAttribute("aria-expanded")).toBe("false")
    expect(trigger.hasAttribute("aria-controls")).toBe(false)

    fireEvent.click(trigger)
    const sheet = await vi.waitFor(() => {
      const element = document.querySelector<HTMLElement>(
        '[data-mobile="true"]'
      )
      expect(element).not.toBeNull()
      return element!
    })
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
    expect(sheet.getAttribute("role")).toBe("dialog")

    const link = sheet.querySelector<HTMLElement>("a[href]")!
    fireEvent.click(link, { metaKey: true })
    expect(trigger.getAttribute("aria-expanded")).toBe("true")

    const button = sheet.querySelector<HTMLElement>("button[data-sidebar]")!
    fireEvent.click(button)
    expect(trigger.getAttribute("aria-expanded")).toBe("true")

    link.addEventListener("click", (event) => event.preventDefault())
    fireEvent.click(link)
    expect(trigger.getAttribute("aria-expanded")).toBe("false")
  })

  it("forgets the open phone sheet after growing to desktop", async () => {
    const resize = mockViewport(true)
    const { container } = render(<App />)

    fireEvent.click(slot(container, "sidebar-trigger"))
    await vi.waitFor(() =>
      expect(document.querySelector('[data-mobile="true"]')).not.toBeNull()
    )

    resize(false)
    expect(slot(container, "sidebar-container")).not.toBeNull()

    resize(true)
    expect(
      slot(container, "sidebar-trigger").getAttribute("aria-expanded")
    ).toBe("false")
  })

  it("throws a clear error outside the provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    function Reader() {
      useSidebar()
      return null
    }
    expect(() => render(<Reader />)).toThrow(
      "useSidebar must be used within a SidebarProvider."
    )
  })

  it("hydrates skeletons without mismatches", () => {
    mockViewport(false)
    const tree = (
      <SidebarProvider>
        <Sidebar>
          <SidebarMenu>
            {Array.from({ length: 4 }).map((_, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>
    )
    const html = renderToString(tree)
    const host = document.createElement("div")
    host.innerHTML = html
    document.body.append(host)
    const errors = vi.spyOn(console, "error").mockImplementation(() => {})

    let root: ReturnType<typeof hydrateRoot> | undefined
    act(() => {
      root = hydrateRoot(host, tree, { onRecoverableError: () => {} })
    })
    expect(errors).not.toHaveBeenCalled()
    const widths = (markup: string) =>
      markup.match(/max-w-\[\d+%\]/g)?.join(" ")
    expect(widths(host.innerHTML)).toBe(widths(html))
    expect(
      host.querySelectorAll('[data-slot="sidebar-menu-skeleton"]')
    ).toHaveLength(4)
    act(() => root?.unmount())
    host.remove()
  })

  it("removes the space between items with gap none", () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu gap="none" aria-label="dense">
              <SidebarMenuItem>
                <SidebarMenuSub gap="none" aria-label="sub" />
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu aria-label="spaced" />
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )
    expect(
      document.querySelector('[aria-label="dense"]')!.getAttribute("data-gap")
    ).toBe("none")
    expect(
      document.querySelector('[aria-label="sub"]')!.getAttribute("data-gap")
    ).toBe("none")
    expect(
      document.querySelector('[aria-label="spaced"]')!.getAttribute("data-gap")
    ).toBe("default")
  })

  it("fills the screen on phones with mobile fullscreen", async () => {
    mockViewport(true)
    render(
      <SidebarProvider>
        <Sidebar mobile="fullscreen">
          <SidebarContent />
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    )
    fireEvent.click(
      document.querySelector<HTMLElement>("[data-slot=sidebar-trigger]")!
    )
    await vi.waitFor(() =>
      expect(
        document
          .querySelector('[data-mobile="true"]')
          ?.getAttribute("data-mobile-layout")
      ).toBe("fullscreen")
    )
  })
})
