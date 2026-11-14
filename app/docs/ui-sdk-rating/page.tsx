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
import { UiSdkRatingControlled } from "@/components/examples/ui-sdk-rating/controlled"
import { UiSdkRatingCustomIcon } from "@/components/examples/ui-sdk-rating/custom-icon"
import { UiSdkRatingDemo } from "@/components/examples/ui-sdk-rating/demo"
import { UiSdkRatingDeselectable } from "@/components/examples/ui-sdk-rating/deselectable"
import { UiSdkRatingDisabled } from "@/components/examples/ui-sdk-rating/disabled"
import { UiSdkRatingForm } from "@/components/examples/ui-sdk-rating/form"
import { UiSdkRatingHalf } from "@/components/examples/ui-sdk-rating/half"
import { UiSdkRatingReadOnly } from "@/components/examples/ui-sdk-rating/read-only"
import { UiSdkRatingRtl } from "@/components/examples/ui-sdk-rating/rtl"
import { UiSdkRatingSizes } from "@/components/examples/ui-sdk-rating/sizes"
import { getDocsComponentMetadata } from "@/lib/docs-metadata"

export const metadata = getDocsComponentMetadata("ui-sdk-rating")

const layerCode = `@layer ui-sdk;

@import "tailwindcss";`

const importCode = `import { Rating, RatingItem } from "@/components/ui/ui-sdk-rating"`

const usageCode = `<Rating aria-label="Rating" defaultValue={3}>
  <RatingItem />
</Rating>`

