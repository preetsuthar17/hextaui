# UI SDK (beta) spec for HextaUI

Source of truth: the Markdown docs bundled in `@ui-sdk/react@0.1.0-beta.1` (`node_modules/@ui-sdk/react/docs/`), read 2026-11-13. Per-component sections below were extracted from each `components/*.md` (Composition, Styling, Data Attributes, API Reference, Keyboard, Accessibility, Tested Behavior) and annotated by hand.

## Packages

- `@ui-sdk/react@0.1.0-beta.2` and `@ui-sdk/core@0.1.0-beta.2` (published 2026-11-13; beta.1 was 2026-11-12). Pinned exactly. Apache-2.0. Peer: React ≥19, `@types/react` ≥19.2.10.
- One entry per component (`@ui-sdk/react/rating`), no root import. Every module already carries `"use client"`; server components can render parts directly.

## Global contracts (apply to every component)

- **Parts and slots:** every part sets `data-slot` = primitive name, plus `-slot` for children (`rating`, `rating-item`). Never style generated ids.
- **State attributes:** present/absent booleans (`data-disabled`, `data-readonly`, `data-required`, `data-open`/`data-closed`, `data-checked`/`data-unchecked`, `data-highlighted`), or valued (`data-orientation`, `data-side`, `data-align`, `data-mode`). ARIA attributes double as hooks.
- **Values as CSS vars:** written with core's `css` helper into the server HTML (`--rating-fill`, `--area-x`, `--tree-level`, `--anchor-width`, `--transform-origin`, `--available-height`).
- **Enter/exit:** `present` parts get `data-starting-style` on the first frame and `data-ending-style` while leaving; the part stays mounted until transitions/animations finish. `data-closed` alone does not hold an exit.
- **Controlled/uncontrolled:** `value`/`defaultValue`/`onValueChange` (also `open`, `checked`, `pressed`, `expanded`, `crop`). Callbacks get `(next, details)` where `details = { reason, event, source, cancel() }`; `source` ∈ keyboard, mouse, touch, pen, virtual, programmatic, agent. A controlled value that never updates keeps the component where it was.
- **Controllers:** `createXController()` → pass as `controller`; methods go through the same change callbacks. Reads return `undefined` before mount.
- **Forms:** `name`, `required`, `disabled`, `readOnly`, `form`; hidden native inputs participate in submit/reset; reset arrives with reason `reset`, bfcache restore with `restore`.
- **Popups:** render in the browser top layer in place (no portal); flip/shift; `side`/`align`/`sideOffset`/`collisionPadding`; `modal`, `dismissible`, `presentation="auto"` turns Menu/Select/Combobox/Autocomplete/Popover/Dialog/Date Picker into a sheet on small touch screens. Focus on open depends on input source (touch focuses the content so no keyboard appears).
- **Cascade layer:** UI SDK injects a little CSS in `@layer ui-sdk` once a component mounts. Declare `@layer ui-sdk;` at the top of the global stylesheet (above `@import "tailwindcss"`) so app styles win. Pre-hydration, closed kept-mounted content carries `hidden`; Tailwind preflight already hides it.
- **CSP:** without `'unsafe-inline'` in `style-src`, add `<meta property="csp-nonce">`; server HTML also carries some `style` attributes (needs `style-src-attr 'unsafe-inline'`). HextaUI has no CSP header today, so nothing to do.
- **SSR:** attrs/state are pure and render on the server, including ARIA and tab stops. Parts generate ids; pass an explicit `id` only when something outside needs it, and keep it in the same Suspense boundary.
- **Render prop:** `render={<a />}` or a function of `(props, state)`; managed roles, tabindex, aria references, state attributes and `data-slot` stay the part's. `className`/`style`/`children` may be functions of state.
- **Direction:** components read `dir` from the DOM (`isRTL`); arrows swap in RTL where the axis is horizontal.
- **Debug:** `debug` on a root logs changes with reasons (dev builds). `globalThis.__UI_SDK_STRICT__ = true` turns dev warnings into errors.

## Core (`@ui-sdk/core`) in brief

- `definePrimitive({ name, options, state, api, slots, live, sync, controlled, commits, agent })`; slots declare `role`, `focus` (`roving` | `tab-stop` | `active-descendant` | `native`), `press`, `keys`, `on`, `attrs` (pure, server-safe), `state`, `present`, `bind` (client-only element work), `live`/`direct` for per-frame attributes.
- `createChange(context)` → change requests through callbacks; `createCommit` for drag-end commits; `createUndoStack`; `createController`.
- Behaviors: roving/grid/spatial focus, typeahead, focus recovery, selection (items, lasso, cell ranges), drag (bindDrag, reorder, tree reorder, transfer, auto-scroll), move/resize/area/spans, listbox + virtualizer, tree collections, panels/presence (`animateIn`/`animateOut`), gesture maths (velocity, springs, rubber band), popups (`createPopup`, presets, `position`, layers), preferences + storage, canvas viewport, platform (`announce`, `isRTL`, shortcuts), mobile (viewport, avoid keyboard), observe/agents/history.
- Value modules: `@ui-sdk/core/number`, `/date`, `/color`, `/image`.
- Testing (`@ui-sdk/core/testing`): `checkPattern(root, "tree" | "slider" | "radio-group" | …)`, `mount`, `checkServer`, `checkDirection`, `partAttrs`/`partState`/`partPresent`.

## Beta status of the build targets (smoke-tested 2026-11-13)

All six targets (Color Picker, Token Input, Rating, Tree, Image Cropper, Date Picker) import and render to a string on the server with React 19.3.1. None is missing or broken at import level; per-component bugs found while building are logged in `.claude/ui-sdk/beta-notes.md`.

## Base UI gaps at a glance

Not in `@base-ui/react` 1.9.0: Calendar, Carousel, Color Picker, Command, Date Input, Date Picker, File Input, Image Cropper, Listbox, Pagination, Rating, Resizable, Time Input, Timeline, Token Input, Tree, Trigger Menu, Waterfall. Partial: Label, Textarea, Segmented Control, Password Input, Preferences.

# Components


## Accordion

Show and hide sections of content from their headings.

Base UI equivalent: `@base-ui/react/accordion`.

**Doc sections:** Installation, Composition, Usage, Build Your Own, Multiple, Disabled, Collapsible, Controlled, Keep Mounted, Find in Page, Animation, Expand All, Nested, FAQ Search, URL Hash, Query String, Scroll into View, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Accordion
├── AccordionItem
│   ├── AccordionHeader
│   │   └── AccordionTrigger
│   └── AccordionPanel
└── AccordionItem
    ├── AccordionHeader
    │   └── AccordionTrigger
    └── AccordionPanel
```

**Styling:** Style the parts with the attributes below. This turns the chevron as its panel opens, mirrors it in right to left with `:dir(rtl)`, and dims disabled triggers:

**CSS vars:** AccordionPanel: `--accordion-panel-height`; AccordionPanel: `--accordion-panel-width`

**Data attributes**

- Accordion (`accordion`): data-disabled
- AccordionItem (`accordion-item`): data-open, data-closed, data-disabled
- AccordionHeader (`accordion-header`): data-open, data-closed, data-disabled
- AccordionTrigger (`accordion-trigger`): data-open, data-closed, data-disabled
- AccordionPanel (`accordion-panel`): data-open, data-closed, data-disabled, data-starting-style, data-ending-style

**Props**

- Accordion: value?, defaultValue?, onValueChange?, multiple?, collapsible?, disabled?, keepMounted?, hiddenUntilFound?, controller?, debug?
- AccordionItem: disabled?, onOpenChange?, onOpenChangeComplete?, value?
- AccordionTrigger: disabled?
- AccordionPanel: keepMounted?, hiddenUntilFound?
- State: value, disabled, multiple, open, disabled, index
- Reasons: trigger-press, find-in-page, imperative
- Controller: getValue(), setValue(value, options?), isOpen(value), open(value, options?), close(value, options?), toggle(value, options?), openAll(options?), closeAll(options?), focus(value?)

**ARIA:** The accordion follows the [WAI-ARIA accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/). Every line below is an automated test.



## Alert Dialog

Ask someone to confirm an action before you continue.

Base UI equivalent: `@base-ui/react/alert-dialog`.

**Doc sections:** Installation, Composition, Usage, Build Your Own, Controlled, Shortcut, Animation, Nested, Async Action, Confirm From Anywhere, Confirm, Queued Questions, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
AlertDialog
├── AlertDialogTrigger
├── AlertDialogBackdrop
└── AlertDialogContent
    ├── AlertDialogTitle
    ├── AlertDialogDescription
    ├── AlertDialogClose
    └── AlertDialogClose
```

