import * as React from "react"
import { act, cleanup, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  getInitials,
} from "./avatar"

afterEach(() => {
  cleanup()
})

function slots(container: HTMLElement, slot: string) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(`[data-slot=${slot}]`)
  )
}

describe("Avatar", () => {
  it("defaults to a default-sized circle", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    )
    const [avatar] = slots(container, "avatar")

    expect(avatar.getAttribute("data-size")).toBe("default")
    expect(avatar.getAttribute("data-shape")).toBe("circle")
    expect(avatar.className).toContain("size-8")
    expect(avatar.className).not.toContain("ring-2")
  })

  it("uses a radius token for square shapes", () => {
    const { container } = render(<Avatar shape="square" size="xl" />)

    expect(slots(container, "avatar")[0].className).toContain(
      "[--avatar-radius:var(--radius-xl)]"
    )
  })

  it("renders a user icon when the fallback is empty", () => {
    const { container } = render(
      <>
        <Avatar>
          <AvatarFallback />
        </Avatar>
        <Avatar>
          <AvatarFallback>{"   "}</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>{getInitials("")}</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>{0}</AvatarFallback>
        </Avatar>
      </>
    )
    const fallbacks = slots(container, "avatar-fallback")

    expect(fallbacks.slice(0, 3).every((f) => f.querySelector("svg"))).toBe(
      true
    )
    expect(fallbacks[3].textContent).toBe("0")
  })

  it("waits for the delay before showing the fallback", () => {
    vi.useFakeTimers()
    const { container } = render(
      <Avatar>
        <AvatarFallback delay={600}>AL</AvatarFallback>
      </Avatar>
    )
    const fallback = slots(container, "avatar-fallback")[0]

    expect(fallback.getAttribute("data-ready")).toBe("false")
    act(() => {
      vi.advanceTimersByTime(599)
    })
    expect(fallback.getAttribute("data-ready")).toBe("false")
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(fallback.getAttribute("data-ready")).toBe("true")
    vi.useRealTimers()
  })

  it("stays mounted so it can crossfade with the image", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    )
    const fallback = slots(container, "avatar-fallback")[0]

    expect(fallback.getAttribute("data-ready")).toBe("true")
    expect(fallback.className).toContain("transition-[opacity,visibility]")
  })

  it("renders as another element", () => {
    render(<Avatar render={<a href="/profile" aria-label="Profile" />} />)

    expect(
      screen.getByRole("link", { name: "Profile" }).getAttribute("data-slot")
    ).toBe("avatar")
  })

  it("server renders without a pulse", () => {
    const html = renderToString(
      <Avatar>
        <AvatarFallback>AL</AvatarFallback>
        <AvatarBadge status="online" />
      </Avatar>
    )

    expect(html).toContain('data-slot="avatar"')
    expect(html).not.toContain("avatar-badge-pulse")
  })
})

describe("AvatarBadge", () => {
  it.each([
    ["online", "Online"],
    ["away", "Away"],
    ["busy", "Busy"],
    ["offline", "Offline"],
  ] as const)("labels %s", (status, label) => {
    render(<AvatarBadge status={status} />)

    expect(screen.getByRole("img", { name: label })).toBeTruthy()
  })

  it("lets the label be overridden", () => {
    render(<AvatarBadge status="busy" aria-label="In a meeting" />)

    expect(screen.getByRole("img", { name: "In a meeting" })).toBeTruthy()
  })

  it("has no role without a status", () => {
    const { container } = render(<AvatarBadge />)

    expect(slots(container, "avatar-badge")[0].hasAttribute("role")).toBe(false)
  })

  it("pulses only when the status changes", () => {
    const { container, rerender } = render(<AvatarBadge status="away" />)

    expect(slots(container, "avatar-badge-pulse")).toHaveLength(0)

    rerender(<AvatarBadge status="online" />)
    const first = slots(container, "avatar-badge-pulse")[0]
    expect(first).toBeTruthy()

    rerender(<AvatarBadge status="busy" />)
    const second = slots(container, "avatar-badge-pulse")[0]
    expect(second).toBeTruthy()
    expect(second).not.toBe(first)

    rerender(<AvatarBadge status="offline" />)
    expect(slots(container, "avatar-badge-pulse")).toHaveLength(0)
  })
})

