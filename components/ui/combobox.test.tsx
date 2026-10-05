import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "./combobox"

afterEach(() => {
  cleanup()
  document.body.innerHTML = ""
})

const fruits = ["Apple", "Banana", "Cherry", "Grape"]

function slot(name: string) {
  return document.querySelector<HTMLElement>(`[data-slot="${name}"]`)
}

function Basic(
  props: Partial<React.ComponentProps<typeof Combobox<string>>> & {
    showClear?: boolean
  }
) {
  const { showClear, ...rest } = props
  return (
    <Combobox items={fruits} {...rest}>
      <ComboboxInput aria-label="Fruit" showClear={showClear} />
      <ComboboxContent>
        <ComboboxEmpty>No fruit found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

async function openCombobox() {
  const input = screen.getByRole("combobox", { name: "Fruit" })
  input.focus()
  fireEvent.keyDown(input, { key: "ArrowDown" })
  await flush()
}

async function flush() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

describe("Combobox", () => {
  it("renders the field with data slots and an accessible combobox input", () => {
    render(<Basic />)

    expect(slot("combobox-input-group")).not.toBeNull()
    const input = screen.getByRole("combobox", { name: "Fruit" })
    expect(input.getAttribute("data-slot")).toBe("combobox-input")
    expect(slot("combobox-trigger")?.getAttribute("aria-label")).toBe(
      "Show options"
    )
    expect(slot("combobox-clear")).toBeNull()
  })

  it("opens with ArrowDown, lists items and filters as you type", async () => {
    render(<Basic />)
    const input = screen.getByRole("combobox", { name: "Fruit" })

    await openCombobox()
    expect(slot("combobox-content")).not.toBeNull()
    expect(screen.getAllByRole("option")).toHaveLength(4)

    fireEvent.change(input, { target: { value: "a" } })
    await flush()
    expect(screen.getAllByRole("option")).toHaveLength(3)

    fireEvent.change(input, { target: { value: "an" } })
    await flush()
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual([
      "Banana",
    ])

    fireEvent.change(input, { target: { value: "zzz" } })
    await flush()
    expect(screen.queryAllByRole("option")).toHaveLength(0)
    expect(slot("combobox-empty")?.textContent).toBe("No fruit found.")
  })

  it("selects with the keyboard and marks the selected item", async () => {
    const onValueChange = vi.fn()
    render(<Basic onValueChange={onValueChange} />)
    const input = screen.getByRole("combobox", { name: "Fruit" })

    input.focus()
    fireEvent.keyDown(input, { key: "ArrowDown" })
    await flush()
    expect(
      screen
        .getByRole("option", { name: "Apple" })
        .hasAttribute("data-highlighted")
    ).toBe(true)
    fireEvent.keyDown(input, { key: "ArrowDown" })
    await flush()
    fireEvent.keyDown(input, { key: "Enter" })
    await flush()

    expect(onValueChange).toHaveBeenCalled()
    expect(onValueChange.mock.calls.at(-1)?.[0]).toBe("Banana")
    expect((input as HTMLInputElement).value).toBe("Banana")
  })

  it("keeps the check indicator mounted and hidden from assistive tech", async () => {
    render(<Basic defaultValue="Cherry" />)
    await openCombobox()

    const indicators = document.querySelectorAll(
      "[data-slot=combobox-item-indicator]"
    )
    expect(indicators).toHaveLength(4)
    const selected = [...indicators].filter((i) =>
      i.hasAttribute("data-selected")
    )
    expect(selected).toHaveLength(1)
    expect(selected[0].closest("[role=option]")?.textContent).toBe("Cherry")
    indicators.forEach((indicator) =>
      expect(indicator.getAttribute("aria-hidden")).toBe("true")
    )
    expect(indicators[0].className).toContain("data-[selected]:opacity-100")
  })

  it("shows the clear button only while there is a value and clears it", async () => {
    const onValueChange = vi.fn()
    render(
      <Basic showClear defaultValue="Grape" onValueChange={onValueChange} />
    )

    const clear = slot("combobox-clear")!
    expect(clear.getAttribute("aria-label")).toBe("Clear selection")
    fireEvent.click(clear)
    await flush()

    expect(onValueChange.mock.calls.at(-1)?.[0]).toBeNull()
    expect(
      (screen.getByRole("combobox", { name: "Fruit" }) as HTMLInputElement)
        .value
    ).toBe("")
  })

  it("supports a controlled value", async () => {
    function Controlled() {
      const [value, setValue] = React.useState<string | null>("Apple")
      return (
        <>
          <Basic value={value} onValueChange={setValue} />
          <button onClick={() => setValue("Banana")}>set</button>
        </>
      )
    }
    render(<Controlled />)
    const input = screen.getByRole("combobox", {
      name: "Fruit",
    }) as HTMLInputElement
    expect(input.value).toBe("Apple")

    fireEvent.click(screen.getByText("set"))
    await flush()
    expect(input.value).toBe("Banana")
  })

  it("disables the input and the trigger", () => {
    render(<Basic disabled />)
    const input = screen.getByRole("combobox", {
      name: "Fruit",
    }) as HTMLInputElement
    expect(input.disabled).toBe(true)
    expect(slot("combobox-input-group")?.hasAttribute("data-disabled")).toBe(
      true
    )
  })

  it("moves the input into the popup with a search icon and a select-like trigger", async () => {
    render(
      <Combobox items={fruits}>
        <ComboboxTrigger aria-label="Fruit">
          <ComboboxValue placeholder="Pick a fruit" />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput aria-label="Search" />
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    )

    const trigger = slot("combobox-trigger")!
    expect(trigger.textContent).toContain("Pick a fruit")
    expect(trigger.className).toContain("h-9")
    fireEvent.click(trigger)
    await flush()

    const group = slot("combobox-content")!.querySelector(
      "[data-slot=combobox-input-group]"
    )!
    expect(group.querySelector("svg")).not.toBeNull()
    expect(group.querySelector("[data-slot=combobox-trigger]")).toBeNull()
  })

  it("does not apply field styles when the trigger is rendered as another element", () => {
    render(
      <Combobox items={fruits}>
        <ComboboxTrigger render={<button className="rounded-full" />}>
          <ComboboxValue placeholder="Pick" />
        </ComboboxTrigger>
      </Combobox>
    )
    const trigger = slot("combobox-trigger")!
    expect(trigger.className).toContain("rounded-full")
    expect(trigger.className).not.toContain("h-9")
  })

  it("renders chips and removes the last one with Backspace", async () => {
    const onValueChange = vi.fn()
    render(
      <Combobox
        items={fruits}
        multiple
        defaultValue={["Apple", "Cherry"]}
        onValueChange={onValueChange}
      >
        <ComboboxChips>
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((value) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput aria-label="Fruits" />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
      </Combobox>
    )

    expect(document.querySelectorAll("[data-slot=combobox-chip]")).toHaveLength(
      2
    )
    expect(
      document
        .querySelectorAll("[data-slot=combobox-chip-remove]")[0]
        .getAttribute("aria-label")
    ).toBe("Remove")

    const input = screen.getByRole("combobox", { name: "Fruits" })
    input.focus()
    fireEvent.keyDown(input, { key: "Backspace" })
    await flush()
    expect(onValueChange.mock.calls.at(-1)?.[0]).toEqual(["Apple"])
  })

  it("hides the remove button with showRemove={false}", () => {
    render(
      <Combobox items={fruits} multiple defaultValue={["Apple"]}>
        <ComboboxChips>
          <ComboboxChip showRemove={false}>Apple</ComboboxChip>
          <ComboboxChipsInput aria-label="Fruits" />
        </ComboboxChips>
      </Combobox>
    )
    expect(slot("combobox-chip-remove")).toBeNull()
  })

  it("carries RTL direction into the portalled popup", async () => {
    render(
      <DirectionProvider direction="rtl">
        <div dir="rtl">
          <Basic />
        </div>
      </DirectionProvider>
    )
    await openCombobox()
    expect(slot("combobox-content")?.getAttribute("dir")).toBe("rtl")
  })

  it("reads direction from the DOM when no provider is present", async () => {
    render(
      <div dir="rtl">
        <Basic />
      </div>
    )
    await openCombobox()
    expect(slot("combobox-content")?.getAttribute("dir")).toBe("rtl")
  })

  it("respects an explicit dir on the content", async () => {
    render(
      <Combobox items={fruits}>
        <ComboboxInput aria-label="Fruit" />
        <ComboboxContent dir="ltr">
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    )
    await openCombobox()
    expect(slot("combobox-content")?.getAttribute("dir")).toBe("ltr")
  })

  it("passes a function className through with the part state", async () => {
    render(
      <Combobox items={fruits} defaultValue="Apple">
        <ComboboxInput aria-label="Fruit" />
        <ComboboxContent>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem
                key={item}
                value={item}
                className={(state) => (state.selected ? "is-selected" : "")}
              >
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    )
    await openCombobox()
    const apple = screen.getByRole("option", { name: "Apple" })
    expect(apple.className).toContain("is-selected")
    expect(apple.className).toContain("rounded-(--combobox-item-radius)")
  })

  it("renders on the server without touching the DOM", () => {
    const html = renderToString(<Basic defaultValue="Apple" showClear />)
    expect(html).toContain('data-slot="combobox-input-group"')
    expect(html).toContain('value="Apple"')
  })
})
