import * as React from "react"
import { cleanup, render } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"

import {
  ImageCropper,
  ImageCropperFlip,
  ImageCropperGrid,
  ImageCropperHandles,
  ImageCropperImage,
  ImageCropperRotate,
  ImageCropperSelection,
  ImageCropperViewport,
  ImageCropperZoom,
} from "./ui-sdk-image-cropper"

afterEach(cleanup)

function Cropper(props: Partial<React.ComponentProps<typeof ImageCropper>>) {
  return (
    <ImageCropper aria-label="Photo" src="/photo.jpg" {...props}>
      <ImageCropperViewport>
        <ImageCropperImage alt="A lake" />
        <ImageCropperSelection>
          <ImageCropperGrid />
          <ImageCropperHandles />
        </ImageCropperSelection>
      </ImageCropperViewport>
      <ImageCropperZoom />
      <ImageCropperRotate />
      <ImageCropperFlip />
      <ImageCropperFlip direction="vertical" />
    </ImageCropper>
  )
}

describe("UI SDK ImageCropper", () => {
  it("renders all eight handles and a grid in thirds", () => {
    const { container } = render(<Cropper />)
    const positions = [
      ...container.querySelectorAll("[data-slot=image-cropper-handle]"),
    ].map((handle) => handle.getAttribute("data-position"))
    expect(positions).toEqual(["nw", "n", "ne", "e", "se", "s", "sw", "w"])
    expect(
      container.querySelectorAll("[data-slot=image-cropper-grid] > span")
    ).toHaveLength(4)
  })

  it("stays busy and locked until the image loads", () => {
    const { container, getByRole } = render(<Cropper />)
    const root = container.querySelector("[data-slot=image-cropper]")!
    expect(root.getAttribute("aria-busy")).toBe("true")
    expect(root.hasAttribute("data-loading")).toBe(true)
    expect(getByRole("button", { name: "Rotate" })).toHaveProperty(
      "disabled",
      true
    )
  })

  it("labels the icon buttons, and lets children replace them", () => {
    const { getByRole, rerender } = render(<Cropper />)
    expect(getByRole("button", { name: "Flip horizontally" })).toBeTruthy()
    expect(getByRole("button", { name: "Flip vertically" })).toBeTruthy()
    rerender(
      <ImageCropper aria-label="Photo" src="/photo.jpg">
        <ImageCropperRotate>Turn</ImageCropperRotate>
        <ImageCropperRotate aria-label="Drehen" />
      </ImageCropper>
    )
    expect(getByRole("button", { name: "Turn" }).querySelector("svg")).toBe(
      null
    )
    expect(getByRole("button", { name: "Drehen" })).toBeTruthy()
  })

  it("marks frame mode and a round shape for styling", () => {
    const { container } = render(<Cropper mode="frame" shape="circle" />)
    const viewport = container.querySelector(
      "[data-slot=image-cropper-viewport]"
    )!
    expect(viewport.getAttribute("data-mode")).toBe("frame")
    expect(viewport.getAttribute("data-shape")).toBe("circle")
  })

  it("renders on the server", () => {
    const html = renderToString(<Cropper />)
    expect(html).toContain('data-slot="image-cropper-viewport"')
    expect(html).toContain('alt="A lake"')
  })
})
