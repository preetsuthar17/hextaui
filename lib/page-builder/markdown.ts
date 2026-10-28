import { bullets, heading, link } from "@/lib/md/format"
import {
  pageBuilderDescription,
  pageBuilderPath,
  pageBuilderQuestions,
  pageBuilderSteps,
  pageBuilderTitle,
} from "@/lib/page-builder/content"
import { sectionKinds, sections } from "@/lib/page-builder/registry"

function getPageBuilderMarkdown() {
  return [
    heading(1, pageBuilderTitle),
    `> ${pageBuilderDescription}`,
    `Open the builder at ${link("hextaui.com/tools/page-builder", pageBuilderPath)}. It runs in the browser, needs no account and keeps the whole page, theme included, in the link.`,
    heading(2, "How it works"),
    pageBuilderSteps
      .map((step, index) => `${index + 1}. **${step.title}.** ${step.body}`)
      .join("\n"),
    heading(2, "Sections"),
    bullets(
      sectionKinds.map(
        (kind) =>
          `${kind.title}: ${sections
            .filter((section) => section.kind === kind.kind)
            .map(
              (section) =>
                `${section.variant} (${section.description.replace(/\.$/, "").toLowerCase()})`
            )
            .join(", ")}`
      )
    ),
    heading(2, "Install a page"),
    "The Export dialog shows a command like this one, with your page encoded in the URL:",
    "```sh\nnpx shadcn@latest add https://hextaui.com/r/pages/<page>.json\n```",
    `It returns a \`registry:block\` with \`app/page.tsx\`, one file per section in \`components/sections\`, the page theme as \`cssVars\` when one is set, and the HextaUI components the sections use as registry dependencies. The \`<page>\` value is the \`p\` parameter of a share link. ${link("OpenAPI", "/openapi.json")} documents the endpoint.`,
    heading(2, "Pro blocks"),
    `${link("HextaUI Pro blocks", "/blocks")} appear in Add section as locked previews. On a page they export as a placeholder section and an \`npx shadcn@latest add @hextaui-pro/<name>\` command, which needs ${link("HextaUI Pro", "/pricing")}.`,
    heading(2, "FAQ"),
    ...pageBuilderQuestions.flatMap((item) => [
      heading(3, item.question),
      item.answer,
    ]),
  ].join("\n\n")
}

export { getPageBuilderMarkdown }
