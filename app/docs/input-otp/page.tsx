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
import { InputOTPAlphanumeric } from "@/components/examples/input-otp/alphanumeric"
import { InputOTPAnimated } from "@/components/examples/input-otp/animated"
import { InputOTPBasic } from "@/components/examples/input-otp/basic"
import { InputOTPControlled } from "@/components/examples/input-otp/controlled"
import { InputOTPCustomSeparator } from "@/components/examples/input-otp/custom-separator"
import { InputOTPDemo } from "@/components/examples/input-otp/demo"
import { InputOTPDisabled } from "@/components/examples/input-otp/disabled"
import { InputOTPField } from "@/components/examples/input-otp/field"
import { InputOTPForm } from "@/components/examples/input-otp/form"
import { InputOTPInvalid } from "@/components/examples/input-otp/invalid"
import { InputOTPMasked } from "@/components/examples/input-otp/masked"
import { InputOTPRtl } from "@/components/examples/input-otp/rtl"
import { InputOTPSeparate } from "@/components/examples/input-otp/separate"
import { InputOTPSizes } from "@/components/examples/input-otp/sizes"
import { InputOTPStatusExample } from "@/components/examples/input-otp/status"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("input-otp")

const importCode = `import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"`

const usageCode = `<label htmlFor="code">Verification code</label>
<InputOTP id="code" length={6}>
  <InputOTPGroup>
    <InputOTPSlot />
    <InputOTPSlot />
    <InputOTPSlot />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot />
    <InputOTPSlot />
    <InputOTPSlot />
  </InputOTPGroup>
</InputOTP>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `InputOTP
├── InputOTPGroup
│   └── InputOTPSlot
├── InputOTPSeparator
└── InputOTPGroup
    └── InputOTPSlot`

export default function Page() {
  return (
    <DocsComponentPage slug="input-otp">
      <DocsExample file="input-otp/demo">
        <InputOTPDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={["components/ui/input-otp.tsx", "lib/motion.ts"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Render one <DocsCode>{"<InputOTPSlot />"}</DocsCode> per character and
          set <DocsCode>length</DocsCode> to the same number. Slots find their
          position on their own, so there is no <DocsCode>index</DocsCode> prop
          to keep in sync.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="input-otp/basic"
          title="Joined"
          description={
            <>
              The default look. Each <DocsCode>{"<InputOTPGroup />"}</DocsCode>{" "}
              joins its slots into one strip with shared edges.
            </>
          }
        >
          <InputOTPBasic />
        </DocsExample>
        <DocsExample
          file="input-otp/separate"
          title="Separate"
          description={
            <>
              <DocsCode>variant=&quot;separate&quot;</DocsCode> gives every slot
              its own rounded box with a gap between them.
            </>
          }
        >
          <InputOTPSeparate />
        </DocsExample>
        <DocsExample
          file="input-otp/sizes"
          title="Sizes"
          description={
            <>
              <DocsCode>sm</DocsCode>, <DocsCode>default</DocsCode> and{" "}
              <DocsCode>lg</DocsCode> match the input and button heights. On
              touch screens every size grows to at least 44px with a 16px font.
            </>
          }
        >
          <InputOTPSizes />
        </DocsExample>
        <DocsExample
          file="input-otp/animated"
          title="Animated"
          description={
            <>
              <DocsCode>animated</DocsCode> is off by default. With it, typed
              characters rise in, deleted ones sink out while the rest slide
              over, and a whole code from autofill, paste or your own state
              cascades in slot by slot. Press Fill code to see the cascade.
            </>
          }
        >
          <InputOTPAnimated />
        </DocsExample>
        <DocsExample
          file="input-otp/status"
          title="Status"
          description={
            <>
              <DocsCode>status</DocsCode> shows the result of checking the code.{" "}
              <DocsCode>loading</DocsCode> locks the slots and marks the field
              busy, <DocsCode>error</DocsCode> marks every slot invalid and{" "}
              <DocsCode>success</DocsCode> turns the edges green. Each one is
              announced. With <DocsCode>animated</DocsCode>, loading runs a
              wave, error shakes once and success pops the characters.
            </>
          }
        >
          <InputOTPStatusExample />
        </DocsExample>
        <DocsExample
          file="input-otp/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>value</DocsCode> and{" "}
              <DocsCode>onValueChange</DocsCode>. The value is always the
              filtered code, never longer than <DocsCode>length</DocsCode>.
            </>
          }
        >
          <InputOTPControlled />
        </DocsExample>
        <DocsExample
          file="input-otp/form"
          title="Form"
          description={
            <>
              With a <DocsCode>name</DocsCode>, the code is submitted with the
              form. <DocsCode>autoSubmit</DocsCode> submits as soon as the last
              slot fills, so an autofilled code signs people in without another
              tap.
            </>
          }
        >
          <InputOTPForm />
        </DocsExample>
        <DocsExample
          file="input-otp/field"
          title="With Field"
          description={
            <>
              Inside a <DocsCode>{"<Field />"}</DocsCode> the label, description
              and error are linked for you. Enter anything but 000000 to see the
              error.
            </>
          }
        >
          <InputOTPField />
        </DocsExample>
        <DocsExample
          file="input-otp/invalid"
          title="Invalid"
          description={
            <>
              <DocsCode>aria-invalid</DocsCode> on the root marks every slot.
              Link the message with <DocsCode>aria-describedby</DocsCode>.
            </>
          }
        >
          <InputOTPInvalid />
        </DocsExample>
        <DocsExample
          file="input-otp/alphanumeric"
          title="Letters and numbers"
          description={
            <>
              <DocsCode>validationType=&quot;alphanumeric&quot;</DocsCode>{" "}
              accepts recovery and invite codes, and{" "}
              <DocsCode>normalizeValue</DocsCode> upper-cases them as they are
              typed or pasted.
            </>
          }
        >
          <InputOTPAlphanumeric />
        </DocsExample>
        <DocsExample
          file="input-otp/masked"
          title="Masked"
          description={
            <>
              <DocsCode>mask</DocsCode> hides each character, for PINs. Turn
              autofill off with{" "}
              <DocsCode>autoComplete=&quot;off&quot;</DocsCode> when the value
              is not a one-time code.
            </>
          }
        >
          <InputOTPMasked />
        </DocsExample>
        <DocsExample
          file="input-otp/custom-separator"
          title="Custom separator"
          description={
            <>
              Group the slots any way you like and pass your own icon to{" "}
              <DocsCode>{"<InputOTPSeparator />"}</DocsCode>.
            </>
          }
        >
          <InputOTPCustomSeparator />
        </DocsExample>
        <DocsExample
          file="input-otp/disabled"
          title="Disabled"
          description="A disabled field can’t be focused or edited."
        >
          <InputOTPDisabled />
        </DocsExample>
        <DocsExample
          file="input-otp/rtl"
          title="Right to left"
          description={
            <>
              Slots fill from the right and the arrow keys follow what you see.
              Give slots after the first a translated{" "}
              <DocsCode>aria-label</DocsCode>. Set{" "}
              <DocsCode>dir=&quot;ltr&quot;</DocsCode> on the field to keep a
              code left to right in a right-to-left page.
            </>
          }
        >
          <InputOTPRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Moves focus into the field, to the first empty slot, and out again. Only one slot is in the tab order.",
            },
            {
              keys: ["←", "→"],
              description:
                "Moves to the previous or next slot, in visual order in right-to-left layouts.",
            },
            {
              keys: ["Home", "↑"],
              description: "Moves to the first slot.",
            },
            {
              keys: ["End", "↓"],
              description: "Moves to the slot after the last character.",
            },
            {
              keys: ["Backspace"],
              description:
                "Deletes the character in the slot, or the one before it when the slot is empty. Later characters move back.",
            },
            {
              keys: ["Delete"],
              description:
                "Deletes the character in the slot and keeps focus there.",
            },
            {
              keys: ["Ctrl", "Backspace"],
              description: "Clears the whole code. ⌘ Backspace on macOS.",
            },
            {
              keys: ["Ctrl", "A"],
              description:
                "Selects the whole code (⌘ A on macOS). Backspace or Delete then clears it and returns to the first slot, typing or pasting replaces it, and Ctrl C copies all of it. Any other key or a click ends the selection.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Each slot is a real input. The first takes its name from your{" "}
            <DocsCode>{"<label>"}</DocsCode> or <DocsCode>aria-label</DocsCode>;
            the others are named &quot;Character 2 of 6&quot; and so on. Pass{" "}
            <DocsCode>aria-label</DocsCode> on a slot to translate it.
          </li>
          <li>
            The first slot has{" "}
            <DocsCode>autocomplete=&quot;one-time-code&quot;</DocsCode>, so iOS
            and macOS offer codes from Messages and Mail, Android offers SMS
            codes, and password managers can fill it. A whole code that lands in
            one slot is spread across all of them. The animated cascade runs for
            every source, including codes you set from the WebOTP API.
          </li>
          <li>
            Whenever the code becomes empty while a slot has focus, such as
            after a wrong code is cleared, focus moves back to the first slot so
            the next attempt starts in the right place.
          </li>
          <li>
            When <DocsCode>status</DocsCode> is set, a hidden live region next
            to the field announces it. Change the words with{" "}
            <DocsCode>loadingLabel</DocsCode>, <DocsCode>successLabel</DocsCode>{" "}
            and <DocsCode>errorLabel</DocsCode>.
          </li>
          <li>
            With <DocsCode>animated</DocsCode>, characters are drawn on a layer
            hidden from screen readers while the inputs keep the real value.
            Under reduced motion, characters only fade and the status wave
            becomes a gentle pulse.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI OTP field. Every Base UI prop is passed through.
        </DocsParagraph>
        <DocsSection title="InputOTP" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "length",
                type: "number",
                description:
                  "Required. The number of slots; render the same number of InputOTPSlot parts.",
              },
              {
                name: "variant",
                type: '"joined" | "separate"',
                default: '"joined"',
              },
              {
                name: "size",
                type: '"sm" | "default" | "lg"',
                default: '"default"',
              },
              {
                name: "animated",
                type: "boolean",
                default: "false",
                description:
                  "Animate characters in and out, cascade multi-character input and animate the status.",
              },
              {
                name: "status",
                type: '"idle" | "loading" | "success" | "error"',
                description:
                  "The result of checking the code. Loading makes the slots read-only.",
              },
              {
                name: "loadingLabel",
                type: "string",
                default: '"Verifying code"',
              },
              {
                name: "successLabel",
                type: "string",
                default: '"Code verified"',
              },
              {
                name: "errorLabel",
                type: "string",
                default: '"Code is incorrect"',
              },
              { name: "value", type: "string" },
              { name: "defaultValue", type: "string" },
              {
                name: "onValueChange",
                type: "(value: string, details) => void",
              },
              {
                name: "onValueComplete",
                type: "(value: string, details) => void",
                description: "Called when the last slot fills.",
              },
              {
                name: "onValueInvalid",
                type: "(value: string, details) => void",
                description:
                  "Called when typed or pasted characters are rejected.",
              },
              {
                name: "validationType",
                type: '"numeric" | "alpha" | "alphanumeric" | "none"',
                default: '"numeric"',
              },
              {
                name: "normalizeValue",
                type: "(value: string) => string",
                description: "Runs after filtering. Keep it idempotent.",
              },
              {
                name: "inputMode",
                type: "string",
                description: "Defaults from validationType.",
              },
              {
                name: "autoComplete",
                type: "string",
                default: '"one-time-code"',
              },
              { name: "autoSubmit", type: "boolean", default: "false" },
              { name: "mask", type: "boolean", default: "false" },
              {
                name: "aria-invalid",
                type: "boolean",
                description: "Marks every slot invalid.",
              },
              { name: "name", type: "string" },
              { name: "form", type: "string" },
              {
                name: "id",
                type: "string",
                description:
                  "Goes on the first slot, so a label's htmlFor points at it.",
              },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "readOnly", type: "boolean", default: "false" },
              { name: "required", type: "boolean", default: "false" },
              { name: "className", type: "string | (state) => string" },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              { name: 'data-slot="input-otp"', description: "The root." },
              {
                name: 'data-variant="joined" | "separate"',
                description: "The current variant.",
              },
              { name: "data-size", description: "The current size." },
              {
                name: "data-status",
                description: "The status, when one is set.",
              },
              {
                name: "data-animated",
                description: "Present when animated is on.",
              },
              {
                name: "data-shake",
                description:
                  "Present while the field shakes after the status turns to error.",
              },
              {
                name: "data-complete",
                description: "Present when every slot is filled.",
              },
              {
                name: "data-filled",
                description: "Present when any slot is filled.",
              },
              {
                name: "data-focused",
                description: "Present while a slot has focus.",
              },
              {
                name: "data-disabled",
                description: "Present when disabled.",
              },
              {
                name: "data-readonly",
                description: "Present when read-only, including while loading.",
              },
              {
                name: "data-required",
                description: "Present when required.",
              },
              {
                name: "data-invalid / data-valid / data-touched / data-dirty",
                description: "Field state, inside a Field.",
              },
              {
                name: 'data-slot="input-otp-status"',
                description: "The hidden live region, a sibling of the root.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="InputOTPGroup" level={3}>
          <DocsParagraph>
            A plain element that lays out a run of slots. In the joined variant
            its slots share edges.
          </DocsParagraph>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<div>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="input-otp-group"',
                description: "Target the group in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="InputOTPSlot" level={3}>
          <DocsParagraph>
            A box holding one input. <DocsCode>className</DocsCode> goes on the
            box; every other prop goes on the input.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "aria-label",
                type: "string",
                default: '"Character N of M"',
                description: "Ignored on the first slot, which uses the label.",
              },
              {
                name: "className",
                type: "string | (state) => string",
                description:
                  "The state has the slot's index, value, filled and the field state.",
              },
              { name: "placeholder", type: "string" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="input-otp-slot"',
                description: "The box.",
              },
              {
                name: "data-filled",
                description: "Present when the slot has a character.",
              },
              {
                name: "data-status",
                description: "The root's status, when not idle.",
              },
              {
                name: "--input-otp-index",
                description:
                  "The slot's position, used to stagger the status motion.",
              },
              {
                name: 'data-slot="input-otp-input"',
                description:
                  "The input inside, with Base UI's data-filled, data-focused, data-complete and field attributes.",
              },
              {
                name: 'data-slot="input-otp-char"',
                description: "The drawn character when animated.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="InputOTPSeparator" level={3}>
          <DocsParagraph>
            A separator with a minus icon. Pass children to use another icon.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "orientation",
                type: '"horizontal" | "vertical"',
                default: '"horizontal"',
              },
              { name: "className", type: "string | (state) => string" },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="input-otp-separator"',
                description: "Target the separator in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="inputOTPSlotVariants" level={3}>
          <DocsParagraph>
            The class names behind a slot and a group (
            <DocsCode>inputOTPGroupVariants</DocsCode>). Call them with{" "}
            <DocsCode>{"{ variant, size }"}</DocsCode>.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
