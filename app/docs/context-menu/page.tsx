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
import { ContextMenuControlled } from "@/components/examples/context-menu/controlled"
import { ContextMenuDemo } from "@/components/examples/context-menu/demo"
import { ContextMenuDisabled } from "@/components/examples/context-menu/disabled"
import { ContextMenuFileList } from "@/components/examples/context-menu/file-list"
import { ContextMenuHoldFeedback } from "@/components/examples/context-menu/hold-feedback"
import { ContextMenuInSheet } from "@/components/examples/context-menu/in-sheet"
import { ContextMenuLongContent } from "@/components/examples/context-menu/long-content"
import { ContextMenuNested } from "@/components/examples/context-menu/nested"
import { ContextMenuRender } from "@/components/examples/context-menu/render"
import { ContextMenuRtl } from "@/components/examples/context-menu/rtl"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("context-menu")

const importCode = `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"`

const usageCode = `<ContextMenu>
  <ContextMenuTrigger>Right click here</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Profile</ContextMenuItem>
    <ContextMenuItem>Billing</ContextMenuItem>
    <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`

const renderType = "ReactElement | (props, state) => ReactElement"
const sideType =
  '"top" | "right" | "bottom" | "left" | "inline-start" | "inline-end"'
const alignType = '"start" | "center" | "end"'

const itemAttributes = [
  {
    name: "data-highlighted",
    description: "Present on the item under the pointer or keyboard focus.",
  },
  { name: "data-disabled", description: "Present when the item is disabled." },
  { name: "data-inset", description: "Present when inset is set." },
  {
    name: "data-chosen",
    description: "Present on the clicked item while it blinks.",
  },
]

const positionProps = [
  {
    name: "side",
    type: sideType,
    default: '"bottom"',
    description: "Preferred side, relative to the pointer.",
  },
  { name: "align", type: alignType, default: '"start"' },
  { name: "sideOffset", type: "number", default: "0" },
  { name: "alignOffset", type: "number", default: "0" },
  {
    name: "collisionPadding",
    type: "number | { top, right, bottom, left }",
    description: "Space to keep between the menu and the viewport edges.",
  },
  {
    name: "collisionAvoidance",
    type: "CollisionAvoidance",
    description: "How the menu flips or shifts when it would overflow.",
  },
  {
    name: "anchor",
    type: "Element | VirtualElement | RefObject",
    description: "Position against something other than the pointer.",
  },
]

const compositionCode = `ContextMenu
├── ContextMenuTrigger
└── ContextMenuContent
    ├── ContextMenuGroup
    │   ├── ContextMenuLabel
    │   └── ContextMenuItem
    │       └── ContextMenuShortcut
    ├── ContextMenuCheckboxItem
    ├── ContextMenuRadioGroup
    │   └── ContextMenuRadioItem
    ├── ContextMenuSeparator
    └── ContextMenuSub
        ├── ContextMenuSubTrigger
        └── ContextMenuSubContent`

