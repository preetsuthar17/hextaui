Most AI agents use a web app the way a person with a slow screen reader would. They take a screenshot or read the DOM, guess which element is the "Region" dropdown, click it, read the page again, and click an option. Each round trip costs tokens and time, and each guess can be wrong.

UI SDK, which Vercel Labs published on 12 November 2026, takes another route. Its components register with a bridge that tells an agent what is on the page, what state each component is in and what it can do, then runs those actions through the component's own API. The same bridge can publish its tools to an agent built into the browser through WebMCP.

This post builds a small settings page in React, connects an agent to it, and goes through the parts of the API that matter: `createAgent`, `snapshot()`, `act()`, the `allow` callback, `source: "agent"` in change callbacks, a custom component built with `definePrimitive`, and `registerTools`. Every output below is copied from a run in a scratch app with React 19.3, Vite 8 and `@ui-sdk/react` and `@ui-sdk/core` at **0.1.0-beta.1**. UI SDK is in beta, so names and behavior may change.

## How the bridge works

!diagram[agent-bridge-flow]

The bridge is an object that `createAgent()` returns. UI SDK components on the page register with it as they mount. It has three methods an agent uses:

- `snapshot()` returns every registered component with a short `ref` like `c3`, its kind, its accessible label, its state and the actions it accepts right now.
- `query()` finds components by text or lists the choices inside one, such as the options of a Select.
- `act()` runs a list of steps in order. Each step names a component and an action, like `setValue`, and the bridge calls that action on the component.

`agentTools` describes these three methods as tool definitions with JSON Schemas, for your own model loop. `registerTools()` registers them with the browser instead.

The important design choice is that `act()` doesn't simulate clicks. It calls the same API a controller would, so the change goes through the component's change callback with a `source` of `"agent"`. Your app sees agent changes in the same place it sees a person's, and can refuse them there.

## Vercel's benchmark

Vercel's docs include one benchmark. Agents renamed a project, updated members and notification settings, then saved. One agent used browser tools on a page built with another component library. The other used the agent bridge on the same screen built with UI SDK.

!diagram[agent-benchmark]

These are Vercel's numbers, not mine. They are medians of three runs per approach, both agents used Sonnet through Claude Code with the same task and system prompt, and every run completed the task. "Text read" counts characters returned by the tools. I didn't reproduce the benchmark. For scale, a full snapshot of the demo below is 729 characters of JSON. The page's HTML in Vite's dev server is about 28,000 characters. Playwright's ARIA snapshot of the same page was shorter still, about 370 characters, but it lists roles and names only. It doesn't say which actions each control accepts, which choices a closed Select holds, or which button needs a person. That extra structure is what saves an agent its follow-up calls, not raw size.

## Set up the demo

Start from Vite's React and TypeScript template and add the two packages:

```bash
npm create vite@latest agent-demo -- --template react-ts
cd agent-demo
npm install
npm install @ui-sdk/react@0.1.0-beta.1 @ui-sdk/core@0.1.0-beta.1
```

Create the bridge in its own module. Import it in `main.tsx` before the app renders, so it sees components as they are created. The docs say it also finds components that are already on the page, so you can create it later, when an assistant opens.

```ts
import { createAgent, registerTools } from "@ui-sdk/react/agent"

const agent = createAgent({
  allow: (step) => {
    if (step.confirm) return window.confirm(step.confirm)
    return step.action !== "clear"
  },
})

const unregister = registerTools(agent, {
  allow: (step) => step.action !== "press",
})

Object.assign(window, { agent })

if (import.meta.hot) import.meta.hot.dispose(unregister)

export { agent }
```

The two `allow` callbacks come up again below. `Object.assign(window, { agent })` puts the bridge on `window` so you can try it from the console.

The page is a settings form with a text field, a Select, a Switch, a custom seat counter and a Save button. This excerpt drops the classes, the layout and the log component, and keeps the parts the agent cares about:

```tsx
<Field>
  <FieldLabel>Project name</FieldLabel>
  <Input
    defaultValue="Apollo"
    onValueChange={(value, details) =>
      record(`Project name → ${value}`, details.source)
    }
  />
</Field>

<Select
  defaultValue="europe"
  items={regions}
  onValueChange={(value, details) => {
    if (details.source === "agent" && value === "asia-pacific") {
      details.cancel()
      return
    }
    record(`Region → ${value}`, details.source)
  }}
>
  <SelectLabel>Region</SelectLabel>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {regions.map((region) => (
      <SelectItem key={region.value} value={region.value}>
        {region.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

<label>
  Email notifications
  <Switch
    defaultChecked
    onCheckedChange={(checked, details) =>
      record(`Email notifications → ${checked}`, details.source)
    }
  >
    <SwitchThumb />
  </Switch>
</label>

<Button
  data-agent-confirm="Saves the settings for every member of Atlas"
  onClick={(_event, { source }) => record("Save pressed", source)}
>
  Save
</Button>
```

