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
import { ToggleControlled } from "@/components/examples/toggle/controlled"
import { ToggleDemo } from "@/components/examples/toggle/demo"
import { ToggleDisabled } from "@/components/examples/toggle/disabled"
import { ToggleFilledIcon } from "@/components/examples/toggle/filled-icon"
import { ToggleOutline } from "@/components/examples/toggle/outline"
import { ToggleRtl } from "@/components/examples/toggle/rtl"
import { TogglePill } from "@/components/examples/toggle/pill"
import { ToggleSizes } from "@/components/examples/toggle/sizes"
import { ToggleText } from "@/components/examples/toggle/text"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("toggle")

const importCode = `import { Toggle } from "@/components/ui/toggle"`

const usageCode = `<Toggle aria-label="Bold">
  <IconBold />
</Toggle>`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="toggle">
      <DocsExample file="toggle/demo">
        <ToggleDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "class-variance-authority", "cn"]}
        files={["components/ui/toggle.tsx"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Hovering an off toggle shows a light tint; turning it on settles a
          stronger fill into place and brings the label to full contrast, so on
          never looks like hover.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="toggle/outline"
          title="Outline"
          description={
            <>
              <DocsCode>{'variant="outline"'}</DocsCode> adds a border and a
              surface, for toggles that sit on their own.
            </>
          }
        >
          <ToggleOutline />
        </DocsExample>
        <DocsExample
          file="toggle/text"
          title="With text"
          description="Icons and labels sit side by side. Toggles with visible text don't need an aria-label."
        >
          <ToggleText />
        </DocsExample>
        <DocsExample
          file="toggle/filled-icon"
          title="Filled when on"
          description={
            <>
              Add <DocsCode>group-data-pressed/toggle:fill-current</DocsCode> to
              an outline icon and it fills in as the toggle turns on.
            </>
          }
        >
          <ToggleFilledIcon />
        </DocsExample>
        <DocsExample
          file="toggle/sizes"
          title="Sizes"
          description={
            <>
              <DocsCode>sm</DocsCode>, <DocsCode>default</DocsCode> and{" "}
              <DocsCode>lg</DocsCode>. Icon-only toggles stay square.
            </>
          }
        >
          <ToggleSizes />
        </DocsExample>
        <DocsExample
          file="toggle/pill"
          title="Pill"
          description={
            <>
              <DocsCode>{'shape="pill"'}</DocsCode> rounds the ends fully, for
              toggles inside rounded surfaces like a chat composer.
            </>
          }
        >
          <TogglePill />
        </DocsExample>
        <DocsExample
          file="toggle/disabled"
          title="Disabled"
          description="A disabled toggle keeps showing whether it's on, but can't be pressed or focused."
        >
          <ToggleDisabled />
        </DocsExample>
        <DocsExample
          file="toggle/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>pressed</DocsCode> and{" "}
              <DocsCode>onPressedChange</DocsCode>. The label stays the same
              while the icon follows the state.
            </>
          }
        >
          <ToggleControlled />
        </DocsExample>
        <DocsExample
          file="toggle/rtl"
          title="Right to left"
          description="Icons lead the label from the right."
        >
          <ToggleRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Space", "Enter"],
              description: "Turns the focused toggle on or off.",
            },
            {
              keys: ["Tab"],
              description: "Moves focus to the next toggle.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The toggle is a <DocsCode>button</DocsCode> with{" "}
            <DocsCode>aria-pressed</DocsCode>, so screen readers announce
            whether it&apos;s on.
          </li>
          <li>
            Give icon-only toggles an <DocsCode>aria-label</DocsCode> that names
            the action (&quot;Mute microphone&quot;) and keep it the same in
            both states. Changing it as well as the pressed state reads as a
            double negative.
          </li>
          <li>
            On touch screens the hit area grows to at least 44px, except inside
            a toggle group where neighbours would overlap.
          </li>
          <li>With reduced motion, nothing scales; the fill only fades.</li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="Toggle" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "outline"',
                default: '"default"',
              },
              {
                name: "size",
                type: '"default" | "sm" | "lg"',
                default: '"default"',
              },
              {
                name: "shape",
                type: '"default" | "pill"',
                default: '"default"',
              },
              { name: "pressed", type: "boolean" },
              { name: "defaultPressed", type: "boolean", default: "false" },
              {
                name: "onPressedChange",
                type: "(pressed, details) => void",
              },
              { name: "disabled", type: "boolean", default: "false" },
              {
                name: "value",
                type: "string",
                description: "Identifies the toggle inside a toggle group.",
              },
              {
                name: "className",
                type: "string | (state) => string",
              },
              { name: "nativeButton", type: "boolean", default: "true" },
              { name: "render", type: renderType, default: "<button>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="toggle"',
                description: "The button, with data-variant and data-size.",
              },
              {
                name: "data-pressed",
                description: "Present when the toggle is on.",
              },
              {
                name: "data-disabled",
                description: "Present when the toggle is disabled.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
