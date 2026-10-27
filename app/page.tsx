import type { Metadata } from "next"

import { HeroActions } from "@/components/site/hero-actions"
import { InlineScript } from "@/components/site/inline-script"
import { HomeSections } from "@/components/site/home-sections"
import { HomeStage } from "@/components/site/home-preview"
import { docsComponents } from "@/lib/docs"
import { heroRevealScript } from "@/lib/hero-reveal"
import { T, t } from "@/lib/i18n/rich"
import { pageMetadata } from "@/lib/metadata"
import { siteName } from "@/lib/site"
import { getProBlock } from "@/lib/pro/catalog"
import { refundDays } from "@/lib/pro/pricing"

export const metadata: Metadata = pageMetadata({
  path: "/",
  aiSummary: `The ${siteName} home page: an open-source library of ${docsComponents.length} React components for shadcn/ui on Base UI and Tailwind CSS v4, plus ${siteName} Pro, paid blocks for AI chat, tool calls and app screens.`,
})

const stageBlockNames = [
  "thinking",
  "chat-thread",
  "prompt-input",
  "agent-todos",
  "tool-calls",
  "voice-mode",
]

export default function Page() {
  const stageBlocks = stageBlockNames
    .map((name) => getProBlock(name))
    .filter((block) => block !== undefined)
    .map(({ name, title, free }) => ({
      name,
      title: t(title),
      free: Boolean(free),
    }))

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
          <div className="flex w-full max-w-215 flex-col items-center gap-7 pt-10 text-center text-white sm:gap-10 sm:pt-24">
            <div className="flex flex-col items-center">
              <h1
                id="home-title"
                className="marketing-display hero-reveal text-balance [--reveal-delay:0.4s]"
              >
                <T>Ship your AI app’s chat UI this weekend</T>
              </h1>
              <p className="hero-reveal mt-5 max-w-140 text-base/6 font-medium text-pretty text-white/85 [--reveal-delay:0.6s] sm:text-lg/7">
                <T>
                  Skip the weeks it takes to get streaming, tool calls, voice
                  and agent states right, and drop in shadcn/ui blocks that
                  already handle them.
                </T>
              </p>
            </div>
            <div className="hero-reveal [--reveal-delay:0.7s]">
              <HeroActions
                label={t("Get Pro and ship faster")}
                payment={t("One-time payment")}
                refund={t("{days}-day refund", { days: refundDays })}
              />
            </div>
          </div>
          <div className="relative mt-8 w-full max-w-252 pb-20 sm:mt-14 sm:pb-28">
            <h2 id="home-preview" className="sr-only">
              {t("Live previews")}
            </h2>
            <div className="hero-frame marketing-frame relative bg-background/80 p-2 inset-ring-(length:--hairline) inset-ring-border forced-colors:border">
              <div className="hero-frame-content">
                <HomeStage blocks={stageBlocks} />
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
