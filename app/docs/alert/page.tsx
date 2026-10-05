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
import { AlertActions } from "@/components/examples/alert/actions"
import { AlertCancelDismiss } from "@/components/examples/alert/cancel-dismiss"
import { AlertControlled } from "@/components/examples/alert/controlled"
import { AlertDemo } from "@/components/examples/alert/demo"
import { AlertDismissible } from "@/components/examples/alert/dismissible"
import { AlertInserted } from "@/components/examples/alert/inserted"
import { AlertPartialContent } from "@/components/examples/alert/partial-content"
import { AlertRichContent } from "@/components/examples/alert/rich-content"
import { AlertRtl } from "@/components/examples/alert/rtl"
import { AlertSoft } from "@/components/examples/alert/soft"
import { AlertVariants } from "@/components/examples/alert/variants"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("alert")

const importCode = `import {
  Alert,
  AlertAction,
  AlertClose,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"`

const usageCode = `<Alert>
  <IconTerminal2 />
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>
    You can add components to your app using the CLI.
  </AlertDescription>
</Alert>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `Alert
├── AlertTitle
├── AlertDescription
├── AlertAction
└── AlertClose`

export default function Page() {
  return (
    <DocsComponentPage slug="alert">
      <DocsExample file="alert/demo">
        <AlertDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={[
          "components/ui/alert.tsx",
          "components/ui/button.tsx",
          "lib/motion.ts",
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
          file="alert/variants"
          title="Variants"
          description={
            <>
              <DocsCode>variant</DocsCode> colors only the icon, so the surface
              stays neutral and status reads at a glance without shouting.
            </>
          }
        >
          <AlertVariants />
        </DocsExample>
        <DocsExample
          file="alert/soft"
          title="Soft"
          description={
            <>
              <DocsCode>{'appearance="soft"'}</DocsCode> drops the border and
              tints the whole surface with the variant color.
            </>
          }
        >
          <AlertSoft />
        </DocsExample>
        <DocsExample
          file="alert/partial-content"
          title="Partial content"
          description="Title only, description only and no icon all line up without extra classes. The grid places each part in its own column."
        >
          <AlertPartialContent />
        </DocsExample>
        <DocsExample
          file="alert/actions"
          title="Actions"
          description={
            <>
              Put buttons in <DocsCode>{"<AlertAction />"}</DocsCode>. They
              align with the first line of the title, even when it wraps.
            </>
          }
        >
          <AlertActions />
        </DocsExample>
        <DocsExample
          file="alert/dismissible"
          title="Dismissible"
          description={
            <>
              Add <DocsCode>{"<AlertClose />"}</DocsCode> to let people dismiss
              it. The alert collapses smoothly and the content below slides up.
              Dismiss it from the keyboard and focus moves to the next control,
              here “Reset”.
            </>
          }
        >
          <AlertDismissible />
        </DocsExample>
        <DocsExample
          file="alert/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>open</DocsCode> and{" "}
              <DocsCode>onOpenChange</DocsCode> to drive it from your own state.
              It animates both in and out.
            </>
          }
        >
          <AlertControlled />
        </DocsExample>
        <DocsExample
          file="alert/cancel-dismiss"
          title="Cancel a dismiss"
          description={
            <>
              Call <DocsCode>event.preventDefault()</DocsCode> in the close
              button’s <DocsCode>onClick</DocsCode> to keep the alert open, for
              example to ask for confirmation first.
            </>
          }
        >
          <AlertCancelDismiss />
        </DocsExample>
        <DocsExample
          file="alert/inserted"
          title="Inserted after load"
          description="Alerts that mount after the page has loaded fade and slide in, and screen readers announce them. Alerts already in the server HTML appear without motion."
        >
          <AlertInserted />
        </DocsExample>
        <DocsExample
          file="alert/rich-content"
          title="Rich content"
          description={
            <>
              Inline icons and links inside the description keep their own
              style. Use <DocsCode>render</DocsCode> to give the title a heading
              level.
            </>
          }
        >
          <AlertRichContent />
        </DocsExample>
        <DocsExample
          file="alert/rtl"
          title="Right to left"
          description="The icon, content and close button mirror with the reading direction."
        >
          <AlertRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Moves focus to links, actions and the close button inside the alert.",
            },
            {
              keys: ["Enter", "Space"],
              description:
                "Activates the focused close button. Once the alert has collapsed, focus moves to the next focusable element, or the previous one when nothing follows.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            <DocsCode>destructive</DocsCode> and <DocsCode>warning</DocsCode>{" "}
            alerts get <DocsCode>{'role="alert"'}</DocsCode> and are announced
            right away. Every other variant gets{" "}
            <DocsCode>{'role="status"'}</DocsCode> and waits for a pause.
          </li>
          <li>
            The close button is labelled “Dismiss”. Pass{" "}
            <DocsCode>aria-label</DocsCode> to translate it.
          </li>
          <li>Focus is never lost when a focused alert closes.</li>
          <li>
            With reduced motion on, alerts appear and disappear instantly.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Every part accepts the attributes of the element it renders. The
          variants are exported as <DocsCode>alertVariants</DocsCode> for
          styling other elements the same way.
        </DocsParagraph>
        <DocsSection title="Alert" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "destructive" | "success" | "info" | "warning"',
                default: '"default"',
                description:
                  "Colors the icon. destructive and warning are announced assertively.",
              },
              {
                name: "appearance",
                type: '"outline" | "soft"',
                default: '"outline"',
              },
              { name: "open", type: "boolean" },
              { name: "defaultOpen", type: "boolean", default: "true" },
              {
                name: "onOpenChange",
                type: "(open: boolean) => void",
                description: "Called when the close button is pressed.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="alert"',
                description: "Target the alert in CSS.",
              },
              { name: "data-variant", description: "The current variant." },
              {
                name: "data-appearance",
                description: "The current appearance.",
              },
              {
                name: "data-ending-style",
                description:
                  "Present while the alert collapses after a dismiss.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AlertTitle" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<div>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="alert-title"',
                description: "Target titles in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AlertDescription" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<div>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="alert-description"',
                description:
                  "Target descriptions in CSS. Plain links inside are underlined for you.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AlertAction" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<div>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="alert-action"',
                description: "Target the action area in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AlertClose" level={3}>
          <DocsParagraph>
            A ghost <DocsCode>{"<Button />"}</DocsCode> that closes the nearest
            alert. It accepts every Button prop and must be used inside{" "}
            <DocsCode>{"<Alert />"}</DocsCode>.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "aria-label",
                type: "string",
                default: '"Dismiss"',
              },
              {
                name: "children",
                type: "ReactNode",
                default: "<IconX />",
              },
              {
                name: "onClick",
                type: "(event: MouseEvent) => void",
                description:
                  "Call event.preventDefault() to keep the alert open.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="alert-close"',
                description: "Target the close button in CSS.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
