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
import { NavigationMenuActive } from "@/components/examples/navigation-menu/active"
import { NavigationMenuDemo } from "@/components/examples/navigation-menu/demo"
import { NavigationMenuDropdown } from "@/components/examples/navigation-menu/dropdown"
import { NavigationMenuRtl } from "@/components/examples/navigation-menu/rtl"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("navigation-menu")

const importCode = `import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"`

const usageCode = `<NavigationMenu variant="panel" aria-label="Main">
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/components">Components</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="/pricing">Pricing</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `NavigationMenu
└── NavigationMenuList
    ├── NavigationMenuItem
    │   ├── NavigationMenuTrigger
    │   └── NavigationMenuContent
    │       └── NavigationMenuLink
    └── NavigationMenuItem
        └── NavigationMenuLink`

export default function Page() {
  return (
    <DocsComponentPage slug="navigation-menu">
      <DocsExample file="navigation-menu/demo">
        <NavigationMenuDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={["components/ui/navigation-menu.tsx", "lib/motion.ts"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          With <DocsCode>{'variant="panel"'}</DocsCode>, one card spans the
          whole bar. Moving between triggers keeps it open and in place: only
          the content slides toward the direction you moved, and the height
          eases to fit. Nothing closes, reopens or jumps.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="navigation-menu/dropdown"
          title="Dropdown"
          description={
            <>
              The default <DocsCode>dropdown</DocsCode> variant opens a card
              under each trigger. Moving to the next trigger glides the same
              card over and resizes it to the new content.
            </>
          }
        >
          <NavigationMenuDropdown />
        </DocsExample>
        <DocsExample
          file="navigation-menu/active"
          title="Current page"
          description={
            <>
              Links in the bar look like triggers. Mark the current page with{" "}
              <DocsCode>active</DocsCode>, which also sets{" "}
              <DocsCode>{'aria-current="page"'}</DocsCode>.
            </>
          }
        >
          <NavigationMenuActive />
        </DocsExample>
        <DocsExample
          file="navigation-menu/rtl"
          title="Right to left"
          description="Content slides follow the direction you move, which flips in right-to-left layouts."
        >
          <NavigationMenuRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Moves through the bar, and from an open trigger into its content.",
            },
            {
              keys: ["Enter", "Space"],
              description: "Opens or closes the focused trigger's menu.",
            },
            {
              keys: ["↑", "↓"],
              description: "Moves between links in the open content.",
            },
            {
              keys: ["←", "→"],
              description: "Moves between triggers in the bar.",
            },
            {
              keys: ["Esc"],
              description: "Closes the menu and returns focus to its trigger.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The root renders a <DocsCode>{"<nav>"}</DocsCode>. Give it an{" "}
            <DocsCode>aria-label</DocsCode> when the page has more than one.
          </li>
          <li>
            Triggers are buttons that report whether their menu is open, and
            focus returns to them when the menu closes.
          </li>
          <li>
            The content slide and the sliding highlight turn into fades when
            reduced motion is on.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="NavigationMenu" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"dropdown" | "panel"',
                default: '"dropdown"',
                description:
                  "dropdown opens under each trigger. panel opens one full-width card under the bar that stays put while content slides.",
              },
              {
                name: "showSafeArea",
                type: "boolean",
                default: "false",
                description:
                  "Draws the safe area that keeps a menu open while the pointer heads into it. For debugging and demos.",
              },
              {
                name: "align",
                type: '"start" | "center" | "end"',
                default: '"start", or "center" for panel',
              },
              { name: "sideOffset", type: "number", default: "8" },
              { name: "value", type: "any" },
              { name: "defaultValue", type: "any" },
              {
                name: "onValueChange",
                type: "(value, details) => void",
              },
              {
                name: "delay",
                type: "number",
                default: "50",
                description: "Wait before opening on hover, in ms.",
              },
              {
                name: "closeDelay",
                type: "number",
                default: "50",
                description:
                  "Wait before closing after the pointer leaves, in ms.",
              },
              {
                name: "orientation",
                type: '"horizontal" | "vertical"',
                default: '"horizontal"',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="navigation-menu"',
                description: "The nav, with data-variant.",
              },
              {
                name: 'data-slot="navigation-menu-highlight"',
                description:
                  "The background that slides between open triggers.",
              },
              {
                name: 'data-slot="navigation-menu-popup"',
                description:
                  "The card. Its height eases through --popup-height.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="NavigationMenuTrigger" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="navigation-menu-trigger"',
                description: "Target triggers in CSS.",
              },
              {
                name: "data-popup-open",
                description:
                  "Present while its menu is open. The chevron flips.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="NavigationMenuContent" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="navigation-menu-content"',
                description: "A menu's content, with data-variant.",
              },
              {
                name: "data-activation-direction",
                description:
                  '"left", "right", "up" or "down": where the previous trigger was. Drives the slide.',
              },
              {
                name: "--navigation-menu-link-radius",
                description: "Link corner radius, concentric with the card.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="NavigationMenuLink" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "active",
                type: "boolean",
                default: "false",
                description: "Marks the current page.",
              },
              { name: "render", type: renderType, default: "<a>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="navigation-menu-link"',
                description:
                  "Target links in CSS. In the bar they size themselves like triggers.",
              },
              {
                name: "data-active",
                description: "Present on the current page.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
