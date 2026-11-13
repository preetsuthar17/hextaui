import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion"

afterEach(() => {
  cleanup()
})

function triggers(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>('[data-slot="accordion-trigger"]')
  )
}

describe("Accordion", () => {
  it("puts each item’s index on its trigger", () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>One</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>B</AccordionTrigger>
          <AccordionContent>Two</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    expect(
      triggers(container).map((t) => t.getAttribute("data-index"))
    ).toEqual(["0", "1"])
  })

  it("disables the native trigger of a disabled item", () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="a" disabled>
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>One</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>B</AccordionTrigger>
          <AccordionContent>Two</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    const [first, second] = triggers(container)

    expect(first.hasAttribute("disabled")).toBe(true)
    expect(first.hasAttribute("data-disabled")).toBe(true)
    expect(second.hasAttribute("disabled")).toBe(false)
  })
})
