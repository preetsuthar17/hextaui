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
import { InputGroupBlockStart } from "@/components/examples/input-group/block-start"
import { InputGroupButtonDemo } from "@/components/examples/input-group/button"
import { InputGroupClearDemo } from "@/components/examples/input-group/clear"
import { InputGroupCountDemo } from "@/components/examples/input-group/count"
import { InputGroupDemo } from "@/components/examples/input-group/demo"
import { InputGroupDisabled } from "@/components/examples/input-group/disabled"
import { InputGroupDropdown } from "@/components/examples/input-group/dropdown"
import { InputGroupIcon } from "@/components/examples/input-group/icon"
import { InputGroupInvalid } from "@/components/examples/input-group/invalid"
import { InputGroupKbd } from "@/components/examples/input-group/kbd"
import { InputGroupLoading } from "@/components/examples/input-group/loading"
import { InputGroupLongContent } from "@/components/examples/input-group/long-content"
import { InputGroupPassword } from "@/components/examples/input-group/password"
import { InputGroupRtl } from "@/components/examples/input-group/rtl"
import { InputGroupSizes } from "@/components/examples/input-group/sizes"
import { InputGroupTextDemo } from "@/components/examples/input-group/text"
import { InputGroupTextareaDemo } from "@/components/examples/input-group/textarea"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("input-group")

const importCode = `import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupClear,
  InputGroupCount,
  InputGroupInput,
  InputGroupPasswordToggle,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"`

const usageCode = `<InputGroup>
  <InputGroupInput placeholder="Search…" aria-label="Search" />
  <InputGroupAddon>
    <IconSearch />
  </InputGroupAddon>
  <InputGroupAddon align="inline-end">
    <InputGroupClear />
  </InputGroupAddon>
</InputGroup>`

const controlAttributes = [
  {
    name: 'data-slot="input-group-control"',
    description:
      "Marks the field. The group reads its focus, invalid, disabled and read-only states from it.",
  },
  {
    name: "data-invalid",
    description: "Present when a surrounding Field marks the value invalid.",
  },
  { name: "data-disabled", description: "Present when the field is disabled." },
  { name: "data-focused", description: "Present while the field has focus." },
  { name: "data-filled", description: "Present when the field has a value." },
  {
    name: "data-dirty",
    description: "Present once the value differs from the initial one.",
  },
  {
    name: "data-touched",
    description: "Present once the field has been focused and left.",
  },
]

const compositionCode = `InputGroup
├── InputGroupAddon
│   ├── InputGroupText
│   ├── InputGroupButton
│   ├── InputGroupClear
│   ├── InputGroupCount
│   └── InputGroupPasswordToggle
└── InputGroupInput / InputGroupTextarea`

