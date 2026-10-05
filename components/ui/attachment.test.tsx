import * as React from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "./attachment"

afterEach(() => {
  cleanup()
})

function root(container: HTMLElement) {
  return container.querySelector<HTMLElement>("[data-slot=attachment]")!
}

describe("Attachment", () => {
  it("exposes state, size and orientation", () => {
    const { container } = render(
      <Attachment state="idle" size="sm" orientation="vertical" />
    )
    const element = root(container)

    expect(element.getAttribute("data-state")).toBe("idle")
    expect(element.getAttribute("data-size")).toBe("sm")
    expect(element.getAttribute("data-orientation")).toBe("vertical")
  })

  it("renders a labelled progress bar only while uploading", () => {
    const { container, rerender } = render(
      <Attachment state="uploading" progress={42}>
        <AttachmentContent>
          <AttachmentTitle>report.pdf</AttachmentTitle>
        </AttachmentContent>
      </Attachment>
    )
    const bar = screen.getByRole("progressbar")
    const title = container.querySelector("[data-slot=attachment-title]")!

    expect(bar.getAttribute("aria-valuenow")).toBe("42")
    expect(bar.getAttribute("aria-labelledby")).toBe(title.id)
    expect(
      bar.querySelector<HTMLElement>("[data-slot=progress-indicator]")!.style
        .width
    ).toBe("42%")
    expect(bar.getAttribute("aria-valuetext")).toBe("42%")

    rerender(
      <Attachment state="done" progress={100}>
        <AttachmentContent>
          <AttachmentTitle>report.pdf</AttachmentTitle>
        </AttachmentContent>
      </Attachment>
    )
    expect(screen.queryByRole("progressbar")).toBeNull()
  })

  it.each([
    [-20, "0"],
    [180, "100"],
    [Number.NaN, "0"],
  ])("clamps progress %s to %s", (progress, expected) => {
    render(<Attachment state="uploading" progress={progress} />)

    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
      expected
    )
  })

  it("does not pop in when server rendered", () => {
    const html = renderToString(<Attachment />)

    expect(html.includes("zoom-in-95")).toBe(false)
  })

  it("pops in when mounted on the client", () => {
    const { container } = render(<Attachment />)

    expect(root(container).className).toContain("zoom-in-95")
  })
})

describe("AttachmentTitle", () => {
  it("keeps the extension visible and exposes the full name", () => {
    const { container } = render(
      <Attachment>
        <AttachmentTitle>quarterly-sales-report-final.pdf</AttachmentTitle>
      </Attachment>
    )
    const title = container.querySelector("[data-slot=attachment-title]")!
    const [base, extension] = Array.from(title.children)

    expect(title.getAttribute("title")).toBe("quarterly-sales-report-final.pdf")
    expect(base.textContent).toBe("quarterly-sales-report-final")
    expect(base.className).toContain("truncate")
    expect(extension.textContent).toBe(".pdf")
    expect(extension.className).toContain("shrink-0")
  })

  it.each(["README", ".env", "archive.", "photo.backup-original"])(
    "falls back to plain truncation for %s",
    (name) => {
      const { container } = render(<AttachmentTitle>{name}</AttachmentTitle>)
      const title = container.querySelector("[data-slot=attachment-title]")!

      expect(title.children).toHaveLength(0)
      expect(title.className).toContain("truncate")
    }
  )

  it("renders non-string children as they are", () => {
    const { container } = render(
      <AttachmentTitle>
        <em>draft</em>.pdf
      </AttachmentTitle>
    )

    expect(container.querySelector("em")?.textContent).toBe("draft")
  })

  it("shimmers only while uploading or processing", () => {
    const states = ["uploading", "processing", "done", "error", "idle"] as const

    for (const state of states) {
      const { container, unmount } = render(
        <Attachment state={state}>
          <AttachmentTitle>file.png</AttachmentTitle>
        </Attachment>
      )
      expect(
        container.querySelector("[data-slot=attachment-title]")!.className
      ).toContain("group-data-[state=uploading]/attachment:shimmer")
      expect(root(container).getAttribute("data-state")).toBe(state)
      unmount()
    }
  })
})

