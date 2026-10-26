<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

After making changes, run `pnpm lint` and fix all errors.

## Structured data

JSON-LD is built by the functions in `lib/structured-data.ts` and rendered with `<JsonLd>` from `components/site/json-ld.tsx`, which escapes `<`. Don't hand-write JSON-LD objects in pages.

- **One graph per page:** every page has exactly two scripts. The root layout renders `siteJsonLd()` (WebSite, Organization, SoftwareSourceCode), and the page renders one `@graph`. Add extra nodes with `pageJsonLd({ extra })` or `<InfoPage structuredData={[…]}>`, never as a second script.
- **Builders:** `pageJsonLd` (WebPage, AboutPage, ContactPage or CollectionPage; pass `items` for an ItemList), `docsArticleJsonLd` (docs, examples, blocks), `blogPostingJsonLd`, `blogJsonLd`, `faqPageJsonLd`, and `getProProductJsonLd` in `lib/pricing-info.ts`.
- **References:** the organization, website and author are defined once and referenced by `@id` (`/#organization`, `/#website`, `authorPerson` at `/#author`). Build URLs with `localUrl()` so translated pages point at their locale URL.
- **Breadcrumbs:** pass the crumbs the page shows. Every indexable page except the home pages needs a BreadcrumbList.
- **Only what the page shows:** FAQ entries come from the same array the accordion renders, and prices come from `proPlanInfo`. Never add `aggregateRating` or `review`, since there are no reviews.
- **Deliberate choices:**
  - Pro is a `Product`, not a `SoftwareApplication`, because that type's rich result needs reviews.
  - Block pages carry no price, because the price buys all of Pro.
  - There's no SearchAction, because ⌘K has no query URL.
- **New page type:** add a builder, render it through the page graph, and add a case to `lib/structured-data.test.tsx` with its required fields in `required`.

`lib/structured-data.test.tsx` checks one example of each page type. `scripts/check-structured-data.ts` runs in `pnpm build` and parses every built page.
