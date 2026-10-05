import * as React from "react"

const modifierNames: Record<string, string> = {
  Meta: "meta",
  OS: "meta",
  Control: "ctrl",
  Alt: "alt",
  AltGraph: "alt",
  Shift: "shift",
}

const emptyHeld: ReadonlySet<string> = new Set()

let held: ReadonlySet<string> = emptyHeld
const subscribers = new Set<() => void>()

function physicalKey(event: KeyboardEvent) {
  const modifier = modifierNames[event.key]
  if (modifier) {
    return modifier
  }
  const letter = /^Key([A-Z])$/.exec(event.code)
  if (letter) {
    return letter[1].toLowerCase()
  }
  const digit = /^(?:Digit|Numpad)([0-9])$/.exec(event.code)
  if (digit) {
    return digit[1]
  }
  if (event.key === " ") {
    return "space"
  }
  return event.key.toLowerCase()
}

function publish(next: ReadonlySet<string>) {
  held = next
  for (const notify of subscribers) {
    notify()
  }
}

function onKeyDown(event: KeyboardEvent) {
  if (event.repeat) {
    return
  }
  const key = physicalKey(event)
  if (!held.has(key)) {
    publish(new Set([...held, key]))
  }
}

function onKeyUp(event: KeyboardEvent) {
  const key = physicalKey(event)
  if (key === "meta") {
    publish(
      new Set(
        [...held].filter(
          (name) =>
            name !== "meta" && Object.values(modifierNames).includes(name)
        )
      )
    )
    return
  }
  if (held.has(key)) {
    const next = new Set(held)
    next.delete(key)
    publish(next)
  }
}

function releaseAll() {
  if (held.size > 0) {
    publish(emptyHeld)
  }
}

function onVisibilityChange() {
  if (document.visibilityState === "hidden") {
    releaseAll()
  }
}

function subscribeHeld(notify: () => void) {
  subscribers.add(notify)
  if (subscribers.size === 1) {
    window.addEventListener("keydown", onKeyDown, { passive: true })
    window.addEventListener("keyup", onKeyUp, { passive: true })
    window.addEventListener("blur", releaseAll)
    document.addEventListener("visibilitychange", onVisibilityChange)
  }
  return () => {
    subscribers.delete(notify)
    if (subscribers.size === 0) {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("blur", releaseAll)
      document.removeEventListener("visibilitychange", onVisibilityChange)
      held = emptyHeld
    }
  }
}

function subscribeNothing() {
  return () => {}
}

function getHeld() {
  return held
}

function getServerHeld() {
  return emptyHeld
}

function useHeldKeys(enabled: boolean) {
  return React.useSyncExternalStore(
    enabled ? subscribeHeld : subscribeNothing,
    enabled ? getHeld : getServerHeld,
    getServerHeld
  )
}

export { useHeldKeys }
