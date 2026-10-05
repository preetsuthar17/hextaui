import { DocsCodeBlock } from "@/components/docs/docs-code-block"
import { DocsComponentPage } from "@/components/docs/docs-component-page"
import {
  DocsCode,
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
import { BreadcrumbBasic } from "@/components/examples/breadcrumb/basic"
import { BreadcrumbControlled } from "@/components/examples/breadcrumb/controlled"
import { BreadcrumbCustomSeparator } from "@/components/examples/breadcrumb/custom-separator"
import { BreadcrumbDemo } from "@/components/examples/breadcrumb/demo"
import { BreadcrumbDropdown } from "@/components/examples/breadcrumb/dropdown"
import { BreadcrumbEllipsisDemo } from "@/components/examples/breadcrumb/ellipsis"
import { BreadcrumbLinkComponent } from "@/components/examples/breadcrumb/link-component"
import { BreadcrumbLongContent } from "@/components/examples/breadcrumb/long-content"
import { BreadcrumbRtl } from "@/components/examples/breadcrumb/rtl"
import { BreadcrumbWithIcons } from "@/components/examples/breadcrumb/with-icons"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("breadcrumb")

const importCode = `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"`

const usageCode = `<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `Breadcrumb
└── BreadcrumbList
    ├── BreadcrumbItem
    │   └── BreadcrumbLink
    ├── BreadcrumbSeparator
    ├── BreadcrumbCollapse
    │   ├── BreadcrumbItem
    │   └── BreadcrumbSeparator
    └── BreadcrumbItem
        └── BreadcrumbPage`

export default function Page() {
  return (
    <DocsComponentPage slug="breadcrumb">
      <DocsExample file="breadcrumb/demo">
        <BreadcrumbDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "@tabler/icons-react", "cn"]}
        files={["components/ui/breadcrumb.tsx", "lib/motion.ts"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample file="breadcrumb/basic" title="Basic">
          <BreadcrumbBasic />
        </DocsExample>
        <DocsExample
          file="breadcrumb/with-icons"
          title="With icons"
          description={
            <>
              Icons sit inside links and the current page. Give an icon-only
              link an <DocsCode>aria-label</DocsCode>.
            </>
          }
        >
          <BreadcrumbWithIcons />
        </DocsExample>
        <DocsExample
          file="breadcrumb/custom-separator"
          title="Custom separator"
          description={
            <>
              Pass any element as <DocsCode>children</DocsCode> of{" "}
              <DocsCode>{"<BreadcrumbSeparator />"}</DocsCode> to replace the
              chevron.
            </>
          }
        >
          <BreadcrumbCustomSeparator />
        </DocsExample>
        <DocsExample
          file="breadcrumb/dropdown"
          title="Dropdown"
          description={
            <>
              Render a <DocsCode>{"<BreadcrumbLink />"}</DocsCode> as the
              trigger of a <DocsCode>{"<DropdownMenu />"}</DocsCode> to offer
              sibling pages.
            </>
          }
        >
          <BreadcrumbDropdown />
        </DocsExample>
        <DocsExample
          file="breadcrumb/controlled"
          title="Collapsed"
          description={
            <>
              Wrap middle segments in{" "}
              <DocsCode>{"<BreadcrumbCollapse />"}</DocsCode>. They hide behind
              an ellipsis and slide open in place, and focus moves to the first
              revealed link. Pass <DocsCode>open</DocsCode> and{" "}
              <DocsCode>onOpenChange</DocsCode> to control it.
            </>
          }
        >
          <BreadcrumbControlled />
        </DocsExample>
        <DocsExample
          file="breadcrumb/ellipsis"
          title="Ellipsis"
          description={
            <>
              A static <DocsCode>{"<BreadcrumbEllipsis />"}</DocsCode> marks
              skipped levels. It is hidden from assistive tech unless you make
              it interactive.
            </>
          }
        >
          <BreadcrumbEllipsisDemo />
        </DocsExample>
        <DocsExample
          file="breadcrumb/link-component"
          title="Link component"
          description={
            <>
              Use the <DocsCode>render</DocsCode> prop to swap the anchor for
              your router&apos;s link, like Next.js{" "}
              <DocsCode>{"<Link />"}</DocsCode>.
            </>
          }
        >
          <BreadcrumbLinkComponent />
        </DocsExample>
        <DocsExample
          file="breadcrumb/long-content"
          title="Long content"
          description="Unbroken names wrap instead of overflowing, and segments with a max width truncate."
        >
          <BreadcrumbLongContent />
        </DocsExample>
        <DocsExample
          file="breadcrumb/rtl"
          title="Right to left"
          description="Separators flip and the collapse animates from the correct side."
        >
          <BreadcrumbRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsParagraph>
          Links and the collapse button are regular tab stops. Separators and a
          static ellipsis are skipped.
        </DocsParagraph>
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab", "Shift + Tab"],
              description: "Moves between links and the collapse button.",
            },
            {
              keys: ["Enter"],
              description: "Follows the focused link.",
            },
            {
              keys: ["Enter", "Space"],
              description:
                "On the collapse button, reveals the hidden segments. Once they finish sliding open, focus moves to the first revealed link.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Every part accepts the attributes of the element it renders, plus a{" "}
          <DocsCode>render</DocsCode> prop to swap that element.
        </DocsParagraph>
        <DocsSection title="Breadcrumb" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "render",
                type: renderType,
                default: "<nav>",
                description: "Labelled “Breadcrumb” for assistive tech.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="breadcrumb"',
                description: "The <nav> landmark.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="BreadcrumbList" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<ol>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="breadcrumb-list"',
                description:
                  "The ordered list. Items wrap onto new lines when space runs out.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="BreadcrumbItem" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<li>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="breadcrumb-item"',
                description: "Target items in CSS.",
              },
              {
                name: "data-collapsed",
                description:
                  "Present while the item is hidden inside a closed BreadcrumbCollapse.",
              },
              {
                name: "data-breadcrumb-group",
                description:
                  "Present on items inside a BreadcrumbCollapse. Shared by every part of the same group.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="BreadcrumbLink" level={3}>
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
              {
                name: 'data-slot="breadcrumb-link"',
                description: "Target links in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="BreadcrumbPage" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "render",
                type: renderType,
                default: "<span>",
                description: 'Marked with aria-current="page".',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="breadcrumb-page"',
                description: 'The current page, with aria-current="page".',
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="BreadcrumbSeparator" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                default: "<IconChevronRight />",
                description: "Mirrors automatically in right-to-left layouts.",
              },
              { name: "render", type: renderType, default: "<li>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="breadcrumb-separator"',
                description: "Presentational and hidden from assistive tech.",
              },
              {
                name: "data-collapsed",
                description:
                  "Present while the separator is hidden inside a closed BreadcrumbCollapse.",
              },
              {
                name: "data-breadcrumb-group",
                description:
                  "Present on separators inside a BreadcrumbCollapse.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="BreadcrumbEllipsis" level={3}>
          <DocsPropsTable
            props={[
              { name: "children", type: "ReactNode", default: "<IconDots />" },
              {
                name: "render",
                type: renderType,
                default: "<span>",
                description:
                  "Hidden from assistive tech unless render or onClick makes it interactive.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="breadcrumb-ellipsis"',
                description: "Target the ellipsis in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="BreadcrumbCollapse" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                description:
                  "The items and separators to hide behind the ellipsis.",
              },
              { name: "open", type: "boolean" },
              { name: "defaultOpen", type: "boolean", default: "false" },
              { name: "onOpenChange", type: "(open: boolean) => void" },
              {
                name: "label",
                type: "string",
                default: '"Show full path"',
                description: "Accessible name of the ellipsis button.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="breadcrumb-collapse"',
                description: "The <li> that holds the ellipsis button.",
              },
              {
                name: "data-collapsed",
                description:
                  "Present on the ellipsis item once the group has opened, which hides it.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
