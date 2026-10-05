import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"

import { Checkbox } from "./checkbox"
import {
  Field,
  FieldContent,
  FieldCounter,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldStatus,
  FieldTitle,
} from "./field"
import { Input } from "./input"

afterEach(() => {
  cleanup()
})

function describedBy(element: HTMLElement) {
  return (element.getAttribute("aria-describedby") ?? "")
    .split(" ")
    .filter(Boolean)
    .map((id) => document.getElementById(id)?.textContent)
}

describe("Field", () => {
  it("labels and describes the control", () => {
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input />
        <FieldDescription>We never share it.</FieldDescription>
      </Field>
    )
    const input = screen.getByRole("textbox", { name: "Email" })
    expect(describedBy(input)).toContain("We never share it.")
  })

  it("sets slots and orientation", () => {
    const { container } = render(
      <Field orientation="horizontal">
        <FieldLabel>Name</FieldLabel>
        <Input />
      </Field>
    )
    const field = container.querySelector("[data-slot=field]")!
    expect(field.getAttribute("data-orientation")).toBe("horizontal")
    expect(container.querySelector("[data-slot=field-label]")).not.toBeNull()
  })

  it("defaults a null orientation to vertical", () => {
    const { container } = render(
      <Field orientation={null}>
        <Input aria-label="x" />
      </Field>
    )
    expect(
      container
        .querySelector("[data-slot=field]")!
        .getAttribute("data-orientation")
    ).toBe("vertical")
  })

  it("waits for a change before flagging a missing value, then links the message", async () => {
    render(
      <Field validationMode="onBlur">
        <FieldLabel>Email</FieldLabel>
        <Input required />
        <FieldError />
      </Field>
    )
    const input = screen.getByRole("textbox", { name: "Email" })
    await act(async () => {
      fireEvent.focusIn(input)
      fireEvent.focusOut(input)
    })
    expect(document.querySelector("[data-slot=field-error]")).toBeNull()
    await act(async () => {
      fireEvent.focusIn(input)
      fireEvent.change(input, { target: { value: "a" } })
      fireEvent.change(input, { target: { value: "" } })
      fireEvent.focusOut(input)
    })
    const error = document.querySelector("[data-slot=field-error]")
    expect(error).not.toBeNull()
    expect(input.getAttribute("aria-invalid")).toBe("true")
    expect(describedBy(input).join(" ")).toContain(error!.textContent ?? "")
  })

  it("runs custom validate and shows its message", async () => {
    render(
      <Field
        validationMode="onChange"
        validate={(value) =>
          String(value).length < 3 ? "At least 3 characters" : null
        }
      >
        <FieldLabel>Username</FieldLabel>
        <Input />
        <FieldError />
      </Field>
    )
    const input = screen.getByRole("textbox", { name: "Username" })
    await act(async () => {
      fireEvent.change(input, { target: { value: "ab" } })
    })
    expect(
      document.querySelector("[data-slot=field-error]")?.textContent
    ).toContain("At least 3 characters")
  })

  it("renders external errors, deduped, as a list when several", () => {
    const { rerender } = render(
      <Field invalid>
        <FieldLabel>Password</FieldLabel>
        <Input />
        <FieldError
          errors={[
            { message: "Too short" },
            { message: "Too short" },
            undefined,
            { message: "Needs a number" },
          ]}
        />
      </Field>
    )
    const error = document.querySelector("[data-slot=field-error]")!
    expect(error.querySelectorAll("li")).toHaveLength(2)

    rerender(
      <Field invalid>
        <FieldLabel>Password</FieldLabel>
        <Input />
        <FieldError errors={[{ message: "Too short" }]} />
      </Field>
    )
    expect(
      document.querySelector("[data-slot=field-error]")!.querySelector("li")
    ).toBeNull()
    expect(document.querySelector("[data-slot=field-error]")!.textContent).toBe(
      "Too short"
    )
  })

  it("hides external errors when the list is empty", () => {
    render(
      <Field>
        <FieldLabel>Password</FieldLabel>
        <Input />
        <FieldError errors={[]} />
      </Field>
    )
    expect(document.querySelector("[data-slot=field-error]")).toBeNull()
  })

  it("shows children with match={true}", () => {
    render(
      <Field>
        <FieldLabel>Code</FieldLabel>
        <Input />
        <FieldError match>Server says no</FieldError>
      </Field>
    )
    expect(document.querySelector("[data-slot=field-error]")?.textContent).toBe(
      "Server says no"
    )
  })

  it("matches a specific validity key", async () => {
    render(
      <Field validationMode="onBlur">
        <FieldLabel>Email</FieldLabel>
        <Input type="email" required />
        <FieldError match="valueMissing">Enter an email</FieldError>
        <FieldError match="typeMismatch">That isn’t an email</FieldError>
      </Field>
    )
    const input = screen.getByRole("textbox", { name: "Email" })
    await act(async () => {
      fireEvent.focusIn(input)
      fireEvent.change(input, { target: { value: "not an email" } })
      fireEvent.focusOut(input)
    })
    const texts = [...document.querySelectorAll("[data-slot=field-error]")].map(
      (node) => node.textContent
    )
    expect(texts).toEqual(["That isn’t an email"])
  })

  it("disables every field inside a disabled FieldSet", () => {
    const { container } = render(
      <FieldSet disabled>
        <FieldLegend>Address</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Street</FieldLabel>
            <Input />
          </Field>
        </FieldGroup>
      </FieldSet>
    )
    const input = screen.getByRole("textbox", { name: "Street" })
    expect((input as HTMLInputElement).disabled).toBe(true)
    expect(
      container
        .querySelector("[data-slot=field]")!
        .hasAttribute("data-disabled")
    ).toBe(true)
  })

  it("renders a description and label outside a field without throwing", () => {
    render(
      <FieldSet>
        <FieldLegend>Plan</FieldLegend>
        <FieldDescription>Pick one.</FieldDescription>
        <FieldLabel>Loose label</FieldLabel>
      </FieldSet>
    )
    expect(screen.getByText("Pick one.").getAttribute("data-slot")).toBe(
      "field-description"
    )
    expect(screen.getByText("Loose label").tagName).toBe("LABEL")
  })

  it("names the fieldset by its legend", () => {
    render(
      <FieldSet>
        <FieldLegend>Shipping</FieldLegend>
        <Field>
          <FieldLabel>City</FieldLabel>
          <Input />
        </Field>
      </FieldSet>
    )
    expect(screen.getByRole("group", { name: "Shipping" })).not.toBeNull()
  })

  it("labels a checkbox in a horizontal field and toggles it from the label", () => {
    render(
      <Field orientation="horizontal">
        <Checkbox />
        <FieldContent>
          <FieldLabel>Accept terms</FieldLabel>
          <FieldDescription>You can change this later.</FieldDescription>
        </FieldContent>
      </Field>
    )
    const box = screen.getByRole("checkbox", { name: "Accept terms" })
    fireEvent.click(screen.getByText("Accept terms"))
    expect(box.getAttribute("aria-checked")).toBe("true")
  })

  it("renders a choice card label around a field", () => {
    render(
      <FieldLabel>
        <Field orientation="horizontal">
          <Checkbox />
          <FieldContent>
            <FieldTitle>Pro plan</FieldTitle>
            <FieldDescription>For teams.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    )
    const box = screen.getByRole("checkbox")
    fireEvent.click(screen.getByText("Pro plan"))
    expect(box.getAttribute("aria-checked")).toBe("true")
  })

  it("renders a separator with and without content", () => {
    const { container } = render(
      <>
        <FieldSeparator />
        <FieldSeparator>Or continue with</FieldSeparator>
      </>
    )
    const [plain, labelled] = container.querySelectorAll(
      "[data-slot=field-separator]"
    )
    expect(plain.getAttribute("role")).toBe("separator")
    expect(labelled.hasAttribute("data-content")).toBe(true)
    expect(labelled.textContent).toBe("Or continue with")
  })

  it("builds its separator on Separator", () => {
    const { container } = render(
      <>
        <FieldSeparator />
        <FieldSeparator>Or continue with</FieldSeparator>
        <FieldSeparator> </FieldSeparator>
      </>
    )
    const [plain, labelled, blank] = container.querySelectorAll<HTMLElement>(
      "[data-slot=field-separator]"
    )

    expect(plain.className).toContain("h-(--hairline)")
    expect(plain.getAttribute("aria-orientation")).toBe("horizontal")
    expect(labelled.hasAttribute("role")).toBe(false)
    expect(labelled.className).toContain("text-sm")
    expect(labelled.className).not.toContain("text-xs")
    expect(
      labelled.querySelector("[data-slot=separator-label]")?.textContent
    ).toBe("Or continue with")
    expect(blank.getAttribute("role")).toBe("separator")
    expect(blank.className).not.toContain("min-h-5")
  })

  it("server renders without errors", () => {
    const html = renderToString(
      <FieldSet>
        <FieldLegend>Profile</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input />
            <FieldDescription>Shown on your profile.</FieldDescription>
            <FieldError errors={[{ message: "Required" }]} />
          </Field>
        </FieldGroup>
      </FieldSet>
    )
    expect(html).toContain('data-slot="field"')
    expect(html).toContain("Required")
  })
})

