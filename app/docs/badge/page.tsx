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
  DocsKeyboardTable,
  DocsPropsTable,
} from "@/components/docs/docs-props-table"
import { BadgeControlled } from "@/components/examples/badge/controlled"
import { BadgeCounts } from "@/components/examples/badge/counts"
import { BadgeDemo } from "@/components/examples/badge/demo"
import { BadgeInteractive } from "@/components/examples/badge/interactive"
import { BadgeLongContent } from "@/components/examples/badge/long-content"
import { BadgeRemovable } from "@/components/examples/badge/removable"
import { BadgeRtl } from "@/components/examples/badge/rtl"
import { BadgeSizes } from "@/components/examples/badge/sizes"
import { BadgeVariants } from "@/components/examples/badge/variants"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("badge")

const importCode = `import {
  Badge,
  BadgeClose,
  BadgeCount,
  BadgeDot,
} from "@/components/ui/badge"`

const usageCode = `<Badge variant="success">
  <BadgeDot />
  Paid
</Badge>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `Badge
├── BadgeDot
├── BadgeCount
└── BadgeClose`

export default function Page() {
  return (
    <DocsComponentPage slug="badge">
      <DocsExample file="badge/demo">
        <BadgeDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={[
          "components/ui/badge.tsx",
          "components/ui/number-flow.tsx",
          "lib/motion.ts",
        ]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="badge/variants"
          title="Variants and appearances"
          description={
            <>
              The default <DocsCode>outline</DocsCode> appearance keeps a
              neutral surface and puts the status color on the dot or icon. Use{" "}
              <DocsCode>{'appearance="solid"'}</DocsCode> when the badge needs
              to stand out, or <DocsCode>{'appearance="muted"'}</DocsCode> for a
              quiet filled chip. <DocsCode>{'shape="pill"'}</DocsCode> rounds it
              fully.
            </>
          }
        >
          <BadgeVariants />
        </DocsExample>
        <DocsExample
          file="badge/sizes"
          title="Sizes"
          description={
            <>
              <DocsCode>sm</DocsCode>, <DocsCode>default</DocsCode> and{" "}
              <DocsCode>lg</DocsCode>. Icons, dots, the close button and counts
              scale with the badge.
            </>
          }
        >
          <BadgeSizes />
        </DocsExample>
        <DocsExample
          file="badge/removable"
          title="Removable"
          description={
            <>
              Add a <DocsCode>{"<BadgeClose />"}</DocsCode> to make a badge
              removable. It shrinks closed and its neighbours slide into the
              gap, then focus moves to the next close button. Remove the item
              from your data in <DocsCode>onOpenChangeComplete</DocsCode> so the
              exit animation can finish first.
            </>
          }
        >
          <BadgeRemovable />
        </DocsExample>
        <DocsExample
          file="badge/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>open</DocsCode> and{" "}
              <DocsCode>onOpenChange</DocsCode> to own the visibility. Setting{" "}
              <DocsCode>open</DocsCode> back to <DocsCode>true</DocsCode> brings
              the badge back with an enter animation.
            </>
          }
        >
          <BadgeControlled />
        </DocsExample>
        <DocsExample
          file="badge/counts"
          title="Counts"
          description={
            <>
              <DocsCode>{"<BadgeCount />"}</DocsCode> rolls only the digits that
              change, and caps at <DocsCode>max</DocsCode> (99 by default) with
              a plus sign. Screen readers always hear the real number.
            </>
          }
        >
          <BadgeCounts />
        </DocsExample>
        <DocsExample
          file="badge/interactive"
          title="Interactive"
          description={
            <>
              Use <DocsCode>render</DocsCode> to make a badge a link or a
              button. It gains a hover tint, a press scale and a focus ring.{" "}
              <DocsCode>aria-invalid</DocsCode> shows the error state.
            </>
          }
        >
          <BadgeInteractive />
        </DocsExample>
        <DocsExample
          file="badge/long-content"
          title="Long content"
          description="A badge never grows wider than its container. Long labels truncate with an ellipsis while icons and the close button stay visible."
        >
          <BadgeLongContent />
        </DocsExample>
        <DocsExample
          file="badge/rtl"
          title="Right to left"
          description="Icons, the close button and the collapse animation follow the reading direction. Counts always read left to right."
        >
          <BadgeRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsParagraph>
          These keys apply to <DocsCode>{"<BadgeClose />"}</DocsCode>.
        </DocsParagraph>
        <DocsKeyboardTable
          keys={[
            { keys: ["Enter", "Space"], description: "Removes the badge." },
            {
              keys: ["Backspace", "Delete"],
              description: "Removes the badge.",
            },
            {
              keys: ["Tab"],
              description:
                "Moves to the next close button. After a removal, focus lands on the next close button, or the previous one when it was the last.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The close button is named after the badge, so a screen reader
            announces “Remove design” rather than a bare “Remove”. Pass{" "}
            <DocsCode>aria-label</DocsCode> to override it.
          </li>
          <li>
            <DocsCode>{"<BadgeDot />"}</DocsCode> is decorative and hidden from
            assistive tech. Keep the status in the text label.
          </li>
          <li>
            <DocsCode>{"<BadgeCount />"}</DocsCode> exposes the exact value even
            when the visible text is capped, like 99+.
          </li>
          <li>
            The removal and count animations are skipped when reduced motion is
            on.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          <DocsCode>{"<Badge />"}</DocsCode> renders a{" "}
          <DocsCode>{"<span>"}</DocsCode> and accepts all of its attributes.
        </DocsParagraph>
        <DocsSection title="Badge" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "success" | "info" | "warning" | "destructive"',
                default: '"default"',
                description:
                  "Colors the dot and icons in outline, or the surface in solid.",
              },
              {
                name: "appearance",
                type: '"outline" | "solid" | "muted"',
                default: '"outline"',
              },
              {
                name: "shape",
                type: '"default" | "pill"',
                default: '"default"',
              },
              {
                name: "size",
                type: '"sm" | "default" | "lg"',
                default: '"default"',
              },
              {
                name: "open",
                type: "boolean",
                description: "Controlled visibility.",
              },
              { name: "defaultOpen", type: "boolean", default: "true" },
              {
                name: "onOpenChange",
                type: "(open: boolean) => void",
                description: "Called when BadgeClose is activated.",
              },
              {
                name: "onOpenChangeComplete",
                type: "(open: boolean) => void",
                description:
                  "Called after the exit animation finishes. Remove the item from your data here.",
              },
              { name: "render", type: renderType, default: "<span>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="badge"',
                description: "Target badges in CSS.",
              },
              { name: "data-variant", description: "The current variant." },
              {
                name: "data-appearance",
                description: "The current appearance.",
              },
              {
                name: "data-shape",
                description: "The current shape.",
              },
              { name: "data-size", description: "The current size." },
              {
                name: "data-ending-style",
                description: "Present while the badge animates out.",
              },
              {
                name: "--badge-accent",
                description:
                  "The status color used by dots and icons. Override it for a custom accent.",
              },
              { name: "--badge-height", description: "The badge height." },
              {
                name: "--badge-radius",
                description:
                  "The corner radius. The close button derives its own radius from it.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="BadgeDot" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "pulse",
                type: "boolean",
                default: "false",
                description:
                  "Adds a ping animation for live states. Off when reduced motion is on.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="badge-dot"',
                description: "Target dots in CSS.",
              },
              { name: "data-pulse", description: "Present when pulse is on." },
            ]}
          />
        </DocsSection>
        <DocsSection title="BadgeClose" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                default: "<IconX />",
              },
              {
                name: "aria-label",
                type: "string",
                description: "Overrides the automatic “Remove {label}” name.",
              },
              {
                name: "onClick",
                type: "(event) => void",
                description:
                  "Call event.preventDefault() to keep the badge open.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="badge-close"',
                description: "Target the close button in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="BadgeCount" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "value",
                type: "number",
                description: "Negative and non-finite values show 0.",
              },
              {
                name: "max",
                type: "number",
                default: "99",
                description:
                  "Values above it show as max+. Pass Infinity for no cap.",
              },
              { name: "duration", type: "number", default: "600" },
              { name: "animated", type: "boolean", default: "true" },
              {
                name: "trend",
                type: '"auto" | "up" | "down" | "shortest"',
                default: '"auto"',
                description: "The direction the digits spin.",
              },
              { name: "locales", type: "Intl.LocalesArgument" },
              { name: "format", type: "Intl.NumberFormatOptions" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="badge-count"',
                description: "Target counts in CSS.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
