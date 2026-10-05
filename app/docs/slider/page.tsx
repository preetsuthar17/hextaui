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
import { SliderControlled } from "@/components/examples/slider/controlled"
import { SliderDemo } from "@/components/examples/slider/demo"
import { SliderDisabled } from "@/components/examples/slider/disabled"
import { SliderIcons } from "@/components/examples/slider/icons"
import { SliderLongLabel } from "@/components/examples/slider/long-label"
import { SliderRange } from "@/components/examples/slider/range"
import { SliderRtl } from "@/components/examples/slider/rtl"
import { SliderSizes } from "@/components/examples/slider/sizes"
import { SliderSteps } from "@/components/examples/slider/steps"
import { SliderValueBubble } from "@/components/examples/slider/value-bubble"
import { SliderVertical } from "@/components/examples/slider/vertical"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("slider")

const importCode = `import { Slider, SliderLabel, SliderValue } from "@/components/ui/slider"`

const usageCode = `<Slider defaultValue={[50]} max={100} step={1} aria-label="Volume" />

<Slider defaultValue={50}>
  <SliderLabel>Volume</SliderLabel>
  <SliderValue />
</Slider>`

const renderType = "ReactElement | (props, state) => ReactElement"

const stateAttributes = [
  { name: "data-orientation", description: "horizontal or vertical." },
  { name: "data-dragging", description: "Present while a pointer is down." },
  { name: "data-disabled", description: "Present when disabled." },
  {
    name: "data-invalid",
    description: "Present when invalid inside a Field.",
  },
]

const compositionCode = `Slider
├── SliderLabel
└── SliderValue`

