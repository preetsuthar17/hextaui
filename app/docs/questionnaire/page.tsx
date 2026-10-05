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
import { QuestionnaireAutoAdvance } from "@/components/examples/questionnaire/auto-advance"
import { QuestionnaireConditional } from "@/components/examples/questionnaire/conditional"
import { QuestionnaireDemo } from "@/components/examples/questionnaire/demo"
import { QuestionnaireLift } from "@/components/examples/questionnaire/lift"
import { QuestionnaireRtl } from "@/components/examples/questionnaire/rtl"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("questionnaire")

const importCode = `import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"`

const usageCode = `<Questionnaire onSubmit={handleSubmit}>
  <QuestionnaireProgress />
  <QuestionnaireItem name="role" required>
    <QuestionnaireTitle>What best describes your work?</QuestionnaireTitle>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="design">Design</QuestionnaireChoice>
      <QuestionnaireChoice value="engineering">Engineering</QuestionnaireChoice>
    </QuestionnaireChoices>
  </QuestionnaireItem>
  <QuestionnaireActions>
    <QuestionnairePrevious />
    <QuestionnaireNext />
    <QuestionnaireSubmit />
  </QuestionnaireActions>
</Questionnaire>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `Questionnaire
├── QuestionnaireProgress
├── QuestionnaireItem
│   ├── QuestionnaireTitle
│   ├── QuestionnaireDescription
│   ├── QuestionnaireChoices
│   │   ├── QuestionnaireChoice
│   │   │   └── QuestionnaireChoiceDescription
│   │   └── QuestionnaireInput
│   └── QuestionnaireError
└── QuestionnaireActions
    ├── QuestionnairePrevious
    ├── QuestionnaireSkip
    ├── QuestionnaireNext
    └── QuestionnaireSubmit`

export default function Page() {
  return (
    <DocsComponentPage slug="questionnaire">
      <DocsExample file="questionnaire/demo">
        <QuestionnaireDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@shadcn/react",
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={[
          "components/ui/questionnaire.tsx",
          "components/ui/button.tsx",
          "components/ui/input.tsx",
          "components/ui/kbd.tsx",
          "components/ui/number-flow.tsx",
          "lib/motion.ts",
        ]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Answers submit as a regular form, keyed by each item&apos;s{" "}
          <DocsCode>name</DocsCode>. Questions move toward the direction you go,
          the card eases to each question&apos;s height, and the progress fills
          only for questions that were answered or skipped.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="questionnaire/lift"
          title="Lift transition and bar"
          description={
            <>
              <DocsCode>{'transition="lift"'}</DocsCode> moves questions up and
              down like a stack. <DocsCode>{'variant="bar"'}</DocsCode> on the
              progress shows one continuous bar.
            </>
          }
        >
          <QuestionnaireLift />
        </DocsExample>
        <DocsExample
          file="questionnaire/auto-advance"
          title="Auto-advance"
          description={
            <>
              With <DocsCode>autoAdvance</DocsCode>, picking a single answer
              moves on after a short pause, so you can answer with{" "}
              <DocsCode>1</DocsCode>–<DocsCode>5</DocsCode> alone. Changing an
              earlier answer never jumps ahead, and the last question never
              submits by itself.
            </>
          }
        >
          <QuestionnaireAutoAdvance />
        </DocsExample>
        <DocsExample
          file="questionnaire/conditional"
          title="Conditional questions"
          description={
            <>
              Disable an item to leave it out. It drops from the progress and
              the flow until it applies.
            </>
          }
        >
          <QuestionnaireConditional />
        </DocsExample>
        <DocsExample
          file="questionnaire/rtl"
          title="Right to left"
          description="The slide follows the reading direction."
        >
          <QuestionnaireRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["↑", "↓"],
              description:
                "Moves between the answers, including the text field. Moving doesn't pick.",
            },
            {
              keys: ["Space"],
              description:
                "Picks the focused answer, or toggles it in multiple choice.",
            },
            {
              keys: ["Enter"],
              description:
                "Continues. On an unpicked single answer it picks it first. Submits on the last question.",
            },
            {
              keys: ["←", "→"],
              description:
                "Previous or next question, mirrored in right-to-left. Next shakes when an answer is needed. Inside the text field they move the cursor.",
            },
            {
              keys: ["Home", "End"],
              description: "First or last answer.",
            },
            {
              keys: ["A", "1"],
              description:
                "Picks an answer by its key when shortcuts is set. Key caps brighten once the questionnaire has focus; click anywhere in it to start.",
            },
            {
              keys: ["Esc"],
              description:
                "Leaves the text field so letter shortcuts work again.",
            },
            {
              keys: ["⌘", "Enter"],
              description: "Submits from anywhere.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Each <DocsCode>QuestionnaireItem</DocsCode> is a{" "}
            <DocsCode>{"<fieldset>"}</DocsCode> whose title is its{" "}
            <DocsCode>{"<legend>"}</DocsCode>. Inactive questions are hidden and
            inert, including the one animating out.
          </li>
          <li>
            The progress is a <DocsCode>progressbar</DocsCode> that announces
            &ldquo;Question 2 of 5&rdquo;; the segments and spinning number are
            decorative.
          </li>
          <li>
            Errors use <DocsCode>role=&quot;alert&quot;</DocsCode> and the
            invalid answers get <DocsCode>aria-invalid</DocsCode>.
          </li>
          <li>
            With reduced motion, questions switch instantly and nothing shakes.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="Questionnaire" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "transition",
                type: '"slide" | "lift"',
                default: '"slide"',
              },
              {
                name: "autoAdvance",
                type: "boolean",
                default: "false",
                description:
                  "Moves on 350ms after a single answer is picked for the first time.",
              },
              {
                name: "shortcuts",
                type: '"letters" | "numbers"',
                description: "Adds a key shortcut to every answer.",
              },
              { name: "item", type: "string" },
              { name: "defaultItem", type: "string" },
              { name: "onItemChange", type: "(item: string) => void" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="questionnaire"',
                description: "The form, with data-transition.",
              },
              {
                name: "data-current / data-total",
                description: "The current position and number of questions.",
              },
              {
                name: "data-first / data-last",
                description: "Present on the first or last question.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="QuestionnaireProgress" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"segments" | "bar"',
                default: '"segments"',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="questionnaire-progress-segment"',
                description:
                  "One per question, with data-status, data-active and data-invalid.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="QuestionnaireItem" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "name",
                type: "string",
                description: "The form field name.",
              },
              { name: "required", type: "boolean", default: "false" },
              {
                name: "multiple",
                type: "boolean",
                default: "false",
                description: "Checkboxes instead of radios.",
              },
              {
                name: "disabled",
                type: "boolean",
                default: "false",
                description: "Leaves the question out of the flow.",
              },
              {
                name: "onStatusChange",
                type: "(status) => void",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: "data-status",
                description: '"unanswered", "answered" or "skipped".',
              },
              { name: "data-active", description: "The current question." },
              { name: "data-invalid", description: "Needs an answer." },
              {
                name: "data-leaving",
                description: "The question animating out.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="QuestionnaireChoice" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "string" },
              { name: "defaultChecked", type: "boolean" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "render", type: renderType, default: "<label>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: "data-checked / data-unchecked",
                description: "Whether the answer is picked.",
              },
              { name: "data-type", description: '"radio" or "checkbox".' },
              { name: "data-shortcut", description: "The answer's key." },
            ]}
          />
        </DocsSection>
        <DocsSection title="QuestionnaireInput" level={3}>
          <DocsParagraph>
            A free-text answer that sits with the choices. Typing clears the
            picked choice. Give it a label or <DocsCode>aria-label</DocsCode>.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="Navigation buttons" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: "Button variant",
                default: '"ghost", or "default" for Next and Submit',
              },
              { name: "size", type: "Button size", default: '"default"' },
            ]}
          />
          <DocsParagraph>
            <DocsCode>QuestionnaireNext</DocsCode> and{" "}
            <DocsCode>QuestionnaireSubmit</DocsCode> share a slot, so the last
            question swaps Next for Submit without moving anything.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
