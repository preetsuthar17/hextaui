"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconPlayerPause,
  IconPlayerPlay,
} from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { NumberFlow } from "@/components/ui/number-flow"

type CarouselOrientation = "horizontal" | "vertical"
type CarouselEvent = "select" | "scroll" | "settle" | "reInit"
type CarouselListener = (api: CarouselApi, event: CarouselEvent) => void
type CarouselAutoplay = boolean | { delay?: number }

type CarouselApi = {
  scrollPrev: (jump?: boolean) => void
  scrollNext: (jump?: boolean) => void
  scrollTo: (index: number, jump?: boolean) => void
  scrollToSlide: (slideIndex: number, jump?: boolean) => void
  canScrollPrev: () => boolean
  canScrollNext: () => boolean
  selectedScrollSnap: () => number
  scrollSnapList: () => number[]
  slidesInView: () => number[]
  slideNodes: () => HTMLElement[]
  viewportNode: () => HTMLElement | null
  play: () => void
  stop: () => void
  isPlaying: () => boolean
  on: (event: CarouselEvent, listener: CarouselListener) => CarouselApi
  off: (event: CarouselEvent, listener: CarouselListener) => CarouselApi
}

type CarouselSnapshot = {
  selected: number
  snapCount: number
  slideCount: number
  firstInView: number
  lastInView: number
  canScrollPrev: boolean
  canScrollNext: boolean
  playing: boolean
  running: boolean
  cycle: number
  announcement: string
}

type CarouselOptions = {
  orientation: CarouselOrientation
  rewind: boolean
  mouseDrag: boolean
  delay: number
  controlledIndex: number | undefined
  defaultIndex: number
  onIndexChange: ((index: number) => void) | undefined
}

