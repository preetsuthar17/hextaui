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
  DocsPropsTable,
} from "@/components/docs/docs-props-table"
import { AspectRatioBrokenImage } from "@/components/examples/aspect-ratio/broken-image"
import { AspectRatioDemo } from "@/components/examples/aspect-ratio/demo"
import { AspectRatioFigure } from "@/components/examples/aspect-ratio/figure"
import { AspectRatioFlexColumn } from "@/components/examples/aspect-ratio/flex-column"
import { AspectRatioInvalidRatio } from "@/components/examples/aspect-ratio/invalid-ratio"
import { AspectRatioOverlay } from "@/components/examples/aspect-ratio/overlay"
import { AspectRatioRatios } from "@/components/examples/aspect-ratio/ratios"
import { AspectRatioResponsive } from "@/components/examples/aspect-ratio/responsive"
import { AspectRatioRtl } from "@/components/examples/aspect-ratio/rtl"
import { AspectRatioSlowLoad } from "@/components/examples/aspect-ratio/slow-load"
import { AspectRatioTextContent } from "@/components/examples/aspect-ratio/text-content"
import { AspectRatioWithoutPlaceholder } from "@/components/examples/aspect-ratio/without-placeholder"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("aspect-ratio")

const importCode = `import { AspectRatio } from "@/components/ui/aspect-ratio"`

const usageCode = `<AspectRatio ratio={16 / 9} className="rounded-lg">
  <img src="/photo.jpg" alt="Sunset over mountains" />
</AspectRatio>`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="aspect-ratio">
      <DocsExample file="aspect-ratio/demo">
        <AspectRatioDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={["components/ui/aspect-ratio.tsx", "components/ui/skeleton.tsx"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="aspect-ratio/ratios"
          title="Ratios"
          description={
            <>
              <DocsCode>ratio</DocsCode> takes a number, a{" "}
              <DocsCode>{'"w/h"'}</DocsCode> string or a{" "}
              <DocsCode>{'"w:h"'}</DocsCode> string.
            </>
          }
        >
          <AspectRatioRatios />
        </DocsExample>
        <DocsExample
          file="aspect-ratio/slow-load"
          title="Slow load"
          description="The box holds its shape and shimmers until the image arrives, then the image fades in, so nothing below it moves. Press Reload to watch it again."
        >
          <AspectRatioSlowLoad />
        </DocsExample>
        <DocsExample
          file="aspect-ratio/broken-image"
          title="Broken image"
          description={
            <>
              When the image fails, the browser’s broken-image glyph is hidden
              and a fallback icon is shown instead. Pass{" "}
              <DocsCode>fallback</DocsCode> to replace it, or{" "}
              <DocsCode>{"fallback={null}"}</DocsCode> to show nothing.
            </>
          }
        >
          <AspectRatioBrokenImage />
        </DocsExample>
        <DocsExample
          file="aspect-ratio/overlay"
          title="Overlay"
          description="Absolutely positioned children sit on top of the media. The box clips nothing, so focus rings on overlay links stay visible."
        >
          <AspectRatioOverlay />
        </DocsExample>
        <DocsExample
          file="aspect-ratio/without-placeholder"
          title="Without placeholder"
          description={
            <>
              <DocsCode>{"placeholder={false}"}</DocsCode> turns off the loading
              shimmer, the fade-in and the fallback, for the plain shadcn
              behavior.
            </>
          }
        >
          <AspectRatioWithoutPlaceholder />
        </DocsExample>
        <DocsExample
          file="aspect-ratio/responsive"
          title="Responsive"
          description={
            <>
              Override the ratio at a breakpoint with an aspect class. This one
              is square on small screens and{" "}
              <DocsCode>md:aspect-video</DocsCode> from md up.
            </>
          }
        >
          <AspectRatioResponsive />
        </DocsExample>
        <DocsExample
          file="aspect-ratio/flex-column"
          title="Inside a centered flex column"
          description="The box is full width by default, so it fills the column instead of collapsing to zero when the parent centers its children."
        >
          <AspectRatioFlexColumn />
        </DocsExample>
        <DocsExample
          file="aspect-ratio/text-content"
          title="Text content"
          description="Children that aren’t media get the box and nothing else. Position them yourself."
        >
          <AspectRatioTextContent />
        </DocsExample>
        <DocsExample
          file="aspect-ratio/figure"
          title="As a figure"
          description="Keep captions outside the box so they don’t change the ratio."
        >
          <AspectRatioFigure />
        </DocsExample>
        <DocsExample
          file="aspect-ratio/invalid-ratio"
          title="Invalid ratio"
          description={
            <>
              <DocsCode>0</DocsCode>, negative numbers and unparsable strings
              fall back to a square and log a warning in development.
            </>
          }
        >
          <AspectRatioInvalidRatio />
        </DocsExample>
        <DocsExample
          file="aspect-ratio/rtl"
          title="Right to left"
          description="Overlays positioned with logical properties like start-3 follow the reading direction."
        >
          <AspectRatioRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The box is <DocsCode>aria-busy</DocsCode> while its media loads.
          </li>
          <li>
            The fallback is decorative and hidden from assistive tech. The
            image’s <DocsCode>alt</DocsCode> text stays available when it fails
            to load, so always write one.
          </li>
          <li>With reduced motion on, media appears without fading.</li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Accepts every attribute of the element it renders. Media placed
          directly inside, an <DocsCode>{"<img>"}</DocsCode>,{" "}
          <DocsCode>{"<picture>"}</DocsCode> or <DocsCode>{"<video>"}</DocsCode>
          , fills the box with <DocsCode>object-cover</DocsCode> and inherits
          its radius.
        </DocsParagraph>
        <DocsSection title="AspectRatio" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "ratio",
                type: "number | `${number}/${number}` | `${number}:${number}`",
                default: "1",
              },
              {
                name: "placeholder",
                type: "boolean",
                default: "true",
                description:
                  "Shows a shimmer while the media loads and a fallback when it fails.",
              },
              {
                name: "fallback",
                type: "ReactNode",
                default: "<IconPhotoOff />",
                description: "Shown when the media fails. null shows nothing.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="aspect-ratio"',
                description: "Target the box in CSS.",
              },
              {
                name: "data-state",
                description:
                  "loading, loaded or error. Set only when placeholder is on and the box holds media.",
              },
              {
                name: "aria-busy",
                description: "Present while the media loads.",
              },
              {
                name: "--ratio",
                description: "The parsed ratio as a number.",
              },
              {
                name: 'data-slot="aspect-ratio-placeholder"',
                description:
                  "The shimmer shown while loading or after an error.",
              },
              {
                name: 'data-slot="aspect-ratio-fallback"',
                description: "The wrapper around the fallback.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="parseAspectRatio" level={3}>
          <DocsParagraph>
            <DocsCode>parseAspectRatio(ratio)</DocsCode> turns any accepted
            ratio into a number, falling back to <DocsCode>1</DocsCode>. Use it
            to size other elements the same way. The{" "}
            <DocsCode>AspectRatioValue</DocsCode> and{" "}
            <DocsCode>AspectRatioProps</DocsCode> types are exported too.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
