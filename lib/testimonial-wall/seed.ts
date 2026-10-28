import type { Testimonial } from "@/lib/testimonial-wall/model"

const seedTestimonials: Testimonial[] = [
  {
    name: "Juniper Vale",
    handle: "junipervale_demo",
    body: "Swapped our hand-rolled pricing page for this in an afternoon. Conversions are up and I finally stopped fighting CSS.",
    source: "x",
    date: "2026-09-14",
    rating: 5,
  },
  {
    name: "Theo Brightwater",
    role: "Founder, Lumenfold",
    body: "The onboarding flow is the first one our users actually finish. Support tickets about setup dropped to almost nothing within a month, and the team that used to answer them now ships features instead.",
    source: "linkedin",
    date: "2026-08-30",
    rating: 5,
  },
  {
    name: "Ines Marlowe",
    handle: "inesbuilds_demo",
    body: "Quietly the best tool in my stack.",
    source: "x",
    date: "2026-10-02",
    rating: 5,
  },
  {
    name: "Priya Lindqvist",
    handle: "priyal_demo",
    body: "Set it up on Monday. By Wednesday the whole team was using it and nobody asked for training.",
    source: "x",
    date: "2026-09-03",
    rating: 5,
  },
  {
    name: "Oskar Fenwick",
    role: "CTO, Tidewater Labs",
    body: "We evaluated four alternatives over two sprints. This was the only one that didn’t need a migration plan, a vendor call or a new build step.\n\nIt just slotted into the codebase we already had.",
    source: "web",
    date: "2026-06-18",
    rating: 5,
  },
  {
    name: "Maya Okonjo",
    handle: "mayaships_demo",
    body: "Shipped v2 of our landing page in a weekend. Customers keep asking who designed it 😅",
    source: "x",
    date: "2026-10-11",
    rating: 5,
  },
  {
    name: "Rafael Duarte",
    role: "Indie hacker",
    body: "Paid for itself in the first week.",
    source: "producthunt",
    date: "2026-08-07",
    rating: 4,
  },
  {
    name: "Hana Whitlock",
    role: "Head of Growth, Brightloom",
    body: "Our trial-to-paid rate went from 9% to 14% after the redesign. I’m not going back to stitching templates together.",
    source: "linkedin",
    date: "2026-09-25",
    rating: 5,
  },
  {
    name: "Ezra Kowalczyk",
    handle: "ezrak_demo",
    body: "Accessibility was the part I expected to fight. Keyboard, focus, screen readers: it was all already there.",
    source: "x",
    date: "2026-10-06",
    rating: 5,
  },
]

export { seedTestimonials }
