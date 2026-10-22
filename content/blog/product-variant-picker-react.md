A shirt in three colors and five sizes is fifteen products as far as your warehouse is concerned. Stock lives on each combination, not on "Oat" or "Large". Most variant pickers ignore that. They render colors and sizes as two independent lists, and the shopper finds out that Oat doesn't come in XL when Add to bag fails.

This is how to build a product variant picker in React that tells the truth about stock: sold-out sizes, combinations that don't exist, back-in-stock emails, and photos and prices that follow the choice.

## Model variants, derive options

Start from the variants, because that is what your commerce API returns and what an order points at:

```ts
type Variant = {
  id: string
  options: Record<string, string>
  available: boolean
  quantity?: number
  price: Money
  imageId?: string
}

type Product = {
  options: { name: string; values: string[] }[]
  variants: Variant[]
}
```

Every value on screen gets one of three states, worked out from the variants and the rest of the current selection:

- **Available**: some variant with this value and the other chosen options has stock.
- **Sold out**: the combination exists but has no stock right now.
- **Unavailable**: the combination is not made at all.

```ts
type ValueState = "available" | "sold-out" | "unavailable"

function getValueState(
  product: Product,
  selection: Record<string, string>,
  name: string,
  value: string
): ValueState {
  const wanted = { ...selection, [name]: value }
  const matches = product.variants.filter((variant) =>
    Object.entries(wanted).every(
      ([key, chosen]) => variant.options[key] === chosen
    )
  )
  if (matches.length === 0) return "unavailable"
  return matches.some((variant) => variant.available) ? "available" : "sold-out"
}
```

This gives you the behavior shoppers expect without special cases. A color stays available while any of its sizes is in stock. A size is crossed out only for the colors it is sold out in. Pick a different color and the sizes update.

It is a pure function, so it runs on the server too. Render the first paint with the right states instead of flashing every size as available and then crossing some out.

## Swatches and buttons, never a dropdown

A `<select>` hides the one thing people came to check, whether their size is in stock. Show colors as swatches and sizes as buttons, so the whole picture is visible at once.

Semantically each option is a radio group. Use real radio inputs, or `role="radiogroup"` with roving focus, so arrow keys move between values and the group has a name. Expose the state to assistive technology as well, because a strike-through line is invisible to a screen reader and easy to miss for everyone else:

```tsx
<label className="swatch" data-state={state}>
  <input
    type="radio"
    name="size"
    value={size}
    checked={selection.size === size}
    onChange={() => select("size", size)}
    disabled={state === "unavailable"}
    aria-describedby={state === "sold-out" ? "size-sold-out" : undefined}
  />
  {size}
</label>
```

Above the swatches, show the chosen value as text ("Color: Oat"). On hover, preview the hovered value's name there, so people don't have to guess a color from a 32px circle.

## Sold out should still be selectable

The common mistake is to disable sold-out sizes. That hides the most useful information, which sizes exist, and it removes the path to a back-in-stock email.

Keep sold-out values selectable. When the chosen variant is sold out, swap Add to bag for a "Notify me when it's back" form that stores the variant id, not the product id, so the email is about Oat in Large rather than "this shirt".

Only combinations that don't exist should be disabled, and they should say why in the accessible name: "XL, not made in Oat".

## Don't preselect the size

Preselecting the first size is how stores ship a lot of size S. Preselect the color, since it is what the photo already shows, and leave size empty.

When someone presses Add to bag without a size, don't silently fail and don't open an alert. Mark the size group with "Select a size", move focus to it and give it a short shake that reduced motion turns off.

```ts
function addToBag() {
  const missing = product.options.find((option) => !selection[option.name])
  if (missing) {
    setError(missing.name, `Select a ${missing.name.toLowerCase()}`)
    groupRefs.current[missing.name]?.focus()
    return
  }
  add(findVariant(product, selection))
}
```

## Switching to a combination that doesn't exist

The shopper has Large selected, then picks a color that only comes in Small and Medium. You have two choices: block the color, or accept it and clear the size. Clearing the size is better, because color is usually the bigger decision. But tell them. A polite live region with "Large isn't made in Rust. Select a size." keeps screen reader users from adding the wrong thing, and the visible size group shows the empty selection for everyone else.

## Photos and price follow the choice

When a color changes, the gallery should go to that color's photo. Crossfade to it in place rather than sliding past every image in between, and wait for the new image to decode so the frame never flashes empty. Let the shopper keep browsing the other photos afterwards. The variant decides where the gallery starts, not where it is locked.

Prices can differ per variant too. Before a full selection, show a range, "From $28". Once a variant is chosen, show its price, its compare-at price struck through if it is on sale, and its stock in words: "Only 3 left", "Pre-order, ships Nov 12" or "Backordered". Use tabular figures for the price so the line doesn't shift when the digits change.

## Put the selection in the URL

`?color=Oat&size=L` makes a variant shareable, survives a reload and lets ads and emails link to the exact product a shopper saw. Read it back carefully, dropping anything the product doesn't have:

```ts
function selectionFromSearchParams(product: Product, params: URLSearchParams) {
  const selection: Record<string, string> = {}
  for (const { name, values } of product.options) {
    const value = params.get(name.toLowerCase())
    if (value && values.includes(value)) selection[name] = value
  }
  return selection
}
```

In Next.js, read `searchParams` in the page so the server renders the right variant, and update the URL from the client when the selection changes. Decide whether each change should add a history entry or replace the current one, and be consistent about it.

## A checklist

- Derive option states from variants: available, sold out, unavailable.
- Swatches and buttons in radio groups, with the state in the accessible name.
- Sold-out values stay selectable and offer a back-in-stock email per variant.
- Size is never preselected, and a missing size is flagged and focused.
- A color change that invalidates the size clears it and says why.
- The gallery and price follow the variant without locking the gallery.
- The selection lives in the URL.

## The HextaUI blocks for this

I built these rules into the [Variant Picker](https://hextaui.com/blocks/variant-picker) block in HextaUI Pro. It works out every option from the variants you pass, keeps sold-out values selectable with a NotifyMe form, never preselects sizes and flags a missing one with "Select a size". Its helpers, `findVariant`, `getOptionStates`, `getInitialSelection`, `getPriceRange` and the search param pair, work on their own, on the server too, and `fromShopify` maps a Storefront API product.

It pairs with [Product Gallery](https://hextaui.com/blocks/product-gallery), which crossfades to a variant's photo when you pass `activeId`, and [Price](https://hextaui.com/blocks/price), which formats any currency and rolls only the digits that changed. All three have live previews you can try before buying.

If you are building the cart next, the same care applies there: [shopping cart UX in React](https://hextaui.com/blog/react-shopping-cart-optimistic-updates).

## FAQ

**Should sold-out sizes be disabled?** No. Keep them selectable and offer a back-in-stock email. Disable only combinations that are not made at all.

**Should I preselect a size?** No. Preselect the color if you like, and validate the size when someone adds to bag.

**Swatches or dropdown for variants?** Swatches and buttons. A dropdown hides stock, which is the information people are looking for.

**How do I keep a variant in the URL?** Use one search param per option, read it on the server for the first render, and ignore values the product doesn't have.
