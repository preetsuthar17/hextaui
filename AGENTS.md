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

## Fonts

Inter and Paper Mono are self-hosted subsets cut by `scripts/fonts/subset.py`. The script isn't part of the build. Run it by hand and commit what it writes: `app/fonts/*.woff2` and the generated `app/fonts/index.ts`. Don't edit those files by hand.

- **Run:** `pnpm build`, then `pnpm fonts:subset`. It needs `uv`, which installs pinned fontTools, brotli and uharfbuzz on the fly. `pnpm fonts:check` exits 1 when the committed fonts no longer match the built site.
- **Rerun when:**
  - content gains a non-ASCII character outside Latin-1 and Latin Extended-A, such as a new symbol, arrow or Turkish letter;
  - the site starts using a Latin-1 letter it didn't use before, since used letters belong in the core file;
  - code renders text that only appears after interaction (toasts, dialogs, ⌘K), since the script reads those characters from `app`, `components`, `content`, `hooks`, `lib` and `pro/blocks`;
  - a page turns on `hyphens: auto`. The script then adds U+2010 to the core on its own.
- **Edit `FONTS` in the script first when:** a page uses a weight under 400, or an OpenType feature beyond the defaults and tabular numbers (for example `slashed-zero`, `ordinal` or `font-feature-settings`). The subsets drop everything else.
- **Two files per font:**
  - The core is preloaded. It holds ASCII, curly quotes, dashes, the ellipsis, the minus sign, and every used character that Google's preloaded latin file drew before self-hosting.
  - The extended file loads through `unicode-range` only on pages that need one of its characters.
  - Both files share one family name. A fallback face between them would draw the extended characters before the real font did.
- **Same rendering as Google Fonts:**
  - Inter only covers what Google's seven subset files drew. Characters such as ⌘ → ← ✓ and the U+2010 hyphen stay on the fallback fonts, as before.
  - Accented letters stay in the core because kerning and mark placement don't cross font files.
  - `wght` starts at 400. `opsz` and the top of `wght` keep their full ranges, because clipping them changes outlines.
  - The no-break space U+00A0 is always in the core, because recharts measures it on every chart page.
  - Glyph names and the source bounding box are kept, because Chrome on macOS antialiases small text differently without them.
- **Fallback:** `Inter Fallback` in `app/globals.css` keeps Google's metric overrides. `next/font/local` would compute different ones, so its automatic fallback is off.
- **Licenses:** both fonts are OFL with no Reserved Font Name, so the subsets keep their names. The script stops if a source font ever declares one.

