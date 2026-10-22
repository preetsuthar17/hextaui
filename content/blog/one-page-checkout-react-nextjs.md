Most checkout tutorials end at a form and a Pay button that calls Stripe. That part works on the first try. What loses orders is everything around it: the card that gets declined, the bank that wants a 3-D Secure check, the shipping rate that changes with the ZIP code, the request that never comes back and the shopper who presses Pay a second time.

This is how I structure a one-page checkout in React and Next.js, with the states that matter and a small piece of code for each. It works with shadcn/ui or any other component set. The hard part is the flow, not the styling.

## One page, three steps that fold up

A one-page checkout keeps everything in view: no page loads between steps, and the browser's Back button can't throw away half a form. But one long form is a wall. The fix is three steps on the same page, contact, delivery and payment, where only one is open at a time.

When a step is done it folds into a summary row, so a finished checkout reads like a receipt:

```text
Contact   maya@example.com                         Change
Ship to   12 Mission St, San Francisco, CA 94110   Change
Method    Standard · Arrives Oct 26 – 28 · Free    Change
```

The state behind it is small. Keep the list of finished steps and derive the open one:

```ts
const steps = ["contact", "delivery", "payment"] as const
type Step = (typeof steps)[number]

function openStep(done: Step[], editing: Step | null): Step {
  return editing ?? steps.find((step) => !done.includes(step)) ?? "payment"
}
```

Two details make it feel right. When someone presses Change, move focus to the heading of the step that opened, or keyboard and screen reader users are left on a button that no longer exists. And when the shopper is signed in, skip contact and start at delivery with their default address.

On wide screens the order summary sits beside the form. On phones it folds into a "Show order summary" bar above the form that still shows the total, because the total is the one number people keep checking.

## Validate on blur, summarize on Pay

Show a field's error when the shopper leaves it, then update it live as they type so it clears the moment it is fixed. Never while they are still typing the first time.

Don't disable Pay until the form is valid. A disabled button can't tell anyone what is missing. Let them press it, then put one summary at the top that lists every problem, link each item to its field and move focus to the summary. The GOV.UK Design System's error summary is a good reference for the pattern.

## Rates and taxes follow the address

Shipping rates and tax depend on the address, so they can only load once the address is complete. Wait for a short pause in typing, cancel the previous request when the address changes again, and show "Calculating…" in the summary instead of a stale number.

```ts
useEffect(() => {
  if (!isComplete(address)) return
  const controller = new AbortController()
  const pause = setTimeout(async () => {
    setQuote({ status: "loading" })
    try {
      const [rates, tax] = await Promise.all([
        getRates(address, controller.signal),
        estimateTax(address, controller.signal),
      ])
      setQuote({ status: "ready", rates, tax })
    } catch {
      if (!controller.signal.aborted) setQuote({ status: "error" })
    }
  }, 300)
  return () => {
    clearTimeout(pause)
    controller.abort()
  }
}, [address])
```

When new rates arrive, keep the chosen rate if it is still offered. If it isn't, pick the cheapest one and say so: "Express isn't available for this address." Silently switching the method is how people end up paying for shipping they didn't choose.

## Express pay goes first

Apple Pay, Google Pay, Shop Pay and PayPal replace the whole form, so they belong at the top, above contact, with an "Or pay with card" divider under them. Putting them next to the Pay button means the shopper has already typed their address by the time they see the faster way. Only render wallets the browser can actually use. Stripe's Express Checkout Element and similar SDKs work that out for you.

## Pay is a state machine, not a boolean

`isSubmitting` can't describe what happens after Pay. Give the server's answer a type instead:

```ts
type PlaceOrderResult =
  | { status: "succeeded"; orderId: string }
  | { status: "declined"; code: string }
  | { status: "requires_action"; clientSecret: string }
  | { status: "changed"; changes: PriceChange[] }
```

Then handle every case on purpose.

**Pay can't run twice.** A double click fires two handlers before React re-renders, so a `disabled={pending}` check is not enough. Guard with a ref, and lock the Change buttons while an order is placing so the cart can't move under the payment.

```ts
const placing = useRef(false)

async function pay() {
  if (placing.current) return
  placing.current = true
  try {
    handleResult(await placeOrder(draft, attemptKey))
  } finally {
    placing.current = false
  }
}
```

