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
import { UiSdkImageCropperAvatar } from "@/components/examples/ui-sdk-image-cropper/avatar"
import { UiSdkImageCropperControlled } from "@/components/examples/ui-sdk-image-cropper/controlled"
import { UiSdkImageCropperDemo } from "@/components/examples/ui-sdk-image-cropper/demo"
import { UiSdkImageCropperDisabled } from "@/components/examples/ui-sdk-image-cropper/disabled"
import { UiSdkImageCropperRotateFlip } from "@/components/examples/ui-sdk-image-cropper/rotate-flip"
import { UiSdkImageCropperUpload } from "@/components/examples/ui-sdk-image-cropper/upload"
import { getDocsComponentMetadata } from "@/lib/docs-metadata"

export const metadata = getDocsComponentMetadata("ui-sdk-image-cropper")

const layerCode = `@layer ui-sdk;

@import "tailwindcss";`

const importCode = `import {
  ImageCropper,
  ImageCropperGrid,
  ImageCropperHandles,
  ImageCropperImage,
  ImageCropperSelection,
  ImageCropperViewport,
} from "@/components/ui/ui-sdk-image-cropper"`

const usageCode = `<ImageCropper aria-label="Cover photo" src={src} aspectRatio={3}>
  <ImageCropperViewport>
    <ImageCropperImage alt="Your cover photo" />
    <ImageCropperSelection>
      <ImageCropperGrid />
      <ImageCropperHandles />
    </ImageCropperSelection>
  </ImageCropperViewport>
</ImageCropper>`

const cropCode = `import { cropImage } from "@ui-sdk/react/image"

const file = await cropImage(src, crop, { width: 512 })`

