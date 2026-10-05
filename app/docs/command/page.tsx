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
import { CommandAsync } from "@/components/examples/command/async"
import { CommandBasic } from "@/components/examples/command/basic"
import { CommandDemo } from "@/components/examples/command/demo"
import { CommandDialogDemo } from "@/components/examples/command/dialog"
import { CommandLongContent } from "@/components/examples/command/long-content"
import { CommandPages } from "@/components/examples/command/pages"
import { CommandRtl } from "@/components/examples/command/rtl"
import { CommandScrollable } from "@/components/examples/command/scrollable"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("command")

const importCode = `import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"`

const usageCode = `<Command>
  <CommandInput placeholder="Type a command or search…" />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem onSelect={() => openCalendar()}>Calendar</CommandItem>
      <CommandItem shortcut="mod+p">Profile</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`

const hotkeyCode = `const [open, setOpen] = React.useState(false)

useCommandHotkey("mod+k", () => setOpen((value) => !value))`

const compositionCode = `Command
├── CommandInput
├── CommandList
│   ├── CommandEmpty
│   ├── CommandLoading
│   ├── CommandGroup
│   │   └── CommandItem
│   │       └── CommandShortcut
│   ├── CommandSeparator
│   └── CommandPage
│       └── CommandGroup
└── CommandFooter

CommandDialog
└── Command`

