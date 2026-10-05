"use client"

import * as React from "react"
import { createPortal } from "react-dom"

type SafeAreaPoint = { x: number; y: number }

type SafeAreaRect = { x: number; y: number; width: number; height: number }

type SafeAreaShape = {
  polygon: SafeAreaPoint[]
  trough: SafeAreaRect
  inside: boolean
}

type SafeAreaElements = { reference: Element; floating: Element }

const buffer = 0.5

function crosses(point: SafeAreaPoint, a: SafeAreaPoint, b: SafeAreaPoint) {
  return (
    a.y >= point.y !== b.y >= point.y &&
    point.x <= ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x
  )
}

function inPolygon(point: SafeAreaPoint, polygon: SafeAreaPoint[]) {
  let inside = false
  for (let i = 0; i < polygon.length; i++) {
    if (crosses(point, polygon[i], polygon[(i + 1) % polygon.length])) {
      inside = !inside
    }
  }
  return inside
}

function inRect(point: SafeAreaPoint, rect: SafeAreaRect) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  )
}

function box(rect: DOMRect): SafeAreaRect {
  return { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
}

function safeAreaShape(
  exit: SafeAreaPoint,
  point: SafeAreaPoint,
  ref: DOMRect,
  rect: DOMRect
): SafeAreaShape {
  const side =
    rect.left >= ref.right - 1
      ? "right"
      : rect.right <= ref.left + 1
        ? "left"
        : rect.top >= ref.bottom - 1
          ? "bottom"
          : "top"
  const { x, y } = exit
  const fromRight = x > rect.right - rect.width / 2
  const fromBottom = y > rect.bottom - rect.height / 2
  const wider = rect.width > ref.width
  const taller = rect.height > ref.height
  const left = (wider ? ref : rect).left
  const right = (wider ? ref : rect).right
  const top = (taller ? ref : rect).top
  const bottom = (taller ? ref : rect).bottom
  let polygon: SafeAreaPoint[]
  let trough: SafeAreaRect

  if (side === "left" || side === "right") {
    const offset = taller ? buffer / 2 : buffer * 4
    const one = taller ? y + offset : fromBottom ? y + offset : y - offset
    const two = taller ? y - offset : fromBottom ? y + offset : y - offset
    const near = side === "right" ? rect.left + buffer : rect.right - buffer
    const far = side === "right" ? rect.right : rect.left
    const edgeTop = fromBottom ? near : taller ? near : far
    const edgeBottom = fromBottom ? (taller ? near : far) : near
    const cursorX = side === "right" ? x - buffer : x + buffer + 1
    polygon = [
      { x: cursorX, y: one },
      { x: cursorX, y: two },
      { x: edgeTop, y: rect.top },
      { x: edgeBottom, y: rect.bottom },
    ]
    const from = side === "right" ? ref.right - 1 : rect.right - 1
    const to = side === "right" ? rect.left + 1 : ref.left + 1
    trough = { x: from, y: top, width: to - from, height: bottom - top }
  } else {
    const offset = wider ? buffer / 2 : buffer * 4
    const one = wider ? x + offset : fromRight ? x + offset : x - offset
    const two = wider ? x - offset : fromRight ? x + offset : x - offset
    const near = side === "bottom" ? rect.top + buffer : rect.bottom - buffer
    const far = side === "bottom" ? rect.bottom : rect.top
    const edgeLeft = fromRight ? near : wider ? near : far
    const edgeRight = fromRight ? (wider ? near : far) : near
    const cursorY = side === "bottom" ? y - buffer : y + buffer + 1
    polygon = [
      { x: one, y: cursorY },
      { x: two, y: cursorY },
      { x: rect.left, y: edgeLeft },
      { x: rect.right, y: edgeRight },
    ]
    const from = side === "bottom" ? ref.bottom - 1 : rect.bottom - 1
    const to = side === "bottom" ? rect.top + 1 : ref.top + 1
    trough = { x: left, y: from, width: right - left, height: to - from }
  }

  return {
    polygon,
    trough,
    inside:
      inRect(point, box(ref)) ||
      inRect(point, box(rect)) ||
      inRect(point, trough) ||
      inPolygon(point, polygon),
  }
}

function subscribe() {
  return () => {}
}

function SafeAreaOverlay({
  getElements,
}: {
  getElements: () => SafeAreaElements | null
}) {
  const client = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
  const svgRef = React.useRef<SVGSVGElement | null>(null)
  const polygonRef = React.useRef<SVGPolygonElement | null>(null)
  const troughRef = React.useRef<SVGRectElement | null>(null)
  const dotRef = React.useRef<SVGCircleElement | null>(null)
  const getElementsRef = React.useRef(getElements)

  React.useEffect(() => {
    getElementsRef.current = getElements
  })

  React.useEffect(() => {
    if (!client) {
      return
    }
    let point: SafeAreaPoint | null = null
    let exit: { reference: Element; point: SafeAreaPoint } | null = null
    let frame = 0

    const draw = () => {
      frame = requestAnimationFrame(draw)
      const svg = svgRef.current
      const polygon = polygonRef.current
      const trough = troughRef.current
      const dot = dotRef.current
      const elements = getElementsRef.current()
      if (!svg || !polygon || !trough || !dot || !point || !elements) {
        exit = null
        svg?.removeAttribute("data-visible")
        return
      }
      const ref = elements.reference.getBoundingClientRect()
      const rect = elements.floating.getBoundingClientRect()
      if (exit?.reference !== elements.reference) {
        exit = { reference: elements.reference, point }
      }
      const shape = safeAreaShape(exit.point, point, ref, rect)
      polygon.setAttribute(
        "points",
        shape.polygon.map((p) => `${p.x},${p.y}`).join(" ")
      )
      trough.setAttribute("x", String(shape.trough.x))
      trough.setAttribute("y", String(shape.trough.y))
      trough.setAttribute("width", String(Math.max(0, shape.trough.width)))
      trough.setAttribute("height", String(Math.max(0, shape.trough.height)))
      dot.setAttribute("cx", String(point.x))
      dot.setAttribute("cy", String(point.y))
      svg.toggleAttribute("data-inside", shape.inside)
      svg.setAttribute("data-visible", "")
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        return
      }
      point = { x: event.clientX, y: event.clientY }
      const elements = getElementsRef.current()
      if (
        elements &&
        (exit?.reference !== elements.reference ||
          inRect(point, box(elements.reference.getBoundingClientRect())))
      ) {
        exit = { reference: elements.reference, point }
      }
    }

    document.addEventListener("pointermove", onMove, {
      capture: true,
      passive: true,
    })
    frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("pointermove", onMove, { capture: true })
    }
  }, [client])

  if (!client) {
    return null
  }

  return createPortal(
    <svg
      ref={svgRef}
      aria-hidden="true"
      data-slot="safe-area-overlay"
      className="group/safe-area pointer-events-none invisible fixed inset-0 z-100 size-full overflow-visible data-visible:visible"
    >
      <rect
        ref={troughRef}
        strokeDasharray="3 3"
        className="fill-success/8 stroke-success/50"
      />
      <polygon
        ref={polygonRef}
        fillRule="evenodd"
        strokeLinejoin="round"
        className="fill-success/12 stroke-success/70"
      />
      <circle
        ref={dotRef}
        r={4}
        className="fill-destructive stroke-background stroke-2 group-data-inside/safe-area:fill-success"
      />
    </svg>,
    document.body
  )
}

export { SafeAreaOverlay }
export type { SafeAreaElements }
