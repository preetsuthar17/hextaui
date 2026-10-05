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
import { TooltipWithArrow } from "@/components/examples/tooltip/arrow"
import { TooltipControlled } from "@/components/examples/tooltip/controlled"
import { TooltipDemo } from "@/components/examples/tooltip/demo"
import { TooltipDetached } from "@/components/examples/tooltip/detached"
import { TooltipDisabled } from "@/components/examples/tooltip/disabled"
import { TooltipLongContent } from "@/components/examples/tooltip/long-content"
import { TooltipRtl } from "@/components/examples/tooltip/rtl"
import { TooltipShortcut } from "@/components/examples/tooltip/shortcut"
import { TooltipSides } from "@/components/examples/tooltip/sides"
import { TooltipToolbar } from "@/components/examples/tooltip/toolbar"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("tooltip")

const importCode = `import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"`

const usageCode = `<Tooltip>
  <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label="Undo" />}>
    <IconArrowBackUp />
  </TooltipTrigger>
  <TooltipContent>Undo</TooltipContent>
</Tooltip>`

const providerCode = `<TooltipProvider>
  <App />
</TooltipProvider>`

const renderType = "ReactElement | (props, state) => ReactElement"
const sideType =
  '"top" | "bottom" | "left" | "right" | "inline-start" | "inline-end"'

const compositionCode = `TooltipProvider
└── Tooltip
    ├── TooltipTrigger
    └── TooltipContent

TooltipGroup
└── TooltipTrigger`

