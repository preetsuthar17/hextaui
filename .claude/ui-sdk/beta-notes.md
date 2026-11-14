# UI SDK beta: bugs and gaps found while building HextaUI components

The first six components were built on 0.1.0-beta.1. HextaUI moved to 0.1.0-beta.2 on 2026-11-14, before the second batch.

## 0.1.0-beta.2 (published 2026-11-13)

- **What changed.** `@ui-sdk/core`: a modal opened over another modal is no longer made inert by the one underneath (d699609), and the preferences script reads the first of two same-named cookies, like the server (c53df2f). `@ui-sdk/react`: a disabled or pending `Button` rendered as a router link no longer navigates (04754a0), and a `SelectTrigger` connected through `controller` outside its `Select` takes its `Field`'s id and label in the server HTML (3aa0973). The source diff from beta.1 touches only `core/foundation/popups/popup.ts`, `core/foundation/storage/storage.ts`, `react/button.tsx` and `react/select.tsx`.
- **Earlier bugs it fixed: none.** None of the beta.1 bugs below sits in those four files, so every one of them still applies. The six beta.1 components and their 39 tests pass unchanged on beta.2.

## Global

- **`data-slot` can't be overridden.** Managed attributes win over props. A wrapper that passes `data-slot="color-picker-trigger"` to `Popover.Trigger` still renders `data-slot="popover-trigger"`. Base UI lets the caller's prop win. As a result, a styled kit can't give composed parts their own slot names, and CSS or tests have to target the primitive's slot.
- **The cascade layer is required.** Global CSS must declare `@layer ui-sdk;` above `@import "tailwindcss"`. Without it, UI SDK's own CSS lands outside any layer and beats Tailwind utilities. This is easy to miss in a copy-in registry, so every docs page has to say it.
- **No DirectionProvider.** Direction is read from the DOM (`dir` on an ancestor). That works, but React-only direction (a Base UI-style `DirectionProvider`) has no equivalent.
- **Version pinning.** pnpm's `minimumReleaseAgeExclude` needed both packages, because 0.1.0-beta.1 is newer than the repo's release-age gate.

## Color Picker

- **RTL mirrors everything.** The area gradient flips (`linear-gradient(to left, …)`), the slider gradients flip, and ArrowRight lowers saturation in RTL. That's consistent, but unlike most design tools, which keep the color axis fixed. This is worth documenting upstream.
- **Hex inputs in RTL.** A hex value such as `#ec4899` renders as `ec4899#` in an RTL input. The parts don't set `dir` on their inputs, so HextaUI sets `dir="auto"`.
- **Vertical thumbs at the ends.** A thumb at 0% or 100% is centered on the track's end, so half of it overflows the track. This matches horizontal, but in a tight popover it can clip unless there is padding.
- **No gaps found in:** keyboard (arrows, Shift+arrows, PageUp/PageDown, Home/End), touch drag (no page scroll during a drag), the eyedropper's `data-unsupported` flag, form reset, and SSR (`--color-picker-color` is in the server HTML).

## Token Input and Trigger Menu

- **The empty state can't show on first use.** `TriggerMenuEmpty` marks itself present (`hasEmpty`) only when it binds, and it lives inside `TriggerMenuContent`, which only mounts while there are matches. If the first query on a page matches nothing (type `@q`), the menu stays closed and "No matches" never appears. Once the menu has opened once, the empty state works. Reproduced in Chromium with the docs' own composition.
- **`keepMounted` breaks caret anchoring.** With `keepMounted` on `TriggerMenuContent`, the popup anchors to the editor's start instead of the caret. That also rules it out as a workaround for the empty-state bug.
- **`TokenInputTokenRemove` is a `span`** hidden from assistive technology. That's intentional (Backspace is the keyboard path), but it means there is no focusable remove control for switch or voice users.
- **Token hosts carry an sr-only kind label.** The host's `innerText` includes the token type (for example "routes.ts\nfile"), which can surprise tests that read text.

## Rating

- **Read-only keeps its radios in the DOM.** A read-only rating is `role="img"` with an `aria-label` from `getValueLabel`, but the five radio inputs still render inside it. They're presentational under `img`, so screen readers skip them, but it's extra DOM for lists of read-only averages.
- **No gaps found in:** arrow keys at whole and half steps, `deselectable`, `required` blocking a form submit with the native message, the controller, SSR (`--rating-fill` is in the server HTML), RTL fill direction, touch taps at 390px.