const defaultDelay = 5000
const dragThreshold = 5
const settleFallback = 150
const intentWindow = 800
const initialSnapshot: CarouselSnapshot = {
  selected: 0,
  snapCount: 0,
  slideCount: 0,
  firstInView: 0,
  lastInView: 0,
  canScrollPrev: false,
  canScrollNext: false,
  playing: false,
  running: false,
  cycle: 0,
  announcement: "",
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

function isEditable(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.closest("input, textarea, select, [contenteditable='true']") !==
        null)
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

type DragState = {
  pointerId: number
  start: number
  startPosition: number
  lastPosition: number
  lastTime: number
  velocity: number
  active: boolean
}

class CarouselStore {
  options: CarouselOptions
  root: HTMLElement | null = null
  viewport: HTMLElement | null = null
  container: HTMLElement | null = null
  snaps: number[] = []
  slides: HTMLElement[] = []
  slideSnaps: number[] = []
  slideRanges: [number, number][] = []
  rtl = false
  max = 0
  size = 0
  scrollSize = 0
  lastIntent = -Infinity
  pendingTarget: number | null = null
  snapshot = initialSnapshot
  subscribers = new Set<() => void>()
  listeners = new Map<CarouselEvent, Set<CarouselListener>>()
  frame = 0
  settleTimer: ReturnType<typeof setTimeout> | null = null
  autoplayTimer: ReturnType<typeof setTimeout> | null = null
  remaining = defaultDelay
  startedAt = 0
  holds = {
    hover: false,
    focus: false,
    touch: false,
    hidden: false,
    offscreen: false,
  }
  drag: DragState | null = null
  measured = false
  api: CarouselApi

  constructor(options: CarouselOptions) {
    this.options = options
    this.remaining = options.delay
    this.api = {
      scrollPrev: (jump) => this.step(-1, jump),
      scrollNext: (jump) => this.step(1, jump),
      scrollTo: (index, jump) => this.scrollTo(index, jump),
      scrollToSlide: (slideIndex, jump) =>
        this.scrollTo(this.slideSnaps[slideIndex] ?? 0, jump),
      canScrollPrev: () => this.snapshot.canScrollPrev,
      canScrollNext: () => this.snapshot.canScrollNext,
      selectedScrollSnap: () => this.snapshot.selected,
      scrollSnapList: () => [...this.snaps],
      slidesInView: () =>
        this.slides.length === 0
          ? []
          : Array.from(
              {
                length:
                  this.snapshot.lastInView - this.snapshot.firstInView + 1,
              },
              (_, offset) => this.snapshot.firstInView + offset
            ),
      slideNodes: () => [...this.slides],
      viewportNode: () => this.viewport,
      play: () => this.setPlaying(true),
      stop: () => this.setPlaying(false),
      isPlaying: () => this.snapshot.playing,
      on: (event, listener) => {
        const set = this.listeners.get(event) ?? new Set()
        set.add(listener)
        this.listeners.set(event, set)
        return this.api
      },
      off: (event, listener) => {
        this.listeners.get(event)?.delete(listener)
        return this.api
      },
    }
  }

  setOptions(options: CarouselOptions) {
    const orientationChanged = options.orientation !== this.options.orientation
    const delayChanged = options.delay !== this.options.delay
    this.options = options
    if (delayChanged) {
      this.restartAutoplay()
    }
    if (orientationChanged) {
      this.measure()
    } else if (this.measured) {
      this.update()
    }
  }

  subscribe = (callback: () => void) => {
    this.subscribers.add(callback)
    return () => {
      this.subscribers.delete(callback)
    }
  }

  getSnapshot = () => this.snapshot

  getServerSnapshot = () => initialSnapshot

  emit(event: CarouselEvent) {
    this.listeners.get(event)?.forEach((listener) => listener(this.api, event))
  }

  setSnapshot(patch: Partial<CarouselSnapshot>) {
    const next = { ...this.snapshot, ...patch }
    const changed = (Object.keys(patch) as (keyof CarouselSnapshot)[]).some(
      (key) => next[key] !== this.snapshot[key]
    )
    if (!changed) {
      return
    }
    this.snapshot = next
    this.subscribers.forEach((callback) => callback())
  }

  get horizontal() {
    return this.options.orientation === "horizontal"
  }

  position() {
    const viewport = this.viewport
    if (!viewport) {
      return 0
    }
    return Math.abs(this.horizontal ? viewport.scrollLeft : viewport.scrollTop)
  }

  setPosition(position: number, smooth: boolean) {
    const viewport = this.viewport
    if (!viewport) {
      return
    }
    const behavior: ScrollBehavior = smooth ? "smooth" : "instant"
    if (this.horizontal) {
      viewport.scrollTo({ left: this.rtl ? -position : position, behavior })
    } else {
      viewport.scrollTo({ top: position, behavior })
    }
  }

  measure() {
    const viewport = this.viewport
    const container = this.container
    if (!viewport || !container) {
      return
    }
    const horizontal = this.horizontal
    if ((horizontal ? viewport.clientWidth : viewport.clientHeight) === 0) {
      return
    }
    const style = getComputedStyle(viewport)
    this.rtl = horizontal && style.direction === "rtl"
    const paddingEnd =
      parseFloat(
        horizontal ? style.scrollPaddingInlineEnd : style.scrollPaddingBlockEnd
      ) || 0
    const box = viewport.getBoundingClientRect()
    const position = this.position()
    this.size = horizontal ? viewport.clientWidth : viewport.clientHeight
    this.scrollSize = horizontal ? viewport.scrollWidth : viewport.scrollHeight
    this.max = Math.max(
      0,
      horizontal
        ? viewport.scrollWidth - viewport.clientWidth
        : viewport.scrollHeight - viewport.clientHeight
    )
    this.slides = Array.from(container.children).filter(
      (node): node is HTMLElement =>
        node instanceof HTMLElement && node.dataset.slot === "carousel-item"
    )
    this.slideRanges = this.slides.map((slide) => {
      const rect = slide.getBoundingClientRect()
      const start = horizontal
        ? this.rtl
          ? box.right - rect.right
          : rect.left - box.left
        : rect.top - box.top
      const length = horizontal ? rect.width : rect.height
      return [start + position, start + position + length]
    })
    const snaps: number[] = []
    this.slideSnaps = this.slideRanges.map(([, end]) => {
      const target = clamp(end - (this.size - paddingEnd), 0, this.max)
      const existing = snaps.findIndex((snap) => Math.abs(snap - target) <= 1)
      if (existing !== -1) {
        return existing
      }
      snaps.push(target)
      return snaps.length - 1
    })
    if (snaps.length === 0) {
      snaps.push(0)
    }
    if (this.max <= 1) {
      snaps.splice(1)
      this.slideSnaps = this.slideSnaps.map(() => 0)
    }
    this.snaps = snaps
    const count = this.slides.length
    this.slides.forEach((slide, index) => {
      if (!slide.hasAttribute("aria-label") || "autoLabel" in slide.dataset) {
        slide.setAttribute("aria-label", `${index + 1} of ${count}`)
        slide.dataset.autoLabel = ""
      }
    })
    viewport.toggleAttribute("data-scrollable", this.max > 1)
    if (!this.measured) {
      this.measured = true
      const initial = clamp(
        this.options.controlledIndex ?? this.options.defaultIndex,
        0,
        snaps.length - 1
      )
      if (initial > 0) {
        this.setPosition(this.snaps[initial], false)
      }
      this.snapshot = { ...this.snapshot, selected: initial }
      this.update(initial)
    } else {
      const selected = clamp(
        this.pendingTarget ?? this.snapshot.selected,
        0,
        snaps.length - 1
      )
      if (Math.abs(this.position() - this.snaps[selected]) > 1 && !this.drag) {
        this.setPosition(this.snaps[selected], false)
      }
      this.update(selected)
    }
    this.syncAutoplay()
    this.emit("reInit")
  }

  layoutChanged() {
    const viewport = this.viewport
    if (!viewport) {
      return false
    }
    const size = this.horizontal ? viewport.clientWidth : viewport.clientHeight
    const scrollSize = this.horizontal
      ? viewport.scrollWidth
      : viewport.scrollHeight
    return size !== this.size || scrollSize !== this.scrollSize
  }

  progress() {
    const snaps = this.snaps
    if (snaps.length < 2) {
      return 0
    }
    const position = this.position()
    for (let index = 0; index < snaps.length - 1; index++) {
      const from = snaps[index]
      const to = snaps[index + 1]
      if (position <= to) {
        return to > from
          ? index + clamp((position - from) / (to - from), 0, 1)
          : index
      }
    }
    return snaps.length - 1
  }

  nearestSnap(position: number) {
    let nearest = 0
    this.snaps.forEach((snap, index) => {
      if (
        Math.abs(snap - position) < Math.abs(this.snaps[nearest] - position)
      ) {
        nearest = index
      }
    })
    return nearest
  }

  inView(position: number) {
    let first = -1
    let last = -1
    this.slideRanges.forEach(([start, end], index) => {
      const visible =
        Math.min(end, position + this.size) - Math.max(start, position)
      if (visible >= Math.min(end - start, this.size) * 0.5) {
        if (first === -1) {
          first = index
        }
        last = index
      }
    })
    return first === -1 ? [0, 0] : [first, last]
  }

  update(forced?: number) {
    const position = this.position()
    const selected = forced ?? this.pendingTarget ?? this.nearestSnap(position)
    const [firstInView, lastInView] = this.inView(position)
    const multiple = this.snaps.length > 1
    const previous = this.snapshot.selected
    this.setSnapshot({
      selected,
      snapCount: this.snaps.length,
      slideCount: this.slides.length,
      firstInView,
      lastInView,
      canScrollPrev: multiple && (this.options.rewind || selected > 0),
      canScrollNext:
        multiple && (this.options.rewind || selected < this.snaps.length - 1),
    })
    if (selected !== previous) {
      this.restartAutoplay()
      this.emit("select")
      this.options.onIndexChange?.(selected)
    }
  }

  markIntent = () => {
    this.lastIntent = performance.now()
  }

  intended() {
    return (
      this.pendingTarget !== null ||
      this.drag !== null ||
      performance.now() - this.lastIntent < intentWindow
    )
  }

  realign() {
    const snap = this.snaps[this.snapshot.selected]
    if (snap !== undefined && Math.abs(this.position() - snap) > 1) {
      this.setPosition(snap, false)
    }
  }

  onScroll = () => {
    if (this.intended()) {
      this.markIntent()
    }
    if (!this.frame) {
      this.frame = requestAnimationFrame(() => {
        this.frame = 0
        if (this.layoutChanged()) {
          this.measure()
          return
        }
        if (!this.intended()) {
          this.realign()
          return
        }
        this.update()
        this.emit("scroll")
      })
    }
    if (typeof window !== "undefined" && !("onscrollend" in window)) {
      if (this.settleTimer) {
        clearTimeout(this.settleTimer)
      }
      this.settleTimer = setTimeout(this.onSettle, settleFallback)
    }
  }

  onSettle = () => {
    if (this.drag) {
      return
    }
    this.settleTimer = null
    const intended = this.intended()
    this.pendingTarget = null
    this.viewport?.removeAttribute("data-dragging")
    if (!intended) {
      this.realign()
      return
    }
    this.update()
    const { firstInView, lastInView, slideCount } = this.snapshot
    if (!this.snapshot.running && slideCount > 0) {
      this.setSnapshot({
        announcement:
          firstInView === lastInView
            ? `Slide ${firstInView + 1} of ${slideCount}`
            : `Slides ${firstInView + 1} to ${lastInView + 1} of ${slideCount}`,
      })
    }
    this.emit("settle")
    const controlled = this.options.controlledIndex
    if (
      controlled !== undefined &&
      controlled !== this.snapshot.selected &&
      this.snaps.length > 0
    ) {
      this.scrollTo(controlled)
    }
  }

  scrollTo(index: number, jump = false) {
    if (this.snaps.length === 0) {
      return
    }
    const target = clamp(Math.round(index) || 0, 0, this.snaps.length - 1)
    const position = this.snaps[target]
    this.pendingTarget = target
    this.update(target)
    if (Math.abs(this.position() - position) <= 1) {
      this.onSettle()
      return
    }
    this.setPosition(position, !jump && !prefersReducedMotion())
    if (typeof window !== "undefined" && !("onscrollend" in window)) {
      if (this.settleTimer) {
        clearTimeout(this.settleTimer)
      }
      this.settleTimer = setTimeout(this.onSettle, 700)
    }
  }

  step(direction: 1 | -1, jump?: boolean) {
    const count = this.snaps.length
    if (count < 2) {
      return
    }
    const next = this.snapshot.selected + direction
    if (next < 0 || next >= count) {
      if (this.options.rewind) {
        this.scrollTo(next < 0 ? count - 1 : 0, jump)
      }
      return
    }
    this.scrollTo(next, jump)
  }

  setPlaying(playing: boolean) {
    this.remaining = this.options.delay
    this.setSnapshot({ playing, cycle: this.snapshot.cycle + 1 })
    this.stopTimer()
    this.syncAutoplay()
  }

  setHold(key: keyof CarouselStore["holds"], value: boolean) {
    if (this.holds[key] === value) {
      return
    }
    this.holds[key] = value
    this.syncAutoplay()
  }

  stopTimer() {
    if (this.autoplayTimer) {
      clearTimeout(this.autoplayTimer)
      this.autoplayTimer = null
      this.remaining = Math.max(
        0,
        this.remaining - (Date.now() - this.startedAt)
      )
    }
  }

  remainingNow() {
    return this.autoplayTimer
      ? Math.max(0, this.remaining - (Date.now() - this.startedAt))
      : this.remaining
  }

  syncAutoplay() {
    const held = Object.values(this.holds).some(Boolean)
    const running =
      this.snapshot.playing && !held && this.snaps.length > 1 && this.measured
    if (running && !this.autoplayTimer) {
      this.startedAt = Date.now()
      this.autoplayTimer = setTimeout(this.advance, this.remaining)
    } else if (!running) {
      this.stopTimer()
    }
    this.setSnapshot({ running })
  }

  restartAutoplay() {
    if (!this.snapshot.playing) {
      return
    }
    if (this.autoplayTimer) {
      clearTimeout(this.autoplayTimer)
      this.autoplayTimer = null
    }
    this.remaining = this.options.delay
    this.setSnapshot({ cycle: this.snapshot.cycle + 1 })
    this.syncAutoplay()
  }

  advance = () => {
    this.autoplayTimer = null
    this.remaining = this.options.delay
    const count = this.snaps.length
    const next =
      this.snapshot.selected + 1 >= count ? 0 : this.snapshot.selected + 1
    this.scrollTo(next)
    this.setSnapshot({ cycle: this.snapshot.cycle + 1 })
    this.syncAutoplay()
  }

  dragPosition(event: PointerEvent, drag: DragState) {
    const coordinate = this.horizontal ? event.clientX : event.clientY
    const delta = coordinate - drag.start
    return drag.startPosition + (this.rtl ? delta : -delta)
  }

  onPointerDown = (event: PointerEvent) => {
    this.markIntent()
    const viewport = this.viewport
    if (!viewport) {
      return
    }
    const target = event.target instanceof Element ? event.target : null
    if (target?.closest("[data-slot=carousel-content]") !== viewport) {
      return
    }
    if (event.pointerType !== "mouse") {
      this.pendingTarget = null
      this.setHold("touch", true)
      return
    }
    if (
      event.button !== 0 ||
      !this.options.mouseDrag ||
      this.max <= 1 ||
      isEditable(event.target)
    ) {
      return
    }
    this.pendingTarget = null
    this.drag = {
      pointerId: event.pointerId,
      start: this.horizontal ? event.clientX : event.clientY,
      startPosition: this.position(),
      lastPosition: this.position(),
      lastTime: event.timeStamp,
      velocity: 0,
      active: false,
    }
    window.addEventListener("pointermove", this.onPointerMove)
    window.addEventListener("pointerup", this.onPointerUp)
    window.addEventListener("pointercancel", this.onPointerUp)
  }

  onPointerMove = (event: PointerEvent) => {
    const drag = this.drag
    const viewport = this.viewport
    if (!drag || !viewport || event.pointerId !== drag.pointerId) {
      return
    }
    const position = this.dragPosition(event, drag)
    if (!drag.active) {
      if (Math.abs(position - drag.startPosition) < dragThreshold) {
        return
      }
      drag.active = true
      viewport.setAttribute("data-dragging", "")
      window.getSelection()?.removeAllRanges()
      this.setHold("touch", true)
    }
    const clamped = clamp(position, 0, this.max)
    const elapsed = Math.max(1, event.timeStamp - drag.lastTime)
    drag.velocity =
      drag.velocity * 0.4 + ((clamped - drag.lastPosition) / elapsed) * 0.6
    drag.lastPosition = clamped
    drag.lastTime = event.timeStamp
    this.setPosition(clamped, false)
  }

  onPointerUp = (event: PointerEvent) => {
    const drag = this.drag
    if (!drag || event.pointerId !== drag.pointerId) {
      return
    }
    this.removeDragListeners()
    this.drag = null
    if (!drag.active) {
      return
    }
    this.setHold("touch", false)
    const viewport = this.viewport
    viewport?.addEventListener("click", this.suppressClick, {
      capture: true,
      once: true,
    })
    setTimeout(
      () => viewport?.removeEventListener("click", this.suppressClick, true),
      0
    )
    const velocity = event.timeStamp - drag.lastTime > 80 ? 0 : drag.velocity
    const projected = drag.lastPosition + velocity * 180
    const start = this.nearestSnap(drag.startPosition)
    let target = this.nearestSnap(projected)
    const moved = drag.lastPosition - drag.startPosition
    if (target === start && Math.abs(moved) > Math.min(40, this.size * 0.1)) {
      target = clamp(start + Math.sign(moved), 0, this.snaps.length - 1)
    }
    this.scrollTo(target)
    if (this.pendingTarget === null) {
      viewport?.removeAttribute("data-dragging")
    }
  }

  suppressClick = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  onTouchEnd = () => {
    this.setHold("touch", false)
  }

  removeDragListeners() {
    window.removeEventListener("pointermove", this.onPointerMove)
    window.removeEventListener("pointerup", this.onPointerUp)
    window.removeEventListener("pointercancel", this.onPointerUp)
  }

  onDragStart = (event: DragEvent) => {
    if (this.options.mouseDrag && this.max > 1) {
      event.preventDefault()
    }
  }

  onWheel = () => {
    this.markIntent()
    this.pendingTarget = null
  }

  attachViewport = (viewport: HTMLElement | null) => {
    if (!viewport) {
      return
    }
    this.viewport = viewport
    viewport.addEventListener("scroll", this.onScroll, { passive: true })
    viewport.addEventListener("scrollend", this.onSettle)
    viewport.addEventListener("pointerdown", this.onPointerDown)
    viewport.addEventListener("pointerup", this.onTouchEnd)
    viewport.addEventListener("pointercancel", this.onTouchEnd)
    viewport.addEventListener("dragstart", this.onDragStart)
    viewport.addEventListener("wheel", this.onWheel, { passive: true })
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => this.measure())
    resizeObserver?.observe(viewport)
    if (this.container) {
      resizeObserver?.observe(this.container)
    }
    const mutationObserver =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver(() => this.measure())
    if (this.container) {
      mutationObserver?.observe(this.container, { childList: true })
    }
    document.fonts?.addEventListener?.("loadingdone", this.remeasure)
    this.measure()
    return () => {
      viewport.removeEventListener("scroll", this.onScroll)
      viewport.removeEventListener("scrollend", this.onSettle)
      viewport.removeEventListener("pointerdown", this.onPointerDown)
      viewport.removeEventListener("pointerup", this.onTouchEnd)
      viewport.removeEventListener("pointercancel", this.onTouchEnd)
      viewport.removeEventListener("dragstart", this.onDragStart)
      viewport.removeEventListener("wheel", this.onWheel)
      document.fonts?.removeEventListener?.("loadingdone", this.remeasure)
      resizeObserver?.disconnect()
      mutationObserver?.disconnect()
      this.removeDragListeners()
      this.drag = null
      if (this.frame) {
        cancelAnimationFrame(this.frame)
        this.frame = 0
      }
      if (this.settleTimer) {
        clearTimeout(this.settleTimer)
        this.settleTimer = null
      }
      if (this.viewport === viewport) {
        this.viewport = null
        this.measured = false
      }
    }
  }

  remeasure = () => this.measure()

  attachContainer = (container: HTMLElement | null) => {
    if (!container) {
      return
    }
    this.container = container
    return () => {
      if (this.container === container) {
        this.container = null
      }
    }
  }

  onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === "mouse") {
      this.setHold("hover", true)
    }
  }

  onPointerLeave = () => {
    this.setHold("hover", false)
  }

  onFocusIn = (event: FocusEvent) => {
    this.markIntent()
    const target = event.target
    this.setHold(
      "focus",
      target instanceof Element && target.matches(":focus-visible")
    )
  }

  onFocusOut = (event: FocusEvent) => {
    const next = event.relatedTarget
    if (!(next instanceof Node) || !this.root?.contains(next)) {
      this.setHold("focus", false)
    }
  }

  onVisibilityChange = () => {
    this.setHold("hidden", document.visibilityState === "hidden")
  }

  attachRoot = (root: HTMLElement | null) => {
    if (!root) {
      return
    }
    this.root = root
    root.addEventListener("pointerenter", this.onPointerEnter)
    root.addEventListener("pointerleave", this.onPointerLeave)
    root.addEventListener("focusin", this.onFocusIn)
    root.addEventListener("focusout", this.onFocusOut)
    document.addEventListener("visibilitychange", this.onVisibilityChange)
    this.onVisibilityChange()
    const intersectionObserver =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) =>
            this.setHold("offscreen", !entry.isIntersecting)
          )
    intersectionObserver?.observe(root)
    return () => {
      root.removeEventListener("pointerenter", this.onPointerEnter)
      root.removeEventListener("pointerleave", this.onPointerLeave)
      root.removeEventListener("focusin", this.onFocusIn)
      root.removeEventListener("focusout", this.onFocusOut)
      document.removeEventListener("visibilitychange", this.onVisibilityChange)
      intersectionObserver?.disconnect()
      if (this.root === root) {
        this.root = null
      }
    }
  }

  destroy() {
    if (this.autoplayTimer) {
      clearTimeout(this.autoplayTimer)
      this.autoplayTimer = null
    }
    if (this.settleTimer) {
      clearTimeout(this.settleTimer)
      this.settleTimer = null
    }
    this.removeDragListeners()
  }
}

