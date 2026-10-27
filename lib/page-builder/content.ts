import { sections } from "@/lib/page-builder/registry"

const pageBuilderPath = "/tools/page-builder"

const pageBuilderTitle = "Free page builder for shadcn/ui"

const pageBuilderDescription =
  "Compose a landing page from free shadcn/ui sections, edit it live and export clean Next.js code, or install it with one shadcn command. No signup."

const pageBuilderSteps = [
  {
    title: "Pick sections",
    body: `${sections.length} free sections: navbars, heroes, logo strips, features, stats, testimonials, pricing, FAQ, calls to action and footers, in two or three layouts each.`,
  },
  {
    title: "Edit the copy",
    body: "Click a section to change its text, links and lists. Reorder by dragging or with the keyboard, undo with ⌘Z, and check the page at desktop, tablet and phone widths in light and dark.",
  },
  {
    title: "Export the code",
    body: "One shadcn command writes app/page.tsx and a file per section, with the HextaUI components they use. Or copy each file, or download a .zip.",
  },
]

const pageBuilderQuestions = [
  {
    question: "Is the page builder free?",
    answer:
      "Yes. There is no account and no limit. Every free section exports as plain React and Tailwind CSS code under the MIT license, built on free HextaUI components.",
  },
  {
    question: "How does the one-line install work?",
    answer:
      "Your page is compressed into the link. The shadcn CLI fetches https://hextaui.com/r/pages/<link>.json, which turns it back into a registry item with app/page.tsx, a file per section and the HextaUI components they need.",
  },
  {
    question: "Where is my page saved?",
    answer:
      "Only in the address bar. Nothing is stored on a server, so copy the Share link to keep a page or send it to someone.",
  },
  {
    question: "Can I add HextaUI Pro blocks?",
    answer:
      "Pro blocks appear in the list as locked previews. Placed on a page, they export as a placeholder section and the shadcn command to install the real block, which needs HextaUI Pro.",
  },
  {
    question: "Will the sections match my theme?",
    answer:
      "Yes. They only use shadcn/ui theme tokens such as background, foreground, primary, muted and border, so they pick up your colors, radius and fonts, in light and dark mode.",
  },
  {
    question: "Does it work outside Next.js?",
    answer:
      "The install command targets the Next.js App Router. The section files are plain React components, so they work in any React app with Tailwind CSS v4 and the HextaUI components installed.",
  },
]

export {
  pageBuilderDescription,
  pageBuilderPath,
  pageBuilderQuestions,
  pageBuilderSteps,
  pageBuilderTitle,
}
