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
import { MotionEasing } from "@/components/examples/motion/easing"
import { MotionSizeMorph } from "@/components/examples/motion/size-morph"
import { MotionSlidingHighlight } from "@/components/examples/motion/sliding-highlight"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("motion")

const cssCode = `<div className="transition-transform duration-300 ease-out-quint motion-reduce:transition-none" />
<div className="transition-colors duration-150 ease-out-cubic" />
<aside className="transition-transform duration-500 ease-drawer" />`

const jsCode = `import { duration, easeOut, prefersReducedMotion } from "@/lib/motion"

element.animate(
  [{ opacity: 0, translate: "0 4px" }, { opacity: 1, translate: "0 0" }],
  {
    duration: prefersReducedMotion() ? 0 : duration.enter,
    easing: easeOut,
  }
)`

const morphCode = `const morphRef = useSizeMorph<HTMLButtonElement>({ axis: "width" })

<button ref={morphRef} className="overflow-hidden whitespace-nowrap">
  {copied ? "Copied to clipboard" : "Copy"}
</button>`

const highlightCode = `const barRef = React.useRef<HTMLDivElement>(null)
const highlightRef = React.useRef<HTMLSpanElement>(null)
useSlidingHighlight(barRef, highlightRef, "[data-active]", "data-active")

<div ref={barRef} className="relative isolate flex">
  <span
    ref={highlightRef}
    aria-hidden="true"
    className="absolute top-0 -z-1 opacity-0 transition-all duration-300 ease-out-quint data-instant:transition-opacity data-visible:opacity-100"
  />
  {items}
</div>`

