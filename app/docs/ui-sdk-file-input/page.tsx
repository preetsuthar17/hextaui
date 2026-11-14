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
import { UiSdkFileInputAttachments } from "@/components/examples/ui-sdk-file-input/attachments"
import { UiSdkFileInputButton } from "@/components/examples/ui-sdk-file-input/button"
import { UiSdkFileInputControlled } from "@/components/examples/ui-sdk-file-input/controlled"
import { UiSdkFileInputDemo } from "@/components/examples/ui-sdk-file-input/demo"
import { UiSdkFileInputDisabled } from "@/components/examples/ui-sdk-file-input/disabled"
import { UiSdkFileInputFolders } from "@/components/examples/ui-sdk-file-input/folders"
import { UiSdkFileInputForm } from "@/components/examples/ui-sdk-file-input/form"
import { UiSdkFileInputImages } from "@/components/examples/ui-sdk-file-input/images"
import { UiSdkFileInputInvalid } from "@/components/examples/ui-sdk-file-input/invalid"
import { UiSdkFileInputLimits } from "@/components/examples/ui-sdk-file-input/limits"
import { UiSdkFileInputPageDrop } from "@/components/examples/ui-sdk-file-input/page-drop"
import { UiSdkFileInputRtl } from "@/components/examples/ui-sdk-file-input/rtl"
import { getDocsComponentMetadata } from "@/lib/docs-metadata"

export const metadata = getDocsComponentMetadata("ui-sdk-file-input")

const layerCode = `@layer ui-sdk;

@import "tailwindcss";`

const importCode = `import {
  FileInput,
  FileInputDropzone,
  FileInputDropzoneIcon,
  FileInputDropzoneTitle,
  FileInputItem,
  FileInputList,
  FileInputRejections,
  FileInputTrigger,
} from "@/components/ui/ui-sdk-file-input"`

const usageCode = `<FileInput multiple accept="image/*" maxSize={5_000_000}>
  <FileInputDropzone>
    <FileInputDropzoneIcon />
    <FileInputDropzoneTitle>Drop files here</FileInputDropzoneTitle>
    <FileInputTrigger>Browse files</FileInputTrigger>
  </FileInputDropzone>
  <FileInputRejections />
  <FileInputList aria-label="Files">
    <FileInputItem />
  </FileInputList>
</FileInput>`

