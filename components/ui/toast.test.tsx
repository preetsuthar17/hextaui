import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Toaster, toast } from "./toast"

async function flush(ms = 20) {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms))
  })
}

afterEach(async () => {
  act(() => {
    toast.dismiss()
  })
  await flush(50)
  cleanup()
})

function toasts() {
  return Array.from(document.querySelectorAll("[data-slot=toast]"))
}

describe("toast", () => {
  it("shows typed toasts with title and description", async () => {
    render(<Toaster />)
    act(() => {
      toast.success("Saved", { description: "All changes stored." })
    })
    await flush()
    expect(screen.getByText("Saved")).toBeTruthy()
    expect(screen.getByText("All changes stored.")).toBeTruthy()
    expect(toasts()[0]?.getAttribute("data-type")).toBe("success")
    expect(toasts()[0]?.querySelector("[data-slot=toast-icon]")).toBeTruthy()
  })

  it("updates instead of duplicating when an id repeats", async () => {
    render(<Toaster />)
    act(() => {
      toast.info("Offline", { id: "net" })
      toast.info("Offline", { id: "net" })
    })
    await flush()
    expect(toasts()).toHaveLength(1)
  })

  it("runs the action and dismisses", async () => {
    const onClick = vi.fn()
    render(<Toaster />)
    act(() => {
      toast("Archived", { action: { label: "Undo", onClick } })
    })
    await flush()
    fireEvent.click(screen.getByRole("button", { name: "Undo" }))
    expect(onClick).toHaveBeenCalledTimes(1)
    await flush(50)
    expect(screen.queryByText("Archived")).toBeNull()
  })

  it("turns a promise into success or error without unhandled rejections", async () => {
    const unhandled = vi.fn()
    process.on("unhandledRejection", unhandled)
    render(<Toaster />)
    let fail: (error: Error) => void = () => {}
    act(() => {
      toast.promise(
        new Promise((_, reject) => {
          fail = reject
        }),
        {
          loading: "Deploying…",
          success: "Deployed",
          error: (error) => ({
            title: "Deploy failed",
            description: error instanceof Error ? error.message : "",
          }),
        }
      )
    })
    await flush()
    expect(screen.getByText("Deploying…")).toBeTruthy()
    expect(toasts()[0]?.getAttribute("data-type")).toBe("loading")

    await act(async () => {
      fail(new Error("Build failed"))
      await new Promise((resolve) => setTimeout(resolve, 20))
    })
    expect(screen.getByText("Deploy failed")).toBeTruthy()
    expect(screen.getByText("Build failed")).toBeTruthy()
    expect(toasts()[0]?.getAttribute("data-type")).toBe("error")
    await flush(50)
    process.off("unhandledRejection", unhandled)
    expect(unhandled).not.toHaveBeenCalled()
  })

  it("keeps long messages up long enough to read", async () => {
    render(<Toaster timeout={300} />)
    act(() => {
      toast("Short")
      toast("Long", {
        description:
          "This message has enough words in it that nobody could finish reading it before the default timeout runs out, so it should stay up longer than the short one.",
      })
    })
    await flush(800)
    expect(screen.queryByText("Short")).toBeNull()
    expect(screen.getByText("Long")).toBeTruthy()
  })

  it("dismisses by id", async () => {
    render(<Toaster />)
    let id = ""
    act(() => {
      id = toast("Temporary")
    })
    await flush()
    act(() => {
      toast.dismiss(id)
    })
    await flush(50)
    expect(screen.queryByText("Temporary")).toBeNull()
  })
})
