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
import { UseDelayedLoadingDemo } from "@/components/examples/use-delayed-loading/demo"
import { UseDelayedLoadingSkeleton } from "@/components/examples/use-delayed-loading/skeleton"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("use-delayed-loading")

const importCode = `import { useDelayedLoading } from "@/hooks/use-delayed-loading"`

const usageCode = `const { data, isFetching } = useQuery(query)
const showSpinner = useDelayedLoading(isFetching)

return showSpinner ? <Spinner /> : <Results data={data} />`

const timingCode = `const showSkeleton = useDelayedLoading(isLoading, {
  delay: 300,
  minDuration: 600,
})`

export default function Page() {
  return (
    <DocsComponentPage slug="use-delayed-loading">
      <DocsExample file="use-delayed-loading/demo">
        <UseDelayedLoadingDemo />
      </DocsExample>

      <DocsInstall dependencies={[]} files={["hooks/use-delayed-loading.ts"]} />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Pass the raw loading flag and render from the boolean it returns. Most
          requests on a warm connection finish in under 150ms. Showing a spinner
          for those is worse than showing nothing: it flashes for a frame or two
          and reads as a glitch, not as progress.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="How it works">
        <DocsParagraph>
          The hook applies two rules. It waits for <DocsCode>delay</DocsCode>{" "}
          before showing anything, so work that finishes sooner never shows a
          loading state. Once the indicator is visible, it stays for at least{" "}
          <DocsCode>minDuration</DocsCode>, so it can&apos;t appear and vanish
          within a few frames.
        </DocsParagraph>
        <DocsAttributesTable
          label="Work takes"
          attributes={[
            { name: "80ms", description: "Nothing is shown." },
            {
              name: "250ms",
              description:
                "Shown at 150ms and held until 550ms, the 400ms minimum.",
            },
            {
              name: "900ms",
              description: "Shown at 150ms and hidden as soon as work ends.",
            },
          ]}
        />
        <DocsParagraph>
          The 400ms minimum is long enough to register as a deliberate state and
          short enough not to slow anyone down.
        </DocsParagraph>
        <DocsList>
          <li>
            If <DocsCode>loading</DocsCode> turns back on while the indicator is
            still visible, it simply stays visible. There&apos;s no hide and
            show again.
          </li>
          <li>
            Timers are cleared when the inputs change or the component unmounts,
            so nothing updates state after it&apos;s gone.
          </li>
          <li>
            On the server and during the first render it returns{" "}
            <DocsCode>false</DocsCode>, so it never adds a hydration mismatch.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="use-delayed-loading/skeleton"
          title="Skeletons"
          description={
            <>
              Skeletons replace content, so a flash is even more jarring than
              with a spinner. Here the first load is slow and shows the
              skeleton. Later loads come from a cache and never do.
            </>
          }
        >
          <UseDelayedLoadingSkeleton />
        </DocsExample>
        <DocsSection title="Tuning the timing" level={3}>
          <DocsCodeBlock code={timingCode} />
          <DocsParagraph>
            Raise <DocsCode>delay</DocsCode> for indicators that cover a lot of
            the screen, like skeletons or overlays. Lower it toward 0 for
            actions where any wait needs acknowledging, like a payment. Keep{" "}
            <DocsCode>minDuration</DocsCode> above roughly 300ms.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>

      <DocsSection title="Good to know">
        <DocsList>
          <li>
            <DocsCode>{"<Spinner loading={...} />"}</DocsCode> and{" "}
            <DocsCode>{"<Button loading>"}</DocsCode> already use these timings.
            Reach for the hook when you render something else.
          </li>
          <li>
            Keep the space the indicator will take, as the examples do, so the
            layout doesn&apos;t shift when it appears.
          </li>
          <li>
            Pair it with an <DocsCode>aria-busy</DocsCode> or a status message.
            The hook only decides what to show visually.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection
          title="useDelayedLoading(loading, options?)"
          id="parameters"
          level={3}
        >
          <DocsPropsTable
            props={[
              {
                name: "loading",
                type: "boolean",
                description: "Whether the work is in progress right now.",
              },
              {
                name: "options.delay",
                type: "number",
                default: "150",
                description:
                  "Milliseconds to wait before showing the loading state.",
              },
              {
                name: "options.minDuration",
                type: "number",
                default: "400",
                description:
                  "Minimum milliseconds the loading state stays visible once shown.",
              },
            ]}
          />
          <DocsAttributesTable
            label="Returns"
            attributes={[
              {
                name: "boolean",
                description:
                  "Whether to show the loading state. Always false on the server.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="Used by" level={3}>
          <DocsParagraph>
            <DocsCode>Spinner</DocsCode> through its{" "}
            <DocsCode>loading</DocsCode> prop.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
