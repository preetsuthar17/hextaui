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
import { UiSdkTokenInputCodec } from "@/components/examples/ui-sdk-token-input/codec"
import { UiSdkTokenInputController } from "@/components/examples/ui-sdk-token-input/controller"
import { UiSdkTokenInputDeletion } from "@/components/examples/ui-sdk-token-input/deletion"
import { UiSdkTokenInputDemo } from "@/components/examples/ui-sdk-token-input/demo"
import { UiSdkTokenInputDisabled } from "@/components/examples/ui-sdk-token-input/disabled"
import { UiSdkTokenInputForm } from "@/components/examples/ui-sdk-token-input/form"
import { UiSdkTokenInputPrompt } from "@/components/examples/ui-sdk-token-input/prompt"
import { UiSdkTokenInputReadOnly } from "@/components/examples/ui-sdk-token-input/read-only"
import { UiSdkTokenInputRtl } from "@/components/examples/ui-sdk-token-input/rtl"
import { UiSdkTokenInputSubmitShortcut } from "@/components/examples/ui-sdk-token-input/submit-shortcut"
import { getDocsComponentMetadata } from "@/lib/docs-metadata"

export const metadata = getDocsComponentMetadata("ui-sdk-token-input")

const layerCode = `@layer ui-sdk;

@import "tailwindcss";`

const importCode = `import {
  TokenInput,
  TokenInputEditor,
  type TokenInputValue,
} from "@/components/ui/ui-sdk-token-input"`

const usageCode = `const draft: TokenInputValue = [
  "Explain ",
  { type: "file", value: "src/routes.ts", label: "routes.ts" },
]

<TokenInput defaultValue={draft}>
  <TokenInputEditor aria-label="Prompt" />
</TokenInput>`

const compositionCode = `TokenInput
├── TokenInputEditor
└── TriggerMenu
    ├── TriggerMenuHint
    └── TriggerMenuContent
        ├── TriggerMenuEmpty
        └── TriggerMenuList
            └── TriggerMenuItem
                └── TriggerMenuItemIcon

renderToken
└── TokenInputToken
    └── TokenInputTokenRemove`