export default function Page() {
  return (
    <DocsComponentPage slug="motion">
      <DocsExample file="motion/easing">
        <MotionEasing />
      </DocsExample>

      <DocsInstall dependencies={[]} files={["lib/motion.ts"]} />

      <DocsSection title="Principles">
        <DocsParagraph>
          Every HextaUI component moves with the same few curves and durations,
          so the library feels like one thing.
        </DocsParagraph>
        <DocsList>
          <li>
            <strong className="font-medium text-foreground">
              Ease out for things that respond to you.
            </strong>{" "}
            Elements entering, expanding or following a click start fast and
            settle, so the interface feels immediate.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Short and interruptible.
            </strong>{" "}
            Most motion is 150 to 300ms. Anything that can be reversed starts
            from where it is now rather than restarting.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Reduced motion is a second design, not an off switch.
            </strong>{" "}
            Movement turns into instant changes or plain fades, and state stays
            readable.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="Easing">
        <DocsParagraph>
          The theme defines the curves as Tailwind easing utilities, and{" "}
          <DocsCode>lib/motion</DocsCode> exports the same values for the Web
          Animations API.
        </DocsParagraph>
        <DocsAttributesTable
          label="Class"
          attributes={[
            {
              name: "ease-out-quint",
              description:
                "easeOut in JS. The default for movement: popovers, highlights, size changes.",
            },
            {
              name: "ease-out-cubic",
              description:
                "A softer ease out for color and shadow changes on hover and focus.",
            },
            {
              name: "ease-in-out-quart",
              description:
                "easeInOut in JS. For movement between two resting states that nobody triggered directly.",
            },
            {
              name: "ease-spring",
              description:
                "easeSpring in JS. A spring with a small overshoot, written as linear(), for things that land, like a toggle's thumb.",
            },
            {
              name: "ease-drawer",
              description:
                "The iOS sheet curve for drawers and sheets that slide in from an edge.",
            },
          ]}
        />
        <DocsCodeBlock code={cssCode} />
      </DocsSection>

      <DocsSection title="Durations">
        <DocsCodeBlock code={jsCode} />
        <DocsAttributesTable
          label="duration."
          attributes={[
            { name: "press: 100", description: "Pressed state going down." },
            {
              name: "release: 200",
              description: "Coming back up after a press.",
            },
            { name: "hover: 150", description: "Hover and focus feedback." },
            { name: "enter: 200", description: "Elements appearing." },
            {
              name: "exit: 150",
              description:
                "Elements leaving. Exits are faster than entrances, so they never hold anything up.",
            },
            {
              name: "morph: 300",
              description: "Size and position changes.",
            },
          ]}
        />
        <DocsParagraph>
          <DocsCode>prefersReducedMotion()</DocsCode> reads the media query at
          call time. Check it when an animation starts rather than once on
          mount, so changing the system setting applies right away. It returns{" "}
          <DocsCode>true</DocsCode> on the server.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Size morphs">
        <DocsExample
          file="motion/size-morph"
          description={
            <>
              <DocsCode>useSizeMorph</DocsCode> animates an element&apos;s width
              or height whenever its content changes, so a label that grows or
              shrinks doesn&apos;t jump.
            </>
          }
        >
          <MotionSizeMorph />
        </DocsExample>
        <DocsCodeBlock code={morphCode} />
        <DocsList>
          <li>
            Any DOM change inside the element triggers a morph, whether text,
            children or icons. Size changes from outside, like a resize,
            don&apos;t, so the element follows its container without lag.
          </li>
          <li>
            A change mid-morph continues from the current size. While it runs,
            the element has <DocsCode>data-morphing</DocsCode>, which you can
            use to clip overflow or pause other transitions.
          </li>
          <li>
            Keep the element at its natural size: no fixed width or height on
            the animated axis. Add <DocsCode>overflow-hidden</DocsCode> so the
            new content doesn&apos;t spill out while it grows.
          </li>
          <li>
            It returns a callback ref. Combine it with other refs using{" "}
            <DocsCode>useMergedRef</DocsCode>.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="Sliding highlights">
        <DocsExample
          file="motion/sliding-highlight"
          description={
            <>
              <DocsCode>useSlidingHighlight</DocsCode> moves one highlight
              element to whichever child matches a selector, which is how
              RadioGroup cards, Pagination, Menubar and NavigationMenu slide
              their indicators.
            </>
          }
        >
          <MotionSlidingHighlight />
        </DocsExample>
        <DocsCodeBlock code={highlightCode} />
        <DocsList>
          <li>
            The highlight is sized and translated with inline styles. Give it{" "}
            <DocsCode>absolute top-0</DocsCode> and a transition on{" "}
            <DocsCode>transform</DocsCode>, <DocsCode>width</DocsCode>,{" "}
            <DocsCode>height</DocsCode> and <DocsCode>opacity</DocsCode>.
          </li>
          <li>
            The hook watches the attribute you name with a{" "}
            <DocsCode>MutationObserver</DocsCode>, so it follows state from
            anywhere, including Base UI&apos;s own{" "}
            <DocsCode>data-pressed</DocsCode>, <DocsCode>data-checked</DocsCode>{" "}
            or <DocsCode>aria-current</DocsCode>.
          </li>
          <li>
            <DocsCode>data-visible</DocsCode> is set while something matches.{" "}
            <DocsCode>data-instant</DocsCode> is set when the highlight should
            jump: on first appearance, on resize and scroll, and under reduced
            motion. Style it as{" "}
            <DocsCode>data-instant:transition-opacity</DocsCode>.
          </li>
          <li>
            It measures with the bar&apos;s scale in mind, so it stays aligned
            inside a dialog that&apos;s still zooming in.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection
          title="useSizeMorph(options)"
          id="use-size-morph"
          level={3}
        >
          <DocsPropsTable
            props={[
              {
                name: "axis",
                type: '"width" | "height"',
                description: "Which dimension to animate.",
              },
              {
                name: "enabled",
                type: "boolean",
                default: "true",
                description: "Whether to animate.",
              },
              {
                name: "duration",
                type: "number",
                default: "300",
                description: "Milliseconds.",
              },
              {
                name: "easing",
                type: "string",
                default: "easeOut",
                description: "Any CSS easing.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection
          title="useSlidingHighlight(barRef, highlightRef, selector, attribute?)"
          id="use-sliding-highlight"
          level={3}
        >
          <DocsPropsTable
            props={[
              {
                name: "barRef",
                type: "RefObject<HTMLElement | null>",
                description: "The positioned container.",
              },
              {
                name: "highlightRef",
                type: "RefObject<HTMLElement | null>",
                description: "The element to move.",
              },
              {
                name: "selector",
                type: "string",
                description: "Matches the child to highlight.",
              },
              {
                name: "attribute",
                type: "string",
                default: '"data-popup-open"',
                description: "The attribute whose changes move the highlight.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="Constants" level={3}>
          <DocsAttributesTable
            label="Export"
            attributes={[
              {
                name: "easeOut",
                description: "cubic-bezier(0.23, 1, 0.32, 1)",
              },
              {
                name: "easeInOut",
                description: "cubic-bezier(0.77, 0, 0.175, 1)",
              },
              { name: "easeSpring", description: "A linear() spring." },
              {
                name: "duration",
                description: "press, release, hover, enter, exit and morph.",
              },
              {
                name: "prefersReducedMotion()",
                description:
                  "Whether reduced motion is on. true on the server.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