## Tree

- **`data-selected` is an empty attribute, and shadcn's `data-selected:` variant doesn't match it.** `shadcn/tailwind.css` defines `@custom-variant data-selected` as `[data-selected="true"]`. Its `data-open`, `data-checked` and `data-disabled` variants also match a bare attribute, but `data-selected` doesn't. UI SDK writes `data-selected=""`, so `data-selected:bg-muted` silently does nothing in any shadcn project. HextaUI uses `data-[selected]:`. Either side could fix this: shadcn could widen the variant, or UI SDK could document it.
- **jsdom needs `Element.prototype.getAnimations`.** Rendering a `TreeGroup` in Vitest throws `el.getAnimations is not a function` until it's stubbed. The tests stub it, and anyone testing a styled Tree will hit this.
- **Rendering from `items` gives unstyled parts.** `<Tree items>` without children renders the primitive's bare `TreeItems`. HextaUI's `Tree` renders its own styled rows from `items` or `paths` instead, so the shortest usage looks finished.
- **Focus sits on the item, not the row.** The focused element is the `treeitem`, which wraps its whole subtree, so a focus ring has to target `[role=treeitem]:focus-visible > [data-slot=tree-label]`. `group-focus-visible` would light up every descendant row.
- **No gaps found in:** arrow keys, Home/End, typeahead, `*`, multiple selection with Space, cascading checkboxes with the mixed state, `paths` with folders first, `onAction` pending state, `loadChildren` failure and retry, controller `expandAll`/`collapseAll`/`reveal`, `hiddenUntilFound`, RTL chevrons and arrow swap, touch taps at 390px.

## Image Cropper

- **The grid and handles come unstyled and unplaced.** `ImageCropperGrid` is an empty box, and handles get no position, so a styled kit has to draw the third lines and place all eight handles itself. HextaUI's grid renders four lines by default, and `ImageCropperHandles` renders all eight.
- **Preflight's `img { max-width: 100% }` fights the image's inline size.** In frame mode the zoomed image is larger than the viewport, so the image needs `max-width: none` or it shrinks back. The docs don't mention this, and every Tailwind project hits it.
- **The viewport has no size before load.** `--image-cropper-aspect-ratio` only exists once the image loads, so `aspect-ratio: var(--image-cropper-aspect-ratio)` collapses to zero height until then. HextaUI falls back to 3/2 to avoid a layout jump.
- **English names by default.** The selection says "Crop" and the handles say "Top left corner" and so on. Each part needs an `aria-label` for other languages, and there is no single `labels` option.
- **No gaps found in:** handle and selection drags with mouse and touch at 390px, aspect ratio changes refitting the crop, arrow and Shift+arrow keys, zoom input, rotate and flip, frame mode panning, `cropImage` with a cross-origin URL (CORS) and a round 128px avatar, a controller `setCrop`, `onCropCommit`, disabled, and object URLs from a file input.

## Date Picker

- **`controller.setValue()` doesn't move the calendar when `value` is controlled.** `setValue` calls `onValueChange`, then checks the store's value to decide whether to reveal the new date's month. With a controlled `value`, the store hasn't taken the new value yet, so the check fails and the calendar opens on the old month (set December 25 from November, and it opens on November). Uncontrolled with `onValueChange` works, so the docs example uses that.
- **Escape returns focus to the trigger even when the calendar was opened from the input** with Alt+Down. Typing people land on the button instead of where they were typing.
- **The trigger's name includes the value** ("Choose date, Friday, November 20, 2026"). That's good for screen readers, but tests that look the trigger up by its plain label break once a date is set.
- **The popup is a `popover` element,** so jsdom reports it as hidden and Testing Library queries need `hidden: true`. In jsdom, `renderToString` also throws on the portal, because the portal target only checks that `document` exists. Real server rendering is fine.
- **The calendar parts come unstyled, and two months don't fit a phone.** Nothing stacks `months={2}` on narrow screens. Side by side at 390px, the day cells shrink to 24px. HextaUI stacks the months below `sm`, which keeps cells at 40px on touch.
- **No gaps found in:** typing in en-US, de and ar formats with Enter and blur, invalid text marking the root and input invalid, range picking with the hover preview, presets with `aria-pressed`, min/max and `unavailable` dates, `name` and `required` in a native form with reset, read-only opening a calendar that can't change anything, disabled, RTL arrow keys, and touch taps at 390px.

