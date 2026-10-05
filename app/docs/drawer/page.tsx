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
import { DrawerConfirm } from "@/components/examples/drawer/confirm"
import { DrawerControlled } from "@/components/examples/drawer/controlled"
import { DrawerDemo } from "@/components/examples/drawer/demo"
import { DrawerDetached } from "@/components/examples/drawer/detached"
import { DrawerDirections } from "@/components/examples/drawer/directions"
import { DrawerKeyboard } from "@/components/examples/drawer/keyboard"
import { DrawerNested } from "@/components/examples/drawer/nested"
import { DrawerNonModal } from "@/components/examples/drawer/non-modal"
import { DrawerResponsive } from "@/components/examples/drawer/responsive"
import { DrawerRtl } from "@/components/examples/drawer/rtl"
import { DrawerScrollable } from "@/components/examples/drawer/scrollable"
import { DrawerSnapPoints } from "@/components/examples/drawer/snap-points"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("drawer")

const importCode = `import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"`

const usageCode = `<Drawer>
  <DrawerTrigger render={<Button variant="outline" />}>Open</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Are you absolutely sure?</DrawerTitle>
      <DrawerDescription>This action cannot be undone.</DrawerDescription>
    </DrawerHeader>
    <DrawerBody>{/* content */}</DrawerBody>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `Drawer