**Styling:** Each part has a `data-slot`, such as `alert-dialog-content`, and shows its state through the attributes listed under [Data Attributes](#data-attributes). [Styling and Animation](../styling-and-animation.md) covers state attributes and entry and exit transitions.

**CSS vars:** AlertDialogContent: `--dialog-stack`; AlertDialogContent: `--keyboard-inset`; AlertDialogContent: `--visual-viewport-width`; AlertDialogContent: `--visual-viewport-height`; AlertDialogContent: `--visual-viewport-top`

**Data attributes**

- AlertDialogTrigger (`alert-dialog-trigger`): data-closed, data-disabled, data-open
- AlertDialogBackdrop (`alert-dialog-backdrop`): data-closed, data-open, data-starting-style, data-ending-style
- AlertDialogContent (`alert-dialog-content`): data-closed, data-open, data-starting-style, data-ending-style, data-keyboard
- AlertDialogClose (`alert-dialog-close`): data-pending

**Props**

- AlertDialog: container?, open?, defaultOpen?, onOpenChangeComplete?, dismissible?, onDismissAttempt?, persistentElements?, pendingAnnouncement?, debug?, onOpenChange?, onPayloadChange?, controller?
- AlertDialogTrigger: disabled?, focusableWhenDisabled?, payload?, shortcut?, controller?
- AlertDialogContent: container?, initialFocus?, finalFocus?, keepMounted?
- AlertDialogClose: value?, action?
- AlertDialogShortcut: shortcut?
- Confirm Options: title, description?, confirmLabel?, cancelLabel?
- State: open, modal, nested, nestedOpen, stack, payload, pending, presentation, pending, error, text
- Reasons: trigger-press, close-press, escape-key, parent-close, back, action, shortcut, imperative, trigger-press, shortcut, imperative
- Controller: isOpen(), setOpen(open, options?), open(options?), close(options?), toggle(options?), getPayload(), focus()

**ARIA:** Give the dialog a title and a description, and put the least destructive answer first. It follows the [WAI-ARIA alert dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/).



## Autocomplete

Suggest text while someone types, without limiting what they can enter.

Base UI equivalent: `@base-ui/react/autocomplete`.

**Doc sections:** Installation, Composition, Usage, Autocomplete vs Combobox, Build Your Own, Disabled, Clear and Trigger, Open on Focus, Auto Highlight, Inline Completion, Highlight Matches, Filter and Keywords, Groups, Icons, Items as Data, Controlled, Controller, Positioning, Animation, Presentation, Forms, Search, Recent Searches, Async Suggestions, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Autocomplete
├── AutocompleteLabel
├── AutocompleteInput
└── AutocompleteContent
    ├── AutocompleteEmpty
    └── AutocompleteList
        ├── AutocompleteItem
        └── AutocompleteItem
```

**Styling:** Each part has a `data-slot`, such as `autocomplete-content`, and shows its state through the attributes listed under [Data Attributes](#data-attributes).

**CSS vars:** AutocompleteContent: `--anchor-width`; AutocompleteContent: `--anchor-height`; AutocompleteContent: `--available-width`; AutocompleteContent: `--available-height`; AutocompleteContent: `--transform-origin`; AutocompleteContent: `--arrow-offset`; AutocompleteContent: `--drawer-progress`; AutocompleteContent: `--drawer-dim`; AutocompleteContent: `--drawer-expand`; AutocompleteContent: `--drawer-stack`; AutocompleteContent: `--sheet-backdrop`; Viewport: `--keyboard-inset`; Viewport: `--visual-viewport-width`; Viewport: `--visual-viewport-height`; Viewport: `--visual-viewport-top`

**Data attributes**

- AutocompleteLabel (`autocomplete-label`): data-disabled, data-readonly, data-required
- AutocompleteInput (`autocomplete-input`): data-closed, data-open, data-disabled, data-readonly, data-required
- AutocompleteTrigger (`autocomplete-trigger`): data-closed, data-open, data-disabled, data-readonly, data-required
- AutocompleteClear (`autocomplete-clear`): data-disabled
- AutocompleteContent (`autocomplete-content`): data-closed, data-presentation (popover, sheet), data-open, data-starting-style, data-ending-style, data-modality (keyboard, pointer), data-has-icons
- AutocompleteItem (`autocomplete-item`): data-disabled, data-highlighted, data-has-icon
- AutocompleteItemText (`autocomplete-item-text`): data-matched
- AutocompleteEmpty (`autocomplete-empty`): data-loading, data-empty
- AutocompleteStatus (`autocomplete-status`): data-loading
- AutocompleteArrow (`autocomplete-arrow`): data-closed, data-open
- AutocompleteItemIcon (`autocomplete-item-icon`): data-mirror

**Props**

- Autocomplete: container?, value?, defaultValue?, onValueChange?, open?, defaultOpen?, onOpenChange?, onOpenChangeComplete?, onSubmit?, items?, emptyItems?, filter?, inlineComplete?, autoHighlight?, openOnFocus?, submitOnSelect?, status?, onHighlight?, onLoadMore?, announcement?, loop?, modal?, presentation?, disabled?, readOnly?, required?, name?, form?, controller?, dismissible?, onDismissAttempt?, debug?
- AutocompleteClear: keepMounted?
- AutocompleteContent: side?, align?, sideOffset?, alignOffset?, collisionPadding?, arrowPadding?, anchor?, container?, keepMounted?
- AutocompleteItem: value, label?, keywords?, disabled?, index?
- AutocompleteItemIcon: mirror?
- Items as Data: value, label, keywords?, disabled?
- State: open, disabled, readOnly, required, open, presentation, status, items, highlighted, disabled, loading, empty, query, status, loading, count, disabled, open, segments, matched, mirror
- Reasons: input-change, item-press, list-navigation, escape-key, clear-press, reset, imperative, input-change, item-press, escape-key, imperative, trigger-press, trigger-focus, input-commit, outside-press, close-press, focus-out, window-blur, back, swipe, escape-key, outside-press, back, swipe
- Controller: isOpen(), setOpen(open, options?), open(options?), close(options?), toggle(options?), getValue(), setValue(value, options?), clear(options?), focus()

**ARIA:** The autocomplete follows the [WAI-ARIA combobox pattern with list autocomplete](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/), and [list and inline](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/) with `inlineComplete`.



## Avatar

Show an image with a fallback while it loads or if it fails.

Base UI equivalent: `@base-ui/react/avatar`.

**Doc sections:** Installation, Composition, Usage, Build Your Own, Fallback Delay, Image Attributes, Interactive Avatar, Loading Status, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Avatar
├── AvatarImage
└── AvatarFallback
```

**Styling:** Set the root's size and let the image and fallback fill it. The image manages its own hidden styles until it loads; keep those styles intact when changing its element.

**Data attributes**

- Avatar (`avatar`): data-loading-status (idle, loading, loaded, error)
- AvatarImage (`avatar-image`): data-loading-status (idle, loading, loaded, error)
- AvatarFallback (`avatar-fallback`): data-loading-status (idle, loading, loaded, error)

**Props**

- Avatar: onLoadingStatusChange?, debug?
- AvatarFallback: delay?
- State: loadingStatus
- Reasons: image-load, image-error, src-change

**ARIA:** Give the image meaningful `alt` text. Include the person's name in the fallback too, using visually hidden text if you only want to show initials.



## Button

Run an action, show that it's working, and keep it reachable when disabled.

Base UI equivalent: `@base-ui/react/button`.

**Doc sections:** Installation, Usage, Pending, Pending Content, Handling Errors, Changes After an Await, Disabled, Focusable When Disabled, Links, Forms, Styling, Data Attributes, API Reference, Accessibility

**Styling:** Use `data-pending` to show a spinner or waiting cursor, and `data-disabled` to style an unavailable action. The button's `data-slot` is `button`, and its attributes are listed under [Data Attributes](#data-attributes).

**Data attributes**

- Button (`button`): data-pending, data-disabled

**Props**

- Button: disabled?, focusableWhenDisabled?, type?, pendingAnnouncement?, debug?
- State: disabled, pending, error

**ARIA:** Give the button a clear text label. If it contains only an icon, add an `aria-label`. Native buttons respond to Enter and Space; links respond to Enter.

**Tested behavior groups:** Focusable when disabled, Pending. Runs in React, Vue and web components.



## Calendar

Choose one date, several dates, or a range from a month grid.

**Base UI gap: no equivalent in @base-ui/react 1.9.0.**

**Notes:** Used inside Date Picker. Day `data-value` is ISO date string. `data-preview` for unfinished range hover.

**Doc sections:** Installation, Composition, Usage, Values, Range, Multiple, Unavailable Dates, Deselect, Min and Max, Disabled and Read Only, Two Months, Fixed Weeks, Month and Year Selects, Custom Month and Year Selects, Language, Name Formats, Custom Days, Range Limits, Range in Progress, Controlled, Today, Driving It from Anywhere, Presets, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Calendar
├── CalendarPrevious
├── CalendarHeading
├── CalendarNext
└── CalendarGrid
    ├── CalendarWeekdays
    │   └── CalendarWeekday
    └── CalendarWeeks
        └── CalendarDay
```

**Styling:** Use `data-selected`, `data-today`, `data-outside`, `data-unavailable`, and `data-disabled` to style dates. A range also exposes its start, middle, end, and unfinished preview. Navigation buttons also get `data-disabled` when they reach the bounds.

**Data attributes**

- Calendar (`calendar`): data-mode (single, multiple, range), data-readonly, data-disabled
- CalendarPrevious (`calendar-previous`): data-disabled
- CalendarNext (`calendar-next`): data-disabled
- CalendarMonthSelect (`calendar-month-select`): data-disabled
- CalendarYearSelect (`calendar-year-select`): data-disabled
- CalendarGrid (`calendar-grid`): data-disabled
- CalendarDay (`calendar-day`): data-value (2026-10-01, 2026-10-14, 2026-10-16, 2026-10-18, 2026-10-24, 2026-09-30), data-selected, data-today, data-disabled, data-unavailable, data-outside, data-range-start, data-range-middle, data-range-end, data-preview

**Props**

- Calendar: mode?, value?, defaultValue?, onValueChange?, month?, defaultMonth?, onMonthChange?, min?, max?, unavailable?, disabled?, readOnly?, deselectable?, onFocusedChange?, onAnchorChange?, months?, pageBy?, locale?, weekStartsOn?, weekdayFormat?, monthFormat?, fixedWeeks?, showOutsideDays?, today?, timeZone?, minDays?, maxDays?, allowUnavailable?, controller?, debug?
- CalendarGrid: offset?
- CalendarWeekday: index
- CalendarDay: value, offset?
- State: value, month, mode, disabled, readOnly, focused, anchor, month, label, value, options, disabled, month, disabled, month, label, weekdays, weeks, weekday, label, name, date, label, selected, today, outside, disabled, unavailable, rangeStart, rangeEnd, inRange
- Reasons: item-press, imperative, item-press, imperative, previous-press, next-press, list-navigation, select-change, item-press, imperative, list-navigation, focus-in, item-press, escape-key
- Controller: getValue(), setValue(value, options?), getMonth(), setMonth(month, options?), previous(options?), next(options?), focus(date?)

**Keyboard**

- Left / Right Arrow: Move one day, following the page’s direction.
- Up / Down Arrow: Move one week.
- Home / End: Move to the first or last day of the week.
- Page Up / Page Down: Move one month, keeping the day where possible.
- Shift+Page Up / Shift+Page Down: Move one year.
- Enter / Space: Select the focused date.
- Escape: Cancel an unfinished range.

**ARIA:** It follows the grid of the [WAI-ARIA date picker dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/): each month is a `grid` named by its month, weekday headers are `columnheader`s named by their full names, and each day is a focusable `gridcell` named by its full date, like "Friday, October 16, 2026", with `aria-selected`, `aria-disabled` and `aria-current="date"`. A grid that selects several dates or a range is `aria-multiselectable`. Every line below is an automated test.

**Tested behavior groups:** Month and year selects. Runs in React, Vue and web components.



## Carousel

Page through slides with native scrolling, keyboard controls, and optional rotation.

**Base UI gap: no equivalent in @base-ui/react 1.9.0.**

**Doc sections:** Installation, Composition, Usage, Vertical, Loop, Align, Default Page, Indicators, Pages, Thumbnails, Autoplay, Progress, Controlled, Paging from Anywhere, Swipes and Drags, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Carousel
├── CarouselViewport
│   └── CarouselContent
│       ├── CarouselItem
│       └── CarouselItem
├── CarouselPrevious
└── CarouselNext
```

**Styling:** Use `data-disabled` on Previous and Next at their end, `data-selected` on the current indicator, `data-active` on the current page's slides, `data-in-view` on slides in view, and `data-playing` and `data-paused` on the root.

**CSS vars:** Carousel: `--carousel-interval`; Carousel: `--carousel-progress`

**Data attributes**

- Carousel (`carousel`): data-orientation (horizontal, vertical), data-playing, data-paused
- CarouselViewport (`carousel-viewport`): data-orientation (horizontal, vertical), data-dragging
- CarouselContent (`carousel-content`): data-orientation (horizontal, vertical)
- CarouselItem (`carousel-item`): data-orientation (horizontal, vertical), data-active, data-in-view
- CarouselPrevious (`carousel-previous`): data-disabled
- CarouselIndicator (`carousel-indicator`): data-selected
- CarouselPlayToggle (`carousel-play-toggle`): data-playing, data-paused

**Props**

- Carousel: page?, defaultPage?, onPageChange?, onPageChangeComplete?, playing?, defaultPlaying?, onPlayingChange?, interval?, orientation?, align?, slidesPerPage?, loop?, skipSnaps?, dragFree?, drag?, controller?, debug?
- CarouselPrevious: controller?
- CarouselIndicator: page?
- State: page, pageCount, playing, orientation, orientation, dragging, orientation, index, active, inView, disabled, page, pageCount, page, selected, playing, paused
- Reasons: previous-press, next-press, item-press, list-navigation, swipe, scroll, timeout, content-resize, imperative, previous-press, next-press, item-press, list-navigation, swipe, scroll, imperative, toggle-press, focus-in
- Controller: getPage(), getPageCount(), setPage(page, options?), next(options?), previous(options?), canNext(), canPrevious(), getProgress(), isPlaying(), setPlaying(playing, options?), play(options?), pause(options?)

**Keyboard**

- Tab: Reaches the play toggle, links and controls in slides in view, Previous, Next and the current indicator
- ArrowRight, ArrowLeft: In the viewport, the next and previous page. ArrowDown and ArrowUp when vertical
- Home, End: In the viewport or the indicators, the first and last page
- ArrowRight, ArrowLeft, ArrowDown, ArrowUp: In the indicators, the next and previous indicator, which shows its page
- Enter, Space: Presses Previous, Next, an indicator or the play toggle

**ARIA:** It follows the [WAI-ARIA carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/): a region described as a carousel, slides as groups described as slides and labelled by position, Previous and Next that control the slides, a rotation control, and indicators as a tablist. Every line below is an automated test.

**Tested behavior groups:** Structure, Previous and next, Keyboard, Pages, Rest, Loop, Dragging, More, Focus, Orientation, Indicators, Changes, Rotation, Pages. Runs in React, Vue and web components.



## Checkbox

Choose one or more options, individually or as a group.

Base UI equivalent: `@base-ui/react/checkbox + checkbox-group`.

**Doc sections:** Installation, Composition, Usage, Description, Disabled, Read-Only, Indeterminate, Controlled, Forms, Group, Parent Checkbox, Disabled Group, Controlled Group, Group in a Form, Table, Animation, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Checkbox
└── CheckboxIndicator
```

**Styling:** Use `data-checked`, `data-unchecked` and `data-indeterminate` for the checked state, and `data-disabled`, `data-readonly` and `data-required` for the rest. The indicator gets the same state attributes as its checkbox.

**Data attributes**

- Checkbox (`checkbox`): data-checked, data-disabled, data-readonly, data-required, data-unchecked, data-indeterminate
- CheckboxIndicator (`checkbox-indicator`): data-checked, data-disabled, data-readonly, data-required, data-unchecked, data-indeterminate, data-starting-style, data-ending-style
- CheckboxGroup (`checkbox-group`): data-disabled, data-required

**Props**

- Checkbox: checked?, defaultChecked?, onCheckedChange?, disabled?, readOnly?, required?, name?, value?, form?, controller?, parent?, debug?
- CheckboxIndicator: keepMounted?
- CheckboxGroup: value?, defaultValue?, onValueChange?, allValues?, disabled?, readOnly?, required?, name?, form?, controller?, debug?
- State: checked, indeterminate, disabled, readOnly, required, checked, indeterminate, disabled, readOnly, required, value, disabled, readOnly, required
- Reasons: press, reset, restore, imperative, item-press, reset, restore, imperative
- Checkbox Controller: toggle(details?), getChecked(), setChecked(checked, details?), focus()
- CheckboxGroup Controller: getValue(), setValue(value, details?), focus()

**Keyboard**

- Tab: Moves to the next checkbox
- Space: Checks or unchecks it, or checks a mixed one
- Enter: Submits its form

**ARIA:** The checkbox follows the [WAI-ARIA checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/), and a group's parent checkbox follows its [mixed checkbox example](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/examples/checkbox-mixed/). `Checkbox` renders a button with the `checkbox` role, and a hidden native checkbox that takes part in forms. Every line below is an automated test.

**Tested behavior groups:** Checkbox, Parent checkbox, Enhancements, Form-associated custom elements. Runs in React, Vue and web components.



## Collapsible

Show and hide a panel, preserve its contents, and animate its height.

Base UI equivalent: `@base-ui/react/collapsible`.

**Doc sections:** Installation, Composition, Usage, Build Your Own, Disabled, Keep Mounted, Find in Page, Controlled, Animation, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Collapsible
├── CollapsibleTrigger
└── CollapsiblePanel
```

**Styling:** Use `data-open`, `data-closed` and `data-disabled` to style each state. The examples turn their chevron from the trigger's `data-open`.

**CSS vars:** CollapsiblePanel: `--collapsible-panel-height`; CollapsiblePanel: `--collapsible-panel-width`

**Data attributes**

- Collapsible (`collapsible`): data-open, data-closed, data-disabled
- CollapsibleTrigger (`collapsible-trigger`): data-open, data-closed, data-disabled
- CollapsiblePanel (`collapsible-panel`): data-open, data-closed, data-disabled, data-starting-style, data-ending-style

**Props**

- Collapsible: open?, defaultOpen?, onOpenChange?, onOpenChangeComplete?, disabled?, controller?, debug?
- CollapsiblePanel: keepMounted?, hiddenUntilFound?
- State: open, disabled
- Reasons: trigger-press, find-in-page, imperative
- Controller: isOpen(), setOpen(open, options?), open(options?), close(options?), toggle(options?), focus()

**Keyboard**

- Enter, Space: Opens or closes the panel. Focus stays on the trigger.
- Tab: Moves from the trigger into an open panel

**ARIA:** The collapsible follows the [WAI-ARIA disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/). The trigger says whether the panel is open with `aria-expanded`, and points to the panel with `aria-controls` while it's mounted. Every line below is an automated test.

**Tested behavior groups:** Opening and closing, Keyboard, Mounting, Enhancements. Runs in React, Vue and web components.



## Color Picker

Choose a color by dragging across an area and along sliders, typing any CSS color, or picking a preset.

**Base UI gap: no equivalent in @base-ui/react 1.9.0.**

**Notes:** Build target 1. Thumbs are absolutely positioned inline; area/slider backgrounds arrive as CSS vars (`--color-area-background`, `--color-slider-background`), so they're SSR-correct. EyeDropper flags `data-unsupported` where `window.EyeDropper` is missing (Safari, Firefox). `onValueCommit` fires at drag end — use it for persistence. Out-of-gamut colors set `data-out-of-gamut` everywhere.

**Doc sections:** Installation, Composition, Usage, Spaces and Channels, OKLCH, Presets and Channel Inputs, Popover, Disabled, Controlled, Form, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
ColorPicker
├── ColorPickerArea
│   ├── ColorPickerAreaCanvas
│   └── ColorPickerAreaThumb
├── ColorPickerSlider
│   └── ColorPickerSliderThumb
├── ColorPickerSlider
│   └── ColorPickerSliderThumb
├── ColorPickerSwatch
├── ColorPickerInput
├── ColorPickerChannelInput
├── ColorPickerEyeDropper
└── ColorPickerSwatches
    ├── ColorPickerSwatchItem
    └── ColorPickerSwatchItem
```

**Styling:** Parts are unstyled, apart from the positions they need: thumbs get `position: absolute` and their place in percent, as inline styles. Give the area and sliders a size and their background variable, and center each thumb on its point with `translate: -50% -50%`.

**CSS vars:** ColorPicker: `--color-picker-color`; ColorPickerArea: `--color-area-background`; ColorPickerAreaThumb: `--area-x`; ColorPickerAreaThumb: `--area-y`; ColorPickerSlider: `--color-slider-background`; ColorPickerSliderThumb: `--color-slider-thumb-position`; ColorPickerSwatch: `--color-picker-color`; ColorPickerSwatchItem: `--color-picker-color`

**Data attributes**

- ColorPicker (`color-picker`): data-disabled, data-readonly, data-required, data-out-of-gamut
- ColorPickerArea (`color-picker-area`): data-disabled, data-readonly, data-required, data-out-of-gamut
- ColorPickerAreaThumb (`color-picker-area-thumb`): data-area-thumb, data-disabled, data-readonly, data-required, data-out-of-gamut
- ColorPickerSlider (`color-picker-slider`): data-disabled, data-readonly, data-required, data-orientation (horizontal, vertical), data-channel (hue, saturation, brightness, lightness, chroma, red, green, blue, alpha), data-out-of-gamut
- ColorPickerSliderThumb (`color-picker-slider-thumb`): data-disabled, data-readonly, data-required, data-orientation (horizontal, vertical), data-channel (hue, saturation, brightness, lightness, chroma, red, green, blue, alpha), data-out-of-gamut
- ColorPickerInput (`color-picker-input`): data-disabled, data-readonly, data-required, data-out-of-gamut
- ColorPickerChannelInput (`color-picker-channel-input`): data-disabled, data-readonly, data-required, data-channel (hue, saturation, brightness, lightness, chroma, red, green, blue, alpha), data-out-of-gamut
- ColorPickerSwatch (`color-picker-swatch`): data-disabled, data-readonly, data-required, data-out-of-gamut
- ColorPickerEyeDropper (`color-picker-eye-dropper`): data-disabled, data-readonly, data-required, data-out-of-gamut, data-unsupported
- ColorPickerSwatches (`color-picker-swatches`): data-disabled, data-readonly, data-required, data-out-of-gamut
- ColorPickerSwatchItem (`color-picker-swatch-item`): data-selected, data-disabled, data-readonly

**Props**

- ColorPicker: value?, defaultValue?, onValueChange?, onValueCommit?, space?, format?, gamut?, disabled?, readOnly?, required?, name?, form?, controller?, debug?
- ColorPickerArea: x?, y?
- ColorPickerSlider: channel?, orientation?
- ColorPickerChannelInput: channel?
- ColorPickerSwatchItem: value
- State: value, color, space, disabled, readOnly, required, outOfGamut, value, color, space, disabled, readOnly, required, outOfGamut, channel, channelValue, orientation, selected, disabled
- Reasons: track-press, drag, step-key, input-commit, item-press, eye-dropper-pick, reset, restore, imperative
- Controller: getValue(), setValue(value, options?), focus()

**Keyboard**

- Arrow keys: Move a thumb one step. On the area, Left and Right move across, Up and Down move up and down.
- Shift with an arrow: Moves ten steps
- Page Up or Page Down: Moves a tenth of the range, up the area or along a slider
- Home or End: Moves to the start or end, across the area or along a slider
- Enter: Reads the text in the input, or picks the focused preset
- Escape: Puts the input's text back to the value

**ARIA:** No WAI-ARIA pattern covers a color picker, so it's built from ones that do. The picker is a group. The area's thumb and each slider's thumb follow the [WAI-ARIA slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/), and the area's thumb names both of its channels, like "Saturation 76%, Brightness 96%". The presets follow the [listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/), and each one is named by its color, like "vivid red", as is `ColorPickerSwatch`.

**Tested behavior groups:** Value, Keyboard, Forms, Gamut. Runs in React, Vue and web components.



## Combobox

Search a list of options and choose one or several values.

Base UI equivalent: `@base-ui/react/combobox`.

**Doc sections:** Installation, Composition, Usage, Autocomplete vs Combobox, Build Your Own, Disabled, Clear and Trigger, Auto Highlight, Highlight Matches, Filter and Keywords, Groups, Icons, Custom Items, Items as Data, Recent Items, Object Values, Multiple, Select All, Chips That Collapse, Max Selected, Create Option, Custom Value, Input in the Popup, Async Search, Load More, Virtualized, Controlled, Controller, Positioning, Animation, Presentation, Forms, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Combobox
├── ComboboxLabel
├── ComboboxInput
└── ComboboxContent
    └── ComboboxList
        ├── ComboboxItem
        └── ComboboxItem
```

**Styling:** Each part has a `data-slot`, such as `combobox-content`, and shows its state through the attributes listed under [Data Attributes](#data-attributes).

**CSS vars:** ComboboxContent: `--anchor-width`; ComboboxContent: `--anchor-height`; ComboboxContent: `--available-width`; ComboboxContent: `--available-height`; ComboboxContent: `--transform-origin`; ComboboxContent: `--arrow-offset`; ComboboxContent: `--drawer-progress`; ComboboxContent: `--drawer-dim`; ComboboxContent: `--drawer-expand`; ComboboxContent: `--drawer-stack`; ComboboxContent: `--sheet-backdrop`; Viewport: `--keyboard-inset`; Viewport: `--visual-viewport-width`; Viewport: `--visual-viewport-height`; Viewport: `--visual-viewport-top`

**Data attributes**

- ComboboxLabel (`combobox-label`): data-disabled, data-readonly, data-required
- ComboboxInput (`combobox-input`): data-closed, data-open, data-disabled, data-readonly, data-required
- ComboboxTrigger (`combobox-trigger`): data-closed, data-open, data-disabled, data-readonly, data-required
- ComboboxClear (`combobox-clear`): data-disabled
- ComboboxChips (`combobox-chips`): data-disabled, data-readonly, data-required
- ComboboxContent (`combobox-content`): data-closed, data-presentation (popover, sheet), data-open, data-starting-style, data-ending-style, data-modality (keyboard, pointer), data-has-icons
- ComboboxItem (`combobox-item`): data-selected, data-disabled, data-highlighted, data-has-icon
- ComboboxItemText (`combobox-item-text`): data-matched
- ComboboxItemIndicator (`combobox-item-indicator`): data-selected
- ComboboxEmpty (`combobox-empty`): data-loading, data-empty
- ComboboxStatus (`combobox-status`): data-loading
- ComboboxArrow (`combobox-arrow`): data-closed, data-open
- ComboboxItemIcon (`combobox-item-icon`): data-mirror
- ComboboxChip (`combobox-chip`): data-value (a), data-disabled
- ComboboxChipRemove (`combobox-chip-remove`): data-disabled
- ComboboxSelectAll (`combobox-select-all`): data-disabled, data-unchecked, data-highlighted
- ComboboxCreate (`combobox-create`): data-highlighted, data-pending

**Props**

- Combobox: container?, query?, defaultQuery?, onQueryChange?, open?, defaultOpen?, onOpenChange?, onOpenChangeComplete?, maxSelected?, items?, emptyItems?, filter?, itemToValue?, itemToLabel?, isItemEqualToValue?, autoHighlight?, keepQuery?, pendingAnnouncement?, allowCustomValue?, status?, onHighlight?, onLoadMore?, announcement?, loop?, modal?, presentation?, disabled?, readOnly?, required?, name?, form?, controller?, dismissible?, onDismissAttempt?, debug?, multiple?, value?, defaultValue?, onValueChange?
- ComboboxClear: keepMounted?
- ComboboxValue: maxLabels?, getMoreLabel?
- ComboboxChip: value
- ComboboxContent: side?, align?, sideOffset?, alignOffset?, collisionPadding?, arrowPadding?, anchor?, container?, keepMounted?
- ComboboxItem: label?, keywords?, disabled?, index?, value
- ComboboxItemIcon: mirror?
- ComboboxItemIndicator: keepMounted?
- ComboboxCreate: onCreate?, minLength?
- Items as Data: value, label, keywords?, disabled?
- State: open, disabled, readOnly, required, open, disabled, readOnly, required, open, presentation, multiple, status, items, highlighted, selected, disabled, maxReached, selected, mirror, query, highlighted, pending, error, loading, empty, query, status, loading, count, value, labels, label, value, label, disabled, disabled, open, segments, matched, checked, indeterminate, highlighted, disabled, count, labels
- Reasons: item-press, input-change, clear-press, remove-press, escape-key, reset, restore, imperative, item-press, input-change, clear-press, escape-key, reset, imperative, trigger-press, close-press, outside-press, focus-out, window-blur, back, swipe, item-press, input-change, escape-key, imperative, trigger-press, close-press, outside-press, focus-out, window-blur, back, swipe, escape-key, outside-press, back, swipe
- Controller: isOpen(), setOpen(open, options?), open(options?), close(options?), toggle(options?), getValue(), setValue(value, options?), clear(options?), getQuery(), setQuery(query, options?), focus()

**Keyboard**

- Typing: Filters the options and opens the list
- ArrowDown, ArrowUp: Opens the list, then moves the highlight. Wraps unless `loop={false}`
- Enter: Chooses the highlighted option
- Escape: Closes the list, then restores the selection's label
- Backspace: In an empty input with chips, removes the last chip
- ArrowLeft, ArrowRight: Moves between chips, reversed in right-to-left text

**ARIA:** The combobox follows the [WAI-ARIA combobox pattern with list autocomplete](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/). Focus usually stays in the input while `aria-activedescendant` identifies the highlighted option. A touch screen-reader trigger can move real focus into the list, and a sheet has its own [focus behavior](#presentation). Every line below is an automated test.

**Tested behavior groups:** Input, Highlight, AutoHighlight, Choosing, Closing, Trigger and clear, Default value, Multiple, Groups, Forms, Async, Virtualized, Enhancements, Items shown while nothing is typed, Select all, Chips that collapse, Loading more, Rows, Combobox, Autocomplete, Command, Highlighting, A screen reader's tap moves real focus into the list, Combobox, Announcements, Touch screen readers and announcements. Runs in React, Vue and web components. Runs in React.



## Command

Search commands, run actions, and open pages of more choices.

**Base UI gap: no equivalent in @base-ui/react 1.9.0.**

**Doc sections:** Installation, Composition, Usage, Build Your Own, Dialog, Shortcuts, Highlight Matches, Filter and Keywords, Pages, Items as Data, Async Results, Pending Actions, Virtualized, Controlled, Controller, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Command
├── CommandInput
├── CommandEmpty
└── CommandList
    ├── CommandItem
    └── CommandItem
```

**Styling:** Each part has a `data-slot`, such as `command-item`, and shows its state through the attributes listed under [Data Attributes](#data-attributes).

**Data attributes**

- Command (`command`): data-loading
- CommandInput (`?`): —
- CommandList (`command-list`): data-has-icons
- CommandItem (`command-item`): data-disabled, data-highlighted, data-pending, data-has-icon
- CommandItemText (`command-item-text`): data-matched
- CommandItemIcon (`command-item-icon`): data-mirror
- CommandEmpty (`command-empty`): data-loading, data-empty
- CommandStatus (`command-status`): data-loading

**Props**

- Command: value?, defaultValue?, onValueChange?, query?, defaultQuery?, onQueryChange?, pages?, defaultPages?, onPagesChange?, onAction?, pendingAnnouncement?, items?, emptyItems?, filter?, autoHighlight?, loop?, status?, onLoadMore?, announcement?, controller?, debug?
- CommandPage: value?
- CommandItem: value?, label?, keywords?, disabled?, shortcut?, page?, index?, onSelect?
- CommandItemIcon: mirror?
- CommandShortcut: shortcut?
- Items as Data: value, label, keywords?, disabled?, shortcut?, items?
- State: page, loading, page, status, items, highlighted, disabled, pending, error, loading, empty, query, status, loading, count, text, segments, matched, mirror
- Reasons: list-navigation, item-hover, input-change, item-press, shortcut, back, escape-key, item-removed, imperative, input-change, item-press, shortcut, back, escape-key, imperative, item-press, shortcut, back, escape-key, imperative
- Controller: getValue(), setValue(value, options?), getQuery(), setQuery(query, options?), getPages(), setPages(pages, options?), push(page, options?), pop(options?), run(value?), focus()

**Keyboard**

- Typing: Filters the commands and highlights the best match
- ArrowDown, ArrowUp: Moves the highlight. Wraps unless `loop={false}`
- Enter: Runs the highlighted command, or follows it when it renders as a link
- Escape: Clears the search, then goes back a page
- Backspace: In an empty search, goes back a page and restores its query
- An item's shortcut: Runs it while the list is mounted, even when hidden by the search

**ARIA:** The command list follows the [WAI-ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) with a listbox that's always shown. Focus stays in the input, which points to the highlighted command with `aria-activedescendant`. Every line below is an automated test.

**Tested behavior groups:** Field, Filtering, Keyboard, Pointer, AutoHighlight, Virtualized, Enhancements. Runs in React, Vue and web components. Runs in React.



## Date Input

Type a date one part at a time, in the order your user's language writes it.

**Base UI gap: no equivalent in @base-ui/react 1.9.0.**

**Doc sections:** Installation, Composition, Usage, Field, Date and Time, Min and Max, Unavailable Dates, Locale, Disabled, Read-Only, Form, Controlled, Controller, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
DateInput
├── DateInputSegment
└── DateInputSegment
```

**Styling:** Style the root as the field's box, and its segments inside it. Every segment sets `data-type` to its unit, so you can make the year wider or mute the text between segments, which has `data-type="literal"`. An empty segment sets `data-empty` and shows its placeholder. The root sets `data-invalid` while the date is out of range or unavailable.

**Data attributes**

- DateInput (`date-input`): data-disabled, data-readonly, data-required, data-invalid, data-empty
- DateInputSegment (`date-input-segment`): data-type (year, month, day, hour, minute, second, dayPeriod, literal), data-disabled, data-readonly, data-required, data-invalid, data-empty

**Props**

- DateInput: value?, defaultValue?, onValueChange?, granularity?, hourCycle?, min?, max?, unavailable?, locale?, disabled?, readOnly?, required?, name?, form?, controller?, debug?
- DateInputSegment: segment
- State: value, segments, disabled, readOnly, invalid, key, type, text, value, min, max, empty, editable, label, disabled, readOnly, invalid
- Reasons: input-change, step-key, paste, reset, restore, imperative
- Controller: getValue(), setValue(value, options?), clear(options?), focus(segment?)

**Keyboard**

- 0 to 9: Fill the segment, then move to the next one.
- ArrowUp / ArrowDown: Step the segment by one, wrapping around. An empty segment starts at today.
- PageUp / PageDown: Step by more: a year by 5, a month by 3, a day by 7, minutes by 15.
- Home / End: Go to the segment's first or last value.
- ArrowLeft / ArrowRight: Move to the segment before or after.
- Backspace: Remove the last digit, then empty the segment, then move back.
- Delete: Empty the segment.
- A / P: Choose AM or PM, in a time with a 12-hour clock.
- Enter: Submit the form with what was typed.
- Tab / Shift+Tab: Move through the segments, then out of the input.

**ARIA:** The root is a group, named by its Field's label or by your `aria-label`. Each segment is a [spinbutton](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/) named by its unit, like "month", with its value, range and text. An empty segment reads as "Empty". The text between segments is hidden from screen readers, which read each segment's name instead.

**Tested behavior groups:** —. Runs in React, Vue and web components.



## Date Picker

Type a date or choose one from a calendar, with support for ranges and forms.

**Base UI gap: no equivalent in @base-ui/react 1.9.0.**

**Notes:** Build target 6. Composes Calendar parts inside `DatePickerContent` (a dialog popup in top layer, `presentation="auto"` → sheet on small touch). Text input parses typed dates per locale; `DatePickerHint` shows format. Range mode has start/end inputs (`end` prop). HextaUI already ships a react-day-picker date picker; this is a separate flavor.

**Doc sections:** Installation, Composition, Usage, Values, Typing a Date, Range, Presets, Min, Max and Unavailable Dates, Language, Clear, Disabled and Read Only, Staying Open, Keep It Open Until Both Dates Are Picked, Popup and Presentation, Forms, Controlled, Driving It from Anywhere, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
DatePicker
├── DatePickerInput
├── DatePickerTrigger
├── DatePickerHint
└── DatePickerContent
```

**Styling:** The root, inputs, and trigger expose `data-disabled`. Invalid input sets `data-invalid` on that input and the root. The root and trigger expose `data-open`; presets expose `data-selected`, and Clear exposes `data-empty`. Calendar days carry [Calendar’s state attributes](./calendar.md#styling).

**CSS vars:** DatePickerContent: `--anchor-width`; DatePickerContent: `--anchor-height`; DatePickerContent: `--available-width`; DatePickerContent: `--available-height`; DatePickerContent: `--transform-origin`; DatePickerContent: `--arrow-offset`; DatePickerContent: `--drawer-progress`; DatePickerContent: `--drawer-dim`; DatePickerContent: `--drawer-expand`; DatePickerContent: `--drawer-stack`; DatePickerContent: `--sheet-backdrop`; Viewport: `--keyboard-inset`; Viewport: `--visual-viewport-width`; Viewport: `--visual-viewport-height`; Viewport: `--visual-viewport-top`

**Data attributes**

- DatePicker (`date-picker`): data-mode (single, range), data-open, data-closed, data-readonly, data-disabled, data-invalid
- DatePickerInput (`date-picker-input`): data-disabled, data-invalid
- DatePickerTrigger (`date-picker-trigger`): data-open, data-closed, data-disabled
- DatePickerContent (`date-picker-content`): data-open, data-presentation (popover, sheet), data-closed, data-starting-style, data-ending-style
- DatePickerClear (`date-picker-clear`): data-empty
- DatePickerPreset (`date-picker-preset`): data-selected

**Props**

- DatePicker: debug?, month?, defaultMonth?, min?, max?, unavailable?, disabled?, readOnly?, months?, pageBy?, locale?, weekStartsOn?, weekdayFormat?, monthFormat?, fixedWeeks?, showOutsideDays?, today?, timeZone?, minDays?, maxDays?, allowUnavailable?, container?, mode?, value?, defaultValue?, onValueChange?, onMonthChange?, open?, defaultOpen?, onOpenChange?, onOpenChangeComplete?, closeOnSelect?, presentation?, name?, startName?, endName?, form?, required?, controller?, dismissible?, onDismissAttempt?
- DatePickerInput: end?
- DatePickerContent: side?, align?, sideOffset?, alignOffset?, collisionPadding?, arrowPadding?, anchor?, container?, finalFocus?, keepMounted?
- DatePickerPreset: value
- State: value, mode, open, disabled, readOnly, invalid, invalid, disabled, readOnly, open, disabled, open, presentation, placeholder, example, selected, disabled, empty, disabled
- Reasons: item-press, input-commit, preset-press, clear-press, reset, restore, imperative, item-press, preset-press, imperative, trigger-press, outside-press, escape-key, focus-out, window-blur, close-press, back, swipe, outside-press, escape-key, back, swipe
- Controller: getValue(), setValue(value, options?), clear(options?), getMonth(), setMonth(month, options?), previous(options?), next(options?), focus(date?), isOpen(), setOpen(open, options?), open(options?), close(options?), toggle(options?)

**Keyboard**

- Enter: Input
- Alt+Down Arrow: Input
- Enter / Space: Trigger
- Escape: Popup
- Tab / Shift+Tab: Popup

**ARIA:** It follows the [WAI-ARIA date picker dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/): a plain text input that every screen reader handles, a button with `aria-haspopup="dialog"` and `aria-expanded` named by the date chosen, and a dialog holding the calendar's grid. Focus moves into the grid when the dialog opens and back to the button when a date is picked or Escape closes it. Every line below is an automated test.

**Tested behavior groups:** Range. Runs in React, Vue and web components.



## Dialog

Open a focused task over the page.

Base UI equivalent: `@base-ui/react/dialog`.

**Doc sections:** Installation, Composition, Usage, Build Your Own, Scrollable Content, Forms, Focus, Controlled, Keyboard Shortcut, Animation, Modal, Warn Before Closing a Dirty Form, Nested Dialogs, Opening from a Menu Item, Opening from Anywhere, Presentation, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Dialog
├── DialogTrigger
├── DialogBackdrop
└── DialogContent
    ├── DialogTitle
    ├── DialogDescription
    └── DialogClose
```

**Styling:** Each part has a `data-slot`, such as `dialog-content`, and shows its state through the attributes listed under [Data Attributes](#data-attributes). Use `data-open` and `data-closed` for each state, and `data-starting-style` and `data-ending-style` for transitions.

**CSS vars:** DialogContent: `--dialog-stack`; DialogContent: `--keyboard-inset`; DialogContent: `--visual-viewport-width`; DialogContent: `--visual-viewport-height`; DialogContent: `--visual-viewport-top`; DialogContent: `--drawer-progress`; DialogContent: `--drawer-dim`; DialogContent: `--drawer-expand`; DialogContent: `--drawer-stack`; DialogContent: `--sheet-backdrop`; Viewport: `--keyboard-inset`; Viewport: `--visual-viewport-width`; Viewport: `--visual-viewport-height`; Viewport: `--visual-viewport-top`

**Data attributes**

- DialogTrigger (`dialog-trigger`): data-closed, data-disabled, data-open
- DialogBackdrop (`dialog-backdrop`): data-closed, data-open, data-starting-style, data-ending-style
- DialogContent (`dialog-content`): data-closed, data-presentation (dialog, sheet), data-open, data-starting-style, data-ending-style, data-keyboard
- DialogClose (`dialog-close`): data-pending

**Props**

- Dialog: container?, open?, defaultOpen?, onOpenChangeComplete?, dismissible?, onDismissAttempt?, persistentElements?, pendingAnnouncement?, debug?, onOpenChange?, onPayloadChange?, modal?, closeOnOutsidePress?, presentation?, controller?
- DialogTrigger: disabled?, focusableWhenDisabled?, payload?, shortcut?, controller?
- DialogContent: container?, initialFocus?, finalFocus?, keepMounted?
- DialogClose: value?, action?
- DialogShortcut: shortcut?
- State: open, disabled, open, nested, nestedOpen, open, modal, nested, nestedOpen, stack, payload, pending, presentation, pending, error, text
- Reasons: trigger-press, close-press, outside-press, escape-key, parent-close, back, action, shortcut, swipe, imperative, trigger-press, shortcut, imperative, outside-press, escape-key, back, swipe
- Controller: isOpen(), setOpen(open, options?), open(options?), close(options?), toggle(options?), getPayload(), focus()

**Keyboard**

- Enter, Space: On the trigger, opens the dialog
- Tab, Shift+Tab: Moves through the dialog's controls, staying inside while it's modal
- Escape: Closes the topmost dialog and returns focus to its trigger
- A trigger's shortcut: Opens its dialog from anywhere on the page

**ARIA:** The trigger is a button that opens a dialog, and the dialog follows the [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): `aria-modal` while it's modal, labelled by its title, described by its description only while one is rendered. Every line below is an automated test.

**Tested behavior groups:** Trigger, Focus, Dismissal, Presses, Modal, Nested dialogs, Escape that closes exactly one thing, Focus that always lands somewhere useful, The outside is inert, except what must stay live, Non-modal dialogs that behave like the APG, Nested and stacked, Opening from anywhere, Shortcuts, Web components, Opening a dialog from a menu item, The page and focus around a dialog opened from a menu item, Shortcuts, A dirty form, Persistent elements, Async actions, Popups inside a portaled popover, Android's back gesture. Runs in React, Vue and web components.



## Drawer

A sheet you can open, drag, and resize from an edge of the screen.

Base UI equivalent: `@base-ui/react/drawer`.

**Doc sections:** Installation, Composition, Usage, Scrollable Content, Sides, Snap Points, Controlled, Not Dismissible, Modal, Nested Drawers, Forms, Outlets, Opening from Anywhere, Action Sheet, Responsive, Driver and Physics, Page Integration, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Drawer
├── DrawerTrigger
├── DrawerBackdrop
└── DrawerContent
    ├── DrawerTitle
    ├── DrawerDescription
    └── DrawerClose
```

**Styling:** Each part has a `data-slot`, such as `drawer-content`, and shows its state through the attributes listed under [Data Attributes](#data-attributes).

**CSS vars:** DrawerContent: `--drawer-progress`; DrawerContent: `--drawer-dim`; DrawerContent: `--drawer-expand`; DrawerContent: `--drawer-stack`; Viewport: `--keyboard-inset`; Viewport: `--visual-viewport-width`; Viewport: `--visual-viewport-height`; Viewport: `--visual-viewport-top`; DrawerOutlet: `--drawer-progress`; DrawerOutlet: `--drawer-dim`; DrawerOutlet: `--drawer-expand`

**Data attributes**

- DrawerTrigger (`drawer-trigger`): data-closed, data-disabled, data-open
- DrawerBackdrop (`drawer-backdrop`): data-closed, data-open, data-interactive, data-starting-style, data-ending-style, data-dragging
- Viewport (`drawer-viewport`): data-side (top, right, bottom, left), data-closed, data-open, data-keyboard
- DrawerContent (`drawer-content`): data-closed, data-side (top, right, bottom, left), data-open, data-snap-point (content, 0.2), data-interactive, data-starting-style, data-ending-style, data-driver (pointer, scroll-snap), data-expanded, data-dragging
- DrawerHandle (`drawer-handle`): data-snap-point (content, 0.2), data-expanded
- DrawerClose (`drawer-close`): data-pending
- DrawerOutlet (`drawer-outlet`): data-closed, data-open

**Props**

- Drawer: debug?, container?, open?, defaultOpen?, onOpenChangeComplete?, dismissible?, persistentElements?, pendingAnnouncement?, onOpenChange?, onPayloadChange?, onDismissAttempt?, modal?, closeOnOutsidePress?, controller?, snapPoints?, snapPoint?, defaultSnapPoint?, onSnapPointChange?, side?, modalAbove?, driver?, expandOnScroll?, physics?, themeColor?, preventEdgeSwipe?
- DrawerTrigger: disabled?, focusableWhenDisabled?, payload?, shortcut?, controller?
- DrawerContent: container?, initialFocus?, finalFocus?, keepMounted?
- DrawerClose: value?, action?
- DrawerShortcut: shortcut?
- DrawerOutlet: keyframes?, controller?
- State: open, disabled, open, nested, nestedOpen, interactive, open, modal, nested, nestedOpen, stack, payload, pending, snapPoint, expanded, dragging, side, interactive, snapPoint, canExpand, canCollapse, pending, error, open
- Reasons: trigger-press, close-press, outside-press, escape-key, parent-close, back, action, shortcut, swipe, imperative, trigger-press, shortcut, imperative, back, swipe, imperative, handle-press, handle-key, content-resize, outside-press, escape-key, back, swipe
- Controller: isOpen(), setOpen(open, options?), open(options?), close(options?), toggle(options?), getPayload(), focus(), getSnapPoint(), setSnapPoint(snapPoint, options?)

**Keyboard**

- Enter, Space: On the trigger, opens the drawer; on the handle, moves to the next snap point
- Arrow keys along the axis: On the handle, moves one snap point without wrapping
- Home, End: On the handle, moves to the smallest or largest snap point
- Tab, Shift+Tab: Moves through the sheet's controls, staying inside while it's modal
- Escape: Closes the topmost drawer when it's dismissible

**ARIA:** The trigger is a button that opens a dialog, and the drawer follows the [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) while it's modal: `aria-modal`, focus trapped inside, the page inert, labelled by its title and described by its description. Escape closes it. The handle is a button that controls the drawer: a press moves to the next snap point, arrow keys along the drawer's axis step, and Home and End go to the ends. Every line below is an automated test.

**Tested behavior groups:** Dialog, Sheet, Touch, Handle, Not dismissible, Modal above a snap point, Nested, Dialog, Shortcuts, State attributes, Physics, Touch, Compositor, Page, Scroll-snap driver. Runs in React, Vue and web components.



## Field

Connect a form control to its label, description, and validation errors.

Base UI equivalent: `@base-ui/react/field + fieldset`.

**Doc sections:** Installation, Composition, Usage, Controls, Validation, Errors from Your Code, Required and Disabled, Character Count, Forms, Field Sets, Disabled Field Sets, Groups in a Field Set, Custom Rendering, Custom Controls, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Field
├── FieldLabel
├── Input
├── FieldDescription
└── FieldError
```

**Styling:** Use `data-invalid` and `data-valid` for validation, and `data-focused`, `data-required` and `data-disabled` for the rest. Every part of a field gets the same attributes, so a label can turn red with its control.

**Data attributes**

- Field (`field`): data-disabled, data-invalid
- FieldLabel (`field-label`): data-disabled, data-invalid
- FieldControl (`field-control`): data-disabled, data-invalid
- FieldDescription (`field-description`): data-disabled, data-invalid
- FieldError (`field-error`): data-disabled, data-invalid
- FieldSet (`field-set`): data-disabled
- FieldLegend (`field-legend`): data-disabled
- FieldDescription in a FieldSet (`field-description`): data-disabled

**Props**

- Field: name?, disabled?, invalid?, debug?
- FieldError: match?
- FieldSet: disabled?, debug?
- State: disabled, required, focused, invalid, valid, disabled, required, focused, invalid, valid, message, disabled, required, focused, invalid, valid, disabled

**ARIA:** The label names the control with `aria-labelledby`, beside a native `<label for>` where the control can take one. The description and any error that shows describe it with `aria-describedby`, and an invalid control has `aria-invalid`. The tests below cover these connections and keyboard behavior.



## File Input

Choose, drop, or paste files, validate them, and submit them with a form.

**Base UI gap: no equivalent in @base-ui/react 1.9.0.**

**Notes:** Dropzone drag acceptance is MIME-only before drop (browsers hide names).

**Doc sections:** Installation, Composition, Usage, Upload Button, Accepted Types, Limits, One File, Validation, File List, Attachments, Page-Wide Drop, Folders, Camera, Controlled, Opening from Anywhere, Announcements, Forms, Fields, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
FileInput
├── FileInputTrigger
├── FileInputDropzone
└── FileInputList
    └── FileInputItem
        └── FileInputItemRemove
```

**Styling:** Use `data-dragging`, `data-drag-accept`, and `data-drag-reject` on the drop zone to show what a drop would do. Drag acceptance reflects the file information the browser exposes before a drop. Inside a Field, the trigger also gets the field's attributes, such as `data-invalid`.

**Data attributes**

- FileInput (`file-input`): data-disabled, data-required, data-dragging
- FileInputTrigger (`file-input-trigger`): data-disabled, data-required
- FileInputDropzone (`file-input-dropzone`): data-disabled, data-dragging, data-drag-accept, data-drag-reject
- FileInputList (`file-input-list`): data-disabled, data-required
- FileInputItem (`file-input-item`): data-disabled
- FileInputItemRemove (`file-input-item-remove`): data-disabled

**Props**

- FileInput: accept?, maxFiles?, maxSize?, minSize?, validate?, value?, defaultValue?, onValueChange?, onReject?, multiple?, directory?, capture?, name?, form?, required?, disabled?, announcement?, controller?, debug?
- FileInputTrigger: controller?
- FileInputDropzone: target?, pasteTarget?
- FileInputItem: file
- State: value, disabled, required, dragging, dragging, dragAccept, dragReject, disabled, file, index, disabled, disabled
- Reasons: picker, drop, paste, remove-press, reset, imperative
- Controller: getValue(), setValue(files, options?), addFiles(files, options?), removeFile(file, options?), clear(options?), open(), focus(), isDragging()

**ARIA:** Keep a trigger available alongside a drop zone for people using a keyboard or screen reader. Changes are announced through a polite live region, and the file list supports keyboard navigation and removal.



## Hover Card

Preview a link on hover or keyboard focus while keeping its normal navigation.

Base UI equivalent: `@base-ui/react/preview-card`.

**Doc sections:** Installation, Composition, Usage, Positioning, Delays, Controlled, One Card for Many Links, Container, Animation, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
HoverCard
├── HoverCardTrigger
└── HoverCardContent
    └── HoverCardArrow
```

**Styling:** Each part has a `data-slot`, such as `hover-card-content`, and shows its state through the attributes listed under [Data Attributes](#data-attributes). Use `data-open` on the trigger to mark the link whose card is showing, and `data-side` to style the content and arrow for the side they landed on. Put `transform-origin: var(--transform-origin)` on the content so it scales from the link.

**CSS vars:** HoverCardContent: `--anchor-width`; HoverCardContent: `--anchor-height`; HoverCardContent: `--available-width`; HoverCardContent: `--available-height`; HoverCardContent: `--transform-origin`; HoverCardContent: `--arrow-offset`

**Data attributes**

- HoverCardTrigger (`hover-card-trigger`): data-closed, data-open
- HoverCardContent (`hover-card-content`): data-closed, data-open, data-starting-style, data-ending-style
- HoverCardArrow (`hover-card-arrow`): data-closed, data-open

**Props**

- HoverCard: container?, open?, defaultOpen?, onOpenChange?, onOpenChangeComplete?, onPayloadChange?, delay?, closeDelay?, disabled?, controller?, debug?
- HoverCardTrigger: payload?, controller?
- HoverCardContent: side?, align?, sideOffset?, alignOffset?, collisionPadding?, arrowPadding?, anchor?, container?, keepMounted?
- State: open, open, payload, open
- Reasons: trigger-hover, trigger-focus, trigger-press, focus-out, escape-key, close-press, outside-press, window-blur, back, imperative, trigger-hover, trigger-focus, trigger-press, imperative
- Controller: isOpen(), setOpen(open, options?), open(options?), close(options?), toggle(options?), getPayload(), focus()

**Keyboard**

- Tab: On the link, opens the card after `delay`; with the card open, moves into it
- Enter: Follows the link
- Escape: Closes the card and leaves focus on the link

**ARIA:** The trigger stays a plain link, and the card is a preview beside it, not a dialog. Every line below is an automated test.

**Tested behavior groups:** Pointer, Keyboard, Positioning, Animation, Focus, touch and reasons, Enhancements. Runs in React, Vue and web components.



## Image Cropper

Choose the part of an image to keep by moving and resizing a selection, or by panning and zooming the image under it.

**Base UI gap: no equivalent in @base-ui/react 1.9.0.**

**Notes:** Build target 5. Two modes: `box` (move/resize selection) and `frame` (pan/zoom image under fixed frame). Shape rectangle/circle. Zoom is a native range input. Viewport is `position: relative; overflow: hidden` inline. Needs `src`; `data-loading`/`data-error` cover load states.

**Doc sections:** Installation, Composition, Usage, Aspect Ratio, Frame Mode, Rotate and Flip, Disabled, Controlled, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
ImageCropper
├── ImageCropperViewport
│   ├── ImageCropperImage
│   └── ImageCropperSelection
│       ├── ImageCropperGrid
│       └── ImageCropperHandle
├── ImageCropperZoom
├── ImageCropperRotate
└── ImageCropperFlip
```

**Styling:** Parts are unstyled, apart from the positions they need: the viewport is `position: relative` with `overflow: hidden`, and the image and selection get their place as inline styles in pixels. Give the viewport a size, and the handles a size and a place on their edge or corner of the selection.

**CSS vars:** ImageCropperViewport: `--image-cropper-aspect-ratio`

**Data attributes**

- ImageCropper (`image-cropper`): data-mode (box, frame), data-shape (rectangle, circle), data-loading, data-disabled, data-error, data-dragging
- ImageCropperViewport (`image-cropper-viewport`): data-mode (box, frame), data-shape (rectangle, circle), data-loading, data-disabled, data-error, data-dragging
- ImageCropperImage (`image-cropper-image`): data-mode (box, frame), data-shape (rectangle, circle), data-loading, data-disabled, data-error
- ImageCropperSelection (`image-cropper-selection`): data-mode (box, frame), data-shape (rectangle, circle), data-loading, data-disabled, data-error, data-dragging
- ImageCropperGrid (`image-cropper-grid`): data-mode (box, frame), data-shape (rectangle, circle), data-loading, data-disabled, data-error, data-dragging
- ImageCropperHandle (`image-cropper-handle`): data-position (n, e, s, w, ne, nw, se, sw), data-mode (box, frame), data-shape (rectangle, circle), data-loading, data-disabled, data-error, data-dragging
- ImageCropperZoom (`image-cropper-zoom`): data-mode (box, frame), data-shape (rectangle, circle), data-loading, data-disabled, data-error
- ImageCropperRotate (`image-cropper-rotate`): data-mode (box, frame), data-shape (rectangle, circle), data-loading, data-disabled, data-error
- ImageCropperFlip (`image-cropper-flip`): data-direction (horizontal, vertical), data-mode (box, frame), data-shape (rectangle, circle), data-loading, data-disabled, data-error

**Props**

- ImageCropper: src?, crop?, defaultCrop?, onCropChange?, onCropCommit?, mode?, aspectRatio?, shape?, minWidth?, minHeight?, maxZoom?, disabled?, controller?, debug?
- ImageCropperHandle: position
- ImageCropperFlip: direction?
- State: crop, zoom, loading, error, dragging, mode, shape, disabled, crop, zoom, loading, error, dragging, mode, shape, disabled, position
- Reasons: image-load, drag, pinch, wheel, step-key, zoom-key, zoom-input, rotate-key, rotate-press, flip-press, aspect-ratio-change, imperative
- Controller: getCrop(), setCrop(crop, options?), rotate(direction?, options?), flip(direction?, options?), getZoom(), setZoom(zoom, options?), focus()

**Keyboard**

- Arrow keys: Move the selection, or on a handle, move its edges
- Shift with an arrow: Moves ten times as far
- Plus or Minus: Zooms in or out, about the crop's middle
- R: Turns the image a quarter clockwise, or back with Shift
- Escape: During a drag, puts the crop back where the drag started

**ARIA:** No WAI-ARIA pattern covers an image cropper, so it's built from ones that do. The cropper is a group. The selection and each handle follow the [WAI-ARIA slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/), and say the crop in words, like "300 by 300 pixels, at 50, 0". The zoom is a native range input that says its level, like "125%".

**Tested behavior groups:** Loading, Box, Keyboard, Controls, Frame. Runs in React, Vue and web components.



## Input

Enter text, add a clear button, and connect the value to your form or state.

Base UI equivalent: `@base-ui/react/input`.

**Doc sections:** Installation, Composition, Usage, Fields, Disabled and Read Only, Validation, Input Group, Clear Button, Controlled, Filtering What's Typed, Controller, Passwords and Files, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Input

InputGroup
├── Input
└── InputClear
```

**Styling:** Each part has a `data-slot`, such as `input-group`, and shows its state through the attributes listed under [Data Attributes](#data-attributes). Use `data-filled`, `data-disabled`, `data-readonly` and `data-required` on the input, and the field's validation and focus attributes inside a field. For a group's focus ring, style `:has(input:focus-visible)`, so a focused button inside it keeps its own ring.

**Data attributes**

- Input (`input`): data-filled, data-disabled, data-readonly, data-required
- InputGroup (`input-group`): data-filled, data-disabled, data-readonly
- InputClear (`input-clear`): data-filled, data-disabled, data-readonly

**Props**

- Input: value?, defaultValue?, onValueChange?, controller?, debug?, disabled?, readOnly?, required?
- InputGroup: debug?
- State: filled, disabled, readOnly, required, filled, disabled, readOnly
- Reasons: input-change, clear-press, reset, imperative
- Controller: getValue(), setValue(value, options?), clear(options?), focus()

**ARIA:** Give the input a visible field label or an `aria-label`, and give the clear button an accessible name. The native input keeps standard text editing, selection, autocomplete and form behavior.



## Label

Name any control with a label, and let a press on the label reach it.

**Base UI gap (partial):** No standalone part; Base UI only has Field.Label.

**Doc sections:** Installation, Usage, Build Your Own, Slider, Switch, Wrapping a Control, Custom Rendering, Styling, API Reference, Accessibility

**Styling:** The label is unstyled. It has a `data-slot` of `label`.

**Props**

- Label: debug?

**ARIA:** A native `<label>` names the element its `for` points at only when that element is labelable, like an input or a button. Label names any other control through `aria-labelledby`, unless the control has an `aria-label` or an `aria-labelledby` of its own, which win. Its press does what a native label's does: it checks a checkbox, a switch or a radio, focuses a group's checked radio, and focuses anything else. A press on a disabled control does nothing.

**Tested behavior groups:** —. Runs in React, Vue and web components.



## Listbox

Choose one or several options from an always-visible list.

**Base UI gap: no equivalent in @base-ui/react 1.9.0.**

**Doc sections:** Installation, Composition, Usage, Multiple, Selection That Follows Focus, Manual Activation, Deselectable, Groups, Icons, Horizontal, Disabled, Read-Only, Form, Object Values, Controller, Scrollable, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Listbox
├── ListboxItem
│   └── ListboxItemIndicator
└── ListboxItem
    └── ListboxItemIndicator
```

**Styling:** Use `data-selected` for the selection and `data-highlighted` for focus. They can describe different options when selection does not follow focus. Disabled and read-only states have their own attributes.

**Data attributes**

- Listbox (`listbox`): data-orientation (vertical, horizontal), data-disabled, data-readonly, data-required, data-has-icons
- ListboxItem (`listbox-item`): data-selected, data-disabled, data-highlighted, data-has-icon
- ListboxItemIndicator (`listbox-item-indicator`): data-selected
- ListboxItemIcon (`listbox-item-icon`): data-mirror

**Props**

- Listbox: activation?, deselectable?, orientation?, loop?, keepInView?, items?, itemToValue?, isItemEqualToValue?, onHighlight?, disabled?, readOnly?, required?, name?, form?, controller?, debug?, multiple?, value?, defaultValue?, onValueChange?
- ListboxItem: value, label?, disabled?, index?
- ListboxItemIndicator: keepMounted?
- ListboxItemIcon: mirror?
- State: multiple, orientation, disabled, readOnly, required, items, highlighted, selected, disabled, selected
- Reasons: item-press, list-navigation, reset, restore, imperative
- Controller: getValue(), setValue(value, options?), clear(options?), selectAll(options?), focus()

**ARIA:** Follows the [WAI-ARIA listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/), with both of its keyboard models for several options. Options take real focus with one roving tab stop. Every option says whether it's selected.

**Tested behavior groups:** Focus, Single selection, Multiple selection, Multiple selection with automatic activation, Horizontal, Groups, Form, Changes, Touch. Runs in React, Vue and web components.



## Menu

Choose actions and settings from a button or a context menu.

Base UI equivalent: `@base-ui/react/menu + context-menu`.

**Doc sections:** Installation, Composition, Usage, Submenus, Shortcuts, Icons, Checkboxes, Radio Group, Context Menu, Placement, Offsets and Collision Padding, Modal, Submenu Delay, Keyboard Navigation, Focus After Closing, Disabled Items, Keeping the Menu Open, Container, Animation, Presentation, Controlled, Triggers Outside the Menu, Menus as Data, Links and Custom Rendering, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Menu
├── MenuTrigger
└── MenuContent
    ├── MenuItem
    └── MenuItem
```

**Styling:** Use `data-highlighted` for the active item, `data-disabled` for unavailable actions, and `data-checked` for selected settings. Popup sizing and motion hooks are shared with the [styling guide](../styling-and-animation.md).

**CSS vars:** MenuContent: `--anchor-width`; MenuContent: `--anchor-height`; MenuContent: `--available-width`; MenuContent: `--available-height`; MenuContent: `--transform-origin`; MenuContent: `--arrow-offset`; MenuContent: `--drawer-progress`; MenuContent: `--drawer-dim`; MenuContent: `--drawer-expand`; MenuContent: `--drawer-stack`; MenuContent: `--sheet-backdrop`; Viewport: `--keyboard-inset`; Viewport: `--visual-viewport-width`; Viewport: `--visual-viewport-height`; Viewport: `--visual-viewport-top`

**Data attributes**

- MenuTrigger (`menu-trigger`): data-closed, data-open
- MenuContextTrigger (`menu-context-trigger`): data-closed, data-disabled
- MenuContent (`menu-content`): data-closed, data-presentation (popover, sheet), data-nested, data-open, data-starting-style, data-ending-style, data-has-icons
- MenuItem (`menu-item`): data-disabled, data-has-icon
- MenuCheckboxItem (`menu-checkbox-item`): data-checked, data-unchecked
- MenuItemIndicator (`menu-item-indicator`): data-checked, data-unchecked
- MenuRadioItem (`menu-radio-item`): data-checked, data-unchecked
- MenuItemIcon (`menu-item-icon`): data-mirror

**Props**

- Menu: container?, open?, defaultOpen?, onOpenChange?, onOpenChangeComplete?, onPayloadChange?, onAction?, pendingAnnouncement?, onCheckedChange?, onValueChange?, items?, itemShortcuts?, loop?, delay?, presentation?, controller?, modal?, dismissible?, onDismissAttempt?, debug?
- MenuTrigger: disabled?, focusableWhenDisabled?, payload?, shortcut?, controller?
- MenuContextTrigger: disabled?, payload?, controller?
- MenuContent: side?, align?, sideOffset?, alignOffset?, collisionPadding?, arrowPadding?, anchor?, container?, finalFocus?, keepMounted?
- MenuItem: value?, label?, disabled?, destructive?, shortcut?, closeOnSelect?, onSelect?
- MenuCheckboxItem: value, label?, disabled?, checked?, defaultChecked?, onCheckedChange?, closeOnSelect?
- MenuRadioGroup: value?, defaultValue?, onValueChange?, name?
- MenuRadioItem: value, label?, disabled?, closeOnSelect?
- MenuItemIndicator: keepMounted?
- MenuItemIcon: mirror?
- MenuSub: debug?, open?, defaultOpen?, onOpenChange?, onOpenChangeComplete?, loop?, delay?, controller?
- MenuSubTrigger: disabled?
- State: open, disabled, open, nested, presentation, payload, highlighted, disabled, pending, error, highlighted, disabled, checked, value, checked, disabled, mirror
- Reasons: trigger-press, trigger-hover, item-press, outside-press, escape-key, close-press, focus-out, window-blur, submenu-switch, parent-close, trigger-release, back, shortcut, swipe, imperative, trigger-press, trigger-hover, shortcut, imperative, outside-press, escape-key, back, swipe, item-press, imperative, item-press, imperative
- Controller: isOpen(), setOpen(open, options?), open(options?), close(options?), toggle(options?), getPayload(), focus()

**ARIA:** The menu follows the [WAI-ARIA menu button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/).

**Tested behavior groups:** Trigger, Keyboard navigation, Activation, Dismissal, Submenu. Runs in React, Vue and web components.



## Menubar

Move between an application’s menus with one tab stop.

Base UI equivalent: `@base-ui/react/menubar`.

**Doc sections:** Installation, Composition, Usage, Submenu, Vertical, Menus as Data, Disabled, Modal, Loop, Controller, Shared Menu Features, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Menubar
├── Menu
│   ├── MenuTrigger
│   └── MenuContent
│       ├── MenuItem
│       └── MenuItem
└── Menu
    ├── MenuTrigger
    └── MenuContent
        ├── MenuItem
        └── MenuItem
```

**Styling:** The bar gets `data-open` while any menu is open; a trigger gets it only for its own menu. Use `data-orientation` for row or column layout. Style the popups and their items through the same [Menu attributes and CSS variables](./menu.md#styling).

**Data attributes**

- Menubar (`menubar`): data-orientation (horizontal, vertical), data-disabled, data-open

**Props**

- Menubar: orientation?, loop?, disabled?, modal?, controller?, debug?
- State: orientation, disabled, open, modal
- Controller: focus(), isOpen(), close(options?)

**Keyboard**

- Left / Right: Previous or next trigger.
- Down: Open at the first item.
- Up: Open at the last item.
- Enter / Space: Open at the first item.
- Home / End: First or last trigger.
- A letter: Find a trigger by name.
- Escape: —
- Tab / Shift+Tab: Leave the bar.

**ARIA:** The menubar follows the [WAI-ARIA menubar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/).

**Tested behavior groups:** Vertical. Runs in React, Vue and web components.



## Meter

Show a measurement within a known range, such as storage used or an account quota.

Base UI equivalent: `@base-ui/react/meter`.

**Doc sections:** Installation, Composition, Usage, Build Your Own, Bounds, Format and Locale, Value Label, Changing the Value, Custom Rendering, Styling, API Reference, Accessibility

**Composition**

```text
Meter
├── MeterLabel
├── MeterValue
└── MeterTrack
    └── MeterIndicator
```

**Styling:** Give the track a height, background, and width. The indicator sets its width as an inline percentage of the track. Both styling options are shown in each example's Code tab.

**CSS vars:** Meter: `--meter-value`

**Props**

- Meter: min?, max?, format?, locale?, getValueLabel?, value, debug?
- State: value, percent, value, percent, text

**ARIA:** Name the component with `MeterLabel` or `aria-label`. It exposes the range and formatted value through the `meter` role. Use `getValueLabel` when that value needs more explanation.

**Tested behavior groups:** —. Runs in React, Vue and web components.



## Navigation Menu

Groups site links into panels that open from a row of triggers.

Base UI equivalent: `@base-ui/react/navigation-menu`.

**Doc sections:** Installation, Composition, Usage, Link Component, Icons, Vertical, Click Only, Nested, Animation, Delay, Indicator, Viewport Placement, Without a Viewport, Controlled, Opening from Anywhere, Keep Mounted, Close on Select, Container, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
NavigationMenu
├── NavigationMenuList
│   ├── NavigationMenuItem
│   │   ├── NavigationMenuTrigger
│   │   └── NavigationMenuContent
│   │       └── NavigationMenuLink
│   └── NavigationMenuItem
│       ├── NavigationMenuTrigger
│       └── NavigationMenuContent
│           └── NavigationMenuLink
└── NavigationMenuViewport
```

**Styling:** Parts are unstyled. Style them through the attributes they render, which are the same in every framework. Each part has a `data-slot`, such as `navigation-menu-trigger`, and its state attributes are listed under [Data Attributes](#data-attributes).

**CSS vars:** NavigationMenuContent: `--anchor-width`; NavigationMenuContent: `--anchor-height`; NavigationMenuContent: `--available-width`; NavigationMenuContent: `--available-height`; NavigationMenuContent: `--transform-origin`; NavigationMenuContent: `--arrow-offset`; NavigationMenuViewport: `--anchor-width`; NavigationMenuViewport: `--anchor-height`; NavigationMenuViewport: `--available-width`; NavigationMenuViewport: `--available-height`; NavigationMenuViewport: `--transform-origin`; NavigationMenuViewport: `--arrow-offset`; NavigationMenuViewport: `--viewport-width`; NavigationMenuViewport: `--viewport-height`; NavigationMenuIndicator: `--active-item-left`; NavigationMenuIndicator: `--active-item-right`; NavigationMenuIndicator: `--active-item-top`; NavigationMenuIndicator: `--active-item-bottom`; NavigationMenuIndicator: `--active-item-width`; NavigationMenuIndicator: `--active-item-height`

**Data attributes**

- NavigationMenu (`navigation-menu`): data-orientation (horizontal, vertical), data-nested
- NavigationMenuList (`navigation-menu-list`): data-orientation (horizontal, vertical), data-has-icons
- NavigationMenuItem (`navigation-menu-item`): data-closed, data-open
- NavigationMenuTrigger (`navigation-menu-trigger`): data-closed, data-disabled, data-open
- NavigationMenuContent (`navigation-menu-content`): data-orientation (horizontal, vertical), data-closed, data-open, data-starting-style, data-ending-style, data-motion (from-start, from-end, to-start, to-end), data-side (top, right, bottom, left), data-align (start, center, end)
- NavigationMenuLink (`navigation-menu-link`): data-has-icon
- NavigationMenuLinkIcon (`navigation-menu-link-icon`): data-mirror
- NavigationMenuViewport (`navigation-menu-viewport`): data-orientation (horizontal, vertical), data-closed, data-open, data-starting-style, data-ending-style, data-side (top, right, bottom, left), data-align (start, center, end)
- NavigationMenuIndicator (`navigation-menu-indicator`): data-orientation (horizontal, vertical), data-closed, data-open, data-visible

**Props**

- NavigationMenu: container?, value?, defaultValue?, onValueChange?, onOpenChangeComplete?, delay?, closeDelay?, openOnHover?, closeOnSelect?, orientation?, controller?, debug?
- NavigationMenuItem: value?
- NavigationMenuTrigger: disabled?
- NavigationMenuContent: side?, align?, sideOffset?, alignOffset?, collisionPadding?, arrowPadding?, anchor?, container?, keepMounted?, hiddenUntilFound?
- NavigationMenuLink: current?, closeOnSelect?
- NavigationMenuLinkIcon: mirror?
- NavigationMenuViewport: side?, align?, sideOffset?, alignOffset?, collisionPadding?, arrowPadding?, anchor?, container?
- State: value, open, orientation, nested, open, orientation, open, open, disabled, open, motion, orientation, current, mirror, open, orientation, open, orientation
- Reasons: trigger-hover, trigger-press, escape-key, close-press, outside-press, focus-out, link-press, find-in-page, parent-close, imperative
- Controller: getValue(), setValue(value, options?), isOpen(), close(options?), focus(value?)

**Keyboard**



**ARIA:** The menu follows the [disclosure navigation pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/): a landmark with a list of buttons that show and hide groups of links.

**Tested behavior groups:** Pointer, Keyboard, Links, Viewport, Kept content, Animation, Reasons, Nested, Keyboard, Pointer, Links, Without a viewport, Motion, Indicator, Find in page, Nested. Runs in React, Vue and web components.



## Number Input

Enter numbers, step through values, and format them for a locale.

Base UI equivalent: `@base-ui/react/number-field`.

**Doc sections:** Installation, Composition, Usage, Field, Min and Max, Step and Large Step, Format, Locale, Mouse Wheel, Scrub Area, Disabled, Read-Only, Validation, Controlled, Controller, Form, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
NumberInput
├── NumberInputScrubArea
│   └── NumberInputScrubAreaCursor
└── NumberInputGroup
    ├── NumberInputDecrement
    ├── NumberInputControl
    └── NumberInputIncrement
```

**Styling:** Style the group as the field's box, and the input and step buttons inside it. `data-disabled` on a step button also means it has reached its bound, and `data-scrubbing` marks every part while a drag changes the value. Inside Field, the native input receives validation attributes such as `data-invalid`. Use logical spacing so the layout follows the surrounding direction.

**Data attributes**

- NumberInput (`number-input`): data-disabled, data-readonly, data-required, data-scrubbing
- NumberInputScrubArea (`number-input-scrub-area`): data-disabled, data-readonly, data-required, data-orientation (horizontal, vertical), data-scrubbing
- NumberInputScrubAreaCursor (`number-input-scrub-area-cursor`): data-disabled, data-readonly, data-required, data-scrubbing
- NumberInputGroup (`number-input-group`): data-disabled, data-readonly, data-required, data-scrubbing
- NumberInputDecrement (`number-input-decrement`): data-disabled, data-readonly, data-required, data-at-bound, data-scrubbing
- NumberInputControl (`number-input-control`): data-disabled, data-readonly, data-required, data-scrubbing
- NumberInputIncrement (`number-input-increment`): data-disabled, data-readonly, data-required, data-scrubbing

**Props**

- NumberInput: value?, defaultValue?, onValueChange?, onValueCommit?, min?, max?, step?, largeStep?, smallStep?, format?, locale?, wheel?, disabled?, readOnly?, required?, name?, form?, controller?, debug?
- NumberInputScrubArea: orientation?, pixelsPerStep?, controller?
- NumberInputIncrement and NumberInputDecrement: disabled?
- State: value, disabled, readOnly, required, scrubbing, value, disabled, readOnly, required, scrubbing, atBound
- Reasons: input-change, input-commit, step-key, increment-press, decrement-press, wheel, scrub, reset, restore, imperative
- Controller: getValue(), setValue(value, options?), increment(options?), decrement(options?), focus()

**Keyboard**

- Input: Increment
- ArrowUp, ArrowDown, or a step button: `step`, which defaults to 1.
- Shift with an arrow or button; Page Up or Page Down: `largeStep`, which defaults to ten steps.
- Alt (Option) with an arrow key: `smallStep`, which defaults to a tenth of a step.
- Home or End: The minimum or maximum, when set.

**ARIA:** Follows the keyboard model of the [WAI-ARIA spinbutton pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/) on a native text input, so ordinary text editing works too. Give the input a FieldLabel or `aria-label`, and name both step buttons. Each button points to the input with `aria-controls`.

**Tested behavior groups:** Keyboard, Typing, Buttons, State and forms. Runs in React, Vue and web components.



## OTP Input

Enter a one-time code with support for pasting, autofill, and native form validation.

Base UI equivalent: `@base-ui/react/otp-field`.

**Doc sections:** Installation, Composition, Usage, Four Digits, Alphanumeric, Custom Pattern, Validation, Controlled, On Complete, Forms, Disabled and Read-Only, Controller, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
OTPInput
└── OTPInputGroup
    ├── OTPInputSlot
    └── OTPInputSlot
```

**Styling:** Draw the active slot and caret with `data-active` and `data-fake-caret`. The examples include the caret animation and disable it for reduced motion. Keep `position: relative` on each slot so its caret stays inside it.

**Data attributes**

- OTPInput (`otp-input`): data-complete, data-filled, data-disabled, data-focused
- OTPInputGroup (`otp-input-group`): data-complete, data-filled, data-disabled, data-focused
- OTPInputSlot (`otp-input-slot`): data-filled, data-disabled, data-active, data-fake-caret
- OTPInputSeparator (`otp-input-separator`): data-disabled

**Props**

- OTPInput: debug?, value?, defaultValue?, onValueChange?, onValueCommit?, maxLength?, pattern?, inputMode?, textAlign?, autoComplete?, disabled?, readOnly?, required?, name?, form?, controller?
- OTPInputSlot: index
- State: value, slots, focused, complete, disabled, char, active, hasFakeCaret, index, focused, disabled
- Reasons: input-change, paste, undo, redo, reset, restore, imperative
- Controller: getValue(), setValue(value, options?), clear(options?), focus()

**Keyboard**



**ARIA:** Name the input with FieldLabel, a native label, `aria-label`, or `aria-labelledby`. Screen readers encounter one input with the whole code; the visual slots, groups, and separators are hidden from them.

**Tested behavior groups:** —. Runs in React, Vue and web components.



## Pagination

Navigate pages with buttons, links, or your router.

**Base UI gap: no equivalent in @base-ui/react 1.9.0.**

**Doc sections:** Installation, Composition, Usage, Total and Page Size, Simple, Links, Router Links, Controlled, Default Page, Siblings, Boundaries, Paging from Anywhere, Your Own Markup, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Pagination
└── PaginationList
    ├── PaginationItem
    │   └── PaginationPrevious
    ├── PaginationItem
    │   └── PaginationLink
    ├── PaginationItem
    │   └── PaginationEllipsis
    ├── PaginationItem
    │   └── PaginationLink
    └── PaginationItem
        └── PaginationNext
```

**Styling:** Parts are unstyled. Style them through the attributes they render, which are the same in every framework: `aria-current="page"` or `data-current` on the current page's link, and `aria-disabled` or `data-disabled` on a step at its end.

**Data attributes**

- PaginationLink (`pagination-link`): data-current
- PaginationPrevious (`pagination-previous`): data-disabled
- PaginationNext (`pagination-next`): data-disabled
- PaginationFirst (`pagination-first`): data-disabled
- PaginationLast (`pagination-last`): data-disabled

**Props**

- Pagination: page?, defaultPage?, onPageChange?, pageCount?, total?, pageSize?, siblings?, boundaries?, getHref?, controller?, debug?
- PaginationLink: page
- State: page, pageCount, items, page, current, page, disabled
- Reasons: item-press, previous-press, next-press, first-press, last-press, imperative
- Controller: getPage(), getPageCount(), setPage(page, options?), next(options?), previous(options?), first(options?), last(options?)

**ARIA:** There's no WAI-ARIA pattern for pagination. It follows the common practice: a `navigation` landmark named with `aria-label`, a list of links or buttons, and `aria-current="page"` on the current one. The list keeps the `list` role even when styled without bullets, which Safari would otherwise drop.

**Tested behavior groups:** —. Runs in React, Vue and web components.



## Password Input

Enter a password, show or hide it, and use it in a native form.

**Base UI gap (partial):** No dedicated part; plain Input, no visibility toggle or Caps Lock state.

**Doc sections:** Installation, Composition, Usage, New Password, Shown at First, Caps Lock, Disabled, Read-Only, Controlled Visibility, Controller, Forms, Controlled Value, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
PasswordInput
├── PasswordInputControl
└── PasswordInputToggle
```

**Styling:** Style the root as the field's box, with the native input and the toggle inside it. `data-visible` marks every part while the password is shown, and the toggle also sets `aria-pressed`. Use `data-capslock` for a Caps Lock warning, and `data-filled`, `data-disabled` and `data-readonly` for the field's other states. Inside Field, the native input also receives validation attributes such as `data-invalid`. Use logical spacing so the field and toggle follow the surrounding direction.

**Data attributes**

- PasswordInput (`password-input`): data-visible, data-filled, data-disabled, data-readonly, data-required, data-capslock
- PasswordInputControl (`password-input-control`): data-visible, data-filled, data-disabled, data-readonly, data-required, data-capslock
- PasswordInputToggle (`password-input-toggle`): data-visible, data-filled, data-disabled, data-readonly, data-required, data-capslock

**Props**

- PasswordInput: value?, defaultValue?, onValueChange?, visible?, defaultVisible?, onVisibleChange?, autoComplete?, name?, form?, required?, disabled?, readOnly?, controller?, debug?
- State: visible, capsLock, filled, disabled, readOnly, required
- Reasons: input-change, clear-press, reset, imperative, toggle-press, form-submit, reset, page-hide, imperative
- Controller: getValue(), setValue(value, options?), clear(options?), isVisible(), setVisible(visible, options?), toggleVisible(options?), focus()

**Keyboard**



**ARIA:** There's no WAI-ARIA pattern for a password field. The input stays a native password field named by its Field label or an `aria-label`, and the toggle follows the [WAI-ARIA button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) as a toggle button. Name the toggle by what it does, such as “Show password”, and keep that name the same: its `aria-pressed` state tells screen readers whether the password is shown, and `aria-controls` points to the input.

**Tested behavior groups:** —. Runs in React, Vue and web components.



## Popover

Edit or explore something beside its trigger.

Base UI equivalent: `@base-ui/react/popover`.

**Doc sections:** Installation, Composition, Usage, Forms, Keep It Open While Editing, Placement, Offsets, Arrow, Anchor, Modal, Focus, Open on Hover, Controlled, Keyboard Shortcut, Triggers Outside the Popover, Animation, Presentation, Container, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Popover
├── PopoverTrigger
└── PopoverContent
    ├── PopoverArrow
    ├── PopoverTitle
    ├── PopoverDescription
    └── PopoverClose
```

**Styling:** Use `data-open` on the trigger to mark it while its popover shows, and `data-side` and `data-align` to style the content and arrow for where they landed. Put `transform-origin: var(--transform-origin)` on the content so a scale animation starts from the trigger.

**CSS vars:** PopoverContent: `--anchor-width`; PopoverContent: `--anchor-height`; PopoverContent: `--available-width`; PopoverContent: `--available-height`; PopoverContent: `--transform-origin`; PopoverContent: `--arrow-offset`; PopoverContent: `--drawer-progress`; PopoverContent: `--drawer-dim`; PopoverContent: `--drawer-expand`; PopoverContent: `--drawer-stack`; PopoverContent: `--sheet-backdrop`; Viewport: `--keyboard-inset`; Viewport: `--visual-viewport-width`; Viewport: `--visual-viewport-height`; Viewport: `--visual-viewport-top`

**Data attributes**

- PopoverTrigger (`popover-trigger`): data-closed, data-disabled, data-open
- PopoverContent (`popover-content`): data-closed, data-presentation (popover, sheet), data-open, data-starting-style, data-ending-style
- PopoverArrow (`popover-arrow`): data-closed, data-open

**Props**

- Popover: container?, open?, defaultOpen?, onOpenChange?, onOpenChangeComplete?, onPayloadChange?, modal?, openOnHover?, delay?, closeDelay?, presentation?, controller?, dismissible?, onDismissAttempt?, debug?
- PopoverTrigger: disabled?, focusableWhenDisabled?, payload?, shortcut?, controller?
- PopoverContent: side?, align?, sideOffset?, alignOffset?, collisionPadding?, arrowPadding?, anchor?, container?, initialFocus?, finalFocus?, keepMounted?
- PopoverShortcut: shortcut?
- State: open, disabled, open, modal, presentation, payload, open, text
- Reasons: trigger-press, trigger-hover, outside-press, escape-key, focus-out, window-blur, close-press, back, shortcut, swipe, imperative, trigger-press, trigger-hover, shortcut, imperative, outside-press, escape-key, back, swipe
- Controller: isOpen(), setOpen(open, options?), open(options?), close(options?), toggle(options?), getPayload(), focus()

**ARIA:** The trigger is a button that opens a dialog, and focus inside follows the [WAI-ARIA dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

**Tested behavior groups:** Trigger, Focus, Dismissal, Modal, Hover, Nested popovers, Enhancements, Shortcuts, Web components. Runs in React, Vue and web components.



## Preferences

Apply user preferences to data attributes so your styles can follow them.

**Base UI gap (partial):** No equivalent.

**Doc sections:** Installation, Usage, Save the Value, Read the Value, Apply to the Whole Page, Multiple Preferences, Server Rendering, API Reference

**Props**

- Preferences: nonce?, preferences



## Progress

Show a task’s progress, or an indeterminate state while its progress is unknown.

Base UI equivalent: `@base-ui/react/progress`.

**Doc sections:** Installation, Composition, Usage, Build Your Own, Indeterminate, Changing the Value, Bounds, Format and Locale, Value Label, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Progress
├── ProgressLabel
├── ProgressValue
└── ProgressTrack
    └── ProgressIndicator
```

**Styling:** Give the track a height, background, and width. The indicator sets its width as an inline percentage of the track. Style `data-indeterminate` for a task whose progress is unknown, since the indicator has no width then, and `data-complete` once the task finishes. Both styling options are shown in each example's Code tab.

**CSS vars:** Progress: `--progress-value`

**Data attributes**

- Progress (`progress`): data-indeterminate, data-progressing, data-complete
- ProgressLabel (`progress-label`): data-indeterminate, data-progressing, data-complete
- ProgressValue (`progress-value`): data-indeterminate, data-progressing, data-complete
- ProgressTrack (`progress-track`): data-indeterminate, data-progressing, data-complete
- ProgressIndicator (`progress-indicator`): data-indeterminate, data-progressing, data-complete

**Props**

- Progress: min?, max?, format?, locale?, getValueLabel?, value?, debug?
- State: value, percent, status, value, percent, status, text

**ARIA:** Name the component with `ProgressLabel` or `aria-label`. It exposes the range and formatted value through the `progressbar` role. Use `getValueLabel` when that value needs more explanation.

**Tested behavior groups:** —. Runs in React, Vue and web components.



## Radio

Choose one option, move the selection with arrow keys, and submit it with a form.

Base UI equivalent: `@base-ui/react/radio + radio-group`.

**Doc sections:** Installation, Composition, Usage, Description, Choice Card, Fieldset and Legend, Disabled, Read-Only, Controlled, Form, Validation, Animation, Loop, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
RadioGroup
├── Radio
│   └── RadioIndicator
└── Radio
    └── RadioIndicator
```

**Styling:** Use `data-checked` and `data-unchecked` for the checked state, and `data-disabled`, `data-readonly` and `data-required` for the rest. The indicator gets the same state attributes as its radio, and the group gets `data-disabled`, `data-readonly` and `data-required`.

**Data attributes**

- RadioGroup (`radio-group`): data-readonly, data-required, data-disabled
- Radio (`radio`): data-checked, data-readonly, data-required, data-unchecked, data-disabled
- RadioIndicator (`radio-indicator`): data-checked, data-readonly, data-required, data-unchecked, data-disabled, data-starting-style, data-ending-style

**Props**

- RadioGroup: value?, defaultValue?, onValueChange?, disabled?, readOnly?, required?, name?, form?, loop?, controller?, debug?
- Radio: value, disabled?
- RadioIndicator: keepMounted?
- State: value, disabled, readOnly, required, checked, disabled, readOnly, required, checked, disabled, readOnly, required
- Reasons: item-press, list-navigation, reset, restore, imperative
- Controller: getValue(), setValue(value, details?), focus()

**Keyboard**

- Tab: Moves into the group, onto the checked radio or the first enabled one
- Arrow keys: Move to the next or previous radio and check it, skipping disabled ones
- Space: Checks the focused radio
- Enter: Submits its form

**ARIA:** Radio groups follow the [WAI-ARIA radio group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/), and behave like native radios that share a name. `Radio` renders a button with the `radio` role, and a hidden native radio that takes part in forms.

**Tested behavior groups:** Selection, Keyboard, Read-only and disabled, Animation, With every radio enabled, A disabled radio. Runs in React, Vue and web components.



## Rating

Pick a score from a row of stars, whole or half, with a preview as the pointer moves over them.

**Base UI gap: no equivalent in @base-ui/react 1.9.0.**

**Notes:** Build target 3. Radios per score (step 0.5 = two radios per star); read-only flips to `img` role named by `getValueLabel`. `--rating-fill` 0–1 per star drives partial fill (clip-path/inline-size). Preview via `data-highlighted` (pointer only, not touch).

**Doc sections:** Installation, Composition, Usage, Stars, Half Stars, Preview, Deselectable, Read-Only, Disabled, Controlled, Form, Stars and Labels, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Rating
└── RatingItem
```

**Styling:** Parts are unstyled. Use `data-filled`, `data-partial`, `data-checked` and `data-highlighted` on each star, and `--rating-fill` for how full it is. `data-disabled`, `data-readonly` and `data-required` are on the rating and its stars.

**CSS vars:** RatingItem: `--rating-fill`

**Data attributes**

- Rating (`rating`): data-required, data-readonly, data-disabled
- RatingItem (`rating-item`): data-filled, data-partial, data-checked, data-disabled, data-readonly, data-highlighted

**Props**

- Rating: value?, defaultValue?, onValueChange?, max?, step?, deselectable?, disabled?, readOnly?, required?, name?, form?, loop?, getValueLabel?, controller?, debug?
- State: value, highlighted, disabled, readOnly, required, index, fill, checked, highlighted, disabled, readOnly
- Reasons: item-press, list-navigation, reset, restore, imperative
- Controller: getValue(), setValue(value, details?), focus()

**Keyboard**

- Tab: Moves into the rating, onto the checked star or the first one
- Arrow keys: Move to the next or previous score and check it, stopping at the ends unless `loop` is set
- Space: Checks the focused star, or clears it when it's checked and `deselectable`
- Enter: Submits its form

**ARIA:** A rating is a radio group, so it follows the [WAI-ARIA radio group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) and behaves like native radios that share a name. Each star holds a button with the `radio` role per score it can pick, and a hidden native radio that takes part in forms. Icons inside the stars should be hidden from screen readers with `aria-hidden`, since each radio is already named. A read-only rating has the `img` role instead, named by `getValueLabel`.

**Tested behavior groups:** Selection, Preview, Keyboard, Read-only, Forms. Runs in React, Vue and web components.



## Resizable

Resize, collapse, and save panel layouts with pointer and keyboard controls.

**Base UI gap: no equivalent in @base-ui/react 1.9.0.**

**Doc sections:** Installation, Composition, Usage, Build Your Own, Vertical, Handle, Collapsible, Sizes in Pixels, Default Layout, Controlled, Saving on Complete, Persistence, Storage, Controller, Step Size, Disabled, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Resizable
├── ResizablePanel
├── ResizableHandle
└── ResizablePanel
```

**Styling:** Parts are unstyled, apart from the layout they need: the group is a flex row or column, panels take their size as a flex basis, and handles don't shrink and take `touch-action: none`. Give the group a size, the handle a width or height and a background, and style it with `data-hovering`, `data-dragging` and `:focus-visible`. While a handle is hovered or dragged, its cursor shows over the whole page, and points the only way it can go at a limit.

**CSS vars:** ResizablePanel: `--resizable-panel-size`

**Data attributes**

- Resizable (`resizable`): data-orientation (horizontal, vertical), data-disabled, data-dragging
- ResizablePanel (`resizable-panel`): data-orientation (horizontal, vertical), data-collapsed
- ResizableHandle (`resizable-handle`): data-orientation (horizontal, vertical), data-disabled, data-dragging, data-hovering

**Props**

- Resizable: layout?, defaultLayout?, onLayoutChange?, onLayoutCommit?, orientation?, disabled?, step?, largeStep?, autoSaveId?, storage?, controller?, debug?
- ResizablePanel: id?, defaultSize?, minSize?, maxSize?, collapsible?, collapsedSize?
- ResizableHandle: disabled?
- State: orientation, disabled, dragging, layout, orientation, size, collapsed, collapsible, orientation, disabled, dragging, hovering
- Reasons: drag, step-key, collapse, resize, imperative
- Controller: getLayout(), setLayout(layout, options?), collapse(panel, options?), expand(panel, options?), resize(panel, size, options?), isCollapsed(panel)

**Keyboard**



**ARIA:** Handles follow the [WAI-ARIA window splitter pattern](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/). Each is a focusable `separator` whose `aria-valuenow` is the size of the panel before it, with `aria-valuemin` and `aria-valuemax` as far as the panels allow, `aria-controls` pointing at that panel, and `aria-orientation` running across the group. Name each handle with `aria-label`.

**Tested behavior groups:** Keyboard, Pointer, Controller, Container, Pages around a group. Runs in React, Vue and web components.



## Scroll Area

Add styled scrollbars, edge indicators, and follow-to-end behavior to native scrolling.

Base UI equivalent: `@base-ui/react/scroll-area`.

**Doc sections:** Installation, Composition, Usage, Horizontal, Both Axes, Edge Fades, Native Scrollbars, When Scrollbars Show, Hide Delay, Controller, Pointer, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
ScrollArea
├── ScrollAreaViewport
│   └── ScrollAreaContent
└── ScrollAreaScrollbar
    └── ScrollAreaThumb
```

**Styling:** Give the root a size and the viewport its full width and height; the parts set the positioning and overflow they need. Give each scrollbar a width or height and show it under `data-visible`. The thumb sizes and moves itself. Fades and shadows read the root's CSS variables.

**CSS vars:** ScrollArea: `--scroll-area-overflow-y-start`; ScrollArea: `--scroll-area-overflow-y-end`; ScrollArea: `--scroll-area-overflow-x-start`; ScrollArea: `--scroll-area-overflow-x-end`; ScrollArea: `--scroll-area-progress-y`; ScrollArea: `--scroll-area-progress-x`; ScrollArea: `--scroll-area-corner-width`; ScrollArea: `--scroll-area-corner-height`; ScrollAreaScrollbar: `--scroll-area-thumb-height`; ScrollAreaScrollbar: `--scroll-area-thumb-width`; ScrollAreaScrollbar: `--scroll-area-thumb-offset`

**Data attributes**

- ScrollArea (`scroll-area`): data-overflow-x, data-overflow-y, data-at-start, data-at-end, data-at-x-start, data-at-x-end, data-at-y-start, data-at-y-end, data-scrolling, data-hovering, data-sticking
- ScrollAreaViewport (`scroll-area-viewport`): data-overflow-y, data-at-start, data-at-end, data-scrolling, data-sticking
- ScrollAreaContent (`scroll-area-content`): data-overflow-y, data-at-start, data-at-end
- ScrollAreaScrollbar (`scroll-area-scrollbar`): data-orientation (vertical, horizontal), data-visible, data-scrolling, data-hovering, data-dragging, data-overflow-y
- ScrollAreaThumb (`scroll-area-thumb`): data-orientation (vertical, horizontal), data-dragging
- ScrollAreaScrollToEnd (`scroll-area-scroll-to-end`): data-visible

**Props**

- ScrollArea: type?, scrollHideDelay?, stickToEnd?, controller?, debug?
- ScrollAreaScrollbar: orientation?
- State: overflowX, overflowY, atStart, atEnd, scrolling, hovering, sticking, orientation, visible, scrolling, hovering, dragging, orientation, dragging, visible
- Controller: scrollToEnd(options?), scrollToStart(options?), isAtEnd(), isAtStart(), isSticking(), behavior?

**Keyboard**



**ARIA:** No WAI-ARIA pattern covers scroll areas: the viewport is a native scroller, and keyboard access follows axe's [scrollable-region-focusable](https://dequeuniversity.com/rules/axe/4.10/scrollable-region-focusable) rule. Scrollbars and the corner are hidden from screen readers, which scroll the viewport themselves. Make the viewport a landmark with `role="region"` and an `aria-label` when it's worth finding, or give a chat `role="log"`.

**Tested behavior groups:** Thumb, Track, Overflow, Keyboard, Web components, Track, Keyboard, Native scrollbars, State, Scrollbar types, Sticking to the end, Jump to latest, Hidden scrollbars. Runs in React, Vue and web components.



## Segmented Control

Pick one of a few options from a row of buttons, with an indicator that slides to the choice.

**Base UI gap (partial):** No dedicated part; approximated with toggle-group, no sliding indicator vars.

**Doc sections:** Installation, Composition, Usage, Indicator, Vertical, Disabled, Controlled, Form, Read-Only, Loop, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
SegmentedControl
├── SegmentedControlIndicator
├── SegmentedControlItem
└── SegmentedControlItem
```

**Styling:** Parts are unstyled. Use `data-checked` and `data-unchecked` for the checked item, and `data-disabled`, `data-readonly` and `data-required` for the rest. `data-orientation` is on the control and the indicator.

**CSS vars:** SegmentedControlIndicator: `--segmented-control-indicator-left`; SegmentedControlIndicator: `--segmented-control-indicator-right`; SegmentedControlIndicator: `--segmented-control-indicator-top`; SegmentedControlIndicator: `--segmented-control-indicator-bottom`; SegmentedControlIndicator: `--segmented-control-indicator-width`; SegmentedControlIndicator: `--segmented-control-indicator-height`

**Data attributes**

- SegmentedControl (`segmented-control`): data-orientation (horizontal, vertical), data-readonly, data-required, data-disabled
- SegmentedControlItem (`segmented-control-item`): data-checked, data-readonly, data-required, data-unchecked, data-disabled
- SegmentedControlIndicator (`segmented-control-indicator`): data-orientation (horizontal, vertical)

**Props**

- SegmentedControl: value?, defaultValue?, onValueChange?, disabled?, readOnly?, required?, name?, form?, loop?, orientation?, controller?, debug?
- SegmentedControlItem: value, disabled?
- State: value, disabled, readOnly, required, orientation, checked, disabled, readOnly, required, value, orientation
- Reasons: item-press, list-navigation, reset, restore, imperative
- Controller: getValue(), setValue(value, details?), focus()

**Keyboard**

- Tab: Moves into the control, onto the checked item or the first enabled one
- Arrow keys: Move to the next or previous item and check it, skipping disabled ones
- Space: Checks the focused item
- Enter: Submits its form

**ARIA:** A segmented control is a radio group, so it follows the [WAI-ARIA radio group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) and behaves like native radios that share a name. Each `SegmentedControlItem` renders a button with the `radio` role, and a hidden native radio that takes part in forms. The indicator is presentational, so screen readers skip it.

**Tested behavior groups:** Selection, Keyboard, Orientation, Indicator, Forms. Runs in React, Vue and web components.



## Select

Choose one value or several from a popup list.

Base UI equivalent: `@base-ui/react/select`.

**Doc sections:** Installation, Composition, Usage, Items as Data, Groups, Icons, Typeahead, Disabled, Clear Button, Multiple, Select All, Search with Groups, Async Search, Object Values, Virtualized, Align Item with Trigger, Scrollable, Invalid, Forms, Presentation, Controlled, Controller, Positioning, Modal, Container, Animation, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Select
├── SelectLabel
├── SelectTrigger
│   └── SelectValue
└── SelectContent
    ├── SelectItem
    └── SelectItem
```

**Styling:** Use `data-highlighted` for the active item, `data-selected` for chosen items, and `data-placeholder` on the trigger and value while nothing is selected. `data-modality="keyboard"` on the content tells a keyboard highlight from a pointer one.

**CSS vars:** SelectContent: `--anchor-width`; SelectContent: `--anchor-height`; SelectContent: `--available-width`; SelectContent: `--available-height`; SelectContent: `--transform-origin`; SelectContent: `--arrow-offset`; SelectContent: `--drawer-progress`; SelectContent: `--drawer-dim`; SelectContent: `--drawer-expand`; SelectContent: `--drawer-stack`; SelectContent: `--sheet-backdrop`; Viewport: `--keyboard-inset`; Viewport: `--visual-viewport-width`; Viewport: `--visual-viewport-height`; Viewport: `--visual-viewport-top`

**Data attributes**

- SelectLabel (`select-label`): data-disabled, data-readonly, data-required
- SelectTrigger (`select-trigger`): data-closed, data-disabled, data-open, data-placeholder, data-readonly, data-required
- SelectValue (`select-value`): data-placeholder
- SelectClear (`select-clear`): data-disabled
- SelectContent (`select-content`): data-closed, data-presentation (popover, sheet), data-open, data-starting-style, data-ending-style, data-modality (keyboard, pointer), data-has-icons
- SelectItem (`select-item`): data-selected, data-disabled, data-highlighted, data-has-icon
- SelectItemText (`select-item-text`): data-matched
- SelectItemIndicator (`select-item-indicator`): data-selected
- SelectSelectAll (`select-select-all`): data-disabled, data-unchecked, data-highlighted
- SelectEmpty (`select-empty`): data-loading, data-empty
- SelectStatus (`select-status`): data-loading
- SelectArrow (`select-arrow`): data-closed, data-open
- SelectItemIcon (`select-item-icon`): data-mirror

**Props**

- Select: container?, open?, defaultOpen?, onOpenChange?, onOpenChangeComplete?, items?, emptyItems?, query?, defaultQuery?, onQueryChange?, filter?, status?, onLoadMore?, announcement?, placeholder?, itemToValue?, itemToLabel?, isItemEqualToValue?, onHighlight?, loop?, modal?, presentation?, disabled?, readOnly?, required?, name?, form?, autoComplete?, controller?, dismissible?, onDismissAttempt?, debug?, multiple?, value?, defaultValue?, onValueChange?
- SelectTrigger: disabled?, controller?
- SelectValue: placeholder?, maxLabels?, getMoreLabel?
- SelectContent: side?, align?, sideOffset?, alignOffset?, collisionPadding?, arrowPadding?, anchor?, container?, alignItemWithTrigger?, keepMounted?
- SelectItem: label?, disabled?, index?, value
- SelectItemIndicator: keepMounted?
- SelectItemIcon: mirror?
- SelectClear: keepMounted?
- Items as Data: value, label, keywords?, disabled?
- State: open, disabled, readOnly, required, placeholder, value, label, labels, placeholder, open, presentation, multiple, items, status, highlighted, selected, disabled, selected, mirror, disabled, open, open, disabled, segments, matched, checked, indeterminate, highlighted, disabled, loading, empty, query, status, loading, count
- Reasons: item-press, list-navigation, clear-press, reset, restore, imperative, item-press, imperative, trigger-press, outside-press, escape-key, close-press, focus-out, window-blur, back, swipe, outside-press, escape-key, back, swipe, item-press, imperative, trigger-press, outside-press, escape-key, close-press, focus-out, window-blur, back, swipe, input-change
- Controller: isOpen(), setOpen(open, options?), open(options?), close(options?), toggle(options?), getValue(), setValue(value, options?), clear(options?), getQuery(), setQuery(query, options?), focus()

**Keyboard**



**ARIA:** The select follows the [WAI-ARIA select-only combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/). The trigger has the `combobox` role and the popup is a `listbox`. If you don't need a visible label, give `SelectTrigger` an `aria-label` instead.

**Tested behavior groups:** Trigger, Keyboard in the list, Typing on the closed trigger, Pointer, Value, Multiple, Groups, Forms, Positioning, Enhancements, Searchable select, Items shown while the search is empty. Runs in React, Vue and web components.



## Separator

Divide groups of content with a horizontal or vertical line.

Base UI equivalent: `@base-ui/react/separator`.

**Doc sections:** Installation, Usage, Build Your Own, Vertical, Stacked Content, Rows, Decorative, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Styling:** The separator is unstyled. Give it a background, a height when it's horizontal and a width when it's vertical, and use `data-orientation` to tell them apart. A vertical line takes its row's height with `align-self: stretch`.

**Data attributes**

- Separator (`separator`): data-orientation (horizontal, vertical)

**Props**

- Separator: orientation?, decorative?, debug?
- State: orientation

**ARIA:** The component follows the [WAI-ARIA separator role](https://www.w3.org/TR/wai-aria-1.2/#separator). A separator divides content a screen reader should hear as separate, and it's announced with `role="separator"` and its `aria-orientation`. A decorative separator is only visual: it gets `role="none"`, so screen readers skip it. Use `decorative` only when the surrounding content already conveys the division. Either way, a separator never takes focus, so Tab moves past it.

**Tested behavior groups:** —. Runs in React, Vue and web components.



## Slider

Adjust a number or a range with draggable thumbs and keyboard controls.

Base UI equivalent: `@base-ui/react/slider`.

**Doc sections:** Installation, Composition, Usage, Range, Multiple Thumbs, Vertical, Field, Disabled, Controlled, Step and Bounds, Large Step, Distance Between Thumbs, Format and Locale, Saving on Commit, Controller, Form, Read-Only, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Slider
├── SliderValue
└── SliderControl
    └── SliderTrack
        ├── SliderIndicator
        └── SliderThumb
```

**Styling:** Parts are unstyled, apart from the positions they need: thumbs and the indicator get `position: absolute` and their place along the track in percent, as inline styles. Give the control some height around a thin track, the track a size and a background, and each thumb a size. The thumb's range input is what takes focus, so draw the focus ring on the thumb with `:has(:focus-visible)`, and style a drag with `data-dragging`.

**CSS vars:** SliderIndicator: `--slider-indicator-start`; SliderIndicator: `--slider-indicator-size`; SliderThumb: `--slider-thumb-position`

**Data attributes**

- Slider (`slider`): data-orientation (horizontal, vertical), data-disabled, data-dragging
- SliderValue (`slider-value`): data-orientation (horizontal, vertical), data-disabled, data-dragging
- SliderControl (`slider-control`): data-orientation (horizontal, vertical), data-disabled, data-dragging
- SliderTrack (`slider-track`): data-orientation (horizontal, vertical), data-disabled, data-dragging
- SliderIndicator (`slider-indicator`): data-orientation (horizontal, vertical), data-disabled, data-dragging
- SliderThumb (`slider-thumb`): data-orientation (horizontal, vertical), data-disabled, data-index (0, 1), data-dragging

**Props**

- Slider: value?, defaultValue?, onValueChange?, onValueCommit?, min?, max?, step?, largeStep?, minStepsBetweenThumbs?, orientation?, disabled?, readOnly?, required?, name?, form?, format?, locale?, controller?, debug?
- SliderThumb: index?
- State: value, disabled, readOnly, required, dragging, orientation, disabled, readOnly, required, dragging, orientation, index, thumbValue, percent, value, disabled, readOnly, required, dragging, orientation, text
- Reasons: track-press, drag, step-key, accessibility-adjust, reset, restore, imperative
- Controller: getValue(), setValue(value, options?), focus(thumb?)

**Keyboard**

- ArrowRight or ArrowUp: One `step` up. In right to left, ArrowRight moves down.
- ArrowLeft or ArrowDown: One `step` down. In right to left, ArrowLeft moves up.
- Page Up, Page Down, or Shift with an arrow: By `largeStep`, ten steps by default.
- Home or End: To the minimum or maximum, or as far as a neighbouring thumb lets it.

**ARIA:** The slider follows the [WAI-ARIA slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/), and the [multi-thumb slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/) for ranges. Each thumb is a native range input, named by a `FieldLabel` or its own `aria-label`, and the slider is a group around them.

**Tested behavior groups:** Keyboard, Pointer, Vertical, Value and state. Runs in React, Vue and web components.



## Switch

Turn a setting on or off.

Base UI equivalent: `@base-ui/react/switch`.

**Doc sections:** Installation, Composition, Usage, Description, Choice Card, Disabled, Read-Only, Controlled, Form, Validation, Saving on Toggle, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Switch
└── SwitchThumb
```

**Styling:** Style the switch and its thumb with `data-checked` and `data-unchecked`, and use `data-disabled`, `data-readonly` and `data-required` for the rest. In an invalid field, the switch also gets `data-invalid` and `aria-invalid`; the thumb doesn't. Slide the thumb with `translate` on `data-checked`, and reverse it under `dir="rtl"`.

**Data attributes**

- Switch (`switch`): data-checked, data-disabled, data-readonly, data-required, data-unchecked, data-invalid
- SwitchThumb (`switch-thumb`): data-checked, data-disabled, data-readonly, data-required, data-unchecked

**Props**

- Switch: checked?, defaultChecked?, onCheckedChange?, disabled?, readOnly?, required?, name?, value?, form?, controller?, debug?
- State: checked, disabled, readOnly, required
- Reasons: press, reset, restore, imperative
- Controller: toggle(details?), getChecked(), setChecked(checked, details?), focus()

**Keyboard**

- Tab: Moves to the next switch
- Space: Turns it on or off
- Enter: Submits its form, and never toggles it

**ARIA:** The switch follows the [WAI-ARIA switch pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/). `Switch` renders a button with the `switch` role, and a hidden native checkbox that takes part in forms.

**Tested behavior groups:** The first input on a page, On a touch screen, Enhancements, Form-associated custom elements. Runs in React, Vue and web components.



## Tabs

Switch between related panels with one tab selected at a time.

Base UI equivalent: `@base-ui/react/tabs`.

**Doc sections:** Installation, Composition, Usage, Build Your Own, Vertical, Disabled, Icons, Manual Activation, Loop, Indicator, Keep Mounted, Find in Page, Animation, Controlled, Links, Query String, URL Hash, Route Tabs, Scroll into View, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Tabs
├── TabsList
│   ├── TabsTab
│   └── TabsTab
├── TabsPanel
└── TabsPanel
```

**Styling:** Parts are unstyled. Use `data-selected` and `data-disabled` to style a tab, and `data-selected` on a panel that shows. `data-orientation` on every part lets one stylesheet lay out horizontal and vertical tabs. Icon parts also set `data-has-icon` on the tab and `data-has-icons` on the list, which can help align mixed text and icon tabs.

**CSS vars:** TabsIndicator: `--active-tab-left`; TabsIndicator: `--active-tab-right`; TabsIndicator: `--active-tab-top`; TabsIndicator: `--active-tab-bottom`; TabsIndicator: `--active-tab-width`; TabsIndicator: `--active-tab-height`

**Data attributes**

- Tabs (`tabs`): data-orientation (horizontal, vertical), data-activation-direction (none, left, right, up, down)
- TabsList (`tabs-list`): data-orientation (horizontal, vertical), data-activation-direction (none, left, right, up, down), data-has-icons
- TabsTab (`tabs-tab`): data-selected, data-orientation (horizontal, vertical), data-activation-direction (none, left, right, up, down), data-disabled, data-has-icon
- TabsTabIcon (`tabs-tab-icon`): data-mirror
- TabsIndicator (`tabs-indicator`): data-orientation (horizontal, vertical), data-activation-direction (none, left, right, up, down)
- TabsPanel (`tabs-panel`): data-selected, data-orientation (horizontal, vertical), data-activation-direction (none, left, right, up, down), data-starting-style, data-ending-style

**Props**

- Tabs: value?, defaultValue?, onValueChange?, orientation?, activation?, loop?, hiddenUntilFound?, controller?, debug?
- TabsTab: value, disabled?
- TabsTabIcon: mirror?
- TabsPanel: value, keepMounted?, hiddenUntilFound?
- State: value, orientation, direction, orientation, selected, disabled, mirror, selected, orientation, direction
- Reasons: item-press, list-navigation, find-in-page, item-removed, imperative
- Controller: getValue(), setValue(value, options?), select(value, options?), focus()

**Keyboard**



**ARIA:** Tabs follow the [WAI-ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/). The list is a `tablist`, each tab controls its panel, and each panel is labelled by its tab.

**Tested behavior groups:** Selection, Keyboard navigation, Manual activation, Vertical, Panels, Enhancements. Runs in React, Vue and web components.



## Textarea

Enter multiple lines of text, grow the field as you type, and connect it to a form.

**Base UI gap (partial):** No dedicated part; Base UI uses Field.Control render={<textarea/>}, no auto-resize.

**Doc sections:** Installation, Usage, Field, Auto Resize, Controlled, Form, Disabled, Invalid, Submit Shortcut, Styling, Data Attributes, API Reference, Accessibility

**Styling:** Style the native textarea directly, with `data-filled`, `data-disabled`, `data-readonly` and `data-required` for its states. Inside a field it also receives the field's validation attributes, such as `data-invalid`. For `autoResize`, set `min-height` and `max-height` to bound its growth. Use logical spacing so the text follows the surrounding direction.

**Data attributes**

- Textarea (`textarea`): data-filled, data-disabled, data-readonly, data-required

**Props**

- Textarea: value?, defaultValue?, onValueChange?, controller?, debug?, autoResize?, onSubmit?, submitShortcut?, disabled?, readOnly?, required?
- State: filled, disabled, readOnly, required
- Reasons: input-change, clear-press, reset, imperative
- Controller: getValue(), setValue(value, options?), clear(options?), focus()

**ARIA:** There's no WAI-ARIA pattern for a multi-line text field. The textarea stays a native `<textarea>`, with standard text editing, selection, spell checking and form behavior. Give it a visible field label or an `aria-label`, and keep descriptions and errors in their field parts so they're associated with it.

**Tested behavior groups:** Auto resize, Submit shortcut. Runs in React, Vue and web components.



## Time Input

Type a time one part at a time, on the clock your user's language uses.

**Base UI gap: no equivalent in @base-ui/react 1.9.0.**

**Doc sections:** Installation, Composition, Usage, Clock and Seconds, Min and Max, Form, Controlled and Controller, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
TimeInput
├── TimeInputSegment
└── TimeInputSegment
```

**Styling:** Style it like [Date Input](./date-input.md#styling). The AM/PM segment sets `data-type="dayPeriod"`.

**Data attributes**

- TimeInput (`time-input`): data-disabled, data-readonly, data-required, data-invalid, data-empty
- TimeInputSegment (`time-input-segment`): data-type (hour, minute, second, dayPeriod, literal), data-disabled, data-readonly, data-required, data-invalid, data-empty

**Props**

- TimeInput: value?, defaultValue?, onValueChange?, granularity?, hourCycle?, min?, max?, locale?, disabled?, readOnly?, required?, name?, form?, controller?, debug?
- State: value, segments, disabled, readOnly, invalid
- Reasons: input-change, step-key, paste, reset, restore, imperative
- Controller: getValue(), setValue(value, options?), clear(options?), focus(segment?)

**ARIA:** The root is a group, named by its Field's label or by your `aria-label`. Each segment is a spinbutton named by its unit, like "hour" or "AM/PM", with its value, range and text. The keys are the same as in [Date Input](./date-input.md#keyboard).

**Tested behavior groups:** —. Runs in React, Vue and web components.



## Timeline

Show dated events in order, like an activity feed, a changelog or an order's progress, with arrow keys between them.

**Base UI gap: no equivalent in @base-ui/react 1.9.0.**

**Notes:** Feed mode gives `aria-busy` and PageUp/PageDown.

**Doc sections:** Installation, Composition, Usage, Horizontal, Status, Details, Feed, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Timeline
├── TimelineItem
│   ├── TimelineMarker
│   ├── TimelineConnector
│   ├── TimelineTitle
│   ├── TimelineTime
│   └── TimelineDescription
└── TimelineItem
```

**Styling:** The parts have no styles. Lay an item out as a grid, with the marker in its own column and the connector positioned along it. `data-orientation` on every part says which way the events run.

**CSS vars:** Timeline: `--timeline-count`; TimelineItem: `--timeline-index`

**Data attributes**

- Timeline (`timeline`): data-orientation (horizontal, vertical), data-busy
- TimelineItem (`timeline-item`): data-complete, data-orientation (horizontal, vertical), data-current, data-upcoming, data-first, data-last
- TimelineMarker (`timeline-marker`): data-complete, data-orientation (horizontal, vertical), data-current, data-upcoming
- TimelineConnector (`timeline-connector`): data-complete, data-orientation (horizontal, vertical), data-current, data-upcoming
- TimelineTime (`timeline-time`): data-complete, data-orientation (horizontal, vertical), data-current, data-upcoming
- TimelineTitle (`timeline-title`): data-complete, data-orientation (horizontal, vertical), data-current, data-upcoming
- TimelineDescription (`timeline-description`): data-complete, data-orientation (horizontal, vertical), data-current, data-upcoming

**Props**

- Timeline: orientation?, loop?, feed?, busy?, controller?, debug?
- TimelineItem: value?, status?
- State: orientation, feed, busy, status, orientation
- Controller: focus(value?)

**Keyboard**

- `ArrowDown` / `ArrowUp`: Move focus between events in a vertical timeline
- `ArrowRight` / `ArrowLeft`: Move focus between events in a horizontal timeline
- `Home` / `End`: Focus the first or last event
- `PageDown` / `PageUp`: In a feed, focus the next or previous article, from inside
- `Tab`: Move from an event to the links and buttons inside it

**ARIA:** A timeline is a `list` of `listitem`s, named with `aria-label`. With `feed`, it follows the [WAI-ARIA feed pattern](https://www.w3.org/WAI/ARIA/apg/patterns/feed/): a `feed` of `article`s, each with `aria-posinset` and `aria-setsize`, and `aria-busy` while it loads. Each event is named by its title through `aria-labelledby` and described by its time and description through `aria-describedby`. The current event has `aria-current="step"`.

**Tested behavior groups:** A list of events, A list that doesn't loop, A horizontal list, A feed. Runs in React, Vue and web components.



## Toast

Show notifications with actions, timed dismissal, and screen reader announcements.

Base UI equivalent: `@base-ui/react/toast`.

**Doc sections:** Installation, Composition, Usage, Types, Position, Action and Cancel, Link, Promise, Stacking, Duration, Update and Dismiss, Async Action, Keyboard Shortcut, Overlay Host and Confirm, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
ToastRegion
├── Toast
│   ├── ToastTitle
│   ├── ToastDescription
│   ├── ToastAction
│   └── ToastClose
└── Toast
    ├── ToastTitle
    └── ToastDescription
```

**Styling:** Toasts are unstyled, and the region and its toasts carry what you need to animate a stack:

**CSS vars:** ToastRegion: `--toast-front-height`; ToastRegion: `--toast-stack-height`; ToastRegion: `--toast-count`; ToastRegion: `--keyboard-inset`; ToastRegion: `--visual-viewport-width`; ToastRegion: `--visual-viewport-height`; ToastRegion: `--visual-viewport-top`; Toast: `--toast-index`; Toast: `--toast-offset`; Toast: `--toast-height`; Toast: `--toast-swipe-x`; Toast: `--toast-swipe-y`

**Data attributes**

- ToastRegion (`toast-region`): data-side (top, bottom), data-align (start, center, end), data-expanded, data-keyboard
- Toast (`toast`): data-type (default, success, error, info, warning, loading), data-front, data-expanded, data-starting-style, data-ending-style
- ToastAction (`toast-action`): data-pending

**Props**

- Toast: id?, title?, description?, type?, duration?, priority?, action?, cancel?, dismissible?, data?, onDismiss?
- Actions: label, onAction?, href?, dismiss?, label, onCancel?
- ToastRegion: toaster?, side?, align?, maxVisible?, expanded?, shortcut?, pendingAnnouncement?, debug?
- ToastAction: onAction?, dismiss?
- ToastClose: action?
- Confirm: title, description?, confirmLabel?, cancelLabel?
- State: side, align, expanded, toasts, type, index, front, expanded, leaving, pending, error
- Reasons: timeout, close-press, swipe, escape-key, action, imperative

**Keyboard**



**ARIA:** Toasts are announced through shared [live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions), once each, without making the visible region live: politely by default and assertively for errors. While it has toasts, the region is a landmark named Notifications; set `aria-label` to name it in the page's language. Keep messages short, and use `duration: Infinity` for one that has to stay available.

**Tested behavior groups:** Showing, Closing, Timers, Keyboard, Stacking, Swiping, Over a modal dialog, Updates after closing, More pausing and keys, Enhancements, Pausing, Announcements, The shortcut, Over modal dialogs, Swiping. Runs in React, Vue and web components.



## Toggle

Keep a button pressed, or group toggles with a shared value and arrow-key navigation.

Base UI equivalent: `@base-ui/react/toggle + toggle-group`.

**Doc sections:** Installation, Composition, Usage, Group, Single Selection, Icon and Label, Disabled, Focusable When Disabled, Controlled, Controlled Group, Vertical, Loop, Forms, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Toggle
└── ToggleIcon
```

**Styling:** Style the pressed state with `data-pressed`, and use `data-disabled` for unavailable toggles. A toggle with a `ToggleIcon` gets `data-has-icon`, and its group gets `data-has-icons` while any toggle has one, which helps align icon and text content. `data-orientation` tells a group's toggles which way it runs.

**Data attributes**

- Toggle (`toggle`): data-pressed, data-disabled, data-orientation (horizontal, vertical), data-has-icon
- ToggleIcon (`toggle-icon`): data-mirror
- ToggleGroup (`toggle-group`): data-orientation (horizontal, vertical), data-disabled, data-has-icons

**Props**

- Toggle: pressed?, defaultPressed?, onPressedChange?, value?, disabled?, focusableWhenDisabled?, controller?, debug?
- ToggleIcon: mirror?
- ToggleGroup: value?, defaultValue?, onValueChange?, multiple?, deselectable?, disabled?, orientation?, loop?, controller?, debug?
- State: pressed, disabled, value, multiple, disabled, orientation, mirror
- Reasons: press, imperative, item-press, imperative
- Toggle Controller: isPressed(), setPressed(pressed, options?), toggle(options?), focus()
- ToggleGroup Controller: getValue(), setValue(value, options?), isPressed(value), toggle(value, options?), focus(value?)

**Keyboard**

- Enter, Space: Presses or unpresses the focused toggle
- Tab: Moves into or out of a group
- Left, Right: Move focus in a horizontal group, swapped right to left
- Up, Down: Move focus in a vertical group
- Home, End: Move focus to the first or last toggle

**ARIA:** A toggle follows the toggle button in the [WAI-ARIA button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/): a native button with `aria-pressed`. A group follows the keyboard of the [WAI-ARIA toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/), with one tab stop and arrow keys between toggles. It has the `group` role, not `toolbar`, so it can sit inside a [Toolbar](./toolbar.md), and not `radiogroup`, since its toggles are buttons.

**Tested behavior groups:** One pressed at a time, Several pressed at once, Keyboard, Options. Runs in React, Vue and web components.



## Token Input

Mix editable text with tokens for files, people, tags, and other references.

**Base UI gap: no equivalent in @base-ui/react 1.9.0.**

**Notes:** Build target 2. contenteditable editor (`textbox` + `aria-multiline`); placeholder via `aria-placeholder` + `::before`. Tokens render inside a `token-input-host` element when no custom renderer. Composes with Trigger Menu for @ / # suggestions. IME-safe; undo grouped. Edge: paste of codec text, drag-drop, controlled value echo, Backspace across token.

**Doc sections:** Installation, Composition, Usage, Token Input or Trigger Menu, Prompt Input, Deleting Tokens, Codec, Form, Controlled, Controller, Submit Shortcut, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
TokenInput
├── TokenInputEditor
└── TriggerMenu
```

**Styling:** Style the editor, the tokens and their remove buttons. The editor shows `data-empty` while it holds nothing; show the placeholder with `content: attr(aria-placeholder)` on its `::before`. Tokens show `data-token-type`, `data-pending`, `data-unresolved` and `data-selected`. Without a custom token renderer, the element that holds each token, `token-input-host`, carries the same attributes, so you can style tokens without `renderToken`.

**Data attributes**

- TokenInputEditor (`token-input-editor`): data-empty, data-disabled, data-readonly
- TokenInputToken (`token-input-token`): data-token-type (file), data-pending, data-disabled, data-readonly, data-slot, data-selected, data-unresolved
- TokenInputTokenRemove (`token-input-token-remove`): data-disabled, data-readonly

**Props**

- TokenInput: value?, defaultValue?, onValueChange?, onSubmit?, submitShortcut?, tokenDeletion?, copy?, codec?, getTokenDescription?, history?, disabled?, readOnly?, required?, name?, form?, controller?, debug?
- TokenInputEditor: placeholder?
- Token: type, value, label, id?, status?, data?
- Codec: format, parse, escape?
- State: empty, disabled, readOnly, token, selected, pending, unresolved, disabled, readOnly
- Reasons: input-change, paste, drop, cut, undo, redo, remove-press, item-press, reset, restore, imperative
- Controller: getValue(), setValue(value, options?), getText(codec?), getLabel(), insert(content, options?), updateToken(id, patch), removeToken(id, options?), undo(), redo(), canUndo(), canRedo(), clear(options?), focus(options?), editor

**Keyboard**

- Backspace, Delete: Removes the token before or after the caret, as `tokenDeletion` says
- ArrowLeft, ArrowRight: Moves the caret past a token in one press; the caret never stops inside one
- Enter: Submits. While a trigger menu is open, chooses the highlighted suggestion
- Shift+Enter: Starts a new line
- Command+Enter, Control+Enter: Submits when `submitShortcut` is `"mod+enter"`; Enter then starts a new line
- Command+Z, Control+Z: Undoes the last step. Typing is grouped; pastes and token changes are steps
- Shift+Command+Z, Control+Y: Redoes the last undone step

**ARIA:** The editor is a multiline text box: it has the `textbox` role with `aria-multiline`, and a Trigger Menu inside it adds `aria-autocomplete` and `aria-haspopup` for its suggestions. Give it a visible label through a [Field](./field.md), or an `aria-label`. Each token reads as its label and its kind, like "routes.ts file", and inserting or removing one is announced. Typing keeps the browser's spelling, autocorrect, and input method support.

**Tested behavior groups:** Value, Tokens, History, Clipboard, Submit. Runs in React, Vue and web components.



## Toolbar

Give buttons, toggles, menus and fields one tab stop with arrow-key navigation.

Base UI equivalent: `@base-ui/react/toolbar`.

**Doc sections:** Installation, Composition, Usage, Toggle Groups, Groups, Menus, Selects, Fields, Links, Vertical, Disabled, Loop, Controller, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Toolbar
├── ToolbarButton
├── ToolbarSeparator
├── ToolbarGroup
│   ├── ToolbarButton
│   └── ToolbarButton
├── ToolbarLink
└── ToolbarInput
```

**Styling:** Use `data-orientation` on the root for a row or a column, and on a separator for the way its line runs, across the toolbar. Use `data-disabled` to style unavailable items and groups. Toggles inside keep their own `data-pressed`.

**Data attributes**

- Toolbar (`toolbar`): data-orientation (horizontal, vertical), data-disabled
- ToolbarButton (`toolbar-button`): data-disabled, data-orientation (horizontal, vertical)
- ToolbarLink (`toolbar-link`): data-disabled, data-orientation (horizontal, vertical)
- ToolbarInput (`toolbar-input`): data-disabled, data-orientation (horizontal, vertical)
- ToolbarGroup (`toolbar-group`): data-disabled, data-orientation (horizontal, vertical)
- ToolbarSeparator (`toolbar-separator`): data-orientation (horizontal, vertical)

**Props**

- Toolbar: orientation?, loop?, disabled?, controller?, debug?
- ToolbarButton: disabled?, focusableWhenDisabled?
- ToolbarInput: disabled?, focusableWhenDisabled?
- ToolbarGroup: disabled?
- State: disabled, orientation, disabled, orientation, orientation
- Controller: focus()

**Keyboard**

- `ArrowRight` / `ArrowLeft`: Move focus in a horizontal toolbar
- `ArrowDown` / `ArrowUp`: Move focus in a vertical toolbar
- `Home` / `End`: Focus the first or last item, except in a field
- `Enter` / `Space`: Activate a button or toggle, or open its popup

**ARIA:** The toolbar follows the [WAI-ARIA toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/). The root has the `toolbar` role and `aria-orientation`, and separators have the `separator` role.

**Tested behavior groups:** Vertical, Disabled groups. Runs in React, Vue and web components.



## Tooltip

Name a control or add a short hint on hover and keyboard focus.

Base UI equivalent: `@base-ui/react/tooltip`.

**Doc sections:** Installation, Composition, Usage, Side, Anchor, Keyboard Shortcut, Disabled Buttons, Touch, Keep Open on Press, Truncated Text, Controlled, Shared, Animation, Delay and Grouping, Offset, Container, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Tooltip
├── TooltipTrigger
└── TooltipContent
    ├── TooltipArrow
    └── TooltipShortcut
```

**Styling:** Use `data-side` and `data-align` to style the content and arrow for where they landed, and `data-instant` to skip the animation of a tooltip that opened at once. The trigger gets no state attributes of its own, since it's often another component's trigger too, like a menu's. Put `transform-origin: var(--transform-origin)` on the content so it scales from the trigger.

**CSS vars:** TooltipContent: `--anchor-width`; TooltipContent: `--anchor-height`; TooltipContent: `--available-width`; TooltipContent: `--available-height`; TooltipContent: `--transform-origin`; TooltipContent: `--arrow-offset`

**Data attributes**

- TooltipContent (`tooltip-content`): data-closed, data-open, data-starting-style, data-ending-style
- TooltipArrow (`tooltip-arrow`): data-closed, data-open

**Props**

- Tooltip: container?, open?, defaultOpen?, onOpenChange?, onOpenChangeComplete?, onPayloadChange?, delay?, closeDelay?, disabled?, toggleable?, closeOnPress?, type?, shortcut?, controller?, debug?
- TooltipTrigger: payload?, controller?
- TooltipContent: side?, align?, sideOffset?, alignOffset?, collisionPadding?, arrowPadding?, anchor?, container?
- TooltipShortcut: shortcut?
- State: open, open, instant, payload, open, text
- Reasons: trigger-hover, trigger-focus, trigger-press, focus-out, escape-key, close-press, outside-press, window-blur, back, imperative, trigger-hover, trigger-focus, trigger-press, imperative
- Controller: isOpen(), setOpen(open, options?), open(options?), close(options?), toggle(options?), getPayload(), focus()

**Keyboard**

- Tab: Focus on the trigger opens the tooltip at once; focus leaving it closes the tooltip
- Escape: Closes the tooltip and leaves focus on the trigger, without closing a dialog or menu around it
- Enter, Space: Presses the trigger and closes the tooltip; on a `toggleable` trigger, opens and closes it

**ARIA:** The trigger is named or described by the tooltip, following the [WAI-ARIA tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/). It opens on hover and on keyboard focus, and stays open while the pointer moves onto it.

**Tested behavior groups:** Pointer, Keyboard, Several tooltips, Positioning, A tooltip on a popover trigger, Disabled buttons, Animation, Hidden while closed, Options and dismissal, Enhancements, Shortcuts, Toggleable. Runs in React, Vue and web components.



## Tree

Browse a hierarchy of files, pages, or choices with expandable branches.

**Base UI gap: no equivalent in @base-ui/react 1.9.0.**

**Notes:** Build target 4. Style rows through `tree-label`; `--tree-level` for indent; `--tree-group-height` for open/close animation. Modes: selection single/multiple, checkable (tri-state), `loadChildren` async with `data-loading`/`data-failed`. HextaUI already has a Base-UI-less custom `tree.tsx`; the UI SDK version must be a separate flavor.

**Doc sections:** Installation, Composition, Usage, Items as Data, File Paths, Selection, Multiple Selection, Checkboxes, Links, Disabled, Loading Children, Virtualized, Find in Page, Animation, Controlled, Controller, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Tree
├── TreeItem
│   ├── TreeItemLabel
│   │   └── TreeItemIndicator
│   └── TreeGroup
│       └── TreeItem
│           └── TreeItemLabel
└── TreeItem
    └── TreeItemLabel
```

**Styling:** Style each row through `TreeItemLabel`, which carries its item's `data-selected`, `data-expanded`, `data-branch`, `data-current`, `data-disabled`, `data-loading`, `data-failed` and `data-pending`. An item's own background would also cover its children. Focus stays on the item, so style a focused row as a label inside an item with `:focus-visible`. Turn the indicator with its `data-expanded`, and indent rows with `--tree-level` or padding on each group.

**CSS vars:** TreeItem: `--tree-level`; TreeGroup: `--tree-group-height`

**Data attributes**

- TreeItem (`tree-item`): data-level (1, 2), data-branch, data-expanded, data-indeterminate, data-selected, data-current, data-checked, data-disabled, data-unchecked, data-loading, data-failed, data-pending
- TreeItemLabel (`tree-label`): data-level (1, 2), data-branch, data-expanded, data-selected, data-current, data-disabled, data-loading, data-failed, data-pending
- TreeItemIndicator (`tree-indicator`): data-level (1), data-branch, data-expanded, data-loading, data-failed, data-pending
- TreeItemCheckbox (`tree-checkbox`): data-indeterminate, data-checked, data-unchecked
- TreeGroup (`tree-group`): data-open, data-closed

**Props**

- Tree: items?, paths?, mode?, value?, defaultValue?, onValueChange?, activation?, expanded?, defaultExpanded?, onExpandedChange?, expandOnPress?, checkable?, checked?, defaultChecked?, onCheckedChange?, checkStrategy?, onAction?, pendingAnnouncement?, loadChildren?, current?, onHighlight?, disabled?, focusableWhenDisabled?, keepMounted?, hiddenUntilFound?, announcement?, controller?, debug?
- TreeItem: value, branch?, disabled?, label?
- TreeGroup: keepMounted?, hiddenUntilFound?
- Items as Data: value, label, children?, disabled?, href?, item, parent, level, index
- State: mode, checkable, disabled, expanded, selected, checked, disabled, branch, level, current, loading, failed, pending, expanded, level
- Reasons: item-press, trigger-press, list-navigation, find-in-page, imperative, item-press, list-navigation, imperative, item-press, imperative
- Controller: getExpanded(), setExpanded(expanded, options?), isExpanded(value), expand(value, options?), collapse(value, options?), toggle(value, options?), expandAll(options?), collapseAll(options?), getValue(), setValue(value, options?), getChecked(), setChecked(checked, options?), checkedState(value), reveal(value), focus(value?)

**Keyboard**

- Down / Up Arrow: Focus the next or previous visible item.
- Right Arrow: Expand a branch, or enter its first child.
- Left Arrow: Collapse a branch, or focus its parent.
- Home / End: Focus the first or last visible item.
- Alt+Right / Alt+Left Arrow: Expand or collapse a branch and its descendants.
- `*`: Expand sibling branches.
- Enter: Select and run the item's action, or follow its link.
- Space: Check the item when checkable, otherwise select it.
- Shift+Down / Shift+Up Arrow: Extend a multiple selection.
- Cmd+A / Ctrl+A: Select visible items in multiple selection mode.
- Typing: Focus the next item whose label starts with that text.

**ARIA:** The tree follows the [WAI-ARIA tree view pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/). Items have the `treeitem` role with `aria-level`, `aria-expanded` on branches, and `aria-checked` when the tree is checkable.

**Tested behavior groups:** Expanding and collapsing, Keyboard, Selection, Checkboxes, Positions. Runs in React, Vue and web components.



## Trigger Menu

"Opens suggestions at the caret when you type a trigger such as @, /, or #."

**Base UI gap: no equivalent in @base-ui/react 1.9.0.**

**Notes:** Pairs with Token Input. Works with `<textarea>`/`<input>` or a Token Input editor via `editor`.

**Doc sections:** Installation, Composition, Usage, Trigger Menu or Token Input, Triggers as Data, Commands with Arguments, Icons, Loading Items, Custom Items, Input, Positioning, Controlled, Controller, Any Editor, Undo, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
TriggerMenu
├── TriggerMenuInput
├── TriggerMenuStatus
└── TriggerMenuContent
    ├── TriggerMenuEmpty
    └── TriggerMenuList
        ├── TriggerMenuItem
        └── TriggerMenuItem
```

**Styling:** Style the field, the popup and its items. The content shows `data-trigger`, so each trigger's list can look different, like commands in a monospace font. Items show `data-highlighted` and `data-disabled`, and `data-has-icon` when they hold a `TriggerMenuItemIcon`; the list shows `data-has-icons` while any item has one. Fade a loading list with `aria-busy`, and style the hint as ghost text: it's positioned at the caret for you.

**CSS vars:** TriggerMenuContent: `--anchor-width`; TriggerMenuContent: `--anchor-height`; TriggerMenuContent: `--available-width`; TriggerMenuContent: `--available-height`; TriggerMenuContent: `--transform-origin`; TriggerMenuContent: `--arrow-offset`

**Data attributes**

- TriggerMenuInput (`trigger-menu-input`): data-closed, data-open, data-trigger
- TriggerMenuContent (`trigger-menu-content`): data-closed, data-starting-style, data-ending-style, data-open, data-trigger, data-has-icons
- TriggerMenuItem (`trigger-menu-item`): data-disabled, data-highlighted, data-has-icon
- TriggerMenuEmpty (`trigger-menu-empty`): data-empty, data-loading
- TriggerMenuItemIcon (`trigger-menu-item-icon`): data-mirror

**Props**

- TriggerMenu: container?, triggers, editor?, open?, onOpenChange?, onOpenChangeComplete?, onQueryChange?, onSelect?, pendingAnnouncement?, status?, autoHighlight?, loop?, shortcut?, controller?, dismissible?, onDismissAttempt?, debug?
- Triggers: char, boundary?, spaces?, pattern?, maxLength?, type?, items?, filter?, insert?
- Items as Data: value, label, keywords?, disabled?, after?, arguments?
- Arguments: name, hint?, required?, items?, allowCustomValue?
- TriggerMenuContent: side?, align?, sideOffset?, alignOffset?, collisionPadding?, arrowPadding?, anchor?, container?, keepMounted?
- TriggerMenuItem: value, label?, keywords?, disabled?, onSelect?
- TriggerMenuItemIcon: mirror?
- State: open, trigger, open, trigger, query, argument, status, items, highlighted, disabled, mirror, loading, empty, query, open, status, loading, count, argument, argument, hint
- Reasons: input-change, caret-move, item-press, escape-key, close-press, outside-press, focus-out, window-blur, imperative, shortcut, escape-key, outside-press, input-change, item-press, imperative
- Controller: isOpen(), setOpen(open, options?), open(options?), close(options?), getQuery(), getMatch(), insert(content), focus()

**Keyboard**

- ArrowDown, ArrowUp: Moves the highlight while the list is open; the caret stays in the field
- Enter: Chooses the highlighted item. In a command's arguments, finishes once only optional ones are left
- Tab: Chooses the highlighted item, or accepts an argument and moves to the next
- Escape: Closes the list and dismisses the match, so typing on doesn't reopen it
- Control+Space: Reopens a dismissed match with the caret in it; `shortcut` changes the key
- Backspace: Past an argument's start, goes back to the previous argument
- Command+Z, Control+Z: Undoes the insertion and brings back the query

**ARIA:** Focus stays in the field while the arrow keys move the highlight. A `<textarea>` stays a textbox, the only role ARIA allows it, and points at the list with `aria-controls` and, after an arrow key, `aria-activedescendant`. An `<input>` is a combobox with `aria-expanded`. Counts and loading are said through `TriggerMenuStatus`, a polite status, never through the field, so render one: visually hidden, as in the demo, or at the top of the list, as in [Loading Items](#loading-items). Give the field a visible label through a [Field](./field.md), or an `aria-label`.

**Tested behavior groups:** Opening, Choosing, Dismissing, Arguments, Loading, Undo, Input. Runs in React, Vue and web components.



## Waterfall

Show a trace or a page's requests as bars on a shared time axis, with spans that expand to show what they started.

**Base UI gap: no equivalent in @base-ui/react 1.9.0.**

**Notes:** Treegrid; virtualizes large traces. Niche — devtools style.

**Doc sections:** Installation, Composition, Usage, Network Requests, Nested Spans, Zoom, Large Traces, Controlled, Controller, Custom Rendering, Styling, Data Attributes, API Reference, Accessibility

**Composition**

```text
Waterfall
├── WaterfallHeaderRow
│   ├── WaterfallColumnHeader
│   └── WaterfallColumnHeader
│       ├── WaterfallAxis
│       │   └── WaterfallTick
│       └── WaterfallMark
├── WaterfallRow
│   ├── WaterfallRowHeader
│   │   └── WaterfallIndicator
│   ├── WaterfallCell
│   └── WaterfallBar
└── WaterfallRow
    ├── WaterfallRowHeader
    └── WaterfallBar
```

**Styling:** Style a row's state from its `data-selected`, `data-expanded`, `data-branch` and `data-level`, which its header, indicator, cells and bar carry too. Focus moves between rows and cells, so style a focused one with `:focus-visible`. Indent a row's header with `--waterfall-level`, and place its bar with `--waterfall-start` and `--waterfall-size`.

**CSS vars:** WaterfallTick: `--waterfall-tick`; WaterfallMark: `--waterfall-mark`; WaterfallRow: `--waterfall-level`; WaterfallRow: `--waterfall-start`; WaterfallRow: `--waterfall-size`

**Data attributes**

- WaterfallMark (`waterfall-mark`): data-outside
- WaterfallRow (`waterfall-row`): data-level (1, 2), data-branch, data-expanded, data-selected
- WaterfallRowHeader (`waterfall-row-header`): data-level (1, 2), data-branch, data-expanded, data-selected
- WaterfallIndicator (`waterfall-indicator`): data-level (1), data-branch, data-expanded
- WaterfallCell (`waterfall-cell`): data-level (1, 2), data-branch, data-expanded, data-selected
- WaterfallBar (`waterfall-bar`): data-level (1, 2), data-branch, data-expanded, data-selected

**Props**

- Waterfall: items, range?, value?, defaultValue?, onValueChange?, expanded?, defaultExpanded?, onExpandedChange?, onHighlight?, format?, locale?, getBarLabel?, controller?, debug?
- WaterfallAxis: maxTicks?
- WaterfallTick and WaterfallMark: time
- WaterfallRow: value
- Items as Data: value, label, start, duration, children?, item, parent, level, index
- State: range, ticks, time, label, position, outside, expanded, selected, branch, level
- Reasons: trigger-press, list-navigation, imperative, imperative, item-press
- Controller: getValue(), setValue(value, options?), getExpanded(), setExpanded(expanded, options?), isExpanded(value), expand(value, options?), collapse(value, options?), toggle(value, options?), expandAll(options?), collapseAll(options?), reveal(value), focus(value?)

**Keyboard**

- Down / Up Arrow: Focus the next or previous row. In a cell, keep the column.
- Right Arrow: On a row, expand it, or move into its first cell. In a cell, move right.
- Left Arrow: In a cell, move left, then back to the row. On a row, collapse it, or focus its parent.
- Home / End: Focus the first or last row. In a cell, the row's first or last cell.
- Ctrl+Home / Ctrl+End: Focus the first or last row, keeping the column.
- Page Up / Page Down: Move a page of rows.
- Enter / Space: Select the row.
- Typing: Focus the next row whose label starts with that text.

**ARIA:** The waterfall follows the [WAI-ARIA treegrid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/). Rows have the `row` role with `aria-level`, `aria-posinset`, `aria-setsize`, `aria-selected="true"` on the selected row, and `aria-expanded` on spans with children. `WaterfallRowHeader` is a `rowheader`, so screen readers repeat the span's name as focus moves down a column, and each `WaterfallBar` is a `gridcell` labeled with when its span starts and how long it lasts, like "Starts at 120 ms, lasts 340 ms". Times are formatted with `Intl` in the page's language.

**Tested behavior groups:** Rows, Keyboard, Time axis. Runs in React, Vue and web components.