export default function Page() {
  return (
    <DocsComponentPage slug="command">
      <DocsExample file="command/demo">
        <CommandDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cmdk",
          "cn",
        ]}
        files={[
          "components/ui/command.tsx",
          "components/ui/button.tsx",
          "lib/motion.ts",
        ]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Hotkeys use <DocsCode>mod</DocsCode> for ⌘ on Apple devices and Ctrl
          everywhere else. Labels are formatted per platform for you.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="command/basic"
          title="Basic"
          description="Typing filters and ranks items as you go. Groups with no matches disappear, and the list height animates to fit what is left."
        >
          <CommandBasic />
        </DocsExample>
        <DocsExample
          file="command/dialog"
          title="Dialog"
          description={
            <>
              Put a <DocsCode>{"<Command />"}</DocsCode> inside{" "}
              <DocsCode>{"<CommandDialog />"}</DocsCode> and toggle it with{" "}
              <DocsCode>useCommandHotkey</DocsCode>. Press ⌘K or Ctrl K. Item
              shortcuts run while it is open, matches are highlighted, and{" "}
              <DocsCode>preserveSearch</DocsCode> keeps the query and selection
              for the next time it opens.
            </>
          }
        >
          <CommandDialogDemo />
        </DocsExample>
        <DocsExample
          file="command/pages"
          title="Pages"
          description={
            <>
              An item with <DocsCode>page</DocsCode> opens the matching{" "}
              <DocsCode>{"<CommandPage />"}</DocsCode>. The page title appears
              as a chip in the input, the list slides in from the side, and
              Backspace on an empty search or Escape goes back.
            </>
          }
        >
          <CommandPages />
        </DocsExample>
        <DocsExample
          file="command/scrollable"
          title="Scrollable"
          description="Long lists scroll inside a capped height. The selected item is always kept in view while you move with the keyboard."
        >
          <CommandScrollable />
        </DocsExample>
        <DocsExample
          file="command/async"
          title="Async results"
          description={
            <>
              Set <DocsCode>{"shouldFilter={false}"}</DocsCode> and render the
              results you fetch. <DocsCode>{"<CommandLoading />"}</DocsCode>{" "}
              waits 150 ms before it appears and then stays at least 300 ms, so
              fast responses never flash a spinner. Try both latencies.
            </>
          }
        >
          <CommandAsync />
        </DocsExample>
        <DocsExample
          file="command/long-content"
          title="Long content"
          description="Headings wrap, long names truncate or wrap as you choose, and shortcuts never get pushed out."
        >
          <CommandLongContent />
        </DocsExample>
        <DocsExample
          file="command/rtl"
          title="Right to left"
          description="Icons, shortcuts, the page chip and the page slide all follow the reading direction."
        >
          <CommandRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            { keys: ["↓"], description: "Selects the next item." },
            { keys: ["↑"], description: "Selects the previous item." },
            {
              keys: ["Alt", "↓"],
              description: "Jumps to the first item of the next group.",
            },
            {
              keys: ["Alt", "↑"],
              description: "Jumps to the first item of the previous group.",
            },
            {
              keys: ["Home"],
              description: "Selects the first item.",
            },
            {
              keys: ["End"],
              description: "Selects the last item.",
            },
            {
              keys: ["Ctrl", "N"],
              description:
                "Selects the next item. Ctrl J works too. Turn off with vimBindings.",
            },
            {
              keys: ["Ctrl", "P"],
              description:
                "Selects the previous item. Ctrl K works too. Turn off with vimBindings.",
            },
            {
              keys: ["Enter"],
              description:
                "Runs the selected item. On a link item, ⌘ Enter or Ctrl Enter opens it in a new tab.",
            },
            {
              keys: ["Esc"],
              description:
                "Clears the search first, then goes back one page, then closes the dialog.",
            },
            {
              keys: ["Backspace"],
              description: "Goes back one page when the search is empty.",
            },
            {
              keys: ["⌘", "P"],
              description:
                "Any item shortcut runs its item while focus is inside the command menu.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The input is a combobox that points at the selected item, so screen
            readers announce each item as you move.
          </li>
          <li>
            A polite live region announces the number of results shortly after
            you stop typing, and announces the page title when you open or leave
            a page. Change the wording with <DocsCode>formatResults</DocsCode>{" "}
            and <DocsCode>rootTitle</DocsCode>.
          </li>
          <li>
            <DocsCode>{"<CommandDialog />"}</DocsCode> has a hidden title and
            description, traps focus while open and returns it to the trigger
            when it closes.
          </li>
          <li>
            Item shortcuts are exposed with{" "}
            <DocsCode>aria-keyshortcuts</DocsCode>.
          </li>
          <li>
            With reduced motion on, items run without the confirm blink and
            pages fade instead of sliding.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on <DocsCode>cmdk</DocsCode>, with{" "}
          <DocsCode>{"<CommandDialog />"}</DocsCode> on the Base UI dialog.
          Parts accept the props of the cmdk part they wrap.
        </DocsParagraph>
        <DocsSection title="Command" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "label",
                type: "string",
                default: '"Command menu"',
                description: "Accessible name of the menu.",
              },
              {
                name: "highlight",
                type: "boolean",
                default: "false",
                description:
                  "Highlights the matched letters in each item and dims the rest.",
              },
              {
                name: "shouldFilter",
                type: "boolean",
                default: "true",
                description:
                  "Set to false to filter and sort the items yourself, for example when results come from a server.",
              },
              {
                name: "filter",
                type: "(value: string, search: string, keywords?: string[]) => number",
                description:
                  "Returns a score from 0 (hidden) to 1 (best match).",
              },
              {
                name: "value",
                type: "string",
                description: "The selected item’s value.",
              },
              { name: "defaultValue", type: "string" },
              { name: "onValueChange", type: "(value: string) => void" },
              {
                name: "loop",
                type: "boolean",
                default: "false",
                description: "Wrap around at the ends of the list.",
              },
              {
                name: "vimBindings",
                type: "boolean",
                default: "true",
                description: "Ctrl N, J, P and K navigation.",
              },
              {
                name: "disablePointerSelection",
                type: "boolean",
                default: "false",
              },
              {
                name: "formatResults",
                type: "(count: number) => string",
                default: '"3 results"',
                description: "Text announced to screen readers after typing.",
              },
              {
                name: "rootTitle",
                type: "string",
                default: '"All commands"',
                description:
                  "Announced when you leave the last page and return to the root.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="command"',
                description: "Target the root in CSS.",
              },
              {
                name: "data-highlighting",
                description:
                  "Present while highlight is on and the search is not empty.",
              },
              {
                name: "--command-radius",
                description:
                  "Outer radius. Items derive a concentric radius from it.",
              },
              {
                name: "--command-inset",
                description: "Padding between the list edge and its items.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CommandDialog" level={3}>
          <DocsPropsTable
            props={[
              { name: "open", type: "boolean" },
              { name: "defaultOpen", type: "boolean", default: "false" },
              {
                name: "onOpenChange",
                type: "(open: boolean, details) => void",
              },
              {
                name: "preserveSearch",
                type: "boolean",
                default: "false",
                description:
                  "Keep the dialog mounted so the query, page and selection survive closing. The query is selected when it reopens.",
              },
              {
                name: "title",
                type: "string",
                default: '"Command menu"',
                description: "Visually hidden dialog title.",
              },
              {
                name: "description",
                type: "string",
                default: '"Search for a command to run."',
                description: "Visually hidden dialog description.",
              },
              {
                name: "showCloseButton",
                type: "boolean",
                default: "false",
              },
              {
                name: "className",
                type: "string",
                description: "Applied to the dialog popup.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="command-dialog"',
                description: "The dialog popup.",
              },
              {
                name: 'data-slot="command-dialog-overlay"',
                description: "The backdrop.",
              },
              {
                name: "data-open",
                description: "Present on the popup while it is open.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CommandInput" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "value",
                type: "string",
                description: "Controlled search text.",
              },
              { name: "onValueChange", type: "(search: string) => void" },
              { name: "placeholder", type: "string" },
              {
                name: "clearLabel",
                type: "string",
                default: '"Clear search"',
                description: "Accessible name of the clear button.",
              },
              {
                name: "backLabel",
                type: "(title: string) => string",
                default: "(title) => `Back from ${title}`",
                description: "Accessible name of the page chip.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              { name: 'data-slot="command-input"', description: "The input." },
              {
                name: 'data-slot="command-input-wrapper"',
                description:
                  "The row holding the icon, input and clear button.",
              },
              {
                name: 'data-slot="command-clear"',
                description: "The clear button, shown once you type.",
              },
              {
                name: 'data-slot="command-page-chip"',
                description: "The back chip shown on a page.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CommandList" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "label",
                type: "string",
                description: "Accessible name of the list.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              { name: 'data-slot="command-list"', description: "The list." },
              {
                name: "data-settled",
                description:
                  "Present once the list has measured itself. The height transition only runs while it is set.",
              },
              {
                name: "--cmdk-list-height",
                description:
                  "Height of the visible items, used to animate the list.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CommandEmpty" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode | (search: string) => ReactNode",
                description: "Use the function form to echo the query.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="command-empty"',
                description: "Hidden while a CommandLoading is in the list.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CommandLoading" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "loading",
                type: "boolean",
                default: "true",
              },
              {
                name: "delay",
                type: "number",
                default: "150",
                description: "Milliseconds to wait before the spinner shows.",
              },
              {
                name: "minDuration",
                type: "number",
                default: "300",
                description:
                  "Minimum milliseconds the spinner stays once shown.",
              },
              {
                name: "label",
                type: "string",
                description: "Accessible label. Defaults to string children.",
              },
              { name: "progress", type: "number" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="command-loading"',
                description: "The loading row.",
              },
              {
                name: "data-pending",
                description:
                  "Present during the delay, while the row is announced but not yet visible.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CommandGroup" level={3}>
          <DocsPropsTable
            props={[
              { name: "heading", type: "ReactNode" },
              {
                name: "value",
                type: "string",
                description: "Required when there is no heading.",
              },
              {
                name: "forceMount",
                type: "boolean",
                default: "false",
                description: "Keep the group visible while filtering.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              { name: 'data-slot="command-group"', description: "The group." },
              {
                name: "[cmdk-group-heading]",
                description: "The heading element.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CommandItem" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "onSelect",
                type: "(value: string) => void",
                description:
                  "Runs on click, Enter or the item’s shortcut, after the confirm blink.",
              },
              {
                name: "value",
                type: "string",
                description:
                  "Used for filtering. Defaults to the item’s text, without the shortcut.",
              },
              {
                name: "keywords",
                type: "string[]",
                description: "Extra words that match this item.",
              },
              { name: "disabled", type: "boolean", default: "false" },
              {
                name: "shortcut",
                type: "string",
                description:
                  'A hotkey like "mod+shift+c". Shown on the item and runs it while focus is in the menu.',
              },
              {
                name: "page",
                type: "string",
                description:
                  "Opens the CommandPage with this id instead of running.",
              },
              {
                name: "pageTitle",
                type: "string",
                description:
                  "Title shown in the page chip. Defaults to the value.",
              },
              {
                name: "href",
                type: "string",
                description:
                  "Renders the item as a link. Enter follows it, ⌘ or Ctrl Enter opens a new tab.",
              },
              {
                name: "render",
                type: "ReactElement",
                description:
                  "A link element to render instead, like Next.js <Link />.",
              },
              {
                name: "confirm",
                type: "boolean",
                default: "true",
                description:
                  "Blink the item briefly before running it, so the choice registers.",
              },
              {
                name: "forceMount",
                type: "boolean",
                default: "false",
                description: "Keep the item visible while filtering.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              { name: 'data-slot="command-item"', description: "The item." },
              {
                name: 'data-selected="true"',
                description: "Present on the selected item.",
              },
              {
                name: 'data-disabled="true"',
                description: "Present on disabled items.",
              },
              {
                name: "data-value",
                description: "The value used for filtering.",
              },
              {
                name: "data-confirming",
                description: "Present during the confirm blink.",
              },
              {
                name: "data-page",
                description: "Present on items that open a page.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CommandPage" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "id",
                type: "string",
                description:
                  "Matches the page prop of the item that opens it. Its groups and items only render while it is the current page.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CommandShortcut" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "hotkey",
                type: "string",
                description:
                  'Formats a hotkey like "mod+k" for the current platform. Children override it.',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="command-shortcut"',
                description: "The shortcut label.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CommandSeparator" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "alwaysRender",
                type: "boolean",
                default: "false",
                description: "Keep it visible while searching.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="command-separator"',
                description: "The separator.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CommandFooter" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                description:
                  "Defaults to key hints that update on a page. Hidden on touch screens.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="command-footer"',
                description: "The footer.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="useCommandHotkey" level={3}>
          <DocsCodeBlock code={hotkeyCode} />
          <DocsPropsTable
            props={[
              {
                name: "hotkey",
                type: "string",
                description:
                  "Listened for on the whole document. Hotkeys without a modifier are ignored while typing in a field.",
              },
              { name: "callback", type: "(event: KeyboardEvent) => void" },
              {
                name: "options.enabled",
                type: "boolean",
                default: "true",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="useCommandLoading" level={3}>
          <DocsParagraph>
            Returns whether a loading indicator should be visible, with the same
            delay and minimum duration as{" "}
            <DocsCode>{"<CommandLoading />"}</DocsCode>. Use it to hide stale
            results while a request is in flight.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              { name: "loading", type: "boolean" },
              { name: "options.delay", type: "number", default: "150" },
              { name: "options.minDuration", type: "number", default: "300" },
            ]}
          />
        </DocsSection>
        <DocsSection title="Other hooks" level={3}>
          <DocsList>
            <li>
              <DocsCode>useCommandPages()</DocsCode> returns{" "}
              <DocsCode>{"{ pages, page, push, pop, reset }"}</DocsCode> to
              drive pages from your own code.
            </li>
            <li>
              <DocsCode>useCommandState(selector)</DocsCode> reads cmdk state,
              such as the search or the filtered count.
            </li>
            <li>
              <DocsCode>useHotkeyLabel(hotkey)</DocsCode> formats a hotkey for
              the current platform, like ⌘K or Ctrl+K.
            </li>
          </DocsList>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
