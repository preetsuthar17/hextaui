import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

import { siteName } from "@/lib/site"

export const dynamic = "force-static"

export const alt = "HextaUI — React components and blocks for shadcn/ui"

export const size = { width: 1200, height: 630 }

export const contentType = "image/png"

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/hextaui-logo.png"))
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#fafafa",
        color: "#0a0a0a",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <img src={logoSrc} width={88} height={88} alt="" />
        <div style={{ fontSize: 56, fontWeight: 600, letterSpacing: -2 }}>
          {siteName}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            letterSpacing: -3,
            lineHeight: 1.05,
            maxWidth: 960,
          }}
        >
          Ready to use blocks & components built on top of shadcn/ui
        </div>
        <div style={{ fontSize: 30, color: "#737373" }}>
          Open source · React · Base UI · Tailwind CSS
        </div>
      </div>
    </div>,
    size
  )
}
