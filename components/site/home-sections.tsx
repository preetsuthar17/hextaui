import Link from "@/components/site/link"
import { cn } from "cn"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { StartActions } from "@/components/site/hero-actions"
import { HomeBlockStage, HomeDemos } from "@/components/site/home-preview"
import { JsonLd } from "@/components/site/json-ld"
import { docsComponents, docsHooks, docsUtilities } from "@/lib/docs"
import { getProBlock, proBlocks } from "@/lib/pro/catalog"
import {
  earlyBirdLastDay,
  isEarlyBird,
  proPlans,
  refundDays,
} from "@/lib/pro/pricing"
import { T, t } from "@/lib/i18n/rich"
import { siteRepository } from "@/lib/site"
import { faqPageJsonLd } from "@/lib/structured-data"

const linkClassName =
  "rounded-sm text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors duration-150 outline-none hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-focus-ring motion-reduce:transition-none"

const stats = [
  {
    name: "Components",
    href: "/components",
    value: docsComponents.length,
    detail: "From {first} to {last}",
    values: {
      first: docsComponents[0]?.name ?? "",
      last: docsComponents.at(-1)?.name ?? "",
    },
  },
  {
    name: "Hooks",
    href: `/docs/${docsHooks[0]?.slug}`,
    value: docsHooks.length,
    detail: "Like useButtonFeedback and useDelayedLoading",
  },
  {
    name: "Utilities",
    href: `/docs/${docsUtilities[0]?.slug}`,
    value: docsUtilities.length,
    detail: "For motion, hotkeys, hairlines and scroll fades",
  },
  {
    name: "Pro blocks",
    href: "/blocks",
    value: proBlocks.length,
    detail: "For AI products and stores, with more categories coming",
  },
]

const { solo, team } = proPlans
const earlyBird = isEarlyBird()
const proPriceText = earlyBird
  ? `$${solo.earlyPrice} once for one developer, or $${team.earlyPrice} for a team of ${team.seats}, until ${earlyBirdLastDay}. After that, Solo is $${solo.price} and Team is $${team.price}`
  : `$${solo.price} once for one developer, or $${team.price} for a team of ${team.seats}`

const questions = [
  {
    question: "What is HextaUI?",
    answer: `An open-source React component library built on top of shadcn/ui and Base UI, with ${docsComponents.length} components, ${docsHooks.length} hooks and ${docsUtilities.length} utilities you add with the shadcn CLI, plus HextaUI Pro blocks.`,
  },
  {
    question: "Is it free for commercial use?",
    answer:
      "Yes. Components, hooks and utilities are licensed under the MIT License and free for personal and commercial work. Only the Pro blocks are paid.",
  },
  {
    question: "What do I need to use it?",
    answer:
      "A React 19 project with Tailwind CSS v4 and a components.json from the shadcn CLI. The CLI copies plain source files into your project, so any React setup that shadcn/ui supports works.",
  },
  {
    question: "How does it differ from shadcn/ui?",
    answer:
      "It keeps the shadcn/ui names, props and theme tokens, so it drops into the same project. On top of that, components handle their loading, error and empty states, animate with motion you can interrupt, and are built for the keyboard, screen readers, touch and right-to-left layouts.",
  },
  {
    question: "Does it use Radix or Base UI?",
    answer:
      "Base UI. Components sit on Base UI primitives for behavior and accessibility, with Tabler icons and Tailwind CSS v4 styles.",
  },
  {
    question: "What is HextaUI Pro?",
    answer: `Practical blocks built for AI products: complete screens such as a chat thread, tool calls, agent todos and voice mode today, with account, settings and dashboard blocks next, and the hard states like streaming, retries and approvals already handled. It costs ${proPriceText}. It covers unlimited personal and commercial projects, includes every future block category and comes with a ${refundDays}-day refund. Prompt Input is free to try.`,
  },
  {
    question: "Can my AI assistant use it?",
    answer:
      "Yes. HextaUI runs a read-only MCP server and publishes llms.txt, so assistants like Claude Code and Cursor can look up components, props and examples while they write your code.",
  },
]

