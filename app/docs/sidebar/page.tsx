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
import { SidebarCollapsible } from "@/components/examples/sidebar/collapsible"
import { SidebarControlled } from "@/components/examples/sidebar/controlled"
import { SidebarDemo } from "@/components/examples/sidebar/demo"
import { SidebarHeaderLayout } from "@/components/examples/sidebar/header"
import { SidebarRight } from "@/components/examples/sidebar/right"
import { SidebarRtl } from "@/components/examples/sidebar/rtl"
import { SidebarSkeleton } from "@/components/examples/sidebar/skeleton"
import { SidebarSubmenus } from "@/components/examples/sidebar/submenus"
import { SidebarVariants } from "@/components/examples/sidebar/variants"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("sidebar")

const preview = "items-stretch p-0 sm:p-0"

const importCode = `import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"`

const usageCode = `export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarTrigger />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}`

const appSidebarCode = `export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<a href="/" />} isActive>
                  <IconHome />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}`

const compositionCode = `SidebarProvider
├── Sidebar
│   ├── SidebarHeader
│   ├── SidebarContent
│   │   └── SidebarGroup
│   │       ├── SidebarGroupLabel
│   │       ├── SidebarGroupAction
│   │       └── SidebarGroupContent
│   │           └── SidebarMenu
│   │               └── SidebarMenuItem
│   │                   ├── SidebarMenuButton
│   │                   ├── SidebarMenuAction
│   │                   ├── SidebarMenuBadge
│   │                   └── SidebarMenuSub
│   │                       └── SidebarMenuSubItem
│   │                           └── SidebarMenuSubButton
│   ├── SidebarFooter
│   └── SidebarRail
└── SidebarInset
    └── SidebarTrigger`

const hookCode = `const {
  state,
  open,
  setOpen,
  openMobile,
  setOpenMobile,
  isMobile,
  toggleSidebar,
} = useSidebar()`

const widthCode = `<SidebarProvider
  style={
    {
      "--sidebar-width": "20rem",
      "--sidebar-width-mobile": "20rem",
    } as React.CSSProperties
  }
>`

