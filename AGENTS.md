<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

After making changes, run `pnpm lint` and fix all errors.

## Page metadata

Every page sets its head tags with `pageMetadata()` from `lib/metadata.ts`. Don't write a `Metadata` object by hand.

```ts
export const metadata: Metadata = pageMetadata({
  title: "Plain page name",
  description: "70–160 characters saying what the page is.",
  path: "/the/path",
})
```

- **Options:** `type: "article"` with `publishedTime` / `modifiedTime`, `image`, `imageAlt`, `markdown` (the `.md` twin) and `noindex: true`.
- **Title:** pass the bare page name. The helper adds ` — HextaUI` only when the result fits in 60 characters, and never cuts a title.
- **Description:** keep it 70–160 characters, written from what the page already shows. Longer text is cut at a word with no ellipsis, and CJK counts as double width.
- **Canonical and og:url:** both come from `path`. Use the clean path, with no query string and no trailing slash.
- **Social image:** indexable pages default to `/og/<path>.png`, so add the page to `lib/og-pages.ts`. Noindex pages use `/opengraph-image`.
- **Private and utility pages:** pass `noindex: true`, which gives `noindex, follow`. Also add the path to `noindexPaths` in `lib/site.ts`.
- **Dynamic routes:** return `pageMetadata()` from `generateMetadata`, set `dynamicParams = false` and call `notFound()` when the record is missing.
- **Translated pages:** `/[lang]` pages pass the English metadata through `localizeMetadata()`. A new title or description string needs catalog entries in `lib/i18n/messages/*`.
- **Reading a title back:** `metadata.title` is `{ absolute }`. Use `metadataTitle(metadata)` (for JSON-LD, for example), never `String(metadata.title)`.
- **Site-wide values:** name, URL, default description, default image, X handle and theme color live in `lib/site.ts`.

`lib/seo-pages.test.ts` renders the metadata of every `app/**/page.tsx`, including every static param and every language. It fails on:

- a missing title, description or canonical;
- an English title over 60 characters;
- a description outside 70–160 characters;
- a canonical that isn't clean and absolute;
- an og:image that isn't built;
- a noindex flag that doesn't match `lib/site.ts`;
- a duplicate title or description.

Translated titles over 60 are held to `translatedTitleBudget`. Lower that number when you shorten a translation, and never raise it.

## Structured data

JSON-LD is built by the functions in `lib/structured-data.ts` and rendered with `<JsonLd>` from `components/site/json-ld.tsx`, which escapes `<`. Don't hand-write JSON-LD objects in pages.

- **One graph per page:** every page has exactly two scripts. The root layout renders `siteJsonLd()` (WebSite, Organization, SoftwareSourceCode), and the page renders one `@graph`. Add extra nodes with `pageJsonLd({ extra })` or `<InfoPage structuredData={[…]}>`, never as a second script.
- **Builders:** `pageJsonLd` (WebPage, AboutPage, ContactPage or CollectionPage; pass `items` for an ItemList), `docsArticleJsonLd` (docs, examples, blocks), `blogPostingJsonLd`, `blogJsonLd`, `faqPageJsonLd`, `studyJsonLd` / `datasetJsonLd` in `lib/research/structured-data.ts` (research pages), and `getProProductJsonLd` in `lib/pricing-info.ts`.
- **References:** the organization, website and author are defined once and referenced by `@id` (`/#organization`, `/#website`, `authorPerson` at `/#author`). Build URLs with `localUrl()` so translated pages point at their locale URL.
- **Breadcrumbs:** pass the crumbs the page shows. Every indexable page except the home pages needs a BreadcrumbList.
- **Only what the page shows:** FAQ entries come from the same array the accordion renders, and prices come from `proPlanInfo`. Never add `aggregateRating` or `review`, since there are no reviews.
- **Deliberate choices:**
  - Pro is a `Product`, not a `SoftwareApplication`, because that type's rich result needs reviews.
  - Block pages carry no price, because the price buys all of Pro.
  - There's no SearchAction, because ⌘K has no query URL.
- **New page type:** add a builder, render it through the page graph, and add a case to `lib/structured-data.test.tsx` with its required fields in `required`.

`lib/structured-data.test.tsx` checks one example of each page type. `scripts/check-structured-data.ts` runs in `pnpm build` and parses every built page.

## Research pages and data-backed copy

`/research/<topic>` pages turn HextaUI's own data into citable statistics. Each study is a pure function from rows to a `Study` (`lib/research/study.ts`), and the page, the `.md` twin, llms.txt "Cite this site for", JSON-LD, sitemap and tests all read that one object.

- **Studies:**
  - `computeShadcnStudy` (`lib/research/shadcn-components.ts`) reads `lib/shadcn-snapshot.json`. Refresh that file with `pnpm shadcn:snapshot`.
  - `computeBlockStudy` (`lib/research/block-components.ts`) reads the Pro catalog's `components`, which `scripts/build-pro.ts` collects from non-demo files.
  - `lib/research/index.ts` loads both, and `getStudies()` drops a study with no findings.
- **Numbers:**
  - Every number comes from the rows, never hand-typed.
  - Use the helpers in `lib/research/stats.ts`: `share`, `formatShare`, `compareShares` (under 5 points is "about the same"), `compareValues` (under 10% relative).
  - Any finding or comparison group under `minimumSample` (20) goes to `skipped` and is listed on the page as not reported.
  - Each finding states its denominator.
- **Anchors:** `finding-<id>`, `table-<id>` and `faq-<id>`, via the helpers in `study.ts`. Never rename an id, since AI answers link to them.
- **Dates:** `updated` is when the data changed (snapshot fetch date, or the Pro repo's last commit to `blocks/`), never the build time. Sitemap lastmod for `/research*` uses it.
- **Markdown and llms.txt:** `lib/research/markdown.ts` renders the study. `lib/md/registry.ts` and `lib/md/llms.ts` call it, so a new study needs no extra routes.
- **New study:** write a pure `compute…Study(rows)`, add it to `lib/research/index.ts`, add an OG entry (automatic via `getStudies()` in `lib/og-pages.ts`), and add cases to `lib/research/research.test.ts`.

Data-backed copy elsewhere:

- **Category pages:** titles and summary sentences come from `getCategoryList` in `lib/category-lists.ts` (count, Pro block usage, git-dated "Last reviewed"). A category under `minimumComponents` redirects to `/components` in `public/_redirects` and stays out of the sitemap.
- **Docs pages:** `<DocsGlance>` and the meta description come from `lib/entry-stats.ts` and `lib/docs-metadata.ts`.
- **Block pages:** `<BlockGlance>` and the meta description come from `lib/block-facts.ts`.
- **Tests:** `lib/category-lists.test.ts` checks that every linked list meets its minimum and matches the sitemap.
- **No filter pages:** don't add pages for intersections of filters.