# Second batch (built on 0.1.0-beta.2, 2026-11-14)

## File Input

- **`formatFileSize` says "byte" for small files.** It formats with `Intl.NumberFormat` `unit: "byte"` and `unitDisplay: "short"`, which English renders as a word, not "B". Repro: `formatFileSize(70)` returns `"70 byte"`, and `formatFileSize(999)` returns `"999 byte"`, while `formatFileSize(2400)` returns `"2.4 kB"`. HextaUI shows the SDK's output unchanged; files under 1 kB read oddly.
- **`validate` can't see earlier files in the same batch.** The docs' duplicate check (`files.getValue().some(…)`) reads the value before the batch lands, so two files with the same name in one drop or one picker choice are both accepted. Repro: `controller.addFiles([new File(["a"], "a.pdf"), new File(["b"], "a.pdf")])` with that `validate` leaves 2 files.
- **A page-wide zone shows while another zone is the target.** With a `target="document"` zone and an element zone on one page, dragging a file over the element zone sets `data-dragging` on both, so a full-page overlay covers the zone that will actually take the drop. The drop itself goes to the right zone. HextaUI's overlay variant is `pointer-events: none` at all times so drops still reach the zones under it.
- **No invalid state outside UI SDK's Field.** The root and trigger only get `data-invalid` from `@ui-sdk/react/field`. HextaUI's components use Base UI's Field, so the styled `FileInput` takes an `invalid` prop that sets `data-invalid` on the root and `aria-invalid` on the trigger.
- **Rejections aren't state.** Rejected files only reach `onReject`; nothing in the state or render props holds them. HextaUI keeps the last batch's rejections in context for `FileInputRejections` and clears them on the next accepted file or a reset.
- **English strings.** Remove buttons are named "Remove <name>" and announcements read "2 files accepted. 1 file rejected." An `aria-label` on `FileInputItemRemove` does override the name (unlike `data-slot`), and `announcement` replaces the message.
- **No gaps found in:** picker with accept and size checks, drops with `data-drag-accept` and `data-drag-reject`, disabled zones ignoring drops, paste through `pasteTarget` (typing in the text area stays instant), page-wide drops, single-file replace, Delete and arrow keys in the list, `name` submitting through `FormData`, form reset, controller `open`/`clear`, RTL, and 390px.

## Password Input

- **Issue #448 was closed as not a bug, and the attributes are as it says.** No part writes the password into a `data-*` attribute: the root, control and toggle carry only booleans (`data-visible`, `data-filled`, `data-capslock`, `data-disabled`, `data-readonly`, `data-required`). Checked in Chromium by scanning every attribute on the page after typing. HextaUI's own parts add only `data-invalid` on the root and `data-score` on the strength meter.
- **A controlled `value` puts the password in the DOM.** That's React, not the SDK: React mirrors a controlled input's value into its `value` attribute. Repro: `<PasswordInput value={v} onValueChange={setV}>`, type "secret-two", and `input.getAttribute("value")` is `"secret-two"`, so CSS attribute selectors and session recorders can read it. The SDK docs' New Password example uses exactly this pattern for its checklist. HextaUI's root keeps the value in context instead (`usePasswordInputValue()`), and its examples stay uncontrolled.
- **No `passwordrules`.** There's no option for Safari's `passwordrules`, and `PasswordInputControl`'s props omit it from the types, so it can't be passed without a cast.
- **No caps lock in headless Chromium.** `getModifierState("CapsLock")` stays false when Playwright presses CapsLock, so `data-capslock` can only be tested with a synthetic event (the unit test does) or by hand.
- **The control's `invalid` only comes from UI SDK's Field.** As with File Input, HextaUI adds an `invalid` prop that sets `data-invalid` on the root and `aria-invalid` on the input.
- **No gaps found in:** burst typing through CDP with the strength meter updating on every key (no dropped or reordered characters, controlled or not), the caret staying put when the toggle is clicked, Enter submitting and the submit hiding a shown password, form reset, `defaultVisible`, read-only, disabled skipping Tab, the controller (`setValue`, `setVisible`, `toggleVisible`, `clear`, `focus`), `onVisibleChange` reasons, and RTL.

