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
import { CarouselWithApi } from "@/components/examples/carousel/api"
import { CarouselAutoplay } from "@/components/examples/carousel/autoplay"
import { CarouselControlled } from "@/components/examples/carousel/controlled"
import { CarouselDemo } from "@/components/examples/carousel/demo"
import { CarouselDotsAndCounter } from "@/components/examples/carousel/dots-and-counter"
import { CarouselDynamic } from "@/components/examples/carousel/dynamic"
import { CarouselLinks } from "@/components/examples/carousel/links"
import { CarouselLongContent } from "@/components/examples/carousel/long-content"
import { CarouselNested } from "@/components/examples/carousel/nested"
import { CarouselRewind } from "@/components/examples/carousel/rewind"
import { CarouselRtl } from "@/components/examples/carousel/rtl"
import { CarouselSeveralPerView } from "@/components/examples/carousel/several-per-view"
import { CarouselWithThumbnails } from "@/components/examples/carousel/thumbnails"
import { CarouselVertical } from "@/components/examples/carousel/vertical"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("carousel")

const importCode = `import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"`

const usageCode = `<Carousel aria-label="Featured">
  <CarouselContent>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
  <CarouselDots />
</Carousel>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `Carousel
├── CarouselContent
│   └── CarouselItem
├── CarouselPrevious
├── CarouselNext
├── CarouselDots
├── CarouselCounter
├── CarouselAutoplayToggle
└── CarouselThumbnails
    └── CarouselThumbnail`

export default function Page() {
  return (
    <DocsComponentPage slug="carousel">
      <DocsExample file="carousel/demo">
        <CarouselDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={[
          "components/ui/carousel.tsx",
          "components/ui/button.tsx",
          "components/ui/number-flow.tsx",
          "lib/motion.ts",
        ]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Slides scroll natively with CSS scroll snap, so touch momentum and
          trackpad scrolling feel like the platform. A mouse can drag, and the
          arrow keys move one slide at a time.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="carousel/api"
          title="API"
          description={
            <>
              Pass <DocsCode>setApi</DocsCode> to get the carousel API, then
              listen for <DocsCode>select</DocsCode> to show your own position.
              Next is disabled on the last slide but keeps focus.
            </>
          }
        >
          <CarouselWithApi />
        </DocsExample>
        <DocsExample
          file="carousel/several-per-view"
          title="Several per view"
          description={
            <>
              Items set their own <DocsCode>basis</DocsCode>. Gutters come from
              the <DocsCode>spacing</DocsCode> prop, so they stay exact at any
              basis.
            </>
          }
        >
          <CarouselSeveralPerView />
        </DocsExample>
        <DocsExample
          file="carousel/dots-and-counter"
          title="Dots and counter"
          description="The active dot stretches as the slides scroll and its neighbours make room. The counter only spins the digit that changed."
        >
          <CarouselDotsAndCounter />
        </DocsExample>
        <DocsExample
          file="carousel/autoplay"
          title="Autoplay"
          description={
            <>
              <DocsCode>autoplay</DocsCode> is off by default and stays off with
              reduced motion. It pauses on hover, keyboard focus, touch, drag, a
              hidden tab, or when scrolled out of view, and the active dot fills
              as the timer runs.
            </>
          }
        >
          <CarouselAutoplay />
        </DocsExample>
        <DocsExample
          file="carousel/thumbnails"
          title="Thumbnails"
          description={
            <>
              <DocsCode>{"<CarouselThumbnails />"}</DocsCode> follows the main
              carousel and scrolls to keep the active thumbnail in view.
            </>
          }
        >
          <CarouselWithThumbnails />
        </DocsExample>
        <DocsExample
          file="carousel/vertical"
          title="Vertical"
          description={
            <>
              <DocsCode>orientation=&quot;vertical&quot;</DocsCode> needs a
              height on <DocsCode>{"<CarouselContent />"}</DocsCode>. The
              buttons move above and below.
            </>
          }
        >
          <CarouselVertical />
        </DocsExample>
        <DocsExample
          file="carousel/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>index</DocsCode> and{" "}
              <DocsCode>onIndexChange</DocsCode>. Swiping updates your state and
              your state scrolls the carousel.
            </>
          }
        >
          <CarouselControlled />
        </DocsExample>
        <DocsExample
          file="carousel/rewind"
          title="Rewind and start index"
          description={
            <>
              <DocsCode>rewind</DocsCode> sends Next on the last slide back to
              the first. <DocsCode>defaultIndex</DocsCode> opens on a slide
              without a scroll animation.
            </>
          }
        >
          <CarouselRewind />
        </DocsExample>
        <DocsExample
          file="carousel/links"
          title="Links and focusable content"
          description="Dragging a link with the mouse scrolls without opening it. Tabbing to a slide that is off screen scrolls it into view."
        >
          <CarouselLinks />
        </DocsExample>
        <DocsExample
          file="carousel/dynamic"
          title="Adding and removing slides"
          description="Dots, the counter and the buttons update as slides come and go."
        >
          <CarouselDynamic />
        </DocsExample>
        <DocsExample
          file="carousel/nested"
          title="Nested"
          description="Arrow keys, dragging and dots only move the carousel you are in."
        >
          <CarouselNested />
        </DocsExample>
        <DocsExample
          file="carousel/long-content"
          title="Long content and a single slide"
          description="Unbroken text wraps inside its slide. With one slide the dots hide and the buttons stay disabled."
        >
          <CarouselLongContent />
        </DocsExample>
        <DocsExample
          file="carousel/rtl"
          title="Right to left"
          description="Slides start on the right, the arrows flip, the Left arrow key moves forward and the dots fill from the right."
        >
          <CarouselRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsParagraph>
          Keys work while focus is anywhere inside the carousel, except in text
          fields and nested carousels.
        </DocsParagraph>
        <DocsKeyboardTable
          keys={[
            {
              keys: ["→"],
              description:
                "Next slide. Previous in right-to-left layouts. ↓ in vertical carousels.",
            },
            {
              keys: ["←"],
              description:
                "Previous slide. Next in right-to-left layouts. ↑ in vertical carousels.",
            },
            {
              keys: ["Tab"],
              description:
                "Moves through the buttons, the active dot and the slides’ content, scrolling off-screen slides into view.",
            },
            {
              keys: ["Enter", "Space"],
              description: "Activates the focused button, dot or thumbnail.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The root is a <DocsCode>region</DocsCode> described as a carousel.
            Give it an <DocsCode>aria-label</DocsCode>.
          </li>
          <li>
            Each item is a <DocsCode>group</DocsCode> described as a slide and
            labelled with its position, like “3 of 5”.
          </li>
          <li>
            A polite live region announces the new slide after keyboard or
            button navigation, and stays quiet while autoplay runs.
          </li>
          <li>
            Dots and thumbnails use a single tab stop, and focus follows the
            active one.
          </li>
          <li>
            Previous and Next stay focusable when disabled, so focus is never
            lost at either end.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="Carousel" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "orientation",
                type: '"horizontal" | "vertical"',
                default: '"horizontal"',
              },
              {
                name: "spacing",
                type: '"none" | "sm" | "default" | "lg"',
                default: '"default"',
                description: "Gap between slides.",
              },
              { name: "index", type: "number" },
              { name: "defaultIndex", type: "number", default: "0" },
              { name: "onIndexChange", type: "(index: number) => void" },
              {
                name: "rewind",
                type: "boolean",
                default: "false",
                description: "Wrap from the last slide back to the first.",
              },
              {
                name: "mouseDrag",
                type: "boolean",
                default: "true",
                description: "Let a mouse drag the slides.",
              },
              {
                name: "autoplay",
                type: "boolean | { delay?: number }",
                default: "false",
                description:
                  "Advance on a timer. delay defaults to 5000ms, minimum 1000ms.",
              },
              { name: "setApi", type: "(api: CarouselApi) => void" },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="carousel"',
                description: "Target the root in CSS.",
              },
              { name: "data-orientation", description: "The orientation." },
              {
                name: "--carousel-spacing",
                description: "The gap between slides, set by spacing.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CarouselContent" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "className",
                type: "string",
                description: "Applied to the track that holds the slides.",
              },
              {
                name: "viewportClassName",
                type: "string",
                description: "Applied to the scrolling viewport.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="carousel-content"',
                description: "The scrolling viewport.",
              },
              {
                name: 'data-slot="carousel-container"',
                description: "The track inside it.",
              },
              {
                name: "data-scrollable",
                description: "Present when there is more than one position.",
              },
              {
                name: "data-dragging",
                description: "Present while a mouse drag is in progress.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CarouselItem" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<div>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="carousel-item"',
                description: "Set basis-* to show several per view.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CarouselPrevious and CarouselNext" level={3}>
          <DocsParagraph>
            Both render a <DocsCode>{"<Button />"}</DocsCode> and accept its
            props. They sit outside the content, so leave room around the
            carousel.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: 'ButtonProps["variant"]',
                default: '"outline"',
              },
              {
                name: "size",
                type: 'ButtonProps["size"]',
                default: '"icon-sm"',
              },
              {
                name: "children",
                type: "ReactNode",
                default: "Arrow icon",
                description: "Follows the orientation and direction.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="carousel-previous"',
                description: "Labelled “Previous slide”.",
              },
              {
                name: 'data-slot="carousel-next"',
                description: "Labelled “Next slide”.",
              },
              {
                name: "data-disabled",
                description:
                  "Present at either end. The button stays focusable.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CarouselDots" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "aria-label",
                type: "string",
                default: '"Choose slide"',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="carousel-dots"',
                description: "The group of dots. Hidden with one position.",
              },
              {
                name: 'data-slot="carousel-dot"',
                description: "Each dot. The active one has aria-current.",
              },
              {
                name: "--dot-active",
                description: "0 to 1, how active a dot is while scrolling.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CarouselCounter" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="carousel-counter"',
                description:
                  "Shows the current position over the total with a rolling digit.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CarouselAutoplayToggle" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: 'ButtonProps["variant"]',
                default: '"ghost"',
              },
              {
                name: "size",
                type: 'ButtonProps["size"]',
                default: '"icon-sm"',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="carousel-autoplay-toggle"',
                description: "Labelled “Pause slideshow” or “Play slideshow”.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CarouselThumbnails" level={3}>
          <DocsPropsTable
            props={[
              { name: "aria-label", type: "string", default: '"Slides"' },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="carousel-thumbnails"',
                description: "The scrolling strip.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CarouselThumbnail" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "index",
                type: "number",
                description:
                  "The slide it opens. Defaults to its position in the strip.",
              },
              { name: "render", type: renderType, default: "<button>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="carousel-thumbnail"',
                description: "Target thumbnails in CSS.",
              },
              {
                name: "data-active",
                description: "Present while its slide is in view.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CarouselApi" level={3}>
          <DocsParagraph>
            Returned through <DocsCode>setApi</DocsCode> and{" "}
            <DocsCode>useCarousel()</DocsCode>. Pass{" "}
            <DocsCode>jump: true</DocsCode> to move without animating.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              { name: "scrollPrev", type: "(jump?: boolean) => void" },
              { name: "scrollNext", type: "(jump?: boolean) => void" },
              {
                name: "scrollTo",
                type: "(index: number, jump?: boolean) => void",
                description: "Scrolls to a snap position.",
              },
              {
                name: "scrollToSlide",
                type: "(slideIndex: number, jump?: boolean) => void",
                description: "Scrolls to the position that shows a slide.",
              },
              { name: "canScrollPrev", type: "() => boolean" },
              { name: "canScrollNext", type: "() => boolean" },
              { name: "selectedScrollSnap", type: "() => number" },
              { name: "scrollSnapList", type: "() => number[]" },
              { name: "slidesInView", type: "() => number[]" },
              { name: "slideNodes", type: "() => HTMLElement[]" },
              { name: "viewportNode", type: "() => HTMLElement | null" },
              { name: "play", type: "() => void" },
              { name: "stop", type: "() => void" },
              { name: "isPlaying", type: "() => boolean" },
              {
                name: "on / off",
                type: '(event: "select" | "scroll" | "settle" | "reInit", listener) => CarouselApi',
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="useCarousel" level={3}>
          <DocsParagraph>
            Use inside <DocsCode>{"<Carousel />"}</DocsCode> to build your own
            controls. Returns <DocsCode>api</DocsCode>,{" "}
            <DocsCode>orientation</DocsCode>, <DocsCode>selectedIndex</DocsCode>
            , <DocsCode>snapCount</DocsCode>, <DocsCode>slideCount</DocsCode>,{" "}
            <DocsCode>slidesInView</DocsCode>,{" "}
            <DocsCode>canScrollPrev</DocsCode>,{" "}
            <DocsCode>canScrollNext</DocsCode>, <DocsCode>isPlaying</DocsCode>{" "}
            and the scroll and play methods.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
