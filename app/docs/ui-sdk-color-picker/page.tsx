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
import { UiSdkColorPickerAlpha } from "@/components/examples/ui-sdk-color-picker/alpha"
import { UiSdkColorPickerChannels } from "@/components/examples/ui-sdk-color-picker/channels"
import { UiSdkColorPickerControlled } from "@/components/examples/ui-sdk-color-picker/controlled"
import { UiSdkColorPickerDemo } from "@/components/examples/ui-sdk-color-picker/demo"
import { UiSdkColorPickerDisabled } from "@/components/examples/ui-sdk-color-picker/disabled"
import { UiSdkColorPickerForm } from "@/components/examples/ui-sdk-color-picker/form"
import { UiSdkColorPickerInline } from "@/components/examples/ui-sdk-color-picker/inline"
import { UiSdkColorPickerOklch } from "@/components/examples/ui-sdk-color-picker/oklch"
import { UiSdkColorPickerReadOnly } from "@/components/examples/ui-sdk-color-picker/read-only"
import { UiSdkColorPickerRtl } from "@/components/examples/ui-sdk-color-picker/rtl"
import { UiSdkColorPickerVertical } from "@/components/examples/ui-sdk-color-picker/vertical"
import { getDocsComponentMetadata } from "@/lib/docs-metadata"

export const metadata = getDocsComponentMetadata("ui-sdk-color-picker")

const layerCode = `@layer ui-sdk;

@import "tailwindcss";`

const importCode = `import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSwatch,
} from "@/components/ui/ui-sdk-color-picker"`

const usageCode = `<ColorPicker aria-label="Brand color" defaultValue="#0ea5e9">
  <ColorPickerArea />
  <ColorPickerSlider channel="hue" />
  <ColorPickerSwatch />
  <ColorPickerInput aria-label="Hex" />
</ColorPicker>`

const compositionCode = `ColorPicker
├── ColorPickerArea
│   ├── ColorPickerAreaCanvas
│   └── ColorPickerAreaThumb
├── ColorPickerSlider
│   └── ColorPickerSliderThumb
├── ColorPickerSwatch
├── ColorPickerInput
├── ColorPickerChannelInput
├── ColorPickerEyeDropper
├── ColorPickerSwatches
│   └── ColorPickerSwatchItem
└── ColorPickerPopover
    ├── ColorPickerTrigger
    └── ColorPickerContent`

const renderType = "ReactElement | (props, state) => ReactElement"
const changeType = "(value: string, details: ChangeDetails) => void"

