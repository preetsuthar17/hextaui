"use client"

import * as React from "react"

const phoneQuery = "(max-width: 39.999rem)"

function subscribePhone(notify: () => void) {
  const query = window.matchMedia(phoneQuery)
  query.addEventListener("change", notify)
  return () => query.removeEventListener("change", notify)
}

function useIsPhone() {
  return React.useSyncExternalStore(
    subscribePhone,
    () => window.matchMedia(phoneQuery).matches,
    () => false
  )
}

function isShortcutBlocked(event: KeyboardEvent) {
  if (event.defaultPrevented || event.repeat) return true
  if (event.metaKey || event.ctrlKey || event.altKey) return true
  const target = event.target
  if (!(target instanceof HTMLElement)) return false
  if (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  ) {
    return true
  }
  return target.closest('[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"]') !== null
}

function useToolShortcut(key: string | undefined, handler: () => void) {
  const latest = React.useRef(handler)

  React.useEffect(() => {
    latest.current = handler
  })

  React.useEffect(() => {
    if (!key) return
    const wanted = key.toLowerCase()
    function onKeyDown(event: KeyboardEvent) {
      if (isShortcutBlocked(event)) return
      if (event.key.toLowerCase() !== wanted) return
      event.preventDefault()
      latest.current()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [key])
}

export { useIsPhone, useToolShortcut }
