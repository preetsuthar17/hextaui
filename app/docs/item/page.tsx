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
import { ItemActionsDemo } from "@/components/examples/item/actions"
import { ItemAvatar } from "@/components/examples/item/avatar"
import { ItemDemo } from "@/components/examples/item/demo"
import { ItemHeaderFooter } from "@/components/examples/item/header-footer"
import { ItemImage } from "@/components/examples/item/image"
import { ItemLongContent } from "@/components/examples/item/long-content"
import { ItemPeople } from "@/components/examples/item/people"
import { ItemPressed } from "@/components/examples/item/pressed"
import { ItemRtl } from "@/components/examples/item/rtl"
import { ItemSelectable } from "@/components/examples/item/selectable"
import { ItemSeparatorDemo } from "@/components/examples/item/separator"
import { ItemSizes } from "@/components/examples/item/sizes"
import { ItemVariants } from "@/components/examples/item/variants"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("item")

const importCode = `import {
  Item,
  ItemActions,
  ItemChevron,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"`

const usageCode = `<ItemGroup variant="grouped">
  <Item render={<a href="/settings/profile" />}>
    <ItemMedia variant="icon">
      <IconUserCircle />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>Profile</ItemTitle>
      <ItemDescription>Name, photo and handle</ItemDescription>
    </ItemContent>
    <ItemChevron />
  </Item>
</ItemGroup>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `ItemGroup
├── Item
│   ├── ItemHeader
│   ├── ItemMedia
│   ├── ItemContent
│   │   ├── ItemTitle
│   │   └── ItemDescription
│   ├── ItemActions
│   ├── ItemChevron
│   └── ItemFooter
└── ItemSeparator`

export default function Page() {
  return (
    <DocsComponentPage slug="item">
      <DocsExample file="item/demo">
        <ItemDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={["components/ui/item.tsx", "lib/motion.ts"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Give icon media a <DocsCode>tone</DocsCode> for colored tiles like iOS
          Settings, or leave it unset for a neutral tile. An item becomes
          interactive when it renders as a link, button or label through{" "}
          <DocsCode>render</DocsCode>. Only then does it get hover, press and
          focus styles, so static rows never pretend to be clickable.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="item/pressed"
          title="Grouped"
          description={
            <>
              <DocsCode>{'variant="grouped"'}</DocsCode> puts items on one
              surface. Separators are drawn for you and inset to the text, the
              first and last rows own the outer corners, and the separators next
              to a hovered or focused row fade out.
            </>
          }
        >
          <ItemPressed />
        </DocsExample>
        <DocsExample
          file="item/image"
          title="Hover highlight"
          description={
            <>
              Interactive items in a group share one highlight that glides to
              the row under the pointer and takes on its corners. It only
              follows a mouse or pen, never touch, and turn it off with{" "}
              <DocsCode>{"highlight={false}"}</DocsCode>. Image media corners
              are concentric with the row.
            </>
          }
        >
          <ItemImage />
        </DocsExample>
        <DocsExample
          file="item/selectable"
          title="Selectable"
          description={
            <>
              Render an item as a <DocsCode>{"<label>"}</DocsCode> around a
              Checkbox and the whole row toggles it. A checked control, or{" "}
              <DocsCode>aria-selected</DocsCode>,{" "}
              <DocsCode>aria-checked</DocsCode> or{" "}
              <DocsCode>aria-pressed</DocsCode> on the item, marks the row
              selected.
            </>
          }
        >
          <ItemSelectable />
        </DocsExample>
        <DocsExample
          file="item/variants"
          title="Variants"
          description={
            <>
              <DocsCode>default</DocsCode> has no surface,{" "}
              <DocsCode>outline</DocsCode> draws a hairline and{" "}
              <DocsCode>muted</DocsCode> sits on a soft fill.
            </>
          }
        >
          <ItemVariants />
        </DocsExample>
        <DocsExample
          file="item/sizes"
          title="Sizes"
          description={
            <>
              <DocsCode>size</DocsCode> scales padding, gap, corner radius and
              media together. A group tightens its gap to match.
            </>
          }
        >
          <ItemSizes />
        </DocsExample>
        <DocsExample
          file="item/avatar"
          title="Avatar"
          description={
            <>
              The default <DocsCode>{"<ItemMedia />"}</DocsCode> only centers
              its content, so an Avatar or AvatarGroup drops straight in.
            </>
          }
        >
          <ItemAvatar />
        </DocsExample>
        <DocsExample
          file="item/people"
          title="People"
          description={
            <>
              A grouped list of people. Separators start where the text starts,
              whatever sits in the media slot, so they line up under the names.
            </>
          }
        >
          <ItemPeople />
        </DocsExample>
        <DocsExample
          file="item/actions"
          title="Actions"
          description={
            <>
              <DocsCode>{"<ItemActions />"}</DocsCode> holds buttons at the end
              of the row. Keep the item itself static when it holds buttons, so
              there&apos;s never a button inside a link.
            </>
          }
        >
          <ItemActionsDemo />
        </DocsExample>
        <DocsExample
          file="item/header-footer"
          title="Header and footer"
          description={
            <>
              <DocsCode>{"<ItemHeader />"}</DocsCode> and{" "}
              <DocsCode>{"<ItemFooter />"}</DocsCode> take a full row above and
              below the content.
            </>
          }
        >
          <ItemHeaderFooter />
        </DocsExample>
        <DocsExample
          file="item/separator"
          title="Separator"
          description={
            <>
              In a default group, place an{" "}
              <DocsCode>{"<ItemSeparator />"}</DocsCode> between items yourself.
            </>
          }
        >
          <ItemSeparatorDemo />
        </DocsExample>
        <DocsExample
          file="item/long-content"
          title="Long content"
          description="Titles clamp to one line and descriptions to two. Unbroken strings wrap instead of widening the row."
        >
          <ItemLongContent />
        </DocsExample>
        <DocsExample
          file="item/rtl"
          title="Right to left"
          description="Padding, separator insets and the chevron follow the reading direction."
        >
          <ItemRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Moves to the next interactive item, in source order like any link or button.",
            },
            {
              keys: ["Enter"],
              description: "Follows a link item or presses a button item.",
            },
            {
              keys: ["Space"],
              description: "Presses a button item or toggles a label item.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            A group is a list when its items are plain rows. Items rendered as
            links or buttons keep their own role, and the group drops the list
            role so the markup stays valid. Render the group as{" "}
            <DocsCode>{"<ul>"}</DocsCode> and items as{" "}
            <DocsCode>{"<li>"}</DocsCode> wrapping links if you want both.
          </li>
          <li>
            <DocsCode>{'<ItemMedia variant="icon" />'}</DocsCode> and the
            chevron are hidden from screen readers. Give images real alt text
            when they carry meaning.
          </li>
          <li>
            The highlight is decoration. Keyboard focus shows the focus ring,
            and the highlight never moves focus or changes the tab order.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Every part renders a <DocsCode>{"<div>"}</DocsCode> by default and
          accepts <DocsCode>render</DocsCode> and its element&apos;s attributes.
        </DocsParagraph>
        <DocsSection title="Item" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "outline" | "muted"',
                default: '"default"',
              },
              {
                name: "size",
                type: '"default" | "sm" | "xs"',
                default: '"default"',
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              { name: 'data-slot="item"', description: "Target items in CSS." },
              { name: "data-variant", description: "The current variant." },
              { name: "data-size", description: "The current size." },
              {
                name: "data-interactive",
                description:
                  "Present when the item renders as a link, button or label.",
              },
              {
                name: "data-highlighted",
                description: "Present while the group highlight is on it.",
              },
              {
                name: "--item-radius",
                description:
                  "Corner radius. Media corners derive from it. Set by size.",
              },
              {
                name: "--item-px / --item-py / --item-gap",
                description: "Padding and gap. Set by size.",
              },
              {
                name: "--item-media-size",
                description: "Size of icon and image media. Set by size.",
              },
              {
                name: "--item-inset",
                description:
                  "Where a grouped separator starts. Measured to line up with ItemContent, whatever the media is.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ItemGroup" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "grouped"',
                default: '"default"',
                description:
                  "grouped puts items on one surface with automatic separators.",
              },
              {
                name: "highlight",
                type: "boolean",
                default: "true",
                description:
                  "Show one highlight that glides between interactive items on hover.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="item-group"',
                description: "Target groups in CSS.",
              },
              { name: "data-variant", description: "The current variant." },
              {
                name: "data-highlight",
                description: "Present when the hover highlight is on.",
              },
              {
                name: "--item-group-radius",
                description:
                  "Corner radius of a grouped surface. The first and last items follow it.",
              },
              {
                name: 'data-slot="item-highlight"',
                description:
                  "The highlight element, with data-visible and data-pressed.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ItemMedia" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "icon" | "image"',
                default: '"default"',
                description:
                  "icon puts the icon on a tile and hides it from screen readers. image crops to a square. Both have corners concentric with the item.",
              },
              {
                name: "tone",
                type: '"gray" | "red" | "orange" | "yellow" | "green" | "teal" | "sky" | "blue" | "indigo" | "purple" | "pink"',
                description:
                  "With the icon variant, fills the tile with a solid color and turns the icon white, like iOS Settings. Leave it unset for a neutral tile.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="item-media"',
                description: "Target media in CSS.",
              },
              { name: "data-variant", description: "The current variant." },
              {
                name: "data-tone",
                description: "The tile color, when tone is set on an icon.",
              },
              {
                name: "--item-media-tone",
                description:
                  "The tile color. Set it to any color for a custom tone.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ItemContent" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="item-content"',
                description:
                  "Grows to fill the row. A second content block hugs its text.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ItemTitle" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="item-title"',
                description: "Clamped to one line.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ItemDescription" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<p>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="item-description"',
                description: "Clamped to two lines.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ItemActions" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="item-actions"',
                description: "Target the actions in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ItemHeader and ItemFooter" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="item-header"',
                description: "A full-width row above the content.",
              },
              {
                name: 'data-slot="item-footer"',
                description: "A full-width row below the content.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ItemChevron" level={3}>
          <DocsParagraph>
            A trailing chevron that nudges toward the reading direction when its
            item is hovered. Accepts every Tabler icon prop.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="item-chevron"',
                description: "Target the chevron in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ItemSeparator" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="item-separator"',
                description: 'A hairline with role="separator".',
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
