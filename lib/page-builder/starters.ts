import { placeSection, type PageDoc } from "@/lib/page-builder/doc"

type StarterSection = [string] | [string, Record<string, unknown>]

type Starter = {
  id: string
  title: string
  description: string
  sections: StarterSection[]
}

const starters: Starter[] = [
  {
    id: "saas",
    title: "SaaS",
    description: "Product shot, features, pricing tiers and FAQ.",
    sections: [
      ["navbar-simple"],
      ["hero-centered"],
      ["logos-row"],
      ["features-grid"],
      ["feature-split"],
      ["testimonials-grid"],
      ["pricing-tiers"],
      ["faq-centered"],
      ["cta-panel"],
      ["footer-columns"],
    ],
  },
  {
    id: "ai-product",
    title: "AI product",
    description: "A bold claim, proof in numbers and one plan.",
    sections: [
      [
        "navbar-floating",
        {
          brand: "Relay",
          logoIcon: "IconSparkles",
          links: [
            { label: "Product", href: "#features" },
            { label: "Customers", href: "#testimonials" },
            { label: "Pricing", href: "#pricing" },
          ],
          ctaLabel: "Try Relay",
          ctaHref: "/signup",
        },
      ],
      [
        "hero-minimal",
        {
          eyebrow: "Relay for support teams",
          headline: "Support answers that resolve the ticket, not deflect it.",
          subhead:
            "Relay reads your docs, past tickets and order data, then replies in your voice. When a case needs a person, it hands off with the full context.",
          primaryLabel: "Start a free trial",
          primaryHref: "/signup",
          secondaryLabel: "Watch the demo",
          secondaryHref: "#demo",
        },
      ],
      [
        "stats-row",
        {
          items: [
            { value: "71%", label: "Tickets resolved without a hand-off" },
            { value: "38s", label: "Median first reply" },
            { value: "4.8/5", label: "Customer rating on replies" },
            { value: "40+", label: "Languages answered" },
          ],
        },
      ],
      [
        "features-cards",
        {
          eyebrow: "How it works",
          headline: "Grounded in your knowledge, checked before it sends",
          subhead:
            "Every reply cites the article or ticket it came from, so your team can trust what goes out.",
          items: [
            {
              icon: "IconSearch",
              title: "Reads what you already have",
              description:
                "Help center, macros, past tickets and PDFs. Relay stays in sync as they change.",
            },
            {
              icon: "IconShieldCheck",
              title: "Answers only when it’s sure",
              description:
                "Low-confidence replies go to a person as a draft instead of to the customer.",
            },
            {
              icon: "IconMessage",
              title: "Sounds like your team",
              description:
                "Set the tone once. Relay keeps it across email, chat and every language.",
            },
            {
              icon: "IconPlug",
              title: "Works in your help desk",
              description:
                "Zendesk, Intercom, Front and Help Scout, with no new inbox to learn.",
            },
            {
              icon: "IconChartBar",
              title: "Shows what to fix",
              description:
                "Weekly reports on the questions your docs don’t answer yet.",
            },
            {
              icon: "IconLock",
              title: "Private by default",
              description:
                "Your data never trains shared models. SOC 2 Type II and EU hosting.",
            },
          ],
        },
      ],
      [
        "testimonial-single",
        {
          quote:
            "Relay closed two thirds of our tickets in the first month, and the rest arrive with a draft our team only has to check.",
          name: "Priya Raman",
          role: "Head of Support, Lumen",
        },
      ],
      [
        "pricing-single",
        {
          eyebrow: "Pricing",
          headline: "Pay for resolutions, not seats",
          subhead:
            "Every plan includes all channels and languages. Hand-offs to your team are free.",
          price: "$0.40",
          period: "per resolved ticket",
          note: "First 500 resolutions free. No card required.",
          features:
            "All help desk integrations\nEmail, chat and voice\n40+ languages\nCitations on every reply\nSSO and audit log\nEU or US hosting",
          primaryLabel: "Start a free trial",
          primaryHref: "/signup",
        },
      ],
      [
        "cta-inline",
        {
          headline: "See Relay answer your own tickets",
          subhead:
            "Connect a help desk and watch it draft replies to last week’s questions. It takes ten minutes.",
          primaryLabel: "Start a free trial",
          primaryHref: "/signup",
          secondaryLabel: "Book a demo",
          secondaryHref: "/demo",
        },
      ],
      [
        "footer-simple",
        {
          brand: "Relay",
          logoIcon: "IconSparkles",
          copyright: "© 2026 Relay Labs, Inc.",
        },
      ],
    ],
  },
  {
    id: "agency",
    title: "Agency",
    description: "Large type, services, results and a contact call.",
    sections: [
      [
        "navbar-simple",
        {
          brand: "Fieldwork",
          logoIcon: "IconSquareRounded",
          links: [
            { label: "Work", href: "#work" },
            { label: "Services", href: "#features" },
            { label: "Studio", href: "#testimonials" },
            { label: "FAQ", href: "#faq" },
          ],
          signInLabel: "",
          ctaLabel: "Start a project",
          ctaHref: "/contact",
        },
      ],
      [
        "hero-minimal",
        {
          eyebrow: "Fieldwork, a product design studio",
          headline: "We design and build the first version of your product.",
          subhead:
            "A senior team of six. We take a product from first sketch to launch in twelve weeks, then stay on while it grows.",
          primaryLabel: "Start a project",
          primaryHref: "/contact",
          secondaryLabel: "See our work",
          secondaryHref: "#work",
        },
      ],
      [
        "logos-grid",
        {
          headline: "Recent clients",
          logos: [
            { name: "Polaris", icon: "IconCircleDot" },
            { name: "Quanta", icon: "IconAtom" },
            { name: "Evergreen", icon: "IconLeaf" },
            { name: "Loop", icon: "IconInfinity" },
            { name: "Lumen", icon: "IconSparkles" },
            { name: "Acme", icon: "IconTriangle" },
          ],
        },
      ],
      [
        "features-list",
        {
          eyebrow: "Services",
          headline: "One team from strategy to shipped code",
          subhead:
            "No hand-offs between agencies. The people who design your product are the ones who build it.",
          items: [
            {
              icon: "IconSearch",
              title: "Product strategy",
              description:
                "Interviews, a clear scope and a plan your board and engineers both understand.",
            },
            {
              icon: "IconPalette",
              title: "Interface design",
              description:
                "A design system and every screen, tested with real users before a line of code.",
            },
            {
              icon: "IconCode",
              title: "Engineering",
              description:
                "React and Next.js front ends, typed APIs and a codebase your team can take over.",
            },
            {
              icon: "IconRocket",
              title: "Launch and growth",
              description:
                "Analytics, onboarding and the experiments that come after launch day.",
            },
          ],
        },
      ],
      [
        "stats-intro",
        {
          eyebrow: "Results",
          headline: "Twelve weeks to launch, on average",
          subhead: "Across the 40 products we’ve shipped since 2019.",
          items: [
            { value: "40", label: "Products launched" },
            { value: "12 wk", label: "Average time to launch" },
            { value: "$310M", label: "Raised by our clients" },
            { value: "9 yrs", label: "Longest client relationship" },
          ],
        },
      ],
      [
        "testimonials-grid",
        {
          eyebrow: "Clients",
          headline: "What working with us is like",
          items: [
            {
              quote:
                "Fieldwork felt like our own team. They pushed back on scope at the right moments and we launched a month early.",
              name: "Hana Ito",
              role: "Founder, Evergreen",
            },
            {
              quote:
                "The handover was the best part. Our engineers picked up the codebase in a week.",
              name: "Marcus Bell",
              role: "CTO, Loop",
            },
            {
              quote:
                "Clear weekly demos, no surprises on the invoice, and a product our customers love.",
              name: "Elena Ruiz",
              role: "COO, Polaris",
            },
          ],
        },
      ],
      [
        "faq-split",
        {
          headline: "Before you get in touch",
          subhead:
            "Still deciding? Write to hello@fieldwork.studio and a partner will reply within a day.",
          items: [
            {
              question: "What does a project cost?",
              answer:
                "Most first versions cost between $80k and $160k, priced per week with a fixed team.",
            },
            {
              question: "Do you work with early-stage startups?",
              answer:
                "Yes. About half of our clients come to us before their seed round.",
            },
            {
              question: "Who owns the code and designs?",
              answer: "You do, from the first commit. There is no license fee.",
            },
          ],
        },
      ],
      [
        "cta-panel",
        {
          headline: "Have a product in mind?",
          subhead:
            "Tell us about it. We take on four new projects a quarter.",
          primaryLabel: "Start a project",
          primaryHref: "/contact",
          secondaryLabel: "hello@fieldwork.studio",
          secondaryHref: "mailto:hello@fieldwork.studio",
        },
      ],
      [
        "footer-simple",
        {
          brand: "Fieldwork",
          logoIcon: "IconSquareRounded",
          links: [
            { label: "Work", href: "#work" },
            { label: "Careers", href: "/careers" },
            { label: "Contact", href: "/contact" },
          ],
          copyright: "© 2026 Fieldwork Studio",
        },
      ],
    ],
  },
  {
    id: "waitlist",
    title: "Waitlist",
    description: "A short page to collect interest before launch.",
    sections: [
      [
        "navbar-floating",
        {
          brand: "Orbit",
          logoIcon: "IconCircleDot",
          links: [],
          ctaLabel: "Join the waitlist",
          ctaHref: "#join",
        },
      ],
      [
        "hero-centered",
        {
          badge: "Private beta opens in March",
          headline: "Your calendar, planned for you",
          subhead:
            "Orbit finds focus time, moves meetings that can wait and protects the hours that matter. Join the waitlist for early access.",
          primaryLabel: "Join the waitlist",
          primaryHref: "#join",
          secondaryLabel: "Read the manifesto",
          secondaryHref: "/manifesto",
        },
      ],
      [
        "features-grid",
        {
          eyebrow: "What’s coming",
          headline: "A calm week, by default",
          subhead: "",
          items: [
            {
              icon: "IconClock",
              title: "Focus blocks",
              description:
                "Orbit books deep-work time around your meetings, and defends it.",
            },
            {
              icon: "IconUsers",
              title: "Fair scheduling",
              description:
                "Finds a time that works across time zones without a single email.",
            },
            {
              icon: "IconBolt",
              title: "One-tap reschedule",
              description:
                "Running late? Orbit moves the rest of your day and tells everyone.",
            },
          ],
        },
      ],
      [
        "cta-panel",
        {
          headline: "Be first in line",
          subhead:
            "We’re letting people in every week. Waitlist members get three months free.",
          primaryLabel: "Join the waitlist",
          primaryHref: "#join",
          secondaryLabel: "",
        },
      ],
      [
        "footer-simple",
        {
          brand: "Orbit",
          logoIcon: "IconCircleDot",
          links: [
            { label: "Privacy", href: "/privacy" },
            { label: "Contact", href: "/contact" },
          ],
          copyright: "© 2026 Orbit Labs",
        },
      ],
    ],
  },
]

function starterDoc(id: string): PageDoc | null {
  const starter = starters.find((item) => item.id === id)
  if (!starter) return null
  return {
    sections: starter.sections.flatMap(([sectionId, overrides]) => {
      const placed = placeSection(sectionId, overrides ?? {})
      return placed ? [placed] : []
    }),
  }
}

export { starterDoc, starters, type Starter }
