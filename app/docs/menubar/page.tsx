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
import { MenubarDemo } from "@/components/examples/menubar/demo"
import { MenubarDisabled } from "@/components/examples/menubar/disabled"
import { MenubarIcons } from "@/components/examples/menubar/icons"
import { MenubarRtl } from "@/components/examples/menubar/rtl"
import { MenubarTriggerIcons } from "@/components/examples/menubar/trigger-icons"
import { MenubarVertical } from "@/components/examples/menubar/vertical"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("menubar")

const importCode = `import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"`

const usageCode = `<Menubar aria-label="Editor">
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        New tab <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `Menubar
└── MenubarMenu
    ├── MenubarTrigger
    └── MenubarContent
        ├── MenubarGroup
        │   ├── MenubarLabel
        │   └── MenubarItem
        │       └── MenubarShortcut
        ├── MenubarCheckboxItem
        ├── MenubarRadioGroup
        │   └── MenubarRadioItem
        ├── MenubarSeparator
        └── MenubarSub
            ├── MenubarSubTrigger
            └── MenubarSubContent`

export default function Page() {
  return (
    <DocsComponentPage slug="menubar">
      <DocsExample file="menubar/demo">
        <MenubarDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={[
          "components/ui/menubar.tsx",
          "components/ui/dropdown-menu.tsx",
          "lib/motion.ts",
        ]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Each <DocsCode>{"<MenubarMenu />"}</DocsCode> is a Dropdown menu, so
          items, checkbox and radio items, submenus, labels and shortcuts work
          and look exactly the same. Open a menu, then move the pointer or press
          the arrow keys to sweep across the bar.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="menubar/trigger-icons"
          title="Trigger icons"
          description={
            <>
              Put an icon before a trigger&apos;s label, or use an icon on its
              own with an <DocsCode>aria-label</DocsCode>. Icon-only triggers
              get a square shape.
            </>
          }
        >
          <MenubarTriggerIcons />
        </DocsExample>
        <DocsExample
          file="menubar/icons"
          title="Icons"
          description={
            <>
              Put an icon before the label. Use{" "}
              <DocsCode>{'variant="destructive"'}</DocsCode> on items that
              delete or can&apos;t be undone.
            </>
          }
        >
          <MenubarIcons />
        </DocsExample>
        <DocsExample
          file="menubar/disabled"
          title="Disabled"
          description={
            <>
              Disable a single menu with <DocsCode>disabled</DocsCode> on{" "}
              <DocsCode>{"<MenubarMenu />"}</DocsCode>, or the whole bar on{" "}
              <DocsCode>{"<Menubar />"}</DocsCode>. Arrow keys skip disabled
              menus.
            </>
          }
        >
          <MenubarDisabled />
        </DocsExample>
        <DocsExample
          file="menubar/vertical"
          title="Vertical"
          description={
            <>
              <DocsCode>{'orientation="vertical"'}</DocsCode> stacks the menus
              and switches navigation to the up and down arrows. Open the menus
              to the side with <DocsCode>{'side="inline-end"'}</DocsCode>.
            </>
          }
        >
          <MenubarVertical />
        </DocsExample>
        <DocsExample
          file="menubar/rtl"
          title="Right to left"
          description="Menus, submenus and arrow keys follow the reading direction. Shortcuts stay in keyboard order."
        >
          <MenubarRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description: "Moves focus into the menubar, then out of it.",
            },
            {
              keys: ["←", "→"],
              description:
                "Moves between menus. With a menu open, opens the next one instead.",
            },
            {
              keys: ["Enter", "Space", "↓"],
              description: "Opens the focused menu.",
            },
            {
              keys: ["↑", "↓"],
              description: "Moves between items in an open menu.",
            },
            {
              keys: ["→"],
              description: "Opens a submenu from its trigger.",
            },
            {
              keys: ["Esc"],
              description:
                "Closes the open menu and returns focus to its trigger.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Give the menubar a name with <DocsCode>aria-label</DocsCode>. It
            renders <DocsCode>{'role="menubar"'}</DocsCode> and each trigger is
            a menu item, so screen readers announce it as an application menu.
          </li>
          <li>
            The bar is a single tab stop. Arrow keys move between menus, so the
            page&apos;s tab order stays short.
          </li>
          <li>
            The sliding highlight is decoration. With reduced motion it just
            appears on the open menu.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Menu parts accept the same props as their Dropdown menu counterparts.
        </DocsParagraph>
        <DocsSection title="Menubar" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "orientation",
                type: '"horizontal" | "vertical"',
                default: '"horizontal"',
              },
              {
                name: "loopFocus",
                type: "boolean",
                default: "true",
                description: "Wrap from the last menu back to the first.",
              },
              {
                name: "modal",
                type: "boolean",
                default: "true",
                description:
                  "Block page scrolling and outside clicks while a menu is open.",
              },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="menubar"',
                description: "Target the bar in CSS.",
              },
              { name: "data-orientation", description: "The orientation." },
              {
                name: "data-has-submenu-open",
                description: "Present while any menu in the bar is open.",
              },
              {
                name: 'data-slot="menubar-highlight"',
                description:
                  "The sliding background behind the open trigger, with data-visible.",
              },
              {
                name: "--menubar-radius",
                description:
                  "Corner radius of the bar. Triggers and the highlight derive theirs from it.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="MenubarMenu" level={3}>
          <DocsPropsTable
            props={[
              { name: "open", type: "boolean" },
              { name: "defaultOpen", type: "boolean", default: "false" },
              {
                name: "onOpenChange",
                type: "(open: boolean, details) => void",
              },
              { name: "disabled", type: "boolean", default: "false" },
            ]}
          />
        </DocsSection>
        <DocsSection title="MenubarTrigger" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="menubar-trigger"',
                description: "Target triggers in CSS.",
              },
              {
                name: "data-popup-open",
                description: "Present while its menu is open.",
              },
              { name: "data-disabled", description: "Present when disabled." },
            ]}
          />
        </DocsSection>
        <DocsSection title="MenubarContent" level={3}>
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
                default: '"start"',
              },
              { name: "sideOffset", type: "number", default: "8" },
              {
                name: "alignOffset",
                type: "number",
                default: "-4",
                description:
                  "Lines the menu's items up with the trigger's label.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="menubar-content"',
                description: "Target menus in CSS.",
              },
              {
                name: 'data-instant="group"',
                description:
                  "Present when the menu opened by sweeping from another one. It switches without animating.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="Items" level={3}>
          <DocsParagraph>
            <DocsCode>MenubarItem</DocsCode>,{" "}
            <DocsCode>MenubarCheckboxItem</DocsCode>,{" "}
            <DocsCode>MenubarRadioGroup</DocsCode>,{" "}
            <DocsCode>MenubarRadioItem</DocsCode>,{" "}
            <DocsCode>MenubarGroup</DocsCode>, <DocsCode>MenubarLabel</DocsCode>
            , <DocsCode>MenubarSeparator</DocsCode>,{" "}
            <DocsCode>MenubarShortcut</DocsCode>,{" "}
            <DocsCode>MenubarSub</DocsCode>,{" "}
            <DocsCode>MenubarSubTrigger</DocsCode> and{" "}
            <DocsCode>MenubarSubContent</DocsCode> are the Dropdown menu parts
            with <DocsCode>menubar-*</DocsCode> slots. See the Dropdown menu API
            for their props.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
