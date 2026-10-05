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
import { UseInvalidShakeDemo } from "@/components/examples/use-invalid-shake/demo"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("use-invalid-shake")

const importCode = `import { useInvalidShake } from "@/hooks/use-invalid-shake"`

const usageCode = `const ref = React.useRef<HTMLSelectElement>(null)
useInvalidShake(ref)

<form>
  <select
    ref={ref}
    required
    className="data-shake:motion-safe:animate-button-shake"
  >
    …
  </select>
  <button type="submit">Continue</button>
</form>`

export default function Page() {
  return (
    <DocsComponentPage slug="use-invalid-shake">
      <DocsExample file="use-invalid-shake/demo">
        <UseInvalidShakeDemo />
      </DocsExample>

      <DocsInstall dependencies={[]} files={["hooks/use-invalid-shake.ts"]} />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          The hook only sets a <DocsCode>data-shake</DocsCode> attribute. The
          motion comes from the theme&apos;s{" "}
          <DocsCode>animate-button-shake</DocsCode>, which you attach with{" "}
          <DocsCode>data-shake:motion-safe:animate-button-shake</DocsCode>.
          HextaUI&apos;s Input, Textarea, Native select and Input group already
          include that class and call the hook. Use it directly for your own
          controls.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="When it shakes">
        <DocsParagraph>
          A shake answers one question: why didn&apos;t my submit work? So the
          hook only shakes right after someone tries to submit, and never while
          they&apos;re still filling in the form.
        </DocsParagraph>
        <DocsAttributesTable
          label="Event"
          attributes={[
            {
              name: "Submit attempt",
              description:
                "Clicking a submit button, pressing Enter in an input of the form, or the form's submit event.",
            },
            {
              name: "Invalid within 600ms",
              description:
                'The control fires invalid, or has aria-invalid="true", data-invalid or :user-invalid. That covers native validation, Base UI fields and server errors set right after submitting.',
            },
            {
              name: "Shake",
              description:
                "data-shake is set for 400ms. It shakes once per attempt, however many of those signals arrive.",
            },
          ]}
        />
        <DocsList>
          <li>
            Inside an <DocsCode>InputGroup</DocsCode>, the whole group shakes,
            not just the inner control.
          </li>
          <li>
            Under reduced motion, nothing is set. Pair the shake with a visible
            error message either way, since the shake is a cue, not the message.
          </li>
          <li>
            The hook needs the control to belong to a{" "}
            <DocsCode>{"<form>"}</DocsCode>. Without one, it does nothing.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="Good to know">
        <DocsList>
          <li>
            Turn it off per control with the <DocsCode>enabled</DocsCode>{" "}
            argument, or with <DocsCode>shake={"{false}"}</DocsCode> on
            HextaUI&apos;s inputs.
          </li>
          <li>
            Restarting the attribute restarts the animation, so a second failed
            attempt shakes again even if the first is still running.
          </li>
          <li>
            Native validation focuses the first invalid control on submit. The
            shake only adds motion on top of that and never moves focus.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection
          title="useInvalidShake(ref, enabled?)"
          id="parameters"
          level={3}
        >
          <DocsPropsTable
            props={[
              {
                name: "ref",
                type: "RefObject<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>",
                description: "The form control to watch.",
              },
              {
                name: "enabled",
                type: "boolean",
                default: "true",
                description: "Whether to shake.",
              },
            ]}
          />
          <DocsAttributesTable
            label="Attribute"
            attributes={[
              {
                name: "data-shake",
                description:
                  "Present for 400ms after a failed submit attempt, on the control or its InputGroup.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="Used by" level={3}>
          <DocsParagraph>
            <DocsCode>Input</DocsCode>, <DocsCode>Textarea</DocsCode>,{" "}
            <DocsCode>NativeSelect</DocsCode> and{" "}
            <DocsCode>InputGroup</DocsCode>.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