const compositionCode = `Rating
└── RatingItem`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="ui-sdk-rating">
      <DocsExample file="ui-sdk-rating/demo">
        <UiSdkRatingDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@ui-sdk/react@0.1.0-beta.2",
          "@ui-sdk/core@0.1.0-beta.2",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={["components/ui/ui-sdk-rating.tsx"]}
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
          <DocsCode>Rating</DocsCode> renders its child once per star, so put
          one <DocsCode>RatingItem</DocsCode> inside it. Each star draws an
          empty star with a filled one clipped to{" "}
          <DocsCode>--rating-fill</DocsCode>, so half stars and averages like
          4.3 show exactly.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="ui-sdk-rating/half"
          title="Half stars"
          description={
            <>
              With <DocsCode>{"step={0.5}"}</DocsCode>, each half of a star is
              its own radio, and the arrow keys move by half a star.
            </>
          }
        >
          <UiSdkRatingHalf />
        </DocsExample>
        <DocsExample
          file="ui-sdk-rating/read-only"
          title="Read-only"
          description={
            <>
              A read-only rating is one image named by{" "}
              <DocsCode>getValueLabel</DocsCode>, and it shows any score, like
              an average.
            </>
          }
        >
          <UiSdkRatingReadOnly />
        </DocsExample>
        <DocsExample
          file="ui-sdk-rating/sizes"
          title="Sizes"
          description={
            <>
              <DocsCode>size</DocsCode> is <DocsCode>sm</DocsCode>,{" "}
              <DocsCode>default</DocsCode> or <DocsCode>lg</DocsCode>.
            </>
          }
        >
          <UiSdkRatingSizes />
        </DocsExample>
        <DocsExample
          file="ui-sdk-rating/deselectable"
          title="Deselectable"
          description={
            <>
              With <DocsCode>deselectable</DocsCode>, pressing the checked star
              again clears the score.
            </>
          }
        >
          <UiSdkRatingDeselectable />
        </DocsExample>
        <DocsExample
          file="ui-sdk-rating/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>value</DocsCode> and{" "}
              <DocsCode>onValueChange</DocsCode>, where{" "}
              <DocsCode>null</DocsCode> means no score yet. A controller from{" "}
              <DocsCode>createRatingController()</DocsCode> sets the score from
              anywhere.
            </>
          }
        >
          <UiSdkRatingControlled />
        </DocsExample>
        <DocsExample
          file="ui-sdk-rating/form"
          title="Form"
          description={
            <>
              With a <DocsCode>name</DocsCode>, the score submits with the form.{" "}
              <DocsCode>required</DocsCode> blocks submission until there’s a
              score, with the browser’s own message.
            </>
          }
        >
          <UiSdkRatingForm />
        </DocsExample>
        <DocsExample
          file="ui-sdk-rating/custom-icon"
          title="Custom icon"
          description={
            <>
              Pass your own icon as the child of <DocsCode>RatingItem</DocsCode>{" "}
              and switch it with <DocsCode>data-filled</DocsCode>.{" "}
              <DocsCode>tone</DocsCode> sets the color.
            </>
          }
        >
          <UiSdkRatingCustomIcon />
        </DocsExample>
        <DocsExample
          file="ui-sdk-rating/disabled"
          title="Disabled"
          description="A disabled rating can’t be focused or changed, and submits nothing."
        >
          <UiSdkRatingDisabled />
        </DocsExample>
        <DocsExample
          file="ui-sdk-rating/rtl"
          title="Right to left"
          description="Stars run from the right, and a half star fills from its right edge."
        >
          <UiSdkRatingRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Moves into the rating, onto the checked star or the first one.",
            },
            {
              keys: ["←", "→", "↑", "↓"],
              description:
                "Moves to the next or previous score and checks it, stopping at the ends unless loop is set.",
            },
            {
              keys: ["Space"],
              description:
                "Checks the focused star, or clears it when it’s checked and the rating is deselectable.",
            },
            {
              keys: ["Enter"],
              description: "Submits the form.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsParagraph>
          A rating is a radio group with one tab stop. Each star holds one radio
          per score it can pick, named by <DocsCode>getValueLabel</DocsCode>, so
          name scores in words people use, like “Great, 5 of 5”. The star icons
          are hidden from screen readers. A read-only rating is a single image
          instead.
        </DocsParagraph>
        <DocsParagraph>
          Stars only grow on hover and shrink on press when motion is allowed.
          On touch screens each star gets extra padding, and in forced colors
          mode filled stars use the text color and empty ones use the system’s
          gray.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Each part wraps the UI SDK part of the same name and accepts all of
          its props, including <DocsCode>render</DocsCode> and a{" "}
          <DocsCode>className</DocsCode> that can be a function of the part’s
          state.
        </DocsParagraph>
        <DocsSection title="Rating" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "number | null" },
              { name: "defaultValue", type: "number | null" },
              {
                name: "onValueChange",
                type: "(value: number | null, details) => void",
              },
              { name: "max", type: "number", default: "5" },
              { name: "step", type: "number", default: "1" },
              {
                name: "size",
                type: '"sm" | "default" | "lg"',
                default: '"default"',
              },
              {
                name: "tone",
                type: '"default" | "neutral" | "destructive"',
                default: '"default"',
              },
              { name: "deselectable", type: "boolean", default: "false" },
              { name: "readOnly", type: "boolean", default: "false" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "required", type: "boolean", default: "false" },
              { name: "name", type: "string" },
              { name: "loop", type: "boolean", default: "false" },
              {
                name: "getValueLabel",
                type: "(value: number, max: number) => string",
                description:
                  "Names each score for its radio, and a read-only rating.",
              },
              {
                name: "controller",
                type: "RatingController",
                description: "From createRatingController().",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="rating"',
                description: "Target the rating in CSS.",
              },
              {
                name: "data-size",
                description: "The size: sm, default or lg.",
              },
              {
                name: "data-tone",
                description: "The tone: default, neutral or destructive.",
              },
              {
                name: "data-readonly",
                description: "Present when read-only.",
              },
              {
                name: "data-disabled",
                description: "Present when disabled.",
              },
              {
                name: "--rating-color",
                description: "The color of filled stars, set by tone.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="RatingItem" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                description:
                  "The star’s icon. Defaults to a Tabler star that fills by --rating-fill.",
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="rating-item"',
                description: "Target a star in CSS.",
              },
              {
                name: "data-filled",
                description: "Present on stars the shown score covers whole.",
              },
              {
                name: "data-partial",
                description:
                  "Present on the star the shown score covers part of.",
              },
              {
                name: "data-checked",
                description: "Present on the star the score ends in.",
              },
              {
                name: "data-highlighted",
                description:
                  "Present on the stars up to the score a pointer previews.",
              },
              {
                name: "--rating-fill",
                description:
                  "How much of the star the shown score covers, from 0 to 1.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