export default function Page() {
  return (
    <DocsComponentPage slug="slider">
      <DocsExample file="slider/demo">
        <SliderDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "class-variance-authority", "cn"]}
        files={["components/ui/slider.tsx"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          <DocsCode>{"<Slider />"}</DocsCode> draws one thumb per value, so a
          number or a one-item array makes a single slider and two items make a
          range. Children such as <DocsCode>{"<SliderLabel />"}</DocsCode> and{" "}
          <DocsCode>{"<SliderValue />"}</DocsCode> sit on one line above the
          track.
        </DocsParagraph>
        <DocsParagraph>
          While you drag, the thumb follows the pointer exactly. When the value
          jumps, from a press on the track, a key or a new controlled value, the
          thumb and fill glide there in 180ms instead of teleporting.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="slider/sizes"
          title="Sizes"
          description={
            <>
              <DocsCode>sm</DocsCode>, <DocsCode>default</DocsCode> and{" "}
              <DocsCode>lg</DocsCode> scale the thumb and track together.
            </>
          }
        >
          <SliderSizes />
        </DocsExample>
        <DocsExample
          file="slider/range"
          title="Range"
          description={
            <>
              Pass two values for a range. Name each thumb with{" "}
              <DocsCode>getAriaLabel</DocsCode>, and keep them apart with{" "}
              <DocsCode>minStepsBetweenValues</DocsCode>. With{" "}
              <DocsCode>draggableRange</DocsCode>, drag anywhere between the
              thumbs to move both at once; a tap there still moves the nearest
              thumb.
            </>
          }
        >
          <SliderRange />
        </DocsExample>
        <DocsExample
          file="slider/value-bubble"
          title="Value bubble"
          description={
            <>
              <DocsCode>showValue</DocsCode> shows the formatted value above the
              thumb while it is dragged or focused from the keyboard. Use it
              instead of a label row, since the bubble rises into the space
              above the track.
            </>
          }
        >
          <SliderValueBubble />
        </DocsExample>
        <DocsExample
          file="slider/steps"
          title="Steps and format"
          description={
            <>
              <DocsCode>step</DocsCode> snaps the value,{" "}
              <DocsCode>largeStep</DocsCode> sets the Page Up and Shift + arrow
              jump, and <DocsCode>format</DocsCode> formats every number the
              slider shows or announces.
            </>
          }
        >
          <SliderSteps />
        </DocsExample>
        <DocsExample
          file="slider/controlled"
          title="Controlled"
          description={
            <>
              <DocsCode>onValueChange</DocsCode> fires on every move and{" "}
              <DocsCode>onValueCommitted</DocsCode> once on release, which is
              the moment to save. Setting the value from outside glides too.
            </>
          }
        >
          <SliderControlled />
        </DocsExample>
        <DocsExample
          file="slider/vertical"
          title="Vertical"
          description={
            <>
              With <DocsCode>{'orientation="vertical"'}</DocsCode> the slider
              fills its parent&apos;s height, and Up raises the value.
            </>
          }
        >
          <SliderVertical />
        </DocsExample>
        <DocsExample
          file="slider/icons"
          title="With icons"
          description="Place icons beside the slider in a flex row. The slider takes the remaining width."
        >
          <SliderIcons />
        </DocsExample>
        <DocsExample
          file="slider/disabled"
          title="Disabled"
          description="The whole slider dims and ignores pointer and keyboard input."
        >
          <SliderDisabled />
        </DocsExample>
        <DocsExample
          file="slider/long-label"
          title="Long labels"
          description="Long labels wrap, and the value stays on the end."
        >
          <SliderLongLabel />
        </DocsExample>
        <DocsExample
          file="slider/rtl"
          title="Right to left"
          description={
            <>
              Inside a right-to-left parent the fill starts from the right and
              the arrow keys follow it. Pass <DocsCode>locale</DocsCode> for the
              reader&apos;s digits.
            </>
          }
        >
          <SliderRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            { keys: ["Tab"], description: "Moves focus to the next thumb." },
            {
              keys: ["→", "↑"],
              description:
                "Increases the value by one step. → decreases it in right-to-left.",
            },
            {
              keys: ["←", "↓"],
              description:
                "Decreases the value by one step. ← increases it in right-to-left.",
            },
            {
              keys: ["Shift + Arrow", "Page Up", "Page Down"],
              description: "Moves by largeStep.",
            },
            {
              keys: ["Home"],
              description:
                "Sets the minimum, or the previous thumb's value in a range.",
            },
            {
              keys: ["End"],
              description:
                "Sets the maximum, or the next thumb's value in a range.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Each thumb holds a native{" "}
            <DocsCode>{'input type="range"'}</DocsCode>, so it is a{" "}
            <DocsCode>slider</DocsCode> with its own value, min and max.
          </li>
          <li>
            <DocsCode>{"<SliderLabel />"}</DocsCode> names every thumb. Without
            one, <DocsCode>aria-label</DocsCode> on{" "}
            <DocsCode>{"<Slider />"}</DocsCode> is passed to the thumbs, not the
            wrapper, so the slider is never left unnamed. In a range, use{" "}
            <DocsCode>getAriaLabel</DocsCode> to tell the thumbs apart.
          </li>
          <li>
            <DocsCode>{"<SliderValue />"}</DocsCode> and the value bubble are
            not announced on every change; the thumb already reports its value.
          </li>
          <li>
            Pressing a thumb doesn&apos;t show a focus ring; the arrow keys do.
            With reduced motion the thumb jumps instead of gliding.
          </li>
          <li>
            On touch screens the hit area grows to at least 44px without
            changing the layout.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI slider. Every part accepts the props of the
          primitive it wraps.
        </DocsParagraph>
        <DocsSection title="Slider" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "value",
                type: "number | number[]",
                description: "The controlled value. One thumb per item.",
              },
              { name: "defaultValue", type: "number | number[]" },
              {
                name: "onValueChange",
                type: "(value, eventDetails) => void",
                description: "Fires on every change while dragging.",
              },
              {
                name: "onValueCommitted",
                type: "(value, eventDetails) => void",
                description: "Fires once when a change ends.",
              },
              { name: "min", type: "number", default: "0" },
              { name: "max", type: "number", default: "100" },
              { name: "step", type: "number", default: "1" },
              { name: "largeStep", type: "number", default: "10" },
              {
                name: "minStepsBetweenValues",
                type: "number",
                default: "0",
              },
              {
                name: "size",
                type: '"sm" | "default" | "lg"',
                default: '"default"',
              },
              {
                name: "orientation",
                type: '"horizontal" | "vertical"',
                default: '"horizontal"',
              },
              {
                name: "draggableRange",
                type: "boolean",
                default: "false",
                description:
                  "In a range, dragging between the thumbs moves them together, keeping the gap.",
              },
              {
                name: "showValue",
                type: "boolean",
                default: "false",
                description:
                  "Shows the value above the thumb while dragging or keyboard-focused.",
              },
              {
                name: "thumbAlignment",
                type: '"edge" | "center" | "edge-client-only"',
                default: '"edge"',
                description:
                  "edge keeps the thumb inside the track at min and max.",
              },
              {
                name: "thumbCollisionBehavior",
                type: '"push" | "swap" | "none"',
                default: '"push"',
              },
              {
                name: "format",
                type: "Intl.NumberFormatOptions",
              },
              {
                name: "locale",
                type: "Intl.LocalesArgument",
                default: '"en-US"',
              },
              {
                name: "aria-label",
                type: "string",
                description: "Names the thumbs.",
              },
              {
                name: "getAriaLabel",
                type: "(index: number) => string",
                description: "Names each thumb of a range.",
              },
              {
                name: "getAriaValueText",
                type: "(formattedValue: string, value: number, index: number) => string",
              },
              { name: "name", type: "string" },
              { name: "disabled", type: "boolean", default: "false" },
              {
                name: "className",
                type: "string | (state) => string",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              { name: 'data-slot="slider"', description: "The root." },
              { name: "data-size", description: "sm, default or lg." },
              {
                name: "data-jump",
                description:
                  "Present for 220ms while the thumb glides to a new value.",
              },
              {
                name: "data-range-dragging",
                description: "Present while the whole range is being dragged.",
              },
              ...stateAttributes,
              {
                name: "--slider-thumb",
                description: "The thumb's diameter, set by size.",
              },
              {
                name: "--slider-track",
                description: "The track's thickness, set by size.",
              },
              {
                name: 'data-slot="slider-control"',
                description: "The pressable area around the track.",
              },
              {
                name: 'data-slot="slider-track"',
                description: "The track.",
              },
              {
                name: 'data-slot="slider-range"',
                description:
                  "The fill between the start, or the first thumb, and the last thumb.",
              },
              {
                name: 'data-slot="slider-thumb"',
                description: "Each thumb. data-index gives its position.",
              },
              {
                name: "data-active",
                description: "On the thumb that is focused or being dragged.",
              },
              {
                name: 'data-slot="slider-thumb-value"',
                description: "The value bubble from showValue.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SliderLabel" level={3}>
          <DocsParagraph>
            Names the thumbs and grows to fill the row. Renders a{" "}
            <DocsCode>{"<div>"}</DocsCode>.
          </DocsParagraph>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<div>" }]}
          />
          <DocsAttributesTable
            attributes={[
              { name: 'data-slot="slider-label"', description: "The label." },
            ]}
          />
        </DocsSection>
        <DocsSection title="SliderValue" level={3}>
          <DocsParagraph>
            Shows the formatted values, joined with an en dash in a range.
            Renders an <DocsCode>{"<output>"}</DocsCode>.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "(formattedValues: string[], values: number[]) => ReactNode",
                description: "Custom text.",
              },
              { name: "render", type: renderType, default: "<output>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              { name: 'data-slot="slider-value"', description: "The value." },
              ...stateAttributes,
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
