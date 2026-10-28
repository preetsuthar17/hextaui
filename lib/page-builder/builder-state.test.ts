import { describe, expect, it } from "vitest"

import {
  decodeDoc,
  encodeDoc,
  placePro,
  placeSection,
  type PageDoc,
} from "@/lib/page-builder/doc"
import { builderReducer, initialState } from "@/lib/page-builder/history"
import { pageRegistryResponse } from "@/lib/page-builder/registry-response"
import { exportPage, registryItem } from "@/lib/page-builder/export"
import { cleanInline, inlineFields, setPath } from "@/lib/page-builder/inline"
import { getSection } from "@/lib/page-builder/registry"
import { starterDoc, starters } from "@/lib/page-builder/starters"
import {
  applyTheme,
  canvasVars,
  defaultThemeId,
  normalizeThemeId,
  parseThemeInput,
  presetThemes,
  themeFromId,
  themeName,
} from "@/lib/page-builder/theme"

const pro = [{ name: "chat-thread", title: "Chat Thread", category: "ai" }]

function doc(...ids: string[]): PageDoc {
  return { sections: ids.map((id) => placeSection(id)!) }
}

function ids(state: ReturnType<typeof initialState>) {
  return state.doc.sections.map((placed) =>
    placed.type === "section" ? placed.sectionId : placed.name
  )
}

describe("builder state", () => {
  it("inserts after the selection, moves, duplicates and removes", () => {
    let state = initialState(doc("navbar-simple", "footer-simple"))
    state = builderReducer(state, {
      type: "insert",
      section: placeSection("hero-centered")!,
    })
    expect(ids(state)).toEqual([
      "navbar-simple",
      "hero-centered",
      "footer-simple",
    ])
    const hero = state.selected!
    state = builderReducer(state, { type: "shift", key: hero, by: 1 })
    expect(ids(state)).toEqual([
      "navbar-simple",
      "footer-simple",
      "hero-centered",
    ])
    state = builderReducer(state, { type: "move", key: hero, to: 0 })
    expect(ids(state)[0]).toBe("hero-centered")
    state = builderReducer(state, { type: "duplicate", key: hero })
    expect(ids(state)).toEqual([
      "hero-centered",
      "hero-centered",
      "navbar-simple",
      "footer-simple",
    ])
    expect(state.selected).not.toBe(hero)
    state = builderReducer(state, { type: "remove", key: state.selected! })
    expect(ids(state)).toEqual([
      "hero-centered",
      "navbar-simple",
      "footer-simple",
    ])
    state = builderReducer(state, {
      type: "insert",
      section: placePro(pro[0]),
      after: null,
    })
    expect(ids(state).at(-1)).toBe("chat-thread")
  })

  it("coalesces typing into one undo step and redoes it", () => {
    let state = initialState(doc("hero-centered"))
    const key = state.selected!
    for (const [index, headline] of ["S", "Sh", "Shi", "Ship"].entries()) {
      state = builderReducer(state, {
        type: "update",
        key,
        coalesce: "headline",
        at: index * 100,
        patch: (props) => ({ ...props, headline }),
      })
    }
    state = builderReducer(state, {
      type: "update",
      key,
      coalesce: "subhead",
      at: 500,
      patch: (props) => ({ ...props, subhead: "x" }),
    })
    expect(state.past).toHaveLength(2)
    state = builderReducer(state, { type: "undo" })
    const after = state.doc.sections[0]
    expect(after.type === "section" && after.props.headline).toBe("Ship")
    state = builderReducer(state, { type: "undo" })
    const original = state.doc.sections[0]
    expect(original.type === "section" && original.props.headline).toBe(
      "The analytics workspace your whole team can read"
    )
    state = builderReducer(state, { type: "redo" })
    state = builderReducer(state, { type: "redo" })
    const redone = state.doc.sections[0]
    expect(redone.type === "section" && redone.props.subhead).toBe("x")
    expect(builderReducer(state, { type: "redo" })).toBe(state)
  })

  it("starts a new undo step after a pause", () => {
    let state = initialState(doc("hero-centered"))
    const key = state.selected!
    state = builderReducer(state, {
      type: "update",
      key,
      coalesce: "headline",
      at: 0,
      patch: (props) => ({ ...props, headline: "a" }),
    })
    state = builderReducer(state, {
      type: "update",
      key,
      coalesce: "headline",
      at: 5000,
      patch: (props) => ({ ...props, headline: "ab" }),
    })
    expect(state.past).toHaveLength(2)
  })
})

