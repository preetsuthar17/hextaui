import { bullets, fence, heading } from "@/lib/md/format"
import { absoluteUrl } from "@/lib/site"
import {
  generateWallCode,
  wallInstallCommand,
} from "@/lib/testimonial-wall/codegen"
import {
  defaultWallOptions,
  layoutLabels,
  wallLayouts,
} from "@/lib/testimonial-wall/model"
import { seedTestimonials } from "@/lib/testimonial-wall/seed"

const testimonialWallPath = "/tools/testimonial-wall"

const testimonialWallTitle = "Free Testimonial Wall Builder"

const testimonialWallDescription =
  "Build a testimonial wall for free: masonry, marquee, grid or carousel. Paste X posts, CSV or JSON, then copy the React code, a PNG or a share link."

const testimonialWallLead =
  "Turn the nice things people say about your product into a wall of quotes for your site. Paste X posts, CSV or JSON, pick a layout, then copy the React code. It renders with HextaUI components and needs no account, script or subscription."

const testimonialWallSteps = [
  "Add your testimonials by hand, paste X post links, or paste JSON or CSV with name and body columns.",
  "Pick a layout and how each card looks. The preview updates as you type.",
  "Run the install command to add the HextaUI components the wall uses.",
  "Copy the component file into your project and render <TestimonialWall /> where you want it.",
]

const testimonialWallAbout = [
  "A testimonial wall is a page section that shows many short quotes from customers at once, usually as a masonry of cards or a scrolling marquee. It works as social proof: a visitor who sees dozens of real people vouching for a product trusts it faster than one polished headline.",
  "Hosted tools such as Senja and Testimonial.to collect testimonials for you and embed the wall with a script and a monthly plan. This builder does the other half for free. You keep the quotes as data in your own repository and the wall is plain React you can edit, with no third-party script slowing the page down.",
]

const testimonialWallQuestions = [
  {
    question: "Is the testimonial wall builder free?",
    answer:
      "Yes. There’s no account, no watermark and no limit on exports. The code it gives you uses free, MIT-licensed HextaUI components, so you can ship it in any project, including commercial ones.",
  },
  {
    question: "How is this different from Senja or Testimonial.to?",
    answer:
      "Those services collect testimonials through forms and host the wall for you behind a monthly plan and an embed script. This builder doesn’t collect anything. It turns quotes you already have into a React component you own, with no script, no hosting and no subscription.",
  },
  {
    question: "Can I import posts from X?",
    answer:
      "Yes. Paste one or more x.com or twitter.com post links and the builder reads each public post’s author, text and date through X’s oEmbed endpoint. Posts from protected accounts can’t be read, so add those by hand. For LinkedIn and Product Hunt, paste the text into the form.",
  },
  {
    question: "What format does bulk import accept?",
    answer:
      "A JSON array of objects or CSV with a header row. Each testimonial needs a name and a body, which can also be called author, text or quote. Handle, role, avatar, source, url, date and rating are optional. Tab-separated rows pasted from a spreadsheet work too.",
  },
  {
    question: "What does the exported code need?",
    answer:
      "A React project with Tailwind CSS v4 and the shadcn CLI. The install command adds the HextaUI Card and Avatar components, plus Carousel for the carousel layout. The file inlines your testimonials, so there’s nothing to fetch at runtime.",
  },
  {
    question: "Where are my testimonials stored?",
    answer:
      "Only in your browser. A share link stores the whole wall, compressed, in the part of the URL after the #, which browsers never send to a server. Importing an X post sends only that post’s link.",
  },
  {
    question: "Does the wall support dark mode and reduced motion?",
    answer:
      "Yes. Cards use your theme’s tokens, so they follow light and dark mode. The marquee pauses on hover and keyboard focus, and it stops and becomes a scrollable row for people who prefer reduced motion.",
  },
]

function getTestimonialWallMarkdown() {
  const sample = {
    testimonials: seedTestimonials.slice(0, 2),
    options: defaultWallOptions,
  }
  return [
    heading(1, testimonialWallTitle),
    `> ${testimonialWallDescription}`,
    testimonialWallLead,
    `Open the builder: ${absoluteUrl(testimonialWallPath)}`,
    heading(2, "What a testimonial wall is"),
    ...testimonialWallAbout,
    heading(2, "Layouts"),
    bullets(wallLayouts.map((layout) => layoutLabels[layout])),
    heading(2, "How to add it to your site"),
    testimonialWallSteps
      .map((step, index) => `${index + 1}. ${step}`)
      .join("\n"),
    fence(wallInstallCommand(sample.options), "bash"),
    "A generated file with two testimonials looks like this:",
    fence(generateWallCode(sample), "tsx", "components/testimonial-wall.tsx"),
    heading(2, "Questions"),
    ...testimonialWallQuestions.flatMap((item) => [
      heading(3, item.question),
      item.answer,
    ]),
  ].join("\n\n")
}

export {
  getTestimonialWallMarkdown,
  testimonialWallAbout,
  testimonialWallDescription,
  testimonialWallLead,
  testimonialWallPath,
  testimonialWallQuestions,
  testimonialWallSteps,
  testimonialWallTitle,
}
