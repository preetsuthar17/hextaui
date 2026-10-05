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
import { NumberFlowChangedDigits } from "@/components/examples/number-flow/changed-digits"
import { NumberFlowDemo } from "@/components/examples/number-flow/demo"
import { NumberFlowEvents } from "@/components/examples/number-flow/events"
import { NumberFlowFormats } from "@/components/examples/number-flow/formats"
import { NumberFlowInline } from "@/components/examples/number-flow/inline"
import { NumberFlowRtl } from "@/components/examples/number-flow/rtl"
import { NumberFlowTiming } from "@/components/examples/number-flow/timing"
import { NumberFlowTrendDemo } from "@/components/examples/number-flow/trend"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("number-flow")

const importCode = `import { NumberFlow } from "@/components/ui/number-flow"`

const usageCode = `<NumberFlow
  value={1234.5}
  format={{ style: "currency", currency: "USD" }}
/>`

export default function Page() {
  return (
    <DocsComponentPage slug="number-flow">
      <DocsExample file="number-flow/demo">
        <NumberFlowDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["cn"]}
        files={["components/ui/number-flow.tsx", "lib/motion.ts"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="number-flow/changed-digits"
          title="Only changed digits move"
          description="Each digit is its own column. Going from 22 to 23 spins only the ones digit; the tens digit stays still. Digits that appear or disappear, like the third digit in 99 → 100, slide their width in or out."
        >
          <NumberFlowChangedDigits />
        </DocsExample>
        <DocsExample
          file="number-flow/trend"
          title="Trend"
          description={
            <>
              <DocsCode>trend</DocsCode> sets which way digits spin.{" "}
              <DocsCode>auto</DocsCode> spins up when the value grows and down
              when it shrinks, <DocsCode>up</DocsCode> and{" "}
              <DocsCode>down</DocsCode> force a direction, and{" "}
              <DocsCode>shortest</DocsCode> takes the nearest way round the
              wheel.
            </>
          }
        >
          <NumberFlowTrendDemo />
        </DocsExample>
        <DocsExample
          file="number-flow/formats"
          title="Formats"
          description={
            <>
              <DocsCode>format</DocsCode> and <DocsCode>locales</DocsCode> take
              any <DocsCode>Intl.NumberFormat</DocsCode> options. Currency
              symbols, separators and signs stay still while the digits move,
              and non-Latin numerals spin in their own script.
            </>
          }
        >
          <NumberFlowFormats />
        </DocsExample>
        <DocsExample
          file="number-flow/timing"
          title="Timing"
          description={
            <>
              Tune the motion with <DocsCode>duration</DocsCode> and{" "}
              <DocsCode>easing</DocsCode>, or turn it off with{" "}
              <DocsCode>{"animated={false}"}</DocsCode>. Reduced motion settings
              turn it off automatically.
            </>
          }
        >
          <NumberFlowTiming />
        </DocsExample>
        <DocsExample
          file="number-flow/events"
          title="Interruptions and events"
          description={
            <>
              A new value mid-spin continues from where each digit is, so rapid
              updates never jump. <DocsCode>onAnimationsStart</DocsCode> and{" "}
              <DocsCode>onAnimationsFinish</DocsCode> fire once per batch of
              digits.
            </>
          }
        >
          <NumberFlowEvents />
        </DocsExample>
        <DocsExample
          file="number-flow/inline"
          title="Inline and in badges"
          description={
            <>
              It renders an inline <DocsCode>{"<span>"}</DocsCode> that sits on
              the text baseline, and tabular digits keep its width steady while
              digits spin. <DocsCode>BadgeCount</DocsCode> uses it for counts
              that cap at a maximum.
            </>
          }
        >
          <NumberFlowInline />
        </DocsExample>
        <DocsExample
          file="number-flow/rtl"
          title="Right to left"
          description="Numbers always read left to right, even inside a right-to-left layout, matching how browsers render them."
        >
          <NumberFlowRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Screen readers read the real formatted number. The spinning columns
            are hidden from assistive tech, and characters that are leaving are
            hidden while they animate out.
          </li>
          <li>
            It is not a live region. Wrap it in an element with{" "}
            <DocsCode>aria-live=&quot;polite&quot;</DocsCode> when changes
            should be announced.
          </li>
          <li>
            With reduced motion enabled, values update instantly with no spin.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Accepts every <DocsCode>{"<span>"}</DocsCode> attribute except{" "}
          <DocsCode>children</DocsCode> and <DocsCode>prefix</DocsCode>.
        </DocsParagraph>
        <DocsSection title="NumberFlow" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "number", description: "Required." },
              {
                name: "locales",
                type: "Intl.LocalesArgument",
                default: '"en-US"',
              },
              {
                name: "format",
                type: "Intl.NumberFormatOptions",
                description: "Passed to Intl.NumberFormat.",
              },
              {
                name: "prefix",
                type: "string",
                description: "Static text before the number.",
              },
              {
                name: "suffix",
                type: "string",
                description: "Static text after the number.",
              },
              {
                name: "trend",
                type: '"auto" | "up" | "down" | "shortest"',
                default: '"auto"',
              },
              {
                name: "duration",
                type: "number",
                default: "600",
                description: "Spin duration in milliseconds.",
              },
              {
                name: "easing",
                type: "string",
                default: "easeSpring",
                description: "Any CSS easing value.",
              },
              { name: "animated", type: "boolean", default: "true" },
              {
                name: "onAnimationsStart",
                type: "() => void",
                description: "Called when a batch of digits starts moving.",
              },
              {
                name: "onAnimationsFinish",
                type: "() => void",
                description:
                  "Called when the latest batch settles. Skipped if a newer value interrupts it.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="number-flow"',
                description: "The root span.",
              },
              {
                name: 'data-slot="number-flow-digit"',
                description: "Each digit cell.",
              },
              {
                name: 'data-slot="number-flow-symbol"',
                description: "Separators, signs, symbols, prefix and suffix.",
              },
              {
                name: 'data-slot="number-flow-column"',
                description: "The spinning column inside a digit cell.",
              },
              {
                name: "data-digit",
                description: "The digit a column is resting on, 0–9.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