const valueType = "TokenInputValue"
const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="ui-sdk-token-input">
      <DocsExample file="ui-sdk-token-input/demo">
        <UiSdkTokenInputDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@ui-sdk/react@0.1.0-beta.1",
          "@ui-sdk/core@0.1.0-beta.1",
          "@tabler/icons-react",
          "cn",
        ]}
        files={["components/ui/ui-sdk-token-input.tsx"]}
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
          A value is an array of text and tokens. Each token has a{" "}
          <DocsCode>type</DocsCode>, a <DocsCode>value</DocsCode> for your app
          and a <DocsCode>label</DocsCode> people read. The editor owns its
          content, selection and undo, so let it render and pass{" "}
          <DocsCode>renderToken</DocsCode> to change how a token looks. Without
          one, each token shows its label and a remove button.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
        <DocsParagraph>
          A <DocsCode>TriggerMenu</DocsCode> inside the input suggests tokens
          when someone types a trigger like <DocsCode>@</DocsCode> or{" "}
          <DocsCode>/</DocsCode>. Leave it out when your code supplies the
          tokens.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="ui-sdk-token-input/prompt"
          title="Prompt"
          description={
            <>
              Type <DocsCode>@</DocsCode> for files or <DocsCode>/</DocsCode> at
              the start for skills. A file is pending while it loads, and
              sending marks each skill as running, then done, with{" "}
              <DocsCode>updateToken()</DocsCode>. Enter sends and Shift+Enter
              adds a line.
            </>
          }
        >
          <UiSdkTokenInputPrompt />
        </DocsExample>
        <DocsExample
          file="ui-sdk-token-input/deletion"
          title="Deleting tokens"
          description={
            <>
              <DocsCode>tokenDeletion</DocsCode> sets what Backspace does at a
              token. <DocsCode>whole</DocsCode> removes it,{" "}
              <DocsCode>select</DocsCode> selects it first, and{" "}
              <DocsCode>revert</DocsCode> turns it back into text.
            </>
          }
        >
          <UiSdkTokenInputDeletion />
        </DocsExample>
        <DocsExample
          file="ui-sdk-token-input/controller"
          title="Controller"
          description={
            <>
              A controller from{" "}
              <DocsCode>createTokenInputController()</DocsCode> inserts, updates
              and removes tokens from code. Pass a promise as{" "}
              <DocsCode>resolve</DocsCode> to keep a token pending until it
              settles.
            </>
          }
        >
          <UiSdkTokenInputController />
        </DocsExample>
        <DocsExample
          file="ui-sdk-token-input/form"
          title="Form"
          description={
            <>
              With a <DocsCode>name</DocsCode>, the input submits its text with
              each token written as <DocsCode>[@label](type:value)</DocsCode>.{" "}
              <DocsCode>required</DocsCode> blocks an empty submit, and a reset
              goes back to <DocsCode>defaultValue</DocsCode>.
            </>
          }
        >
          <UiSdkTokenInputForm />
        </DocsExample>
        <DocsExample
          file="ui-sdk-token-input/submit-shortcut"
          title="Submit shortcut"
          description={
            <>
              With <DocsCode>{'submitShortcut="mod+enter"'}</DocsCode>, Enter
              adds a line and Command or Control+Enter sends, which many
              Japanese and Chinese writers prefer.
            </>
          }
        >
          <UiSdkTokenInputSubmitShortcut />
        </DocsExample>
        <DocsExample
          file="ui-sdk-token-input/codec"
          title="Custom codec"
          description={
            <>
              A codec turns tokens into text and back, here as{" "}
              <DocsCode>{"<@id>"}</DocsCode>. With{" "}
              <DocsCode>{'copy="label"'}</DocsCode>, copying writes what people
              read, and pasting back still restores the tokens.
            </>
          }
        >
          <UiSdkTokenInputCodec />
        </DocsExample>
        <DocsExample
          file="ui-sdk-token-input/disabled"
          title="Disabled"
          description="A disabled input can’t be focused or changed, hides the remove buttons and submits nothing."
        >
          <UiSdkTokenInputDisabled />
        </DocsExample>
        <DocsExample
          file="ui-sdk-token-input/read-only"
          title="Read-only"
          description={
            <>
              With <DocsCode>readOnly</DocsCode>, the text stays focusable,
              selectable and submitted, but typing, pastes and drops leave it
              alone.
            </>
          }
        >
          <UiSdkTokenInputReadOnly />
        </DocsExample>
        <DocsExample
          file="ui-sdk-token-input/rtl"
          title="Right to left"
          description="The editor follows the page’s direction, and a token stays one piece inside right-to-left text."
        >
          <UiSdkTokenInputRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Backspace", "Delete"],
              description:
                "Removes the token before or after the caret, as tokenDeletion says.",
            },
            {
              keys: ["←", "→"],
              description:
                "Moves the caret past a token in one press. The caret never stops inside one.",
            },
            {
              keys: ["↑", "↓"],
              description: "Moves through suggestions while the menu is open.",
            },
            {
              keys: ["Enter"],
              description:
                "Sends. While the menu is open, chooses the highlighted suggestion.",
            },
            {
              keys: ["Shift + Enter"],
              description: "Starts a new line.",
            },
            {
              keys: ["⌘ + Enter", "Ctrl + Enter"],
              description:
                "Sends when submitShortcut is mod+enter. Enter then starts a new line.",
            },
            {
              keys: ["⌘ + Z", "Ctrl + Z"],
              description:
                "Undoes the last step. Typing is grouped, and pastes and token changes are steps of their own.",
            },
            {
              keys: ["Esc"],
              description: "Closes the suggestions.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsParagraph>
          The editor is a multiline text box. A trigger menu inside it adds{" "}
          <DocsCode>aria-autocomplete</DocsCode> and{" "}
          <DocsCode>aria-haspopup</DocsCode>, and focus stays in the text while
          the arrow keys move through suggestions. Each token reads as its label
          and its kind, like “routes.ts file”, and inserting or removing one is
          announced. Name the editor with <DocsCode>aria-label</DocsCode> or a
          label around it.
        </DocsParagraph>
        <DocsParagraph>
          Remove buttons are hidden from screen readers, since Backspace removes
          a token from the keyboard. Their hit area grows on touch screens, a
          pending token only pulses when motion is allowed, and a selected token
          gets a system highlight border in forced colors mode.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Each part wraps the UI SDK part of the same name and accepts all of
          its props, including <DocsCode>render</DocsCode> and a{" "}
          <DocsCode>className</DocsCode> that can be a function of the part’s
          state.
        </DocsParagraph>
        <DocsSection title="TokenInput" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: valueType },
              { name: "defaultValue", type: valueType },
              {
                name: "onValueChange",
                type: "(value, details) => void",
                description:
                  "Runs on typing, pastes, menus, undo and controller calls. details lists the reason and any removed tokens.",
              },
              {
                name: "onSubmit",
                type: "(value, details) => void",
                description:
                  "Runs on the submit shortcut, unless a menu is open or an input method is composing.",
              },
              {
                name: "submitShortcut",
                type: '"enter" | "mod+enter"',
                default: '"enter"',
              },
              {
                name: "tokenDeletion",
                type: '"whole" | "select" | "revert"',
                default: '"whole"',
              },
              {
                name: "renderToken",
                type: "(token: Token) => ReactNode",
                description:
                  "Renders a token. Defaults to a TokenInputToken with its label and a remove button.",
              },
              {
                name: "copy",
                type: '"codec" | "label"',
                default: '"codec"',
              },
              { name: "codec", type: "TokenCodec" },
              {
                name: "getTokenDescription",
                type: "(token: Token) => string",
                description:
                  "What a token says to screen readers besides its label.",
              },
              { name: "history", type: "{ limit, groupDelay }" },
              { name: "name", type: "string" },
              { name: "form", type: "string" },
              { name: "required", type: "boolean", default: "false" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "readOnly", type: "boolean", default: "false" },
              {
                name: "controller",
                type: "TokenInputController",
                description: "From createTokenInputController().",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TokenInputEditor" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "placeholder",
                type: "string",
                description:
                  "Shown through aria-placeholder while the input is empty.",
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="token-input-editor"',
                description: "Target the editor in CSS.",
              },
              {
                name: "data-empty",
                description: "Present while the input holds nothing.",
              },
              {
                name: "data-disabled",
                description: "Present when disabled.",
              },
              {
                name: "data-readonly",
                description: "Present when read-only.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TokenInputToken" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="token-input-token"',
                description: "Target a token in CSS.",
              },
              {
                name: "data-token-type",
                description: "The token’s type, like file or mention.",
              },
              {
                name: "data-selected",
                description:
                  "Present while the token is in the selection, or selected for removal.",
              },
              {
                name: "data-pending",
                description: "Present while the token loads.",
              },
              {
                name: "data-unresolved",
                description:
                  "Present while the token needs the user, like an ambiguous mention.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TokenInputTokenRemove" level={3}>
          <DocsParagraph>
            Removes its token and keeps focus in the editor. It renders a Tabler
            X icon unless you pass children, and hides itself while the input is
            disabled or read-only.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="TriggerMenu" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "triggers",
                type: "TriggerDefinition[]",
                description:
                  "The characters that open the menu, the token type each inserts and its items.",
              },
              {
                name: "onSelect",
                type: "(value, details) => void | Promise",
                description:
                  "Runs when an item is chosen. Return a promise to insert the token as pending.",
              },
              { name: "autoHighlight", type: "boolean", default: "true" },
              { name: "loop", type: "boolean", default: "true" },
            ]}
          />
        </DocsSection>
        <DocsSection title="TriggerMenuContent" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "align",
                type: '"start" | "center" | "end"',
                default: '"start"',
              },
              { name: "sideOffset", type: "number", default: "6" },
              { name: "collisionPadding", type: "number", default: "8" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="trigger-menu-content"',
                description: "Target the popup in CSS.",
              },
              {
                name: "data-trigger",
                description:
                  "The trigger of the current match, like @, so each list can look different.",
              },
              {
                name: "data-starting-style",
                description: "Present while the popup animates in.",
              },
              {
                name: "data-ending-style",
                description: "Present while the popup animates out.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TriggerMenuItem" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "T" },
              {
                name: "label",
                type: "string",
                description:
                  "The text inserted and matched, when the content isn’t plain text.",
              },
              { name: "disabled", type: "boolean", default: "false" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: "data-highlighted",
                description:
                  "Present on the highlighted item. Focus stays in the editor.",
              },
              {
                name: "data-disabled",
                description: "Present when the item can’t be chosen.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
