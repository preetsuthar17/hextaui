An e-commerce admin looks like a CRUD app: a table of orders, a page per order, a form per product. The tables are the easy part. The hard part is that every number in a store admin is money or stock, and both have to stay right while customers keep buying in the background.

This is what I learned building the admin side of a store in Next.js: orders tables with honest statuses, an order page that shows what is left to do, refunds that add up to the cent, inventory edits that survive live orders, and discounts merchants can read.

## Orders: two statuses, not one

The first mistake is a single `status` column. An order has at least two independent states: payment (pending, authorized, paid, partially refunded, refunded) and fulfillment (unfulfilled, partially fulfilled, fulfilled). "Paid and unfulfilled" is the list a merchant works from every morning, and one status column can't express it.

Show them as two pills. Don't let color carry the meaning. WCAG asks that color isn't the only way information is shown, and "Partially paid" in light orange next to "Paid" in green is hard to tell apart for many people. A text label plus a small glyph, an empty, half or full circle, reads at a glance.

## Saved views live in the URL

Merchants don't browse orders, they work through lists: Unfulfilled, Unpaid, Open. A saved view is just filters, a sort and a search. Keep the whole query in the URL so a link opens the same list and Back works, and read it on the server in Next.js:

```tsx
type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const query = parseOrdersQuery(await searchParams)
  const page = await listOrders(query)
  return <OrdersTable query={query} page={page} />
}
```

When the current filters differ from the saved view, mark the tab as modified and offer Reset, Update view and Save as new view, the same way a spreadsheet tells you a filter is on.

## New orders shouldn't move the row under the cursor

Orders arrive while the merchant is looking at the list. If new rows push everything down, the checkbox they were about to click becomes a different order. While a row is focused or anything is selected, hold new orders back behind a "1 new order · Show" pill, and only insert them at the top when nothing is in progress.

## Bulk actions fail partially

"Mark 6 orders as fulfilled" will sometimes fulfill 5. One is on hold, or was cancelled a minute ago. Design the API for it: return the ids that failed, each with a reason, and report exactly that.

```ts
type BulkResult = {
  succeeded: string[]
  failed: { id: string; reason: string }[]
}
```

The message then writes itself: "Fulfilled 5 orders. 1 couldn't be fulfilled: #1031 is on hold", with a link to that order. An all-or-nothing error toast would leave the merchant guessing which ones went through.

## The order page shows what's left

On the order page, split the items by what happened to them, not by how they were bought. Each shipment gets its own card with the carrier and tracking. Refunded items get theirs. And the card that matters most is what's still to ship:

```ts
function unfulfilledQuantity(line: OrderLine) {
  return line.quantity - line.fulfilledQuantity - line.refundedQuantity
}
```

The timeline under it should be built from the order's events, with short titles from the data ("Payment of $564.41 captured", "Shipped with UPS" with the tracking number linked), the exact time in a tooltip and repeated events of the same kind folded into one line. Staff comments sit in the same feed and post optimistically, with a retry if they fail.

## Refund math has to add up to the cent

Refunds are where admin code most often gets money wrong. A customer bought three items with a $10 order discount and tax, and returns one. How much do they get back?

Spread order-level amounts across lines in proportion to each line's price. Discounts by price, tax by price after discount. Splitting in integer cents leaves remainders, and the largest remainder method hands them out so the parts always add up to the original:

```ts
function allocate(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0)
  if (sum === 0) return weights.map(() => 0)
  const exact = weights.map((weight) => (total * weight) / sum)
  const parts = exact.map(Math.floor)
  let left = total - parts.reduce((a, b) => a + b, 0)
  const byFraction = exact
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction)
  for (const { index } of byFraction) {
    if (left === 0) break
    parts[index] += 1
    left -= 1
  }
  return parts
}
```

`allocate(1000, [3000, 3000, 3000])` gives `[334, 333, 333]`, which sums to exactly 1000.

