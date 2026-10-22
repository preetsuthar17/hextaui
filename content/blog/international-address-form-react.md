Most address forms are a US address form with a country dropdown on top. City, State, ZIP code, in that order, for everyone. Then a shopper in London has no state to pick, a shopper in Berlin types the postal code before the city out of habit, and a shopper in Tokyo has to write their address backwards.

An address form is the longest form most stores have, and it is where autofill, validation and international users all meet. This is how to build one in React that works in every country you ship to.

## Country first, then the layout

The country decides which fields exist, what they are called, which are required and what order they go in. So ask for the country first, preselected from the shopper's locale or IP, and build the rest from data.

Some examples of how much changes:

| Country | Fields after the street | Region | Postal code |
| --- | --- | --- | --- |
| United States | City, State, ZIP code | Required | 12345 or 12345-6789 |
| United Kingdom | Town or city, Postcode | None | Like SW1A 1AA |
| Germany | Postal code, City | None | 5 digits |
| Japan | Postal code, Prefecture, City | Required | 123-4567 |
| Canada | City, Province, Postal code | Required | Like K1A 0B1 |

You don't have to research every country by hand. Google publishes the address metadata behind its libaddressinput library, with field order, labels, required fields and postal code patterns for most of the world. Pick the countries you ship to most and give them an exact format, and give every other country a plain fallback: two address lines, city, region and postal code, none of them strictly validated.

```ts
type Field = "address1" | "address2" | "city" | "region" | "postalCode"

type CountryFormat = {
  rows: Field[][]
  labels: Partial<Record<Field, string>>
  required: Field[]
  postalCode?: { pattern: RegExp; example: string }
  regions?: { code: string; name: string }[]
}

const countryFormats: Record<string, CountryFormat> = {
  US: {
    rows: [["address1"], ["address2"], ["city", "region", "postalCode"]],
    labels: { region: "State", postalCode: "ZIP code" },
    required: ["address1", "city", "region", "postalCode"],
    postalCode: { pattern: /^\d{5}(-\d{4})?$/, example: "94110" },
  },
  GB: {
    rows: [["address1"], ["address2"], ["city"], ["postalCode"]],
    labels: { city: "Town or city", postalCode: "Postcode" },
    required: ["address1", "city", "postalCode"],
    postalCode: {
      pattern: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
      example: "SW1A 1AA",
    },
  },
}
```

The form component then renders `format.rows` and never mentions a country by name.

## Fewer fields

Every field you show is one more thing to fill in and one more thing to get wrong.

- **One name field.** "Full name", not first and last. Plenty of names don't split into two parts, and the order differs between countries.
- **Line 2 behind a link.** "Add apartment, suite, etc." opens it. Most people don't need it. If autofill or address search fills it, show it.
- **Company behind a link too**, for the few B2B orders.
- **Phone optional, with the reason.** "For delivery questions only" under the field gets more numbers than a required field gets real ones.

## Autofill does most of the work

Browser autofill can fill the whole form in one tap, but only if every input has a `name` and the right `autocomplete` token. Prefix the tokens with `shipping` or `billing` so the browser knows which saved address goes where:

```tsx
<Input name="name" autoComplete="shipping name" />
<Input name="address1" autoComplete="shipping address-line1" />
<Input name="address2" autoComplete="shipping address-line2" />
<Input name="city" autoComplete="shipping address-level2" />
<Input name="region" autoComplete="shipping address-level1" />
<Input
  name="postalCode"
  autoComplete="shipping postal-code"
  inputMode={country === "US" ? "numeric" : "text"}
/>
<Input name="phone" type="tel" autoComplete="shipping tel" />
```

`address-level1` is the state, province or prefecture, and `address-level2` is the city. When billing is different from shipping, render a second form with `billing` tokens, so the browser doesn't fill the billing form with the shipping address.

