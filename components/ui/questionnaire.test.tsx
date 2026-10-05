import * as React from "react"
import { act, cleanup, fireEvent, render } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
  type QuestionnaireProps,
} from "./questionnaire"

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

function Form(props: Partial<QuestionnaireProps>) {
  return (
    <Questionnaire onSubmit={(event) => event.preventDefault()} {...props}>
      <QuestionnaireProgress />
      <QuestionnaireItem name="one" required>
        <QuestionnaireTitle>One?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="a">A</QuestionnaireChoice>
          <QuestionnaireChoice value="b">B</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem name="two" multiple>
        <QuestionnaireTitle>Two?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="c">C</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem name="three">
        <QuestionnaireTitle>Three?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="d">D</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}

function active(container: HTMLElement) {
  return container.querySelector("fieldset[data-active] legend")?.textContent
}

function segments(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll("[data-slot=questionnaire-progress-segment]"),
    (segment) =>
      `${segment.getAttribute("data-status")}${segment.hasAttribute("data-active") ? "*" : ""}`
  )
}

function next(container: HTMLElement) {
  return container.querySelector<HTMLElement>("[data-slot=questionnaire-next]")!
}

async function flush() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
}

describe("Questionnaire", () => {
  it("renders fieldsets, a transition and segmented progress", async () => {
    const { container } = render(<Form transition="lift" />)
    await flush()
    expect(
      container
        .querySelector("[data-slot=questionnaire]")
        ?.getAttribute("data-transition")
    ).toBe("lift")
    expect(container.querySelectorAll("fieldset")).toHaveLength(3)
    expect(active(container)).toBe("One?")
    expect(segments(container)).toEqual([
      "unanswered*",
      "unanswered",
      "unanswered",
    ])
    expect(
      container.querySelector("[role=progressbar]")?.textContent
    ).toContain("Question 1 of 3")
  })

  it("shakes and stays when a required answer is missing", async () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }))
    const { container } = render(<Form />)
    fireEvent.click(next(container))
    await flush()
    const item = container.querySelector("fieldset[data-active]")!
    expect(item.hasAttribute("data-invalid")).toBe(true)
    expect(item.hasAttribute("data-shake")).toBe(true)
    expect(active(container)).toBe("One?")
  })

  it("moves on and fills the progress", async () => {
    const { container } = render(<Form />)
    fireEvent.click(container.querySelector("input[value=a]")!)
    fireEvent.click(next(container))
    await flush()
    expect(active(container)).toBe("Two?")
    expect(segments(container)).toEqual([
      "answered",
      "unanswered*",
      "unanswered",
    ])
  })

  it("auto-advances only after a first single answer", async () => {
    vi.useFakeTimers()
    const { container } = render(<Form autoAdvance />)
    fireEvent.click(container.querySelector("input[value=a]")!)
    expect(active(container)).toBe("One?")
    await act(async () => {
      vi.advanceTimersByTime(400)
    })
    expect(active(container)).toBe("Two?")

    fireEvent.click(
      container.querySelector("[data-slot=questionnaire-previous]")!
    )
    await act(async () => {
      vi.advanceTimersByTime(50)
    })
    expect(active(container)).toBe("One?")
    fireEvent.click(container.querySelector("input[value=b]")!)
    await act(async () => {
      vi.advanceTimersByTime(400)
    })
    expect(active(container)).toBe("One?")
  })

  it("never auto-advances multiple choice", async () => {
    vi.useFakeTimers()
    const { container } = render(<Form autoAdvance />)
    fireEvent.click(container.querySelector("input[value=a]")!)
    await act(async () => {
      vi.advanceTimersByTime(400)
    })
    fireEvent.click(container.querySelector("input[value=c]")!)
    await act(async () => {
      vi.advanceTimersByTime(400)
    })
    expect(active(container)).toBe("Two?")
  })

  it("presses the shortcut key cap while the key is down", () => {
    const { container } = render(<Form shortcuts="letters" />)
    const form = container.querySelector("form")!
    fireEvent.keyDown(form, { key: "b" })
    expect(
      container
        .querySelector('kbd[data-shortcut="B"]')
        ?.hasAttribute("data-pressed")
    ).toBe(true)
    fireEvent.keyUp(form, { key: "b" })
    expect(container.querySelector("kbd[data-pressed]")).toBeNull()
  })

  it("moves focus with arrows without picking", () => {
    const { container } = render(<Form />)
    const item = container.querySelector<HTMLElement>("fieldset[data-active]")!
    item.focus()
    fireEvent.keyDown(item, { key: "ArrowDown" })
    const first = container.querySelector<HTMLInputElement>("input[value=a]")!
    expect(document.activeElement).toBe(first)
    fireEvent.keyDown(first, { key: "ArrowDown" })
    const second = container.querySelector<HTMLInputElement>("input[value=b]")!
    expect(document.activeElement).toBe(second)
    expect(first.checked || second.checked).toBe(false)
  })

  it("picks and continues with Enter, goes back with the left arrow", async () => {
    const { container } = render(<Form />)
    const first = container.querySelector<HTMLInputElement>("input[value=a]")!
    first.focus()
    fireEvent.keyDown(first, { key: "Enter" })
    await flush()
    expect(first.checked).toBe(true)
    expect(active(container)).toBe("Two?")

    const item = container.querySelector<HTMLElement>("fieldset[data-active]")!
    fireEvent.keyDown(item, { key: "ArrowLeft" })
    await flush()
    expect(active(container)).toBe("One?")
    expect(first.checked).toBe(true)
  })

  it("server renders progress from items", () => {
    const html = renderToString(
      <Form items={[{ name: "one" }, { name: "two" }, { name: "three" }]} />
    )
    expect(html).toContain('data-slot="questionnaire"')
    expect(html).toContain('data-slot="questionnaire-progress-segment"')
  })
})
