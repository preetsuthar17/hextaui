import Link from "next/link"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { docsComponents, docsHooks, docsUtilities } from "@/lib/docs"
import { proBlocks } from "@/lib/pro/catalog"
import { proPrice, proRegularPrice } from "@/lib/pro/pricing"
import { absoluteUrl, siteRepository } from "@/lib/site"

const linkClassName =
  "rounded-sm text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors duration-150 outline-none hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-focus-ring motion-reduce:transition-none"

const inside = [
  {
    name: "Components",
    href: "/components",
    detail: `${docsComponents.length}, from ${docsComponents[0]?.name} to ${docsComponents.at(-1)?.name}`,
  },
  {
    name: "Hooks",
    href: `/docs/${docsHooks[0]?.slug}`,
    detail: `${docsHooks.length}, like useButtonFeedback and useDelayedLoading`,
  },
  {
    name: "Utilities",
    href: `/docs/${docsUtilities[0]?.slug}`,
    detail: `${docsUtilities.length}, for motion, hotkeys, hairlines and scroll fades`,
  },
  {
    name: "Pro blocks",
    href: "/blocks",
    detail: `${proBlocks.length}, for AI chat interfaces and app layouts`,
  },
  {
    name: "MCP server",
    href: "/docs/mcp",
    detail: "So your AI assistant can read the docs too",
  },
]

const steps = [
  {
    name: "Set up shadcn/ui",
    detail:
      "Run shadcn init in a React 19 project with Tailwind CSS v4. If the project already uses shadcn/ui, skip ahead.",
  },
  {
    name: "Add a component",
    detail:
      "Pass its registry URL to the shadcn CLI. The source, its dependencies, the theme tokens and any HextaUI components it builds on land in your project.",
  },
  {
    name: "Make it yours",
    detail:
      "Import it from @/components/ui like any other shadcn/ui component, then change the markup, the motion or the styles. Nothing is locked inside a package.",
  },
  {
    name: "Stay current",
    detail: (
      <>
        Components improve in the open on GitHub. When one changes, run the same
        add command with{" "}
        <code className="font-mono whitespace-nowrap">--overwrite</code> and
        review the diff in git before you keep it.
      </>
    ),
  },
  {
    name: "Bring your agent",
    detail: `Point Claude Code, Cursor or any MCP client at ${absoluteUrl("/mcp")} and it can look up props and examples while it writes code with you.`,
  },
]

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
    answer: `Complete blocks for AI chat interfaces and app layouts, such as a chat thread, agent todos and voice mode. It costs $${proPrice} once while blocks are in early access, then $${proRegularPrice}, covers unlimited personal and commercial projects and comes with a 14-day refund.`,
  },
  {
    question: "Can my AI assistant use it?",
    answer:
      "Yes. HextaUI runs a read-only MCP server and publishes llms.txt, so assistants like Claude Code and Cursor can look up components, props and examples while they write your code.",
  },
]

function HomeSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      aria-labelledby={id}
      className="mx-auto grid w-full max-w-screen-2xl gap-x-10 gap-y-4 px-3 pb-20 sm:pb-24 lg:grid-cols-4"
    >
      <h2 id={id} className="text-sm font-medium lg:pt-3">
        {title}
      </h2>
      <div className="min-w-0 lg:col-span-2">{children}</div>
    </section>
  )
}

function HomeSections() {
  return (
    <>
      <HomeSection id="home-about" title="About">
        <div className="flex flex-col gap-4 text-sm/6 text-pretty text-muted-foreground lg:pt-2.5">
          <p>
            HextaUI is a collection of React components built on top of
            shadcn/ui and Base UI. It covers the everyday parts of an interface,
            from buttons and forms to menus, tables and chat, and ships them as
            source you own.
          </p>
          <p>
            Each component is built for the parts that usually get skipped: the
            loading, error and empty states, motion that can be interrupted
            halfway, the keyboard paths, what a screen reader announces, and a
            layout that still holds at 320 pixels or in a right-to-left
            language.
          </p>
          <p>
            Motion runs on one set of easing curves and durations, respects the
            reduced motion setting, and can be interrupted and reversed mid-way.
            Focus rings follow the shape of whatever they outline, and every
            interactive part works with the keyboard alone.
          </p>
          <p>
            The look stays quiet on purpose: neutral surfaces, hairline borders,
            shadows only on things that float above the page, and corners that
            stay concentric when one shape sits inside another. Your brand comes
            through your theme tokens, not ours.
          </p>
          <p>
            Components are rebuilt one at a time and only ship once every state
            works. Each one gets a docs page that shows those states live, so
            you can try the edge cases before you install anything.
          </p>
          <p>
            The docs are written for people and agents alike. Every page is also
            published as Markdown, and llms.txt maps the whole library, so an AI
            assistant reads the same API references and examples you do.
          </p>
          <p>
            The code is yours. The shadcn CLI copies the source into your
            project, so you can read it, change it and keep it, without waiting
            on a package update. It&apos;s all open source on{" "}
            <a
              href={siteRepository}
              target="_blank"
              rel="noreferrer"
              className={linkClassName}
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </HomeSection>

      <HomeSection id="home-inside" title="What’s inside">
        <ul className="border-t">
          {inside.map((item) => (
            <li key={item.name} className="border-b">
              <Link
                href={item.href}
                className="grid gap-x-10 gap-y-0.5 rounded-sm py-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-focus-ring sm:grid-cols-2 [@media(hover:hover)]:hover:*:last:text-foreground"
              >
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground transition-colors duration-150 motion-reduce:transition-none">
                  {item.detail}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </HomeSection>

      <HomeSection id="home-how" title="How it works">
        <ol className="border-t">
          {steps.map((step) => (
            <li
              key={step.name}
              className="grid gap-x-10 gap-y-0.5 border-b py-3 text-sm sm:grid-cols-2"
            >
              <span className="font-medium">{step.name}</span>
              <span className="text-pretty text-muted-foreground">
                {step.detail}
              </span>
            </li>
          ))}
        </ol>
      </HomeSection>

      <HomeSection id="home-pro" title="HextaUI Pro">
        <div className="flex flex-col gap-4 text-sm/6 text-pretty text-muted-foreground lg:pt-2.5">
          <p>
            Pro is a growing set of complete blocks built from the same
            components: a chat thread, streaming text, tool calls, agent todos,
            a code block with diffs, voice mode and more. They are the screens
            an AI product needs on day one, with the states and motion already
            worked out.
          </p>
          <p>
            Every block has a live preview anyone can open, and installs through
            the same shadcn CLI from a private registry. Pro is ${proPrice} once
            while blocks are in early access, then ${proRegularPrice}, for
            unlimited personal and commercial projects.{" "}
            <Link href="/blocks" className={linkClassName}>
              Browse the blocks
            </Link>
            .
          </p>
          <p>
            The four previews at the top of this page are Pro blocks running
            live. Thinking shows a model&apos;s reasoning and tool steps as they
            stream in. Prompt input handles model and effort picks, dictation,
            mentions, commands and file uploads. Chat thread renders a full
            conversation, and Voice mode turns it into a spoken one, through the
            browser&apos;s voice or a realtime voice API.
          </p>
          <p>
            The license is per developer: everyone who works with Pro code needs
            their own, while clients and teammates who only use the finished
            product don&apos;t. If it isn&apos;t right for you, you get a full
            refund within 14 days, no questions asked.
          </p>
        </div>
      </HomeSection>

      <HomeSection id="home-faq" title="Before you ask">
        <div className="border-t">
          <Accordion>
            {questions.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </HomeSection>
    </>
  )
}

export { HomeSections }
