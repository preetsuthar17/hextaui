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
  DocsPropsTable,
} from "@/components/docs/docs-props-table"
import { EmptyAvatar } from "@/components/examples/empty/avatar"
import { EmptyAvatarGroup } from "@/components/examples/empty/avatar-group"
import { EmptyDemo } from "@/components/examples/empty/demo"
import { EmptyHeading } from "@/components/examples/empty/heading"
import { EmptyImage } from "@/components/examples/empty/image"
import { EmptyInCard } from "@/components/examples/empty/in-card"
import { EmptyInCommand } from "@/components/examples/empty/in-command"
import { EmptyInPopover } from "@/components/examples/empty/in-popover"
import { EmptyInTable } from "@/components/examples/empty/in-table"
import { EmptyLongContent } from "@/components/examples/empty/long-content"
import { EmptyMuted } from "@/components/examples/empty/muted"
import { EmptyOutline } from "@/components/examples/empty/outline"
import { EmptyRtl } from "@/components/examples/empty/rtl"
import { EmptySearchResults } from "@/components/examples/empty/search-results"
import { EmptySmall } from "@/components/examples/empty/small"
import { EmptyTransition } from "@/components/examples/empty/transition"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("empty")

const importCode = `import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"`

const usageCode = `<Empty>
  <EmptyHeader>
    <EmptyMedia variant="stack">
      <IconFolder />
    </EmptyMedia>
    <EmptyTitle>No projects yet</EmptyTitle>
    <EmptyDescription>Create a project to get started.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Create project</Button>
  </EmptyContent>
</Empty>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `Empty
├── EmptyHeader
│   ├── EmptyMedia
│   ├── EmptyTitle
│   └── EmptyDescription
└── EmptyContent`

export default function Page() {
  return (
    <DocsComponentPage slug="empty">
      <DocsExample file="empty/demo">
        <EmptyDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "class-variance-authority", "cn"]}
        files={["components/ui/empty.tsx"]}
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
          file="empty/transition"
          title="Entrance"
          description={
            <>
              When an empty state replaces content, its parts fade up one after
              another: media, title, description, then actions. Dismiss the
              notifications to see it. Under reduced motion it just appears. Set{" "}
              <DocsCode>{"animated={false}"}</DocsCode> for empty states that
              are there from the first paint.
            </>
          }
        >
          <EmptyTransition />
        </DocsExample>
        <DocsExample
          file="empty/outline"
          title="Outline"
          description={
            <>
              <DocsCode>{'variant="outline"'}</DocsCode> draws a dashed hairline
              border, the usual way to mark a drop zone or an area waiting for
              content.
            </>
          }
        >
          <EmptyOutline />
        </DocsExample>
        <DocsExample
          file="empty/muted"
          title="Muted"
          description={
            <>
              <DocsCode>{'variant="muted"'}</DocsCode> sits on a soft fill. The
              icon tile switches to a raised white surface so it still stands
              out.
            </>
          }
        >
          <EmptyMuted />
        </DocsExample>
        <DocsExample
          file="empty/small"
          title="Small"
          description={
            <>
              <DocsCode>{'size="sm"'}</DocsCode> tightens the padding, gaps,
              icon tile and title for sidebars, popovers and narrow panels.
            </>
          }
        >
          <EmptySmall />
        </DocsExample>
        <DocsExample
          file="empty/avatar"
          title="Avatar"
          description={
            <>
              The default <DocsCode>EmptyMedia</DocsCode> variant only centers
              its content, so any avatar, badge or illustration fits.
            </>
          }
        >
          <EmptyAvatar />
        </DocsExample>
        <DocsExample
          file="empty/avatar-group"
          title="Avatar group"
          description="Show who could be here, for invites and shared spaces."
        >
          <EmptyAvatarGroup />
        </DocsExample>
        <DocsExample
          file="empty/image"
          title="Image"
          description="Give images explicit dimensions so the layout doesn’t shift while they load."
        >
          <EmptyImage />
        </DocsExample>
        <DocsExample
          file="empty/search-results"
          title="No search results"
          description={
            <>
              Swap the results for an empty state when filters match nothing,
              and offer a way out. A visually hidden{" "}
              <DocsCode>{'role="status"'}</DocsCode> announces the count, so
              screen reader users hear the change without the whole list being
              read.
            </>
          }
        >
          <EmptySearchResults />
        </DocsExample>
        <DocsExample
          file="empty/in-card"
          title="In a card"
          description={
            <>
              Use <DocsCode>{'size="sm"'}</DocsCode> with the muted variant to
              fill a card that has no data yet.
            </>
          }
        >
          <EmptyInCard />
        </DocsExample>
        <DocsExample
          file="empty/in-table"
          title="In a table"
          description={
            <>
              Put it in a single cell that spans every column with{" "}
              <DocsCode>colSpan</DocsCode>, so the header stays aligned.
            </>
          }
        >
          <EmptyInTable />
        </DocsExample>
        <DocsExample
          file="empty/in-popover"
          title="In a popover"
          description="A compact empty state for menus and notification panels."
        >
          <EmptyInPopover />
        </DocsExample>
        <DocsExample
          file="empty/in-command"
          title="In a command list"
          description={
            <>
              <DocsCode>{"<CommandEmpty />"}</DocsCode> passes the current
              search to a function child, so the message can quote it.
            </>
          }
        >
          <EmptyInCommand />
        </DocsExample>
        <DocsExample
          file="empty/heading"
          title="Heading level"
          description={
            <>
              The title is a <DocsCode>{"<div>"}</DocsCode> so it never breaks
              your page outline. Render it as the heading level that fits, and
              label the region with it.
            </>
          }
        >
          <EmptyHeading />
        </DocsExample>
        <DocsExample
          file="empty/long-content"
          title="Long content"
          description="Unbroken names and long addresses wrap inside the container, and long button labels truncate."
        >
          <EmptyLongContent />
        </DocsExample>
        <DocsExample
          file="empty/rtl"
          title="Right to left"
          description="Everything is centered and uses logical properties, so it reads naturally in right-to-left layouts."
        >
          <EmptyRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            <DocsCode>{"<EmptyTitle />"}</DocsCode> renders a{" "}
            <DocsCode>{"<div>"}</DocsCode>. Pass{" "}
            <DocsCode>{"render={<h2 />}"}</DocsCode> (or the level that fits)
            when the empty state is a section of the page.
          </li>
          <li>
            <DocsCode>{'<EmptyMedia variant="icon" />'}</DocsCode> is hidden
            from assistive tech because the title already says what it means.
            Images in the default variant stay exposed, so give them an{" "}
            <DocsCode>alt</DocsCode> or <DocsCode>{'alt=""'}</DocsCode>.
          </li>
          <li>
            When results disappear after a search or filter, announce the change
            with a short <DocsCode>{'role="status"'}</DocsCode> message next to
            the list. Don’t make the whole empty state a live region, since its
            buttons and links would be read every time.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Every part renders a plain element, accepts its attributes and
          supports the <DocsCode>render</DocsCode> prop to swap it.
        </DocsParagraph>
        <DocsSection title="Empty" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "outline" | "muted"',
                default: '"default"',
              },
              {
                name: "size",
                type: '"default" | "sm"',
                default: '"default"',
                description:
                  "sm tightens padding, gaps, the icon tile and the title.",
              },
              {
                name: "animated",
                type: "boolean",
                default: "true",
                description:
                  "Fade the parts up in sequence when the empty state mounts. Skipped under reduced motion.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="empty"',
                description: "Target the root in CSS.",
              },
              { name: "data-variant", description: "The current variant." },
              { name: "data-size", description: "The current size." },
              {
                name: "data-animated",
                description: "Present when the entrance animation is on.",
              },
              {
                name: "--empty-padding",
                description: "Padding on every side. Set by size.",
              },
              {
                name: "--empty-gap",
                description:
                  "Space between the header and content. Set by size.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="EmptyHeader" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<div>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="empty-header"',
                description: "Target the header in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="EmptyMedia" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "icon" | "stack"',
                default: '"default"',
                description:
                  "icon puts an icon in a muted tile. stack raises the tile over two fanned cards that spread when the empty state is hovered. Both hide the media from assistive tech.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="empty-icon"',
                description: "Target the media in CSS. Matches shadcn.",
              },
              { name: "data-variant", description: "The current variant." },
            ]}
          />
        </DocsSection>
        <DocsSection title="EmptyTitle" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "render",
                type: renderType,
                default: "<div>",
                description: "Render a heading, such as render={<h2 />}.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="empty-title"',
                description: "Target the title in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="EmptyDescription" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "render",
                type: renderType,
                default: "<div>",
                description:
                  "Plain links inside are underlined. Components rendered as links keep their own style.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="empty-description"',
                description: "Target the description in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="EmptyContent" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<div>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="empty-content"',
                description: "Target the actions area in CSS.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