describe("Attachment actions and trigger", () => {
  it("renders a ghost icon-xs action", () => {
    render(<AttachmentAction aria-label="Remove file.png">x</AttachmentAction>)
    const button = screen.getByRole("button", { name: "Remove file.png" })

    expect(button.getAttribute("data-slot")).toBe("attachment-action")
    expect(button.className).toContain("size-6")
  })

  it("renders the trigger as a button with type button", () => {
    render(<AttachmentTrigger aria-label="Open file.png" />)
    const trigger = screen.getByRole("button", { name: "Open file.png" })

    expect(trigger.getAttribute("type")).toBe("button")
    expect(trigger.getAttribute("data-slot")).toBe("attachment-trigger")
  })

  it("renders the trigger as a link", () => {
    render(
      <AttachmentTrigger
        render={<a href="/file.png" aria-label="Open file.png" />}
      />
    )
    const link = screen.getByRole("link", { name: "Open file.png" })

    expect(link.hasAttribute("type")).toBe(false)
    expect(link.getAttribute("data-slot")).toBe("attachment-trigger")
  })
})

describe("Attachment under hostile data", () => {
  it("handles extreme and unusual file names", () => {
    const cases: [string, string | null][] = [
      ["x".repeat(300) + ".pdf", ".pdf"],
      ["archive.tar.gz", ".gz"],
      ["🎉🎉🎉 party photo.png", ".png"],
      ["<script>alert(1)</script>.html", ".html"],
      ["name with    spaces .txt", ".txt"],
      ["‏تقرير.pdf", ".pdf"],
      ["a".repeat(500), null],
    ]

    for (const [name, extension] of cases) {
      const { container, unmount } = render(
        <AttachmentTitle>{name}</AttachmentTitle>
      )
      const title = container.querySelector("[data-slot=attachment-title]")!

      expect(title.getAttribute("title")).toBe(name)
      expect(title.textContent).toBe(name)
      expect(container.querySelector("script")).toBeNull()
      expect(title.lastElementChild?.textContent ?? null).toBe(extension)
      unmount()
    }
  })

  it("renders empty and numeric children without crashing", () => {
    const { container } = render(
      <>
        <AttachmentTitle>{""}</AttachmentTitle>
        <AttachmentTitle>{0}</AttachmentTitle>
        <AttachmentTitle>{null}</AttachmentTitle>
      </>
    )
    const titles = container.querySelectorAll("[data-slot=attachment-title]")

    expect(titles).toHaveLength(3)
    expect(titles[1].textContent).toBe("0")
  })

  it("survives hundreds of random state and progress updates", () => {
    const states = ["idle", "uploading", "processing", "error", "done"] as const
    const { rerender } = render(<Attachment />)
    let seed = 7
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }

    for (let index = 0; index < 500; index++) {
      const state = states[Math.floor(random() * states.length)]
      const progress = random() * 300 - 100
      rerender(
        <Attachment state={state} progress={progress}>
          <AttachmentContent>
            <AttachmentTitle>{`file-${index}.bin`}</AttachmentTitle>
          </AttachmentContent>
        </Attachment>
      )
    }

    rerender(
      <Attachment state="uploading" progress={250}>
        <AttachmentContent>
          <AttachmentTitle>final.bin</AttachmentTitle>
        </AttachmentContent>
      </Attachment>
    )
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
      "100"
    )
  })

  it("renders 200 attachments in a group and survives removals", () => {
    const names = Array.from({ length: 200 }, (_, index) => `file-${index}.pdf`)
    const { container, rerender } = render(
      <AttachmentGroup>
        {names.map((name) => (
          <Attachment key={name}>
            <AttachmentTitle>{name}</AttachmentTitle>
          </Attachment>
        ))}
      </AttachmentGroup>
    )

    expect(container.querySelectorAll("[data-slot=attachment]")).toHaveLength(
      200
    )

    rerender(
      <AttachmentGroup>
        {names
          .filter((_, index) => index % 3 !== 0)
          .map((name) => (
            <Attachment key={name}>
              <AttachmentTitle>{name}</AttachmentTitle>
            </Attachment>
          ))}
      </AttachmentGroup>
    )

    expect(container.querySelectorAll("[data-slot=attachment]")).toHaveLength(
      133
    )
  })

  it("keeps the media slot when the media is an image", () => {
    const { container } = render(
      <Attachment>
        <AttachmentMedia variant="image">
          <img src="/a.png" alt="" />
        </AttachmentMedia>
      </Attachment>
    )

    expect(
      container.querySelector("[data-slot=attachment-media]")
    ).not.toBeNull()
  })

  it("floats actions only on vertical attachments", () => {
    const { container } = render(
      <>
        <Attachment orientation="vertical">
          <AttachmentActions data-testid="vertical" />
        </Attachment>
        <Attachment>
          <AttachmentActions data-testid="horizontal" />
        </Attachment>
      </>
    )

    expect(
      container.querySelector("[data-testid=vertical]")!.className
    ).toContain("absolute")
    expect(
      container.querySelector("[data-testid=horizontal]")!.className
    ).not.toContain("absolute")
  })
})
