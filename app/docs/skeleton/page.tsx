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
import { SkeletonAnimations } from "@/components/examples/skeleton/animations"
import { SkeletonDemo } from "@/components/examples/skeleton/demo"
import { SkeletonFastLoad } from "@/components/examples/skeleton/fast-load"
import { SkeletonInline } from "@/components/examples/skeleton/inline"
import { SkeletonManyRows } from "@/components/examples/skeleton/many-rows"
import { SkeletonRtl } from "@/components/examples/skeleton/rtl"
import { SkeletonShapes } from "@/components/examples/skeleton/shapes"
import { SkeletonTextDemo } from "@/components/examples/skeleton/text"
import { SkeletonWrapContent } from "@/components/examples/skeleton/wrap-content"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("skeleton")

const themeCode = `@import "tw-animate-css";

@theme {
  --animate-shimmer: shimmer 1.6s ease-in-out infinite;
  --animate-skeleton-pulse: skeleton-pulse 2s ease-in-out infinite;

  @keyframes shimmer {
    from {
      translate: calc(-100% * var(--skeleton-dir, 1)) 0;
    }
    to {
      translate: calc(100% * var(--skeleton-dir, 1)) 0;
    }
  }

  @keyframes skeleton-pulse {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
  }
}`

const importCode = `import { Skeleton, SkeletonText } from "@/components/ui/skeleton"`

const usageCode = `<Skeleton className="h-4 w-32" />

<Skeleton loading={isLoading}>
  <h3>{user.name}</h3>
</Skeleton>`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="skeleton">
      <DocsExample file="skeleton/demo">
        <SkeletonDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "class-variance-authority",
          "cn",
          "tw-animate-css",
        ]}
        files={["components/ui/skeleton.tsx"]}
      />

      <DocsSection title="Theme">
        <DocsParagraph>
          The shimmer and pulse use two animations from your theme. Add them to
          your global CSS file once.
        </DocsParagraph>
        <DocsCodeBlock code={themeCode} lang="css" />
      </DocsSection>

      <DocsSection title="Usage">
        <DocsParagraph>
          Use a skeleton on its own as a sized placeholder, or pass{" "}
          <DocsCode>loading</DocsCode> and wrap the real content so the
          placeholder takes its exact size.
        </DocsParagraph>
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="skeleton/shapes"
          title="Shapes"
          description="On its own, a skeleton is an empty block. Give it a size and radius with classes to match what it stands in for."
        >
          <SkeletonShapes />
        </DocsExample>
        <DocsExample
          file="skeleton/animations"
          title="Animations"
          description={
            <>
              <DocsCode>animation</DocsCode> picks a sweeping{" "}
              <DocsCode>shimmer</DocsCode>, a soft <DocsCode>pulse</DocsCode>,
              or <DocsCode>none</DocsCode>.
            </>
          }
        >
          <SkeletonAnimations />
        </DocsExample>
        <DocsExample
          file="skeleton/text"
          title="Text"
          description={
            <>
              <DocsCode>{"<SkeletonText />"}</DocsCode> draws one bar per line
              and follows the parent’s font size and line height, so it fills
              the same space as the text it replaces. The last line is shorter.
            </>
          }
        >
          <SkeletonTextDemo />
        </DocsExample>
        <DocsExample
          file="skeleton/wrap-content"
          title="Wrap real content"
          description={
            <>
              With <DocsCode>loading</DocsCode>, the skeleton renders the real
              content invisibly underneath, so it takes the exact size and
              nothing shifts when the data arrives. When{" "}
              <DocsCode>loading</DocsCode> turns false, the content fades in.
            </>
          }
        >
          <SkeletonWrapContent />
        </DocsExample>
        <DocsExample
          file="skeleton/inline"
          title="Inline"
          description={
            <>
              Pass <DocsCode>{"render={<span />}"}</DocsCode> to place a
              skeleton inside a sentence. It sits on the text baseline.
            </>
          }
        >
          <SkeletonInline />
        </DocsExample>
        <DocsExample
          file="skeleton/fast-load"
          title="Fast load"
          description="A skeleton stays invisible for its first 150ms, then fades in. Data that arrives sooner never flashes a placeholder."
        >
          <SkeletonFastLoad />
        </DocsExample>
        <DocsExample
          file="skeleton/many-rows"
          title="Many rows"
          description="Skeletons that mount together start their animation together, so a long list reads as one loading area."
        >
          <SkeletonManyRows />
        </DocsExample>
        <DocsExample
          file="skeleton/rtl"
          title="Right to left"
          description="In a right-to-left layout the shimmer sweeps from right to left."
        >
          <SkeletonRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            A skeleton on its own is decorative and hidden from assistive tech,
            and so is <DocsCode>{"<SkeletonText />"}</DocsCode>.
          </li>
          <li>
            A skeleton wrapping content sets <DocsCode>aria-busy</DocsCode>{" "}
            while loading. The content underneath is hidden from assistive tech
            and can’t be focused until it loads.
          </li>
          <li>
            Skeletons don’t announce anything. When people need to know what is
            loading, add a visible label or a status message.
          </li>
          <li>
            With reduced motion enabled, skeletons appear right away without
            shimmer, pulse or fade.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="Skeleton" level={3}>
          <DocsParagraph>
            Accepts every attribute of the element it renders.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "animation",
                type: '"shimmer" | "pulse" | "none"',
                default: '"shimmer"',
              },
              {
                name: "loading",
                type: "boolean",
                description:
                  "When set, the skeleton wraps its children: true shows the placeholder, false shows the content. Leave it out for a standalone placeholder.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="skeleton"',
                description: "Target skeletons in CSS.",
              },
              {
                name: "data-animation",
                description:
                  "The animation in use. Removed once wrapped content has loaded.",
              },
              {
                name: "data-loading",
                description:
                  '"true" or "false" when the skeleton wraps content.',
              },
              {
                name: 'data-slot="skeleton-content"',
                description:
                  "Wraps the real content. Invisible and inert while loading.",
              },
              {
                name: "--skeleton-dir",
                description:
                  "1, or -1 in right-to-left layouts. Sets the shimmer’s direction.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SkeletonText" level={3}>
          <DocsParagraph>
            Accepts every <DocsCode>{"<div>"}</DocsCode> attribute.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "lines",
                type: "number",
                default: "3",
                description: "Rounded down and kept between 1 and 50.",
              },
              {
                name: "animation",
                type: '"shimmer" | "pulse" | "none"',
                default: '"shimmer"',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="skeleton-text"',
                description: "The container for the lines.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
