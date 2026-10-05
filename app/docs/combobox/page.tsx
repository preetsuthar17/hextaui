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
import { ComboboxAsync } from "@/components/examples/combobox/async"
import { ComboboxButtonTrigger } from "@/components/examples/combobox/button-trigger"
import { ComboboxWithClear } from "@/components/examples/combobox/clear"
import { ComboboxControlled } from "@/components/examples/combobox/controlled"
import { ComboboxDemo } from "@/components/examples/combobox/demo"
import { ComboboxGroups } from "@/components/examples/combobox/groups"
import { ComboboxWithIcons } from "@/components/examples/combobox/icons"
import { ComboboxLongContent } from "@/components/examples/combobox/long-content"
import { ComboboxMultiple } from "@/components/examples/combobox/multiple"
import { ComboboxPopupSearch } from "@/components/examples/combobox/popup-search"
import { ComboboxRtl } from "@/components/examples/combobox/rtl"
import { ComboboxInSheet } from "@/components/examples/combobox/sheet"
import { ComboboxStates } from "@/components/examples/combobox/states"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("combobox")

const importCode = `import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"`

const usageCode = `const fruits = ["Apple", "Banana", "Cherry"]

<Combobox items={fruits}>
  <ComboboxInput placeholder="Select a fruit" />
  <ComboboxContent>
    <ComboboxEmpty>No fruit found.</ComboboxEmpty>
    <ComboboxList>
      {(item: string) => (
        <ComboboxItem key={item} value={item}>
          {item}
        </ComboboxItem>
      )}
    </ComboboxList>
  </ComboboxContent>
</Combobox>`

const renderType = "ReactElement | (props, state) => ReactElement"

function slot(name: string, description: string) {
  return { name: `data-slot="${name}"`, description }
}

const inputCompositionCode = `Combobox
├── ComboboxInput
└── ComboboxContent
    ├── ComboboxEmpty
    ├── ComboboxStatus
    └── ComboboxList
        ├── ComboboxItem
        ├── ComboboxGroup
        │   ├── ComboboxLabel
        │   └── ComboboxCollection
        │       └── ComboboxItem
        └── ComboboxSeparator`

const buttonTriggerCompositionCode = `Combobox
├── ComboboxTrigger
│   └── ComboboxValue
└── ComboboxContent
    ├── ComboboxInput
    ├── ComboboxEmpty
    └── ComboboxList
        └── ComboboxItem`

const chipsCompositionCode = `Combobox
├── ComboboxChips
│   └── ComboboxValue
│       ├── ComboboxChip
│       └── ComboboxChipsInput
└── ComboboxContent
    ├── ComboboxEmpty
    └── ComboboxList
        └── ComboboxItem`

