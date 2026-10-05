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
import { ButtonGroupDemo } from "@/components/examples/button-group/demo"
import { ButtonGroupDisabled } from "@/components/examples/button-group/disabled"
import { ButtonGroupFeedback } from "@/components/examples/button-group/feedback"
import { ButtonGroupFieldset } from "@/components/examples/button-group/fieldset"
import { ButtonGroupFullWidth } from "@/components/examples/button-group/full-width"
import { ButtonGroupInput } from "@/components/examples/button-group/input"
import { ButtonGroupNested } from "@/components/examples/button-group/nested"
import { ButtonGroupPlayer } from "@/components/examples/button-group/player"
import { ButtonGroupRtl } from "@/components/examples/button-group/rtl"
import { ButtonGroupSizes } from "@/components/examples/button-group/sizes"
import { ButtonGroupSplit } from "@/components/examples/button-group/split"
import { ButtonGroupVertical } from "@/components/examples/button-group/vertical"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("button-group")

const importCode = `import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"`

const usageCode = `<ButtonGroup aria-label="Text formatting">
  <Button variant="outline">Bold</Button>
  <Button variant="outline">Italic</Button>
  <Button variant="outline">Underline</Button>
</ButtonGroup>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `ButtonGroup
├── Button
├── ButtonGroupSeparator
├── ButtonGroupText
└── ButtonGroup`

export default function Page() {
  return (
    <DocsComponentPage slug="button-group">
      <DocsExample file="button-group/demo">
        <ButtonGroupDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "class-variance-authority", "cn"]}
        files={[
          "components/ui/button-group.tsx",
          "components/ui/separator.tsx",
        ]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Button group joins the buttons you already use. Install{" "}
          <DocsCode>{"<Button />"}</DocsCode> as well.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="button-group/sizes"
          title="Sizes"
          description={
            <>
              Set <DocsCode>size</DocsCode> on each button. Joined corners stay
              square at every size, and the outer corners keep the button’s
              radius.
            </>
          }
        >
          <ButtonGroupSizes />
        </DocsExample>
        <DocsExample
          file="button-group/split"
          title="Split button"
          description={
            <>
              Filled buttons sit flush, so add a{" "}
              <DocsCode>{"<ButtonGroupSeparator />"}</DocsCode> between them. A
              dropdown trigger can be any segment.
            </>
          }
        >
          <ButtonGroupSplit />
        </DocsExample>
        <DocsExample
          file="button-group/player"
          title="Separators"
          description="Separators between icon buttons, with a toggle that reports its pressed state."
        >
          <ButtonGroupPlayer />
        </DocsExample>
        <DocsExample
          file="button-group/feedback"
          title="Feedback inside a group"
          description="When a button’s label changes width during loading, success or error, the segments after it slide along instead of jumping."
        >
          <ButtonGroupFeedback />
        </DocsExample>
        <DocsExample
          file="button-group/vertical"
          title="Vertical"
          description={
            <>
              <DocsCode>{'orientation="vertical"'}</DocsCode> stacks the
              segments. Separators turn horizontal automatically.
            </>
          }
        >
          <ButtonGroupVertical />
        </DocsExample>
        <DocsExample
          file="button-group/nested"
          title="Nested groups"
          description="Groups inside a group become separate clusters with a gap between them, each joined on its own."
        >
          <ButtonGroupNested />
        </DocsExample>
        <DocsExample
          file="button-group/input"
          title="With text and an input"
          description={
            <>
              <DocsCode>{"<ButtonGroupText />"}</DocsCode> adds a label or
              prefix. Render it as a <DocsCode>{"<label>"}</DocsCode> to name
              the input. The input stretches to fill the row.
            </>
          }
        >
          <ButtonGroupInput />
        </DocsExample>
        <DocsExample
          file="button-group/disabled"
          title="Disabled and invalid"
          description={
            <>
              Disable or mark a single segment with{" "}
              <DocsCode>aria-invalid</DocsCode>. An invalid segment rises above
              its neighbours so its red ring is never covered.
            </>
          }
        >
          <ButtonGroupDisabled />
        </DocsExample>
        <DocsExample
          file="button-group/full-width"
          title="Full width"
          description={
            <>
              Give the group a width and each button <DocsCode>flex-1</DocsCode>{" "}
              to split the space evenly.
            </>
          }
        >
          <ButtonGroupFullWidth />
        </DocsExample>
        <DocsExample
          file="button-group/fieldset"
          title="As a fieldset"
          description={
            <>
              Use <DocsCode>render</DocsCode> to output a{" "}
              <DocsCode>{"<fieldset>"}</DocsCode> inside forms.
            </>
          }
        >
          <ButtonGroupFieldset />
        </DocsExample>
        <DocsExample
          file="button-group/rtl"
          title="Right to left"
          description="Joined corners, separators and nested clusters mirror in right-to-left layouts."
        >
          <ButtonGroupRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Moves through the segments in order. The focused segment rises so its ring and border are never covered.",
            },
            {
              keys: ["Enter", "Space"],
              description: "Activates the focused button.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The group has <DocsCode>{'role="group"'}</DocsCode>. Give it an{" "}
            <DocsCode>aria-label</DocsCode> that describes the set, like
            “Message actions”.
          </li>
          <li>
            Icon-only segments need their own <DocsCode>aria-label</DocsCode>.
          </li>
          <li>
            Separators are exposed as separators with the right orientation. Add{" "}
            <DocsCode>decorative</DocsCode> when the line is only visual.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Every part renders a <DocsCode>{"<div>"}</DocsCode> and accepts its
          attributes.
        </DocsParagraph>
        <DocsSection title="ButtonGroup" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "orientation",
                type: '"horizontal" | "vertical"',
                default: '"horizontal"',
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="button-group"',
                description: "Target groups in CSS.",
              },
              {
                name: "data-orientation",
                description: "The current orientation.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ButtonGroupSeparator" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "orientation",
                type: '"horizontal" | "vertical"',
                description:
                  "Defaults to the opposite of the group’s orientation.",
              },
              {
                name: "decorative",
                type: "boolean",
                default: "false",
                description: "Hide the line from screen readers.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="button-group-separator"',
                description: "Target separators in CSS.",
              },
              {
                name: "data-orientation",
                description: "The resolved orientation.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ButtonGroupText" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "render",
                type: renderType,
                default: "<div>",
                description: "Render a <label> to name an input in the group.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="button-group-text"',
                description: "Target text segments in CSS.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
