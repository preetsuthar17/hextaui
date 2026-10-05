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
import { ToastAction } from "@/components/examples/toast/action"
import { ToastDedupe } from "@/components/examples/toast/dedupe"
import { ToastDemo } from "@/components/examples/toast/demo"
import { ToastPromise } from "@/components/examples/toast/promise"
import { ToastTypes } from "@/components/examples/toast/types"
import { ToastUpdate } from "@/components/examples/toast/update"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("toast")

const setupCode = `import { Toaster } from "@/components/ui/toast"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}`

const usageCode = `import { toast } from "@/components/ui/toast"

toast("Event created", { description: "Sunday at 9:00 AM" })
toast.success("Payment received")
toast.promise(save(), { loading: "Saving…", success: "Saved", error: "Couldn't save" })`

export default function Page() {
  return (
    <DocsComponentPage slug="toast">
      <DocsExample file="toast/demo">
        <ToastDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "@tabler/icons-react", "cn"]}
        files={[
          "components/ui/toast.tsx",
          "components/ui/button.tsx",
          "components/ui/spinner.tsx",
        ]}
      />

      <DocsSection title="Usage">
        <DocsParagraph>
          Add <DocsCode>{"<Toaster />"}</DocsCode> once, near the root of your
          app.
        </DocsParagraph>
        <DocsCodeBlock code={setupCode} />
        <DocsParagraph>
          Then call <DocsCode>toast</DocsCode> from anywhere, including outside
          React components.
        </DocsParagraph>
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Toasts stack into a neat pile with the newest in front. Hover or focus
          the pile to fan it out; every timer pauses while you read. Swipe a
          toast toward its edge to dismiss it.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="toast/types"
          title="Types"
          description="Every toast uses the same calm surface; only the icon carries the color."
        >
          <ToastTypes />
        </DocsExample>
        <DocsExample
          file="toast/promise"
          title="Promise"
          description={
            <>
              <DocsCode>toast.promise</DocsCode> shows a spinner, then turns
              into a success or error toast in place, with the icon popping in
              as it changes.
            </>
          }
        >
          <ToastPromise />
        </DocsExample>
        <DocsExample
          file="toast/action"
          title="Action"
          description={
            <>
              Pass <DocsCode>action</DocsCode> for a button such as Undo.
              Clicking it also dismisses the toast.
            </>
          }
        >
          <ToastAction />
        </DocsExample>
        <DocsExample
          file="toast/update"
          title="Update in place"
          description={
            <>
              Keep the id from <DocsCode>toast.loading</DocsCode> and change it
              with <DocsCode>toast.update</DocsCode>, including its type.
            </>
          }
        >
          <ToastUpdate />
        </DocsExample>
        <DocsExample
          file="toast/dedupe"
          title="No duplicates"
          description={
            <>
              Give a toast an <DocsCode>id</DocsCode> and calling it again
              updates the existing one instead of stacking a copy.
            </>
          }
        >
          <ToastDedupe />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["F6"],
              description: "Moves focus into the toasts and fans them out.",
            },
            {
              keys: ["Tab"],
              description: "Moves between toast actions and close buttons.",
            },
            {
              keys: ["Esc"],
              description: "Dismisses the focused toast.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Toasts are announced politely; <DocsCode>toast.error</DocsCode> is
            announced right away.
          </li>
          <li>
            Timers pause while the pointer or focus is on the toasts, so nobody
            has to race a countdown.
          </li>
          <li>
            Close buttons appear on hover and focus, and are always visible on
            touch screens.
          </li>
          <li>With reduced motion, toasts fade instead of sliding.</li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="Toaster" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "position",
                type: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"',
                default: '"bottom-right"',
                description: "Phones always use the full width.",
              },
              {
                name: "limit",
                type: "number",
                default: "3",
                description: "Toasts shown at once; older ones fade out.",
              },
              {
                name: "timeout",
                type: "number",
                default: "5000",
                description: "Default time on screen, in ms.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="toaster"',
                description: "The viewport, with data-position.",
              },
              {
                name: 'data-slot="toast"',
                description:
                  "Each toast, with data-type, data-expanded and data-swiping.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="toast()" level={3}>
          <DocsPropsTable
            props={[
              { name: "description", type: "ReactNode" },
              {
                name: "action",
                type: "{ label: ReactNode; onClick?: (event) => void }",
              },
              {
                name: "id",
                type: "string",
                description: "Reuse to update instead of duplicating.",
              },
              {
                name: "timeout",
                type: "number",
                description:
                  "Defaults to the Toaster timeout. Long messages stay up longer, about 250 words a minute.",
              },
              { name: "priority", type: '"low" | "high"', default: '"low"' },
              { name: "onClose", type: "() => void" },
              { name: "onRemove", type: "() => void" },
            ]}
          />
          <DocsParagraph>
            Also <DocsCode>toast.success</DocsCode>,{" "}
            <DocsCode>toast.error</DocsCode>, <DocsCode>toast.warning</DocsCode>
            , <DocsCode>toast.info</DocsCode>,{" "}
            <DocsCode>toast.loading</DocsCode>,{" "}
            <DocsCode>toast.promise</DocsCode>,{" "}
            <DocsCode>toast.update</DocsCode> and{" "}
            <DocsCode>toast.dismiss</DocsCode>. Each returns or takes the
            toast&apos;s id.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
