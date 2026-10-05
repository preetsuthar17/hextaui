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
import { AlertDialogAsyncAction } from "@/components/examples/alert-dialog/async-action"
import { AlertDialogControlled } from "@/components/examples/alert-dialog/controlled"
import { AlertDialogDemo } from "@/components/examples/alert-dialog/demo"
import { AlertDialogDetachedTriggers } from "@/components/examples/alert-dialog/detached-triggers"
import { AlertDialogLongContent } from "@/components/examples/alert-dialog/long-content"
import { AlertDialogWithMedia } from "@/components/examples/alert-dialog/media"
import { AlertDialogNested } from "@/components/examples/alert-dialog/nested"
import { AlertDialogRtl } from "@/components/examples/alert-dialog/rtl"
import { AlertDialogSmall } from "@/components/examples/alert-dialog/small"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("alert-dialog")

const importCode = `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"`

const usageCode = `<AlertDialog>
  <AlertDialogTrigger render={<Button variant="outline" />}>
    Delete
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this project?</AlertDialogTitle>
      <AlertDialogDescription>This can’t be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `AlertDialog
├── AlertDialogTrigger
└── AlertDialogContent
    ├── AlertDialogHeader
    │   ├── AlertDialogMedia
    │   ├── AlertDialogTitle
    │   └── AlertDialogDescription
    └── AlertDialogFooter
        ├── AlertDialogCancel
        └── AlertDialogAction`

export default function Page() {
  return (
    <DocsComponentPage slug="alert-dialog">
      <DocsExample file="alert-dialog/demo">
        <AlertDialogDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={[
          "components/ui/alert-dialog.tsx",
          "components/ui/sheet.tsx",
          "components/ui/button.tsx",
        ]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="alert-dialog/async-action"
          title="Async action"
          description={
            <>
              Return a promise from the <DocsCode>onClick</DocsCode> of{" "}
              <DocsCode>{"<AlertDialogAction />"}</DocsCode>. The button shows a
              spinner and the dialog can’t be closed until the promise settles.
              It closes when it resolves and stays open when it rejects, so
              people can try again.
            </>
          }
        >
          <AlertDialogAsyncAction />
        </DocsExample>
        <DocsExample
          file="alert-dialog/media"
          title="Media"
          description={
            <>
              <DocsCode>{"<AlertDialogMedia />"}</DocsCode> places an icon
              beside the title on desktop and above it on phones. Use{" "}
              <DocsCode>{'variant="destructive"'}</DocsCode> for destructive
              actions.
            </>
          }
        >
          <AlertDialogWithMedia />
        </DocsExample>
        <DocsExample
          file="alert-dialog/small"
          title="Small"
          description={
            <>
              <DocsCode>{'size="sm"'}</DocsCode> centers the content and lays
              the buttons out side by side, for short questions.
            </>
          }
        >
          <AlertDialogSmall />
        </DocsExample>
        <DocsExample
          file="alert-dialog/detached-triggers"
          title="Detached triggers"
          description={
            <>
              Create a handle with{" "}
              <DocsCode>createAlertDialogHandle()</DocsCode> to share one dialog
              between many triggers. Each trigger passes its own{" "}
              <DocsCode>payload</DocsCode>, which the dialog reads through a
              render function.
            </>
          }
        >
          <AlertDialogDetachedTriggers />
        </DocsExample>
        <DocsExample
          file="alert-dialog/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>open</DocsCode> and{" "}
              <DocsCode>onOpenChange</DocsCode> to open it from code, without a
              trigger. Focus still lands on Cancel.
            </>
          }
        >
          <AlertDialogControlled />
        </DocsExample>
        <DocsExample
          file="alert-dialog/nested"
          title="Nested"
          description="A dialog opened from inside another stacks on top. The parent scales back while the child is open and comes forward again when it closes."
        >
          <AlertDialogNested />
        </DocsExample>
        <DocsExample
          file="alert-dialog/long-content"
          title="Long content"
          description="Content taller than the screen scrolls inside the dialog while the page stays locked."
        >
          <AlertDialogLongContent />
        </DocsExample>
        <DocsExample
          file="alert-dialog/rtl"
          title="Right to left"
          description={
            <>
              Pass <DocsCode>dir</DocsCode> to the content as well, because it
              renders in a portal outside your RTL container. Arrow keys in the
              footer follow the reading direction.
            </>
          }
        >
          <AlertDialogRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Enter", "Space"],
              description:
                "On the trigger, opens the dialog and moves focus to Cancel.",
            },
            {
              keys: ["Tab", "Shift+Tab"],
              description: "Moves focus between controls. Focus stays inside.",
            },
            {
              keys: ["←", "→", "↑", "↓"],
              description:
                "Moves between the footer buttons and wraps around. Left and right follow the reading direction.",
            },
            {
              keys: ["Esc"],
              description:
                "Closes the dialog and returns focus to the trigger. Ignored while an async action is running.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The content has <DocsCode>{'role="alertdialog"'}</DocsCode> and is
            labelled by its title and described by its description.
          </li>
          <li>
            Focus starts on <DocsCode>{"<AlertDialogCancel />"}</DocsCode>, the
            least destructive choice. Pass <DocsCode>initialFocus</DocsCode> to
            change it.
          </li>
          <li>
            Clicking the backdrop doesn’t close it, so a decision is never
            dismissed by accident. Set{" "}
            <DocsCode>{"disablePointerDismissal={false}"}</DocsCode> to allow
            it.
          </li>
          <li>
            On phones it becomes a bottom sheet that can be swiped down to
            cancel. While an action is pending, swiping, Esc and Cancel are
            blocked and the buttons stay focusable.
          </li>
          <li>With reduced motion on, it fades instead of scaling.</li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI drawer, through{" "}
          <DocsCode>{"<Sheet />"}</DocsCode>. Every part accepts the props of
          the primitive or element it wraps.
        </DocsParagraph>
        <DocsSection title="AlertDialog" level={3}>
          <DocsPropsTable
            props={[
              { name: "open", type: "boolean" },
              { name: "defaultOpen", type: "boolean", default: "false" },
              {
                name: "onOpenChange",
                type: "(open: boolean, details) => void",
                description:
                  "Not called for closes blocked by a pending action.",
              },
              {
                name: "onOpenChangeComplete",
                type: "(open: boolean) => void",
                description: "Called after the open or close animation.",
              },
              {
                name: "disablePointerDismissal",
                type: "boolean",
                default: "true",
                description: "Keeps the dialog open on backdrop clicks.",
              },
              {
                name: "handle",
                type: "AlertDialogHandle<Payload>",
                description: "Connects detached triggers.",
              },
              {
                name: "actionsRef",
                type: "RefObject<{ close, unmount }>",
                description: "Close or unmount the dialog imperatively.",
              },
              {
                name: "children",
                type: "ReactNode | ({ payload }) => ReactNode",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AlertDialogTrigger" level={3}>
          <DocsPropsTable
            props={[
              { name: "handle", type: "AlertDialogHandle<Payload>" },
              {
                name: "payload",
                type: "Payload",
                description: "Passed to the dialog’s render function.",
              },
              { name: "render", type: renderType, default: "<button>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="alert-dialog-trigger"',
                description: "Target triggers in CSS.",
              },
              {
                name: "data-popup-open",
                description: "Present while its dialog is open.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AlertDialogContent" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "size",
                type: '"default" | "sm"',
                default: '"default"',
              },
              {
                name: "initialFocus",
                type: "boolean | RefObject | (openType) => HTMLElement | boolean",
                default: "Cancel button",
              },
              {
                name: "finalFocus",
                type: "boolean | RefObject | (closeType) => HTMLElement | boolean",
                default: "The trigger",
              },
              {
                name: "dir",
                type: '"ltr" | "rtl"',
                description: "Set it when the dialog should be right to left.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="alert-dialog-content"',
                description: "Target the dialog in CSS.",
              },
              { name: "data-size", description: "The current size." },
              { name: "data-open", description: "Present while open." },
              {
                name: "data-starting-style",
                description: "Present while the dialog animates in.",
              },
              {
                name: "data-ending-style",
                description: "Present while the dialog animates out.",
              },
              {
                name: "data-nested-drawer-open",
                description: "Present while a nested dialog is open on top.",
              },
              {
                name: "data-swiping",
                description: "Present while it is being swiped on a phone.",
              },
              {
                name: "--nested-drawers",
                description: "How many dialogs are open on top of this one.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AlertDialogHeader" level={3}>
          <DocsParagraph>
            A <DocsCode>{"<div>"}</DocsCode> that stacks the media, title and
            description.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="alert-dialog-header"',
                description: "Target the header in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AlertDialogMedia" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "destructive"',
                default: '"default"',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="alert-dialog-media"',
                description: "Target the media in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AlertDialogTitle" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<h2>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="alert-dialog-title"',
                description: "Target the title in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AlertDialogDescription" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "render",
                type: renderType,
                default: "<p>",
                description:
                  "Use render={<div />} when it holds several paragraphs.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="alert-dialog-description"',
                description: "Target the description in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AlertDialogFooter" level={3}>
          <DocsParagraph>
            A <DocsCode>{"<div>"}</DocsCode> for the buttons. Buttons stack full
            width on phones, and arrow keys move between them.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="alert-dialog-footer"',
                description: "Target the footer in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AlertDialogAction" level={3}>
          <DocsParagraph>
            A <DocsCode>{"<Button />"}</DocsCode> that closes the dialog when
            clicked. It accepts every Button prop.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "onClick",
                type: "(event) => void | PromiseLike<unknown>",
                description:
                  "Return a promise to show a spinner and keep the dialog open until it settles. Call event.preventDefault() to keep it open.",
              },
              { name: "variant", type: "ButtonVariant", default: '"default"' },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="alert-dialog-action"',
                description: "Target actions in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AlertDialogCancel" level={3}>
          <DocsPropsTable
            props={[
              { name: "variant", type: "ButtonVariant", default: '"outline"' },
              { name: "size", type: "ButtonSize" },
              {
                name: "disabled",
                type: "boolean",
                description: "Also disabled while an action is pending.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="alert-dialog-cancel"',
                description:
                  "Target the cancel button in CSS. It receives initial focus.",
              },
              {
                name: "data-disabled",
                description: "Present while disabled.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AlertDialogPortal and AlertDialogOverlay" level={3}>
          <DocsParagraph>
            <DocsCode>{"<AlertDialogContent />"}</DocsCode> already renders
            both. Use them only when composing a custom popup.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "keepMounted",
                type: "boolean",
                default: "false",
                description:
                  "On the portal, keeps the dialog in the DOM while closed.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="createAlertDialogHandle" level={3}>
          <DocsParagraph>
            Returns a handle that connects{" "}
            <DocsCode>{"<AlertDialogTrigger />"}</DocsCode> elements anywhere on
            the page to one <DocsCode>{"<AlertDialog />"}</DocsCode>. Type the
            payload with a generic:{" "}
            <DocsCode>{"createAlertDialogHandle<{ name: string }>()"}</DocsCode>
            .
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
