import * as React from "react"
import { act, cleanup, fireEvent, render } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Tree, TreeGroup, TreeItem, TreeItemLabel } from "./tree"

afterEach(() => {
  cleanup()
})

function Files(props: React.ComponentProps<typeof Tree>) {
  return (
    <Tree aria-label="Files" {...props}>
      <TreeItem value="src">
        <TreeItemLabel>src</TreeItemLabel>
        <TreeGroup>
          <TreeItem value="app">
            <TreeItemLabel>app</TreeItemLabel>
            <TreeGroup>
              <TreeItem value="page">
                <TreeItemLabel>page.tsx</TreeItemLabel>
              </TreeItem>
              <TreeItem value="layout">
                <TreeItemLabel>layout.tsx</TreeItemLabel>
              </TreeItem>
            </TreeGroup>
          </TreeItem>
          <TreeItem value="utils">
            <TreeItemLabel>utils.ts</TreeItemLabel>
          </TreeItem>
        </TreeGroup>
      </TreeItem>
      <TreeItem value="readme">
        <TreeItemLabel>README.md</TreeItemLabel>
      </TreeItem>
      <TreeItem value="package">
        <TreeItemLabel>package.json</TreeItemLabel>
      </TreeItem>
    </Tree>
  )
}

function row(container: HTMLElement, value: string) {
  return Array.from(
    container.querySelectorAll<HTMLElement>('[data-slot="tree-item-label"]')
  ).find((item) => item.dataset.value === value)!
}

function focused() {
  return (document.activeElement as HTMLElement | null)?.dataset.value
}

function key(target: HTMLElement, key: string, init: KeyboardEventInit = {}) {
  fireEvent.keyDown(target, { key, ...init })
}