`record` appends a line to a log on the page, so you can see who changed what. Labels matter here more than usual. The bridge names components by their accessible name, so `FieldLabel`, `SelectLabel` and the wrapping `<label>` are what let an agent say "Region" instead of guessing.

## Read the page with snapshot()

With the page rendered, `agent.snapshot()` returned this:

```json
[
  { "ref": "c1", "component": "input", "actions": ["setValue", "clear"], "label": "Project name", "value": "Apollo" },
  {
    "ref": "c3",
    "component": "select",
    "actions": ["setOpen", "setValue", "clear", "setQuery"],
    "label": "Region",
    "open": false,
    "value": "europe",
    "query": "",
    "items": [
      { "value": "europe", "label": "Europe" },
      { "value": "north-america", "label": "North America" },
      { "value": "asia-pacific", "label": "Asia Pacific" }
    ]
  },
  { "ref": "c4", "component": "switch", "actions": ["setChecked"], "label": "Email notifications", "checked": true, "value": "on" },
  { "ref": "c5", "component": "seat-stepper", "actions": ["add", "remove"], "label": "Seats", "value": 3 },
  { "ref": "c6", "component": "button", "actions": ["press"], "label": "Save", "confirm": "Saves the settings for every member of Atlas" }
]
```

A few things to notice:

- There is no `c2`. The Field registered too, but a Field only shows in the snapshot while it has errors, since its input already carries the label. The gap in refs is harmless.
- The Select lists its items while closed, because the demo passes `items`. Without them, `query({ within: "Region" })` reads the choices, and the bridge may briefly open the list to do it.
- The Save button carries the `confirm` text from `data-agent-confirm`, so the agent knows before it tries that a person has to approve it.
- `seat-stepper` is my own component. It lists `add` and `remove` because I said so in its definition, which is covered further down.

## Change things with act()

One `act()` call can carry every step the agent already knows. Steps name components by `ref` or by label, and the bridge matches whole words regardless of case and accents. An item can be named by its label too:

```ts
const result = await agent.act({
  steps: [
    { ref: "Project name", action: "setValue", args: ["Atlas"] },
    { ref: "Region", action: "setValue", args: ["North America"] },
    { ref: "Email notifications", action: "setChecked", args: [false] },
    { ref: "Seats", action: "add", args: [2] },
  ],
})
```

The result reports each step's changes and the current value of every field:

```json
{
  "ok": true,
  "steps": [
    { "step": 0, "ref": "c1", "changes": [{ "component": "input", "label": "Project name", "key": "value", "value": "Atlas" }] },
    { "step": 1, "ref": "c3", "changes": [{ "component": "select", "label": "Region", "key": "value", "value": "north-america" }] },
    { "step": 2, "ref": "c4", "changes": [{ "component": "switch", "label": "Email notifications", "key": "checked", "value": false }] },
    { "step": 3, "ref": "c5", "changes": [{ "component": "seat-stepper", "label": "Seats", "key": "value", "value": 5 }] }
  ],
  "appeared": [],
  "values": {
    "c1 Project name": "Atlas",
    "c3 Region": "north-america",
    "c4 Email notifications": false,
    "c5 Seats": 5
  }
}
```

"North America" was resolved to the item's value, `north-america`. Because `values` comes back with every call, an agent doesn't need another snapshot to check its work.

Errors are written for a model to read. Two I hit on purpose:

```text
setChecked on Email notifications (c4) takes true or false, not "yes".
seat-stepper c5 takes no keydown now. It takes: add, remove.
```

A failed step stops the call, and earlier steps stay applied. There is no rollback.

One matching rule surprised me. A step with `ref: "Name"` changed "Project name", because labels match by whole words. That is documented, and the bridge refuses a name that matches more than one component, but give components distinct labels if an agent will be guessing at them.

## Permissions: allow, confirm marks and cancel

There are three places to say no, and they do different jobs.

**`allow` on `createAgent`** sees every step before it runs, with its `ref`, `component`, `label`, `action`, `args` and `confirm`. Return `false` to refuse, or a promise for your own confirmation UI. My policy refuses every `clear`, and the result (with `values` left out here) is:

