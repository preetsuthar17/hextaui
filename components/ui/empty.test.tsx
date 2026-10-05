import * as React from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty"

afterEach(() => {
  cleanup()
})

function slot(container: HTMLElement, name: string) {
  return container.querySelector<HTMLElement>(`[data-slot=${name}]`)!
}

function FullEmpty(props: React.ComponentProps<typeof Empty>) {
  return (
    <Empty {...props}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <svg data-testid="icon" />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          Create your first project. <a href="/docs">Read the docs</a>
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <button type="button">Create project</button>
      </EmptyContent>
    </Empty>
  )
}

describe("Empty", () => {
  it("renders every part with its data-slot", () => {
    const { container } = render(<FullEmpty />)

    for (const name of [
      "empty",
      "empty-header",
      "empty-icon",
      "empty-title",
      "empty-description",
      "empty-content",
    ]) {
      expect(slot(container, name)).not.toBeNull()
    }
  })

  it("defaults to the default variant and size", () => {
    const { container } = render(<FullEmpty />)
    const root = slot(container, "empty")

    expect(root.getAttribute("data-variant")).toBe("default")
    expect(root.getAttribute("data-size")).toBe("default")
    expect(root.className).not.toContain("border-dashed")
  })

  it("applies outline, muted and sm variants", () => {
    const { container, rerender } = render(<FullEmpty variant="outline" />)

    expect(slot(container, "empty").className).toContain("border-dashed")

    rerender(<FullEmpty variant="muted" size="sm" />)
    const root = slot(container, "empty")
    expect(root.getAttribute("data-variant")).toBe("muted")
    expect(root.getAttribute("data-size")).toBe("sm")
    expect(root.className).toContain("bg-muted/50")
  })

  it("marks the media variant", () => {
    const { container } = render(
      <Empty>
        <EmptyMedia>
          <img alt="" src="/preview/landscape.svg" />
        </EmptyMedia>
      </Empty>
    )

    expect(slot(container, "empty-icon").getAttribute("data-variant")).toBe(
      "default"
    )
  })

  it("hides decorative icon media from assistive tech, overridably", () => {
    const { container, rerender } = render(
      <Empty>
        <EmptyMedia variant="icon">
          <svg />
        </EmptyMedia>
      </Empty>
    )

    expect(slot(container, "empty-icon").getAttribute("aria-hidden")).toBe(
      "true"
    )

    rerender(
      <Empty>
        <EmptyMedia variant="icon" aria-hidden={false}>
          <svg />
        </EmptyMedia>
      </Empty>
    )
    expect(slot(container, "empty-icon").getAttribute("aria-hidden")).toBe(
      "false"
    )

    rerender(
      <Empty>
        <EmptyMedia>
          <img alt="Team photo" src="/preview/landscape.svg" />
        </EmptyMedia>
      </Empty>
    )
    expect(slot(container, "empty-icon").hasAttribute("aria-hidden")).toBe(
      false
    )
  })

  it("lets the title render as a real heading", () => {
    render(
      <Empty>
        <EmptyTitle render={<h2 />}>Nothing here</EmptyTitle>
      </Empty>
    )

    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading.textContent).toBe("Nothing here")
    expect(heading.getAttribute("data-slot")).toBe("empty-title")
  })

  it("keeps data-slot when the caller passes one", () => {
    const { container } = render(
      <Empty data-slot="custom">
        <EmptyTitle data-slot="custom-title">Title</EmptyTitle>
      </Empty>
    )

    expect(slot(container, "empty")).not.toBeNull()
    expect(slot(container, "empty-title")).not.toBeNull()
  })

  it("merges className and forwards props and refs", () => {
    const ref = React.createRef<HTMLDivElement>()
    const { container } = render(
      <Empty ref={ref} className="min-h-80" id="files-empty" role="status">
        <EmptyTitle>Empty</EmptyTitle>
      </Empty>
    )
    const root = slot(container, "empty")

    expect(ref.current).toBe(root)
    expect(root.className).toContain("min-h-80")
    expect(root.id).toBe("files-empty")
    expect(root.getAttribute("role")).toBe("status")
  })

  it("renders the root as another element", () => {
    const { container } = render(
      <Empty render={<section aria-label="Inbox" />}>
        <EmptyTitle>Inbox zero</EmptyTitle>
      </Empty>
    )

    const root = slot(container, "empty")
    expect(root.tagName).toBe("SECTION")
    expect(root.getAttribute("aria-label")).toBe("Inbox")
  })

  it("styles plain links in the description but not component links", () => {
    const { container } = render(
      <Empty>
        <EmptyDescription>
          <a href="/a">Plain</a>
        </EmptyDescription>
      </Empty>
    )

    expect(slot(container, "empty-description").className).toContain(
      "[&_a:not([data-slot])]:underline"
    )
  })

  it("handles empty and hostile content without throwing", () => {
    const long = "a".repeat(400)
    const { container } = render(
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{long}</EmptyTitle>
          <EmptyDescription>{""}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent />
      </Empty>
    )

    expect(slot(container, "empty-title").className).toContain("wrap-anywhere")
    expect(slot(container, "empty-title").textContent).toBe(long)
  })

  it("server renders", () => {
    const html = renderToString(<FullEmpty variant="outline" size="sm" />)

    expect(html).toContain('data-slot="empty"')
    expect(html).toContain('data-variant="outline"')
    expect(html).toContain("No projects yet")
  })
})

describe("stack media and entrance", () => {
  it("hides stack media from assistive tech and animates by default", () => {
    const { container } = render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="stack">
            <svg />
          </EmptyMedia>
          <EmptyTitle>Nothing here</EmptyTitle>
        </EmptyHeader>
      </Empty>
    )

    expect(slot(container, "empty").hasAttribute("data-animated")).toBe(true)
    const media = slot(container, "empty-icon")
    expect(media.getAttribute("data-variant")).toBe("stack")
    expect(media.getAttribute("aria-hidden")).toBe("true")
  })

  it("can turn the entrance off", () => {
    const { container } = render(<Empty animated={false} />)
    expect(slot(container, "empty").hasAttribute("data-animated")).toBe(false)
  })
})
