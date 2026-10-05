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
import { ScrollAreaBoth } from "@/components/examples/scroll-area/both"
import { ScrollAreaChat } from "@/components/examples/scroll-area/chat"
import { ScrollAreaColoredSurface } from "@/components/examples/scroll-area/colored-surface"
import { ScrollAreaDemo } from "@/components/examples/scroll-area/demo"
import { ScrollAreaDynamic } from "@/components/examples/scroll-area/dynamic"
import { ScrollAreaHorizontal } from "@/components/examples/scroll-area/horizontal"
import { ScrollAreaPeek } from "@/components/examples/scroll-area/peek"
import { ScrollAreaRtl } from "@/components/examples/scroll-area/rtl"
import { ScrollAreaSheet } from "@/components/examples/scroll-area/sheet"
import { ScrollAreaText } from "@/components/examples/scroll-area/text"
import { ScrollAreaWithoutFade } from "@/components/examples/scroll-area/without-fade"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("scroll-area")

const importCode = `import { ScrollArea } from "@/components/ui/scroll-area"`

const usageCode = `<ScrollArea className="h-72 rounded-lg border">
  <div className="p-4">{/* long content */}</div>
</ScrollArea>`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="scroll-area">
      <DocsExample file="scroll-area/demo">
        <ScrollAreaDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "class-variance-authority", "cn"]}
        files={["components/ui/scroll-area.tsx"]}
      />

      <DocsSection title="Usage">
        <DocsParagraph>
          Give the scroll area a fixed height or width. Content beyond it
          scrolls with the native scroll behavior, and a thin scrollbar appears
          while you hover or scroll.
        </DocsParagraph>
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="scroll-area/peek"
          title="Peek"
          description={
            <>
              Both lists have the same height. With <DocsCode>peek</DocsCode>,
              on the right, the box trims itself so the last visible item is cut
              partway through, which shows there is more to scroll before anyone
              tries. It never trims the box below half its height.
            </>
          }
        >
          <ScrollAreaPeek />
        </DocsExample>
        <DocsExample
          file="scroll-area/text"
          title="Text"
          description="Edges fade only where there is more content to scroll to. At the top only the bottom fades, and the fade grows in as you scroll away from an edge."
        >
          <ScrollAreaText />
        </DocsExample>
        <DocsExample
          file="scroll-area/chat"
          title="Start at the bottom"
          description={
            <>
              <DocsCode>viewportRef</DocsCode> gives you the scrolling element.
              Set its <DocsCode>scrollTop</DocsCode> to start a chat at the
              latest message, so only the top edge fades.
            </>
          }
        >
          <ScrollAreaChat />
        </DocsExample>
        <DocsExample
          file="scroll-area/horizontal"
          title="Horizontal"
          description={
            <>
              Set <DocsCode>{'scrollbars="horizontal"'}</DocsCode> and give the
              content <DocsCode>w-max</DocsCode> so it can grow past the box.
            </>
          }
        >
          <ScrollAreaHorizontal />
        </DocsExample>
        <DocsExample
          file="scroll-area/both"
          title="Both axes"
          description={
            <>
              <DocsCode>{'scrollbars="both"'}</DocsCode> shows both scrollbars
              and a corner where they meet, and fades all four edges.
            </>
          }
        >
          <ScrollAreaBoth />
        </DocsExample>
        <DocsExample
          file="scroll-area/dynamic"
          title="Dynamic content"
          description="Peek and the fades update as items are added or removed. With too few items to scroll, the box keeps its height and nothing fades."
        >
          <ScrollAreaDynamic />
        </DocsExample>
        <DocsExample
          file="scroll-area/colored-surface"
          title="On a colored surface"
          description="The fade is a mask on the content, not an overlay color, so it works on any background."
        >
          <ScrollAreaColoredSurface />
        </DocsExample>
        <DocsExample
          file="scroll-area/sheet"
          title="Inside a sheet"
          description={
            <>
              Inside a flex column, wrap it in an element with{" "}
              <DocsCode>min-h-0 flex-1</DocsCode> and give the scroll area{" "}
              <DocsCode>h-full</DocsCode> so it fills the remaining space.
            </>
          }
        >
          <ScrollAreaSheet />
        </DocsExample>
        <DocsExample
          file="scroll-area/without-fade"
          title="Without fade"
          description={
            <>
              Turn the edge fades off with <DocsCode>{"fade={false}"}</DocsCode>
              .
            </>
          }
        >
          <ScrollAreaWithoutFade />
        </DocsExample>
        <DocsExample
          file="scroll-area/rtl"
          title="Right to left"
          description="Content starts at the right edge, the scrollbar and fades follow the reading direction, and the direction is picked up from the page."
        >
          <ScrollAreaRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsParagraph>
          The viewport joins the tab order only when it has something to scroll.
          Once focused, it scrolls with the browser’s native keys.
        </DocsParagraph>
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description: "Focuses the viewport when its content overflows.",
            },
            { keys: ["↑", "↓"], description: "Scrolls vertically." },
            { keys: ["←", "→"], description: "Scrolls horizontally." },
            {
              keys: ["Page Up", "Page Down", "Space"],
              description: "Scrolls by a page.",
            },
            {
              keys: ["Home", "End"],
              description: "Jumps to the start or end.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Give the scroll area an <DocsCode>aria-label</DocsCode> when its
            purpose isn’t clear from the surrounding content, like the
            “Messages” label in the chat example.
          </li>
          <li>
            The focus ring is drawn on the scroll area itself, so it stays
            visible above the faded edges.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI scroll area. <DocsCode>ScrollArea</DocsCode>{" "}
          renders the root, viewport, content and scrollbars together.
        </DocsParagraph>
        <DocsSection title="ScrollArea" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "scrollbars",
                type: '"vertical" | "horizontal" | "both"',
                default: '"vertical"',
              },
              {
                name: "fade",
                type: "boolean",
                default: "true",
                description: "Fade the edges that have more content.",
              },
              {
                name: "peek",
                type: "boolean",
                default: "false",
                description:
                  "Trim the height so the last visible item is cut partway. Mark items with data-scroll-area-item to choose which elements count.",
              },
              {
                name: "viewportRef",
                type: "Ref<HTMLDivElement>",
                description: "The element that scrolls.",
              },
              {
                name: "overflowEdgeThreshold",
                type: "number | { xStart, xEnd, yStart, yEnd }",
                default: "0",
                description:
                  "Pixels to scroll before an edge counts as overflowing.",
              },
              {
                name: "className",
                type: "string | (state) => string",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="scroll-area"',
                description: "The root.",
              },
              {
                name: 'data-slot="scroll-area-viewport"',
                description: "The element that scrolls.",
              },
              {
                name: 'data-slot="scroll-area-content"',
                description: "Wraps your content inside the viewport.",
              },
              {
                name: "data-peek",
                description: "Present when peek is on.",
              },
              {
                name: "data-peeking",
                description: "Present while peek is trimming the height.",
              },
              {
                name: "data-scrolling",
                description: "Present while the user scrolls.",
              },
              {
                name: "data-has-overflow-x",
                description: "Present when content is wider than the viewport.",
              },
              {
                name: "data-has-overflow-y",
                description:
                  "Present when content is taller than the viewport.",
              },
              {
                name: "data-overflow-y-start",
                description:
                  "Present when there is more content above. Matching -y-end, -x-start and -x-end attributes exist for the other edges.",
              },
              {
                name: "--scroll-area-fade",
                description: "Size of the edge fade. Defaults to 2.5rem.",
              },
              {
                name: "--scroll-area-overflow-y-start",
                description:
                  "Distance from the top edge in pixels. Matching -y-end, -x-start and -x-end variables exist.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ScrollBar" level={3}>
          <DocsParagraph>
            Rendered for you by <DocsCode>ScrollArea</DocsCode>. Export it only
            if you compose the Base UI parts yourself.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "orientation",
                type: '"vertical" | "horizontal"',
                default: '"vertical"',
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="scroll-area-scrollbar"',
                description: "The scrollbar track.",
              },
              {
                name: 'data-slot="scroll-area-thumb"',
                description: "The draggable thumb.",
              },
              {
                name: "data-orientation",
                description: "vertical or horizontal.",
              },
              {
                name: "data-hovering",
                description: "Present while the pointer is over the area.",
              },
              {
                name: "data-scrolling",
                description: "Present while the user scrolls.",
              },
              {
                name: "--scroll-area-thumb-height",
                description: "The thumb’s height.",
              },
              {
                name: "--scroll-area-thumb-width",
                description: "The thumb’s width.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
