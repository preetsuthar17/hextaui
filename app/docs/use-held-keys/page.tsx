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
import { UseHeldKeysDemo } from "@/components/examples/use-held-keys/demo"
import { UseHeldKeysShortcut } from "@/components/examples/use-held-keys/shortcut"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("use-held-keys")

const importCode = `import { useHeldKeys } from "@/hooks/use-held-keys"`

const usageCode = `const held = useHeldKeys(true)
const showShortcutHints = held.has("meta") || held.has("ctrl")`

const namesCode = `"meta" "ctrl" "alt" "shift"     modifiers, left and right alike
"a" … "z"  "0" … "9"            letters and digits, by physical key
"space" "enter" "escape" "tab"   named keys, lowercased
"arrowup" "arrowdown" "f1" …`

export default function Page() {
  return (
    <DocsComponentPage slug="use-held-keys">
      <DocsExample file="use-held-keys/demo">
        <UseHeldKeysDemo />
      </DocsExample>

      <DocsInstall dependencies={[]} files={["hooks/use-held-keys.ts"]} />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Use it for anything that reacts to keys being held rather than
          pressed: keycaps that press down, shortcut hints that appear while you
          hold ⌘, or a modifier that switches a tool, like Alt to duplicate
          while dragging.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="How it works">
        <DocsParagraph>
          Every component that calls the hook shares one store. The first
          subscriber adds passive <DocsCode>keydown</DocsCode> and{" "}
          <DocsCode>keyup</DocsCode> listeners to <DocsCode>window</DocsCode>,
          and the last one to unsubscribe removes them. A page with fifty
          listening keycaps still has one pair of listeners.
        </DocsParagraph>
        <DocsParagraph>
          The listeners only read events. They never call{" "}
          <DocsCode>preventDefault</DocsCode>, and they sit on{" "}
          <DocsCode>window</DocsCode>, after React&apos;s own handlers, so
          typing in a field is never delayed or changed.
        </DocsParagraph>
        <DocsCodeBlock code={namesCode} lang="bash" />
        <DocsList>
          <li>
            Letters and digits come from <DocsCode>event.code</DocsCode>, the
            physical key, so holding Option+K on a Mac still reports{" "}
            <DocsCode>k</DocsCode> rather than <DocsCode>˚</DocsCode>.
          </li>
          <li>
            Key repeat is ignored, and nothing re-renders while a key is held.
          </li>
          <li>
            macOS doesn&apos;t send <DocsCode>keyup</DocsCode> for other keys
            while ⌘ is down. When ⌘ is released, the store keeps only the
            modifiers still held, so letters can&apos;t get stuck.
          </li>
          <li>
            Everything is released when the window loses focus or the tab is
            hidden. A shortcut that switches apps leaves nothing held.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="use-held-keys/shortcut"
          title="Keycaps that press"
          description={
            <>
              <DocsCode>{"<Kbd listen>"}</DocsCode> is built on this hook. Each
              keycap presses down while its key is held.
            </>
          }
        >
          <UseHeldKeysShortcut />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Good to know">
        <DocsList>
          <li>
            Pass <DocsCode>false</DocsCode> to stop listening. The hook then
            returns an empty set and adds no listeners, so it&apos;s cheap to
            call it unconditionally.
          </li>
          <li>
            The set is replaced only when a key goes down or up, so its identity
            works as a memo or effect dependency.
          </li>
          <li>
            For shortcuts that fire an action, use{" "}
            <DocsCode>matchesHotkey</DocsCode> from <DocsCode>Hotkey</DocsCode>{" "}
            in a keydown handler instead. Holding keys is for showing state, not
            for running commands.
          </li>
          <li>On the server, and before hydration, the set is empty.</li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="useHeldKeys(enabled)" id="parameters" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "enabled",
                type: "boolean",
                description:
                  "Whether to listen. When false, nothing is attached.",
              },
            ]}
          />
          <DocsAttributesTable
            label="Returns"
            attributes={[
              {
                name: "ReadonlySet<string>",
                description: "The names of the keys held down right now.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="Used by" level={3}>
          <DocsParagraph>
            <DocsCode>Kbd</DocsCode> and <DocsCode>KbdGroup</DocsCode> through
            their <DocsCode>listen</DocsCode> prop.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