type CarouselContextValue = {
  store: CarouselStore
  snapshot: CarouselSnapshot
  orientation: CarouselOrientation
  delay: number
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

function useCarouselContext(part: string) {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error(`<${part}> must be used within <Carousel>.`)
  }
  return context
}

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within <Carousel>.")
  }
  const { store, snapshot, orientation } = context
  return {
    api: store.api,
    orientation,
    selectedIndex: snapshot.selected,
    snapCount: snapshot.snapCount,
    slideCount: snapshot.slideCount,
    slidesInView: [snapshot.firstInView, snapshot.lastInView] as const,
    canScrollPrev: snapshot.canScrollPrev,
    canScrollNext: snapshot.canScrollNext,
    isPlaying: snapshot.playing,
    scrollPrev: store.api.scrollPrev,
    scrollNext: store.api.scrollNext,
    scrollTo: store.api.scrollTo,
    scrollToSlide: store.api.scrollToSlide,
    play: store.api.play,
    stop: store.api.stop,
  }
}

const carouselVariants = cva("relative", {
  variants: {
    spacing: {
      none: "[--carousel-spacing:0px]",
      sm: "[--carousel-spacing:calc(var(--spacing)*2)]",
      default: "[--carousel-spacing:calc(var(--spacing)*4)]",
      lg: "[--carousel-spacing:calc(var(--spacing)*6)]",
    },
  },
  defaultVariants: {
    spacing: "default",
  },
})