function SectionHead({
  id,
  eyebrow,
  title,
  className,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn("flex max-w-2xl flex-col items-start", className)}>
      <p className="text-sm font-medium text-brand-strong">{t(eyebrow)}</p>
      <h2 id={id} className="marketing-heading mt-3 text-balance">
        {t(title)}
      </h2>
      {children ? (
        <p className="marketing-lede mt-4 max-w-xl text-pretty text-muted-foreground">
          {children}
        </p>
      ) : null}
    </div>
  )
}

function Band({
  id,
  className,
  children,
}: {
  id: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section aria-labelledby={id} className={cn("border-t", className)}>
      <div className="mx-auto w-full max-w-5xl px-4 py-20 sm:py-28">
        {children}
      </div>
    </section>
  )
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-12 grid gap-x-12 gap-y-5 text-sm/6 text-pretty text-muted-foreground sm:grid-cols-2">
      {children}
    </div>
  )
}

function HomeSections() {
  const chatThread = getProBlock("chat-thread")

  return (
    <>
      <section aria-label={t("What’s inside")} className="border-t">
        <ul className="mx-auto grid w-full max-w-5xl grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <li
              key={stat.name}
              className="border-b lg:border-b-0 lg:not-last:border-e"
            >
              <Link
                href={stat.href}
                className="home-stat"
              >
                <span className="marketing-number tabular-nums">
                  {stat.value}
                </span>
                <span className="text-sm font-medium">{t(stat.name)}</span>
                <span className="text-sm text-pretty text-muted-foreground transition-colors duration-150 motion-reduce:transition-none">
                  {t(stat.detail, stat.values)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Band id="home-pro">
        <SectionHead
          id="home-pro"
          eyebrow="HextaUI Pro"
          title="Built for what happens next"
          className="mb-12 sm:mb-16"
        >
          {t(
            "Stop a reply mid-sentence, approve a tool call before it runs, and keep the thread still while the model writes."
          )}
        </SectionHead>
        {chatThread ? (
          <HomeBlockStage
            name={chatThread.name}
            title={chatThread.title}
            free={Boolean(chatThread.free)}
          />
        ) : null}
        <Prose>
          <p>
            <T>
              Free AI kits get you a chat that looks right. Pro is about what
              happens next: stopping a reply mid-sentence and retrying it,
              approving a tool call before it runs, switching between message
              versions, and a thread that doesn&apos;t jump while the model is
              still talking. Every block ships with a working AI SDK example.
            </T>
          </p>
          <p>
            <T>
              Pro is a growing set of complete blocks built from the same
              components: a chat thread, streaming text, tool calls, agent
              todos, a code block with diffs, voice mode and more. They are the
              screens an AI product needs on day one, with the states and motion
              already worked out, and the account, settings and dashboard
              screens around them come next.
            </T>
          </p>
          <p>
            <T>
              The four previews at the top of this page are Pro blocks running
              live. Thinking shows a model&apos;s reasoning and tool steps as
              they stream in. Prompt input handles model and effort picks,
              dictation, mentions, commands and file uploads. Chat thread
              renders a full conversation, and Voice mode turns it into a spoken
              one, through the browser&apos;s voice or a realtime voice API.
            </T>
          </p>
          <p>
            <T>
              Every block has a live preview anyone can open, and installs
              through the same shadcn CLI from a private registry. Pro is{" "}
              {proPriceText}, for unlimited personal and commercial projects.{" "}
              <Link href="/pricing" className={linkClassName}>
                Compare plans
              </Link>{" "}
              or{" "}
              <Link href="/blocks/prompt-input" className={linkClassName}>
                install Prompt Input free
              </Link>
              .
            </T>
          </p>
          <p>
            <T>
              Solo covers one developer. Team covers up to {team.seats}, managed
              by email from your account, with one shared token allowed in CI.
              Clients and colleagues who only use the finished product
              don&apos;t need a seat. If it isn&apos;t right for you, you get a
              full refund within {refundDays} days, no questions asked.
            </T>
          </p>
        </Prose>
      </Band>

      <Band id="home-components">
        <SectionHead
          id="home-components"
          eyebrow="Open source"
          title="Free components underneath"
          className="mb-12 sm:mb-16"
        >
          {t(
            "Every component handles its loading, error and empty states, and works with the keyboard alone."
          )}
        </SectionHead>
        <HomeDemos />
        <Prose>
          <p>
            <T>
              HextaUI is a collection of React components built on top of
              shadcn/ui and Base UI. It covers the everyday parts of an
              interface, from buttons and forms to menus, tables and chat, and
              ships them as source you own.
            </T>
          </p>
          <p>
            <T>
              Each component is built for the parts that usually get skipped:
              the loading, error and empty states, motion that can be
              interrupted halfway, the keyboard paths, what a screen reader
              announces, and a layout that still holds at 320 pixels or in a
              right-to-left language.
            </T>
          </p>
          <p>
            <T>
              Motion runs on one set of easing curves and durations, respects
              the reduced motion setting, and can be interrupted and reversed
              mid-way. Focus rings follow the shape of whatever they outline,
              and every interactive part works with the keyboard alone.
            </T>
          </p>
          <p>
            <T>
              The look stays quiet on purpose: neutral surfaces, hairline
              borders, shadows only on things that float above the page, and
              corners that stay concentric when one shape sits inside another.
              Your brand comes through your theme tokens, not ours.
            </T>
          </p>
          <p>
            <T>
              Components are rebuilt one at a time and only ship once every
              state works. Each one gets a docs page that shows those states
              live, so you can try the edge cases before you install anything.
            </T>
          </p>
          <p>
            <T>
              The docs are written for people and agents alike. Every page is
              also published as Markdown, and llms.txt maps the whole library,
              so an AI assistant reads the same API references and examples you
              do.
            </T>
          </p>
          <p>
            <T>
              The code is yours. The shadcn CLI copies the source into your
              project, so you can read it, change it and keep it, without
              waiting on a package update. It&apos;s all open source on{" "}
              <a
                href={siteRepository}
                target="_blank"
                rel="noreferrer"
                className={linkClassName}
              >
                GitHub
              </a>
              .
            </T>
          </p>
        </Prose>
      </Band>

      <Band id="home-faq">
        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-2">
          <SectionHead id="home-faq" eyebrow="FAQ" title="Before you ask">
            {t("Short answers about licensing, setup and Pro.")}
          </SectionHead>
          <div className="border-t">
            <Accordion>
              {questions.map((item) => (
                <AccordionItem key={item.question} value={item.question}>
                  <AccordionTrigger>{t(item.question)}</AccordionTrigger>
                  <AccordionContent>{t(item.answer)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            ...faqPageJsonLd(
              "/",
              questions.map((item) => ({
                question: t(item.question),
                answer: t(item.answer),
              }))
            ),
          }}
        />
      </Band>

      <section aria-labelledby="home-start" className="px-4 pb-20 sm:pb-28">
        <div className="brand-surface relative mx-auto w-full max-w-5xl rounded-3xl bg-brand p-2 text-foreground">
          <div className="relative isolate grid min-h-80 overflow-hidden rounded-2xl inset-ring-(length:--hairline) inset-ring-white/20 sm:grid-cols-[1fr_33.5%] forced-colors:border">
            <div className="flex flex-col items-start justify-center gap-6 px-6 py-12 sm:py-20 sm:ps-16">
              <h2 id="home-start" className="marketing-heading text-balance">
                <span className="block">
                  {t("Start with the free components.")}
                </span>
                <span className="block text-brand-ice">
                  {t("Add Pro when you need it.")}
                </span>
              </h2>
              <StartActions />
            </div>
            <div
              aria-hidden="true"
              className="relative -z-10 h-56 border-white/20 max-sm:border-t sm:h-auto sm:border-s"
            >
              <span className="absolute inset-x-0 top-[calc(50%-5.1875rem)] h-px bg-white/20" />
              <span className="absolute inset-x-0 top-1/2 h-px bg-white/20" />
              <span className="absolute top-0 left-1/5 h-1/2 w-px bg-white/20" />
              <span className="absolute top-0 left-2/5 h-1/2 w-px bg-white/20" />
              <span className="absolute top-0 left-3/5 h-1/2 w-px bg-white/20" />
              <span className="absolute top-0 left-4/5 h-1/2 w-px bg-white/20" />
              <span className="absolute top-[calc(50%-3px)] -left-[3px] size-1.5 bg-brand-ice max-sm:hidden" />
              <svg
                viewBox="0 0 100 100"
                className="absolute end-0 bottom-0 h-1/2 text-white/35"
              >
                <path
                  d="M50 4 90 27v46L50 96 10 73V27ZM50 20l26 15v30L50 80 24 65V35Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export { HomeSections }