export default function Page() {
  return (
    <DocsComponentPage slug="context-menu">
      <DocsExample file="context-menu/demo">
        <ContextMenuDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={["components/ui/context-menu.tsx"]}
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
          file="context-menu/file-list"
          title="File list"
          description="Give every row its own menu. The open row keeps a highlight, and a destructive item hands off to an alert dialog for confirmation."
        >
          <ContextMenuFileList />
        </DocsExample>
        <DocsExample
          file="context-menu/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>open</DocsCode> and{" "}
              <DocsCode>onOpenChange</DocsCode> to own the state. The second
              argument says why it changed, such as{" "}
              <DocsCode>trigger-press</DocsCode>,{" "}
              <DocsCode>outside-press</DocsCode> or{" "}
              <DocsCode>escape-key</DocsCode>. Items with{" "}
              <DocsCode>{"closeOnClick={false}"}</DocsCode> keep it open.
            </>
          }
        >
          <ContextMenuControlled />
        </DocsExample>
        <DocsExample
          file="context-menu/disabled"
          title="Disabled"
          description={
            <>
              A disabled <DocsCode>{"<ContextMenu />"}</DocsCode> gives the area
              back to the browser’s own menu. Disabled items stay visible but
              are skipped by the keyboard.
            </>
          }
        >
          <ContextMenuDisabled />
        </DocsExample>
        <DocsExample
          file="context-menu/hold-feedback"
          title="Hold feedback"
          description={
            <>
              On touch screens the menu opens after a long press. While the
              finger is held, the area shrinks slightly so people know the press
              registered. Moving the finger cancels it. Set{" "}
              <DocsCode>{"holdFeedback={false}"}</DocsCode> to turn it off.
            </>
          }
        >
          <ContextMenuHoldFeedback />
        </DocsExample>
        <DocsExample
          file="context-menu/long-content"
          title="Long content"
          description="Long labels wrap inside a 20rem maximum width, and tall menus scroll within the space left in the viewport."
        >
          <ContextMenuLongContent />
        </DocsExample>
        <DocsExample
          file="context-menu/nested"
          title="Nested submenus"
          description="Submenus open on hover or with the arrow keys, at any depth. A disabled submenu trigger never opens."
        >
          <ContextMenuNested />
        </DocsExample>
        <DocsExample
          file="context-menu/in-sheet"
          title="Inside a sheet"
          description="The menu layers above other overlays, and Escape closes only the menu, not the sheet behind it."
        >
          <ContextMenuInSheet />
        </DocsExample>
        <DocsExample
          file="context-menu/render"
          title="Render as another element"
          description={
            <>
              Use <DocsCode>render</DocsCode> to make the trigger any element,
              such as a figure, or to turn an item into a link.
            </>
          }
        >
          <ContextMenuRender />
        </DocsExample>
        <DocsExample
          file="context-menu/rtl"
          title="Right to left"
          description="The menu reads the trigger’s direction, so submenus open to the left and arrow keys flip."
        >
          <ContextMenuRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["↓"],
              description: "Highlights the next item, wrapping at the end.",
            },
            {
              keys: ["↑"],
              description:
                "Highlights the previous item, wrapping at the start.",
            },
            { keys: ["Home"], description: "Highlights the first item." },
            { keys: ["End"], description: "Highlights the last item." },
            {
              keys: ["Enter", "Space"],
              description:
                "Runs the highlighted item. Checkbox and radio items toggle and keep the menu open.",
            },
            {
              keys: ["→"],
              description:
                "Opens the highlighted submenu and moves into it. ← in right-to-left layouts.",
            },
            {
              keys: ["←"],
              description:
                "Closes the current submenu and returns to its trigger. → in right-to-left layouts.",
            },
            {
              keys: ["Esc"],
              description:
                "Closes the current menu. In a submenu, only that submenu closes.",
            },
            {
              keys: ["A–Z"],
              description:
                "Highlights the next item starting with that letter.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            A context menu is a shortcut. Make every action in it reachable some
            other way too, such as a visible button or a dropdown menu, since
            many people never right click or long press.
          </li>
          <li>
            Browsers also fire the context menu event for Shift F10 and the Menu
            key on a focused element, so a focusable element inside the trigger
            lets keyboard users open it.
          </li>
          <li>
            Shortcuts in <DocsCode>{"<ContextMenuShortcut />"}</DocsCode> are
            labels only. Bind the keys yourself.
          </li>
          <li>
            With reduced motion on, the hold feedback and the item blink are
            skipped and the menu only fades.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI context menu. Every part accepts the props of the
          primitive it wraps, and a function <DocsCode>className</DocsCode> that
          receives the part’s state.
        </DocsParagraph>
        <DocsSection title="ContextMenu" level={3}>
          <DocsPropsTable
            props={[
              { name: "open", type: "boolean" },
              { name: "defaultOpen", type: "boolean", default: "false" },
              {
                name: "onOpenChange",
                type: "(open: boolean, details) => void",
                description: "details.reason says what caused the change.",
              },
              {
                name: "onOpenChangeComplete",
                type: "(open: boolean) => void",
                description: "Runs after the open or close animation ends.",
              },
              {
                name: "disabled",
                type: "boolean",
                default: "false",
                description: "Shows the browser’s native menu instead.",
              },
              {
                name: "loopFocus",
                type: "boolean",
                default: "true",
                description: "Wrap arrow-key navigation at the ends.",
              },
              {
                name: "highlightItemOnHover",
                type: "boolean",
                default: "true",
              },
              {
                name: "actionsRef",
                type: "RefObject<{ close, unmount }>",
                description: "Close the menu imperatively.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ContextMenuTrigger" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "holdFeedback",
                type: "boolean",
                default: "true",
                description:
                  "Shrink the area slightly while a long press is held on touch screens.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="context-menu-trigger"',
                description: "Target the trigger in CSS.",
              },
              {
                name: "data-popup-open",
                description: "Present while its menu is open.",
              },
              {
                name: "data-holding",
                description: "Present while a long press is held.",
              },
              {
                name: "data-pressed",
                description: "Present while the trigger is pressed.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ContextMenuContent" level={3}>
          <DocsPropsTable
            props={[
              ...positionProps,
              {
                name: "finalFocus",
                type: "boolean | RefObject | (closeType) => HTMLElement | boolean",
                description: "Where focus goes after the menu closes.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="context-menu-content"',
                description: "The menu popup.",
              },
              { name: "data-open", description: "Present while open." },
              {
                name: "data-starting-style",
                description: "Present while the menu animates in.",
              },
              {
                name: "data-ending-style",
                description: "Present while the menu animates out.",
              },
              {
                name: "data-side",
                description: "The side it was placed on after collisions.",
              },
              {
                name: "data-chosen",
                description:
                  "Present after an item is clicked. The fade-out waits for the blink.",
              },
              {
                name: "--transform-origin",
                description: "The point the scale animation grows from.",
              },
              {
                name: "--available-height",
                description:
                  "Space left in the viewport. Caps the menu height.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ContextMenuItem" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "destructive"',
                default: '"default"',
              },
              {
                name: "inset",
                type: "boolean",
                default: "false",
                description: "Indent the label to line up with checkbox items.",
              },
              {
                name: "onClick",
                type: "(event) => void",
                description:
                  "Runs on click, Enter or Space. The menu closes after a short blink.",
              },
              { name: "closeOnClick", type: "boolean", default: "true" },
              { name: "disabled", type: "boolean", default: "false" },
              {
                name: "label",
                type: "string",
                description:
                  "Text used for typeahead when children are not plain text.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="context-menu-item"',
                description: "Target items in CSS.",
              },
              { name: "data-variant", description: "The current variant." },
              ...itemAttributes,
            ]}
          />
        </DocsSection>
        <DocsSection title="ContextMenuCheckboxItem" level={3}>
          <DocsPropsTable
            props={[
              { name: "checked", type: "boolean" },
              { name: "defaultChecked", type: "boolean", default: "false" },
              {
                name: "onCheckedChange",
                type: "(checked: boolean, details) => void",
              },
              { name: "closeOnClick", type: "boolean", default: "false" },
              { name: "inset", type: "boolean", default: "false" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="context-menu-checkbox-item"',
                description: "Target checkbox items in CSS.",
              },
              { name: "data-checked", description: "Present when checked." },
              {
                name: "data-unchecked",
                description: "Present when unchecked.",
              },
              ...itemAttributes,
            ]}
          />
        </DocsSection>
        <DocsSection title="ContextMenuRadioGroup" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "any" },
              { name: "defaultValue", type: "any" },
              {
                name: "onValueChange",
                type: "(value: any, details) => void",
              },
              { name: "disabled", type: "boolean", default: "false" },
            ]}
          />
        </DocsSection>
        <DocsSection title="ContextMenuRadioItem" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "any" },
              { name: "closeOnClick", type: "boolean", default: "false" },
              { name: "inset", type: "boolean", default: "false" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="context-menu-radio-item"',
                description: "Target radio items in CSS.",
              },
              { name: "data-checked", description: "Present when selected." },
              ...itemAttributes,
            ]}
          />
        </DocsSection>
        <DocsSection title="ContextMenuLabel" level={3}>
          <DocsPropsTable
            props={[
              { name: "inset", type: "boolean", default: "false" },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsParagraph>
            Inside <DocsCode>{"<ContextMenuGroup />"}</DocsCode> or{" "}
            <DocsCode>{"<ContextMenuRadioGroup />"}</DocsCode> it labels the
            group for assistive tech. Elsewhere it is a plain heading.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="ContextMenuSub" level={3}>
          <DocsPropsTable
            props={[
              { name: "open", type: "boolean" },
              { name: "defaultOpen", type: "boolean", default: "false" },
              {
                name: "onOpenChange",
                type: "(open: boolean, details) => void",
              },
              { name: "disabled", type: "boolean", default: "false" },
              {
                name: "closeParentOnEsc",
                type: "boolean",
                default: "false",
                description:
                  "Close the whole menu on Escape, not just this submenu.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ContextMenuSubTrigger" level={3}>
          <DocsPropsTable
            props={[
              { name: "inset", type: "boolean", default: "false" },
              { name: "openOnHover", type: "boolean", default: "true" },
              {
                name: "delay",
                type: "number",
                default: "100",
                description: "Milliseconds of hover before the submenu opens.",
              },
              { name: "closeDelay", type: "number", default: "0" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="context-menu-sub-trigger"',
                description: "Target submenu triggers in CSS.",
              },
              {
                name: "data-popup-open",
                description: "Present while its submenu is open.",
              },
              {
                name: "data-highlighted",
                description: "Present while highlighted.",
              },
              { name: "data-disabled", description: "Present when disabled." },
            ]}
          />
        </DocsSection>
        <DocsSection title="ContextMenuSubContent" level={3}>
          <DocsPropsTable
            props={[
              ...positionProps.map((prop) =>
                prop.name === "alignOffset"
                  ? { ...prop, default: "-4" }
                  : prop.name === "side"
                    ? {
                        ...prop,
                        default: undefined,
                        description: "Opens toward the inline end by default.",
                      }
                    : prop.name === "align"
                      ? { ...prop, default: undefined }
                      : prop
              ),
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="context-menu-sub-content"',
                description:
                  "The submenu popup. Takes the same state attributes as the menu.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ContextMenuShortcut" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "dir",
                type: '"ltr" | "rtl"',
                default: '"ltr"',
                description:
                  "Keeps shortcuts like ⇧⌘S in order inside right-to-left menus.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="context-menu-shortcut"',
                description: "The shortcut label.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection
          title="ContextMenuGroup and ContextMenuSeparator"
          level={3}
        >
          <DocsParagraph>
            <DocsCode>{"<ContextMenuGroup />"}</DocsCode> groups related items
            under a label. <DocsCode>{"<ContextMenuSeparator />"}</DocsCode>{" "}
            draws a divider. Both accept <DocsCode>render</DocsCode> and{" "}
            <DocsCode>className</DocsCode>, and carry{" "}
            <DocsCode>context-menu-group</DocsCode> and{" "}
            <DocsCode>context-menu-separator</DocsCode> as their{" "}
            <DocsCode>data-slot</DocsCode>.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
