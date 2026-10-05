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
import { KbdButton } from "@/components/examples/kbd/button"
import { KbdComposed } from "@/components/examples/kbd/composed"
import { KbdDemo } from "@/components/examples/kbd/demo"
import { KbdListen } from "@/components/examples/kbd/listen"
import { KbdRtl } from "@/components/examples/kbd/rtl"
import { KbdShortcuts } from "@/components/examples/kbd/shortcuts"
import { KbdSizes } from "@/components/examples/kbd/sizes"
import { KbdVariants } from "@/components/examples/kbd/variants"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("kbd")

const importCode = `import { Kbd, KbdGroup } from "@/components/ui/kbd"`

const usageCode = `<KbdGroup keys="mod+k" />
<Kbd keys="escape" />
<Kbd>K</Kbd>`

const renderType = "ReactElement | (props, state) => ReactElement"

const keysDescription =
  'Keys joined with +, like "mod+shift+p". mod is ⌘ on Apple devices and Ctrl elsewhere. Names such as alt, enter, escape, up and space become symbols or short words, and get a spoken name for screen readers.'

const compositionCode = `Kbd

KbdGroup
└── Kbd`

export default function Page() {
  return (
    <DocsComponentPage slug="kbd">
      <DocsExample file="kbd/demo">
        <KbdDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "class-variance-authority", "cn"]}
        files={["components/ui/kbd.tsx", "lib/hotkey.ts"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Write shortcuts once with <DocsCode>keys</DocsCode> and they show as
          ⌘K on a Mac and Ctrl K on Windows and Linux. Or pass any content as
          children for full control.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="kbd/variants"
          title="Variants"
          description={
            <>
              <DocsCode>keycap</DocsCode> has a hairline edge and a 1px lip so
              it reads as a physical key. <DocsCode>flat</DocsCode> is a quiet
              fill for dense places like menus.
            </>
          }
        >
          <KbdVariants />
        </DocsExample>
        <DocsExample
          file="kbd/sizes"
          title="Sizes"
          description={
            <>
              <DocsCode>sm</DocsCode> sits in small text,{" "}
              <DocsCode>default</DocsCode> next to body text and{" "}
              <DocsCode>lg</DocsCode> in headings or on its own.
            </>
          }
        >
          <KbdSizes />
        </DocsExample>
        <DocsExample
          file="kbd/shortcuts"
          title="Shortcuts"
          description={
            <>
              <DocsCode>{"<KbdGroup />"}</DocsCode> splits a combo into one cap
              per key. A space starts a sequence, joined by{" "}
              <DocsCode>separator</DocsCode>. <DocsCode>{"<Kbd />"}</DocsCode>{" "}
              with <DocsCode>keys</DocsCode> keeps the whole combo in one cap.
            </>
          }
        >
          <KbdShortcuts />
        </DocsExample>
        <DocsExample
          file="kbd/listen"
          title="Live keys"
          description={
            <>
              With <DocsCode>listen</DocsCode>, a cap presses down while its
              real key is held. It only watches, so it never blocks, delays or
              changes what you type. Letters match by physical key, so Option
              and Shift don&apos;t confuse them.
            </>
          }
        >
          <KbdListen />
        </DocsExample>
        <DocsExample
          file="kbd/button"
          title="In a button"
          description="Inside a button, the cap takes its colors from the button's text, so it fits every variant."
        >
          <KbdButton />
        </DocsExample>
        <DocsExample
          file="kbd/composed"
          title="Icons and actions"
          description="Put icons in a cap for actions without a key name, and give them a visually hidden label."
        >
          <KbdComposed />
        </DocsExample>
        <DocsExample
          file="kbd/rtl"
          title="Right to left"
          description="Shortcuts stay in left-to-right order inside right-to-left text, the way they're printed on the keyboard."
        >
          <KbdRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Symbols like ⌘ and ⇧ are hidden from screen readers and replaced
            with their names, so <DocsCode>{'keys="mod+shift+p"'}</DocsCode> is
            read as &quot;Command Shift P&quot;.
          </li>
          <li>
            Caps render as <DocsCode>{"<kbd>"}</DocsCode>, and a group nests
            them in another <DocsCode>{"<kbd>"}</DocsCode>, which is how HTML
            marks a key combination.
          </li>
          <li>
            Showing a shortcut doesn&apos;t bind it. Register the key handler
            yourself.
          </li>
          <li>
            The press effect is decoration, with a color change in place of
            movement when reduced motion is on. Before hydration, every platform
            sees the Apple symbols.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Both parts render a <DocsCode>{"<kbd>"}</DocsCode> and accept{" "}
          <DocsCode>render</DocsCode> and its attributes.
        </DocsParagraph>
        <DocsSection title="Kbd" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "keys",
                type: "string",
                description: keysDescription,
              },
              {
                name: "variant",
                type: '"keycap" | "flat"',
                default: '"keycap"',
                description: "Inherited from KbdGroup when unset.",
              },
              {
                name: "size",
                type: '"sm" | "default" | "lg"',
                default: '"default"',
                description: "Inherited from KbdGroup when unset.",
              },
              {
                name: "listen",
                type: "boolean",
                default: "false",
                description:
                  "Press the cap while its real key is held. Works with keys or a plain key name as children.",
              },
              { name: "render", type: renderType, default: "<kbd>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              { name: 'data-slot="kbd"', description: "Target caps in CSS." },
              { name: "data-variant", description: "The current variant." },
              { name: "data-size", description: "The current size." },
              {
                name: "data-pressed",
                description: "Present while the real key is held.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="KbdGroup" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "keys",
                type: "string",
                description: `${keysDescription} Spaces separate the steps of a sequence.`,
              },
              {
                name: "separator",
                type: "ReactNode",
                default: '"then"',
                description: "Shown between the steps of a sequence.",
              },
              {
                name: "variant",
                type: '"keycap" | "flat"',
                description: "Passed to every cap inside.",
              },
              {
                name: "size",
                type: '"sm" | "default" | "lg"',
                description: "Passed to every cap inside.",
              },
              {
                name: "listen",
                type: "boolean",
                description: "Passed to every cap inside.",
              },
              { name: "render", type: renderType, default: "<kbd>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="kbd-group"',
                description: "Target groups in CSS.",
              },
              {
                name: 'data-slot="kbd-separator"',
                description: "The text between sequence steps.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