export default function Page() {
  return (
    <DocsComponentPage slug="tooltip">
      <DocsExample file="tooltip/demo">
        <TooltipDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "cn"]}
        files={["components/ui/tooltip.tsx"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          A tooltip opens after a short rest on the trigger, or right away when
          the trigger gets keyboard focus. Once one is showing, its neighbours
          open instantly and without animation, so scanning a toolbar feels like
          reading labels rather than waiting for each one.
        </DocsParagraph>
        <DocsParagraph>
          That instant switching works between tooltips that share a{" "}
          <DocsCode>TooltipProvider</DocsCode>. Wrap your app (or a toolbar) in
          one to share the delay. A tooltip without a provider still works on
          its own with the same defaults.
        </DocsParagraph>
        <DocsCodeBlock code={providerCode} />
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="tooltip/sides"
          title="Sides"
          description={
            <>
              Set <DocsCode>side</DocsCode> on{" "}
              <DocsCode>TooltipContent</DocsCode>. Logical sides follow the
              reading direction, and the tooltip flips when there isn’t room.
            </>
          }
        >
          <TooltipSides />
        </DocsExample>
        <DocsExample
          file="tooltip/arrow"
          title="With an arrow"
          description={
            <>
              <DocsCode>arrow</DocsCode> adds a pointer that stays on the
              trigger even when the tooltip shifts to fit the screen.
            </>
          }
        >
          <TooltipWithArrow />
        </DocsExample>
        <DocsExample
          file="tooltip/shortcut"
          title="Keyboard shortcut"
          description={
            <>
              Put a <DocsCode>Kbd</DocsCode> or <DocsCode>KbdGroup</DocsCode>{" "}
              after the label. It picks up the tooltip’s colors and sits at the
              end, showing ⌘ on Apple devices and Ctrl elsewhere.
            </>
          }
        >
          <TooltipShortcut />
        </DocsExample>
        <DocsExample
          file="tooltip/toolbar"
          title="Toolbar"
          description={
            <>
              Rest on one button, then slide along the group. Tooltips under one{" "}
              <DocsCode>TooltipProvider</DocsCode> swap instantly while you move
              between them.
            </>
          }
        >
          <TooltipToolbar />
        </DocsExample>
        <DocsExample
          file="tooltip/disabled"
          title="Disabled"
          description={
            <>
              A disabled button can still explain why with{" "}
              <DocsCode>focusableWhenDisabled</DocsCode>, which keeps it
              hoverable and in the tab order. <DocsCode>disabled</DocsCode> on{" "}
              <DocsCode>Tooltip</DocsCode> turns the tooltip off.
            </>
          }
        >
          <TooltipDisabled />
        </DocsExample>
        <DocsExample
          file="tooltip/long-content"
          title="Long content"
          description="Text wraps at a comfortable width and never runs past the screen edge, even long URLs."
        >
          <TooltipLongContent />
        </DocsExample>
        <DocsExample
          file="tooltip/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>open</DocsCode> and{" "}
              <DocsCode>onOpenChange</DocsCode> to drive the tooltip yourself.
              The reason tells you what opened or closed it.
            </>
          }
        >
          <TooltipControlled />
        </DocsExample>
        <DocsExample
          file="tooltip/detached"
          title="One tooltip, many triggers"
          description={
            <>
              Create a handle with <DocsCode>createTooltipHandle</DocsCode> and
              pass a <DocsCode>payload</DocsCode> from each trigger to share a
              single tooltip.
            </>
          }
        >
          <TooltipDetached />
        </DocsExample>
        <DocsExample
          file="tooltip/rtl"
          title="Right to left"
          description={
            <>
              Inside <DocsCode>{'dir="rtl"'}</DocsCode>,{" "}
              <DocsCode>inline-end</DocsCode> opens on the left and the shortcut
              moves to the other end.
            </>
          }
        >
          <TooltipRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Focusing the trigger from the keyboard opens its tooltip right away.",
            },
            {
              keys: ["Esc"],
              description: "Closes the tooltip and keeps focus on the trigger.",
            },
            {
              keys: ["Enter", "Space"],
              description:
                "Activates the trigger and closes the tooltip, so it doesn’t cover what happens next.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            A tooltip is a visual hint, not a label. Give icon-only triggers an{" "}
            <DocsCode>aria-label</DocsCode> that matches the tooltip text.
          </li>
          <li>
            Nothing opens on touch, and a tap only does what the trigger does.
            Don’t put anything in a tooltip that people need; use a popover for
            that.
          </li>
          <li>
            Pointer users can move onto the tooltip to read or select it without
            it closing.
          </li>
          <li>With reduced motion on, the tooltip fades without scaling.</li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI tooltip. Every part accepts the props of the
          primitive it wraps.
        </DocsParagraph>
        <DocsSection title="TooltipProvider" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "delay",
                type: "number",
                default: "300",
                description:
                  "Milliseconds to rest on a trigger before opening.",
              },
              {
                name: "closeDelay",
                type: "number",
                default: "0",
                description: "Milliseconds before closing after leaving.",
              },
              {
                name: "timeout",
                type: "number",
                default: "400",
                description:
                  "How long after one closes that the next opens instantly.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="Tooltip" level={3}>
          <DocsPropsTable
            props={[
              { name: "open", type: "boolean" },
              { name: "defaultOpen", type: "boolean", default: "false" },
              { name: "onOpenChange", type: "(open, details) => void" },
              {
                name: "onOpenChangeComplete",
                type: "(open) => void",
                description: "Called after the open or close animation.",
              },
              {
                name: "disabled",
                type: "boolean",
                default: "false",
                description: "Turns the tooltip off.",
              },
              {
                name: "disableHoverablePopup",
                type: "boolean",
                default: "false",
                description: "Close as soon as the pointer leaves the trigger.",
              },
              {
                name: "trackCursorAxis",
                type: '"none" | "x" | "y" | "both"',
                default: '"none"',
              },
              {
                name: "handle",
                type: "TooltipHandle<Payload>",
                description: "From createTooltipHandle.",
              },
              {
                name: "children",
                type: "ReactNode | ({ payload }) => ReactNode",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TooltipTrigger" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "delay",
                type: "number",
                description: "Overrides the provider delay for this trigger.",
              },
              { name: "closeDelay", type: "number" },
              {
                name: "closeOnClick",
                type: "boolean",
                default: "true",
              },
              {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                  "Stops this trigger opening the tooltip. The element stays enabled.",
              },
              { name: "handle", type: "TooltipHandle<Payload>" },
              { name: "payload", type: "Payload" },
              { name: "render", type: renderType, default: "<button>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="tooltip-trigger"',
                description: "The trigger.",
              },
              {
                name: "data-popup-open",
                description: "Present while its tooltip is open.",
              },
              {
                name: "data-trigger-disabled",
                description: "Present when the trigger can’t open the tooltip.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TooltipContent" level={3}>
          <DocsPropsTable
            props={[
              { name: "side", type: sideType, default: '"top"' },
              {
                name: "align",
                type: '"start" | "center" | "end"',
                default: '"center"',
              },
              {
                name: "sideOffset",
                type: "number | (data) => number",
                default: "6, or 8 with arrow",
              },
              { name: "alignOffset", type: "number", default: "0" },
              { name: "arrow", type: "boolean", default: "false" },
              { name: "collisionPadding", type: "number", default: "8" },
              { name: "arrowPadding", type: "number", default: "8" },
              {
                name: "portalProps",
                type: "TooltipPortal props",
                description: "Such as container or keepMounted.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="tooltip-content"',
                description: "The popup.",
              },
              {
                name: 'data-slot="tooltip-positioner"',
                description: "The positioning wrapper around the popup.",
              },
              {
                name: "data-side",
                description: "The side it opened on after flipping.",
              },
              { name: "data-align", description: "The alignment." },
              {
                name: "data-instant",
                description:
                  '"delay", "focus" or "dismiss" when it opens or closes without animation.',
              },
              {
                name: "data-starting-style",
                description: "Present while it animates in.",
              },
              {
                name: "data-ending-style",
                description: "Present while it animates out.",
              },
              {
                name: "--available-width",
                description: "Room between the trigger and the screen edge.",
              },
              {
                name: "--transform-origin",
                description: "The point the tooltip scales from.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TooltipArrow" level={3}>
          <DocsParagraph>
            Rendered for you by <DocsCode>arrow</DocsCode>. Use it directly only
            when composing your own content part.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="tooltip-arrow"',
                description: "The arrow.",
              },
              {
                name: "data-uncentered",
                description:
                  "Present when it can’t point at the trigger’s center.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