describe("Tree", () => {
  it("renders tree semantics with levels and branch-only expansion state", () => {
    const { container } = render(<Files defaultExpandedValues={["src"]} />)
    const tree = container.querySelector('[data-slot="tree"]')!
    expect(tree.getAttribute("role")).toBe("tree")
    expect(tree.getAttribute("aria-label")).toBe("Files")

    const src = row(container, "src")
    expect(src.getAttribute("role")).toBe("treeitem")
    expect(src.getAttribute("aria-level")).toBe("1")
    expect(src.getAttribute("aria-expanded")).toBe("true")
    const group = document.getElementById(src.getAttribute("aria-owns")!)
    expect(group?.getAttribute("role")).toBe("group")

    expect(row(container, "app").getAttribute("aria-level")).toBe("2")
    expect(row(container, "app").getAttribute("aria-expanded")).toBe("false")
    expect(row(container, "page").getAttribute("aria-level")).toBe("3")
    expect(row(container, "readme").hasAttribute("aria-expanded")).toBe(false)
    expect(row(container, "readme").hasAttribute("aria-owns")).toBe(false)
  })

  it("keeps exactly one row in the tab order", () => {
    const { container } = render(<Files defaultSelectedValues={["readme"]} />)
    const tabbable = container.querySelectorAll(
      '[role="treeitem"][tabindex="0"]'
    )
    expect(tabbable).toHaveLength(1)
    expect((tabbable[0] as HTMLElement).dataset.value).toBe("readme")
  })

  it("moves the tab stop to the parent when its branch collapses", () => {
    const { container } = render(<Files defaultExpandedValues={["src"]} />)
    act(() => row(container, "utils").focus())
    expect(row(container, "utils").tabIndex).toBe(0)
    fireEvent.click(
      row(container, "src").querySelector('[data-slot="tree-item-indicator"]')!
    )
    expect(row(container, "src").tabIndex).toBe(0)
    expect(row(container, "utils").tabIndex).toBe(-1)
  })

  it("toggles a branch and selects it on click, and the chevron only toggles", () => {
    const onSelected = vi.fn()
    const { container } = render(<Files onSelectedValuesChange={onSelected} />)
    fireEvent.click(row(container, "src"))
    expect(row(container, "src").getAttribute("aria-expanded")).toBe("true")
    expect(row(container, "src").getAttribute("aria-selected")).toBe("true")
    expect(onSelected).toHaveBeenLastCalledWith(["src"])

    fireEvent.click(
      row(container, "app").querySelector('[data-slot="tree-item-indicator"]')!
    )
    expect(row(container, "app").getAttribute("aria-expanded")).toBe("true")
    expect(row(container, "app").getAttribute("aria-selected")).toBe("false")
    expect(onSelected).toHaveBeenCalledTimes(1)
  })

  it("navigates visible rows with the arrow keys", () => {
    const { container } = render(<Files />)
    act(() => row(container, "src").focus())

    key(row(container, "src"), "ArrowDown")
    expect(focused()).toBe("readme")
    key(row(container, "readme"), "ArrowUp")
    expect(focused()).toBe("src")

    key(row(container, "src"), "ArrowRight")
    expect(row(container, "src").getAttribute("aria-expanded")).toBe("true")
    expect(focused()).toBe("src")
    key(row(container, "src"), "ArrowRight")
    expect(focused()).toBe("app")
    key(row(container, "app"), "ArrowLeft")
    expect(focused()).toBe("src")
    key(row(container, "src"), "ArrowLeft")
    expect(row(container, "src").getAttribute("aria-expanded")).toBe("false")

    key(row(container, "src"), "End")
    expect(focused()).toBe("package")
    key(row(container, "package"), "ArrowDown")
    expect(focused()).toBe("package")
    key(row(container, "package"), "Home")
    expect(focused()).toBe("src")
  })

  it("flips the horizontal arrows in right-to-left layouts", () => {
    const { container } = render(
      <div dir="rtl">
        <Files />
      </div>
    )
    act(() => row(container, "src").focus())
    key(row(container, "src"), "ArrowRight")
    expect(row(container, "src").getAttribute("aria-expanded")).toBe("false")
    key(row(container, "src"), "ArrowLeft")
    expect(row(container, "src").getAttribute("aria-expanded")).toBe("true")
  })

  it("expands every sibling branch with *", () => {
    const { container } = render(<Files defaultExpandedValues={["src"]} />)
    act(() => row(container, "utils").focus())
    key(row(container, "utils"), "*")
    expect(row(container, "app").getAttribute("aria-expanded")).toBe("true")
  })

  it("jumps to rows by typing their first letters", () => {
    vi.useFakeTimers()
    const { container } = render(<Files />)
    act(() => row(container, "src").focus())
    key(row(container, "src"), "p")
    expect(focused()).toBe("package")
    act(() => {
      vi.advanceTimersByTime(600)
    })
    key(row(container, "package"), "r")
    expect(focused()).toBe("readme")
    vi.useRealTimers()
  })

  it("selects ranges and toggles items in multiple mode", () => {
    const onSelected = vi.fn()
    const { container } = render(
      <Files selectionMode="multiple" onSelectedValuesChange={onSelected} />
    )
    const tree = container.querySelector('[data-slot="tree"]')!
    expect(tree.getAttribute("aria-multiselectable")).toBe("true")

    fireEvent.click(row(container, "readme"))
    fireEvent.click(row(container, "src"), { shiftKey: true })
    expect(onSelected).toHaveBeenLastCalledWith(["src", "readme"])
    expect(row(container, "src").getAttribute("aria-expanded")).toBe("false")

    fireEvent.click(row(container, "package"), { metaKey: true })
    expect(onSelected).toHaveBeenLastCalledWith(["src", "readme", "package"])
    fireEvent.click(row(container, "readme"), { ctrlKey: true })
    expect(onSelected).toHaveBeenLastCalledWith(["src", "package"])

    act(() => row(container, "src").focus())
    key(row(container, "src"), "ArrowDown", { shiftKey: true })
    expect(focused()).toBe("readme")

    key(row(container, "readme"), "a", { metaKey: true })
    expect(onSelected).toHaveBeenLastCalledWith(["src", "readme", "package"])
  })

  it("does not select anything in none mode but still expands", () => {
    const { container } = render(<Files selectionMode="none" />)
    fireEvent.click(row(container, "src"))
    expect(row(container, "src").hasAttribute("aria-selected")).toBe(false)
    expect(row(container, "src").getAttribute("aria-expanded")).toBe("true")
  })

  it("cascades checks down and derives parents from children", () => {
    const onChecked = vi.fn()
    const { container } = render(
      <Files checkboxes onCheckedValuesChange={onChecked} />
    )
    fireEvent.click(row(container, "src"))
    expect(onChecked).toHaveBeenLastCalledWith([
      "src",
      "app",
      "page",
      "layout",
      "utils",
    ])
    expect(row(container, "src").getAttribute("aria-checked")).toBe("true")
    expect(row(container, "page").getAttribute("aria-checked")).toBe("true")
    expect(row(container, "src").getAttribute("aria-expanded")).toBe("false")

    fireEvent.click(row(container, "layout"))
    expect(onChecked).toHaveBeenLastCalledWith(["page", "utils"])
    expect(row(container, "app").getAttribute("aria-checked")).toBe("mixed")
    expect(row(container, "src").getAttribute("aria-checked")).toBe("mixed")

    act(() => row(container, "src").focus())
    key(row(container, "src"), " ")
    expect(row(container, "src").getAttribute("aria-checked")).toBe("true")
    key(row(container, "src"), "Enter")
    expect(row(container, "src").getAttribute("aria-checked")).toBe("false")
  })

  it("treats a checked parent as checking its children", () => {
    const { container } = render(
      <Files checkboxes defaultCheckedValues={["app"]} />
    )
    expect(row(container, "page").getAttribute("aria-checked")).toBe("true")
    expect(row(container, "src").getAttribute("aria-checked")).toBe("mixed")
    fireEvent.click(row(container, "page"))
    expect(row(container, "app").getAttribute("aria-checked")).toBe("mixed")
    expect(row(container, "layout").getAttribute("aria-checked")).toBe("true")
  })

  it("never flips disabled items when a parent is checked", () => {
    const onChecked = vi.fn()
    const { container } = render(
      <Tree aria-label="Access" checkboxes onCheckedValuesChange={onChecked}>
        <TreeItem value="all">
          <TreeItemLabel>All</TreeItemLabel>
          <TreeGroup>
            <TreeItem value="a">
              <TreeItemLabel>A</TreeItemLabel>
            </TreeItem>
            <TreeItem value="b" disabled>
              <TreeItemLabel>B</TreeItemLabel>
            </TreeItem>
          </TreeGroup>
        </TreeItem>
      </Tree>
    )
    fireEvent.click(row(container, "all"))
    expect(onChecked).toHaveBeenLastCalledWith(["a"])
    expect(row(container, "all").getAttribute("aria-checked")).toBe("mixed")
    fireEvent.click(row(container, "all"))
    expect(onChecked).toHaveBeenLastCalledWith([])
    expect(row(container, "b").getAttribute("aria-disabled")).toBe("true")
  })

  it("skips disabled rows and inherits disabled into children", () => {
    const { container } = render(
      <Tree aria-label="Files" defaultExpandedValues={["a"]}>
        <TreeItem value="a" disabled>
          <TreeItemLabel>A</TreeItemLabel>
          <TreeGroup>
            <TreeItem value="a1">
              <TreeItemLabel>A1</TreeItemLabel>
            </TreeItem>
          </TreeGroup>
        </TreeItem>
        <TreeItem value="b">
          <TreeItemLabel>B</TreeItemLabel>
        </TreeItem>
      </Tree>
    )
    expect(row(container, "a1").getAttribute("aria-disabled")).toBe("true")
    expect(row(container, "b").tabIndex).toBe(0)
    fireEvent.click(row(container, "a"))
    expect(row(container, "a").getAttribute("aria-expanded")).toBe("true")
    expect(row(container, "a").hasAttribute("data-selected")).toBe(false)
  })

  it("follows controlled expanded values and reports item changes", () => {
    const onExpanded = vi.fn()
    const onItem = vi.fn()
    function Controlled() {
      const [expanded, setExpanded] = React.useState<string[]>([])
      return (
        <Tree
          aria-label="Files"
          expandedValues={expanded}
          onExpandedValuesChange={(values) => {
            onExpanded(values)
            setExpanded(values)
          }}
        >
          <TreeItem value="src" onExpandedChange={onItem}>
            <TreeItemLabel>src</TreeItemLabel>
            <TreeGroup>
              <TreeItem value="file">
                <TreeItemLabel>file</TreeItemLabel>
              </TreeItem>
            </TreeGroup>
          </TreeItem>
          <button type="button" onClick={() => setExpanded([])}>
            Collapse
          </button>
        </Tree>
      )
    }
    const { container, getByText } = render(<Controlled />)
    fireEvent.click(row(container, "src"))
    expect(onExpanded).toHaveBeenLastCalledWith(["src"])
    expect(onItem).toHaveBeenLastCalledWith(true)
    expect(row(container, "src").getAttribute("aria-expanded")).toBe("true")
    fireEvent.click(getByText("Collapse"))
    expect(row(container, "src").getAttribute("aria-expanded")).toBe("false")
  })

  it("ignores a stale controlled value until the parent updates", () => {
    const { container } = render(
      <Files expandedValues={[]} onExpandedValuesChange={() => {}} />
    )
    fireEvent.click(row(container, "src"))
    expect(row(container, "src").getAttribute("aria-expanded")).toBe("false")
  })

  it("lets a user handler cancel the default action", () => {
    const { container } = render(
      <Tree aria-label="Files">
        <TreeItem value="src">
          <TreeItemLabel onClick={(event) => event.preventDefault()}>
            src
          </TreeItemLabel>
          <TreeGroup>
            <TreeItem value="file">
              <TreeItemLabel>file</TreeItemLabel>
            </TreeItem>
          </TreeGroup>
        </TreeItem>
      </Tree>
    )
    fireEvent.click(row(container, "src"))
    expect(row(container, "src").getAttribute("aria-expanded")).toBe("false")
  })

  it("renders rows as links", () => {
    const { container } = render(
      <Tree aria-label="Docs">
        <TreeItem value="intro">
          <TreeItemLabel render={<a href="#intro" />}>Intro</TreeItemLabel>
        </TreeItem>
      </Tree>
    )
    const link = row(container, "intro")
    expect(link.tagName).toBe("A")
    expect(link.getAttribute("role")).toBe("treeitem")
  })

  it("renders icons, an expanded icon and meta", () => {
    const { container } = render(
      <Tree aria-label="Files">
        <TreeItem value="src">
          <TreeItemLabel
            icon={<svg data-testid="closed" />}
            expandedIcon={<svg data-testid="open" />}
            meta="M"
          >
            src
          </TreeItemLabel>
        </TreeItem>
      </Tree>
    )
    const label = row(container, "src")
    expect(label.querySelector('[data-testid="closed"]')).not.toBeNull()
    expect(label.querySelector('[data-testid="open"]')).not.toBeNull()
    expect(
      label.querySelector('[data-slot="tree-item-meta"]')?.textContent
    ).toBe("M")
  })

  it("throws helpful errors outside the root", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<TreeItem value="x" />)).toThrow(
      "TreeItem must be used within <Tree>."
    )
    expect(() =>
      render(
        <Tree aria-label="x">
          <TreeItemLabel>x</TreeItemLabel>
        </Tree>
      )
    ).toThrow("TreeItemLabel must be used within <TreeItem>.")
  })

  it("renders on the server with collapsed groups kept findable", () => {
    const html = renderToString(<Files />)
    expect(html).toContain('role="tree"')
    expect(html).toContain('role="group"')
    expect(html).toContain("page.tsx")
  })

  it("keeps collapsed groups mounted and findable on the client", () => {
    const { container } = render(<Files />)
    const group = container.querySelector('[data-slot="tree-group"]')
    expect(group?.getAttribute("hidden")).toBe("until-found")
    expect(row(container, "page")).toBeDefined()
  })

  it("keeps collapsed groups mounted when hiddenUntilFound is off", () => {
    const { container } = render(<Files hiddenUntilFound={false} />)
    const group = container.querySelector('[data-slot="tree-group"]')
    expect(group?.hasAttribute("hidden")).toBe(true)
    expect(group?.getAttribute("hidden")).not.toBe("until-found")
    expect(row(container, "page")).toBeDefined()
  })
})
