type MinilyticsCommand = "goal" | "identify" | "pageview"

type MinilyticsAttribution = {
  ml_visitor_id?: string
  ml_session_id?: string
}

type Minilytics = ((
  cmd: MinilyticsCommand,
  a?: unknown,
  b?: unknown
) => void) & {
  q?: unknown[][]
  attribution?: () => MinilyticsAttribution
}

declare global {
  interface Window {
    minilytics?: Minilytics
  }
}

const minilyticsOrigin = "https://preet-datafast.preetsutharxd.workers.dev"
const minilyticsSrc = "/stats/script.js"
const minilyticsApi = "/stats/event"
const minilyticsWebsiteId = "1p3k1z296v261w58"

let markLoaded: () => void = () => {}
const loaded = new Promise<void>((resolve) => {
  markLoaded = resolve
})

function minilyticsSettled() {
  markLoaded()
}

function whenMinilyticsSettled(timeout = 8000) {
  return Promise.race([
    loaded,
    new Promise<void>((resolve) => setTimeout(resolve, timeout)),
  ])
}

function minilytics(cmd: MinilyticsCommand, a?: unknown, b?: unknown) {
  try {
    if (!window.minilytics) {
      const queue: unknown[][] = []
      window.minilytics = Object.assign(
        (...args: unknown[]) => {
          queue.push(args)
        },
        { q: queue }
      )
    }
    window.minilytics(cmd, a, b)
  } catch {}
}

function goalName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

export {
  goalName,
  minilytics,
  minilyticsApi,
  minilyticsOrigin,
  minilyticsSettled,
  minilyticsSrc,
  minilyticsWebsiteId,
  whenMinilyticsSettled,
  type MinilyticsAttribution,
}