const compositionCode = `ImageCropper
├── ImageCropperViewport
│   ├── ImageCropperImage
│   └── ImageCropperSelection
│       ├── ImageCropperGrid
│       └── ImageCropperHandles
├── ImageCropperZoom
├── ImageCropperRotate
└── ImageCropperFlip`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="ui-sdk-image-cropper">
      <DocsExample file="ui-sdk-image-cropper/demo">
        <UiSdkImageCropperDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@ui-sdk/react@0.1.0-beta.1",
          "@ui-sdk/core@0.1.0-beta.1",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={[
          "components/ui/ui-sdk-image-cropper.tsx",
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
          The crop is a box in the image’s own pixels, with its rotation and
          flip. Pass it to <DocsCode>cropImage</DocsCode> to get a file you can
          upload. An image from another site needs CORS, or the browser won’t
          let the page read its pixels.
        </DocsParagraph>
        <DocsCodeBlock code={cropCode} />
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="ui-sdk-image-cropper/avatar"
          title="Avatar"
          description={
            <>
              With <DocsCode>{'mode="frame"'}</DocsCode>, the selection stays
              still and you pan and zoom the image under it.{" "}
              <DocsCode>{'shape="circle"'}</DocsCode> rounds it, so pass{" "}
              <DocsCode>{'shape: "circle"'}</DocsCode> to{" "}
              <DocsCode>cropImage</DocsCode> as well.
            </>
          }
        >
          <UiSdkImageCropperAvatar />
        </DocsExample>
        <DocsExample
          file="ui-sdk-image-cropper/rotate-flip"
          title="Rotate and flip"
          description={
            <>
              <DocsCode>ImageCropperRotate</DocsCode> turns the image a quarter
              clockwise and <DocsCode>ImageCropperFlip</DocsCode> mirrors it.
              Without children they’re icon buttons with English labels.
            </>
          }
        >
          <UiSdkImageCropperRotateFlip />
        </DocsExample>
        <DocsExample
          file="ui-sdk-image-cropper/upload"
          title="Upload"
          description={
            <>
              Crop a photo from a file input with an object URL. Give the
              cropper a <DocsCode>key</DocsCode> so a new photo starts a fresh
              crop.
            </>
          }
        >
          <UiSdkImageCropperUpload />
        </DocsExample>
        <DocsExample
          file="ui-sdk-image-cropper/controlled"
          title="Controller"
          description={
            <>
              <DocsCode>onCropCommit</DocsCode> runs once a drag or key press
              ends, so save there. A controller from{" "}
              <DocsCode>createImageCropperController()</DocsCode> sets the crop
              from anywhere.
            </>
          }
        >
          <UiSdkImageCropperControlled />
        </DocsExample>
        <DocsExample
          file="ui-sdk-image-cropper/disabled"
          title="Disabled"
          description="A disabled cropper can’t be focused or changed, and its zoom and buttons are disabled."
        >
          <UiSdkImageCropperDisabled />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["←", "→", "↑", "↓"],
              description:
                "Moves the selection, or on a handle, moves its edges.",
            },
            {
              keys: ["Shift", "←"],
              description: "Moves ten times as far.",
            },
            {
              keys: ["+", "-"],
              description: "Zooms in or out about the crop’s middle.",
            },
            {
              keys: ["R"],
              description:
                "Turns the image a quarter clockwise, or back with Shift.",
            },
            {
              keys: ["Esc"],
              description:
                "During a drag, puts the crop back where the drag started.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsParagraph>
          The cropper is a group named by <DocsCode>aria-label</DocsCode>. The
          selection and each handle are sliders that say the crop in words, like
          “300 by 300 pixels, at 50, 0”, and the zoom says its level, like
          “125%”. Those names are in English, so pass{" "}
          <DocsCode>aria-label</DocsCode> to each part to name it in your page’s
          language.
        </DocsParagraph>
        <DocsParagraph>
          The grid only fades in while you drag, and not at all when motion is
          reduced. Handles get a larger hit area on touch screens, the page
          doesn’t scroll during a drag, and in forced colors mode the selection
          gets a system-colored border.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Each part wraps the UI SDK part of the same name and accepts all of
          its props, including <DocsCode>render</DocsCode> and a{" "}
          <DocsCode>className</DocsCode> that can be a function of the part’s
          state.
        </DocsParagraph>
        <DocsSection title="ImageCropper" level={3}>
          <DocsPropsTable
            props={[
              { name: "src", type: "string" },
              {
                name: "crop",
                type: "ImageCrop",
                description:
                  "The crop in image pixels, with rotation, flipX and flipY.",
              },
              { name: "defaultCrop", type: "ImageCrop" },
              { name: "onCropChange", type: "(crop, details) => void" },
              {
                name: "onCropCommit",
                type: "(crop, details) => void",
                description: "Runs once a drag, key press or wheel ends.",
              },
              {
                name: "mode",
                type: '"box" | "frame"',
                default: '"box"',
              },
              { name: "aspectRatio", type: "number" },
              {
                name: "shape",
                type: '"rectangle" | "circle"',
                default: '"rectangle"',
              },
              { name: "minWidth", type: "number" },
              { name: "minHeight", type: "number" },
              { name: "maxZoom", type: "number", default: "10" },
              { name: "disabled", type: "boolean", default: "false" },
              {
                name: "controller",
                type: "ImageCropperController",
                description: "From createImageCropperController().",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="image-cropper"',
                description: "Target the cropper in CSS.",
              },
              { name: "data-mode", description: "box or frame." },
              { name: "data-shape", description: "rectangle or circle." },
              {
                name: "data-loading",
                description: "Present until the image loads.",
              },
              {
                name: "data-error",
                description: "Present when the image failed to load.",
              },
              {
                name: "data-dragging",
                description: "Present while a pointer drags.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ImageCropperViewport" level={3}>
          <DocsPropsTable props={[{ name: "render", type: renderType }]} />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="image-cropper-viewport"',
                description: "Target the viewport in CSS.",
              },
              {
                name: "--image-cropper-aspect-ratio",
                description:
                  "The image’s width over its height once it loads. The viewport takes it as its aspect ratio.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ImageCropperImage" level={3}>
          <DocsPropsTable
            props={[
              { name: "alt", type: "string", description: "Required." },
              { name: "render", type: renderType },
            ]}
          />
        </DocsSection>
        <DocsSection title="ImageCropperSelection" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "aria-label",
                type: "string",
                default: '"Crop"',
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="image-cropper-selection"',
                description: "Target the selection in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ImageCropperGrid" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                description: "Defaults to lines in thirds.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ImageCropperHandle" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "position",
                type: '"n" | "e" | "s" | "w" | "ne" | "nw" | "se" | "sw"',
                description: "The edge or corner it resizes.",
              },
            ]}
          />
          <DocsParagraph>
            <DocsCode>ImageCropperHandles</DocsCode> renders all eight. Handles
            don’t show in frame mode.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="ImageCropperZoom" level={3}>
          <DocsParagraph>
            A native range input from 1, the largest crop, to{" "}
            <DocsCode>maxZoom</DocsCode>.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="ImageCropperRotate" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                description:
                  "Defaults to an icon with the label Rotate. With children it’s a small text button.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ImageCropperFlip" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "direction",
                type: '"horizontal" | "vertical"',
                default: '"horizontal"',
              },
              {
                name: "children",
                type: "ReactNode",
                description: "Defaults to an icon with an English label.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
