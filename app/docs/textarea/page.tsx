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
import { TextareaCounter } from "@/components/examples/textarea/counter"
import { TextareaDemo } from "@/components/examples/textarea/demo"
import { TextareaFixed } from "@/components/examples/textarea/fixed"
import { TextareaRows } from "@/components/examples/textarea/rows"
import { TextareaRtl } from "@/components/examples/textarea/rtl"
import { TextareaStates } from "@/components/examples/textarea/states"
import { TextareaSubmit } from "@/components/examples/textarea/submit"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("textarea")

const importCode = `import { Textarea } from "@/components/ui/textarea"`

const usageCode = `<Textarea placeholder="Write something…" />`

export default function Page() {
  return (
    <DocsComponentPage slug="textarea">
      <DocsExample file="textarea/demo">
        <TextareaDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "class-variance-authority", "cn"]}
        files={[
          "components/ui/textarea.tsx",
          "components/ui/input.tsx",
          "components/ui/number-flow.tsx",
          "lib/motion.ts",
        ]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          The box grows with your text, easing to each new line instead of
          jumping, from <DocsCode>minRows</DocsCode> up to{" "}
          <DocsCode>maxRows</DocsCode>, then scrolls. Typing is never delayed by
          the animation.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="textarea/submit"
          title="Send with a shortcut"
          description={
            <>
              <DocsCode>submitOnShortcut</DocsCode> submits the form with ⌘ +
              Enter or Ctrl + Enter. Enter on its own still starts a new line.
            </>
          }
        >
          <TextareaSubmit />
        </DocsExample>
        <DocsExample
          file="textarea/counter"
          title="Character count"
          description={
            <>
              With <DocsCode>maxLength</DocsCode> inside a{" "}
              <DocsCode>Field</DocsCode>, <DocsCode>FieldCounter</DocsCode>{" "}
              counts as you type and nudges when you hit the limit.
            </>
          }
        >
          <TextareaCounter />
        </DocsExample>
        <DocsExample
          file="textarea/rows"
          title="Rows"
          description={
            <>
              <DocsCode>minRows</DocsCode> and <DocsCode>maxRows</DocsCode> set
              where growing starts and stops.
            </>
          }
        >
          <TextareaRows />
        </DocsExample>
        <DocsExample
          file="textarea/fixed"
          title="Fixed size"
          description={
            <>
              <DocsCode>{"autoResize={false}"}</DocsCode> keeps a fixed height
              with a vertical resize handle.
            </>
          }
        >
          <TextareaFixed />
        </DocsExample>
        <DocsExample
          file="textarea/states"
          title="States"
          description="Disabled, read-only and invalid. Invalid textareas shake when a form submit fails."
        >
          <TextareaStates />
        </DocsExample>
        <DocsExample
          file="textarea/rtl"
          title="Right to left"
          description="Text, placeholder and caret follow the reading direction."
        >
          <TextareaRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            { keys: ["Enter"], description: "Starts a new line." },
            {
              keys: ["⌘", "Enter"],
              description:
                "Submits the form, with submitOnShortcut. Ctrl + Enter on Windows and Linux.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Label it with <DocsCode>FieldLabel</DocsCode> or{" "}
            <DocsCode>aria-label</DocsCode>.
          </li>
          <li>
            On touch screens the text is at least 16px, so iOS doesn&apos;t zoom
            in when it&apos;s focused.
          </li>
          <li>
            The shortcut waits while an input method is composing, so confirming
            a Japanese or Chinese word never sends the message.
          </li>
          <li>With reduced motion, the box resizes instantly.</li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="Textarea" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "autoResize",
                type: "boolean",
                default: "true",
                description: "Grow with the text instead of a fixed height.",
              },
              { name: "minRows", type: "number", default: "3" },
              { name: "maxRows", type: "number", default: "10" },
              {
                name: "submitOnShortcut",
                type: "boolean",
                default: "false",
                description: "Submit the parent form with ⌘/Ctrl + Enter.",
              },
              {
                name: "shake",
                type: "boolean",
                default: "true",
                description: "Shake when a form submit finds it invalid.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              { name: 'data-slot="textarea"', description: "The textarea." },
              {
                name: "data-autoresize",
                description: "Present when it grows with its text.",
              },
              {
                name: "--textarea-min-rows / --textarea-max-rows",
                description: "Set from minRows and maxRows.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