Don't use `type="number"` for postal codes. ZIP codes start with zeros, UK and Canadian codes have letters, and number inputs come with spinners and scroll-wheel changes. Use a text input with `inputMode="numeric"` only where codes are purely digits.

## Postal code lookup

In some countries the postal code already tells you the city and region. Japan is the classic case: addresses start with the postal code, and the code alone identifies the prefecture and city. When the shopper finishes the postal code, look it up and fill city and region, but never overwrite something they already typed. Their input wins over your data.

## Address search

Address search, typing the start of an address and picking a suggestion, is faster than any form on mobile. Google Places and Mapbox both offer it as two calls: one that suggests addresses for what was typed, and one that turns the picked suggestion into structured fields.

A few rules for wiring it up:

- Wait for a pause in typing and abort the previous request, the same as any search box.
- Always end the list with "Enter address manually". The street may be new, or the suggestion may be wrong.
- After a pick, fill the fields and show them, so the shopper can check the result and add an apartment number.
- Google's Places API uses session tokens to group the suggest and details calls of one search. Use them, or the calls may be billed separately.

## Errors that say what's wrong

Validate a field when the shopper leaves it, then live as they type until it is fixed. Write the error for the country: "Enter a 5-digit ZIP code" in the US, "Enter a postcode like SW1A 1AA" in the UK. "Invalid postal code" helps no one.

On submit, list every problem in a summary at the top of the form, link each one to its field and move focus to the summary. Connect each error to its input with `aria-describedby` and set `aria-invalid`, so screen readers read the message with the field.

Normalize before you validate: trim spaces, uppercase UK and Canadian postcodes and accept them with or without the space. Rejecting "sw1a1aa" when you could fix it is your bug, not the shopper's.

## Switching country

People change the country after typing half the address more often than you would think. When they do, keep what still fits (name, street lines, phone), clear the region if the new country has a different list, and re-check only the fields they already touched. Showing fresh errors on fields they haven't reached yet feels like being scolded for something they didn't do.

## Store the structure, not the string

Save the address as fields plus an ISO country code, not as formatted lines. You will need the structure for tax, shipping rates and carrier labels, and you can always format it for display. A one-line summary such as "12 Mission St, San Francisco, CA 94110" is a view of the data, not the data.

## A checklist

- Country first, then fields, labels and order from a per-country format.
- An exact format for your main countries and a forgiving fallback for the rest.
- One name field, line 2 and company behind links, phone optional with a reason.
- A `name` and a `shipping` or `billing` autocomplete token on every input.
- Text inputs for postal codes, numeric keyboards only where codes are digits.
- Postal code lookup that never overwrites typed values.
- Address search with a manual entry option at the end.
- Country-specific error copy and a linked summary on submit.

## The HextaUI block for this

The [Address Form](https://hextaui.com/blocks/address-form) block in HextaUI Pro is built on these rules. Sixteen countries have their own format with labels, required fields, region lists and postal rules, and every other country gets a plain fallback. Every input has the right autocomplete token with a shipping or billing prefix. `onSearchAddress` and `onResolveAddress` connect address search, with an example for Google Places, and the same two calls map onto Mapbox. `onLookupPostalCode` fills city and region without overwriting anything typed, and `validate()` lists every problem in a linked summary. SavedAddresses and AddressSummary cover signed-in shoppers and the finished "Ship to" row.

The [Checkout](https://hextaui.com/blocks/checkout) block uses it for delivery. If you are building the rest of that page, I wrote up [a one-page checkout in React and Next.js](https://hextaui.com/blog/one-page-checkout-react-nextjs) as well.

## FAQ

**Should the country field come first?** Yes. It decides which fields exist and what order they go in, so it has to be chosen before the rest makes sense.

**Should I use first name and last name fields?** Use one full name field unless a carrier or payment provider requires the split.

**What input type should a postal code use?** A text input, with `inputMode="numeric"` only for countries whose codes are all digits.

**Do I need address validation from an API?** It helps, but don't block the order on it. Suggest a correction and let the shopper keep what they typed.
