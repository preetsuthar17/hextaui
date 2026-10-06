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
import { DropdownMenuCheckboxes } from "@/components/examples/dropdown-menu/checkboxes"
import { DropdownMenuControlled } from "@/components/examples/dropdown-menu/controlled"
import { DropdownMenuDemo } from "@/components/examples/dropdown-menu/demo"
import { DropdownMenuDisabled } from "@/components/examples/dropdown-menu/disabled"
import { DropdownMenuHover } from "@/components/examples/dropdown-menu/hover"
import { DropdownMenuIndicatorEnd } from "@/components/examples/dropdown-menu/indicator-end"
import { DropdownMenuInSheet } from "@/components/examples/dropdown-menu/in-sheet"
import { DropdownMenuLongContent } from "@/components/examples/dropdown-menu/long-content"
import { DropdownMenuRadioGroupDemo } from "@/components/examples/dropdown-menu/radio-group"
import { DropdownMenuRowActions } from "@/components/examples/dropdown-menu/row-actions"
import { DropdownMenuRtl } from "@/components/examples/dropdown-menu/rtl"
import { DropdownMenuScrolling } from "@/components/examples/dropdown-menu/scrolling"
import { DropdownMenuSelect } from "@/components/examples/dropdown-menu/select"
import { DropdownMenuSafeArea } from "@/components/examples/dropdown-menu/safe-area"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("dropdown-menu")

const importCode = `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"`

const usageCode = `<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" />}>
    Open
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`

const renderType = "ReactElement | (props, state) => ReactElement"

const positionProps = [
  {
    name: "side",
    type: '"top" | "bottom" | "left" | "right" | "inline-start" | "inline-end"',
    default: '"bottom"',
  },
  {
    name: "align",
    type: '"start" | "center" | "end"',
    default: '"start"',
  },
  { name: "sideOffset", type: "number", default: "4" },
  { name: "alignOffset", type: "number", default: "0" },
  {
    name: "collisionPadding",
    type: "number | Rect",
    default: "8",
    description: "Space kept between the menu and the edge of the viewport.",
  },
  {
    name: "anchor",
    type: "Element | RefObject | VirtualElement",
    description: "Position against another element instead of the trigger.",
  },
  { name: "sticky", type: "boolean", default: "false" },
]

const popupAttributes = [
  { name: "data-open", description: "Present while the menu is open." },
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
    description: "The side the menu settled on after collision handling.",
  },
  { name: "data-align", description: "The alignment it settled on." },
  {
    name: "data-chosen",
    description:
      "Present after an item is clicked, so the menu waits for the item’s confirmation blink before closing.",
  },
  {
    name: "--anchor-width",
    description: "The trigger’s width. The menu is at least this wide.",
  },
  {
    name: "--available-height",
    description: "Room left in the viewport. Long menus scroll within it.",
  },
  {
    name: "--transform-origin",
    description: "Where the scale animation grows from, next to the trigger.",
  },
]

const itemAttributes = [
  {
    name: "data-highlighted",
    description:
      "Present while the item is highlighted by pointer or keyboard.",
  },
  { name: "data-disabled", description: "Present when the item is disabled." },
  {
    name: "data-chosen",
    description: "Present on the item that was just clicked, while it blinks.",
  },
  { name: "data-inset", description: "Present when inset is set." },
]

const compositionCode = `DropdownMenu
├── DropdownMenuTrigger
└── DropdownMenuContent
    ├── DropdownMenuGroup
    │   ├── DropdownMenuLabel
    │   └── DropdownMenuItem
    │       └── DropdownMenuShortcut
    ├── DropdownMenuCheckboxItem
    ├── DropdownMenuRadioGroup
    │   └── DropdownMenuRadioItem
    ├── DropdownMenuSeparator
    └── DropdownMenuSub
        ├── DropdownMenuSubTrigger
        └── DropdownMenuSubContent`