```json
{ "ok": false, "error": { "step": 0, "message": "The app refused clear on c1." }, "steps": [] }
```

**`data-agent-confirm`** marks a control that always needs a person, whatever the rules say. Without an `allow` callback, a step on it fails with a "Needs a person" message. With one, `step.confirm` carries the sentence so you can show it. My `allow` passes it to `window.confirm`, and in the run the dialog read "Saves the settings for every member of Atlas" before Save was pressed. The mark covers everything inside its element, so you can put it on a whole form or dialog.

**Your change callback** gets the final say on a value. The Region Select cancels an agent's request for Asia Pacific:

```json
{
  "ok": true,
  "steps": [{ "step": 0, "ref": "c3", "result": false }],
  "appeared": [],
  "values": {
    "c1 Project name": "Atlas",
    "c3 Region": "north-america",
    "c4 Email notifications": false,
    "c5 Seats": 5
  }
}
```

Note that `ok` is `true`. The bridge ran the step, and the callback cancelled the change, so the step reports `result: false` and the value is unchanged. The docs say this plainly: `ok: true` doesn't mean every value was accepted. Check `changes` and `values`.

There are also two attributes for what an agent can see. `data-agent-hidden` removes a region from `snapshot` and `query`. `data-agent-secret` shows a field with its value as `"[redacted]"`. Password, card and one-time-code fields are treated as secret without a mark.

## Tell agent changes apart with source

Every change callback in UI SDK receives `details.source`: `keyboard`, `mouse`, `touch`, `pen`, `virtual`, `programmatic` or `agent`. After the run above, the demo's log looked like this:

![A Project settings form showing Project name Atlas, Region North America, notifications off and 5 seats, above a log where every line ends in source: agent](/media/blog/ui-sdk-webmcp-ai-agents-react/agent-demo.webp "The demo after the agent's run. Each log line comes from a change callback, and each one reports source: agent.")

Clicking the plus button by hand afterwards logged `Seats → 2 (source: mouse)`. That one field is enough to build an "edited by your assistant" badge, to send agent changes to a review queue, or to skip analytics events that a person didn't cause.

One caveat from the docs: a Button handler that awaits something and changes state afterwards reports `"programmatic"`, because the press is over by then. Wrap the later change in `withSource(source, …)` from `@ui-sdk/react/observe` to keep the agent as its source.

## Your own component: definePrimitive and the agent key

Built-in components join the bridge on their own. Components you write with `definePrimitive` join it too. Here is the seat counter from the demo, with an `agent` key that names the two methods an agent may call:

```ts
import { createChange, definePrimitive, type ChangeDetails } from "@ui-sdk/core"

type SeatStepperOptions = {
  value?: number
  defaultValue?: number
  max?: number
  onValueChange?: (
    value: number,
    details: ChangeDetails<"add" | "remove">,
  ) => void
}

const seatStepper = definePrimitive({
  name: "seat-stepper",
  options: {
    value: "number",
    defaultValue: "number",
    max: "number",
    onValueChange: "callback",
  },
  controlled: ["value"],
  state: (options: SeatStepperOptions) => ({
    value: options.value ?? options.defaultValue ?? 1,
  }),
  sync: (options) =>
    options.value === undefined ? {} : { value: options.value },
  api: (context) => {
    const change = createChange(context)
    const max = () => context.options().max ?? 50
    return {
      add: (count = 1, event?: Event) =>
        change("value", Math.min(max(), context.store.get().value + count), {
          reason: "add",
          event,
        }),
      remove: (count = 1, event?: Event) =>
        change("value", Math.max(1, context.store.get().value - count), {
          reason: "remove",
          event,
        }),
    }
  },
  slots: (slot) => ({
    root: slot<{}, { value: number }>({
      role: "group",
      state: (state) => ({ value: state.value }),
    }),
    remove: slot({
      attrs: (state) => ({
        type: "button",
        "aria-label": "Remove a seat",
        disabled: state.value <= 1 ? "" : undefined,
      }),
      press: ({ api }, event) => api.remove(1, event),
    }),
    add: slot({
      attrs: () => ({ type: "button", "aria-label": "Add a seat" }),
      press: ({ api }, event) => api.add(1, event),
    }),
  }),
  agent: { actions: ["add", "remove"] },
})

export { seatStepper }
```

`createParts(seatStepper, { root: "div", remove: "button", add: "button" })` from `@ui-sdk/react/primitive` turns it into React components. The root takes `aria-labelledby` like any element, which is where the snapshot's "Seats" label came from.

