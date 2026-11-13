import * as React from "react"
import { act, cleanup, fireEvent, render } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Rating, RatingItem, createRatingController } from "./ui-sdk-rating"

afterEach(cleanup)

const label = (value: number, max: number) => `${value} of ${max}`

describe("UI SDK Rating", () => {
  it("renders one star per score with the default icon", () => {
    const { container } = render(
      <Rating aria-label="Rating" defaultValue={3} getValueLabel={label}>
        <RatingItem />
      </Rating>
    )
    const items = container.querySelectorAll("[data-slot=rating-item]")
    expect(items).toHaveLength(5)
    expect(items[0].querySelectorAll("svg")).toHaveLength(2)
    expect(container.querySelectorAll("[data-filled]")).toHaveLength(3)
  })

  it("sets size and tone attributes for styling", () => {
    const { container } = render(
      <Rating aria-label="Rating" size="lg" tone="destructive">
        <RatingItem />
      </Rating>
    )
    const root = container.querySelector("[data-slot=rating]")!
    expect(root.getAttribute("data-size")).toBe("lg")
    expect(root.getAttribute("data-tone")).toBe("destructive")
  })

  it("keeps a custom icon", () => {
    const { container } = render(
      <Rating aria-label="Rating">
        <RatingItem>
          <span data-testid="heart" />
        </RatingItem>
      </Rating>
    )
    expect(container.querySelectorAll("[data-testid=heart]")).toHaveLength(5)
    expect(container.querySelector("svg")).toBeNull()
  })

  it("is one image when read-only", () => {
    const { container } = render(
      <Rating
        readOnly
        value={4.3}
        getValueLabel={(value, max) => `Rated ${value} out of ${max}`}
      >
        <RatingItem />
      </Rating>
    )
    const root = container.querySelector("[data-slot=rating]")!
    expect(root.getAttribute("role")).toBe("img")
    expect(root.getAttribute("aria-label")).toBe("Rated 4.3 out of 5")
  })

  it("calls onValueChange when a star is checked", () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(
      <Rating
        aria-label="Rating"
        getValueLabel={label}
        onValueChange={onValueChange}
      >
        <RatingItem />
      </Rating>
    )
    fireEvent.click(getByRole("radio", { name: "4 of 5" }))
    expect(onValueChange.mock.calls[0][0]).toBe(4)
  })

  it("follows a controller", () => {
    const controller = createRatingController()
    const { container } = render(
      <Rating aria-label="Rating" controller={controller} defaultValue={1}>
        <RatingItem />
      </Rating>
    )
    act(() => controller.setValue(5))
    expect(container.querySelectorAll("[data-filled]")).toHaveLength(5)
  })

  it("renders on the server", () => {
    const html = renderToString(
      <Rating aria-label="Rating" defaultValue={2}>
        <RatingItem />
      </Rating>
    )
    expect(html).toContain('data-slot="rating"')
    expect(html).toContain("--rating-fill")
  })
})
