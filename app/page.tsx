import type { Metadata } from "next"
import Link from "@/components/site/link"

import { HeroActions } from "@/components/site/hero-actions"
import { InlineScript } from "@/components/site/inline-script"
import { HomeSections } from "@/components/site/home-sections"
import { HomeBlocks } from "@/components/site/home-preview"
import { docsComponents } from "@/lib/docs"
import { getGithubStars } from "@/lib/github"
import { heroRevealScript } from "@/lib/hero-reveal"
import { T, t } from "@/lib/i18n/rich"
import { pageMetadata } from "@/lib/metadata"
import { getProBlock, proBlocks } from "@/lib/pro/catalog"

export const metadata: Metadata = pageMetadata({
  path: "/",
  markdown: "/index.md",
})

const previewBlocks = ["thinking", "prompt-input", "chat-thread", "voice-mode"]
  .map((name) => getProBlock(name))
  .filter((block) => block !== undefined)
  .map(({ name, title, free }) => ({ name, title, free: Boolean(free) }))

const ecommerceCount = proBlocks.filter(
  (block) => block.category === "ecommerce"
).length

export default async function Page() {
  const stars = await getGithubStars()

  return (
    <main className="flex flex-1 flex-col">
      <InlineScript html={heroRevealScript} />
      <section
        aria-labelledby="home-title"
        className="relative isolate -mt-12 overflow-hidden pt-12"
      >
        <span aria-hidden="true" className="hero-gradient" />
        <span aria-hidden="true" className="hero-lines" />
        <div className="frame-width relative flex flex-col items-center px-4 sm:px-8">
          <div className="flex w-full max-w-215 flex-col items-center gap-10 pt-24 text-center text-white sm:pt-34">
            <div className="flex flex-col items-center">
              <Link
                href="/blocks"
                className="hero-badge hero-reveal mb-6 [--reveal-delay:0.85s]"
              >
                <span className="opacity-80">
                  {t("{count} new e-commerce blocks", {
                    count: ecommerceCount,
                  })}
                </span>
                <span aria-hidden="true" className="h-4 w-px bg-white/10" />
                <span>{t("Take a look")}</span>
              </Link>
              <h1
                id="home-title"
                className="marketing-display flex flex-col gap-0.5 text-balance"
              >
                <span className="hero-reveal [--reveal-delay:0.4s]">
                  <T>The hard states, handled.</T>
                </span>{" "}
                <span className="hero-reveal text-brand-ice [--reveal-delay:0.5s]">
                  <T>Blocks for shadcn/ui.</T>
                </span>
              </h1>
              <p className="hero-reveal mt-5 max-w-140 text-lg/7 font-medium text-pretty text-white/85 [--reveal-delay:0.6s]">
                {t(
                  "Blocks for AI products and stores, built on {count} free components. Streaming, retries and approvals, already worked out.",
                  { count: docsComponents.length }
                )}
              </p>
            </div>
            <div className="hero-reveal [--reveal-delay:0.7s]">
              <HeroActions stars={stars} />
            </div>
          </div>
          <div className="relative mt-20 w-full max-w-252 pb-20 sm:mt-24 sm:pb-28">
            <h2 id="home-preview" className="sr-only">
              {t("Live previews")}
            </h2>
            <div className="hero-frame marketing-frame relative bg-background/80 p-2 inset-ring-(length:--hairline) inset-ring-border forced-colors:border">
              <div className="hero-frame-content">
                <HomeBlocks blocks={previewBlocks} />
              </div>
              <div aria-hidden="true" className="hero-frame-shine" />
            </div>
          </div>
        </div>
      </section>
      <HomeSections />
    </main>
  )
}