type CarouselProps = useRender.ComponentProps<"div"> &
  VariantProps<typeof carouselVariants> & {
    orientation?: CarouselOrientation
    index?: number
    defaultIndex?: number
    onIndexChange?: (index: number) => void
    rewind?: boolean
    mouseDrag?: boolean
    autoplay?: CarouselAutoplay
    setApi?: (api: CarouselApi) => void
  }

function Carousel({
  className,
  orientation = "horizontal",
  spacing = "default",
  index,
  defaultIndex = 0,
  onIndexChange,
  rewind = false,
  mouseDrag = true,
  autoplay = false,
  setApi,
  render,
  ref,
  onKeyDown,
  children,
  ...props
}: CarouselProps) {
  const delay =
    typeof autoplay === "object"
      ? Math.max(1000, autoplay.delay ?? defaultDelay)
      : defaultDelay
  const [store] = React.useState(
    () =>
      new CarouselStore({
        orientation,
        rewind,
        mouseDrag,
        delay,
        controlledIndex: index,
        defaultIndex,
        onIndexChange,
      })
  )
  const snapshot = React.useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  )

  React.useLayoutEffect(() => {
    store.setOptions({
      orientation,
      rewind,
      mouseDrag,
      delay,
      controlledIndex: index,
      defaultIndex,
      onIndexChange,
    })
  })

  React.useEffect(() => {
    if (
      index !== undefined &&
      store.measured &&
      index !== store.snapshot.selected &&
      store.pendingTarget === null
    ) {
      store.scrollTo(index)
    }
  }, [index, store])

  const autoplayEnabled = Boolean(autoplay)
  React.useEffect(() => {
    store.setPlaying(autoplayEnabled && !prefersReducedMotion())
    if (!autoplayEnabled || typeof window.matchMedia !== "function") {
      return
    }
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => {
      if (query.matches) {
        store.setPlaying(false)
      }
    }
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [autoplayEnabled, store])

  React.useEffect(() => {
    setApi?.(store.api)
  }, [setApi, store])

  React.useEffect(() => () => store.destroy(), [store])

  const rootRef = React.useCallback(
    (node: HTMLDivElement | null) => store.attachRoot(node),
    [store]
  )

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    store.markIntent()
    onKeyDown?.(event)
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      isEditable(event.target) ||
      (event.target as Element).closest?.("[data-slot=carousel]") !==
        event.currentTarget
    ) {
      return
    }
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
    const keys =
      orientation === "horizontal"
        ? rtl
          ? { prev: "ArrowRight", next: "ArrowLeft" }
          : { prev: "ArrowLeft", next: "ArrowRight" }
        : { prev: "ArrowUp", next: "ArrowDown" }
    if (event.key === keys.prev) {
      event.preventDefault()
      store.step(-1)
    } else if (event.key === keys.next) {
      event.preventDefault()
      store.step(1)
    }
  }

  const element = useRender({
    defaultTagName: "div",
    render,
    ref: ref ? [ref, rootRef] : rootRef,
    props: mergeProps<"div">(
      {
        role: "region",
        "aria-roledescription": "carousel",
        className: cn(carouselVariants({ spacing }), className),
        onKeyDown: handleKeyDown,
        children: (
          <>
            {children}
            <span data-slot="carousel-status" role="status" className="sr-only">
              {snapshot.announcement}
            </span>
          </>
        ),
      },
      props,
      {
        "data-slot": "carousel",
        "data-orientation": orientation,
      } as Record<string, string>
    ),
  })

  return (
    <CarouselContext.Provider value={{ store, snapshot, orientation, delay }}>
      {element}
    </CarouselContext.Provider>
  )
}