There is a second trap. Refund one unit of a line today and the other two next week, and the totals must match refunding all three at once. Give each unit a cumulative slice of the line's share instead of rounding each refund on its own:

```ts
function unitsShare(lineShare: number, quantity: number, from: number, count: number) {
  const upTo = (units: number) => Math.floor((lineShare * units) / quantity)
  return upTo(from + count) - upTo(from)
}
```

`from` is how many units were already refunded. However the refunds are split, the slices add up to `lineShare`.

The rest of the refund screen is state handling. Shipping can be refunded up to what was paid minus what was already refunded. Money goes back to payment methods in a fixed order when an order was split across a gift card and a card. Send an idempotency key so a retried request never refunds twice, ask for confirmation on large refunds, and show "pending with the bank" as its own state rather than as success or failure.

## Inventory: adjust by, don't overwrite

The naive inventory editor sends the new number: "Sand / Large is 47". If two orders came in while the merchant was typing, saving 47 quietly undoes them.

Send changes as adjustments instead. "Received 5" is a delta, and deltas are safe to apply on top of anything that happened in between. When the merchant really means a count, "Set to 47" after a cycle count, turn it into a delta against the quantity they saw and let the server reject it if that quantity moved:

```ts
type Adjustment = {
  variantId: string
  delta: number
  basedOn: number
  reason: "received" | "cycle_count" | "damaged" | "correction"
}
```

A rejected row stays in the draft with a message such as "Quantity changed to 40 by another device", and Reapply sends it again on top of the new number. Shopify's `inventoryAdjustQuantities` mutation works the same way with its `changeFromQuantity` field.

Also split the number. On hand is what is in the building, but committed stock is already sold and unavailable stock is damaged or on hold. Merchants need to see available separately from on hand, or they sell stock that has already been sold.

## Discounts as a sentence

Discount forms are usually a long list of fields, and merchants can't tell what they built until a customer complains. Write the offer as one sentence with editable parts, "Customers get 15% off Ring Vase and Glass Carafe", put minimum purchase, customer eligibility, usage limits, combinations and schedule in collapsed rows that show their current value, and preview a sample checkout with the discount applied.

Warn about risky setups, like 100% off with no usage limit, and schedule in the store's time zone, not the browser's.

## One store, every page

The last piece is consistency. Refund an item and the order's payment status, its timeline, the customer's total spent and the stock you restocked should all change together. Have every mutation return the entities it changed and update or revalidate every view that shows them. And block navigation away from unsaved product, stock or discount edits, including the browser's Back button.

## The HextaUI blocks for this

These are the problems the admin blocks in HextaUI Pro are built around. [Orders Table](https://hextaui.com/blocks/orders-table) has saved views kept in the URL, separate payment and fulfillment pills with progress glyphs, and bulk actions that report partial failures. [Refund](https://hextaui.com/blocks/refund) does its math in `calculateRefund(order, selection)`, a pure function with tests that uses the largest remainder method. [Inventory](https://hextaui.com/blocks/inventory) saves adjustments, not overwrites, and lets merchants reapply rejected rows. [Discount Builder](https://hextaui.com/blocks/discount-builder) edits the offer as a sentence beside a live checkout preview.

[Commerce Dashboard](https://hextaui.com/blocks/commerce-dashboard) puts them together with Order Detail, Product Editor and Sales Overview into one store admin on a shared store, with hash routes by default or your Next.js routes through its router prop, and examples that map each action to the Shopify Admin API. The live preview is the full dashboard, so you can refund an order and watch every page update.

## FAQ

**Should an order have one status or two?** At least two: payment and fulfillment are independent, and merchants filter on combinations of them.

**How do I split a discount across refunded items?** In integer cents, in proportion to each line's price, using the largest remainder method so the parts add up exactly.

**Should inventory edits send the new quantity or the change?** The change. Deltas survive orders placed while the merchant was editing; a "set to" count should be checked against the quantity it was based on.

**Where should an admin's filters live?** In the URL, so views can be shared, reloaded and navigated with Back.