describe("AvatarGroup", () => {
  function people(count: number) {
    return Array.from({ length: count }, (_, index) => (
      <Avatar key={index}>
        <AvatarFallback>{String(index)}</AvatarFallback>
      </Avatar>
    ))
  }

  it("passes size and shape to its avatars", () => {
    const { container } = render(
      <AvatarGroup size="lg" shape="square">
        {people(2)}
        <Avatar size="sm" />
      </AvatarGroup>
    )
    const avatars = slots(container, "avatar")

    expect(avatars[0].getAttribute("data-size")).toBe("lg")
    expect(avatars[0].getAttribute("data-shape")).toBe("square")
    expect(avatars[0].className).toContain("ring-2")
    expect(avatars[2].getAttribute("data-size")).toBe("sm")
    expect(screen.getByRole("group")).toBeTruthy()
  })

  it.each([
    [5, 3, 2, "3 more"],
    [3, 3, 3, null],
    [4, 3, 2, "2 more"],
    [1000, 4, 3, "997 more"],
    [5, 1, 1, "4 more"],
    [5, 0, 5, null],
    [5, -3, 5, null],
    [5, Number.NaN, 5, null],
    [5, Infinity, 5, null],
    [0, 3, 0, null],
  ])(
    "shows %s avatars with max %s as %s plus %s",
    (count, max, shown, label) => {
      const { container } = render(
        <AvatarGroup max={max}>{people(count)}</AvatarGroup>
      )

      expect(slots(container, "avatar")).toHaveLength(shown)
      const counts = slots(container, "avatar-group-count")
      expect(counts).toHaveLength(label ? 1 : 0)
      if (label) {
        expect(counts[0].textContent).toContain(label)
      }
    }
  )

  it("sizes text from a child so container units resolve against the avatar", () => {
    const { container } = render(<AvatarGroup max={2}>{people(3)}</AvatarGroup>)
    const [count] = slots(container, "avatar-group-count")
    const [avatar] = slots(container, "avatar")

    expect(count.className).not.toContain("cqmin")
    expect(avatar.className).not.toContain("cqmin")
    expect(count.firstElementChild!.className).toContain("cqmin")
    expect(screen.getByText("+2").getAttribute("dir")).toBe("ltr")
  })

  it("caps the visible count at 99+", () => {
    render(<AvatarGroupCount count={1234} />)

    expect(screen.getByText("99+").getAttribute("aria-hidden")).toBe("true")
    expect(screen.getByText("1234 more")).toBeTruthy()
  })

  it("ignores null and false children", () => {
    const { container } = render(
      <AvatarGroup max={3}>
        {people(2)}
        {null}
        {false}
      </AvatarGroup>
    )

    expect(slots(container, "avatar")).toHaveLength(2)
    expect(slots(container, "avatar-group-count")).toHaveLength(0)
  })
})

describe("getInitials", () => {
  it.each([
    ["Ada Lovelace", "AL"],
    ["  ada   lovelace  ", "AL"],
    ["Madonna", "M"],
    ["jean-luc picard", "JP"],
    ["Mary Ann Evans Cross", "MC"],
    ["ada.lovelace+news@example.com", "AL"],
    ["x@y.z", "X"],
    ["(Admin) John", "AJ"],
    ["👩‍👩‍👧‍👦 Family", "👩‍👩‍👧‍👦F"],
    ["山田 太郎", "山太"],
    ["محمد علي", "مع"],
    ["Z̷̢̛͖͓̰̈́algo T̵ext", "ZT"],
    ["élodie Ōkubo", "ÉŌ"],
    ["", ""],
    ["     ", ""],
    ["!!! ???", ""],
    [null, ""],
    [undefined, ""],
  ])("%s → %s", (name, expected) => {
    expect(getInitials(name)).toBe(expected)
  })

  it("respects max", () => {
    expect(getInitials("Ada King Lovelace", 1)).toBe("A")
    expect(getInitials("Ada King Lovelace", 3)).toBe("AKL")
    expect(getInitials("Ada King Lovelace", Number.NaN)).toBe("AL")
    expect(getInitials("Ada King Lovelace", -4)).toBe("A")
  })

  it("handles a huge name quickly", () => {
    const name = "a".repeat(10000) + " " + "b ".repeat(10000)
    const start = performance.now()

    expect(getInitials(name)).toBe("AB")
    expect(performance.now() - start).toBeLessThan(200)
  })
})
