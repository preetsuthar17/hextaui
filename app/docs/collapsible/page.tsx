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
import { CollapsibleCard } from "@/components/examples/collapsible/card"
import { CollapsibleControlled } from "@/components/examples/collapsible/controlled"
import { CollapsibleCustomIcon } from "@/components/examples/collapsible/custom-icon"
import { CollapsibleDemo } from "@/components/examples/collapsible/demo"
import { CollapsibleDisabled } from "@/components/examples/collapsible/disabled"
import { CollapsibleFileTree } from "@/components/examples/collapsible/file-tree"
import { CollapsibleLongContent } from "@/components/examples/collapsible/long-content"
import { CollapsibleOpenByDefault } from "@/components/examples/collapsible/open-by-default"
import { CollapsibleRtl } from "@/components/examples/collapsible/rtl"
import { CollapsibleShowMore } from "@/components/examples/collapsible/show-more"
import { CollapsibleUnmounted } from "@/components/examples/collapsible/unmounted"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("collapsible")

const importCode = `import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleTriggerIcon,
} from "@/components/ui/collapsible"`

const usageCode = `<Collapsible>
  <CollapsibleTrigger render={<Button variant="outline" />}>
    Details
    <CollapsibleTriggerIcon data-icon="inline-end" />
  </CollapsibleTrigger>
  <CollapsibleContent>
    Shipping takes 2 business days.
  </CollapsibleContent>
</Collapsible>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `Collapsible
├── CollapsibleTrigger
│   └── CollapsibleTriggerIcon
└── CollapsibleContent`

export default function Page() {
  return (
    <DocsComponentPage slug="collapsible">
      <DocsExample file="collapsible/demo">
        <CollapsibleDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "@tabler/icons-react", "cn"]}
        files={["components/ui/collapsible.tsx"]}
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
          file="collapsible/open-by-default"
          title="Open by default"
          description={
            <>
              <DocsCode>defaultOpen</DocsCode> starts the panel open without
              taking over its state.
            </>
          }
        >
          <CollapsibleOpenByDefault />
        </DocsExample>
        <DocsExample
          file="collapsible/show-more"
          title="Show more"
          description="The panel sits above its trigger. When it closes, the gap in the parent’s flex layout collapses in the same animation, so the button below never jumps."
        >
          <CollapsibleShowMore />
        </DocsExample>
        <DocsExample
          file="collapsible/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>open</DocsCode> and{" "}
              <DocsCode>onOpenChange</DocsCode> to drive the panel from your own
              state. Toggling mid-animation reverses from where the panel is.
            </>
          }
        >
          <CollapsibleControlled />
        </DocsExample>
        <DocsExample
          file="collapsible/disabled"
          title="Disabled"
          description={
            <>
              <DocsCode>disabled</DocsCode> on the root keeps the panel in its
              current state and makes the trigger ignore clicks and keys.
            </>
          }
        >
          <CollapsibleDisabled />
        </DocsExample>
        <DocsExample
          file="collapsible/custom-icon"
          title="Custom icon"
          description={
            <>
              Children of <DocsCode>{"<CollapsibleTriggerIcon />"}</DocsCode>{" "}
              replace the chevron. Style the open state with{" "}
              <DocsCode>group-data-panel-open/collapsible-trigger</DocsCode>.
            </>
          }
        >
          <CollapsibleCustomIcon />
        </DocsExample>
        <DocsExample
          file="collapsible/file-tree"
          title="File tree"
          description="Each folder is its own collapsible. Outer panels grow smoothly as inner ones open."
        >
          <CollapsibleFileTree />
        </DocsExample>
        <DocsExample
          file="collapsible/card"
          title="Inside a card"
          description="Closed panels stay in the page with hidden=“until-found”, so Cmd/Ctrl+F for “webhook” opens this one."
        >
          <CollapsibleCard />
        </DocsExample>
        <DocsExample
          file="collapsible/unmounted"
          title="Unmounted when closed"
          description={
            <>
              Set <DocsCode>{"hiddenUntilFound={false}"}</DocsCode> on the
              content to remove it from the DOM while closed, for heavy panels
              you don’t want rendered up front.
            </>
          }
        >
          <CollapsibleUnmounted />
        </DocsExample>
        <DocsExample
          file="collapsible/long-content"
          title="Long content"
          description="Unbroken strings wrap inside the panel instead of widening the page."
        >
          <CollapsibleLongContent />
        </DocsExample>
        <DocsExample
          file="collapsible/rtl"
          title="Right to left"
          description="Chevrons mirror and nested indents follow the reading direction."
        >
          <CollapsibleRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Enter", "Space"],
              description: "Opens or closes the panel from the trigger.",
            },
            {
              keys: ["Tab"],
              description:
                "Moves focus from the trigger into the open panel. Closed panels are skipped.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The trigger gets <DocsCode>aria-expanded</DocsCode> and{" "}
            <DocsCode>aria-controls</DocsCode> automatically.
          </li>
          <li>
            Icon-only triggers need an <DocsCode>aria-label</DocsCode>.{" "}
            <DocsCode>{"<CollapsibleTriggerIcon />"}</DocsCode> is hidden from
            assistive tech.
          </li>
          <li>
            With reduced motion the panel opens and closes without animating its
            height.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI collapsible. Every part accepts the props of the
          primitive it wraps.
        </DocsParagraph>
        <DocsSection title="Collapsible" level={3}>
          <DocsPropsTable
            props={[
              { name: "open", type: "boolean" },
              { name: "defaultOpen", type: "boolean", default: "false" },
              {
                name: "onOpenChange",
                type: "(open: boolean, details) => void",
              },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="collapsible"',
                description: "Target the root in CSS.",
              },
              { name: "data-open", description: "Present when open." },
              { name: "data-closed", description: "Present when closed." },
            ]}
          />
        </DocsSection>
        <DocsSection title="CollapsibleTrigger" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "render",
                type: renderType,
                default: "<button>",
                description: "Usually a Button.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="collapsible-trigger"',
                description: "Target the trigger in CSS.",
              },
              {
                name: "data-panel-open",
                description:
                  "Present when the panel is open. Style children with group-data-panel-open/collapsible-trigger.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CollapsibleTriggerIcon" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                default: "<IconChevronDown />",
                description: "The default chevron flips when the panel opens.",
              },
              { name: "render", type: renderType, default: "<span>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="collapsible-trigger-icon"',
                description:
                  "Hidden from assistive tech. Nudges down while the trigger is pressed.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CollapsibleContent" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "className",
                type: "string",
                description:
                  "Applied to the inner wrapper, so padding never fights the height animation.",
              },
              {
                name: "hiddenUntilFound",
                type: "boolean",
                default: "true",
                description:
                  "Keeps the closed panel in the DOM so page search can find and open it.",
              },
              {
                name: "keepMounted",
                type: "boolean",
                default: "false",
                description: "Ignored while hiddenUntilFound is on.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="collapsible-content"',
                description: "Target the panel in CSS.",
              },
              { name: "data-open", description: "Present when open." },
              { name: "data-closed", description: "Present when closed." },
              {
                name: "data-starting-style",
                description: "Present while the panel animates in.",
              },
              {
                name: "data-ending-style",
                description: "Present while the panel animates out.",
              },
              {
                name: "--collapsible-panel-height",
                description: "The panel’s measured height.",
              },
              {
                name: "--collapsible-panel-width",
                description: "The panel’s measured width.",
              },
              {
                name: "--collapsible-gap-start",
                description:
                  "The parent’s gap before the panel, collapsed while closed.",
              },
              {
                name: "--collapsible-gap-end",
                description:
                  "The parent’s gap after the panel, collapsed while closed.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
