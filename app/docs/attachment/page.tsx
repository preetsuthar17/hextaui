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
import { AttachmentBrokenImage } from "@/components/examples/attachment/broken-image"
import { AttachmentComposer } from "@/components/examples/attachment/composer"
import { AttachmentDemo } from "@/components/examples/attachment/demo"
import { AttachmentGroupDemo } from "@/components/examples/attachment/group"
import { AttachmentImage } from "@/components/examples/attachment/image"
import { AttachmentLongNames } from "@/components/examples/attachment/long-names"
import { AttachmentRtl } from "@/components/examples/attachment/rtl"
import { AttachmentSizes } from "@/components/examples/attachment/sizes"
import { AttachmentStates } from "@/components/examples/attachment/states"
import { AttachmentStress } from "@/components/examples/attachment/stress"
import { AttachmentTriggerDemo } from "@/components/examples/attachment/trigger"
import { AttachmentUploadFlow } from "@/components/examples/attachment/upload-flow"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("attachment")

const importCode = `import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"`

const usageCode = `<Attachment>
  <AttachmentMedia>
    <IconFileText />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>report.pdf</AttachmentTitle>
    <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label="Remove report.pdf">
      <IconX />
    </AttachmentAction>
  </AttachmentActions>
</Attachment>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `Attachment
├── AttachmentMedia
├── AttachmentContent
│   ├── AttachmentTitle
│   └── AttachmentDescription
├── AttachmentActions
│   └── AttachmentAction
└── AttachmentTrigger