describe("indicator", () => {
  it("marks labels from the control's required attribute", () => {
    render(
      <FieldGroup indicator="optional">
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input required />
        </Field>
        <Field>
          <FieldLabel optionalText="Not needed">Company</FieldLabel>
          <Input />
        </Field>
      </FieldGroup>
    )

    const marks = document.querySelectorAll("[data-slot=field-indicator]")
    expect(marks).toHaveLength(2)
    expect(marks[1].textContent).toBe("Not needed")
    expect(marks[0].getAttribute("aria-hidden")).toBe("true")
    expect(screen.getByRole("textbox", { name: "Company" })).toBeTruthy()
    expect(screen.getByRole("textbox", { name: "Email" })).toBeTruthy()
  })

  it("lets a field override the group and stays off by default", () => {
    render(
      <>
        <FieldGroup indicator="required">
          <Field indicator={null}>
            <FieldLabel>Plain</FieldLabel>
            <Input />
          </Field>
        </FieldGroup>
        <Field>
          <FieldLabel>Default</FieldLabel>
          <Input />
        </Field>
      </>
    )

    expect(document.querySelector("[data-slot=field-indicator]")).toBeNull()
  })
})

describe("FieldStatus", () => {
  it("is decorative and holds both icons", () => {
    render(
      <Field>
        <FieldLabel>Code</FieldLabel>
        <Input />
        <FieldStatus />
      </Field>
    )

    const status = document.querySelector("[data-slot=field-status]")!
    expect(status.getAttribute("aria-hidden")).toBe("true")
    expect(status.querySelectorAll("svg")).toHaveLength(2)
  })
})

describe("FieldCounter", () => {
  it("counts the field's control against maxLength", () => {
    render(
      <Field>
        <FieldLabel>Status</FieldLabel>
        <Input maxLength={5} defaultValue="ab" />
        <FieldCounter />
      </Field>
    )

    const counter = document.querySelector<HTMLElement>(
      "[data-slot=field-counter]"
    )!
    expect(counter.textContent).toContain("/5")
    fireEvent.input(screen.getByRole("textbox"), {
      target: { value: "abcde" },
    })
    expect(counter.getAttribute("data-state")).toBe("limit")
  })
})