**Every attempt gets an idempotency key.** Create it with `crypto.randomUUID()` when Pay is pressed and send it with the payment request. Stripe and most payment APIs accept one, and a retried request with the same key can't charge twice.

**Leaving mid-payment asks first.** Add a `beforeunload` listener while a payment runs and remove it when it settles.

## Declines need words, not "Something went wrong"

A decline is the most common failure in checkout and the one with the worst copy. Map the codes you get back to sentences that tell people what to do, move focus to the message and keep the card details filled in:

```ts
const declineCopy: Record<string, string> = {
  insufficient_funds: "Your card has insufficient funds. Try another card.",
  expired_card: "This card has expired. Check the date or use another card.",
  incorrect_cvc: "The security code doesn't match. Check it and try again.",
}

const fallbackDecline =
  "Your bank declined this payment. Try another card or contact your bank."
```

`requires_action` is not an error. It means the bank wants 3-D Secure, which is routine in Europe under strong customer authentication. Keep the processing state, open the bank's challenge in a dialog labelled "Confirm with your bank" and continue when it resolves.

## When the price changed since the cart

Prices, stock and discounts can change between the cart and Pay. Send the total the shopper saw with the order, reprice on the server and refuse to charge if they differ:

```ts
"use server"

export async function placeOrder(draft: Draft, key: string) {
  const cart = await repriceCart(draft.lines)
  if (cart.total !== draft.expectedTotal) {
    return { status: "changed", changes: diffLines(draft, cart) } as const
  }
  return chargeAndCreateOrder(cart, draft, key)
}
```

On the client, update the summary, strike through the old total and list each change in plain words, such as "Ring vase is now $74, was $68." The shopper presses Pay again at the new amount. An item that sold out during checkout works the same way: take it out of the total, flag it and let them remove it or continue without it.

## When the payment never answers

Sometimes the request hangs. The worst thing you can show after a timeout is "Try again", because the first charge may have gone through. After a reasonable wait, say "Checking your payment status…" and poll a status endpoint with the same idempotency key until you know whether an order exists. Only offer a new attempt when the server says the old one failed.

## A checklist

- Steps fold into summary rows, and Change moves focus to the reopened step.
- Errors on blur, one linked summary on Pay, no disabled Pay button.
- Rates and tax wait for a full address, cancel stale requests and never show a stale total.
- Express wallets at the top, only the ones the browser supports.
- A ref guard, an idempotency key and a `beforeunload` prompt around Pay.
- Specific copy per decline code, with the form still filled in.
- 3-D Secure as a step, not an error.
- Changed prices and sold-out items stop the charge and explain themselves.
- A timeout checks status instead of offering to pay again.

## Building it with shadcn/ui

shadcn/ui gives you the inputs, radio groups and collapsibles for all of this. The flow above is the part you write yourself, and it is most of the work.

I built it once as the [Checkout](https://hextaui.com/blocks/checkout) block in HextaUI Pro, made from the free HextaUI components. It takes the cart and three callbacks, `onGetRates`, `onEstimateTax` and `onPlaceOrder`, and handles the four results above. If `onPlaceOrder` doesn't answer within 20 seconds, it polls `onCheckStatus` with the same idempotency key instead of offering to pay again. It comes with examples for Stripe PaymentIntents with server actions, a Shopify checkout handoff and Medusa. It uses the [Payment](https://hextaui.com/blocks/payment) block for wallets, cards, declines and 3-D Secure, and the [Address Form](https://hextaui.com/blocks/address-form) for delivery. Every block has a live preview you can click through before deciding anything.

If your store runs on Shopify, use Shopify's hosted checkout rather than rebuilding it. A custom checkout makes sense when you take payment yourself.

## FAQ

**Is a one-page checkout better than a multi-step one?** For most stores, a single page with steps that fold up gets the best of both: everything stays in view, and people only face one section at a time.

**Should I disable the Pay button until the form is valid?** No. Let people press it and show a summary of what is missing, with links to each field.

**How do I stop double charges?** Guard the handler with a ref, send an idempotency key with every attempt, and check the status of a timed-out payment instead of letting people pay again.

**Where should Apple Pay and Google Pay go?** At the top of the checkout, before contact details, because they replace the rest of the form.