function CarouselContent({
  className,
  viewportClassName,
  ...props
}: React.ComponentProps<"div"> & { viewportClassName?: string }) {
  const { store, orientation } = useCarouselContext("CarouselContent")
  const viewportRef = React.useCallback(
    (node: HTMLDivElement | null) => store.attachViewport(node),
    [store]
  )
  const containerRef = React.useCallback(
    (node: HTMLDivElement | null) => store.attachContainer(node),
    [store]
  )

  return (
    <div
      ref={viewportRef}
      tabIndex={0}
      data-slot="carousel-content"
      data-orientation={orientation}
      className={cn(
        "-m-1 no-scrollbar scroll-p-1 p-1 outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden data-dragging:cursor-grabbing data-dragging:snap-none data-dragging:select-none [@media(pointer:fine)]:data-scrollable:cursor-grab",
        orientation === "horizontal"
          ? "snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-none"
          : "snap-y snap-mandatory overflow-x-hidden overflow-y-auto overscroll-y-none",
        viewportClassName
      )}
    >
      <div
        ref={containerRef}
        data-slot="carousel-container"
        className={cn(
          "flex after:shrink-0 after:basis-1 after:content-['']",
          orientation === "horizontal"
            ? "-ms-(--carousel-spacing)"
            : "-mt-(--carousel-spacing) flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const { orientation } = useCarouselContext("CarouselItem")

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        role: "group",
        "aria-roledescription": "slide",
        className: cn(
          "min-w-0 shrink-0 grow-0 basis-full snap-end",
          orientation === "horizontal"
            ? "ps-(--carousel-spacing)"
            : "pt-(--carousel-spacing)",
          className
        ),
      },
      props,
      { "data-slot": "carousel-item" } as Record<string, string>
    ),
  })
}