const compositionCode = `FileInput
├── FileInputTrigger
├── FileInputDropzone
│   ├── FileInputDropzoneIcon
│   ├── FileInputDropzoneTitle
│   ├── FileInputDropzoneDescription
│   └── FileInputTrigger
├── FileInputRejections
└── FileInputList
    └── FileInputItem
        ├── FileInputItemPreview
        ├── FileInputItemContent
        │   ├── FileInputItemName
        │   └── FileInputItemSize
        └── FileInputItemRemove`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="ui-sdk-file-input">
      <DocsExample file="ui-sdk-file-input/demo">
        <UiSdkFileInputDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@ui-sdk/react@0.1.0-beta.2",
          "@ui-sdk/core@0.1.0-beta.2",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={[
          "components/ui/ui-sdk-file-input.tsx",
          "components/ui/button.tsx",
        ]}
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
          The file input holds the files people choose, drop or paste, and
          submits them with a form. Uploading them is up to your app.{" "}
          <DocsCode>FileInputItem</DocsCode> with no children renders a finished
          row with a preview, the name, the size and a remove button, once for
          each file in the list.
        </DocsParagraph>
        <DocsParagraph>
          The checks for <DocsCode>accept</DocsCode>, sizes, counts and{" "}
          <DocsCode>validate</DocsCode> run in the browser only, to tell people
          early why a file was left out. Anyone can skip them, so check every
          upload again on your server.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="ui-sdk-file-input/limits"
          title="Accepted types and limits"
          description={
            <>
              <DocsCode>accept</DocsCode> takes MIME types, wildcards and
              extensions. <DocsCode>maxFiles</DocsCode>,{" "}
              <DocsCode>minSize</DocsCode> and <DocsCode>maxSize</DocsCode> set
              the limits, and <DocsCode>validate</DocsCode> adds checks of your
              own. <DocsCode>FileInputRejections</DocsCode> lists each file that
              was left out with every reason, until the next accepted file.
            </>
          }
        >
          <UiSdkFileInputLimits />
        </DocsExample>
        <DocsExample
          file="ui-sdk-file-input/images"
          title="Image previews"
          description={
            <>
              <DocsCode>FileInputItemPreview</DocsCode> shows an image from an
              object URL it revokes when the file goes away, and an icon for
              other types. With <DocsCode>{'layout="grid"'}</DocsCode>, each
              file is a square tile.
            </>
          }
        >
          <UiSdkFileInputImages />
        </DocsExample>
        <DocsExample
          file="ui-sdk-file-input/button"
          title="Upload button"
          description={
            <>
              A trigger alone opens the system file picker. Without{" "}
              <DocsCode>multiple</DocsCode>, a new file replaces the current
              one, and the root’s children can be a function of its state.
            </>
          }
        >
          <UiSdkFileInputButton />
        </DocsExample>
        <DocsExample
          file="ui-sdk-file-input/attachments"
          title="Prompt attachments"
          description={
            <>
              With <DocsCode>{'variant="composer"'}</DocsCode>, the drop zone
              is the card around a message box, and{" "}
              <DocsCode>{'layout="chips"'}</DocsCode> lists files as compact
              chips. <DocsCode>pasteTarget</DocsCode> takes pasted screenshots
              from the text area, while pasted text stays text.
            </>
          }
        >
          <UiSdkFileInputAttachments />
        </DocsExample>
        <DocsExample
          file="ui-sdk-file-input/page-drop"
          title="Page-wide drop"
          description={
            <>
              With <DocsCode>{'target="document"'}</DocsCode> and{" "}
              <DocsCode>{'variant="overlay"'}</DocsCode>, the zone covers the
              page while files are dragged over the window, and takes files
              dropped anywhere. A drop on another zone stays with that zone.
            </>
          }
        >
          <UiSdkFileInputPageDrop />
        </DocsExample>
        <DocsExample
          file="ui-sdk-file-input/folders"
          title="Folders"
          description={
            <>
              <DocsCode>directory</DocsCode> picks a whole folder and turns on{" "}
              <DocsCode>multiple</DocsCode>. Item names show the path inside the
              folder.
            </>
          }
        >
          <UiSdkFileInputFolders />
        </DocsExample>
        <DocsExample
          file="ui-sdk-file-input/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>value</DocsCode> and{" "}
              <DocsCode>onValueChange</DocsCode>. A controller from{" "}
              <DocsCode>createFileInputController()</DocsCode> opens the picker
              from any button, and clears or adds files.
            </>
          }
        >
          <UiSdkFileInputControlled />
        </DocsExample>
        <DocsExample
          file="ui-sdk-file-input/form"
          title="Form"
          description={
            <>
              With a <DocsCode>name</DocsCode>, the files submit through a
              native file input, even before the page hydrates. Rejected files
              never submit, and a form reset empties the list.
            </>
          }
        >
          <UiSdkFileInputForm />
        </DocsExample>
        <DocsExample
          file="ui-sdk-file-input/invalid"
          title="Invalid"
          description={
            <>
              <DocsCode>invalid</DocsCode> marks the drop zone and the trigger,
              and the trigger tells screen readers. Point the trigger’s{" "}
              <DocsCode>aria-describedby</DocsCode> at your message.
            </>
          }
        >
          <UiSdkFileInputInvalid />
        </DocsExample>
        <DocsExample
          file="ui-sdk-file-input/disabled"
          title="Disabled"
          description="A disabled file input ignores picks, drops and pastes, and submits nothing."
        >
          <UiSdkFileInputDisabled />
        </DocsExample>
        <DocsExample
          file="ui-sdk-file-input/rtl"
          title="Right to left"
          description="Rows and the drop zone mirror, file names keep their own direction, and sizes format in the locale you pass."
        >
          <UiSdkFileInputRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Moves to the trigger, then into the list, onto the last focused file or the first one.",
            },
            {
              keys: ["Enter", "Space"],
              description: "Opens the file picker from the trigger.",
            },
            {
              keys: ["↑", "↓", "←", "→"],
              description: "Moves between files in the list.",
            },
            {
              keys: ["Home", "End"],
              description: "Moves to the first or last file.",
            },
            {
              keys: ["Delete", "Backspace"],
              description:
                "Removes the focused file and focuses the next one.",
            },
            {
              keys: ["⌘V"],
              description:
                "Pastes files while focus is inside the drop zone or its paste target.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsParagraph>
          The drop zone isn’t a control, so always keep a trigger beside it for
          people who use a keyboard or a screen reader. The list is one tab
          stop, and each remove button is named for its file, like “Remove
          photo.png”, and stays out of the tab order because Delete on the item
          does the same.
        </DocsParagraph>
        <DocsParagraph>
          Accepted, removed and rejected files are announced through a polite
          live region in English. Pass <DocsCode>announcement</DocsCode> to say
          it in your language, and <DocsCode>getReasonLabel</DocsCode> to{" "}
          <DocsCode>FileInputRejections</DocsCode> for its reasons. The drop
          zone icon only lifts when motion is allowed, and new rows fade in
          only then too.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Each part wraps the UI SDK part of the same name and accepts all of
          its props, including <DocsCode>render</DocsCode> and a{" "}
          <DocsCode>className</DocsCode> that can be a function of the part’s
          state.
        </DocsParagraph>
        <DocsSection title="FileInput" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "File[]" },
              { name: "defaultValue", type: "File[]", default: "[]" },
              {
                name: "onValueChange",
                type: "(value: File[], details) => void",
                description:
                  "details has the reason and the added, removed and rejected files.",
              },
              {
                name: "onReject",
                type: "(rejected: FileRejection[], details) => void",
                description:
                  "Runs when files fail the checks, even when none were accepted.",
              },
              { name: "accept", type: "string | string[]" },
              { name: "multiple", type: "boolean", default: "false" },
              { name: "maxFiles", type: "number" },
              { name: "maxSize", type: "number", description: "In bytes." },
              { name: "minSize", type: "number", description: "In bytes." },
              {
                name: "validate",
                type: "(file: File) => string | null",
                description:
                  "Return a reason to reject the file, after the built-in checks.",
              },
              { name: "directory", type: "boolean", default: "false" },
              {
                name: "capture",
                type: '"user" | "environment" | boolean',
                description: "Opens the camera on phones.",
              },
              { name: "invalid", type: "boolean", default: "false" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "required", type: "boolean", default: "false" },
              { name: "name", type: "string" },
              { name: "form", type: "string" },
              {
                name: "announcement",
                type: "(change) => string | null",
                description: "What screen readers hear after a change.",
              },
              {
                name: "controller",
                type: "FileInputController",
                description: "From createFileInputController().",
              },
              {
                name: "children",
                type: "ReactNode | (state) => ReactNode",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="file-input"',
                description: "Target the file input in CSS.",
              },
              {
                name: "data-dragging",
                description:
                  "Present while files are dragged over one of its drop zones.",
              },
              {
                name: "data-invalid",
                description: "Present when invalid.",
              },
              {
                name: "data-required",
                description: "Present when a file is required.",
              },
              {
                name: "data-disabled",
                description: "Present when disabled.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="FileInputDropzone" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "composer" | "overlay"',
                default: '"default"',
                description:
                  "A dashed zone, a card that wraps a message composer, or a full-page overlay shown while dragging.",
              },
              {
                name: "target",
                type: '"element" | "document"',
                default: '"element"',
              },
              {
                name: "pasteTarget",
                type: '"document" | string | Element | () => Element',
                description: "Somewhere else to take pasted files from.",
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="file-input-dropzone"',
                description: "Target the drop zone in CSS.",
              },
              {
                name: "data-variant",
                description: "The variant: default, composer or overlay.",
              },
              {
                name: "data-dragging",
                description: "Present while files are dragged over it.",
              },
              {
                name: "data-drag-accept",
                description:
                  "Present while the dragged files look acceptable, from their types and count.",
              },
              {
                name: "data-drag-reject",
                description:
                  "Present while a dragged file has a type that isn’t accepted, or there are too many.",
              },
              {
                name: "data-disabled",
                description: "Present when disabled.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="FileInputTrigger" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: "Button variant",
                default: '"outline"',
              },
              { name: "size", type: "Button size", default: '"sm"' },
              {
                name: "controller",
                type: "FileInputController",
                description:
                  "Connects a trigger outside the file input, like one in a toolbar.",
              },
              { name: "render", type: renderType },
            ]}
          />
        </DocsSection>
        <DocsSection title="FileInputList" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "layout",
                type: '"list" | "grid" | "chips"',
                default: '"list"',
                description:
                  "Rows, square image tiles, or compact chips. Items take their look from it.",
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="file-input-list"',
                description: "Target the list in CSS.",
              },
              {
                name: "data-layout",
                description:
                  "The layout: list, grid or chips. Items carry it too.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="FileInputItem" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode | (state) => ReactNode",
                description:
                  "Defaults to a preview, the name, the size and a remove button. The state has the file and its index.",
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="file-input-item"',
                description: "Target a file’s row in CSS.",
              },
              {
                name: "data-disabled",
                description: "Present when disabled.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="FileInputItemPreview" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="file-input-item-preview"',
                description: "Target the preview in CSS.",
              },
              {
                name: "data-kind",
                description:
                  "image for an image preview, icon for an icon by file type.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="FileInputItemSize" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "locale",
                type: "string",
                description:
                  "Formats the size, like 2.4 kB, in this locale. Defaults to the browser’s.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="FileInputItemRemove" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                description: "Defaults to an X icon.",
              },
              { name: "render", type: renderType },
            ]}
          />
        </DocsSection>
        <DocsSection title="FileInputRejections" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "getReasonLabel",
                type: "(reason, rules, rejection) => string",
                description:
                  "Names each reason. Defaults to English, like “Larger than 5 MB”.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="file-input-rejections"',
                description: "Target the list of rejected files in CSS.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
