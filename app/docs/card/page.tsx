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
import { CardBorders } from "@/components/examples/card/borders"
import { CardDemo } from "@/components/examples/card/demo"
import { CardClickable } from "@/components/examples/card/link"
import { CardLinkVariants } from "@/components/examples/card/link-variants"
import { CardLongContent } from "@/components/examples/card/long-content"
import { CardMedia } from "@/components/examples/card/media"
import { CardNested } from "@/components/examples/card/nested"
import { CardRtl } from "@/components/examples/card/rtl"
import { CardSemantics } from "@/components/examples/card/semantics"
import { CardSizes } from "@/components/examples/card/sizes"
import { CardVariants } from "@/components/examples/card/variants"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("card")

const importCode = `import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLink,
  CardTitle,
} from "@/components/ui/card"`

const usageCode = `<Card>
  <CardHeader>
    <CardTitle>Team plan</CardTitle>
    <CardDescription>Billed monthly.</CardDescription>
    <CardAction>
      <Button variant="ghost" size="icon-sm" aria-label="More options">
        <IconDotsVertical />
      </Button>
    </CardAction>
  </CardHeader>
  <CardContent>12 of 20 seats used.</CardContent>
  <CardFooter>
    <Button>Manage seats</Button>
  </CardFooter>
</Card>`

const renderType = "ReactElement | (props, state) => ReactElement"

function slotAttribute(slot: string, description: string) {
  return { name: `data-slot="${slot}"`, description }
}

const compositionCode = `Card
├── CardHeader
│   ├── CardTitle
│   │   └── CardLink
│   ├── CardDescription
│   └── CardAction
├── CardContent
└── CardFooter`

