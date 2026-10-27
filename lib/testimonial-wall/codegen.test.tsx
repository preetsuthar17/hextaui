import path from "node:path"

import * as TablerIcons from "@tabler/icons-react"
import * as React from "react"
import * as JsxRuntime from "react/jsx-runtime"
import { renderToStaticMarkup } from "react-dom/server"
import ts from "typescript"
import { describe, expect, it } from "vitest"

import { TestimonialWall } from "@/components/tools/testimonial-wall/testimonial-wall"
import * as AvatarModule from "@/components/ui/avatar"
import * as CardModule from "@/components/ui/card"
import * as CarouselModule from "@/components/ui/carousel"
import {
  generateWallCode,
  wallDependencies,
  wallInstallCommand,
  wallNeedsIconPackage,
} from "@/lib/testimonial-wall/codegen"
import {
  defaultWallOptions,
  wallLayouts,
  type WallOptions,
  type WallState,
} from "@/lib/testimonial-wall/model"
import { seedTestimonials } from "@/lib/testimonial-wall/seed"

const modules: Record<string, unknown> = {
  react: React,
  "react/jsx-runtime": JsxRuntime,
  "@tabler/icons-react": TablerIcons,
  "@/components/ui/avatar": AvatarModule,
  "@/components/ui/card": CardModule,
  "@/components/ui/carousel": CarouselModule,
}

function state(options: Partial<WallOptions> = {}): WallState {
  return {
    testimonials: seedTestimonials,
    options: { ...defaultWallOptions, ...options },
  }
}

const variants: Partial<WallOptions>[] = [
  ...wallLayouts.map((layout) => ({ layout })),
  { layout: "masonry", columns: 3, cardStyle: "plain", accent: "info" },
  { layout: "grid", columns: 2, cardStyle: "filled", radius: "none" },
  { layout: "carousel", columns: 1, cardStyle: "plain" },
  { layout: "featured", cardStyle: "plain" },
  { layout: "featured", cardStyle: "filled", accent: "primary" },
  { layout: "marquee", rows: 1 },
  {
    layout: "masonry",
    show: {
      avatar: false,
      handle: false,
      source: false,
      date: false,
      rating: false,
    },
  },
  {
    layout: "grid",
    show: {
      avatar: true,
      handle: true,
      source: true,
      date: true,
      rating: true,
    },
  },
  {
    layout: "featured",
    featured: 3,
    show: { ...defaultWallOptions.show, rating: false },
  },
  {
    layout: "featured",
    featured: 99,
    show: { ...defaultWallOptions.show, avatar: false, handle: false },
  },
]

function load(code: string) {
  const { outputText, diagnostics } = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  })
  expect(diagnostics ?? []).toEqual([])
  const exports: Record<string, unknown> = {}
  const require = (name: string) => {
    if (!(name in modules)) throw new Error(`Unexpected import ${name}`)
    return modules[name]
  }
  new Function("require", "exports", outputText)(require, exports)
  return exports.TestimonialWall as () => React.ReactElement
}

describe("generateWallCode", () => {
  it("emits no comments", () => {
    for (const variant of variants) {
      const code = generateWallCode(state(variant))
      expect(code).not.toMatch(/(^|\s)\/\/|\/\*/m)
    }
  })

  it("imports only HextaUI components, React and the icon set", () => {
    for (const variant of variants) {
      const code = generateWallCode(state(variant))
      const imports = [...code.matchAll(/from "([^"]+)"/g)].map((m) => m[1])
      for (const source of imports) {
        expect(source).toMatch(
          /^(react|@tabler\/icons-react|@\/components\/ui\/[a-z-]+)$/
        )
      }
    }
  })

  it("renders the same markup as the live preview", () => {
    for (const variant of variants) {
      const wall = state(variant)
      const Generated = load(generateWallCode(wall))
      const generated = renderToStaticMarkup(<Generated />).replace(
        /<style>[^<]*<\/style>/,
        ""
      )
      expect(generated, JSON.stringify(variant)).toBe(
        renderToStaticMarkup(
          <TestimonialWall
            testimonials={wall.testimonials}
            options={wall.options}
          />
        )
      )
    }
  })

  it("escapes testimonial text safely", () => {
    const wall: WallState = {
      testimonials: [
        {
          name: 'Quote "Tester"',
          body: "Line one\nLine two with `backticks`, ${braces} and </script>",
        },
      ],
      options: defaultWallOptions,
    }
    const Generated = load(generateWallCode(wall))
    const html = renderToStaticMarkup(<Generated />)
    expect(html).toContain("${braces}")
    expect(html).toContain("&lt;/script&gt;")
  })

  it("type checks against the real components", () => {
    const root = process.cwd()
    const files = new Map(
      variants.map((variant, index) => [
        path.join(root, "components", `__wall_check_${index}.tsx`),
        generateWallCode(state(variant)),
      ])
    )
    const config = ts.readConfigFile(
      path.join(root, "tsconfig.json"),
      ts.sys.readFile
    )
    const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
    const host = ts.createCompilerHost(parsed.options)
    const readFile = host.readFile.bind(host)
    const fileExists = host.fileExists.bind(host)
    const getSourceFile = host.getSourceFile.bind(host)
    host.readFile = (file) => files.get(file) ?? readFile(file)
    host.fileExists = (file) => files.has(file) || fileExists(file)
    host.getSourceFile = (file, language, ...rest) => {
      const text = files.get(file)
      return text === undefined
        ? getSourceFile(file, language, ...rest)
        : ts.createSourceFile(file, text, language, true, ts.ScriptKind.TSX)
    }
    const program = ts.createProgram({
      rootNames: [...files.keys()],
      options: { ...parsed.options, noEmit: true, incremental: false },
      host,
    })
    const errors = [...files.keys()].flatMap((file) =>
      ts
        .getPreEmitDiagnostics(program, program.getSourceFile(file))
        .map((diagnostic) =>
          ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
        )
    )
    expect(errors).toEqual([])
  }, 60_000)
})

describe("install command", () => {
  it("lists the HextaUI components the wall uses", () => {
    expect(wallDependencies(state().options)).toEqual(["avatar", "card"])
    expect(wallDependencies(state({ layout: "carousel" }).options)).toEqual([
      "avatar",
      "card",
      "carousel",
    ])
    expect(wallDependencies(state({ cardStyle: "plain" }).options)).toEqual([
      "avatar",
    ])
    expect(wallInstallCommand(state().options)).toBe(
      "npx shadcn@latest add https://hextaui.com/r/avatar.json https://hextaui.com/r/card.json"
    )
  })

  it("flags the icon package when no component brings it", () => {
    const show = { ...defaultWallOptions.show, avatar: false }
    expect(wallNeedsIconPackage(state({ show }).options)).toBe(true)
    expect(wallNeedsIconPackage(state().options)).toBe(false)
  })
})
