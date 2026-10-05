import { DocsCodeBlock } from "@/components/docs/docs-code-block"
import { DocsComponentPage } from "@/components/docs/docs-component-page"
import {
  DocsCode,
  DocsList,
  DocsParagraph,
  DocsSection,
} from "@/components/docs/docs-content"
import { DocsExample } from "@/components/docs/docs-example"
import { DocsInstall } from "@/components/docs/docs-install"
import {
  DocsAttributesTable,
  DocsPropsTable,
} from "@/components/docs/docs-props-table"
import { SeparatorAlign } from "@/components/examples/separator/align"
import { SeparatorDecorative } from "@/components/examples/separator/decorative"
import { SeparatorDemo } from "@/components/examples/separator/demo"
import { SeparatorLabel } from "@/components/examples/separator/label"
import { SeparatorLongContent } from "@/components/examples/separator/long-content"
import { SeparatorRender } from "@/components/examples/separator/render"
import { SeparatorRtl } from "@/components/examples/separator/rtl"
import { SeparatorVertical } from "@/components/examples/separator/vertical"
import { SeparatorVerticalLabel } from "@/components/examples/separator/vertical-label"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("separator")

const importCode = `import { Separator } from "@/components/ui/separator"`

const usageCode = `<Separator />
<Separator orientation="vertical" />
<Separator>Or continue with</Separator>`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="separator">
      <DocsExample file="separator/demo">
        <SeparatorDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "cn"]}
        files={["components/ui/separator.tsx"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          The line is one physical pixel thick on every screen, the same
          hairline as borders, so it lines up with cards and inputs around it.
          Space it with the parent&apos;s <DocsCode>gap</DocsCode> or a margin.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="separator/vertical"
          title="Vertical"
          description={
            <>
              With <DocsCode>{'orientation="vertical"'}</DocsCode> the line
              stretches to the height of its flex row. Outside a flex row, give
              it a height.
            </>
          }
        >
          <SeparatorVertical />
        </DocsExample>
        <DocsExample
          file="separator/label"
          title="Label"
          description="Children sit in the middle of the line, with the line filling the space on both sides."
        >
          <SeparatorLabel />
        </DocsExample>
        <DocsExample
          file="separator/align"
          title="Align"
          description={
            <>
              <DocsCode>align</DocsCode> moves the label to the{" "}
              <DocsCode>start</DocsCode> or <DocsCode>end</DocsCode>, which
              suits section and date headers. Icons are sized to the text.
            </>
          }
        >
          <SeparatorAlign />
        </DocsExample>
        <DocsExample
          file="separator/vertical-label"
          title="Vertical label"
          description="A vertical separator with a label keeps the text upright and draws the line above and below it."
        >
          <SeparatorVerticalLabel />
        </DocsExample>
        <DocsExample
          file="separator/decorative"
          title="Decorative"
          description={
            <>
              <DocsCode>decorative</DocsCode> hides a purely visual line from
              screen readers, so they don&apos;t announce a separator between
              rows that already read well on their own.
            </>
          }
        >
          <SeparatorDecorative />
        </DocsExample>
        <DocsExample
          file="separator/render"
          title="Inline"
          description={
            <>
              Use <DocsCode>render</DocsCode> to output a{" "}
              <DocsCode>{"<span>"}</DocsCode> where a{" "}
              <DocsCode>{"<div>"}</DocsCode> isn&apos;t allowed, like inside a
              paragraph.
            </>
          }
        >
          <SeparatorRender />
        </DocsExample>
        <DocsExample
          file="separator/long-content"
          title="Long content"
          description="Long labels wrap and unbroken strings break, while a short stretch of line stays visible on each side."
        >
          <SeparatorLongContent />
        </DocsExample>
        <DocsExample
          file="separator/rtl"
          title="Right to left"
          description="Start and end follow the reading direction."
        >
          <SeparatorRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            A plain separator has{" "}
            <DocsCode>role=&quot;separator&quot;</DocsCode> and{" "}
            <DocsCode>aria-orientation</DocsCode>, like an{" "}
            <DocsCode>{"<hr>"}</DocsCode>.
          </li>
          <li>
            With <DocsCode>decorative</DocsCode>, it gets{" "}
            <DocsCode>role=&quot;none&quot;</DocsCode> and screen readers skip
            it.
          </li>
          <li>
            A separator with a label has no role. The separator role would make
            its text presentational, so the label is read as plain text instead.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI Separator. Renders a{" "}
          <DocsCode>{"<div>"}</DocsCode> and accepts its attributes.
        </DocsParagraph>
        <DocsSection title="Separator" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "orientation",
                type: '"horizontal" | "vertical"',
                default: '"horizontal"',
              },
              {
                name: "decorative",
                type: "boolean",
                default: "false",
                description:
                  "Hide the line from screen readers when it is only visual.",
              },
              {
                name: "children",
                type: "ReactNode",
                description:
                  "A label drawn in the line. Leave it out for a plain line.",
              },
              {
                name: "align",
                type: '"start" | "center" | "end"',
                default: '"center"',
                description: "Where the label sits along the line.",
              },
              {
                name: "className",
                type: "string | (state) => string",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="separator"',
                description: "Target separators in CSS.",
              },
              {
                name: "data-orientation",
                description: '"horizontal" or "vertical".',
              },
              {
                name: "data-content",
                description: "Present when the separator has a label.",
              },
              {
                name: "data-align",
                description: "The label's alignment, when there is a label.",
              },
              {
                name: 'data-slot="separator-label"',
                description: "The element that wraps the label.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
