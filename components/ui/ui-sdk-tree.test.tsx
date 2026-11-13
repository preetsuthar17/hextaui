import * as React from "react"
import { act, cleanup, render } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, beforeAll, describe, expect, it } from "vitest"

import {
  createTreeController,
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemCheckbox,
  TreeItemLabel,
  type TreeItemData,
} from "./ui-sdk-tree"

beforeAll(() => {
  if (!Element.prototype.getAnimations) {
    Element.prototype.getAnimations = () => []
  }
})

afterEach(cleanup)

const items: TreeItemData[] = [
  {
    value: "fruit",
    label: "Fruit",
    children: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
    ],
  },
  { value: "bread", label: "Bread", href: "#bread" },
]

describe("UI SDK Tree", () => {
  it("renders styled rows from items when it has no children", () => {
    const { container } = render(
      <Tree aria-label="Groceries" items={items} defaultExpanded={["fruit"]} />
    )
    expect(container.querySelectorAll("[role=treeitem]")).toHaveLength(4)
    expect(
      container.querySelectorAll("[data-slot=tree-indicator] svg")
    ).toHaveLength(1)
    expect(
      container.querySelector("a[data-slot=tree-label]")?.getAttribute("href")
    ).toBe("#bread")
  })

  it("builds folders first from paths", () => {
    const { container } = render(
      <Tree
        aria-label="Project"
        paths={["README.md", "src/index.ts"]}
        defaultExpanded={["src"]}
      />
    )
    const labels = [
      ...container.querySelectorAll("[role=treeitem][aria-level='1']"),
    ].map((item) => item.querySelector("[data-slot=tree-label]")?.textContent)
    expect(labels).toEqual(["src", "README.md"])
  })

  it("sets variant and size attributes for styling", () => {
    const { container } = render(
      <Tree aria-label="Groceries" items={items} variant="lines" size="sm" />
    )
    const root = container.querySelector("[data-slot=tree]")!
    expect(root.getAttribute("data-variant")).toBe("lines")
    expect(root.getAttribute("data-size")).toBe("sm")
  })

  it("draws a check, a dash or nothing in each checkbox", () => {
    const { container } = render(
      <Tree
        aria-label="Groceries"
        items={items}
        checkable
        defaultChecked={["apple"]}
        defaultExpanded={["fruit"]}
      >
        {items.map((item) => (
          <TreeItem key={item.value} value={item.value}>
            <TreeItemLabel>
              <TreeItemCheckbox />
              {item.label}
            </TreeItemLabel>
            {item.children && (
              <TreeGroup>
                {item.children.map((child) => (
                  <TreeItem key={child.value} value={child.value}>
                    <TreeItemLabel>
                      <TreeItemCheckbox />
                      {child.label}
                    </TreeItemLabel>
                  </TreeItem>
                ))}
              </TreeGroup>
            )}
          </TreeItem>
        ))}
      </Tree>
    )
    const boxes = [...container.querySelectorAll("[data-slot=tree-checkbox]")]
    const marks = boxes.map((box) => box.querySelectorAll("svg").length)
    expect(boxes[0].hasAttribute("data-indeterminate")).toBe(true)
    expect(marks).toEqual([1, 1, 0, 0])
  })

  it("follows a controller", () => {
    const controller = createTreeController()
    const { container } = render(
      <Tree aria-label="Groceries" items={items} controller={controller} />
    )
    expect(container.querySelectorAll("[role=treeitem]")).toHaveLength(2)
    act(() => {
      controller.expandAll()
    })
    expect(container.querySelectorAll("[role=treeitem]")).toHaveLength(4)
  })

  it("renders on the server", () => {
    const html = renderToString(
      <Tree aria-label="Groceries" items={items} defaultExpanded={["fruit"]} />
    )
    expect(html).toContain('data-slot="tree"')
    expect(html).toContain("Banana")
  })
})
