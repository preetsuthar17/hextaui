import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

import { siteName } from "@/lib/site"

const ogSize = { width: 1200, height: 630 }

const colors = {
  brand: "#ff6b1a",
  ink: "#1c0a1c",
  inkMuted: "#55221c",
  ice: "#ffd2ad",
}

type OgImage = {
  variant: "hero" | "slab"
  section: string
  title: string
  accent?: string
  description: string
}

function shorten(text: string, max: number) {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  const sentence = cut.match(/^.*[.!?](?=\s)/)?.[0]
  if (sentence && sentence.length >= max * 0.5) return sentence
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.]+$/, "")}…`
}

function asset(name: string) {
  return readFile(join(process.cwd(), "lib/og-assets", name))
}

function dataUrl(data: Buffer, type: string) {
  return `data:${type};base64,${data.toString("base64")}`
}

let assets: ReturnType<typeof loadAssets> | undefined

async function loadAssets() {
  const [medium, semibold, logo, hero] = await Promise.all([
    asset("InterDisplay-Medium.ttf"),
    asset("InterDisplay-SemiBold.ttf"),
    asset("logo.png"),
    asset("hero-background.jpg"),
  ])
  return {
    fonts: [
      { name: "Inter Display", data: medium, weight: 500 as const },
      { name: "Inter Display", data: semibold, weight: 600 as const },
    ],
    logo: dataUrl(logo, "image/png"),
    hero: dataUrl(hero, "image/jpeg"),
  }
}

function heroTitleSize(title: string) {
  if (title.length <= 28) return 84
  if (title.length <= 48) return 72
  return 62
}

function slabTitleSize(title: string) {
  if (title.length <= 20) return 112
  if (title.length <= 36) return 96
  if (title.length <= 56) return 80
  if (title.length <= 80) return 68
  return 60
}

function Hero({
  image,
  logo,
  background,
}: {
  image: OgImage
  logo: string
  background: string
}) {
  const title = shorten(image.title, 70)
  const size = heroTitleSize(
    image.accent && image.accent.length > title.length ? image.accent : title
  )

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "64px 120px 0",
        backgroundImage: `url(${background})`,
        backgroundSize: "1200px 630px",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          height: 44,
          padding: "0 20px",
          marginTop: 52,
          borderRadius: 999,
          fontSize: 19,
          fontWeight: 500,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.08))",
          border: "1px solid rgba(255,255,255,0.14)",
        }}
      >
        <span style={{ opacity: 0.8 }}>{image.section}</span>
        <span
          style={{
            width: 1,
            height: 20,
            backgroundColor: "rgba(255,255,255,0.2)",
          }}
        />
        <span>hextaui.com</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 30,
          fontSize: size,
          fontWeight: 600,
          letterSpacing: "-0.045em",
          lineHeight: 1.02,
        }}
      >
        <span style={{ textWrap: "balance" }}>{title}</span>
        {image.accent ? (
          <span style={{ color: colors.ice }}>{image.accent}</span>
        ) : null}
      </div>
      <div
        style={{
          marginTop: 26,
          maxWidth: 840,
          fontSize: 27,
          fontWeight: 500,
          lineHeight: 1.35,
          letterSpacing: "-0.01em",
          color: "rgba(255,255,255,0.85)",
          textWrap: "balance",
        }}
      >
        {shorten(image.description, 130)}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 44,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          color: colors.ink,
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}
      >
        <img src={logo} width={34} height={34} alt="" />
        {siteName}
      </div>
    </div>
  )
}

function Slab({ image, logo }: { image: OgImage; logo: string }) {
  const title = shorten(image.title, 110)

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "68px 80px 72px",
        backgroundColor: colors.brand,
        color: colors.ink,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 32,
          fontWeight: 600,
          letterSpacing: "-0.03em",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} width={56} height={56} alt="" />
          <span style={{ marginLeft: 16 }}>{siteName}</span>
          <span style={{ marginLeft: 14, color: colors.inkMuted }}>/</span>
          <span style={{ marginLeft: 14, color: colors.inkMuted }}>
            {image.section}
          </span>
        </div>
        <span
          style={{
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: colors.inkMuted,
          }}
        >
          hextaui.com
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: slabTitleSize(title),
            fontWeight: 600,
            letterSpacing: "-0.05em",
            lineHeight: 0.98,
            maxWidth: 1040,
            textWrap: "balance",
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 26,
            maxWidth: 1040,
            fontSize: 30,
            fontWeight: 500,
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
            color: colors.inkMuted,
          }}
        >
          {shorten(image.description, 150)}
        </div>
      </div>
    </div>
  )
}

async function renderOgImage(image: OgImage) {
  assets ??= loadAssets()
  const { fonts, logo, hero } = await assets

  return new ImageResponse(
    image.variant === "hero" ? (
      <Hero image={image} logo={logo} background={hero} />
    ) : (
      <Slab image={image} logo={logo} />
    ),
    { ...ogSize, fonts }
  )
}

export { ogSize, renderOgImage, type OgImage }