export default function Page() {
  return (
    <DocsComponentPage slug="card">
      <DocsExample file="card/demo">
        <CardDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "class-variance-authority", "cn"]}
        files={["components/ui/card.tsx"]}
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
          file="card/variants"
          title="Variants"
          description={
            <>
              <DocsCode>default</DocsCode> sits on a hairline ring with a soft
              shadow, <DocsCode>outline</DocsCode> drops the fill and shadow,
              and <DocsCode>muted</DocsCode> uses a filled surface for quieter
              sections.
            </>
          }
        >
          <CardVariants />
        </DocsExample>
        <DocsExample
          file="card/sizes"
          title="Sizes"
          description={
            <>
              <DocsCode>size=&quot;sm&quot;</DocsCode> tightens the spacing,
              radius and title size together, so a compact card still looks like
              part of the same family.{" "}
              <DocsCode>size=&quot;flush&quot;</DocsCode> removes the inner
              spacing for custom layouts such as lists and collapsible rows that
              bring their own padding.
            </>
          }
        >
          <CardSizes />
        </DocsExample>
        <DocsExample
          file="card/media"
          title="Media"
          description="An image, video, picture or aspect ratio placed first or last runs edge to edge. The card drops the padding on that side and clips the media to its corners."
        >
          <CardMedia />
        </DocsExample>
        <DocsExample
          file="card/link"
          title="Clickable card"
          description={
            <>
              Put a <DocsCode>{"<CardLink />"}</DocsCode> in the title to make
              the whole card one link. Buttons and other controls inside stay
              clickable and keep their own focus, like the star here.
            </>
          }
        >
          <CardClickable />
        </DocsExample>
        <DocsExample
          file="card/link-variants"
          title="Clickable variants"
          description="Each variant gets its own hover feedback once it holds a link, and the focus ring wraps the whole card when the link is focused with the keyboard."
        >
          <CardLinkVariants />
        </DocsExample>
        <DocsExample
          file="card/borders"
          title="Borders"
          description={
            <>
              Add <DocsCode>border-b</DocsCode> to the header or{" "}
              <DocsCode>border-t</DocsCode> to the footer and the card adds
              matching padding on the inner side.
            </>
          }
        >
          <CardBorders />
        </DocsExample>
        <DocsExample
          file="card/nested"
          title="Nested"
          description="A card inside CardContent derives its radius from the parent’s radius minus the spacing, so the corners stay concentric."
        >
          <CardNested />
        </DocsExample>
        <DocsExample
          file="card/long-content"
          title="Long content"
          description="Unbroken titles, long URLs, emoji and CJK text wrap inside a narrow card instead of pushing it wider."
        >
          <CardLongContent />
        </DocsExample>
        <DocsExample
          file="card/semantics"
          title="Semantics"
          description={
            <>
              Every part takes a <DocsCode>render</DocsCode> prop, so a card can
              be an <DocsCode>{"<article>"}</DocsCode> with a real heading,
              header and footer.
            </>
          }
        >
          <CardSemantics />
        </DocsExample>
        <DocsExample
          file="card/rtl"
          title="Right to left"
          description="The action moves to the inline start and the footer follows the reading direction."
        >
          <CardRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsParagraph>
          A card is not focusable on its own. These keys apply when it holds a{" "}
          <DocsCode>{"<CardLink />"}</DocsCode>.
        </DocsParagraph>
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Focuses the card link, which draws the focus ring around the whole card, then moves on to each control inside it.",
            },
            {
              keys: ["Enter"],
              description: "Follows the card link.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The link’s accessible name is its own text, so keep{" "}
            <DocsCode>{"<CardLink />"}</DocsCode> inside the title rather than
            wrapping the whole card in an anchor.
          </li>
          <li>
            Controls inside a clickable card are lifted above the link’s hit
            area, so they stay reachable by pointer and keyboard.
          </li>
          <li>
            Use <DocsCode>render</DocsCode> on{" "}
            <DocsCode>{"<CardTitle />"}</DocsCode> to give the title the heading
            level that fits your page.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Every part renders a <DocsCode>{"<div>"}</DocsCode> by default,
          accepts its attributes and takes a <DocsCode>render</DocsCode> prop to
          swap the element.
        </DocsParagraph>
        <DocsSection title="Card" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "outline" | "muted"',
                default: '"default"',
              },
              {
                name: "size",
                type: '"default" | "sm" | "flush"',
                default: '"default"',
                description: "Scales spacing, radius and title size together.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              slotAttribute("card", "Target the card in CSS."),
              { name: "data-variant", description: "The current variant." },
              { name: "data-size", description: "The current size." },
              {
                name: "data-link",
                description: "Present while the card contains a CardLink.",
              },
              {
                name: "--card-spacing",
                description:
                  "Inner spacing shared by every part. Set by the size.",
              },
              {
                name: "--card-radius",
                description:
                  "Corner radius. Nested cards derive theirs from the parent.",
              },
              {
                name: "--card-title-size",
                description: "Font size used by CardTitle.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CardHeader" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<div>" }]}
          />
          <DocsAttributesTable
            attributes={[
              slotAttribute(
                "card-header",
                "A grid that places CardAction in the top end corner."
              ),
            ]}
          />
        </DocsSection>
        <DocsSection title="CardTitle" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<div>" }]}
          />
          <DocsAttributesTable
            attributes={[slotAttribute("card-title", "Target the title.")]}
          />
        </DocsSection>
        <DocsSection title="CardDescription" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<div>" }]}
          />
          <DocsAttributesTable
            attributes={[
              slotAttribute("card-description", "Target the description."),
            ]}
          />
        </DocsSection>
        <DocsSection title="CardAction" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<div>" }]}
          />
          <DocsAttributesTable
            attributes={[
              slotAttribute(
                "card-action",
                "Spans the title and description rows, above a CardLink’s hit area."
              ),
            ]}
          />
        </DocsSection>
        <DocsSection title="CardContent" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<div>" }]}
          />
          <DocsAttributesTable
            attributes={[
              slotAttribute(
                "card-content",
                "Passes the card radius and spacing down to nested cards."
              ),
            ]}
          />
        </DocsSection>
        <DocsSection title="CardFooter" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<div>" }]}
          />
          <DocsAttributesTable
            attributes={[slotAttribute("card-footer", "Target the footer.")]}
          />
        </DocsSection>
        <DocsSection title="CardLink" level={3}>
          <DocsPropsTable
            props={[
              { name: "href", type: "string" },
              {
                name: "render",
                type: renderType,
                default: "<a>",
                description: "Pass your router’s link component here.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              slotAttribute(
                "card-link",
                "Stretches its hit area over the whole card."
              ),
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
