import { afterEach, describe, expect, it, vi } from "vitest"

import {
  formatHotkey,
  keyLabel,
  matchesHotkey,
  parseHotkey,
  spokenKey,
} from "./hotkey"

afterEach(() => {
  vi.unstubAllGlobals()
})

function setPlatform(platform: string) {
  vi.stubGlobal("navigator", { ...navigator, platform, userAgent: platform })
}

function press(init: KeyboardEventInit) {
  return new KeyboardEvent("keydown", init)
}

describe("parseHotkey", () => {
  it("splits sequences and orders modifiers", () => {
    expect(parseHotkey("shift+mod+k")).toEqual([["shift", "mod", "k"]])
    expect(parseHotkey("mod+shift+k")).toEqual([["shift", "mod", "k"]])
    expect(parseHotkey("g g")).toEqual([["g"], ["g"]])
  })

  it("normalizes aliases", () => {
    expect(parseHotkey("cmd+option+esc")).toEqual([["alt", "meta", "escape"]])
    expect(parseHotkey("ctrl+up")).toEqual([["ctrl", "arrowup"]])
  })

  it("keeps a literal plus key", () => {
    expect(parseHotkey("mod++")).toEqual([["mod", "+"]])
  })
})

describe("formatHotkey", () => {
  it("uses symbols on Apple platforms and words elsewhere", () => {
    expect(formatHotkey("mod+shift+k", true)).toBe("⇧⌘K")
    expect(formatHotkey("mod+shift+k", false)).toBe("Shift+Ctrl+K")
  })

  it("accepts aliases", () => {
    expect(formatHotkey("cmd+k", true)).toBe("⌘K")
    expect(formatHotkey("option+esc", false)).toBe("Alt+Esc")
  })
})

describe("labels", () => {
  it("names keys for sight and for screen readers", () => {
    expect(keyLabel("enter", true)).toBe("↵")
    expect(keyLabel("enter", false)).toBe("Enter")
    expect(spokenKey("mod", true)).toBe("Command")
    expect(spokenKey("mod", false)).toBe("Control")
  })
})

describe("matchesHotkey", () => {
  it("maps mod to Command on Apple platforms", () => {
    setPlatform("MacIntel")
    expect(matchesHotkey(press({ key: "k", metaKey: true }), "mod+k")).toBe(
      true
    )
    expect(matchesHotkey(press({ key: "k", ctrlKey: true }), "mod+k")).toBe(
      false
    )
  })

  it("maps mod to Control elsewhere", () => {
    setPlatform("Win32")
    expect(matchesHotkey(press({ key: "k", ctrlKey: true }), "mod+k")).toBe(
      true
    )
  })

  it("requires the exact modifiers", () => {
    setPlatform("Win32")
    expect(
      matchesHotkey(press({ key: "K", ctrlKey: true, shiftKey: true }), "mod+k")
    ).toBe(false)
    expect(
      matchesHotkey(
        press({ key: "K", ctrlKey: true, shiftKey: true }),
        "mod+shift+k"
      )
    ).toBe(true)
  })

  it("matches aliases and the space key", () => {
    expect(matchesHotkey(press({ key: "Escape" }), "esc")).toBe(true)
    expect(matchesHotkey(press({ key: " " }), "space")).toBe(true)
  })

  it("matches letters by position when Option changes the character", () => {
    setPlatform("MacIntel")
    expect(
      matchesHotkey(press({ key: "˚", code: "KeyK", altKey: true }), "alt+k")
    ).toBe(true)
  })
})
