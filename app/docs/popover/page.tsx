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
import { PopoverCalendar } from "@/components/examples/popover/calendar"
import { PopoverControlled } from "@/components/examples/popover/controlled"
import { PopoverDemo } from "@/components/examples/popover/demo"
import { PopoverDetached } from "@/components/examples/popover/detached"
import { PopoverDisabled } from "@/components/examples/popover/disabled"
import { PopoverHover } from "@/components/examples/popover/hover"
import { PopoverLongContent } from "@/components/examples/popover/long-content"
import { PopoverModal } from "@/components/examples/popover/modal"
import { PopoverNested } from "@/components/examples/popover/nested"
import { PopoverPlacement } from "@/components/examples/popover/placement"
import { PopoverResizing } from "@/components/examples/popover/resizing"
import { PopoverRtl } from "@/components/examples/popover/rtl"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("popover")

const importCode = `import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"`

const usageCode = `<Popover>
  <PopoverTrigger render={<Button variant="outline" />}>
    Open
  </PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Dimensions</PopoverTitle>
      <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
    </PopoverHeader>
  </PopoverContent>
</Popover>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `Popover
├── PopoverTrigger
└── PopoverContent
    ├── PopoverHeader
    │   ├── PopoverTitle
    │   └── PopoverDescription
    └── PopoverClose`

export default function Page() {
  return (
    <DocsComponentPage slug="popover">
      <DocsExample file="popover/demo">
        <PopoverDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "cn"]}
        files={["components/ui/popover.tsx"]}
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
          file="popover/resizing"
          title="Content that changes size"
          description="When the content grows or shrinks, the popup animates its height instead of jumping. Continuous changes, like typing, follow the content directly so nothing lags behind."
        >
          <PopoverResizing />
        </DocsExample>
        <DocsExample
          file="popover/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>open</DocsCode> and{" "}
              <DocsCode>onOpenChange</DocsCode> to drive it from your own state.
              The second argument tells you why it changed, such as{" "}
              <DocsCode>trigger-press</DocsCode>,{" "}
              <DocsCode>outside-press</DocsCode> or{" "}
              <DocsCode>escape-key</DocsCode>.
            </>
          }
        >
          <PopoverControlled />
        </DocsExample>
        <DocsExample
          file="popover/placement"
          title="Placement"
          description={
            <>
              <DocsCode>side</DocsCode> and <DocsCode>align</DocsCode> set the
              preferred position. When there is no room, the popup flips to the
              other side and shifts to stay on screen, keeping 8px from the
              edges.
            </>
          }
        >
          <PopoverPlacement />
        </DocsExample>
        <DocsExample
          file="popover/hover"
          title="Open on hover"
          description={
            <>
              Set <DocsCode>openOnHover</DocsCode> on the trigger for preview
              cards. <DocsCode>delay</DocsCode> and{" "}
              <DocsCode>closeDelay</DocsCode> keep it from flickering as the
              pointer passes over.
            </>
          }
        >
          <PopoverHover />
        </DocsExample>
        <DocsExample
          file="popover/detached"
          title="Detached triggers"
          description={
            <>
              Create a handle with <DocsCode>createPopoverHandle</DocsCode> to
              share one popover between several triggers anywhere in the tree.
              Each trigger passes a <DocsCode>payload</DocsCode>, and the popup
              renders it through a function child.
            </>
          }
        >
          <PopoverDetached />
        </DocsExample>
        <DocsExample
          file="popover/calendar"
          title="With a calendar"
          description={
            <>
              Use <DocsCode>{'className="w-auto p-0"'}</DocsCode> to fit content
              that brings its own padding. The popup follows the calendar as it
              changes months.
            </>
          }
        >
          <PopoverCalendar />
        </DocsExample>
        <DocsExample
          file="popover/nested"
          title="Nested"
          description="A popover inside another popover or a sheet layers above its parent. Clicks inside the child keep the parent open, and Escape closes only the topmost layer."
        >
          <PopoverNested />
        </DocsExample>
        <DocsExample
          file="popover/long-content"
          title="Long content"
          description="Unbroken text wraps inside the popup. When the content is taller than the space available, the popup scrolls inside instead of running off screen."
        >
          <PopoverLongContent />
        </DocsExample>
        <DocsExample
          file="popover/modal"
          title="Modal"
          description={
            <>
              With <DocsCode>modal</DocsCode>, page scroll is locked and outside
              clicks only dismiss the popover. Render a{" "}
              <DocsCode>{"<PopoverClose />"}</DocsCode> inside so focus can be
              trapped and touch screen readers have a way out.
            </>
          }
        >
          <PopoverModal />
        </DocsExample>
        <DocsExample
          file="popover/disabled"
          title="Disabled"
          description={
            <>
              A <DocsCode>disabled</DocsCode> trigger never opens its popover.
            </>
          }
        >
          <PopoverDisabled />
        </DocsExample>
        <DocsExample
          file="popover/rtl"
          title="Right to left"
          description={
            <>
              The popup picks up the direction of the trigger that opened it,
              even though it renders in a portal. Logical sides like{" "}
              <DocsCode>inline-end</DocsCode> flip with it.
            </>
          }
        >
          <PopoverRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Enter", "Space"],
              description:
                "On the trigger, opens or closes the popover. Focus moves into the popup.",
            },
            {
              keys: ["Tab"],
              description:
                "Moves through the popup’s content. Tabbing out of a non-modal popover closes it.",
            },
            {
              keys: ["Esc"],
              description:
                "Closes the popover and returns focus to the trigger.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            <DocsCode>{"<PopoverTitle />"}</DocsCode> and{" "}
            <DocsCode>{"<PopoverDescription />"}</DocsCode> label and describe
            the popup for screen readers. Include a title whenever the popup
            contains more than a sentence.
          </li>
          <li>
            Focus moves to the first focusable element when it opens and back to
            the trigger when it closes. Change this with{" "}
            <DocsCode>initialFocus</DocsCode> and{" "}
            <DocsCode>finalFocus</DocsCode>.
          </li>
          <li>With reduced motion enabled, the popup fades without scaling.</li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI popover. Every part accepts the props of the
          primitive it wraps.
        </DocsParagraph>
        <DocsSection title="Popover" level={3}>
          <DocsPropsTable
            props={[
              { name: "defaultOpen", type: "boolean", default: "false" },
              { name: "open", type: "boolean" },
              {
                name: "onOpenChange",
                type: "(open: boolean, details) => void",
                description: "details.reason says what caused the change.",
              },
              {
                name: "onOpenChangeComplete",
                type: "(open: boolean) => void",
                description: "Called after the open or close animation ends.",
              },
              {
                name: "modal",
                type: 'boolean | "trap-focus"',
                default: "false",
                description:
                  "true locks page scroll and outside interaction. trap-focus only traps focus.",
              },
              {
                name: "handle",
                type: "PopoverHandle<Payload>",
                description: "Connects detached triggers.",
              },
              {
                name: "children",
                type: "ReactNode | ({ payload }) => ReactNode",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="PopoverTrigger" level={3}>
          <DocsPropsTable
            props={[
              { name: "openOnHover", type: "boolean", default: "false" },
              {
                name: "delay",
                type: "number",
                default: "300",
                description: "Milliseconds before opening on hover.",
              },
              {
                name: "closeDelay",
                type: "number",
                default: "0",
                description: "Milliseconds before closing after hover ends.",
              },
              { name: "handle", type: "PopoverHandle<Payload>" },
              {
                name: "payload",
                type: "Payload",
                description: "Passed to the popup when this trigger opens it.",
              },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "render", type: renderType, default: "<button>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="popover-trigger"',
                description: "Target the trigger in CSS.",
              },
              {
                name: "data-popup-open",
                description: "Present while its popover is open.",
              },
              {
                name: "data-pressed",
                description: "Present while the trigger is pressed.",
              },
              {
                name: "data-disabled",
                description: "Present when the trigger is disabled.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="PopoverContent" level={3}>
          <DocsParagraph>
            Renders the portal, the positioner and the popup in one part.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "side",
                type: '"top" | "right" | "bottom" | "left" | "inline-start" | "inline-end"',
                default: '"bottom"',
              },
              {
                name: "align",
                type: '"start" | "center" | "end"',
                default: '"center"',
              },
              {
                name: "sideOffset",
                type: "number | (data) => number",
                default: "6",
                description: "Gap between the trigger and the popup.",
              },
              {
                name: "alignOffset",
                type: "number | (data) => number",
                default: "0",
              },
              {
                name: "collisionPadding",
                type: "number | Rect",
                default: "8",
                description: "Space kept from the edges of the viewport.",
              },
              {
                name: "collisionAvoidance",
                type: "CollisionAvoidance",
                description:
                  "Whether to flip, shift or neither when space runs out.",
              },
              { name: "collisionBoundary", type: "Boundary" },
              {
                name: "anchor",
                type: "Element | RefObject | VirtualElement | () => Element",
                description:
                  "Position against something other than the trigger.",
              },
              { name: "sticky", type: "boolean", default: "false" },
              {
                name: "positionMethod",
                type: '"absolute" | "fixed"',
                default: '"absolute"',
              },
              {
                name: "initialFocus",
                type: "boolean | RefObject | (type) => HTMLElement | boolean",
                description: "Where focus goes when the popover opens.",
              },
              {
                name: "finalFocus",
                type: "boolean | RefObject | (type) => HTMLElement | boolean",
                description: "Where focus goes when the popover closes.",
              },
              {
                name: "portalProps",
                type: "PortalProps",
                description: "Props for the portal, such as container.",
              },
              {
                name: "className",
                type: "string | (state) => string",
                description: "The popup is w-72 by default.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="popover-content"',
                description: "The popup.",
              },
              {
                name: 'data-slot="popover-positioner"',
                description: "The element that positions the popup.",
              },
              {
                name: "data-open",
                description: "Present while the popover is open.",
              },
              {
                name: "data-starting-style",
                description: "Present while the popup animates in.",
              },
              {
                name: "data-ending-style",
                description: "Present while the popup animates out.",
              },
              {
                name: "data-side",
                description: "The side the popup ended up on.",
              },
              {
                name: "data-align",
                description: "The alignment the popup ended up with.",
              },
              {
                name: "data-instant",
                description: "Present when the change should not animate.",
              },
              {
                name: "--transform-origin",
                description: "The point the popup scales from, at the trigger.",
              },
              {
                name: "--available-width",
                description: "Space between the trigger and the viewport edge.",
              },
              {
                name: "--available-height",
                description:
                  "Space between the trigger and the viewport edge. The popup’s max height.",
              },
              { name: "--anchor-width", description: "The trigger’s width." },
              { name: "--anchor-height", description: "The trigger’s height." },
            ]}
          />
        </DocsSection>
        <DocsSection title="PopoverHeader" level={3}>
          <DocsParagraph>
            A plain <DocsCode>{"<div>"}</DocsCode> that stacks the title and
            description.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="popover-header"',
                description: "Target the header in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="PopoverTitle" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<h2>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="popover-title"',
                description: "Labels the popup.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="PopoverDescription" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<p>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="popover-description"',
                description: "Describes the popup.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="PopoverClose" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<button>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="popover-close"',
                description: "Closes the popover when pressed.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="createPopoverHandle" level={3}>
          <DocsParagraph>
            <DocsCode>{"createPopoverHandle<Payload>()"}</DocsCode> returns a
            handle that connects a <DocsCode>{"<Popover />"}</DocsCode> to
            triggers rendered elsewhere. Create it once, outside your component.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
