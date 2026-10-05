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
import { HoverCardArrowDemo } from "@/components/examples/hover-card/arrow"
import { HoverCardAsync } from "@/components/examples/hover-card/async"
import { HoverCardControlled } from "@/components/examples/hover-card/controlled"
import { HoverCardDelay } from "@/components/examples/hover-card/delay"
import { HoverCardDemo } from "@/components/examples/hover-card/demo"
import { HoverCardDetached } from "@/components/examples/hover-card/detached"
import { HoverCardInline } from "@/components/examples/hover-card/inline"
import { HoverCardLongContent } from "@/components/examples/hover-card/long-content"
import { HoverCardRichContent } from "@/components/examples/hover-card/rich-content"
import { HoverCardRtl } from "@/components/examples/hover-card/rtl"
import { HoverCardSides } from "@/components/examples/hover-card/sides"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("hover-card")

const importCode = `import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"`

const usageCode = `<HoverCard>
  <HoverCardTrigger href="/profile" render={<Button variant="link" nativeButton={false} render={<a />} />}>
    @hextaui
  </HoverCardTrigger>
  <HoverCardContent>
    Components built on shadcn/ui.
  </HoverCardContent>
</HoverCard>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `HoverCard
├── HoverCardTrigger
└── HoverCardContent`

export default function Page() {
  return (
    <DocsComponentPage slug="hover-card">
      <DocsExample file="hover-card/demo">
        <HoverCardDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "cn"]}
        files={["components/ui/hover-card.tsx", "lib/motion.ts"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          A hover card is a preview, not a menu or a dialog. The trigger stays a
          normal link, so everything in the card must also be on the page it
          links to.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="hover-card/sides"
          title="Side"
          description={
            <>
              Set <DocsCode>side</DocsCode> and <DocsCode>align</DocsCode> on{" "}
              <DocsCode>{"<HoverCardContent />"}</DocsCode>. Logical sides like{" "}
              <DocsCode>inline-end</DocsCode> follow the reading direction, and
              the card flips or shifts when it would leave the screen.
            </>
          }
        >
          <HoverCardSides />
        </DocsExample>
        <DocsExample
          file="hover-card/delay"
          title="Delay"
          description={
            <>
              <DocsCode>delay</DocsCode> and <DocsCode>closeDelay</DocsCode> on
              the trigger set how long the pointer must rest before the card
              opens and how long it lingers after leaving. The 600ms default
              stops cards from flashing open as the pointer crosses a page.
            </>
          }
        >
          <HoverCardDelay />
        </DocsExample>
        <DocsExample
          file="hover-card/inline"
          title="Inline link"
          description={
            <>
              Use <DocsCode>render</DocsCode> to make the trigger any link,
              including one inside a sentence. When a link wraps onto two lines,
              the card anchors to the line you hovered.
            </>
          }
        >
          <HoverCardInline />
        </DocsExample>
        <DocsExample
          file="hover-card/rich-content"
          title="Interactive content"
          description="Move the pointer from the link into the card and it stays open, so links and buttons inside can be clicked. The path between them is forgiving, so a diagonal move doesn’t close it."
        >
          <HoverCardRichContent />
        </DocsExample>
        <DocsExample
          file="hover-card/detached"
          title="Shared card"
          description={
            <>
              One card serves many links. Create a handle with{" "}
              <DocsCode>createHoverCardHandle</DocsCode>, give each trigger a{" "}
              <DocsCode>payload</DocsCode>, and read it in the card. Moving
              between names glides the card to the new link instead of closing
              and reopening it. The old content slides out the way you moved,
              the new content slides in, and the height eases between the two.
            </>
          }
        >
          <HoverCardDetached />
        </DocsExample>
        <DocsExample
          file="hover-card/arrow"
          title="Arrow"
          description={
            <>
              <DocsCode>arrow</DocsCode> adds a pointer that joins the
              card&apos;s border without a seam. The side offset grows to make
              room for it, and it follows the card when it flips.
            </>
          }
        >
          <HoverCardArrowDemo />
        </DocsExample>
        <DocsExample
          file="hover-card/async"
          title="Loading content"
          description={
            <>
              Start fetching in <DocsCode>onOpenChange</DocsCode> and show a
              skeleton until the data arrives. When the content changes, the
              card eases to its new height instead of jumping.
            </>
          }
        >
          <HoverCardAsync />
        </DocsExample>
        <DocsExample
          file="hover-card/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>open</DocsCode> and{" "}
              <DocsCode>onOpenChange</DocsCode>. The second argument says why it
              changed, such as <DocsCode>trigger-hover</DocsCode>,{" "}
              <DocsCode>trigger-focus</DocsCode> or{" "}
              <DocsCode>escape-key</DocsCode>.
            </>
          }
        >
          <HoverCardControlled />
        </DocsExample>
        <DocsExample
          file="hover-card/long-content"
          title="Long content"
          description="Unbroken text wraps inside the card, and a card taller than the space beside the trigger scrolls instead of leaving the screen."
        >
          <HoverCardLongContent />
        </DocsExample>
        <DocsExample
          file="hover-card/rtl"
          title="Right to left"
          description="The card reads the trigger’s direction, so logical sides and alignment flip and the scale animation grows from the correct corner."
        >
          <HoverCardRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Focusing the trigger opens the card after the same delay as hover. Moving focus on closes it.",
            },
            {
              keys: ["Enter"],
              description: "Follows the link, like any other link.",
            },
            { keys: ["Esc"], description: "Closes the card." },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The card is a visual extra for sighted mouse and keyboard users.
            Screen readers only hear the link, so they aren’t forced through a
            preview on every link they pass.
          </li>
          <li>
            Nothing opens on touch screens, where there is no hover. A tap
            follows the link, which is why the destination has to hold the same
            information.
          </li>
          <li>
            Focus never moves into the card. If it needs controls that must be
            reachable from the keyboard, use a popover instead.
          </li>
          <li>
            With reduced motion on, the card fades without scaling, and a shared
            card jumps between links instead of gliding.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI preview card. Every part accepts the props of the
          primitive it wraps.
        </DocsParagraph>
        <DocsSection title="HoverCard" level={3}>
          <DocsPropsTable
            props={[
              { name: "open", type: "boolean" },
              { name: "defaultOpen", type: "boolean", default: "false" },
              {
                name: "onOpenChange",
                type: "(open: boolean, details) => void",
                description:
                  "details.reason is trigger-hover, trigger-focus, trigger-press, outside-press, escape-key, imperative-action or none.",
              },
              {
                name: "onOpenChangeComplete",
                type: "(open: boolean) => void",
                description: "Called after the open or close animation ends.",
              },
              {
                name: "handle",
                type: "HoverCardHandle<Payload>",
                description: "Connects triggers rendered outside the root.",
              },
              {
                name: "children",
                type: "ReactNode | ({ payload }) => ReactNode",
                description:
                  "Use the function form to read the payload of the trigger that opened the card.",
              },
              {
                name: "actionsRef",
                type: "RefObject<{ close, unmount }>",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="HoverCardTrigger" level={3}>
          <DocsPropsTable
            props={[
              { name: "href", type: "string" },
              {
                name: "delay",
                type: "number",
                default: "600",
                description:
                  "Milliseconds before hover or focus opens the card.",
              },
              {
                name: "closeDelay",
                type: "number",
                default: "300",
                description: "Milliseconds the card stays open after leaving.",
              },
              { name: "handle", type: "HoverCardHandle<Payload>" },
              {
                name: "payload",
                type: "Payload",
                description: "Passed to the card when this trigger opens it.",
              },
              {
                name: "render",
                type: renderType,
                default: "<a>",
                description:
                  'Render your own link, such as <Button variant="link" /> or a router link.',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="hover-card-trigger"',
                description: "Target the trigger in CSS.",
              },
              {
                name: "data-popup-open",
                description: "Present while this trigger’s card is open.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="HoverCardContent" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "side",
                type: '"top" | "bottom" | "left" | "right" | "inline-start" | "inline-end"',
                default: '"bottom"',
              },
              {
                name: "align",
                type: '"start" | "center" | "end"',
                default: '"center"',
              },
              {
                name: "arrow",
                type: "boolean",
                default: "false",
                description: "Show a pointer toward the trigger.",
              },
              {
                name: "sideOffset",
                type: "number | OffsetFunction",
                default: "6, or 10 with arrow",
              },
              {
                name: "alignOffset",
                type: "number | OffsetFunction",
                default: "0",
              },
              {
                name: "collisionPadding",
                type: "number | Rect",
                default: "8",
                description:
                  "Space kept between the card and the viewport edge.",
              },
              {
                name: "collisionAvoidance",
                type: "CollisionAvoidance",
                description:
                  "Whether the card flips, shifts or does nothing on collision.",
              },
              { name: "sticky", type: "boolean", default: "false" },
              {
                name: "anchor",
                type: "Element | RefObject | VirtualElement",
                description:
                  "Position against something other than the trigger.",
              },
              {
                name: "positionMethod",
                type: '"absolute" | "fixed"',
                default: '"absolute"',
              },
              {
                name: "disableAnchorTracking",
                type: "boolean",
                default: "false",
              },
              {
                name: "portalProps",
                type: "HoverCardPortalProps",
                description: "Props for the portal, such as container.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="hover-card-content"',
                description: "Target the card in CSS.",
              },
              {
                name: "data-open",
                description: "Present while the card is open.",
              },
              {
                name: "data-starting-style",
                description: "Present while the card animates in.",
              },
              {
                name: "data-ending-style",
                description: "Present while the card animates out.",
              },
              {
                name: "data-instant",
                description:
                  "focus when keyboard focus opened the card, dismiss when Escape or an outside press closed it. The exit animation is skipped while it’s set.",
              },
              {
                name: "data-side",
                description: "The side the card settled on after collisions.",
              },
              {
                name: "data-align",
                description: "The alignment it settled on.",
              },
              {
                name: "--transform-origin",
                description:
                  "Where the scale animation grows from, next to the trigger.",
              },
              {
                name: "--available-width",
                description:
                  "Room left beside the trigger. The card never grows past it.",
              },
              {
                name: "--available-height",
                description:
                  "Room left above or below. Taller content scrolls.",
              },
            ]}
          />
          <DocsAttributesTable
            label="Positioner attribute"
            attributes={[
              {
                name: 'data-slot="hover-card-positioner"',
                description:
                  "The element that moves. It glides when a shared card switches links.",
              },
              {
                name: "data-anchor-hidden",
                description: "Present when the trigger scrolls out of view.",
              },
            ]}
          />
          <DocsAttributesTable
            label="Inner parts"
            attributes={[
              {
                name: 'data-slot="hover-card-viewport"',
                description:
                  "Wraps the content. Carries data-activation-direction while a shared card switches links.",
              },
              {
                name: 'data-slot="hover-card-body"',
                description: "Your content. Its height eases when it changes.",
              },
              {
                name: 'data-slot="hover-card-arrow"',
                description: "The pointer, with data-side for its edge.",
              },
              {
                name: "--popup-height",
                description: "Set on the card while it resizes between links.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="HoverCardPortal" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "container",
                type: "HTMLElement | ShadowRoot | RefObject | null",
                default: "document.body",
              },
              { name: "keepMounted", type: "boolean", default: "false" },
            ]}
          />
        </DocsSection>
        <DocsSection title="createHoverCardHandle" level={3}>
          <DocsParagraph>
            Returns a handle for detached triggers. Its{" "}
            <DocsCode>open(triggerId)</DocsCode> and{" "}
            <DocsCode>close()</DocsCode> methods control the card from event
            handlers, and <DocsCode>isOpen</DocsCode> reads its state. Pass a
            type argument to type the payload.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
