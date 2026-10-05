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
import { DocsPropsTable } from "@/components/docs/docs-props-table"
import { UseAutosizeControlled } from "@/components/examples/use-autosize/controlled"
import { UseAutosizeDemo } from "@/components/examples/use-autosize/demo"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("use-autosize")

const importCode = `import { useAutosize } from "@/hooks/use-autosize"`

const usageCode = `const ref = React.useRef<HTMLTextAreaElement>(null)
useAutosize(ref, true, value)

<textarea
  ref={ref}
  rows={1}
  value={value}
  onChange={(event) => setValue(event.target.value)}
  className="min-h-[calc(1lh+1rem)] max-h-[calc(8lh+1rem)] resize-none"
/>`

const boundsCode = `min-h-[calc(2lh+1rem)]   at least two lines plus the vertical padding
max-h-[calc(8lh+1rem)]   then scroll after eight
max-h-64                 or any fixed length`

export default function Page() {
  return (
    <DocsComponentPage slug="use-autosize">
      <DocsExample file="use-autosize/demo">
        <UseAutosizeDemo />
      </DocsExample>

      <DocsInstall dependencies={[]} files={["hooks/use-autosize.ts"]} />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          <DocsCode>{"<Textarea autoResize>"}</DocsCode> already uses this hook.
          Call it yourself when you render your own{" "}
          <DocsCode>{"<textarea>"}</DocsCode>, such as a chat composer or an
          inline editor.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="How it works">
        <DocsParagraph>
          On each change the hook sets the height to <DocsCode>auto</DocsCode>,
          reads the natural <DocsCode>scrollHeight</DocsCode>, and clamps it to
          the element&apos;s own CSS <DocsCode>min-height</DocsCode> and{" "}
          <DocsCode>max-height</DocsCode>. All of that happens before paint, so
          you never see the collapsed frame. The bounds stay in your CSS, so
          they can be responsive or use <DocsCode>lh</DocsCode> to count lines.
        </DocsParagraph>
        <DocsCodeBlock code={boundsCode} lang="bash" />
        <DocsList>
          <li>
            Height changes animate over 180ms, and a change that comes in
            mid-animation starts from the current height, so fast typing never
            jumps. Under reduced motion the height snaps.
          </li>
          <li>
            Past <DocsCode>max-height</DocsCode> the textarea scrolls. Otherwise
            its scrollbar stays hidden, so it doesn&apos;t flash on each new
            line.
          </li>
          <li>
            It refits when the width changes, because text that wraps
            differently changes the height.
          </li>
          <li>
            It listens for <DocsCode>input</DocsCode> on{" "}
            <DocsCode>window</DocsCode> and only measures. It never reads or
            writes the value, so keystrokes are never delayed or dropped.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="use-autosize/controlled"
          title="Controlled values"
          description={
            <>
              Typing fires <DocsCode>input</DocsCode>, but setting{" "}
              <DocsCode>value</DocsCode> from code doesn&apos;t. Pass the value
              as the third argument and the textarea refits when you insert a
              template or clear it.
            </>
          }
        >
          <UseAutosizeControlled />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Good to know">
        <DocsList>
          <li>
            Set <DocsCode>rows={"{1}"}</DocsCode> and{" "}
            <DocsCode>resize-none</DocsCode>. A manual resize handle fights the
            automatic height.
          </li>
          <li>
            Turning <DocsCode>enabled</DocsCode> off or unmounting removes the
            inline height and overflow, handing the size back to your CSS.
          </li>
          <li>
            On touch screens, use at least 16px text in the textarea, or iOS
            zooms in when it&apos;s focused.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection
          title="useAutosize(ref, enabled, value)"
          id="parameters"
          level={3}
        >
          <DocsPropsTable
            props={[
              {
                name: "ref",
                type: "RefObject<HTMLTextAreaElement | null>",
                description: "The textarea to size.",
              },
              {
                name: "enabled",
                type: "boolean",
                description: "Whether to size automatically.",
              },
              {
                name: "value",
                type: "unknown",
                description:
                  "The controlled value. Pass undefined for uncontrolled textareas.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="Used by" level={3}>
          <DocsParagraph>
            <DocsCode>Textarea</DocsCode> and{" "}
            <DocsCode>InputGroupTextarea</DocsCode>.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
