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
import { SheetControlled } from "@/components/examples/sheet/controlled"
import { SheetDemo } from "@/components/examples/sheet/demo"
import { SheetDetached } from "@/components/examples/sheet/detached"
import { SheetLongContent } from "@/components/examples/sheet/long-content"
import { SheetNested } from "@/components/examples/sheet/nested"
import { SheetNoCloseButton } from "@/components/examples/sheet/no-close-button"
import { SheetRtl } from "@/components/examples/sheet/rtl"
import { SheetSides } from "@/components/examples/sheet/sides"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("sheet")

const importCode = `import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"`

const usageCode = `<Sheet>
  <SheetTrigger render={<Button variant="outline" />}>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>Make changes to your profile.</SheetDescription>
    </SheetHeader>
    <SheetBody>{/* content */}</SheetBody>
    <SheetFooter>
      <SheetClose render={<Button />}>Save changes</SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `Sheet
├── SheetTrigger
└── SheetContent
    ├── SheetHeader
    │   ├── SheetTitle
    │   └── SheetDescription
    ├── SheetBody
    └── SheetFooter
        └── SheetClose`

export default function Page() {
  return (
    <DocsComponentPage slug="sheet">
      <DocsExample file="sheet/demo">
        <SheetDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={["components/ui/sheet.tsx", "components/ui/button.tsx"]}
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
          file="sheet/sides"
          title="Sides"
          description={
            <>
              Set <DocsCode>side</DocsCode> to slide in from any edge. Each
              sheet can be swiped back towards its own edge, and the close
              gesture follows your finger with momentum.
            </>
          }
        >
          <SheetSides />
        </DocsExample>
        <DocsExample
          file="sheet/long-content"
          title="Long content"
          description={
            <>
              <DocsCode>{"<SheetBody />"}</DocsCode> scrolls on its own, so the
              header and footer stay in place however long the content gets.
            </>
          }
        >
          <SheetLongContent />
        </DocsExample>
        <DocsExample
          file="sheet/no-close-button"
          title="Without the close button"
          description={
            <>
              Set <DocsCode>{"showCloseButton={false}"}</DocsCode> when the
              footer already has a way out. Escape, the backdrop and swiping
              still close it.
            </>
          }
        >
          <SheetNoCloseButton />
        </DocsExample>
        <DocsExample
          file="sheet/nested"
          title="Nested"
          description="A sheet or alert dialog opened from a sheet layers on top. The parent scales back slightly and each extra layer adds a lighter backdrop, so the stack stays readable. Escape closes only the top layer."
        >
          <SheetNested />
        </DocsExample>
        <DocsExample
          file="sheet/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>open</DocsCode> and{" "}
              <DocsCode>onOpenChange</DocsCode> to open it from anywhere,
              without a trigger.
            </>
          }
        >
          <SheetControlled />
        </DocsExample>
        <DocsExample
          file="sheet/detached"
          title="Detached triggers"
          description={
            <>
              Share one sheet between several triggers with{" "}
              <DocsCode>createSheetHandle</DocsCode>. Each trigger passes a{" "}
              <DocsCode>payload</DocsCode> that the sheet renders through a
              function child.
            </>
          }
        >
          <SheetDetached />
        </DocsExample>
        <DocsExample
          file="sheet/rtl"
          title="Right to left"
          description={
            <>
              With <DocsCode>{'dir="rtl"'}</DocsCode>, the right side mirrors to
              the left edge, slides in from there and swipes out the same way.
            </>
          }
        >
          <SheetRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Enter", "Space"],
              description:
                "On the trigger, opens the sheet and moves focus inside it.",
            },
            {
              keys: ["Tab", "Shift + Tab"],
              description:
                "Moves between focusable elements. Focus stays inside the sheet.",
            },
            {
              keys: ["Esc"],
              description:
                "Closes the topmost sheet and returns focus to its trigger.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The sheet is a modal dialog. <DocsCode>{"<SheetTitle />"}</DocsCode>{" "}
            labels it and <DocsCode>{"<SheetDescription />"}</DocsCode>{" "}
            describes it, so always include a title.
          </li>
          <li>
            Page scroll is locked and content behind it is hidden from assistive
            tech while it is open.
          </li>
          <li>
            The close button is labelled “Close”. The handle on the inner edge
            shows the sheet can be dragged and is hidden from assistive tech.
          </li>
          <li>
            With reduced motion enabled, the sheet fades in and out instead of
            sliding.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI drawer. Every part accepts the props of the
          primitive it wraps.
        </DocsParagraph>
        <DocsSection title="Sheet" level={3}>
          <DocsPropsTable
            props={[
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
              },
              {
                name: "disablePointerDismissal",
                type: "boolean",
                default: "false",
                description: "Keep it open when the backdrop is clicked.",
              },
              {
                name: "swipeDirection",
                type: '"up" | "down" | "left" | "right"',
                description:
                  "Set automatically from the content’s side and direction.",
              },
              { name: "handle", type: "SheetHandle<Payload>" },
              {
                name: "children",
                type: "ReactNode | ({ payload }) => ReactNode",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SheetTrigger" level={3}>
          <DocsPropsTable
            props={[
              { name: "handle", type: "SheetHandle<Payload>" },
              { name: "payload", type: "Payload" },
              { name: "render", type: renderType, default: "<button>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sheet-trigger"',
                description: "Target the trigger in CSS.",
              },
              {
                name: "data-popup-open",
                description: "Present while its sheet is open.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SheetContent" level={3}>
          <DocsParagraph>
            Renders the portal, backdrop, viewport and popup, plus the drag
            handle and close button.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "side",
                type: '"top" | "right" | "bottom" | "left"',
                default: '"right"',
              },
              { name: "showCloseButton", type: "boolean", default: "true" },
              {
                name: "dir",
                type: '"ltr" | "rtl"',
                description:
                  "Sets the direction for the sheet. right and left mirror in rtl.",
              },
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
                description:
                  "Side sheets are 75% wide, up to 24rem from the sm breakpoint.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sheet-content"',
                description: "The sheet panel.",
              },
              {
                name: "data-side",
                description: "The side it opens from.",
              },
              {
                name: "data-open",
                description: "Present while the sheet is open.",
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
                name: "data-swipe-direction",
                description: "The direction that dismisses it.",
              },
              {
                name: "data-nested-drawer-open",
                description: "Present while a nested sheet is open on top.",
              },
              {
                name: 'data-slot="sheet-handle"',
                description: "The drag handle on the inner edge.",
              },
              {
                name: 'data-slot="sheet-close-button"',
                description: "The built-in close button.",
              },
              {
                name: "--drawer-swipe-movement-x",
                description:
                  "Horizontal drag distance. A -y variable exists too.",
              },
              {
                name: "--nested-drawers",
                description: "How many nested sheets are open on top.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SheetOverlay" level={3}>
          <DocsParagraph>
            Rendered by <DocsCode>{"<SheetContent />"}</DocsCode>. Nested layers
            get a lighter backdrop.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sheet-overlay"',
                description: "The backdrop.",
              },
              {
                name: "data-nested",
                description: "Present on backdrops of nested layers.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SheetHeader, SheetBody, SheetFooter" level={3}>
          <DocsParagraph>
            Plain <DocsCode>{"<div>"}</DocsCode> elements that lay out the
            sheet. The header leaves room for the close button, the body scrolls
            and takes the remaining height, and the footer stacks its actions on
            small screens and lines them up at the end from the sm breakpoint.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sheet-header"',
                description: "Title and description.",
              },
              {
                name: 'data-slot="sheet-body"',
                description: "Scrollable content.",
              },
              { name: 'data-slot="sheet-footer"', description: "Actions." },
            ]}
          />
        </DocsSection>
        <DocsSection title="SheetTitle" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<h2>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sheet-title"',
                description: "Labels the sheet.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SheetDescription" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<p>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sheet-description"',
                description: "Describes the sheet.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SheetClose" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<button>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sheet-close"',
                description: "Closes the sheet when pressed.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="createSheetHandle" level={3}>
          <DocsParagraph>
            <DocsCode>{"createSheetHandle<Payload>()"}</DocsCode> returns a
            handle that connects a <DocsCode>{"<Sheet />"}</DocsCode> to
            triggers rendered elsewhere. Create it once, outside your component.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