Why the `agent` key matters: without it, the bridge guesses actions from method names. It recognises `set` followed by a capital letter, like `setValue`, and verbs such as `open`, `toggle` and `clear`. It would not guess `add` or `remove`, so the stepper would show no actions. With the key, only the listed methods are offered and anything else is refused, as the `keydown` error above showed. The docs ask you to put `agent` last, after `slots`, so TypeScript has read the API by then, and they mark the key as experimental.

Because the change goes through `createChange`, the app's `onValueChange` still sees `source: "agent"` and can cancel. When the agent asked to remove five seats from three, the value clamped to 1 and the remove button became disabled, exactly as a person's clicks would have left it.

Two notes from writing it. Attribute values in `attrs` are strings, so `disabled` is `""` or `undefined`, not a boolean; TypeScript caught that. And the Core docs say never to put `role` in `attrs` and to use the slot's `role` key, while one Core example does put `role` in `attrs`. I used the `role` key.

## Register the tools for WebMCP

`registerTools(agent, { allow })` publishes `snapshot`, `query` and `act` on `document.modelContext`, the browser API from the WebMCP proposal. A browser that provides it can hand the tools to its built-in agent. In a browser without it, `registerTools` does nothing.

The headless Chromium I tested with doesn't provide `document.modelContext`, so to see what gets registered I installed a stand-in object before the page loaded. The three tools arrived with these annotations:

```json
[
  { "name": "snapshot", "annotations": { "readOnlyHint": true, "untrustedContentHint": true } },
  { "name": "act", "annotations": { "readOnlyHint": false, "untrustedContentHint": true } },
  { "name": "query", "annotations": { "readOnlyHint": true, "untrustedContentHint": true } }
]
```

`untrustedContentHint` is there because tool results carry page text that users wrote, like a name in a table row. The tool descriptions also tell the model to treat that text as data, never instructions. It's a hint, not a guarantee, so keep anything risky behind `allow` and `data-agent-confirm`.

The `allow` on `registerTools` is required, and it runs after the bridge's own `allow`, only for steps that came from the browser's agent. That gives you two policies: one for the agent you wrote, and a stricter one for an agent you didn't.

!diagram[act-step-pipeline]

UI SDK's guide walks through using the tools from the ChatGPT desktop app's built-in browser, where site tools have to be enabled and only some models and workspaces support them. I didn't test that path. Check `typeof document.modelContext?.registerTool` in the browser you target. It returns `"function"` where registration is supported.

## A beta finding: a refusal blamed on the person

In my setup, the bridge's `allow` asked the person to confirm Save, and the WebMCP `allow` refuses every `press`. When I called the registered `act` tool to press Save, the confirm dialog appeared, I accepted it, and the WebMCP policy then refused the step. The error said:

```text
The person said no to "Saves the settings for every member of Atlas".
```

The person said yes. The code said no. The step was refused, which is correct, but a model reading that message could tell the user they declined something they approved. It also asked the person before checking a policy that was always going to refuse. If you combine confirm marks with a WebMCP `allow` that refuses presses, refuse earlier: check `step.action` in the bridge's `allow` too, so the person is never asked. I'm reporting this against 0.1.0-beta.1 and expect it to change.

## When this is worth it

The bridge earns its place when an agent is part of the product: an assistant panel that fills forms, a support tool that changes settings for the user, or a browser agent you want to work well on your site. It is also useful in tests, since `act()` gives you a typed way to drive components without selectors.

It is not a reason to migrate a stable app on its own. The bridge only sees UI SDK components, so a page that mixes libraries gives the agent a partial view. And it is a beta, with the `agent` key and the history helpers marked experimental.

If you build on it, a few habits keep agents useful and safe:

- give every control an accessible name, because that is what the agent types;
- pass `items` to Selects and Comboboxes so choices are readable while closed;
- refuse in `allow` what an agent should never do, and mark what needs a person with `data-agent-confirm`;
- validate values in change callbacks, because `setValue` calls the API directly and skips your keyboard and pointer handlers;
- read `values` from every `act()` result instead of trusting `ok`.

HextaUI is working on a styled UI SDK flavor of its components, so these are the patterns I'm building around. For how UI SDK compares with Radix and Base UI beyond agents, see [UI SDK vs Base UI vs Radix](https://hextaui.com/blog/ui-sdk-vs-base-ui-vs-radix). For styling the components with Tailwind, see [Styling Vercel's UI SDK with Tailwind](https://hextaui.com/blog/style-vercel-ui-sdk-tailwind).