## Number Input

- **The step buttons have no name.** `NumberInputIncrement` and `NumberInputDecrement` render `tabindex="-1"` and `aria-controls`, but no `aria-label`, so a button holding only an icon has no accessible name. Repro: render `<NumberInputIncrement><Icon /></NumberInputIncrement>` and the button's computed name is empty. HextaUI's parts default to "Increase" and "Decrease", and an `aria-label` overrides them.
- **The control isn't exposed as a spinbutton.** It's a plain `type="text"` input with no `role="spinbutton"`, `aria-valuenow`, `aria-valuemin` or `aria-valuemax`, so screen readers don't hear the bounds or that arrow keys step. The keyboard follows the spinbutton pattern. HextaUI leaves the roles as the SDK sets them.
- **No invalid state outside UI SDK's Field.** Same as File Input and Password Input; HextaUI adds an `invalid` prop for `data-invalid` on the root and `aria-invalid` on the input.
- **An unsupported `format.unit` throws and takes down the page.** That's `Intl.NumberFormat` (for example `unit: "pixel"` throws a `RangeError`), but nothing catches it, so the whole client tree unmounts. Use a sanctioned unit or no format.
- **No gaps found in:** burst typing through CDP in plain, currency and grouped fields (no dropped characters), Enter and blur clamping and formatting, Home and End, Shift for `largeStep` and Alt for `smallStep`, press-and-hold repeat stopping at max, `data-at-bound` and `data-disabled` at bounds, the wheel only when focused, scrubbing with the drawn cursor and `data-scrubbing`, read-only ignoring steps and typing, disabled, `name` submitting the raw number through `FormData`, the controller (`increment({ large: true })`, `setValue`), locales including `ar-EG` digits, RTL, and 390px with no overflow. The scrub cursor isn't in the server HTML; it only portals in while scrubbing.

## Time Input and Date Input

Both share one segmented core (`date-input-parts.ts`), so HextaUI ships them together, styled alike. The Date Picker stays a single text input with a calendar; Date Input is the segmented field for dates people type from memory.

- **A plain `<label>` can't focus the field.** Only UI SDK's Field wires the label to the first segment. With any other label (HextaUI's `Label`), the group is named through `aria-labelledby`, but clicking the label does nothing. Clicking inside the box does focus the nearest segment.
- **A form reset lands a tick late.** After `form.reset()`, the hidden input still holds the edited value until a microtask later; a native input resets synchronously. Repro: change the day, call `form.reset()`, and `new FormData(form).get("date")` is still the edited date until the next tick. Harmless for people, but tests need `waitFor`.
- **No invalid state outside UI SDK's Field** for checks of your own (like an end time before the start). `data-invalid` only covers `min`, `max` and `unavailable`. HextaUI adds an `invalid` prop that sets `data-invalid` on the root and `aria-invalid` on each editable segment, not on the literals.
- **Default rendering skips your segment styles.** Without children, the root renders the SDK's own unstyled segments, so a styled wrapper has to render `state.segments` itself. HextaUI's root always does, through `TimeInputSegments` / `DateInputSegments`, which also lets an icon sit inside the box.
- **Segment widths come from `size`.** `size="2"` (or 4 for the year) depends on the font's average character width, so tabular digits and the "––" placeholder don't line up. HextaUI sets widths in `ch` and sizes the AM/PM segment with `field-sizing: content`.
- **No gaps found in:** burst typing through CDP ("230p", "04151990" and "1/2/2027" all land in the right segments), clicking the box's empty end, arrows, Page keys, Home and End, Backspace moving back, A and P, paste of an ISO date, 12 and 24-hour clocks, seconds, hour only, `min`/`max` and weekday `unavailable` setting `data-invalid`, partial values blocking submit with "Enter a valid time.", `required`, `name` with reset, the controller (`setValue`, `focus("minute")`, `focus("year")`, `clear`), read-only, disabled, en-US/de-DE/ja-JP/ko-KR/ar-EG (ja names the segments 時 and 分), RTL, dark mode and 390px.
