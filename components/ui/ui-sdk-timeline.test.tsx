import * as React from "react"
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"

import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
  createTimelineController,
} from "./ui-sdk-timeline"

afterEach(cleanup)

function Example(props: Partial<React.ComponentProps<typeof Timeline>>) {
  return (
    <Timeline aria-label="Activity" {...props}>
      <TimelineItem value="a" status="complete">
        <TimelineMarker variant="success" />
        <TimelineConnector />
        <TimelineTitle>Deployed</TimelineTitle>
        <TimelineTime dateTime="2026-11-10T14:32">2:32 PM</TimelineTime>
        <TimelineDescription>Version 2.4.1 is live.</TimelineDescription>
      </TimelineItem>
      <TimelineItem value="b" status="current">
        <TimelineMarker />
        <TimelineConnector />
        <TimelineTitle>Checks running</TimelineTitle>
      </TimelineItem>
      <TimelineItem value="c" status="upcoming">
        <TimelineMarker />
        <TimelineConnector />
        <TimelineTitle>Release notes</TimelineTitle>
      </TimelineItem>
    </Timeline>
  )
}

describe("UI SDK Timeline", () => {
  it("renders a named list of events named by their titles", async () => {
    const { getByRole, getAllByRole } = render(<Example />)
    expect(getByRole("list", { name: "Activity" })).toBeTruthy()
    const items = getAllByRole("listitem")
    expect(items).toHaveLength(3)
    await waitFor(() =>
      expect(getByRole("listitem", { name: "Deployed" })).toBe(items[0])
    )
    expect(items[0].getAttribute("aria-describedby")?.split(" ")).toHaveLength(
      2
    )
    expect(items[1].getAttribute("aria-current")).toBe("step")
    expect(items[1].tabIndex).toBe(0)
    expect(items[0].tabIndex).toBe(-1)
  })

  it("marks status and variants on the parts", () => {
    const { container } = render(<Example />)
    const markers = container.querySelectorAll('[data-slot="timeline-marker"]')
    expect(markers[0].hasAttribute("data-complete")).toBe(true)
    expect(markers[0].getAttribute("data-variant")).toBe("success")
    expect(markers[0].getAttribute("aria-hidden")).toBe("true")
    expect(markers[2].hasAttribute("data-upcoming")).toBe(true)
    expect(
      container
        .querySelector('[data-slot="timeline-time"]')
        ?.getAttribute("datetime")
    ).toBe("2026-11-10T14:32")
  })

  it("moves between events with the arrow keys", () => {
    const { getAllByRole } = render(<Example />)
    const items = getAllByRole("listitem")
    act(() => items[1].focus())
    fireEvent.keyDown(items[1], { key: "ArrowDown" })
    expect(document.activeElement).toBe(items[2])
    fireEvent.keyDown(items[2], { key: "Home" })
    expect(document.activeElement).toBe(items[0])
  })

  it("focuses an event from a controller", () => {
    const controller = createTimelineController()
    const { getAllByRole } = render(<Example controller={controller} />)
    act(() => controller.focus("c"))
    expect(document.activeElement).toBe(getAllByRole("listitem")[2])
  })

  it("becomes a feed of articles", () => {
    const { getByRole, getAllByRole } = render(<Example feed busy />)
    expect(getByRole("feed").getAttribute("aria-busy")).toBe("true")
    const articles = getAllByRole("article")
    expect(articles[0].getAttribute("aria-setsize")).toBe("3")
  })

  it("renders on the server", () => {
    const html = renderToString(<Example orientation="horizontal" />)
    expect(html).toContain('data-slot="timeline"')
    expect(html).toContain('data-orientation="horizontal"')
  })
})