├── DrawerTrigger
└── DrawerContent
    ├── DrawerHeader
    │   ├── DrawerTitle
    │   └── DrawerDescription
    ├── DrawerBody
    └── DrawerFooter
        └── DrawerClose`

export default function Page() {
  return (
    <DocsComponentPage slug="drawer">
      <DocsExample file="drawer/demo">
        <DrawerDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "@tabler/icons-react", "cn"]}
        files={[
          "components/ui/drawer.tsx",
          "components/ui/sheet.tsx",
          "components/ui/button.tsx",
        ]}
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
          file="drawer/directions"
          title="Directions"
          description={
            <>
              Set <DocsCode>swipeDirection</DocsCode> on{" "}
              <DocsCode>{"<Drawer />"}</DocsCode> to pick the edge. The drawer
              opens from that edge and swipes back towards it. Top and bottom
              drawers show a handle by default.
            </>
          }
        >
          <DrawerDirections />
        </DocsExample>
        <DocsExample
          file="drawer/snap-points"
          title="Snap points"
          description={
            <>
              Pass <DocsCode>snapPoints</DocsCode> to rest a bottom drawer at
              preset heights. Numbers from 0 to 1 are fractions of the viewport,
              larger numbers are pixels, and strings take px or rem. The visible
              part always fits its content, so nothing hides below the screen.
            </>
          }
        >
          <DrawerSnapPoints />
        </DocsExample>
        <DocsExample
          file="drawer/scrollable"
          title="Scrollable content"
          description={
            <>
              <DocsCode>{"<DrawerBody />"}</DocsCode> scrolls on its own, so the
              header and footer stay in place. Swiping only starts once the body
              is scrolled back to the top.
            </>
          }
        >
          <DrawerScrollable />
        </DocsExample>
        <DocsExample
          file="drawer/keyboard"
          title="Forms and the keyboard"
          description={
            <>
              Wrap <DocsCode>{"<DrawerContent />"}</DocsCode> in{" "}
              <DocsCode>{"<DrawerVirtualKeyboardProvider />"}</DocsCode> when a
              bottom drawer holds text fields. On phones, the focused field
              scrolls into view above the software keyboard instead of hiding
              behind it. Keep the fields in{" "}
              <DocsCode>{"<DrawerBody />"}</DocsCode> so the header and footer
              stay put.
            </>
          }
        >
          <DrawerKeyboard />
        </DocsExample>
        <DocsExample
          file="drawer/nested"
          title="Nested"
          description="A drawer opened from a drawer on the same edge stacks on top. The ones behind shrink, peek out above it and follow your finger as you swipe the top one away."
        >
          <DrawerNested />
        </DocsExample>
        <DocsExample
          file="drawer/confirm"
          title="Confirm from a drawer"
          description="Dialogs, alert dialogs, sheets and drawers on another edge layer on top instead of stacking. The drawer steps back and a lighter backdrop covers it."
        >
          <DrawerConfirm />
        </DocsExample>
        <DocsExample
          file="drawer/responsive"
          title="Responsive"
          description={
            <>
              Change <DocsCode>swipeDirection</DocsCode> with a media query to
              show a side panel on desktop and a bottom sheet on phones.
            </>
          }
        >
          <DrawerResponsive />
        </DocsExample>
        <DocsExample
          file="drawer/non-modal"
          title="Non-modal"
          description={
            <>
              With <DocsCode>{"modal={false}"}</DocsCode> there is no backdrop,
              the page keeps scrolling and focus can leave the drawer.
            </>
          }
        >
          <DrawerNonModal />
        </DocsExample>
        <DocsExample
          file="drawer/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>open</DocsCode> and{" "}
              <DocsCode>onOpenChange</DocsCode> to open it from anywhere,
              without a trigger.
            </>
          }
        >
          <DrawerControlled />
        </DocsExample>
        <DocsExample
          file="drawer/detached"
          title="Detached triggers"
          description={
            <>
              Share one drawer between several triggers with{" "}
              <DocsCode>createDrawerHandle</DocsCode>. Each trigger passes a{" "}
              <DocsCode>payload</DocsCode> that the drawer renders through a
              function child.
            </>
          }
        >
          <DrawerDetached />
        </DocsExample>
        <DocsExample
          file="drawer/rtl"
          title="Right to left"
          description={
            <>
              Pass <DocsCode>{'dir="rtl"'}</DocsCode> to{" "}
              <DocsCode>{"<DrawerContent />"}</DocsCode> to mirror its content.{" "}
              <DocsCode>swipeDirection</DocsCode> names a physical edge, so{" "}
              <DocsCode>{'"left"'}</DocsCode> stays on the left and the handle
              stays on the inner edge.
            </>
          }
        >
          <DrawerRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Enter", "Space"],
              description:
                "On the trigger, opens the drawer and moves focus inside it.",
            },
            {
              keys: ["Tab", "Shift + Tab"],
              description:
                "Moves between focusable elements. Focus stays inside a modal drawer.",
            },
            {
              keys: ["Esc"],
              description:
                "Closes the topmost drawer and returns focus to its trigger.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The drawer is a dialog. <DocsCode>{"<DrawerTitle />"}</DocsCode>{" "}
            labels it and <DocsCode>{"<DrawerDescription />"}</DocsCode>{" "}
            describes it, so always include a title.
          </li>
          <li>
            Swiping is never the only way out: Escape, the backdrop and a{" "}
            <DocsCode>{"<DrawerClose />"}</DocsCode> button all close it too.
          </li>
          <li>
            The handle is decorative and hidden from assistive tech. With a
            mouse, text inside the drawer can be selected without dragging it.
          </li>
          <li>
            With reduced motion enabled, the drawer fades in and out instead of
            sliding. Dragging still follows the pointer.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI drawer. Every part accepts the props of the
          primitive it wraps.
        </DocsParagraph>
        <DocsSection title="Drawer" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "swipeDirection",
                type: '"up" | "down" | "left" | "right"',
                default: '"down"',
                description:
                  "The edge it opens from and the direction that dismisses it.",
              },
              {
                name: "showSwipeHandle",
                type: "boolean",
                description:
                  "Shows the handle. Defaults to true for up and down, false for left and right.",
              },
              {
                name: "snapPoints",
                type: "(number | string)[]",
                description:
                  "Heights a vertical drawer can rest at. 0–1 is a fraction of the viewport, >1 is pixels, strings take px or rem.",
              },
              { name: "snapPoint", type: "number | string | null" },
              { name: "defaultSnapPoint", type: "number | string | null" },
              {
                name: "onSnapPointChange",
                type: "(snapPoint, details) => void",
              },
              { name: "defaultOpen", type: "boolean", default: "false" },
              { name: "open", type: "boolean" },
              {
                name: "onOpenChange",
                type: "(open: boolean, details) => void",
              },
              {
                name: "onOpenChangeComplete",
                type: "(open: boolean) => void",
                description: "Called after the open or close animation ends.",
              },
              {
                name: "modal",
                type: 'boolean | "trap-focus"',
                default: "true",
                description: "The backdrop only renders when true.",
              },
              {
                name: "disablePointerDismissal",
                type: "boolean",
                default: "false",
                description: "Keep it open when the backdrop is clicked.",
              },
              { name: "handle", type: "DrawerHandle<Payload>" },
              {
                name: "children",
                type: "ReactNode | ({ payload }) => ReactNode",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DrawerTrigger" level={3}>
          <DocsPropsTable
            props={[
              { name: "handle", type: "DrawerHandle<Payload>" },
              { name: "payload", type: "Payload" },
              { name: "render", type: renderType, default: "<button>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="drawer-trigger"',
                description: "Target the trigger in CSS.",
              },
              {
                name: "data-popup-open",
                description: "Present while its drawer is open.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DrawerContent" level={3}>
          <DocsParagraph>
            Renders the portal, backdrop, viewport and popup, plus the handle.
            Vertical drawers fit their content up to the viewport height minus
            4rem. Side drawers are 75% wide, up to 24rem from the sm breakpoint.
            Override with <DocsCode>h-*</DocsCode> or <DocsCode>w-*</DocsCode>,
            or scope it to one axis with{" "}
            <DocsCode>{"data-[swipe-axis=y]:"}</DocsCode>.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "initialFocus",
                type: "boolean | RefObject | (type) => HTMLElement | boolean",
              },
              {
                name: "finalFocus",
                type: "boolean | RefObject | (type) => HTMLElement | boolean",
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
                name: 'data-slot="drawer-popup"',
                description: "The drawer panel.",
              },
              {
                name: 'data-slot="drawer-content"',
                description:
                  "The inner wrapper around your children. It scrolls when nothing else does.",
              },
              {
                name: "data-swipe-direction",
                description: "up, right, down or left.",
              },
              {
                name: "data-swipe-axis",
                description: "x or y.",
              },
              {
                name: "data-open",
                description: "Present while the drawer is open.",
              },
              {
                name: "data-starting-style",
                description: "Present while it animates in.",
              },
              {
                name: "data-ending-style",
                description: "Present while it animates out.",
              },
              {
                name: "data-swiping",
                description: "Present while it is being dragged.",
              },
              {
                name: "data-snap-points",
                description: "Present when the drawer has snap points.",
              },
              {
                name: "data-expanded",
                description: "Present at the full-height snap point.",
              },
              {
                name: "data-nested-drawer-open",
                description: "Present while another drawer is open on top.",
              },
              {
                name: "data-stack",
                description:
                  "Present while a drawer on the same edge is stacked on top.",
              },
              {
                name: "--drawer-inset",
                description:
                  "Floats the drawer away from the viewport edges. Defaults to 0px.",
              },
              {
                name: "--drawer-bleed-background",
                description:
                  "Fills the area revealed when dragged past its edge. Defaults to the popover color.",
              },
              {
                name: "--drawer-swipe-movement-x",
                description:
                  "Horizontal drag distance. A -y variable exists too.",
              },
              {
                name: "--drawer-snap-point-offset",
                description:
                  "How far the current snap point sits below the top.",
              },
              {
                name: "--nested-drawers",
                description: "How many drawers are open on top.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DrawerOverlay" level={3}>
          <DocsParagraph>
            Rendered by <DocsCode>{"<DrawerContent />"}</DocsCode> when{" "}
            <DocsCode>modal</DocsCode> is true. It fades as you swipe, and stays
            at least half visible when there are snap points. A drawer layered
            over a sheet or a drawer on another edge gets a lighter backdrop.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="drawer-overlay"',
                description: "The backdrop.",
              },
              {
                name: "data-nested",
                description: "Present on lighter backdrops of layered drawers.",
              },
              {
                name: "--drawer-overlay-min-opacity",
                description:
                  "The lowest opacity it fades to while swiping. 0, or 0.5 with snap points.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DrawerSwipeHandle" level={3}>
          <DocsParagraph>
            Rendered by <DocsCode>{"<DrawerContent />"}</DocsCode> on the inner
            edge when <DocsCode>showSwipeHandle</DocsCode> is on. The whole
            drawer can be dragged, so the handle is a visual cue.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="drawer-swipe-handle"',
                description: "The handle.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DrawerHeader, DrawerBody, DrawerFooter" level={3}>
          <DocsParagraph>
            Plain <DocsCode>{"<div>"}</DocsCode> elements that lay out the
            drawer. The header centers its text in vertical drawers on small
            screens, the body scrolls and takes the remaining space, and the
            footer stacks its actions.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="drawer-header"',
                description: "Title and description.",
              },
              {
                name: 'data-slot="drawer-body"',
                description: "Scrollable content.",
              },
              { name: 'data-slot="drawer-footer"', description: "Actions." },
            ]}
          />
        </DocsSection>
        <DocsSection title="DrawerTitle" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<h2>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="drawer-title"',
                description: "Labels the drawer.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DrawerDescription" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<p>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="drawer-description"',
                description: "Describes the drawer.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DrawerVirtualKeyboardProvider" level={3}>
          <DocsParagraph>
            Renders no element. Place it inside{" "}
            <DocsCode>{"<Drawer />"}</DocsCode>, around{" "}
            <DocsCode>{"<DrawerContent />"}</DocsCode>. While the software
            keyboard is open, it adds room below the drawer&rsquo;s scroll
            container, scrolls the focused field into view, and makes taps on
            fields open the keyboard on iOS. Drawers without it are unaffected.
          </DocsParagraph>
          <DocsPropsTable props={[{ name: "children", type: "ReactNode" }]} />
          <DocsAttributesTable
            attributes={[
              {
                name: "--drawer-keyboard-inset",
                description:
                  "Set on the viewport while the keyboard is open: how much of it overlaps the page. Use it with a 0px fallback.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DrawerClose" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<button>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="drawer-close"',
                description: "Closes the drawer when pressed.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="createDrawerHandle" level={3}>
          <DocsParagraph>
            <DocsCode>{"createDrawerHandle<Payload>()"}</DocsCode> returns a
            handle that connects a <DocsCode>{"<Drawer />"}</DocsCode> to
            triggers rendered elsewhere. Create it once, outside your component.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