const persistCode = `"use client"

export function Providers({
  defaultOpen,
  children,
}: {
  defaultOpen: boolean
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      onOpenChange={(open) => {
        document.cookie = \`sidebar_state=\${open}; path=/; max-age=604800\`
      }}
    >
      {children}
    </SidebarProvider>
  )
}`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="sidebar">
      <DocsExample file="sidebar/demo" previewClassName={preview}>
        <SidebarDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={[
          "components/ui/sidebar.tsx",
          "components/ui/button.tsx",
          "components/ui/input.tsx",
          "components/ui/sheet.tsx",
          "components/ui/skeleton.tsx",
          "components/ui/tooltip.tsx",
          "hooks/use-composed-ref.ts",
          "lib/hotkey.ts",
        ]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsParagraph>
          Wrap your layout in <DocsCode>{"<SidebarProvider />"}</DocsCode> and
          put the page in <DocsCode>{"<SidebarInset />"}</DocsCode>, after the
          sidebar.
        </DocsParagraph>
        <DocsCodeBlock code={usageCode} />
        <DocsCodeBlock code={appSidebarCode} />
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
        <DocsList>
          <li>
            <DocsCode>SidebarProvider</DocsCode> holds the open state, the
            keyboard shortcut and the widths.
          </li>
          <li>
            <DocsCode>Sidebar</DocsCode> is a column that stays pinned while the
            page scrolls. Below 768px it becomes a sheet.
          </li>
          <li>
            <DocsCode>SidebarHeader</DocsCode> and{" "}
            <DocsCode>SidebarFooter</DocsCode> stay in place.{" "}
            <DocsCode>SidebarContent</DocsCode> scrolls between them.
          </li>
          <li>
            <DocsCode>SidebarGroup</DocsCode> is a section with an optional
            label and action. <DocsCode>SidebarMenu</DocsCode> holds the links.
          </li>
          <li>
            <DocsCode>SidebarInset</DocsCode> is the page next to the sidebar.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="sidebar/variants"
          title="Variants"
          previewClassName={preview}
          description={
            <>
              <DocsCode>variant</DocsCode> sets the look: a full-height{" "}
              <DocsCode>sidebar</DocsCode>, a <DocsCode>floating</DocsCode>{" "}
              panel, or <DocsCode>inset</DocsCode>, where the page becomes a
              card on the sidebar color. Switch between them to see the layout
              animate.
            </>
          }
        >
          <SidebarVariants />
        </DocsExample>
        <DocsExample
          file="sidebar/collapsible"
          title="Collapsible"
          previewClassName={preview}
          description={
            <>
              <DocsCode>offcanvas</DocsCode> slides the sidebar out of view,{" "}
              <DocsCode>icon</DocsCode> shrinks it to its icons and shows each
              label in a tooltip, and <DocsCode>none</DocsCode> keeps it open.
              Press <DocsCode>⌘B</DocsCode> or <DocsCode>Ctrl+B</DocsCode> to
              toggle the sidebar you are working in.
            </>
          }
        >
          <SidebarCollapsible />
        </DocsExample>
        <DocsExample
          file="sidebar/submenus"
          title="Collapsible groups and submenus"
          previewClassName={preview}
          description={
            <>
              Wrap a <DocsCode>SidebarGroup</DocsCode> or a{" "}
              <DocsCode>SidebarMenuItem</DocsCode> in a{" "}
              <DocsCode>Collapsible</DocsCode>, render the label or button as
              the trigger, and nest a <DocsCode>SidebarMenuSub</DocsCode>.
            </>
          }
        >
          <SidebarSubmenus />
        </DocsExample>
        <DocsExample
          file="sidebar/right"
          title="Right side"
          previewClassName={preview}
          description={
            <>
              Set <DocsCode>{'side="right"'}</DocsCode> and place the sidebar
              after <DocsCode>SidebarInset</DocsCode>. The rail and the mobile
              sheet follow the side.
            </>
          }
        >
          <SidebarRight />
        </DocsExample>
        <DocsExample
          file="sidebar/header"
          title="Under a header"
          previewClassName={preview}
          description={
            <>
              The sidebar is sticky, so it starts below anything above it. With
              a sticky header, set <DocsCode>--sidebar-top</DocsCode> to its
              height and the sidebar pins below it and fits the rest of the
              screen.
            </>
          }
        >
          <SidebarHeaderLayout />
        </DocsExample>
        <DocsExample
          file="sidebar/controlled"
          title="Controlled"
          previewClassName={preview}
          description={
            <>
              Pass <DocsCode>open</DocsCode> and{" "}
              <DocsCode>onOpenChange</DocsCode>. The trigger, the rail and the
              shortcut all go through <DocsCode>onOpenChange</DocsCode>.
            </>
          }
        >
          <SidebarControlled />
        </DocsExample>
        <DocsExample
          file="sidebar/skeleton"
          title="Loading"
          previewClassName={preview}
          description={
            <>
              <DocsCode>SidebarMenuSkeleton</DocsCode> fills a menu while it
              loads. Widths vary per row and match between server and client.
            </>
          }
        >
          <SidebarSkeleton />
        </DocsExample>
        <DocsExample
          file="sidebar/rtl"
          title="Right to left"
          previewClassName={preview}
          description={
            <>
              Set <DocsCode>{'dir="rtl"'}</DocsCode> and{" "}
              <DocsCode>{'side="right"'}</DocsCode>. Spacing, submenu lines,
              tooltips and the trigger icon mirror.
            </>
          }
        >
          <SidebarRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Width">
        <DocsParagraph>
          The sidebar is 16rem wide, 18rem on phones and 3rem when collapsed to
          icons. Override <DocsCode>--sidebar-width</DocsCode>,{" "}
          <DocsCode>--sidebar-width-mobile</DocsCode> and{" "}
          <DocsCode>--sidebar-width-icon</DocsCode> on the provider.
        </DocsParagraph>
        <DocsCodeBlock code={widthCode} />
      </DocsSection>

      <DocsSection title="Persisting the state">
        <DocsParagraph>
          The sidebar has no side effects. To remember whether it was open, save
          it in <DocsCode>onOpenChange</DocsCode> and read it back into{" "}
          <DocsCode>defaultOpen</DocsCode> when rendering on the server.
        </DocsParagraph>
        <DocsCodeBlock code={persistCode} />
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["⌘ + B", "Ctrl + B"],
              description:
                "Toggles the sidebar. With several sidebars on a page, the one holding focus responds, otherwise the first. Ignored while typing in a rich text editor.",
            },
            {
              keys: ["Tab", "Shift + Tab"],
              description:
                "Moves through the links. A collapsed off-canvas sidebar is skipped.",
            },
            {
              keys: ["Enter", "Space"],
              description: "Activates the focused link, button or trigger.",
            },
            {
              keys: ["Esc"],
              description: "Closes the sidebar on phones.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            <DocsCode>SidebarTrigger</DocsCode> is labelled “Toggle Sidebar” and
            exposes <DocsCode>aria-expanded</DocsCode> and{" "}
            <DocsCode>aria-controls</DocsCode>.
          </li>
          <li>
            <DocsCode>isActive</DocsCode> sets{" "}
            <DocsCode>{'aria-current="page"'}</DocsCode>.
          </li>
          <li>
            Collapsing off canvas hides the content from keyboard and screen
            readers. If focus was inside, it moves to the trigger.
          </li>
          <li>
            Collapsed to icons, labels stay in each link&apos;s accessible name
            and show as a tooltip on hover and keyboard focus. Group labels,
            actions and badges are hidden.
          </li>
          <li>
            On phones the sidebar is a modal sheet: focus is trapped, swiping or
            Esc closes it, and following a link closes it. Links that open a new
            tab, downloads and modified clicks keep it open.
          </li>
          <li>With reduced motion enabled, collapsing is instant.</li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="SidebarProvider" level={3}>
          <DocsPropsTable
            props={[
              { name: "defaultOpen", type: "boolean", default: "true" },
              { name: "open", type: "boolean" },
              { name: "onOpenChange", type: "(open: boolean) => void" },
              {
                name: "keyboardShortcut",
                type: "string | null",
                default: '"mod+b"',
                description:
                  "mod is ⌘ on Apple platforms and Ctrl elsewhere. null turns it off.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sidebar-wrapper"',
                description: "The layout wrapper.",
              },
              {
                name: "--sidebar-width",
                description: "Expanded width. Defaults to 16rem.",
              },
              {
                name: "--sidebar-width-mobile",
                description: "Width of the phone sheet. Defaults to 18rem.",
              },
              {
                name: "--sidebar-width-icon",
                description: "Width collapsed to icons. Defaults to 3rem.",
              },
              {
                name: "--sidebar-top",
                description:
                  "Where the sidebar pins while scrolling, such as below a sticky header. Defaults to 0px.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="Sidebar" level={3}>
          <DocsParagraph>
            <DocsCode>className</DocsCode> and other props go to the sidebar
            container.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "side",
                type: '"left" | "right"',
                default: '"left"',
              },
              {
                name: "variant",
                type: '"sidebar" | "floating" | "inset" | "plain"',
                default: '"sidebar"',
                description:
                  "plain drops the surface, the edge line, the scrollbar and the gap between menu items, for a sidebar that sits on the page.",
              },
              {
                name: "collapsible",
                type: '"offcanvas" | "icon" | "none"',
                default: '"offcanvas"',
              },
              {
                name: "dir",
                type: '"ltr" | "rtl"',
                description: "Also sets the direction of the phone sheet.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sidebar"',
                description: "The sidebar, or the sheet on phones.",
              },
              {
                name: "data-state",
                description: '"expanded" or "collapsed".',
              },
              {
                name: "data-collapsible",
                description:
                  'The collapsible mode while collapsed, otherwise "". Style children with group-data-[collapsible=icon]:.',
              },
              { name: "data-variant", description: "The variant." },
              { name: "data-side", description: "The side." },
              {
                name: "data-mobile",
                description: "Present on the phone sheet.",
              },
              {
                name: 'data-slot="sidebar-container"',
                description: "The panel that slides and resizes.",
              },
              {
                name: 'data-slot="sidebar-inner"',
                description: "The surface that holds the content.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SidebarTrigger" level={3}>
          <DocsParagraph>
            A ghost icon <DocsCode>Button</DocsCode> that calls{" "}
            <DocsCode>toggleSidebar</DocsCode>. Call{" "}
            <DocsCode>event.preventDefault()</DocsCode> in{" "}
            <DocsCode>onClick</DocsCode> to stop it. Pass children to replace
            the icon.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sidebar-trigger"',
                description: "The trigger.",
              },
              {
                name: "aria-expanded",
                description: "Whether the sidebar is open.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SidebarRail" level={3}>
          <DocsParagraph>
            A thin hit area on the sidebar edge that toggles it on click. It is
            left out of the tab order because the trigger and shortcut cover
            keyboard users. When the sidebar is off canvas, the rail stays at
            the screen edge.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sidebar-rail"',
                description: "The rail.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SidebarInset" level={3}>
          <DocsParagraph>
            A <DocsCode>{"<main>"}</DocsCode> that takes the rest of the width.
            Next to an <DocsCode>inset</DocsCode> sidebar it becomes a rounded
            card.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "render",
                type: "React.ReactElement | (props) => React.ReactElement",
                description:
                  "Renders a different element. Pass a <div /> when the page already has a <main> landmark.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sidebar-inset"',
                description: "The page area.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection
          title="SidebarHeader, SidebarContent, SidebarFooter"
          level={3}
        >
          <DocsParagraph>
            Plain <DocsCode>{"<div>"}</DocsCode> elements. The content scrolls
            with a thin scrollbar and soft edge fades.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sidebar-header"',
                description: "Top section.",
              },
              {
                name: 'data-slot="sidebar-content"',
                description: "Scrollable middle.",
              },
              {
                name: 'data-slot="sidebar-footer"',
                description: "Bottom section.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SidebarGroup, SidebarGroupContent" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sidebar-group"',
                description: "A section of the sidebar.",
              },
              {
                name: 'data-slot="sidebar-group-content"',
                description: "The group's content.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SidebarGroupLabel" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<div>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sidebar-group-label"',
                description: "Slides up and fades when collapsed to icons.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SidebarGroupAction" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<button>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sidebar-group-action"',
                description: "Needs an accessible label.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SidebarMenu, SidebarMenuItem" level={3}>
          <DocsParagraph>
            A <DocsCode>{"<ul>"}</DocsCode> and its{" "}
            <DocsCode>{"<li>"}</DocsCode> items.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sidebar-menu"',
                description: "The list.",
              },
              {
                name: 'data-slot="sidebar-menu-item"',
                description: "An item. group/menu-item for hover styles.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SidebarMenuButton" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "isActive",
                type: "boolean",
                default: "false",
                description: 'Highlights it and sets aria-current="page".',
              },
              {
                name: "variant",
                type: '"default" | "outline"',
                default: '"default"',
              },
              {
                name: "size",
                type: '"default" | "sm" | "lg"',
                default: '"default"',
              },
              {
                name: "tooltip",
                type: "ReactNode | TooltipContentProps",
                description:
                  "Shown while collapsed to icons. Content slides between items as you move along the menu.",
              },
              { name: "render", type: renderType, default: "<button>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sidebar-menu-button"',
                description: "peer/menu-button for sibling styles.",
              },
              {
                name: "data-active",
                description: "Present while isActive.",
              },
              { name: "data-size", description: "The size." },
            ]}
          />
        </DocsSection>
        <DocsSection title="SidebarMenuAction" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "showOnHover",
                type: "boolean",
                default: "false",
                description:
                  "Shows it only while the item is hovered or focused, or its menu is open. Always visible on touch screens.",
              },
              { name: "render", type: renderType, default: "<button>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sidebar-menu-action"',
                description: "Needs an accessible label.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SidebarMenuBadge" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sidebar-menu-badge"',
                description: "A count at the end of the item.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SidebarMenuSkeleton" level={3}>
          <DocsPropsTable
            props={[{ name: "showIcon", type: "boolean", default: "false" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sidebar-menu-skeleton"',
                description: "Hidden from assistive tech.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection
          title="SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton"
          level={3}
        >
          <DocsParagraph>
            A nested list with a line on its leading edge. It folds away when
            the sidebar collapses to icons.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "isActive",
                type: "boolean",
                default: "false",
                description: "On SidebarMenuSubButton.",
              },
              {
                name: "size",
                type: '"sm" | "md"',
                default: '"md"',
                description: "On SidebarMenuSubButton.",
              },
              {
                name: "render",
                type: renderType,
                default: "<a>",
                description: "On SidebarMenuSubButton.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sidebar-menu-sub"',
                description: "The nested list.",
              },
              {
                name: 'data-slot="sidebar-menu-sub-button"',
                description: "A nested link.",
              },
              { name: "data-active", description: "Present while isActive." },
            ]}
          />
        </DocsSection>
        <DocsSection title="SidebarInput, SidebarSeparator" level={3}>
          <DocsParagraph>
            A small <DocsCode>Input</DocsCode> on the page background, and a
            hairline separator.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="sidebar-input"',
                description: "The input.",
              },
              {
                name: 'data-slot="sidebar-separator"',
                description: "The separator.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="useSidebar" level={3}>
          <DocsParagraph>
            Reads and controls the nearest sidebar. Throws outside{" "}
            <DocsCode>SidebarProvider</DocsCode>.
          </DocsParagraph>
          <DocsCodeBlock code={hookCode} />
          <DocsPropsTable
            props={[
              { name: "state", type: '"expanded" | "collapsed"' },
              { name: "open", type: "boolean" },
              { name: "setOpen", type: "(open: boolean) => void" },
              { name: "openMobile", type: "boolean" },
              { name: "setOpenMobile", type: "(open: boolean) => void" },
              { name: "isMobile", type: "boolean" },
              {
                name: "toggleSidebar",
                type: "() => void",
                description: "Toggles the sheet on phones, else the sidebar.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