export default function Page() {
  return (
    <DocsComponentPage slug="dropdown-menu">
      <DocsExample file="dropdown-menu/demo">
        <DropdownMenuDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={["components/ui/dropdown-menu.tsx"]}
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
          file="dropdown-menu/safe-area"
          title="Safe area"
          description={
            <>
              Moving diagonally from a submenu trigger toward its submenu
              crosses sibling triggers. The safe area keeps the submenu open
              while the pointer heads into it. Turn on{" "}
              <DocsCode>showSafeArea</DocsCode> to see it live: the dot turns
              green inside the area and red where the submenu would switch.
            </>
          }
        >
          <DropdownMenuSafeArea />
        </DocsExample>
        <DocsExample
          file="dropdown-menu/checkboxes"
          title="Checkboxes"
          description={
            <>
              <DocsCode>{"<DropdownMenuCheckboxItem />"}</DocsCode> toggles a
              setting and keeps the menu open, so several can be changed in a
              row. The check draws in and out instead of popping.
            </>
          }
        >
          <DropdownMenuCheckboxes />
        </DocsExample>
        <DocsExample
          file="dropdown-menu/radio-group"
          title="Radio group"
          description={
            <>
              Wrap <DocsCode>{"<DropdownMenuRadioItem />"}</DocsCode> in a{" "}
              <DocsCode>{"<DropdownMenuRadioGroup />"}</DocsCode> to pick one
              option. A label inside the group names it for screen readers.
            </>
          }
        >
          <DropdownMenuRadioGroupDemo />
        </DocsExample>
        <DocsExample
          file="dropdown-menu/indicator-end"
          title="Check on the right"
          description={
            <>
              Set <DocsCode>{'indicator="end"'}</DocsCode> on checkbox and radio
              items to show the check after the label instead of indenting it,
              which suits pickers with a description under each option.
            </>
          }
        >
          <DropdownMenuIndicatorEnd />
        </DocsExample>
        <DocsExample
          file="dropdown-menu/select"
          title="Select-like"
          description={
            <>
              The menu is never narrower than its trigger. Set{" "}
              <DocsCode>closeOnClick</DocsCode> on radio items when picking one
              should also close the menu.
            </>
          }
        >
          <DropdownMenuSelect />
        </DocsExample>
        <DocsExample
          file="dropdown-menu/row-actions"
          title="Row actions"
          description={
            <>
              One menu serves every row. Create a handle with{" "}
              <DocsCode>createDropdownMenuHandle</DocsCode>, pass it to each
              trigger with a <DocsCode>payload</DocsCode>, and read the payload
              in the menu. Delete hands off to an alert dialog.
            </>
          }
        >
          <DropdownMenuRowActions />
        </DocsExample>
        <DocsExample
          file="dropdown-menu/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>open</DocsCode> and{" "}
              <DocsCode>onOpenChange</DocsCode>. The second argument says why
              the menu changed, such as a trigger press, an item press or
              Escape. Items with <DocsCode>{"closeOnClick={false}"}</DocsCode>{" "}
              keep it open.
            </>
          }
        >
          <DropdownMenuControlled />
        </DocsExample>
        <DocsExample
          file="dropdown-menu/hover"
          title="Open on hover"
          description={
            <>
              <DocsCode>openOnHover</DocsCode> on the trigger opens the menu
              after <DocsCode>delay</DocsCode> and closes it after{" "}
              <DocsCode>closeDelay</DocsCode>. Clicking and the keyboard still
              work, so touch and keyboard users aren’t locked out.
            </>
          }
        >
          <DropdownMenuHover />
        </DocsExample>
        <DocsExample
          file="dropdown-menu/disabled"
          title="Disabled"
          description={
            <>
              A disabled trigger never opens. Disabled items stay visible and
              are skipped by the arrow keys.
            </>
          }
        >
          <DropdownMenuDisabled />
        </DocsExample>
        <DocsExample
          file="dropdown-menu/long-content"
          title="Long content"
          description="Labels wrap instead of stretching the menu past 20rem, unbroken strings break anywhere, and shortcuts stay on the first line."
        >
          <DropdownMenuLongContent />
        </DocsExample>
        <DocsExample
          file="dropdown-menu/scrolling"
          title="Scrolling"
          description="When there isn’t room for every item, the menu scrolls inside the viewport and the highlighted item scrolls into view."
        >
          <DropdownMenuScrolling />
        </DocsExample>
        <DocsExample
          file="dropdown-menu/in-sheet"
          title="Inside a sheet"
          description="The menu layers above the sheet. Escape closes the menu first, then the sheet."
        >
          <DropdownMenuInSheet />
        </DocsExample>
        <DocsExample
          file="dropdown-menu/rtl"
          title="Right to left"
          description="The menu, submenu chevron and submenu side follow the trigger’s direction. Shortcuts keep their left-to-right order."
        >
          <DropdownMenuRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Enter", "Space", "↓"],
              description:
                "On the trigger, opens the menu and highlights the first item.",
            },
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
                "Closes the current menu and returns focus to its trigger. In a submenu, only that submenu closes.",
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
            The trigger is announced as a menu button, and focus returns to it
            when the menu closes.
          </li>
          <li>
            Give icon-only triggers an <DocsCode>aria-label</DocsCode>, like the
            row actions example does.
          </li>
          <li>
            <DocsCode>{"<DropdownMenuShortcut />"}</DocsCode> is a visual label
            only. Bind the keys yourself.
          </li>
          <li>
            With reduced motion on, the menu fades without scaling and the item
            blink is skipped.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI menu. Every part accepts the props of the
          primitive it wraps.
        </DocsParagraph>
        <DocsSection title="DropdownMenu" level={3}>
          <DocsPropsTable
            props={[
              { name: "open", type: "boolean" },
              { name: "defaultOpen", type: "boolean", default: "false" },
              {
                name: "showSafeArea",
                type: "boolean",
                default: "false",
                description:
                  "Draws the submenu safe area while the menu is open. For debugging and demos.",
              },
              {
                name: "onOpenChange",
                type: "(open: boolean, details) => void",
                description: "details.reason says what caused the change.",
              },
              {
                name: "modal",
                type: "boolean",
                default: "true",
                description:
                  "Locks page scroll and blocks outside clicks while open.",
              },
              {
                name: "loopFocus",
                type: "boolean",
                default: "true",
                description: "Wrap the arrow keys at either end.",
              },
              {
                name: "handle",
                type: "DropdownMenuHandle<Payload>",
                description: "Connects detached triggers to this menu.",
              },
              {
                name: "children",
                type: "ReactNode | ({ payload }) => ReactNode",
                description:
                  "Use the function form to read the opening trigger’s payload.",
              },
              { name: "disabled", type: "boolean", default: "false" },
            ]}
          />
        </DocsSection>
        <DocsSection title="DropdownMenuTrigger" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "openOnHover",
                type: "boolean",
                default: "false",
              },
              {
                name: "delay",
                type: "number",
                default: "100",
                description: "Milliseconds before a hover opens the menu.",
              },
              {
                name: "closeDelay",
                type: "number",
                default: "0",
                description: "Milliseconds before a hover-opened menu closes.",
              },
              {
                name: "handle",
                type: "DropdownMenuHandle<Payload>",
              },
              {
                name: "payload",
                type: "Payload",
                description: "Passed to the menu when this trigger opens it.",
              },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "render", type: renderType, default: "<button>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="dropdown-menu-trigger"',
                description: "Target the trigger in CSS.",
              },
              {
                name: "data-popup-open",
                description: "Present while its menu is open.",
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
        <DocsSection title="DropdownMenuContent" level={3}>
          <DocsPropsTable
            props={[
              ...positionProps,
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="dropdown-menu-content"',
                description: "Target the menu in CSS.",
              },
              ...popupAttributes,
            ]}
          />
        </DocsSection>
        <DocsSection title="DropdownMenuItem" level={3}>
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
                description: "Indents the item to line up with checkbox items.",
              },
              { name: "closeOnClick", type: "boolean", default: "true" },
              { name: "onClick", type: "(event) => void" },
              {
                name: "label",
                type: "string",
                description:
                  "Text used for type-ahead when children aren’t plain text.",
              },
              { name: "disabled", type: "boolean", default: "false" },
              {
                name: "render",
                type: renderType,
                default: "<div>",
                description: 'Render a link with render={<a href="…" />}.',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="dropdown-menu-item"',
                description: "Target items in CSS.",
              },
              { name: "data-variant", description: "The current variant." },
              ...itemAttributes,
            ]}
          />
        </DocsSection>
        <DocsSection title="DropdownMenuCheckboxItem" level={3}>
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
              {
                name: "indicator",
                type: '"start" | "end"',
                default: '"start"',
              },
              { name: "disabled", type: "boolean", default: "false" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="dropdown-menu-checkbox-item"',
                description: "Target checkbox items in CSS.",
              },
              { name: "data-checked", description: "Present when checked." },
              {
                name: "data-unchecked",
                description: "Present when not checked.",
              },
              ...itemAttributes,
            ]}
          />
        </DocsSection>
        <DocsSection title="DropdownMenuRadioGroup" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "Value" },
              { name: "defaultValue", type: "Value" },
              {
                name: "onValueChange",
                type: "(value: Value, details) => void",
              },
              { name: "disabled", type: "boolean", default: "false" },
            ]}
          />
        </DocsSection>
        <DocsSection title="DropdownMenuRadioItem" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "Value" },
              { name: "closeOnClick", type: "boolean", default: "false" },
              { name: "inset", type: "boolean", default: "false" },
              {
                name: "indicator",
                type: '"start" | "end"',
                default: '"start"',
              },
              { name: "disabled", type: "boolean", default: "false" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="dropdown-menu-radio-item"',
                description: "Target radio items in CSS.",
              },
              {
                name: "data-checked",
                description: "Present on the selected item.",
              },
              {
                name: "data-unchecked",
                description: "Present on the other items.",
              },
              ...itemAttributes,
            ]}
          />
        </DocsSection>
        <DocsSection title="DropdownMenuGroup" level={3}>
          <DocsParagraph>
            Groups related items. A{" "}
            <DocsCode>{"<DropdownMenuLabel />"}</DocsCode> inside it becomes the
            group’s accessible name.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="DropdownMenuLabel" level={3}>
          <DocsPropsTable
            props={[
              { name: "inset", type: "boolean", default: "false" },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
        </DocsSection>
        <DocsSection title="DropdownMenuSeparator" level={3}>
          <DocsParagraph>
            A divider between groups, announced as a separator.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="DropdownMenuShortcut" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "dir",
                type: '"ltr" | "rtl"',
                default: '"ltr"',
                description:
                  "Shortcuts keep their key order in right-to-left menus.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DropdownMenuSub" level={3}>
          <DocsPropsTable
            props={[
              { name: "open", type: "boolean" },
              { name: "defaultOpen", type: "boolean", default: "false" },
              {
                name: "onOpenChange",
                type: "(open: boolean, details) => void",
              },
              {
                name: "closeParentOnEsc",
                type: "boolean",
                default: "false",
                description:
                  "Close the whole menu, not just this submenu, on Escape.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DropdownMenuSubTrigger" level={3}>
          <DocsPropsTable
            props={[
              { name: "inset", type: "boolean", default: "false" },
              { name: "disabled", type: "boolean", default: "false" },
              {
                name: "delay",
                type: "number",
                default: "100",
                description: "Milliseconds before hovering opens the submenu.",
              },
              { name: "closeDelay", type: "number", default: "0" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="dropdown-menu-sub-trigger"',
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
            ]}
          />
        </DocsSection>
        <DocsSection title="DropdownMenuSubContent" level={3}>
          <DocsPropsTable
            props={[
              { name: "sideOffset", type: "number", default: "0" },
              { name: "alignOffset", type: "number", default: "-4" },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="dropdown-menu-sub-content"',
                description: "Target submenus in CSS.",
              },
              ...popupAttributes.filter(
                (attribute) => attribute.name !== "--anchor-width"
              ),
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
