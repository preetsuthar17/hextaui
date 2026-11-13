type BlogDiagram = {
  caption: string
  description: string
}

const blogDiagrams = {
  "ui-sdk-layers": {
    caption: "Where your styles attach in UI SDK",
    description:
      "Behaviors from @ui-sdk/core (focus, keys, selection, popups) are combined by definePrimitive into a primitive with state, an API and slots. The React adapter renders each slot as a part with a data-slot attribute, state attributes such as data-open, and CSS variables such as --transform-origin. Your Tailwind classes or CSS target those three hooks.",
  },
  "popup-lifecycle": {
    caption: "The attributes a UI SDK popup carries as it opens and closes",
    description:
      "Closed and unmounted. On open, the content mounts with data-starting-style for the first frame, then holds data-open. On close, it gets data-closed and data-ending-style and stays mounted until the exit transition or animation finishes, then unmounts. keepMounted leaves it in the page, hidden.",
  },
  "headless-matrix": {
    caption: "Radix, Base UI and UI SDK at a glance, November 2026",
    description:
      "Radix (radix-ui 1.8.1, MIT): React only, stable, data-state attributes, Portal and Content, no agent bridge. Base UI (@base-ui/react 1.9.0, MIT): React only, stable, data-open and data-starting-style attributes, Portal, Positioner and Popup, no agent bridge. UI SDK (@ui-sdk/react 0.1.0-beta.1, Apache-2.0): React, Vue, Svelte, Solid and Web Components, beta, data-slot plus data-open and data-starting-style attributes, content rendered in place in the top layer, agent bridge and WebMCP tools built in.",
  },
  "popup-anatomy": {
    caption: "The same popover, three part trees",
    description:
      "Radix: Root, Trigger, Portal, Content. Base UI: Root, Trigger, Portal, Positioner, Popup. UI SDK: Popover, PopoverTrigger, PopoverContent, with the content rendered in place and promoted to the browser's top layer.",
  },
  "agent-bridge-flow": {
    caption: "How an agent reaches your components through UI SDK",
    description:
      "Your components register with the bridge that createAgent returns. An agent calls snapshot, query or act, either through your own tool loop with agentTools or through the browser's WebMCP API after registerTools. act runs the allow callbacks, then calls the component's API, which fires your change callback with source set to agent. The callback can cancel the change.",
  },
  "agent-benchmark": {
    caption:
      "Vercel's project-settings benchmark: browser tools vs UI SDK's agent bridge",
    description:
      "Medians of three runs reported by Vercel, Sonnet through Claude Code. Tool calls: 16 with browser tools, 5 with the agent bridge. Text read: 39.8k vs 6.8k characters. Time: 41 s vs 16 s. Cost: $0.073 vs $0.032.",
  },
  "act-step-pipeline": {
    caption: "What happens to one act step",
    description:
      "The bridge resolves the step's ref (a ref such as c3, then a label, then an item, then a component kind), runs your createAgent allow, then the registerTools allow when the step came through WebMCP, then calls the component's API. Your change callback sees source agent and may cancel. The step result lists changes and current values.",
  },
} satisfies Record<string, BlogDiagram>

type BlogDiagramName = keyof typeof blogDiagrams

function isBlogDiagram(name: string): name is BlogDiagramName {
  return name in blogDiagrams
}

function getBlogDiagram(name: string): BlogDiagram {
  if (!isBlogDiagram(name)) throw new Error(`blog: no diagram named ${name}`)
  return blogDiagrams[name]
}

export { getBlogDiagram, isBlogDiagram, type BlogDiagramName }