export default function Page() {
  return (
    <DocsComponentPage slug="combobox">
      <DocsExample file="combobox/demo">
        <ComboboxDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={["components/ui/combobox.tsx"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Pass the options to <DocsCode>items</DocsCode> and render each one
          with a function inside <DocsCode>{"<ComboboxList />"}</DocsCode>. The
          combobox filters them as you type and only renders the matches.
          Objects work too: their <DocsCode>label</DocsCode> is shown in the
          input and their <DocsCode>value</DocsCode> is submitted.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsSection title="Input" level={3}>
          <DocsParagraph>Type in the field to filter the list.</DocsParagraph>
          <DocsCodeBlock code={inputCompositionCode} lang="text" />
        </DocsSection>
        <DocsSection title="Button trigger" level={3}>
          <DocsParagraph>
            A button shows the value and the search field moves into the popup.
          </DocsParagraph>
          <DocsCodeBlock code={buttonTriggerCompositionCode} lang="text" />
        </DocsSection>
        <DocsSection title="Chips" level={3}>
          <DocsParagraph>
            With <DocsCode>multiple</DocsCode>, each selected item becomes a
            chip before the input.
          </DocsParagraph>
          <DocsCodeBlock code={chipsCompositionCode} lang="text" />
        </DocsSection>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="combobox/clear"
          title="Clear button"
          description={
            <>
              <DocsCode>showClear</DocsCode> adds a clear button that takes the
              chevron’s place while there is a value, so the field never grows.
            </>
          }
        >
          <ComboboxWithClear />
        </DocsExample>
        <DocsExample
          file="combobox/icons"
          title="With icons"
          description={
            <>
              Icons inside an item are sized and muted for you.{" "}
              <DocsCode>autoHighlight</DocsCode> highlights the first match
              while typing, so <DocsCode>Enter</DocsCode> picks it.
            </>
          }
        >
          <ComboboxWithIcons />
        </DocsExample>
        <DocsExample
          file="combobox/groups"
          title="Groups and separators"
          description={
            <>
              Pass groups shaped like <DocsCode>{"{ value, items }"}</DocsCode>{" "}
              and render each with <DocsCode>{"<ComboboxGroup />"}</DocsCode>,{" "}
              <DocsCode>{"<ComboboxLabel />"}</DocsCode> and{" "}
              <DocsCode>{"<ComboboxCollection />"}</DocsCode>. Empty groups hide
              while filtering.
            </>
          }
        >
          <ComboboxGroups />
        </DocsExample>
        <DocsExample
          file="combobox/multiple"
          title="Multiple"
          description={
            <>
              With <DocsCode>multiple</DocsCode>, selections become chips inside{" "}
              <DocsCode>{"<ComboboxChips />"}</DocsCode>. The popup stays open
              while you pick, Backspace in the empty input removes the last
              chip, and the arrow keys move between chips.
            </>
          }
        >
          <ComboboxMultiple />
        </DocsExample>
        <DocsExample
          file="combobox/popup-search"
          title="Search inside the popup"
          description={
            <>
              Use <DocsCode>{"<ComboboxTrigger />"}</DocsCode> for a select-like
              field. Put the input inside{" "}
              <DocsCode>{"<ComboboxContent />"}</DocsCode> and it becomes a
              search box with an icon, and the popup widens to at least 15rem.
            </>
          }
        >
          <ComboboxPopupSearch />
        </DocsExample>
        <DocsExample
          file="combobox/button-trigger"
          title="Trigger rendered as a Button"
          description={
            <>
              Pass <DocsCode>render</DocsCode> to the trigger to use any button.
              The popup anchors to it and keeps at least its width.
            </>
          }
        >
          <ComboboxButtonTrigger />
        </DocsExample>
        <DocsExample
          file="combobox/controlled"
          title="Controlled"
          description={
            <>
              Control the selection with <DocsCode>value</DocsCode> and{" "}
              <DocsCode>onValueChange</DocsCode>, and the popup with{" "}
              <DocsCode>open</DocsCode> and <DocsCode>onOpenChange</DocsCode>.
              Clearing sets the value to <DocsCode>null</DocsCode>.
            </>
          }
        >
          <ComboboxControlled />
        </DocsExample>
        <DocsExample
          file="combobox/states"
          title="Disabled, invalid and disabled items"
          description={
            <>
              <DocsCode>disabled</DocsCode> on the root dims the field and its
              buttons. <DocsCode>aria-invalid</DocsCode> on the input draws the
              error ring. Disabled items are skipped by the arrow keys.
            </>
          }
        >
          <ComboboxStates />
        </DocsExample>
        <DocsExample
          file="combobox/long-content"
          title="Long content and large lists"
          description={
            <>
              Long and unbroken labels wrap instead of widening the popup.{" "}
              <DocsCode>limit</DocsCode> caps how many matches render, which
              keeps a 500 item list fast.
            </>
          }
        >
          <ComboboxLongContent />
        </DocsExample>
        <DocsExample
          file="combobox/async"
          title="Async search"
          description={
            <>
              Turn off built-in filtering with{" "}
              <DocsCode>{"filter={null}"}</DocsCode>, fetch on{" "}
              <DocsCode>onInputValueChange</DocsCode>, and show progress in{" "}
              <DocsCode>{"<ComboboxStatus />"}</DocsCode>, which announces it to
              screen readers. The popup height animates as results change.
            </>
          }
        >
          <ComboboxAsync />
        </DocsExample>
        <DocsExample
          file="combobox/sheet"
          title="Inside a sheet"
          description="The popup layers above the sheet, and Escape closes the popup before the sheet."
        >
          <ComboboxInSheet />
        </DocsExample>
        <DocsExample
          file="combobox/rtl"
          title="Right to left"
          description="The popup picks up the field’s direction, so the clear button, chips and items mirror without extra props."
        >
          <ComboboxRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["↓", "↑"],
              description:
                "Opens the popup and moves the highlight through the matches. Disabled items are skipped.",
            },
            {
              keys: ["Enter"],
              description:
                "Picks the highlighted item. With nothing highlighted it closes the popup and lets the form submit.",
            },
            {
              keys: ["Escape"],
              description:
                "Closes the popup. When it is already closed, clears the value and the input.",
            },
            {
              keys: ["Home", "End"],
              description:
                "Moves the text cursor to the start or end of the input.",
            },
            {
              keys: ["Backspace"],
              description:
                "In an empty chips input, removes the last chip. On a focused chip, removes it.",
            },
            {
              keys: ["←", "→"],
              description:
                "With chips, moves focus between chips and back to the input. Mirrored in right-to-left layouts.",
            },
            {
              keys: ["Tab"],
              description: "Closes the popup and moves focus on.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Give the input a visible <DocsCode>{"<label>"}</DocsCode> through{" "}
            <DocsCode>id</DocsCode> and <DocsCode>htmlFor</DocsCode>, or an{" "}
            <DocsCode>aria-label</DocsCode>. A{" "}
            <DocsCode>{"<ComboboxTrigger />"}</DocsCode> without visible text
            needs an <DocsCode>aria-label</DocsCode> too.
          </li>
          <li>
            The chevron button is labelled “Show options”, the clear button
            “Clear selection” and each chip’s remove button “Remove”.
          </li>
          <li>
            Highlighting moves with <DocsCode>aria-activedescendant</DocsCode>,
            so focus stays in the input while you browse.
          </li>
          <li>
            Inputs use a 16px font on touch screens so iOS doesn’t zoom in, and
            items grow to a 44px tap target.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI combobox. Every part accepts the props of the
          primitive it wraps; the tables list the ones you’ll use most.
        </DocsParagraph>
        <DocsSection title="Combobox" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "items",
                type: "Item[] | Group[]",
                description:
                  "The options. Filtered as you type and passed to the list’s render function.",
              },
              {
                name: "multiple",
                type: "boolean",
                default: "false",
                description: "Select several values, shown as chips.",
              },
              {
                name: "value",
                type: "Value | Value[] | null",
              },
              {
                name: "defaultValue",
                type: "Value | Value[] | null",
              },
              {
                name: "onValueChange",
                type: "(value, details) => void",
              },
              { name: "open", type: "boolean" },
              { name: "defaultOpen", type: "boolean", default: "false" },
              {
                name: "onOpenChange",
                type: "(open: boolean, details) => void",
              },
              { name: "inputValue", type: "string" },
              { name: "defaultInputValue", type: "string" },
              {
                name: "onInputValueChange",
                type: "(inputValue: string, details) => void",
              },
              {
                name: "filter",
                type: "((item, query, itemToString) => boolean) | null",
                description:
                  "Custom matching. null turns filtering off for server-side search.",
              },
              {
                name: "limit",
                type: "number",
                default: "-1",
                description:
                  "Maximum number of matches to render. -1 means all.",
              },
              {
                name: "autoHighlight",
                type: "boolean",
                default: "false",
                description: "Highlight the first match while typing.",
              },
              {
                name: "highlightItemOnHover",
                type: "boolean",
                default: "true",
              },
              {
                name: "openOnInputClick",
                type: "boolean",
                default: "true",
              },
              {
                name: "loopFocus",
                type: "boolean",
                default: "true",
                description:
                  "Wrap the highlight from the last item to the first.",
              },
              {
                name: "itemToStringLabel",
                type: "(item) => string",
                description: "Text shown in the input for an object item.",
              },
              {
                name: "itemToStringValue",
                type: "(item) => string",
                description:
                  "Value submitted with the form for an object item.",
              },
              {
                name: "isItemEqualToValue",
                type: "(item, value) => boolean",
              },
              { name: "name", type: "string" },
              { name: "required", type: "boolean", default: "false" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "readOnly", type: "boolean", default: "false" },
              {
                name: "modal",
                type: "boolean",
                default: "false",
                description: "Lock page scroll and outside clicks while open.",
              },
              {
                name: "virtualized",
                type: "boolean",
                default: "false",
                description: "Set when rendering items with a virtualizer.",
              },
              {
                name: "locale",
                type: "Intl.LocalesArgument",
                description: "Locale used for matching.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ComboboxInput" level={3}>
          <DocsParagraph>
            Outside the popup it renders the full field. Inside{" "}
            <DocsCode>{"<ComboboxContent />"}</DocsCode> it becomes a compact
            search box.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "showTrigger",
                type: "boolean",
                default: "true outside the popup",
                description:
                  "Show the chevron button. Always off inside the popup unless set.",
              },
              {
                name: "showClear",
                type: "boolean",
                default: "false",
                description:
                  "Show a clear button in the chevron’s place while there is a value.",
              },
              {
                name: "className",
                type: "string",
                description: "Applied to the input group around the input.",
              },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "placeholder", type: "string" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              slot("combobox-input-group", "The field around the input."),
              slot("combobox-input", "The text input."),
              slot(
                "combobox-input-actions",
                "Holds the chevron and clear buttons in one stacked cell."
              ),
              {
                name: "data-popup-open",
                description: "Present on the input while the popup is open.",
              },
              {
                name: "data-popup-side",
                description: "The side the popup opened on.",
              },
              {
                name: "data-list-empty",
                description: "Present when nothing matches.",
              },
              { name: "data-disabled", description: "Present when disabled." },
              {
                name: "data-invalid",
                description: "Present when invalid inside a Base UI Field.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ComboboxTrigger" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                description:
                  "Usually a <ComboboxValue />. The chevron is added after it.",
              },
              {
                name: "render",
                type: renderType,
                default: "<button>",
                description: "When set, the built-in field styles are skipped.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              slot("combobox-trigger", "The trigger button."),
              slot("combobox-trigger-value", "Wraps the truncated value."),
              slot("combobox-trigger-icon", "The chevron. Flips while open."),
              {
                name: "data-popup-open",
                description: "Present while the popup is open.",
              },
              {
                name: "data-placeholder",
                description: "Present while no value is selected.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ComboboxValue" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode | (value) => ReactNode",
                description:
                  "Render the selected value yourself, for example as chips.",
              },
              {
                name: "placeholder",
                type: "ReactNode",
                description: "Shown while nothing is selected.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ComboboxContent" level={3}>
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
              { name: "sideOffset", type: "number", default: "6" },
              { name: "alignOffset", type: "number", default: "0" },
              {
                name: "anchor",
                type: "Element | RefObject<Element | null> | VirtualElement | (() => Element | VirtualElement | null) | null",
                description:
                  "Position against another element. Defaults to the field. See useComboboxAnchor.",
              },
              {
                name: "dir",
                type: '"ltr" | "rtl"',
                description: "Defaults to the field’s direction.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              slot("combobox-positioner", "Positions the popup."),
              slot("combobox-content", "The popup surface."),
              slot(
                "combobox-content-sizer",
                "Measured to animate the popup’s height as matches change."
              ),
              { name: "data-open", description: "Present while open." },
              { name: "data-side", description: "The side it opened on." },
              { name: "data-align", description: "Its alignment." },
              {
                name: "data-empty",
                description: "Present when nothing matches.",
              },
              {
                name: "data-starting-style",
                description: "Present while animating in.",
              },
              {
                name: "data-ending-style",
                description: "Present while animating out.",
              },
              {
                name: "--combobox-item-radius",
                description:
                  "Item radius, derived from the popup radius minus its padding.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ComboboxList" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode | (item, index) => ReactNode",
                description: "Called for every match of items.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[slot("combobox-list", "The scrolling list.")]}
          />
        </DocsSection>
        <DocsSection title="ComboboxItem" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "value",
                type: "Item",
                description: "The item this row represents.",
              },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              slot("combobox-item", "An option."),
              slot(
                "combobox-item-indicator",
                "The check, scaled in when selected."
              ),
              {
                name: "data-highlighted",
                description: "Present while highlighted.",
              },
              {
                name: "data-selected",
                description: "Present when selected.",
              },
              { name: "data-disabled", description: "Present when disabled." },
            ]}
          />
        </DocsSection>
        <DocsSection
          title="ComboboxGroup, ComboboxLabel and ComboboxCollection"
          level={3}
        >
          <DocsPropsTable
            props={[
              {
                name: "items",
                type: "Item[]",
                description: "On ComboboxGroup: the group’s own items.",
              },
              {
                name: "children",
                type: "(item, index) => ReactNode",
                description: "On ComboboxCollection: renders each match.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              slot("combobox-group", "A group of items."),
              slot("combobox-label", "The group heading."),
            ]}
          />
        </DocsSection>
        <DocsSection
          title="ComboboxEmpty, ComboboxStatus and ComboboxSeparator"
          level={3}
        >
          <DocsParagraph>
            <DocsCode>{"<ComboboxEmpty />"}</DocsCode> shows its children only
            when nothing matches. <DocsCode>{"<ComboboxStatus />"}</DocsCode> is
            a live region for loading and result messages. Both collapse to
            nothing when empty.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              slot("combobox-empty", "The no-results message."),
              slot("combobox-status", "The live status message."),
              slot("combobox-separator", "A divider between groups."),
            ]}
          />
        </DocsSection>
        <DocsSection title="ComboboxClear" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                default: "<IconX />",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              slot("combobox-clear", "Labelled “Clear selection”."),
              {
                name: "data-visible",
                description: "Present while there is something to clear.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ComboboxChips" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "className",
                type: "string",
                description: "Applied to the field that wraps the chips.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              slot("combobox-chips", "The field that holds chips and input."),
            ]}
          />
        </DocsSection>
        <DocsSection title="ComboboxChip" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "showRemove",
                type: "boolean",
                default: "true",
                description: "Show the remove button.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              slot("combobox-chip", "A selected value."),
              slot("combobox-chip-label", "Its truncated label."),
              slot("combobox-chip-remove", "Labelled “Remove”."),
            ]}
          />
        </DocsSection>
        <DocsSection title="ComboboxChipsInput" level={3}>
          <DocsParagraph>
            The text input that sits after the chips. Accepts the same props as
            the Base UI input.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[slot("combobox-chips-input", "The chips input.")]}
          />
        </DocsSection>
        <DocsSection title="Hooks and helpers" level={3}>
          <DocsList>
            <li>
              <DocsCode>useComboboxAnchor()</DocsCode> returns a ref to pass to
              an element and to <DocsCode>anchor</DocsCode> on the content.
            </li>
            <li>
              <DocsCode>useComboboxFilter()</DocsCode> returns locale-aware{" "}
              <DocsCode>contains</DocsCode>, <DocsCode>startsWith</DocsCode> and{" "}
              <DocsCode>endsWith</DocsCode> matchers for{" "}
              <DocsCode>filter</DocsCode>.
            </li>
            <li>
              <DocsCode>useComboboxFilteredItems()</DocsCode> reads the current
              matches, for counts or virtualized lists.
            </li>
            <li>
              <DocsCode>createComboboxItems(data, {"{ getValue }"})</DocsCode>{" "}
              builds an item collection whose selection value is a primitive id,
              like a database key, instead of the whole object.
            </li>
            <li>
              <DocsCode>comboboxFieldVariants</DocsCode> exposes the field
              styles for building custom fields.
            </li>
          </DocsList>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
