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
import { BubbleAlignment } from "@/components/examples/bubble/alignment"
import { BubbleDemo } from "@/components/examples/bubble/demo"
import { BubbleGroupDemo } from "@/components/examples/bubble/group"
import { BubbleLongContent } from "@/components/examples/bubble/long-content"
import { BubbleNested } from "@/components/examples/bubble/nested"
import { BubblePopover } from "@/components/examples/bubble/popover"
import { BubbleReactionsDemo } from "@/components/examples/bubble/reactions"
import { BubbleRtl } from "@/components/examples/bubble/rtl"
import { BubbleShapes } from "@/components/examples/bubble/shapes"
import { BubbleShowMore } from "@/components/examples/bubble/show-more"
import { BubbleTail } from "@/components/examples/bubble/tail"
import { BubbleTooltip } from "@/components/examples/bubble/tooltip"
import { BubbleVariants } from "@/components/examples/bubble/variants"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("bubble")

const importCode = `import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble"`

const usageCode = `<BubbleGroup>
  <Bubble variant="secondary">
    <BubbleContent>Did the deploy land?</BubbleContent>
  </Bubble>
  <Bubble align="end">
    <BubbleContent>It did.</BubbleContent>
  </Bubble>
</BubbleGroup>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `BubbleGroup
└── Bubble
    ├── BubbleContent
    └── BubbleReactions`

export default function Page() {
  return (
    <DocsComponentPage slug="bubble">
      <DocsExample file="bubble/demo">
        <BubbleDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "class-variance-authority", "cn"]}
        files={["components/ui/bubble.tsx"]}
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
          file="bubble/variants"
          title="Variants"
          description={
            <>
              Seven treatments, from a strong primary bubble to unframed{" "}
              <DocsCode>ghost</DocsCode> content for assistant replies.{" "}
              <DocsCode>destructive</DocsCode> tints the surface and colors
              icons inside it.
            </>
          }
        >
          <BubbleVariants />
        </DocsExample>
        <DocsExample
          file="bubble/alignment"
          title="Alignment"
          description={
            <>
              <DocsCode>{'align="end"'}</DocsCode> pushes a bubble to the end of
              the row for the current user’s messages. It follows the reading
              direction.
            </>
          }
        >
          <BubbleAlignment />
        </DocsExample>
        <DocsExample
          file="bubble/group"
          title="Group"
          description={
            <>
              Wrap consecutive messages from one sender in{" "}
              <DocsCode>{"<BubbleGroup />"}</DocsCode>. Corners on the sender
              side tighten so the run reads as one block, and a lone bubble
              stays fully round.
            </>
          }
        >
          <BubbleGroupDemo />
        </DocsExample>
        <DocsExample
          file="bubble/shapes"
          title="Shapes"
          description={
            <>
              Set <DocsCode>shape</DocsCode> on a group to style all of its
              bubbles, or on a single bubble. <DocsCode>joined</DocsCode> is the
              default.
            </>
          }
        >
          <BubbleShapes />
        </DocsExample>
        <DocsExample
          file="bubble/tail"
          title="Tail"
          description={
            <>
              <DocsCode>{'shape="tail"'}</DocsCode> draws a tail on the last
              bubble of a run, matching the bubble color. Outline and ghost
              bubbles skip it.
            </>
          }
        >
          <BubbleTail />
        </DocsExample>
        <DocsExample
          file="bubble/reactions"
          title="Reactions"
          description={
            <>
              <DocsCode>{"<BubbleReactions />"}</DocsCode> overlaps the bubble
              edge and reserves its own space, so the next row needs no extra
              gap. Give a static row <DocsCode>{'role="img"'}</DocsCode> and a
              label, or use buttons for interactive reactions.
            </>
          }
        >
          <BubbleReactionsDemo />
        </DocsExample>
        <DocsExample
          file="bubble/show-more"
          title="Show more"
          description={
            <>
              Render a <DocsCode>{"<Collapsible />"}</DocsCode> as the bubble
              content to fold long messages. The bubble grows smoothly and the
              hidden text stays searchable.
            </>
          }
        >
          <BubbleShowMore />
        </DocsExample>
        <DocsExample
          file="bubble/tooltip"
          title="Tooltip"
          description={
            <>
              Render a bubble as a tooltip trigger to show details like the read
              time. Add <DocsCode>tabIndex</DocsCode> so keyboard users can
              reach it.
            </>
          }
        >
          <BubbleTooltip />
        </DocsExample>
        <DocsExample
          file="bubble/popover"
          title="Popover"
          description={
            <>
              Render the content as a <DocsCode>{"<button>"}</DocsCode> to make
              the whole bubble a popover trigger, for example to explain a
              failed delivery.
            </>
          }
        >
          <BubblePopover />
        </DocsExample>
        <DocsExample
          file="bubble/long-content"
          title="Long content"
          description="Unbroken strings, URLs, emoji and CJK text wrap inside the bubble instead of overflowing a narrow column."
        >
          <BubbleLongContent />
        </DocsExample>
        <DocsExample
          file="bubble/nested"
          title="Nested reply"
          description="A quoted bubble inside another keeps radii concentric with its parent."
        >
          <BubbleNested />
        </DocsExample>
        <DocsExample
          file="bubble/rtl"
          title="Right to left"
          description="Alignment, joined corners, tails and reactions all mirror in right-to-left layouts."
        >
          <BubbleRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Bubbles are plain containers. Wrap a conversation in a list or a{" "}
            <DocsCode>{'role="log"'}</DocsCode> region if new messages should be
            announced.
          </li>
          <li>
            Emoji-only reaction rows need <DocsCode>{'role="img"'}</DocsCode>{" "}
            and an <DocsCode>aria-label</DocsCode> that spells out the
            reactions.
          </li>
          <li>
            Interactive content rendered as a button or link gets a focus ring
            that follows the bubble’s corners.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Every part renders a <DocsCode>{"<div>"}</DocsCode> by default and
          accepts its attributes, plus a <DocsCode>render</DocsCode> prop to
          swap the element.
        </DocsParagraph>
        <DocsSection title="Bubble" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "destructive"',
                default: '"default"',
              },
              {
                name: "align",
                type: '"start" | "end"',
                default: '"start"',
              },
              {
                name: "shape",
                type: '"uniform" | "joined" | "tail"',
                default: '"joined"',
                description: "Inherited from BubbleGroup when not set.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="bubble"',
                description: "Target bubbles in CSS.",
              },
              { name: "data-variant", description: "The current variant." },
              { name: "data-align", description: "The current alignment." },
              { name: "data-shape", description: "The resolved shape." },
              {
                name: "--bubble-bg",
                description: "The surface color, also used by the tail.",
              },
              { name: "--bubble-fg", description: "The text color." },
              { name: "--bubble-border", description: "The ring color." },
              {
                name: "--bubble-radius",
                description: "The corner radius.",
              },
              {
                name: "--bubble-radius-joined",
                description: "The tighter radius used between grouped bubbles.",
              },
              {
                name: "--bubble-accent",
                description:
                  "Icon color inside the content. Set by destructive.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="BubbleContent" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "render",
                type: renderType,
                default: "<div>",
                description: "Render a <button> or <a> to make it interactive.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="bubble-content"',
                description: "Target the bubble surface in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="BubbleGroup" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "shape",
                type: '"uniform" | "joined" | "tail"',
                description: "Applies to every bubble inside the group.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="bubble-group"',
                description: "Target groups in CSS.",
              },
              { name: "data-shape", description: "The group shape, when set." },
            ]}
          />
        </DocsSection>
        <DocsSection title="BubbleReactions" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "side",
                type: '"top" | "bottom"',
                default: '"bottom"',
              },
              {
                name: "align",
                type: '"start" | "end"',
                default: '"end"',
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="bubble-reactions"',
                description: "Target reaction rows in CSS.",
              },
              { name: "data-side", description: "The current side." },
              { name: "data-align", description: "The current alignment." },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