const carouselNavVariants = cva(
  "absolute rounded-full data-disabled:opacity-50",
  {
    variants: {
      orientation: {
        horizontal: "inset-y-0 my-auto",
        vertical: "inset-x-0 mx-auto",
      },
      direction: {
        previous: "",
        next: "",
      },
    },
    compoundVariants: [
      {
        orientation: "horizontal",
        direction: "previous",
        className: "-start-12",
      },
      { orientation: "horizontal", direction: "next", className: "-end-12" },
      { orientation: "vertical", direction: "previous", className: "-top-12" },
      { orientation: "vertical", direction: "next", className: "-bottom-12" },
    ],
  }
)

type CarouselNavProps = React.ComponentProps<typeof Button>

function useNavButton(
  part: string,
  direction: "previous" | "next",
  { className, onClick, disabled, ...props }: CarouselNavProps
) {
  const { store, snapshot, orientation } = useCarouselContext(part)
  const enabled =
    direction === "previous" ? snapshot.canScrollPrev : snapshot.canScrollNext

  return {
    ...props,
    disabled: disabled || !enabled,
    focusableWhenDisabled: true,
    className: cn(carouselNavVariants({ orientation, direction }), className),
    onClick: (
      event: Parameters<NonNullable<CarouselNavProps["onClick"]>>[0]
    ) => {
      const result = onClick?.(event)
      if (!event.defaultPrevented) {
        store.step(direction === "previous" ? -1 : 1)
      }
      return result
    },
    orientation,
  }
}

function CarouselPrevious({
  variant = "outline",
  size = "icon-sm",
  children,
  ...props
}: CarouselNavProps) {
  const { orientation, ...buttonProps } = useNavButton(
    "CarouselPrevious",
    "previous",
    props
  )

  return (
    <Button
      data-slot="carousel-previous"
      aria-label="Previous slide"
      variant={variant}
      size={size}
      {...buttonProps}
    >
      {children ??
        (orientation === "horizontal" ? (
          <IconArrowLeft className="rtl:-scale-x-100" />
        ) : (
          <IconArrowUp />
        ))}
    </Button>
  )
}

