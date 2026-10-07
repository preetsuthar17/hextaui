"use client"

import * as React from "react"

function useSharedHighlight<T extends HTMLElement>(
  pathname: string,
  itemSelector: string,
  activeSelector: string
) {
  const navRef = React.useRef<T>(null)
  const highlightRef = React.useRef<HTMLSpanElement>(null)
  const hovered = React.useRef<HTMLElement | null>(null)
  const placed = React.useRef(false)

  const place = React.useCallback(() => {
    const nav = navRef.current
    const highlight = highlightRef.current
    if (!nav || !highlight) return
    const target =
      hovered.current ?? nav.querySelector<HTMLElement>(activeSelector)
    if (!target) {
      highlight.style.opacity = "0"
      placed.current = false
      return
    }
    const box = target.getBoundingClientRect()
    const frame = nav.getBoundingClientRect()
    const instant = !placed.current
    highlight.toggleAttribute("data-instant", instant)
    highlight.style.transform = `translate(${box.left - frame.left + nav.scrollLeft}px, ${box.top - frame.top + nav.scrollTop}px)`
    highlight.style.width = `${box.width}px`
    highlight.style.height = `${box.height}px`
    highlight.style.opacity = "1"
    placed.current = true
    if (instant) {
      requestAnimationFrame(() => highlight.removeAttribute("data-instant"))
    }
  }, [activeSelector])

  React.useLayoutEffect(() => {
    hovered.current = null
    place()
  }, [pathname, place])

  React.useEffect(() => {
    const nav = navRef.current
    if (!nav || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(() => {
      placed.current = false
      place()
    })
    observer.observe(nav)
    return () => observer.disconnect()
  }, [place])

  const follow = (event: React.SyntheticEvent) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>(
      itemSelector
    )
    if (!button || button === hovered.current) return
    hovered.current = button
    place()
  }

  const release = () => {
    if (!hovered.current) return
    hovered.current = null
    place()
  }

  return {
    navRef,
    highlightRef,
    handlers: {
      onPointerOver: follow,
      onPointerLeave: release,
      onFocus: (event: React.FocusEvent) => {
        if ((event.target as HTMLElement).matches(":focus-visible")) {
          follow(event)
        }
      },
      onBlur: (event: React.FocusEvent) => {
        if (!navRef.current?.contains(event.relatedTarget as Node)) release()
      },
    },
  }
}

export { useSharedHighlight }