export default function Page() {
  return (
    <DocsComponentPage slug="ui-sdk-color-picker">
      <DocsExample file="ui-sdk-color-picker/demo">
        <UiSdkColorPickerDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@ui-sdk/react@0.1.0-beta.2",
          "@ui-sdk/core@0.1.0-beta.2",
          "@tabler/icons-react",
          "cn",
        ]}
        files={["components/ui/ui-sdk-color-picker.tsx"]}
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
          The value is a CSS color string. Every part edits the same color, so
          use only the parts you need. <DocsCode>ColorPickerArea</DocsCode> and{" "}
          <DocsCode>ColorPickerSlider</DocsCode> render their thumb for you.
          Name the picker with <DocsCode>aria-label</DocsCode>, or with the
          label of a field around it.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="ui-sdk-color-picker/inline"
          title="Inline"
          description="Render the parts in place, without a popover, for a settings page or a sidebar."
        >
          <UiSdkColorPickerInline />
        </DocsExample>
        <DocsExample
          file="ui-sdk-color-picker/alpha"
          title="Alpha"
          description={
            <>
              A slider with <DocsCode>{'channel="alpha"'}</DocsCode> edits
              opacity. Its track and the swatch draw a checkerboard under the
              color, so a see-through color reads as see-through.
            </>
          }
        >
          <UiSdkColorPickerAlpha />
        </DocsExample>
        <DocsExample
          file="ui-sdk-color-picker/oklch"
          title="OKLCH"
          description={
            <>
              With <DocsCode>{'space="oklch"'}</DocsCode>, add{" "}
              <DocsCode>ColorPickerAreaCanvas</DocsCode> to paint the area.
              Colors outside the screen’s gamut stay clear, and a thumb dragged
              there settles on the closest color inside when you let go.
            </>
          }
        >
          <UiSdkColorPickerOklch />
        </DocsExample>
        <DocsExample
          file="ui-sdk-color-picker/channels"
          title="Presets and channels"
          description={
            <>
              <DocsCode>ColorPickerSwatches</DocsCode> is one tab stop with
              arrow keys between presets, and a preset stays selected however
              the value is written. <DocsCode>ColorPickerChannelInput</DocsCode>{" "}
              edits one channel as a number. The eyedropper hides itself in
              browsers that can’t pick from the screen.
            </>
          }
        >
          <UiSdkColorPickerChannels />
        </DocsExample>
        <DocsExample
          file="ui-sdk-color-picker/vertical"
          title="Vertical sliders"
          description={
            <>
              Set <DocsCode>{'orientation="vertical"'}</DocsCode> on a slider to
              stand it beside the area.
            </>
          }
        >
          <UiSdkColorPickerVertical />
        </DocsExample>
        <DocsExample
          file="ui-sdk-color-picker/controlled"
          title="Controlled"
          description={
            <>
              <DocsCode>onValueChange</DocsCode> runs on every step of a drag,
              and <DocsCode>onValueCommit</DocsCode> once when it ends, so save
              there. A controller from{" "}
              <DocsCode>createColorPickerController()</DocsCode> sets the color
              from anywhere.
            </>
          }
        >
          <UiSdkColorPickerControlled />
        </DocsExample>
        <DocsExample
          file="ui-sdk-color-picker/form"
          title="Form"
          description={
            <>
              A hidden input submits the value under <DocsCode>name</DocsCode>,
              and a form reset goes back to <DocsCode>defaultValue</DocsCode>.
            </>
          }
        >
          <UiSdkColorPickerForm />
        </DocsExample>
        <DocsExample
          file="ui-sdk-color-picker/disabled"
          title="Disabled"
          description="A disabled picker can’t be focused or changed, and submits nothing."
        >
          <UiSdkColorPickerDisabled />
        </DocsExample>
        <DocsExample
          file="ui-sdk-color-picker/read-only"
          title="Read-only"
          description={
            <>
              With <DocsCode>readOnly</DocsCode>, the thumbs stay focusable and
              the value is submitted, but drags, keys and typing leave the color
              alone.
            </>
          }
        >
          <UiSdkColorPickerReadOnly />
        </DocsExample>
        <DocsExample
          file="ui-sdk-color-picker/rtl"
          title="Right to left"
          description="UI SDK reads the direction from the page, so the area, the sliders and the arrow keys mirror. The inputs pick their own direction, so a hex value still reads left to right."
        >
          <UiSdkColorPickerRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["←", "→", "↑", "↓"],
              description:
                "Moves a thumb one step. On the area, left and right move across, up and down move up and down.",
            },
            {
              keys: ["Shift + arrow"],
              description: "Moves ten steps.",
            },
            {
              keys: ["Page Up", "Page Down"],
              description:
                "Moves a tenth of the range, up the area or along a slider.",
            },
            {
              keys: ["Home", "End"],
              description: "Moves to the start or the end.",
            },
            {
              keys: ["Enter"],
              description:
                "Reads the text in the input, or picks the focused preset.",
            },
            {
              keys: ["Esc"],
              description:
                "Puts the input’s text back to the value, or closes the popover.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsParagraph>
          No WAI-ARIA pattern covers a color picker, so UI SDK builds it from
          ones that do. The picker is a group. The area’s thumb and each slider
          thumb are sliders, and the area’s thumb names both of its channels,
          like “Saturation 76%, Brightness 96%”. The presets are a listbox, and
          each preset and the swatch are named by their color, like “vivid
          blue”.
        </DocsParagraph>
        <DocsParagraph>
          The trigger in the popover example says the current color in its name.
          Thumbs grow while you drag only when motion is allowed, and the
          checkerboard, rings and focus outlines switch to system colors in
          forced colors mode.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Each part wraps the UI SDK part of the same name and accepts all of
          its props, including <DocsCode>render</DocsCode> and a{" "}
          <DocsCode>className</DocsCode> that can be a function of the part’s
          state.
        </DocsParagraph>
        <DocsSection title="ColorPicker" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "string" },
              {
                name: "defaultValue",
                type: "string",
                default: '"black"',
              },
              {
                name: "onValueChange",
                type: changeType,
                description:
                  "Runs on every step of a drag, a key press, a typed color or a preset.",
              },
              {
                name: "onValueCommit",
                type: changeType,
                description: "Runs once when a drag, key or typed color ends.",
              },
              {
                name: "space",
                type: '"hsv" | "hsl" | "srgb" | "oklch"',
                default: '"hsv"',
                description: "Which channels the parts edit.",
              },
              {
                name: "format",
                type: "ColorFormat",
                description:
                  "How the value is written. Hex for hsv, the space’s own CSS syntax otherwise.",
              },
              {
                name: "gamut",
                type: '"srgb" | "p3" | false',
                default: '"srgb"',
              },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "readOnly", type: "boolean", default: "false" },
              { name: "required", type: "boolean", default: "false" },
              { name: "name", type: "string" },
              { name: "form", type: "string" },
              {
                name: "controller",
                type: "ColorPickerController",
                description: "From createColorPickerController().",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="color-picker"',
                description: "Target the root in CSS.",
              },
              { name: "data-disabled", description: "Present when disabled." },
              { name: "data-readonly", description: "Present when read-only." },
              { name: "data-required", description: "Present when required." },
              {
                name: "data-out-of-gamut",
                description:
                  "Present on every part while a drag holds a color outside the gamut.",
              },
              {
                name: "--color-picker-color",
                description:
                  "The color as CSS. Thumbs and swatches fill with it.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ColorPickerArea" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "x",
                type: "ColorChannel",
                description:
                  "The channel across. Saturation, red or chroma, by space.",
              },
              {
                name: "y",
                type: "ColorChannel",
                description:
                  "The channel up. Brightness, lightness or green, by space.",
              },
              {
                name: "children",
                type: "ReactNode",
                default: "<ColorPickerAreaThumb />",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="color-picker-area"',
                description: "Target the area in CSS.",
              },
              {
                name: "--color-area-background",
                description:
                  "The gradients that draw the area. Unset where a canvas paints it.",
              },
              {
                name: "--color-picker-radius",
                description:
                  "The area’s corner radius. Set by ColorPickerContent so its corners are concentric.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ColorPickerAreaThumb" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="color-picker-area-thumb"',
                description: "Target the thumb in CSS.",
              },
              {
                name: "--area-x",
                description: "Where the thumb is across the area, from 0 to 1.",
              },
              {
                name: "--area-y",
                description: "Where the thumb is up the area, from 0 to 1.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ColorPickerSlider" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "channel",
                type: "ColorChannel",
                description: "Hue, or blue in sRGB, by default.",
              },
              {
                name: "orientation",
                type: '"horizontal" | "vertical"',
                default: '"horizontal"',
              },
              {
                name: "children",
                type: "ReactNode",
                default: "<ColorPickerSliderThumb />",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="color-picker-slider"',
                description: "Target the slider in CSS.",
              },
              {
                name: "data-channel",
                description: "The channel it edits, like hue or alpha.",
              },
              {
                name: "data-orientation",
                description: "horizontal or vertical.",
              },
              {
                name: "--color-slider-background",
                description: "A gradient through the channel.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ColorPickerChannelInput" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "channel",
                type: "ColorChannel",
                description:
                  "The channel to edit, in the units people read it in.",
              },
              { name: "render", type: renderType, default: "<input>" },
            ]}
          />
        </DocsSection>
        <DocsSection title="ColorPickerSwatchItem" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "value",
                type: "string",
                description: "Required. The preset’s color.",
              },
              { name: "render", type: renderType, default: "<button>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="color-picker-swatch-item"',
                description: "Target presets in CSS.",
              },
              {
                name: "data-selected",
                description: "Present while the value is this preset’s color.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ColorPickerEyeDropper" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                default: "<IconColorPicker />",
              },
              { name: "render", type: renderType, default: "<button>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: "data-unsupported",
                description:
                  "Present where the browser has no EyeDropper. The button is hidden then.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ColorPickerContent" level={3}>
          <DocsParagraph>
            <DocsCode>ColorPickerPopover</DocsCode>,{" "}
            <DocsCode>ColorPickerTrigger</DocsCode> and{" "}
            <DocsCode>ColorPickerContent</DocsCode> wrap the UI SDK popover. The
            content opens in the browser’s top layer, so it needs no portal.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "side",
                type: '"top" | "bottom" | "left" | "right" | "start" | "end"',
                default: '"bottom"',
              },
              {
                name: "align",
                type: '"start" | "center" | "end"',
                default: '"start"',
              },
              { name: "sideOffset", type: "number", default: "6" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="popover-content"',
                description: "Set by UI SDK on the popup. Target it in CSS.",
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
      </DocsSection>
    </DocsComponentPage>
  )
}
