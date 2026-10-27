import type {
  CardStyle,
  Testimonial,
  WallAccent,
  WallColumns,
  WallOptions,
} from "@/lib/testimonial-wall/model"

const cardVariants: Record<Exclude<CardStyle, "plain">, "default" | "muted"> = {
  hairline: "default",
  filled: "muted",
}

const accentClasses: Record<WallAccent, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
}

const masonryClasses: Record<WallColumns, string> = {
  1: "columns-1 gap-4 *:mb-4 *:break-inside-avoid",
  2: "columns-1 gap-4 *:mb-4 *:break-inside-avoid @lg:columns-2",
  3: "columns-1 gap-4 *:mb-4 *:break-inside-avoid @lg:columns-2 @3xl:columns-3",
}

const gridClasses: Record<WallColumns, string> = {
  1: "grid grid-cols-1 gap-4",
  2: "grid grid-cols-1 gap-4 @lg:grid-cols-2",
  3: "grid grid-cols-1 gap-4 @lg:grid-cols-2 @3xl:grid-cols-3",
}

const wallClasses = {
  root: "@container w-full",
  plain: "flex h-full flex-col gap-3 py-2",
  header: "flex items-center gap-3",
  author: "min-w-0 flex-1",
  name: "truncate text-sm font-medium text-foreground",
  subtitle: "truncate text-sm text-muted-foreground",
  sourceLink:
    "-m-1 shrink-0 self-start rounded-md p-1 text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden motion-reduce:transition-none",
  sourceIcon: "size-4 shrink-0 self-start text-muted-foreground",
  icon: "size-4",
  body: "text-sm/6 text-pretty wrap-anywhere whitespace-pre-line text-foreground",
  meta: "mt-auto flex items-center justify-between gap-3",
  rating: "flex items-center gap-0.5",
  star: "size-3.5",
  starEmpty: "size-3.5 text-foreground/15",
  date: "ms-auto text-xs text-muted-foreground tabular-nums",
  marquee: "flex flex-col gap-4",
  marqueeRow:
    "group/marquee flex overflow-hidden mask-x-from-90% mask-x-to-100% motion-reduce:overflow-x-auto",
  marqueeTrack:
    "flex w-max animate-[testimonial-marquee_var(--marquee-duration)_linear_infinite] group-focus-within/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none",
  marqueeReverse: "[animation-direction:reverse]",
  marqueeGroup: "flex shrink-0 items-stretch gap-4 pe-4",
  marqueeClone: "flex shrink-0 items-stretch gap-4 pe-4 motion-reduce:hidden",
  marqueeItem: "w-72 shrink-0 @lg:w-80",
  carouselControls: "mt-4 flex items-center justify-between gap-4",
  carouselButtons: "flex items-center gap-2",
  featuredContent: "flex flex-col items-center gap-6 py-4 text-center",
  featuredPlain:
    "mx-auto flex w-full max-w-2xl flex-col items-center gap-6 py-6 text-center",
  featuredQuote: "size-8",
  featuredBody:
    "text-lg/8 font-medium tracking-tight text-balance whitespace-pre-line text-foreground @lg:text-xl/9",
  featuredAuthor: "flex flex-col items-center gap-3",
  featuredName: "text-sm font-medium text-foreground",
  featuredSubtitle: "text-sm text-muted-foreground",
} as const

const marqueeKeyframes =
  "@keyframes testimonial-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}"

function marqueeRows(testimonials: Testimonial[], rows: WallOptions["rows"]) {
  if (rows === 1 || testimonials.length < 4) return [testimonials]
  return [
    testimonials.filter((_, index) => index % 2 === 0),
    testimonials.filter((_, index) => index % 2 === 1),
  ]
}

function marqueeDuration(count: number) {
  return `${Math.max(20, count * 8)}s`
}

function featuredIndex(options: WallOptions, count: number) {
  return Math.min(Math.max(0, options.featured), Math.max(0, count - 1))
}

export {
  accentClasses,
  cardVariants,
  featuredIndex,
  gridClasses,
  marqueeDuration,
  marqueeKeyframes,
  marqueeRows,
  masonryClasses,
  wallClasses,
}
