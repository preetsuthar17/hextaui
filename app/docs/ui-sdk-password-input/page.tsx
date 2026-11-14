import { DocsCodeBlock } from "@/components/docs/docs-code-block"
import { DocsComponentPage } from "@/components/docs/docs-component-page"
import {
  DocsCode,
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
import { UiSdkPasswordInputControlled } from "@/components/examples/ui-sdk-password-input/controlled"
import { UiSdkPasswordInputController } from "@/components/examples/ui-sdk-password-input/controller"
import { UiSdkPasswordInputDemo } from "@/components/examples/ui-sdk-password-input/demo"
import { UiSdkPasswordInputDisabled } from "@/components/examples/ui-sdk-password-input/disabled"
import { UiSdkPasswordInputInvalid } from "@/components/examples/ui-sdk-password-input/invalid"
import { UiSdkPasswordInputNewPassword } from "@/components/examples/ui-sdk-password-input/new-password"
import { UiSdkPasswordInputReadOnly } from "@/components/examples/ui-sdk-password-input/read-only"
import { UiSdkPasswordInputRtl } from "@/components/examples/ui-sdk-password-input/rtl"
import { UiSdkPasswordInputSignIn } from "@/components/examples/ui-sdk-password-input/sign-in"
import { UiSdkPasswordInputVisible } from "@/components/examples/ui-sdk-password-input/visible"
import { getDocsComponentMetadata } from "@/lib/docs-metadata"

export const metadata = getDocsComponentMetadata("ui-sdk-password-input")

const layerCode = `@layer ui-sdk;

@import "tailwindcss";`

const importCode = `import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputGroup,
  PasswordInputToggle,
} from "@/components/ui/ui-sdk-password-input"`

const usageCode = `<PasswordInput name="password">
  <PasswordInputGroup>
    <PasswordInputControl aria-label="Password" />
    <PasswordInputToggle />
  </PasswordInputGroup>
</PasswordInput>`

const compositionCode = `PasswordInput
├── PasswordInputGroup
│   ├── PasswordInputControl
│   └── PasswordInputToggle
├── PasswordInputCapsLock
└── PasswordInputStrength`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="ui-sdk-password-input">
      <DocsExample file="ui-sdk-password-input/demo">
        <UiSdkPasswordInputDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@ui-sdk/react@0.1.0-beta.2",
          "@ui-sdk/core@0.1.0-beta.2",
          "@tabler/icons-react",
          "cn",
        ]}
        files={["components/ui/ui-sdk-password-input.tsx"]}
      />

      <DocsSection title="Usage">
        <DocsParagraph>
          UI SDK adds a little CSS of its own in a cascade layer named{" "}
          <DocsCode>ui-sdk</DocsCode>. Declare that layer at the top of your
          global stylesheet, above the Tailwind import, so your classes win over
          it.
        </DocsParagraph>
        <DocsCodeBlock code={layerCode} lang="css" />
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          The control stays a native password field, so password managers,
          autofill and form submission work as they do everywhere else. Put form
          options like <DocsCode>name</DocsCode>,{" "}
          <DocsCode>required</DocsCode> and <DocsCode>autoComplete</DocsCode> on{" "}
          <DocsCode>PasswordInput</DocsCode>, and input attributes like{" "}
          <DocsCode>id</DocsCode> and <DocsCode>placeholder</DocsCode> on{" "}
          <DocsCode>PasswordInputControl</DocsCode>.
        </DocsParagraph>
        <DocsParagraph>
          <DocsCode>autoComplete</DocsCode> defaults to{" "}
          <DocsCode>current-password</DocsCode> for signing in. Use{" "}
          <DocsCode>new-password</DocsCode> to sign up or change a password, so
          the browser offers a strong one, and{" "}
          <DocsCode>off</DocsCode> for secrets that aren’t account passwords.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="ui-sdk-password-input/new-password"
          title="New password"
          description={
            <>
              <DocsCode>PasswordInputStrength</DocsCode> scores the password
              from 0 to 4 as it’s typed. The checklist reads the same value with{" "}
              <DocsCode>usePasswordInputValue()</DocsCode>. The rules belong to
              the example, since the component sets no password policy.
            </>
          }
        >
          <UiSdkPasswordInputNewPassword />
        </DocsExample>
        <DocsExample
          file="ui-sdk-password-input/sign-in"
          title="Sign in"
          description={
            <>
              Pair it with an email field set to{" "}
              <DocsCode>{'autoComplete="username"'}</DocsCode>. Enter in the
              password submits the form, and submitting hides a shown password
              again so the browser offers to save it.
            </>
          }
        >
          <UiSdkPasswordInputSignIn />
        </DocsExample>
        <DocsExample
          file="ui-sdk-password-input/visible"
          title="Shown at first"
          description={
            <>
              <DocsCode>defaultVisible</DocsCode> starts with the text showing,
              for a secret people need to read, like a Wi-Fi password.
            </>
          }
        >
          <UiSdkPasswordInputVisible />
        </DocsExample>
        <DocsExample
          file="ui-sdk-password-input/controller"
          title="Suggest a password"
          description={
            <>
              A controller from{" "}
              <DocsCode>createPasswordInputController()</DocsCode> sets, shows,
              hides, clears and focuses the field from any button. Writes go
              through <DocsCode>onValueChange</DocsCode> like typing.
            </>
          }
        >
          <UiSdkPasswordInputController />
        </DocsExample>
        <DocsExample
          file="ui-sdk-password-input/controlled"
          title="Controlled visibility"
          description={
            <>
              Pass <DocsCode>visible</DocsCode> and{" "}
              <DocsCode>onVisibleChange</DocsCode>. The reason tells a toggle
              press from a form submit, a reset or the page being hidden.
            </>
          }
        >
          <UiSdkPasswordInputControlled />
        </DocsExample>
        <DocsExample
          file="ui-sdk-password-input/invalid"
          title="Invalid"
          description={
            <>
              <DocsCode>invalid</DocsCode> marks the field and sets{" "}
              <DocsCode>aria-invalid</DocsCode> on the input. Point its{" "}
              <DocsCode>aria-describedby</DocsCode> at your message. A required
              field also turns red after someone leaves it empty.
            </>
          }
        >
          <UiSdkPasswordInputInvalid />
        </DocsExample>
        <DocsExample
          file="ui-sdk-password-input/read-only"
          title="Read-only"
          description="A read-only field can be focused, shown and copied, but not changed, and still submits."
        >
          <UiSdkPasswordInputReadOnly />
        </DocsExample>
        <DocsExample
          file="ui-sdk-password-input/disabled"
          title="Disabled"
          description="A disabled field and its toggle are skipped by Tab, and the value doesn’t submit."
        >
          <UiSdkPasswordInputDisabled />
        </DocsExample>
        <DocsExample
          file="ui-sdk-password-input/rtl"
          title="Right to left"
          description="The toggle sits on the left, and the strength meter fills from the right. Pass labels in your language."
        >
          <UiSdkPasswordInputRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description: "Moves from the field to the toggle.",
            },
            {
              keys: ["Space", "Enter"],
              description:
                "Shows or hides the password from the toggle, and keeps focus on it.",
            },
            {
              keys: ["Enter"],
              description:
                "Submits the form from the field. It never presses the toggle.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsParagraph>
          The toggle is a toggle button with a fixed name, “Show password”, and{" "}
          <DocsCode>aria-pressed</DocsCode> tells screen readers whether the
          password is shown. Rename it for other secrets and languages. A
          pointer press on the toggle keeps the caret where it was in the field.
        </DocsParagraph>
        <DocsParagraph>
          <DocsCode>PasswordInputCapsLock</DocsCode> opens below the field while
          Caps Lock is on and the field has focus, and says so through a status
          region. <DocsCode>PasswordInputStrength</DocsCode> is a meter whose
          value text is the strength label, read on demand rather than announced
          on every key. Shown passwords skip spellcheck, autocorrect and
          capitalization.
        </DocsParagraph>
        <DocsParagraph>
          No part writes the password into a <DocsCode>data-*</DocsCode>{" "}
          attribute. The root and control only carry booleans like{" "}
          <DocsCode>data-filled</DocsCode>, and the meter carries the score. A
          controlled <DocsCode>value</DocsCode> does make React keep a{" "}
          <DocsCode>value</DocsCode> attribute in the DOM, so read the password
          with <DocsCode>onValueChange</DocsCode> or{" "}
          <DocsCode>usePasswordInputValue()</DocsCode> instead.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Each part wraps the UI SDK part of the same name and accepts all of
          its props, including <DocsCode>render</DocsCode> and a{" "}
          <DocsCode>className</DocsCode> that can be a function of the part’s
          state.
        </DocsParagraph>
        <DocsSection title="PasswordInput" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "string" },
              { name: "defaultValue", type: "string" },
              {
                name: "onValueChange",
                type: "(value: string, details) => void",
              },
              { name: "visible", type: "boolean" },
              { name: "defaultVisible", type: "boolean", default: "false" },
              {
                name: "onVisibleChange",
                type: "(visible: boolean, details) => void",
                description:
                  "details.reason is toggle-press, form-submit, reset, page-hide or imperative.",
              },
              {
                name: "autoComplete",
                type: '"current-password" | "new-password" | "off" | string',
                default: '"current-password"',
              },
              { name: "invalid", type: "boolean", default: "false" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "readOnly", type: "boolean", default: "false" },
              { name: "required", type: "boolean", default: "false" },
              { name: "name", type: "string" },
              { name: "form", type: "string" },
              {
                name: "controller",
                type: "PasswordInputController",
                description: "From createPasswordInputController().",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="password-input"',
                description: "Target the password input in CSS.",
              },
              {
                name: "data-visible",
                description: "Present while the password is shown.",
              },
              {
                name: "data-capslock",
                description:
                  "Present while Caps Lock is on and the field has focus.",
              },
              {
                name: "data-filled",
                description: "Present while the field holds any text.",
              },
              {
                name: "data-invalid",
                description: "Present when invalid.",
              },
              {
                name: "data-disabled",
                description: "Present when disabled.",
              },
              {
                name: "data-readonly",
                description: "Present when read-only.",
              },
              {
                name: "data-required",
                description: "Present when a password is required.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="PasswordInputGroup" level={3}>
          <DocsParagraph>
            The box around the field and the toggle. It draws the focus ring
            when the field has focus.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="PasswordInputControl" level={3}>
          <DocsPropsTable
            props={[
              { name: "id", type: "string" },
              { name: "placeholder", type: "string" },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="password-input-control"',
                description: "Target the native input in CSS.",
              },
              {
                name: "data-visible",
                description: "Present while it’s a text field.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="PasswordInputToggle" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "aria-label",
                type: "string",
                default: '"Show password"',
              },
              {
                name: "children",
                type: "ReactNode | (state) => ReactNode",
                description: "Defaults to an eye that crossfades to a closed eye.",
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="password-input-toggle"',
                description: "Target the toggle in CSS.",
              },
              {
                name: "aria-pressed",
                description: "true while the password is shown.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="PasswordInputCapsLock" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                default: '"Caps Lock is on"',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="password-input-capslock"',
                description: "Target the hint in CSS.",
              },
              {
                name: "data-active",
                description: "Present while Caps Lock is on.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="PasswordInputStrength" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "getStrength",
                type: "(password: string) => 0 | 1 | 2 | 3 | 4",
                default: "scorePassword",
                description:
                  "Scores the password. The default weighs length, character variety, repeats and common passwords. Use a stronger estimator like zxcvbn for real policies.",
              },
              {
                name: "labels",
                type: "[string, string, string, string, string]",
                default: '["", "Weak", "Fair", "Good", "Strong"]',
              },
              {
                name: "label",
                type: "string",
                default: '"Password strength"',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="password-input-strength"',
                description: "Target the meter in CSS.",
              },
              {
                name: "data-score",
                description: "The score, from 0 for empty to 4.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