describe("canvas theme", () => {
  it("reads theme editor links and ids with the real decoder", () => {
    const ocean = presetThemes.find((item) => item.preset.slug === "ocean")!
    const id = ocean.id!
    expect(normalizeThemeId(id)).toBe(id)
    expect(parseThemeInput(`https://hextaui.com/tools/theme-editor#t=${id}`)).toBe(id)
    expect(parseThemeInput(`https://hextaui.com/r/themes/${id}.json`)).toBe(id)
    expect(parseThemeInput(id)).toBe(id)
    expect(parseThemeInput("nope!")).toBeNull()
    expect(parseThemeInput("")).toBeNull()
    expect(themeName(id)).toBe("Ocean")
    expect(themeName(null)).toBe("HextaUI")
    expect(themeName(defaultThemeId)).toBe("HextaUI")
    for (const { id: presetId } of presetThemes) {
      if (presetId) expect(normalizeThemeId(presetId)).toBe(presetId)
    }
  })

  it("sets both token and color variables for the canvas", () => {
    const vars = canvasVars(themeFromId(null), "dark")
    expect(vars["--primary"]).toBe(vars["--color-primary"])
    expect(vars["--radius"]).toBeDefined()
    expect(vars["--color-radius"]).toBeUndefined()
  })

  it("carries the theme through share links, history and exports", async () => {
    const ocean = presetThemes.find((item) => item.preset.slug === "ocean")!.id!
    let state = initialState(doc("hero-centered"))
    state = builderReducer(state, { type: "theme", theme: ocean })
    expect(state.doc.theme).toBe(ocean)
    state = builderReducer(state, { type: "duplicate", key: state.doc.sections[0].key })
    expect(state.doc.theme).toBe(ocean)
    const encoded = await encodeDoc(state.doc)
    const decoded = await decodeDoc(encoded, pro)
    expect(decoded?.theme).toBe(ocean)
    const result = exportPage(state.doc)
    const css = result.files.find((file) => file.path === "app/theme.css")
    expect(css?.content).toContain(":root {")
    expect(css?.content).toContain(".dark {")
    const item = registryItem(result, encoded)
    expect(item.cssVars?.light.primary).toBeDefined()
    expect(item.files.some((file) => file.path === "app/theme.css")).toBe(false)
    state = builderReducer(state, { type: "undo" })
    state = builderReducer(state, { type: "undo" })
    expect(state.doc.theme).toBeUndefined()
    expect(exportPage(state.doc).files.some((file) => file.kind === "theme")).toBe(false)
  })

  it("swaps a layout and keeps the shared copy", () => {
    let state = initialState(doc("hero-centered"))
    const key = state.doc.sections[0].key
    state = builderReducer(state, {
      type: "update",
      key,
      coalesce: "headline",
      at: 0,
      patch: (props) => ({ ...props, headline: "Mine" }),
    })
    state = builderReducer(state, { type: "swap", key, sectionId: "hero-split" })
    const placed = state.doc.sections[0]
    expect(placed.type === "section" && placed.sectionId).toBe("hero-split")
    expect(placed.type === "section" && placed.props.headline).toBe("Mine")
    expect(placed.key).toBe(key)
    expect(builderReducer(state, { type: "swap", key, sectionId: "footer-simple" })).toBe(state)
  })

  it("maps inline text fields and writes them back", () => {
    const section = getSection("pricing-tiers")!
    const props = section.defaults
    const fields = inlineFields(section, props)
    expect(fields.map((field) => field.path)).toContain("headline")
    expect(fields.map((field) => field.path)).toContain("plans.1.name")
    expect(fields.some((field) => field.path.endsWith("features"))).toBe(false)
    const next = setPath(props, "plans.1.name", "Scale")
    expect((next.plans as { name: string }[])[1].name).toBe("Scale")
    expect(setPath(props, "plans.9.name", "x")).toBe(props)
    expect(cleanInline("  a\n  b ", 40)).toBe("a b ")
  })

  it("builds every starter from known sections", () => {
    for (const starter of starters) {
      const built = starterDoc(starter.id)!
      expect(built.sections).toHaveLength(starter.sections.length)
    }
  })

  it("scopes variables to one element and clears old ones", () => {
    const el = document.createElement("div")
    applyTheme({ "--primary": "red", "--radius": "1rem" }, el)
    applyTheme({ "--primary": "blue" }, el)
    expect(el.style.getPropertyValue("--primary")).toBe("blue")
    expect(el.style.getPropertyValue("--radius")).toBe("")
    expect(document.documentElement.style.getPropertyValue("--primary")).toBe(
      ""
    )
  })
})

describe("page registry function", () => {
  it("returns a registry block for a valid page", async () => {
    const encoded = await encodeDoc({
      sections: [
        ...doc("navbar-simple", "faq-centered").sections,
        placePro(pro[0]),
      ],
    })
    const response = await pageRegistryResponse(`${encoded}.json`, pro)
    expect(response.status).toBe(200)
    expect(response.headers.get("cache-control")).toContain("max-age")
    const item = (await response.json()) as {
      type: string
      files: { path: string }[]
      registryDependencies: string[]
    }
    expect(item.type).toBe("registry:block")
    expect(item.files.map((file) => file.path)).toEqual([
      "app/page.tsx",
      "components/sections/navbar.tsx",
      "components/sections/faq.tsx",
      "components/sections/pro-chat-thread.tsx",
    ])
    expect(item.registryDependencies).toEqual([
      "https://hextaui.com/r/accordion.json",
      "https://hextaui.com/r/button.json",
    ])
  })

  it("answers bad and oversized links with problem details", async () => {
    for (const id of ["garbage.json", `1${"A".repeat(9000)}.json`]) {
      const response = await pageRegistryResponse(id, pro)
      expect(response.status).toBe(400)
      expect(response.headers.get("content-type")).toBe(
        "application/problem+json"
      )
      const body = (await response.json()) as {
        code: string
        resolution: string
      }
      expect(body.code).toBe("bad_request")
      expect(body.resolution).toContain("/tools/page-builder")
    }
  })
})
