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
import { SwitchAsync } from "@/components/examples/switch/async"
import { SwitchControlled } from "@/components/examples/switch/controlled"
import { SwitchDemo } from "@/components/examples/switch/demo"
import { SwitchField } from "@/components/examples/switch/field"
import { SwitchIcons } from "@/components/examples/switch/icons"
import { SwitchIos } from "@/components/examples/switch/ios"
import { SwitchRtl } from "@/components/examples/switch/rtl"
import { SwitchSizes } from "@/components/examples/switch/sizes"
import { SwitchStates } from "@/components/examples/switch/states"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("switch")

const importCode = `import { Switch } from "@/components/ui/switch"`

const usageCode = `<label className="flex items-center gap-3">
  <Switch defaultChecked />
  Wi-Fi
</label>`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="switch">
      <DocsExample file="switch/demo">
        <SwitchDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={[
          "components/ui/switch.tsx",
          "components/ui/spinner.tsx",
          "lib/motion.ts",
        ]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Press and the thumb stretches toward the other side before springing
          across, so you feel the press land. You can also grab the thumb and
          drag it: past the middle it flips, short of it it snaps back.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="switch/ios"
          title="iOS"
          description={
            <>
              <DocsCode>{'variant="ios"'}</DocsCode> uses a taller track, a
              capsule thumb and green when on. Press, drag and saving work the
              same.
            </>
          }
        >
          <SwitchIos />
        </DocsExample>
        <DocsExample
          file="switch/async"
          title="Saving"
          description={
            <>
              Return a promise from <DocsCode>onCheckedChange</DocsCode> and the
              switch flips right away with a spinner in the thumb. If it
              rejects, the switch flips back and shakes.
            </>
          }
        >
          <SwitchAsync />
        </DocsExample>
        <DocsExample
          file="switch/icons"
          title="On and off marks"
          description={
            <>
              <DocsCode>icons</DocsCode> adds a check and a ring to the track,
              so the state doesn&apos;t rely on color.
            </>
          }
        >
          <SwitchIcons />
        </DocsExample>
        <DocsExample
          file="switch/sizes"
          title="Sizes"
          description={
            <>
              <DocsCode>sm</DocsCode>, <DocsCode>default</DocsCode> and{" "}
              <DocsCode>lg</DocsCode>.
            </>
          }
        >
          <SwitchSizes />
        </DocsExample>
        <DocsExample
          file="switch/field"
          title="In a field"
          description={
            <>
              With <DocsCode>Field</DocsCode>, the label and description are
              linked to the switch.
            </>
          }
        >
          <SwitchField />
        </DocsExample>
        <DocsExample
          file="switch/states"
          title="Disabled and read-only"
          description={
            <>
              <DocsCode>readOnly</DocsCode> keeps the value visible and
              focusable but won&apos;t change it.
            </>
          }
        >
          <SwitchStates />
        </DocsExample>
        <DocsExample
          file="switch/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>checked</DocsCode> and{" "}
              <DocsCode>onCheckedChange</DocsCode>.
            </>
          }
        >
          <SwitchControlled />
        </DocsExample>
        <DocsExample
          file="switch/rtl"
          title="Right to left"
          description="The thumb starts on the right and slides left, and dragging follows."
        >
          <SwitchRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Space", "Enter"],
              description: "Turns the focused switch on or off.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The switch is a <DocsCode>switch</DocsCode> role named by its label.
            Wrap it in a <DocsCode>{"<label>"}</DocsCode> or use{" "}
            <DocsCode>Field</DocsCode>.
          </li>
          <li>
            While saving, it&apos;s <DocsCode>aria-busy</DocsCode> and ignores
            new presses.
          </li>
          <li>
            The hit area is larger than the switch, and larger again on touch.
          </li>
          <li>
            With reduced motion, the thumb moves instantly and nothing shakes.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="Switch" level={3}>
          <DocsPropsTable
            props={[
              { name: "checked", type: "boolean" },
              { name: "defaultChecked", type: "boolean", default: "false" },
              {
                name: "onCheckedChange",
                type: "(checked, details) => void | Promise",
                description:
                  "Return a promise to show the saving state. On rejection an uncontrolled switch flips back.",
              },
              {
                name: "variant",
                type: '"default" | "ios"',
                default: '"default"',
              },
              {
                name: "size",
                type: '"sm" | "default" | "lg"',
                default: '"default"',
              },
              {
                name: "icons",
                type: "boolean",
                default: "false",
                description: "Show on and off marks in the track.",
              },
              { name: "name", type: "string" },
              { name: "value", type: "string" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "readOnly", type: "boolean", default: "false" },
              { name: "required", type: "boolean", default: "false" },
              { name: "render", type: renderType, default: "<span>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="switch"',
                description: "The track, with data-size and data-variant.",
              },
              {
                name: 'data-slot="switch-thumb"',
                description: "The thumb.",
              },
              {
                name: "data-checked / data-unchecked",
                description: "Whether the switch is on.",
              },
              {
                name: "data-dragging",
                description: "Present while the thumb is being dragged.",
              },
              {
                name: "data-pending",
                description: "Present while a returned promise is pending.",
              },
              {
                name: "--switch-w / --switch-h / --switch-thumb / --switch-thumb-w",
                description: "Track and thumb sizes, set by size.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