AttachmentGroup
└── Attachment`

export default function Page() {
  return (
    <DocsComponentPage slug="attachment">
      <DocsExample file="attachment/demo">
        <AttachmentDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={[
          "components/ui/attachment.tsx",
          "components/ui/aspect-ratio.tsx",
          "components/ui/skeleton.tsx",
          "components/ui/button.tsx",
          "components/ui/progress.tsx",
          "components/ui/scroll-area.tsx",
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
          file="attachment/image"
          title="Image"
          description={
            <>
              <DocsCode>{'variant="image"'}</DocsCode> on{" "}
              <DocsCode>{"<AttachmentMedia />"}</DocsCode> shows a square
              thumbnail that shimmers while it loads. Set{" "}
              <DocsCode>{'orientation="vertical"'}</DocsCode> for a tile with
              the preview on top.
            </>
          }
        >
          <AttachmentImage />
        </DocsExample>
        <DocsExample
          file="attachment/states"
          title="States"
          description={
            <>
              <DocsCode>state</DocsCode> covers the whole upload lifecycle. Idle
              files get a dashed border, uploading and processing titles
              shimmer, and errors turn the media and description red.
            </>
          }
        >
          <AttachmentStates />
        </DocsExample>
        <DocsExample
          file="attachment/upload-flow"
          title="Upload flow"
          description={
            <>
              Pass <DocsCode>progress</DocsCode> while{" "}
              <DocsCode>{'state="uploading"'}</DocsCode> to draw a thin progress
              bar along the bottom edge. Image previews stay dimmed until the
              upload is done.
            </>
          }
        >
          <AttachmentUploadFlow />
        </DocsExample>
        <DocsExample
          file="attachment/sizes"
          title="Sizes"
          description={
            <>
              <DocsCode>size</DocsCode> scales the padding, media and text
              together, and keeps the inner corners concentric with the card.
            </>
          }
        >
          <AttachmentSizes />
        </DocsExample>
        <DocsExample
          file="attachment/long-names"
          title="Long names"
          description="Long file names truncate before the extension, so people can still tell a .pdf from a .zip. Hover the name to read it in full."
        >
          <AttachmentLongNames />
        </DocsExample>
        <DocsExample
          file="attachment/group"
          title="Group"
          description={
            <>
              <DocsCode>{"<AttachmentGroup />"}</DocsCode> lays attachments out
              in a row that scrolls sideways, with edges that fade and items
              that snap into place.
            </>
          }
        >
          <AttachmentGroupDemo />
        </DocsExample>
        <DocsExample
          file="attachment/trigger"
          title="Trigger"
          description={
            <>
              <DocsCode>{"<AttachmentTrigger />"}</DocsCode> makes the whole
              card clickable, for example to open a preview or a link, while the
              actions on it stay independent. Give it an{" "}
              <DocsCode>aria-label</DocsCode>.
            </>
          }
        >
          <AttachmentTriggerDemo />
        </DocsExample>
        <DocsExample
          file="attachment/composer"
          title="Composer"
          description="Files added after the page loads pop in, and the rest of the row slides over smoothly when one is removed."
        >
          <AttachmentComposer />
        </DocsExample>
        <DocsExample
          file="attachment/broken-image"
          title="Broken image"
          description="When an image preview fails to load, it falls back to a file icon."
        >
          <AttachmentBrokenImage />
        </DocsExample>
        <DocsExample
          file="attachment/stress"
          title="Stress"
          description="Hostile names in a narrow column, a random state every 60 ms, and 200 items in one group. Nothing overflows and the layout holds."
        >
          <AttachmentStress />
        </DocsExample>
        <DocsExample
          file="attachment/rtl"
          title="Right to left"
          description="Media, content and actions mirror, and the progress bar fills from the start edge."
        >
          <AttachmentRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Moves focus to each action, then to the trigger. Hidden actions on vertical tiles appear when focus enters the card.",
            },
            {
              keys: ["Enter", "Space"],
              description: "Activates the focused action or trigger.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            While uploading, the progress bar has{" "}
            <DocsCode>{'role="progressbar"'}</DocsCode> and is labelled by the
            title.
          </li>
          <li>
            String titles get a <DocsCode>title</DocsCode> attribute with the
            full name, so truncated names can still be read.
          </li>
          <li>
            Icon-only actions and the trigger have no text, so always give them
            an <DocsCode>aria-label</DocsCode> that names the file.
          </li>
          <li>
            With reduced motion on, attachments appear without popping in, the
            progress bar jumps instead of easing, and groups reflow instantly.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Every part except the group, the action and the trigger renders a
          plain element and accepts its attributes. The card styles are exported
          as <DocsCode>attachmentVariants</DocsCode>.
        </DocsParagraph>
        <DocsSection title="Attachment" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "state",
                type: '"idle" | "uploading" | "processing" | "error" | "done"',
                default: '"done"',
              },
              {
                name: "progress",
                type: "number",
                description:
                  "0 to 100. Shown only while uploading, and clamped to that range.",
              },
              {
                name: "size",
                type: '"default" | "sm" | "xs"',
                default: '"default"',
              },
              {
                name: "orientation",
                type: '"horizontal" | "vertical"',
                default: '"horizontal"',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="attachment"',
                description: "Target the card in CSS.",
              },
              { name: "data-state", description: "The current state." },
              { name: "data-size", description: "The current size." },
              {
                name: "data-orientation",
                description: "The current orientation.",
              },
              {
                name: 'data-slot="attachment-progress"',
                description: "The progress bar, present while uploading.",
              },
              {
                name: "--attachment-radius",
                description:
                  "The card’s corner radius. Inner corners are derived from it.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AttachmentMedia" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"icon" | "image"',
                default: '"icon"',
                description:
                  "image wraps its child in a square AspectRatio with a file icon fallback.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="attachment-media"',
                description: "Target the media in CSS.",
              },
              { name: "data-variant", description: "The current variant." },
            ]}
          />
        </DocsSection>
        <DocsSection title="AttachmentContent" level={3}>
          <DocsParagraph>
            A <DocsCode>{"<div>"}</DocsCode> that holds the title and
            description and takes the remaining width.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="attachment-content"',
                description: "Target the content in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AttachmentTitle" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                description:
                  "A string is split so its extension never truncates.",
              },
              {
                name: "title",
                type: "string",
                default: "children",
                description: "Shown on hover. Defaults to the full name.",
              },
              {
                name: "id",
                type: "string",
                description:
                  "Generated when omitted. The progress bar is labelled by it.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="attachment-title"',
                description: "Target the title in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AttachmentDescription" level={3}>
          <DocsParagraph>
            A single-line <DocsCode>{"<span>"}</DocsCode> for the size, type or
            status. It truncates when space runs out.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="attachment-description"',
                description: "Target the description in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AttachmentActions" level={3}>
          <DocsParagraph>
            A <DocsCode>{"<div>"}</DocsCode> for the action buttons. On vertical
            tiles it floats over the preview and, on devices with a mouse,
            appears on hover or focus.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="attachment-actions"',
                description: "Target the actions in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AttachmentAction" level={3}>
          <DocsParagraph>
            A <DocsCode>{"<Button />"}</DocsCode> that sits above the trigger.
            It accepts every Button prop.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              { name: "variant", type: "ButtonVariant", default: '"ghost"' },
              { name: "size", type: "ButtonSize", default: '"icon-xs"' },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="attachment-action"',
                description: "Target actions in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AttachmentTrigger" level={3}>
          <DocsParagraph>
            An invisible layer that covers the whole card. Compose it with a
            dialog trigger, a link or any button.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "render",
                type: renderType,
                default: '<button type="button">',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="attachment-trigger"',
                description: "Target the trigger in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AttachmentGroup" level={3}>
          <DocsParagraph>
            A horizontal <DocsCode>{"<ScrollArea />"}</DocsCode> that snaps to
            each attachment and animates the row when items are added or
            removed. It accepts every ScrollArea prop except{" "}
            <DocsCode>scrollbars</DocsCode>.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="attachment-group"',
                description: "Target the group in CSS.",
              },
              {
                name: 'data-slot="attachment-group-list"',
                description: "The row that holds the attachments.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
