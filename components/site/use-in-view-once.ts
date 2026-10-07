"use client"

import * as React from "react"

type Entry = { visible: boolean; queued: boolean; mount: () => void }

const entries = new WeakMap<Element, Entry>()
const queue: Element[] = []
let observer: IntersectionObserver | null = null
let scheduled = false

function nextIdle(callback: () => void) {
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(callback, { timeout: 300 })
  } else {
    setTimeout(callback, 16)
  }
}

function flush() {
  scheduled = false
  while (queue.length > 0) {
    const element = queue.shift()!
    const entry = entries.get(element)
    if (!entry) continue
    entry.queued = false
    if (!entry.visible) continue
    entries.delete(element)
    observer?.unobserve(element)
    React.startTransition(entry.mount)
    break
  }
  if (queue.length > 0) schedule()
}

function schedule() {
  if (scheduled) return
  scheduled = true
  nextIdle(flush)
}

function observe(element: Element, mount: () => void) {
  observer ??= new IntersectionObserver(
    (records) => {
      for (const record of records) {
        const entry = entries.get(record.target)
        if (!entry) continue
        entry.visible = record.isIntersecting
        if (entry.visible && !entry.queued) {
          entry.queued = true
          queue.push(record.target)
        }
      }
      schedule()
    },
    { rootMargin: "400px 0px" }
  )
  entries.set(element, { visible: false, queued: false, mount })
  observer.observe(element)
  return () => {
    entries.delete(element)
    observer?.unobserve(element)
  }
}

function useInViewOnce<T extends Element>() {
  const ref = React.useRef<T>(null)
  const [inView, setInView] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!element || inView) return
    return observe(element, () => setInView(true))
  }, [inView])

  return [ref, inView] as const
}

export { useInViewOnce }
