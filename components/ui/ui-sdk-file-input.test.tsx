import * as React from "react"
import { act, cleanup, fireEvent, render } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemName,
  FileInputList,
  FileInputRejections,
  FileInputTrigger,
  createFileInputController,
} from "./ui-sdk-file-input"

afterEach(cleanup)

beforeEach(() => {
  URL.createObjectURL = vi.fn(() => "blob:preview")
  URL.revokeObjectURL = vi.fn()
})

function file(name: string, size: number, type = "text/plain") {
  return new File(["x".repeat(size)], name, { type })
}

function Example(props: React.ComponentProps<typeof FileInput>) {
  return (
    <FileInput multiple {...props}>
      <FileInputDropzone>
        <FileInputTrigger>Browse files</FileInputTrigger>
      </FileInputDropzone>
      <FileInputRejections />
      <FileInputList aria-label="Files">
        <FileInputItem />
      </FileInputList>
    </FileInput>
  )
}

describe("UI SDK File Input", () => {
  it("renders a hidden file input with the rules", () => {
    const { container } = render(
      <Example accept={["image/*", ".pdf"]} name="files" />
    )
    const input = container.querySelector("input[type=file]")!
    expect(input.getAttribute("accept")).toBe("image/*,.pdf")
    expect(input.hasAttribute("multiple")).toBe(true)
    expect(input.getAttribute("tabindex")).toBe("-1")
  })

  it("renders a finished row for each file", () => {
    const controller = createFileInputController()
    const { container, getByRole } = render(<Example controller={controller} />)
    act(() => {
      controller.addFiles([file("notes.txt", 2400), file("plan.md", 10)])
    })
    const items = container.querySelectorAll("[data-slot=file-input-item]")
    expect(items).toHaveLength(2)
    expect(items[0].textContent).toContain("notes.txt")
    expect(items[0].textContent).toContain("2.4 kB")
    expect(getByRole("button", { name: "Remove plan.md" })).toBeTruthy()
  })

  it("lists rejected files with their reasons", () => {
    const controller = createFileInputController()
    const onReject = vi.fn()
    const { container } = render(
      <Example
        controller={controller}
        accept="image/*"
        maxSize={1000}
        onReject={onReject}
      />
    )
    act(() => {
      controller.addFiles([file("big.png", 5000, "image/png")])
    })
    expect(onReject.mock.calls[0][0][0].reasons).toEqual(["file-too-large"])
    const rejections = container.querySelector(
      "[data-slot=file-input-rejections]"
    )!
    expect(rejections.textContent).toContain("big.png")
    expect(rejections.textContent).toContain("Larger than 1 kB")
    act(() => {
      controller.addFiles([file("ok.png", 10, "image/png")])
    })
    expect(
      container.querySelector("[data-slot=file-input-rejections]")
    ).toBeNull()
  })

  it("names reasons with getReasonLabel", () => {
    const controller = createFileInputController()
    const { container } = render(
      <FileInput controller={controller} accept=".pdf">
        <FileInputRejections
          getReasonLabel={(reason) =>
            reason === "file-type" ? "PDF only" : reason
          }
        />
      </FileInput>
    )
    act(() => {
      controller.addFiles([file("a.txt", 1)])
    })
    expect(container.textContent).toContain("PDF only")
  })

  it("removes a file with its remove button and with Delete", () => {
    const onValueChange = vi.fn()
    const { container, getByRole } = render(
      <Example
        defaultValue={[file("a.txt", 1), file("b.txt", 1), file("c.txt", 1)]}
        onValueChange={onValueChange}
      />
    )
    fireEvent.click(getByRole("button", { name: "Remove a.txt" }))
    expect(onValueChange.mock.calls[0][1].reason).toBe("remove-press")
    const items = container.querySelectorAll<HTMLElement>(
      "[data-slot=file-input-item]"
    )
    expect(items).toHaveLength(2)
    fireEvent.keyDown(items[0], { key: "Delete" })
    expect(
      container.querySelectorAll("[data-slot=file-input-item]")
    ).toHaveLength(1)
  })

  it("previews images with an object URL", () => {
    const { container } = render(
      <Example defaultValue={[file("photo.png", 10, "image/png")]} />
    )
    const preview = container.querySelector(
      "[data-slot=file-input-item-preview]"
    )!
    expect(preview.getAttribute("data-kind")).toBe("image")
    expect(preview.querySelector("img")?.getAttribute("src")).toBe(
      "blob:preview"
    )
  })

  it("keeps a file name's extension when it truncates", () => {
    const { container } = render(
      <FileInput defaultValue={[file("quarterly-report.pdf", 1)]}>
        <FileInputList>
          <FileInputItem>
            <FileInputItemName />
          </FileInputItem>
        </FileInputList>
      </FileInput>
    )
    const name = container.querySelector("[data-slot=file-input-item-name]")!
    expect(name.children[1].textContent).toBe(".pdf")
  })

  it("marks invalid and disabled states", () => {
    const { container, getByRole, rerender } = render(<Example invalid />)
    const root = container.querySelector("[data-slot=file-input]")!
    expect(root.hasAttribute("data-invalid")).toBe(true)
    expect(
      getByRole("button", { name: "Browse files" }).getAttribute("aria-invalid")
    ).toBe("true")
    rerender(<Example disabled />)
    expect(root.hasAttribute("data-disabled")).toBe(true)
    expect(
      (getByRole("button", { name: "Browse files" }) as HTMLButtonElement)
        .disabled
    ).toBe(true)
    expect(
      container
        .querySelector("[data-slot=file-input-dropzone]")!
        .hasAttribute("data-disabled")
    ).toBe(true)
  })

  it("renders on the server", () => {
    const html = renderToString(<Example name="files" />)
    expect(html).toContain('data-slot="file-input-dropzone"')
    expect(html).toContain('type="file"')
  })
})