function CarouselNext({
  variant = "outline",
  size = "icon-sm",
  children,
  ...props
}: CarouselNavProps) {
  const { orientation, ...buttonProps } = useNavButton(
    "CarouselNext",
    "next",
    props
  )

  return (
    <Button
      data-slot="carousel-next"
      aria-label="Next slide"
      variant={variant}
      size={size}
      {...buttonProps}
    >
      {children ??
        (orientation === "horizontal" ? (
          <IconArrowRight className="rtl:-scale-x-100" />
        ) : (
          <IconArrowDown />
        ))}
    </Button>
  )
}

function useFocusFollowsSelection(
  containerRef: React.RefObject<HTMLElement | null>,
  selector: string,
  key: string
) {
  React.useLayoutEffect(() => {
    const container = containerRef.current
    if (!container || !container.contains(document.activeElement)) {
      return
    }
    const active = container.querySelector<HTMLElement>(selector)
    if (active && active !== document.activeElement) {
      active.focus({ preventScroll: true })
    }
  }, [containerRef, selector, key])
}

function AutoplayProgress({ vertical }: { vertical: boolean }) {
  const { store, snapshot, delay } = useCarouselContext("CarouselDots")
  const fillRef = React.useRef<HTMLSpanElement>(null)
  const { cycle, running, selected } = snapshot

  React.useLayoutEffect(() => {
    const fill = fillRef.current
    if (!fill || typeof fill.animate !== "function") {
      return
    }
    const animation = fill.animate(
      vertical
        ? [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }]
        : [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
      { duration: delay, fill: "forwards" }
    )
    animation.currentTime = delay - store.remainingNow()
    if (!running) {
      animation.pause()
    }
    return () => animation.cancel()
  }, [cycle, running, selected, delay, store, vertical])

  return (
    <span
      ref={fillRef}
      aria-hidden
      className={cn(
        "absolute inset-0 rounded-[inherit] bg-foreground",
        vertical ? "origin-top" : "origin-left rtl:origin-right"
      )}
    />
  )
}

const dotJumpDuration = 200

function useDotProgress(
  containerRef: React.RefObject<HTMLElement | null>,
  store: CarouselStore,
  snapCount: number
) {
  React.useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }
    let previous: number | null = null
    let jumpTimer: ReturnType<typeof setTimeout> | null = null

    const sync = () => {
      const progress = store.progress()
      if (previous !== null && Math.abs(progress - previous) > 0.5) {
        container.setAttribute("data-jumping", "")
        if (jumpTimer) {
          clearTimeout(jumpTimer)
        }
        jumpTimer = setTimeout(() => {
          container.removeAttribute("data-jumping")
          jumpTimer = null
        }, dotJumpDuration)
      }
      previous = progress
      container
        .querySelectorAll<HTMLElement>(":scope > [data-slot=carousel-dot]")
        .forEach((dot, index) => {
          const active = clamp(1 - Math.abs(progress - index), 0, 1)
          dot.style.setProperty("--dot-active", String(active))
        })
    }

    sync()
    const events: CarouselEvent[] = ["scroll", "select", "settle", "reInit"]
    events.forEach((event) => store.api.on(event, sync))

    return () => {
      events.forEach((event) => store.api.off(event, sync))
      if (jumpTimer) {
        clearTimeout(jumpTimer)
      }
      container.removeAttribute("data-jumping")
    }
  }, [containerRef, store, snapCount])
}

function CarouselDots({
  className,
  "aria-label": ariaLabel = "Choose slide",
  ...props
}: React.ComponentProps<"div">) {
  const { store, snapshot, orientation } = useCarouselContext("CarouselDots")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const vertical = orientation === "vertical"
  useFocusFollowsSelection(
    containerRef,
    "[data-slot=carousel-dot][aria-current]",
    String(snapshot.selected)
  )
  useDotProgress(containerRef, store, snapshot.snapCount)

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={ariaLabel}
      data-slot="carousel-dots"
      data-orientation={orientation}
      className={cn(
        "flex max-h-full min-h-0 max-w-full min-w-0 items-center justify-center",
        vertical ? "min-w-6 flex-col" : "min-h-6",
        snapshot.playing ? "[--dot-fill:0]" : "[--dot-fill:1]",
        className
      )}
      {...props}
    >
      {Array.from(
        { length: snapshot.snapCount > 1 ? snapshot.snapCount : 0 },
        (_, index) => {
          const active = index === snapshot.selected
          return (
            <button
              key={index}
              type="button"
              data-slot="carousel-dot"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={active || undefined}
              tabIndex={active ? 0 : -1}
              onClick={() => store.scrollTo(index)}
              className={cn(
                "group/dot relative flex shrink cursor-pointer items-center justify-center rounded-full outline-none [--dot-active:0] [--dot-floor:20%] [-webkit-tap-highlight-color:transparent] focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden in-data-jumping:transition-[width,height,min-width,min-height] in-data-jumping:duration-200 in-data-jumping:ease-spring aria-[current=true]:[--dot-active:1] motion-reduce:in-data-jumping:duration-0 pointer-coarse:after:absolute pointer-coarse:after:inset-x-0 pointer-coarse:after:-inset-y-2.5 [@media(hover:hover)]:hover:[--dot-floor:45%]",
                vertical
                  ? "h-[calc(1.5rem+0.25rem*var(--dot-active))] min-h-[calc(0.625rem+1.125rem*var(--dot-active))] w-6"
                  : "h-6 w-[calc(1.5rem+0.25rem*var(--dot-active))] min-w-[calc(0.625rem+1.125rem*var(--dot-active))]"
              )}
            >
              <span
                data-slot="carousel-dot-indicator"
                className={cn(
                  "relative overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--foreground)_max(var(--dot-floor),calc(20%+80%*var(--dot-active)*var(--dot-fill))),transparent)] in-data-jumping:transition-[width,height,background-color] in-data-jumping:duration-200 in-data-jumping:ease-spring motion-reduce:in-data-jumping:duration-0",
                  vertical
                    ? "h-[calc(0.375rem+0.875rem*var(--dot-active))] w-1.5"
                    : "h-1.5 w-[calc(0.375rem+0.875rem*var(--dot-active))]"
                )}
              >
                {active && snapshot.playing ? (
                  <AutoplayProgress vertical={vertical} />
                ) : null}
              </span>
            </button>
          )
        }
      )}
    </div>
  )
}

