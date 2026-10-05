import { DocsCodeBlock } from "@/components/docs/docs-code-block"
import { DocsCommand } from "@/components/docs/docs-command"
import { DocsComponentPage } from "@/components/docs/docs-component-page"
import {
  DocsCode,
  DocsList,
  DocsParagraph,
  DocsSection,
} from "@/components/docs/docs-content"
import { DocsExample } from "@/components/docs/docs-example"
import { DocsAttributesTable } from "@/components/docs/docs-props-table"
import { HairlineDemo } from "@/components/examples/hairline/demo"
import { HairlineList } from "@/components/examples/hairline/list"
import { getDocsComponentMetadata } from "@/lib/docs"
import { getRegistryItemUrl } from "@/lib/docs-registry"

export const metadata = getDocsComponentMetadata("hairline")

const cssCode = `@theme inline {
  --default-border-width: var(--hairline);
}

@utility border-hairline {
  border-width: var(--hairline);
}

:root {
  --hairline: 1px;

  @media (min-resolution: 1.5dppx) {
    --hairline: calc(1px / 1.5);
  }

  @media (min-resolution: 2dppx) {
    --hairline: 0.5px;
  }

  @media (min-resolution: 3dppx) {
    --hairline: calc(1px / 3);
  }

  @media (min-resolution: 4dppx) {
    --hairline: 0.25px;
  }
}`

const usageCode = `<div className="border" />
<ul className="divide-y" />
<div className="border-2 sm:border-hairline" />
<button className="inset-ring-(length:--hairline) inset-ring-border" />
<hr className="h-(--hairline) border-0 bg-border" />`

export default function Page() {
  return (
    <DocsComponentPage slug="hairline">
      <DocsExample file="hairline/demo">
        <HairlineDemo />
      </DocsExample>

      <DocsSection title="Installation">
        <DocsParagraph>
          Hairline is part of the HextaUI theme. If you&apos;ve added the theme
          or any component, you have it.
        </DocsParagraph>
        <DocsCommand
          mode="dlx"
          packages={["shadcn@latest", "add", getRegistryItemUrl("theme")]}
        />
        <DocsParagraph>Or add it to your global CSS by hand.</DocsParagraph>
        <DocsCodeBlock code={cssCode} lang="css" title="app/globals.css" />
      </DocsSection>

      <DocsSection title="Usage">
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          You rarely need to reach for it. The theme makes it the default border
          width, so <DocsCode>border</DocsCode>, <DocsCode>border-t</DocsCode>{" "}
          and <DocsCode>divide-y</DocsCode> all draw hairlines. Use the variable
          directly where Tailwind has no default, like rings, outlines and lines
          drawn with a background.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Why hairlines">
        <DocsParagraph>
          A CSS pixel covers two or three physical pixels on most screens, so a{" "}
          <DocsCode>1px</DocsCode> border is really two or three device pixels
          thick. <DocsCode>--hairline</DocsCode> divides by the display&apos;s
          pixel ratio so every line is exactly one device pixel, the way native
          apps draw separators. On a standard display it stays 1px.
        </DocsParagraph>
        <DocsAttributesTable
          label="Pixel ratio"
          attributes={[
            { name: "1×", description: "1px" },
            { name: "1.5×", description: "0.667px" },
            { name: "2×", description: "0.5px" },
            { name: "3×", description: "0.333px" },
            { name: "4×", description: "0.25px" },
          ]}
        />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="hairline/list"
          title="Lists and cards"
          description={
            <>
              Plain <DocsCode>border</DocsCode> and{" "}
              <DocsCode>divide-y</DocsCode>. Thinner separators group rows
              without boxing them in.
            </>
          }
        >
          <HairlineList />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Good to know">
        <DocsList>
          <li>
            HextaUI components draw edges with{" "}
            <DocsCode>inset-ring-(length:--hairline)</DocsCode> rather than
            borders. An inset ring takes no layout space, so a state that
            changes the ring&apos;s color or width never shifts the content.
          </li>
          <li>
            Hairlines are lighter on the page, so a border color tuned for 1px
            lines may look faint. The theme&apos;s <DocsCode>--border</DocsCode>{" "}
            is tuned for hairlines.
          </li>
          <li>
            Use <DocsCode>border-2</DocsCode> or wider for emphasis, like a
            selected card. Those stay in CSS pixels.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsAttributesTable
          label="Name"
          attributes={[
            {
              name: "--hairline",
              description: "One device pixel, in CSS pixels.",
            },
            {
              name: "border-hairline",
              description: "Sets border-width to --hairline.",
            },
            {
              name: "--default-border-width",
              description:
                "Set to --hairline, so border and divide default to it.",
            },
          ]}
        />
      </DocsSection>
    </DocsComponentPage>
  )
}
