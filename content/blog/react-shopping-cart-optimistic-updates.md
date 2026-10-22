A shopping cart is the first piece of a store that has to feel instant and be correct at the same time. Press plus and the number should change now, not after a round trip. But the server owns stock, prices and discounts, and it will sometimes say no.

This is how I build a cart in React and Next.js that does both: money stored as integers, optimistic updates that roll back cleanly, merged requests, undo instead of confirm dialogs, and a free shipping bar that doesn't lie.

## Start with money

Before any UI, fix how you store money, or every total after this will be slightly wrong.

```ts
0.1 + 0.2
```

That is `0.30000000000000004`, and a cart adds a lot of numbers. Store amounts as integers in the currency's smallest unit, cents for USD and yen for JPY, which has no minor unit. This is also what Stripe and most payment APIs send and expect.

```ts
type Money = { amount: number; currency: string }

function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Can't add ${a.currency} to ${b.currency}`)
  }
  return { amount: a.amount + b.amount, currency: a.currency }
}

function formatMoney(money: Money, locale: string) {
  const format = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currency,
  })
  const digits = format.resolvedOptions().maximumFractionDigits ?? 2
  return format.format(money.amount / 10 ** digits)
}
```

`formatMoney({ amount: 4800, currency: "USD" }, "en-US")` gives $48.00, and the same amount in JPY gives ¥4,800. `Intl.NumberFormat` handles symbols, grouping and decimals per locale, so 48,00 € in Germany comes for free. Payment providers have a few currencies where their minor unit differs from the ISO standard, so check your provider's list once.

Refusing to add two currencies is not paranoia. It catches the bug where a cart in EUR receives a shipping rate in USD.

## Optimistic updates that roll back

The cart should change the moment someone presses plus: quantity, line total and subtotal. The request runs behind it. If it fails, the line goes back to the last quantity the server confirmed and says why under the line, for example "Only 2 left in Sand / Large".

React 19's `useOptimistic` fits this well. The optimistic value shows while the transition runs, and React drops it when the transition ends, so a failure rolls back without extra code:

```tsx
const [cart, setCart] = useState(initialCart)
const [shownCart, showChange] = useOptimistic(cart, applyLineChange)

function changeQuantity(lineId: string, quantity: number) {
  startTransition(async () => {
    showChange({ lineId, quantity })
    const result = await updateLine(lineId, quantity)
    startTransition(() => {
      if (result.ok) setCart(result.cart)
      else setLineError(lineId, result.message)
    })
  })
}
```

Two rules keep it honest. The server returns the whole cart after every change, and that cart replaces yours, so totals, discounts and shipping always come from one place. And the line's error stays until the shopper changes that line again, because a message that disappears before it is read is the same as no message.

In Next.js, `updateLine` can be a server action. Next.js hides thrown error messages from server actions in production, so return `{ ok: false, message }` for errors you want to show instead of throwing.

## Merge quick presses

Someone who wants five of something presses plus four times in a second. Sending four requests creates four chances to fail and four responses that can arrive out of order. Send one request with the final quantity instead.

```ts
const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

function pressQuantity(lineId: string, quantity: number) {
  showLocally(lineId, quantity)
  clearTimeout(timers.current.get(lineId))
  timers.current.set(
    lineId,
    setTimeout(() => commitQuantity(lineId, quantity), 400)
  )
}
```

Send the absolute quantity, never "plus one". An absolute value is safe to retry and safe to receive late. If two requests for the same line do overlap, ignore any response that is older than the latest one you sent.

## Undo instead of "Are you sure?"

A confirm dialog on remove adds a step to every removal to protect against the rare mistake. Undo protects against the same mistake and costs nothing when there isn't one.

Collapse the removed line into a short row, "Removed Ring Vase · Undo", for about five seconds, and slide the lines below up into place. Undo puts the line back where it was, not at the bottom. You can remove it on the server right away and add it back on undo, or wait until the row expires. Removing right away keeps the server's cart correct if the tab closes, so I prefer it, with the original position kept on the client.

Announce the removal through a polite live region and keep focus somewhere sensible, on the Undo button or the next line, rather than letting it fall back to the page.

## Lines that went stale

A cart can sit in a tab for days. When it is loaded again, the server should mark lines whose price changed since they were added ("Price dropped to $58") and lines that sold out. A sold-out line blocks checkout until it is removed, and the reason sits on the line itself, not in a toast.

## A free shipping bar that tells the truth

"Add $12.00 more for free shipping" is one of the few cart messages people actually like. Two things to get right:

- **Use the same subtotal as the server.** If free shipping is calculated after discounts, the bar must be too, or the bar says you qualify and checkout charges shipping.
- **Celebrate once.** Play a short moment when the threshold is crossed, then show a quiet "You get free shipping". Don't replay it on every render or every time the drawer opens.

Use a real progress element with a text label, so the bar reads as "$138 of $150" rather than a colored stripe.

## The add to bag button and the badge

Small things the shopper sees on every product page:

- The button keeps its width while it moves from label to spinner to check, so nothing next to it jumps.
- The spinner waits about 300ms before it appears. Most adds finish faster and never need it.
- The bag badge changes only the digit that changed, and the drawer opens or a short confirmation shows, so people know where the item went.

## A checklist

- Money as integers in minor units, formatted with `Intl.NumberFormat`.
- Never add two currencies.
- Optimistic quantities, rolled back to the last confirmed cart with a message on the line.
- Quick presses merged into one request with the final quantity.
- Undo on remove for about five seconds, restoring the line's position.
- Stale prices and sold-out lines flagged on the line, blocking checkout when needed.
- Free shipping progress from the same subtotal as the server.

## The HextaUI blocks for this

These are the rules behind the [Cart](https://hextaui.com/blocks/cart) block in HextaUI Pro. It has an AddToCartButton, a CartTrigger with a live count, and a CartDrawer that slides in from the right on desktop and up from the bottom on phones, plus a CartPanel for a full cart page. Quick presses merge into one request, a failed callback rolls the line back and shows your message, removed lines collapse into an Undo row for five seconds, and the same logic is exported as `useOptimisticCart` for your own layouts. Its examples cover the Shopify Storefront API and Next.js server actions.

[Order Summary](https://hextaui.com/blocks/order-summary) takes the same cart shape for checkout, with discount codes, estimated taxes and lines whose price changed. Both use the money helpers from [Price](https://hextaui.com/blocks/price), which work in integer minor units and refuse to add two currencies. You can try them all in the live previews.

When the cart is done, the next step is checkout: [a one-page checkout in React and Next.js](https://hextaui.com/blog/one-page-checkout-react-nextjs).

## FAQ

**Should I store prices as floats?** No. Store integers in the currency's minor unit and only divide when formatting.

**Should cart updates be optimistic?** Yes for quantity and remove, as long as the server's cart replaces yours after every change and failures roll back with a reason.

**Undo or a confirmation dialog when removing an item?** Undo. It is faster when people mean it and just as safe when they don't.

**How do I avoid a request for every plus press?** Wait a few hundred milliseconds after the last press and send the final quantity.
