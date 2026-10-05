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
import { DocsAttributesTable } from "@/components/docs/docs-props-table"
import { HotkeyDemo } from "@/components/examples/hotkey/demo"
import { HotkeyListener } from "@/components/examples/hotkey/listener"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("hotkey")

const importCode = `import {
  formatHotkey,
  matchesHotkey,
  parseHotkey,
  useIsApple,
} from "@/lib/hotkey"`

const usageCode = `function SaveShortcut({ onSave }: { onSave: () => void }) {
  const apple = useIsApple()

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (matchesHotkey(event, "mod+s")) {
        event.preventDefault()
        onSave()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onSave])

  return <span>Save {formatHotkey("mod+s", apple)}</span>
}`

const syntaxCode = `"mod+k"            ⌘K on Apple platforms, Ctrl+K elsewhere
"shift+mod+p"      modifiers in any order
"cmd+option+esc"   aliases: cmd, command, option, opt, control, esc, return
"alt+up"           up, down, left and right for the arrow keys
"mod++"            a literal plus key
"g g"              a sequence of two chords, separated by a space`

const parseCode = `parseHotkey("mod+shift+k")  // [["shift", "mod", "k"]]
parseHotkey("cmd+opt+esc")  // [["alt", "meta", "escape"]]
parseHotkey("g i")          // [["g"], ["i"]]`

const formatCode = `formatHotkey("mod+shift+k", true)   // "⇧⌘K"
formatHotkey("mod+shift+k", false)  // "Shift+Ctrl+K"
keyLabel("enter", true)             // "↵"
spokenKey("mod", true)              // "Command"
spokenKey("mod", false)             // "Control"`

export default function Page() {
  return (
    <DocsComponentPage slug="hotkey">
      <DocsExample file="hotkey/demo">
        <HotkeyDemo />
      </DocsExample>

      <DocsInstall dependencies={[]} files={["lib/hotkey.ts"]} />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Write each shortcut once, as a string, and use the same string to
          display it, announce it and match it. <DocsCode>mod</DocsCode> means ⌘
          on Apple platforms and Ctrl everywhere else. That&apos;s almost always
          what you want, since Ctrl+K on a Mac and ⌘K on Windows both feel
          wrong.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Syntax">
        <DocsCodeBlock code={syntaxCode} lang="bash" />
        <DocsParagraph>
          Keys are separated by <DocsCode>+</DocsCode> and are case-insensitive.
          Named keys use the lowercase <DocsCode>KeyboardEvent.key</DocsCode>{" "}
          value, like <DocsCode>enter</DocsCode>, <DocsCode>tab</DocsCode>,{" "}
          <DocsCode>pageup</DocsCode> or <DocsCode>f5</DocsCode>. Use{" "}
          <DocsCode>space</DocsCode> for the space bar.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Parsing">
        <DocsCodeBlock code={parseCode} />
        <DocsParagraph>
          <DocsCode>parseHotkey</DocsCode> returns one array per chord, with
          aliases resolved and modifiers sorted into Apple&apos;s order:
          Control, Option, Shift, Command. Every label built from it reads in
          the order people expect to see it.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Labels">
        <DocsCodeBlock code={formatCode} />
        <DocsParagraph>
          Apple platforms use symbols with no separator, the way menus show
          them. Windows and Linux use words joined by <DocsCode>+</DocsCode>.
          Symbols are hard to read aloud, so <DocsCode>spokenKey</DocsCode>{" "}
          gives the name a screen reader should announce instead.{" "}
          <DocsCode>{"<Kbd keys>"}</DocsCode> shows the symbol and puts the
          spoken name in visually hidden text.
        </DocsParagraph>
        <DocsParagraph>
          <DocsCode>useIsApple()</DocsCode> picks the platform. It returns{" "}
          <DocsCode>true</DocsCode> on the server and during hydration, then the
          real answer, so a Windows visitor briefly sees ⌘ before Ctrl instead
          of getting a hydration error.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Matching">
        <DocsExample
          file="hotkey/listener"
          title="Shortcut listener"
          description={
            <>
              <DocsCode>matchesHotkey</DocsCode> checks a keydown event against
              a hotkey. Modifiers must match exactly, so{" "}
              <DocsCode>mod+b</DocsCode> doesn&apos;t fire for{" "}
              <DocsCode>mod+shift+b</DocsCode>.
            </>
          }
        >
          <HotkeyListener />
        </DocsExample>
        <DocsList>
          <li>
            Letters and digits also match by physical key, so{" "}
            <DocsCode>alt+k</DocsCode> works on a Mac, where Option+K types{" "}
            <DocsCode>˚</DocsCode>.
          </li>
          <li>
            Shifted letters match: <DocsCode>shift+k</DocsCode> matches the{" "}
            <DocsCode>K</DocsCode> that Shift produces.
          </li>
          <li>
            It matches one chord. For sequences like <DocsCode>g i</DocsCode>,
            track the previous chord yourself.
          </li>
          <li>
            Skip shortcuts without modifiers while the focus is in a text field,
            so typing a letter never triggers a command.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsAttributesTable
          label="Export"
          attributes={[
            {
              name: "parseHotkey(hotkey)",
              description:
                "string[][]: one array per chord, with aliases resolved and modifiers sorted.",
            },
            {
              name: "formatHotkey(hotkey, apple)",
              description:
                "The label for one chord, such as ⇧⌘K or Shift+Ctrl+K.",
            },
            {
              name: "keyLabel(key, apple)",
              description: "The visible label for one key name.",
            },
            {
              name: "spokenKey(key, apple)",
              description:
                "The name a screen reader should announce for one key.",
            },
            {
              name: "matchesHotkey(event, hotkey)",
              description:
                "Whether a KeyboardEvent matches one chord, with exact modifiers.",
            },
            {
              name: "isApplePlatform()",
              description: "Reads navigator.platform. true on the server.",
            },
            {
              name: "useIsApple()",
              description: "isApplePlatform as a hydration-safe hook.",
            },
          ]}
        />
        <DocsSection title="Used by" level={3}>
          <DocsParagraph>
            <DocsCode>Kbd</DocsCode> and <DocsCode>Command</DocsCode>.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
