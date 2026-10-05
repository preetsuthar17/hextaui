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
import { DialogControlled } from "@/components/examples/dialog/controlled"
import { DialogCustomCloseButton } from "@/components/examples/dialog/custom-close-button"
import { DialogDemo } from "@/components/examples/dialog/demo"
import { DialogDetachedTriggers } from "@/components/examples/dialog/detached-triggers"
import { DialogForm } from "@/components/examples/dialog/form"
import { DialogNested } from "@/components/examples/dialog/nested"
import { DialogNoCloseButton } from "@/components/examples/dialog/no-close-button"
import { DialogRtl } from "@/components/examples/dialog/rtl"
import { DialogScrollableContent } from "@/components/examples/dialog/scrollable-content"
import { DialogSizes } from "@/components/examples/dialog/sizes"
import { DialogStickyFooter } from "@/components/examples/dialog/sticky-footer"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("dialog")

const importCode = `import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"`

const usageCode = `<Dialog>
  <DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Make changes to your profile.</DialogDescription>
    </DialogHeader>
    <DialogBody>{/* fields */}</DialogBody>
    <DialogFooter>
      <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
      <Button>Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `Dialog
├── DialogTrigger
└── DialogContent
    ├── DialogHeader
    │   ├── DialogTitle
    │   └── DialogDescription
    ├── DialogBody
    └── DialogFooter
        └── DialogClose`

export default function Page() {
  return (
    <DocsComponentPage slug="dialog">
      <DocsExample file="dialog/demo">
        <DialogDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={[
          "components/ui/dialog.tsx",
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
          file="dialog/form"
          title="Form"
          description={
            <>
              Keep the form in <DocsCode>{"<DialogBody />"}</DocsCode> and point
              the submit button in the footer at it with{" "}
              <DocsCode>form</DocsCode>. Enter submits, and the dialog closes
              through <DocsCode>onOpenChange</DocsCode> once the value is saved.
            </>
          }
        >
          <DialogForm />
        </DocsExample>
        <DocsExample
          file="dialog/custom-close-button"
          title="Custom close button"
          description={
            <>
              Hide the corner button with{" "}
              <DocsCode>{"showCloseButton={false}"}</DocsCode> on the content
              and add a Close button to the footer with{" "}
              <DocsCode>showCloseButton</DocsCode>.
            </>
          }
        >
          <DialogCustomCloseButton />
        </DocsExample>
        <DocsExample
          file="dialog/no-close-button"
          title="No close button"
          description="Without a button the dialog still closes with Esc, a click outside, or a swipe down on phones."
        >
          <DialogNoCloseButton />
        </DocsExample>
        <DocsExample
          file="dialog/sizes"
          title="Sizes"
          description={
            <>
              <DocsCode>size</DocsCode> sets the maximum width on larger
              screens: <DocsCode>sm</DocsCode>, <DocsCode>default</DocsCode> or{" "}
              <DocsCode>lg</DocsCode>.
            </>
          }
        >
          <DialogSizes />
        </DocsExample>
        <DocsExample
          file="dialog/sticky-footer"
          title="Sticky footer"
          description={
            <>
              Long content in <DocsCode>{"<DialogBody />"}</DocsCode> scrolls
              while the header and footer stay in place, so the actions are
              always in reach.
            </>
          }
        >
          <DialogStickyFooter />
        </DocsExample>
        <DocsExample
          file="dialog/scrollable-content"
          title="Scrollable content"
          description="Without a footer the body scrolls under the header and keeps its bottom padding."
        >
          <DialogScrollableContent />
        </DocsExample>
        <DocsExample
          file="dialog/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>open</DocsCode> and{" "}
              <DocsCode>onOpenChange</DocsCode> to open it from code, without a
              trigger.
            </>
          }
        >
          <DialogControlled />
        </DocsExample>
        <DocsExample
          file="dialog/nested"
          title="Nested"
          description="A dialog or alert dialog opened from inside another stacks on top. The parent steps back and a lighter backdrop covers it. Esc closes only the top one."
        >
          <DialogNested />
        </DocsExample>
        <DocsExample
          file="dialog/detached-triggers"
          title="Detached triggers"
          description={
            <>
              Create a handle with <DocsCode>createDialogHandle()</DocsCode> to
              share one dialog between many triggers. Each trigger passes a{" "}
              <DocsCode>payload</DocsCode> that the dialog reads through a
              render function.
            </>
          }
        >
          <DialogDetachedTriggers />
        </DocsExample>
        <DocsExample
          file="dialog/rtl"
          title="Right to left"
          description={
            <>
              Pass <DocsCode>dir</DocsCode> to the content as well, because it
              renders in a portal outside your RTL container.
            </>
          }
        >
          <DialogRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Enter", "Space"],
              description:
                "On the trigger, opens the dialog and moves focus to its first control.",
            },
            {
              keys: ["Tab", "Shift+Tab"],
              description: "Moves focus between controls. Focus stays inside.",
            },
            {
              keys: ["Esc"],
              description:
                "Closes the top dialog and returns focus to its trigger.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The content has <DocsCode>{'role="dialog"'}</DocsCode> and is
            labelled by its title and described by its description. Always
            include a <DocsCode>{"<DialogTitle />"}</DocsCode>.
          </li>
          <li>
            With a mouse or keyboard, focus starts on the first control. With
            touch it starts on the dialog itself, so the on-screen keyboard
            doesn’t cover the content before people choose a field. Pass{" "}
            <DocsCode>initialFocus</DocsCode> to change it.
          </li>
          <li>
            The corner close button is labelled “Close”, and the page behind is
            inert and can’t scroll.
          </li>
          <li>
            On phones it becomes a bottom sheet that can be swiped down to
            close. With reduced motion on, it fades instead of scaling or
            sliding.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI drawer, through{" "}
          <DocsCode>{"<Sheet />"}</DocsCode>. Every part accepts the props of
          the primitive or element it wraps.
        </DocsParagraph>
        <DocsSection title="Dialog" level={3}>
          <DocsPropsTable
            props={[
              { name: "open", type: "boolean" },
              { name: "defaultOpen", type: "boolean", default: "false" },
              {
                name: "onOpenChange",
                type: "(open: boolean, details) => void",
              },
              {
                name: "onOpenChangeComplete",
                type: "(open: boolean) => void",
                description: "Called after the open or close animation.",
              },
              {
                name: "modal",
                type: 'boolean | "trap-focus"',
                default: "true",
              },
              {
                name: "disablePointerDismissal",
                type: "boolean",
                default: "false",
                description: "Keeps the dialog open on clicks outside.",
              },
              {
                name: "handle",
                type: "DialogHandle<Payload>",
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
        <DocsSection title="DialogTrigger" level={3}>
          <DocsPropsTable
            props={[
              { name: "handle", type: "DialogHandle<Payload>" },
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
                name: 'data-slot="dialog-trigger"',
                description: "Target triggers in CSS.",
              },
              {
                name: "data-popup-open",
                description: "Present while its dialog is open.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DialogContent" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "size",
                type: '"sm" | "default" | "lg"',
                default: '"default"',
              },
              {
                name: "showCloseButton",
                type: "boolean",
                default: "true",
                description: "Shows the close button in the corner.",
              },
              {
                name: "initialFocus",
                type: "boolean | RefObject | (openType) => HTMLElement | boolean",
                default: "First control, or the dialog on touch",
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
                name: 'data-slot="dialog-content"',
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
        <DocsSection title="DialogHeader" level={3}>
          <DocsParagraph>
            A <DocsCode>{"<div>"}</DocsCode> that stacks the title and
            description. It leaves room for the close button.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="dialog-header"',
                description: "Target the header in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DialogBody" level={3}>
          <DocsParagraph>
            A <DocsCode>{"<div>"}</DocsCode> that scrolls when the content is
            taller than the screen, keeping the header and footer in place.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="dialog-body"',
                description: "Target the body in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DialogFooter" level={3}>
          <DocsParagraph>
            A <DocsCode>{"<div>"}</DocsCode> for the actions. Buttons stack full
            width on phones, with the first one at the bottom.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "showCloseButton",
                type: "boolean",
                default: "false",
                description: "Adds an outline Close button after the children.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="dialog-footer"',
                description: "Target the footer in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DialogTitle" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<h2>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="dialog-title"',
                description: "Target the title in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DialogDescription" level={3}>
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
                name: 'data-slot="dialog-description"',
                description: "Target the description in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DialogClose" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<button>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="dialog-close"',
                description: "Target close buttons in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DialogPortal and DialogOverlay" level={3}>
          <DocsParagraph>
            <DocsCode>{"<DialogContent />"}</DocsCode> already renders both. Use
            them only when composing a custom popup.
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
        <DocsSection title="createDialogHandle" level={3}>
          <DocsParagraph>
            Returns a handle that connects{" "}
            <DocsCode>{"<DialogTrigger />"}</DocsCode> elements anywhere on the
            page to one <DocsCode>{"<Dialog />"}</DocsCode>. Type the payload
            with a generic:{" "}
            <DocsCode>{"createDialogHandle<{ name: string }>()"}</DocsCode>.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