export default function Page() {
  return (
    <DocsComponentPage slug="input-group">
      <DocsExample file="input-group/demo">
        <InputGroupDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={[
          "components/ui/input-group.tsx",
          "components/ui/input.tsx",
          "components/ui/button.tsx",
          "components/ui/number-flow.tsx",
          "lib/motion.ts",
        ]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Put <DocsCode>{"<InputGroupInput />"}</DocsCode> or{" "}
          <DocsCode>{"<InputGroupTextarea />"}</DocsCode> first and the addons
          after it. Addons place themselves with <DocsCode>align</DocsCode>, so
          the field comes first in the tab order and for screen readers.
        </DocsParagraph>
        <DocsParagraph>
          The group tracks its field, so the smart parts need no wiring.{" "}
          <DocsCode>{"<InputGroupClear />"}</DocsCode>,{" "}
          <DocsCode>{"<InputGroupPasswordToggle />"}</DocsCode> and{" "}
          <DocsCode>{"<InputGroupCount />"}</DocsCode> read the value,{" "}
          <DocsCode>type</DocsCode> and <DocsCode>maxLength</DocsCode> from the
          field, whether it&apos;s controlled or not.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="input-group/icon"
          title="Icon"
          description="Icons sit inside the border on either side. Clicking an icon focuses the input, so the whole group feels like one field."
        >
          <InputGroupIcon />
        </DocsExample>
        <DocsExample
          file="input-group/clear"
          title="Clear"
          description={
            <>
              <DocsCode>{"<InputGroupClear />"}</DocsCode> fades in once
              there&apos;s a value. It clears through the browser&apos;s edit
              history, so Cmd+Z brings the text back, and it fires your{" "}
              <DocsCode>onChange</DocsCode>. Escape clears too. A second Escape
              is left for the dialog or popover around it.
            </>
          }
        >
          <InputGroupClearDemo />
        </DocsExample>
        <DocsExample
          file="input-group/count"
          title="Character count"
          description={
            <>
              <DocsCode>{"<InputGroupCount />"}</DocsCode> counts against the
              field&apos;s <DocsCode>maxLength</DocsCode>. Only the digits that
              change roll. The count darkens near the limit and turns red at it,
              and a typed key past the limit nudges it. Screen readers hear a
              message when the field gets close to the limit and when it reaches
              it, never on every key.
            </>
          }
        >
          <InputGroupCountDemo />
        </DocsExample>
        <DocsExample
          file="input-group/text"
          title="Text"
          description={
            <>
              Use <DocsCode>{"<InputGroupText />"}</DocsCode> for units,
              currencies and URL parts. The input&apos;s padding shrinks next to
              an addon so the text reads as one value.
            </>
          }
        >
          <InputGroupTextDemo />
        </DocsExample>
        <DocsExample
          file="input-group/button"
          title="Button"
          description={
            <>
              <DocsCode>{"<InputGroupButton />"}</DocsCode> is a ghost button
              sized to fit inside the field. Its corners are concentric with the
              group&apos;s, and it gets its own focus ring.
            </>
          }
        >
          <InputGroupButtonDemo />
        </DocsExample>
        <DocsExample
          file="input-group/kbd"
          title="Keyboard hint"
          description={
            <>
              A plain <DocsCode>{"<kbd>"}</DocsCode> inside an addon is styled
              as a key cap. It&apos;s a visual hint only, so bind the shortcut
              yourself.
            </>
          }
        >
          <InputGroupKbd />
        </DocsExample>
        <DocsExample
          file="input-group/textarea"
          title="Textarea"
          description={
            <>
              <DocsCode>{"<InputGroupTextarea />"}</DocsCode> grows with its
              content up to 16rem, then scrolls. The height eases between lines
              instead of jumping. A <DocsCode>block-end</DocsCode> addon becomes
              a toolbar under it, and buttons at its edges get the same inset as
              the corner they sit in.
            </>
          }
        >
          <InputGroupTextareaDemo />
        </DocsExample>
        <DocsExample
          file="input-group/block-start"
          title="Header"
          description={
            <>
              A <DocsCode>block-start</DocsCode> addon sits above the field. Add{" "}
              <DocsCode>separator</DocsCode> to draw a hairline between them.
            </>
          }
        >
          <InputGroupBlockStart />
        </DocsExample>
        <DocsExample
          file="input-group/password"
          title="Password"
          description={
            <>
              <DocsCode>{"<InputGroupPasswordToggle />"}</DocsCode> switches a{" "}
              <DocsCode>{'type="password"'}</DocsCode> field to text and back.
              The caret and selection stay where they were, a mouse click keeps
              focus in the field, and the password is hidden again when the form
              submits. Control it with <DocsCode>revealed</DocsCode>.
            </>
          }
        >
          <InputGroupPassword />
        </DocsExample>
        <DocsExample
          file="input-group/sizes"
          title="Sizes"
          description={
            <>
              <DocsCode>size</DocsCode> on the group sets the height and passes
              down to the input, matching <DocsCode>{"<Input />"}</DocsCode>{" "}
              sizes. Buttons keep concentric corners at every size.
            </>
          }
        >
          <InputGroupSizes />
        </DocsExample>
        <DocsExample
          file="input-group/invalid"
          title="Invalid"
          description={
            <>
              Set <DocsCode>aria-invalid</DocsCode> on the input and the whole
              group turns red, including its focus ring. Link the message with{" "}
              <DocsCode>aria-describedby</DocsCode>.
            </>
          }
        >
          <InputGroupInvalid />
        </DocsExample>
        <DocsExample
          file="input-group/disabled"
          title="Disabled"
          description="A disabled input dims the whole group and shows a not-allowed cursor over it. Disable addon buttons too, since they stay usable otherwise."
        >
          <InputGroupDisabled />
        </DocsExample>
        <DocsExample
          file="input-group/loading"
          title="Loading"
          description={
            <>
              Inline addons ease to their new width when their content changes,
              so the field never jumps as a spinner turns into a result count.
              The spinner only turns when motion is allowed, and{" "}
              <DocsCode>{'role="status"'}</DocsCode> announces the text.
            </>
          }
        >
          <InputGroupLoading />
        </DocsExample>
        <DocsExample
          file="input-group/dropdown"
          title="Dropdown"
          description={
            <>
              Render an <DocsCode>{"<InputGroupButton />"}</DocsCode> as a
              dropdown trigger to scope the input.
            </>
          }
        >
          <InputGroupDropdown />
        </DocsExample>
        <DocsExample
          file="input-group/long-content"
          title="Long content"
          description="Long values scroll inside the input instead of stretching the group. Wrap long addon text in a truncating span with a max width."
        >
          <InputGroupLongContent />
        </DocsExample>
        <DocsExample
          file="input-group/rtl"
          title="Right to left"
          description="Addons, padding and corner radii use logical sides, so inline-start lands on the right."
        >
          <InputGroupRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Moves from the field to each addon button, in source order.",
            },
            {
              keys: ["Shift", "Tab"],
              description: "Moves back through the buttons and the field.",
            },
            {
              keys: ["Escape"],
              description:
                "With an InputGroupClear, clears the field. When it's already empty, Escape passes through.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Every field needs a name. Use a visible label, a Field, or{" "}
            <DocsCode>aria-label</DocsCode>. Icons and addon text aren&apos;t
            part of the field&apos;s name.
          </li>
          <li>
            Give icon-only buttons an <DocsCode>aria-label</DocsCode>.
          </li>
          <li>
            When addon text carries meaning, like a currency or a domain, add it
            to the label or reference it with{" "}
            <DocsCode>aria-describedby</DocsCode>.
          </li>
          <li>
            <DocsCode>{"<InputGroupClear />"}</DocsCode> is skipped in the tab
            order because Escape does the same thing. The password toggle stays
            tabbable and keeps the same name, with{" "}
            <DocsCode>aria-pressed</DocsCode> reporting its state.
          </li>
          <li>
            When a submit finds the field invalid, the group shakes once. With
            reduced motion the red border is the only cue.
          </li>
          <li>
            On touch screens the field text is at least 16px so phones
            don&apos;t zoom in when it&apos;s focused.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          <DocsCode>{"<InputGroupInput />"}</DocsCode> and{" "}
          <DocsCode>{"<InputGroupTextarea />"}</DocsCode> accept the props of
          the elements they render. The other parts accept their element&apos;s
          attributes.
        </DocsParagraph>
        <DocsSection title="InputGroup" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "size",
                type: '"sm" | "default" | "lg"',
                default: '"default"',
                description: "Height of the group, passed down to the input.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="input-group"',
                description: 'Target the group in CSS. Renders role="group".',
              },
              { name: "data-size", description: "The current size." },
              {
                name: "data-filled",
                description: "Present while the field has a value.",
              },
              {
                name: "data-shake",
                description:
                  "Present while the group shakes after a failed submit.",
              },
              {
                name: "data-disabled",
                description:
                  "Set it yourself to dim the group when only the addons are disabled.",
              },
              {
                name: "--input-group-radius",
                description:
                  "Corner radius of the group. Buttons and key caps derive their radius from it.",
              },
              {
                name: "--input-group-height",
                description: "Height of the group for the current size.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="InputGroupInput" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "size",
                type: '"sm" | "default" | "lg"',
                description: "Inherited from the group.",
              },
              { name: "aria-invalid", type: "boolean" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "readOnly", type: "boolean", default: "false" },
            ]}
          />
          <DocsAttributesTable attributes={controlAttributes} />
        </DocsSection>
        <DocsSection title="InputGroupTextarea" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "autoResize",
                type: "boolean",
                default: "true",
                description:
                  "Grow with the content up to 16rem, easing between heights.",
              },
              {
                name: "shake",
                type: "boolean",
                default: "true",
                description: "Shake the group when a submit finds it invalid.",
              },
              { name: "rows", type: "number" },
              { name: "aria-invalid", type: "boolean" },
              { name: "disabled", type: "boolean", default: "false" },
            ]}
          />
          <DocsAttributesTable attributes={controlAttributes} />
        </DocsSection>
        <DocsSection title="InputGroupAddon" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "align",
                type: '"inline-start" | "inline-end" | "block-start" | "block-end"',
                default: '"inline-start"',
              },
              {
                name: "separator",
                type: "boolean",
                default: "false",
                description:
                  "Draw a hairline between a block addon and the field.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="input-group-addon"',
                description: "Target addons in CSS.",
              },
              { name: "data-align", description: "The current alignment." },
              {
                name: "data-separator",
                description: "Present when separator is set.",
              },
              {
                name: "--input-group-addon-inset",
                description:
                  "Space between the group's edge and a button or key cap inside it.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="InputGroupButton" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"',
                default: '"ghost"',
              },
              {
                name: "size",
                type: '"xs" | "sm" | "icon-xs" | "icon-sm"',
                default: '"xs"',
              },
              { name: "type", type: "string", default: '"button"' },
              {
                name: "feedback",
                type: "boolean",
                default: "false",
                description:
                  "Every Button prop works, including the loading and success flow.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="input-group-button"',
                description: "Target addon buttons in CSS.",
              },
              { name: "data-size", description: "The current size." },
            ]}
          />
        </DocsSection>
        <DocsSection title="InputGroupClear" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "onClear",
                type: "() => void",
                description: "Called after the field is cleared.",
              },
              {
                name: "aria-label",
                type: "string",
                default: '"Clear"',
              },
              {
                name: "children",
                type: "ReactNode",
                default: "<IconX />",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="input-group-clear"',
                description: "Target the clear button in CSS.",
              },
              {
                name: "data-visible",
                description:
                  "Present while the field has a value and is editable.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="InputGroupPasswordToggle" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "revealed",
                type: "boolean",
                description:
                  "Controlled state. Leave unset to let it manage itself.",
              },
              {
                name: "onRevealedChange",
                type: "(revealed: boolean) => void",
              },
              {
                name: "aria-label",
                type: "string",
                default: '"Show password"',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="input-group-password-toggle"',
                description: "Target the toggle in CSS.",
              },
              {
                name: "data-revealed",
                description: "Present while the password is shown.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="InputGroupCount" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "threshold",
                type: "number",
                default: "10% of maxLength, at most 20",
                description:
                  "Characters left when the count starts to stand out.",
              },
              {
                name: "announcement",
                type: "(remaining: number) => string",
                description:
                  "Message for screen readers when the count crosses the threshold or hits the limit.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="input-group-count"',
                description: "Target the count in CSS.",
              },
              {
                name: 'data-state="near" | "limit"',
                description:
                  "Present within the threshold, and when no characters are left.",
              },
              {
                name: "data-bump",
                description:
                  "Present briefly when a key is pressed at the limit.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="InputGroupText" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="input-group-text"',
                description: "Target addon text in CSS.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