function CarouselCounter({
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children">) {
  const { snapshot } = useCarouselContext("CarouselCounter")

  return (
    <div
      data-slot="carousel-counter"
      dir="ltr"
      className={cn(
        "inline-flex min-h-5 items-center gap-1 text-sm text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    >
      {snapshot.slideCount > 0 ? (
        <>
          <NumberFlow
            value={snapshot.selected + 1}
            className="text-foreground"
          />
          <span aria-hidden>/</span>
          <span className="sr-only">of</span>
          <span>{snapshot.snapCount}</span>
        </>
      ) : null}
    </div>
  )
}

function CarouselAutoplayToggle({
  variant = "ghost",
  size = "icon-sm",
  onClick,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { store, snapshot } = useCarouselContext("CarouselAutoplayToggle")

  return (
    <Button
      data-slot="carousel-autoplay-toggle"
      aria-label={snapshot.playing ? "Pause slideshow" : "Play slideshow"}
      variant={variant}
      size={size}
      onClick={(event) => {
        const result = onClick?.(event)
        if (!event.defaultPrevented) {
          store.setPlaying(!store.snapshot.playing)
        }
        return result
      }}
      {...props}
    >
      {children ??
        (snapshot.playing ? <IconPlayerPause /> : <IconPlayerPlay />)}
    </Button>
  )
}

const ThumbnailIndexContext = React.createContext<number | null>(null)

function CarouselThumbnails({
  className,
  children,
  "aria-label": ariaLabel = "Slides",
  ...props
}: React.ComponentProps<"div">) {
  const { snapshot } = useCarouselContext("CarouselThumbnails")
  const containerRef = React.useRef<HTMLDivElement>(null)
  useFocusFollowsSelection(
    containerRef,
    "[data-slot=carousel-thumbnail][data-active]",
    `${snapshot.firstInView}-${snapshot.lastInView}`
  )

  React.useLayoutEffect(() => {
    const strip = containerRef.current
    const active = strip?.querySelector<HTMLElement>(
      "[data-slot=carousel-thumbnail][data-active]"
    )
    if (!strip || !active || strip.scrollWidth <= strip.clientWidth) {
      return
    }
    const stripRect = strip.getBoundingClientRect()
    const rect = active.getBoundingClientRect()
    const inset = 8
    let delta = 0
    if (rect.left < stripRect.left + inset) {
      delta = rect.left - stripRect.left - inset
    } else if (rect.right > stripRect.right - inset) {
      delta = rect.right - stripRect.right + inset
    }
    if (delta !== 0) {
      strip.scrollBy({
        left: delta,
        behavior: prefersReducedMotion() ? "instant" : "smooth",
      })
    }
  }, [snapshot.firstInView, snapshot.lastInView])

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={ariaLabel}
      data-slot="carousel-thumbnails"
      className={cn(
        "-m-1 no-scrollbar flex max-w-full min-w-0 gap-2 overflow-x-auto overscroll-x-none p-1",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <ThumbnailIndexContext.Provider value={index}>
          {child}
        </ThumbnailIndexContext.Provider>
      ))}
    </div>
  )
}

type CarouselThumbnailProps = useRender.ComponentProps<"button"> & {
  index?: number
}

function CarouselThumbnail({
  className,
  index: indexProp,
  render,
  onClick,
  ...props
}: CarouselThumbnailProps) {
  const { store, snapshot } = useCarouselContext("CarouselThumbnail")
  const contextIndex = React.useContext(ThumbnailIndexContext)
  const index = indexProp ?? contextIndex ?? 0
  const active =
    snapshot.slideCount > 0
      ? index >= snapshot.firstInView && index <= snapshot.lastInView
      : index === 0
  const focusTarget =
    index === (snapshot.slideCount > 0 ? snapshot.firstInView : 0)

  return useRender({
    defaultTagName: "button",
    render,
    props: mergeProps<"button">(
      {
        type: "button",
        "aria-label": `Go to slide ${index + 1}`,
        "aria-current": active || undefined,
        tabIndex: focusTarget ? 0 : -1,
        onClick: (event) => {
          onClick?.(event)
          if (!event.defaultPrevented) {
            store.api.scrollToSlide(index)
          }
        },
        className: cn(
          "relative shrink-0 cursor-pointer overflow-hidden rounded-md opacity-60 transition-opacity duration-200 ease-out-quint outline-none [-webkit-tap-highlight-color:transparent] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-2 after:ring-transparent after:transition-[box-shadow] after:duration-200 after:ring-inset hover:opacity-100 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden data-active:opacity-100 data-active:after:ring-foreground",
          className
        ),
      },
      props,
      {
        "data-slot": "carousel-thumbnail",
        ...(active ? { "data-active": "" } : {}),
      } as Record<string, string>
    ),
  })
}

export {
  Carousel,
  CarouselAutoplayToggle,
  CarouselContent,
  CarouselCounter,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbnail,
  CarouselThumbnails,
  carouselVariants,
  useCarousel,
}
export type {
  CarouselApi,
  CarouselAutoplay,
  CarouselEvent,
  CarouselOrientation,
  CarouselProps,
  CarouselThumbnailProps,
}
