"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { useRender } from "@base-ui/react/use-render"
import {
  IconAlertTriangle,
  IconBadgeCc,
  IconBadgeCcFilled,
  IconChevronsLeft,
  IconChevronsRight,
  IconMaximize,
  IconMinimize,
  IconPictureInPictureOff,
  IconPictureInPictureOn,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconRewindBackward10,
  IconRewindBackward15,
  IconRewindBackward30,
  IconRewindBackward5,
  IconRewindForward10,
  IconRewindForward15,
  IconRewindForward30,
  IconRewindForward5,
  IconRotateClockwise,
  IconVolume,
  IconVolume2,
  IconVolume3,
} from "@tabler/icons-react"
import { cva } from "class-variance-authority"
import { cn } from "cn"

import { prefersReducedMotion } from "@/lib/motion"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd"
import { Spinner } from "@/components/ui/spinner"
import { TooltipGroup, TooltipTrigger } from "@/components/ui/tooltip"
import { useMergedRef } from "@/hooks/use-merged-ref"

type VideoPlayerVariant = "overlay" | "bar"

type VideoPlayerMediaState = {
  paused: boolean
  ended: boolean
  started: boolean
  waiting: boolean
  scrubbing: boolean
  scrubTime: number
  currentTime: number
  duration: number
  buffered: number
  volume: number
  muted: boolean
  playbackRate: number
  fullscreen: boolean
  pictureInPicture: boolean
  error: boolean
  hasCaptions: boolean
  captions: boolean
  caption: string
}

type VideoPlayerActions = {
  play: () => void
  pause: () => void
  togglePaused: () => void
  seek: (time: number) => void
  seekBy: (offset: number) => void
  setVolume: (volume: number) => void
  toggleMuted: () => void
  setPlaybackRate: (rate: number) => void
  toggleFullscreen: () => void
  togglePictureInPicture: () => void
  toggleCaptions: () => void
}

type VideoPlayerApi = VideoPlayerMediaState & VideoPlayerActions

type VideoPlayerStore = {
  get: () => VideoPlayerApi
  getInitial: () => VideoPlayerApi
  set: (patch: Partial<VideoPlayerMediaState>) => void
  subscribe: (listener: () => void) => () => void
  syncTracks: () => void
}

type FlashKind =
  | "play"
  | "pause"
  | "back"
  | "forward"
  | "volume"
  | "mute"
  | "rate"
  | "captions"

type FlashSide = "start" | "center" | "end"

type Flash = { id: number; kind: FlashKind; text?: string; side: FlashSide }

type Notify = (
  kind: FlashKind,
  text?: string,
  spoken?: string,
  side?: FlashSide
) => void

type VideoPlayerContextValue = {
  store: VideoPlayerStore
  variant: VideoPlayerVariant
  rootRef: React.RefObject<HTMLDivElement | null>
  videoRef: React.RefObject<HTMLVideoElement | null>
  controlsHidden: boolean
  hold: (reason: string, active: boolean) => void
  reveal: () => void
  hideControls: () => void
  notify: Notify
  shortcuts: boolean
}

const VideoPlayerContext = React.createContext<VideoPlayerContextValue | null>(
  null
)

const VideoPlayerControlsContext = React.createContext<{
  tooltips: boolean
} | null>(null)

function useVideoPlayerContext(part: string) {
  const context = React.useContext(VideoPlayerContext)
  if (!context) {
    throw new Error(`${part} must be used within <VideoPlayer>.`)
  }
  return context
}

const initialState: VideoPlayerMediaState = {
  paused: true,
  ended: false,
  started: false,
  waiting: false,
  scrubbing: false,
  scrubTime: 0,
  currentTime: 0,
  duration: 0,
  buffered: 0,
  volume: 1,
  muted: false,
  playbackRate: 1,
  fullscreen: false,
  pictureInPicture: false,
  error: false,
  hasCaptions: false,
  captions: false,
  caption: "",
}

const defaultRates = [0.5, 0.75, 1, 1.25, 1.5, 2]

const hideDelay = 2500

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function isSeekable(duration: number) {
  return Number.isFinite(duration) && duration > 0
}

function formatTime(seconds: number, reference = seconds) {
  const total =
    Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const rest = String(total % 60).padStart(2, "0")
  if (hours > 0 || (Number.isFinite(reference) && reference >= 3600)) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${rest}`
  }
  return `${minutes}:${rest}`
}

function spokenTime(seconds: number) {
  const total =
    Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const rest = total % 60
  const parts: string[] = []
  if (hours) {
    parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`)
  }
  if (minutes) {
    parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`)
  }
  if (rest || parts.length === 0) {
    parts.push(`${rest} ${rest === 1 ? "second" : "seconds"}`)
  }
  return parts.join(" ")
}

function formatRate(rate: number) {
  return `${Number(rate.toFixed(2))}×`
}

function readBuffered(video: HTMLVideoElement) {
  const { buffered, currentTime, duration } = video
  if (!isSeekable(duration)) {
    return 0
  }
  for (let index = 0; index < buffered.length; index++) {
    if (
      buffered.start(index) <= currentTime + 0.5 &&
      buffered.end(index) >= currentTime
    ) {
      return clamp(buffered.end(index) / duration, 0, 1)
    }
  }
  return 0
}

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null
  webkitFullscreenEnabled?: boolean
  webkitExitFullscreen?: () => Promise<void> | void
}

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}

type FullscreenVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void
  webkitExitFullscreen?: () => void
  webkitDisplayingFullscreen?: boolean
}

function fullscreenElement() {
  const doc = document as FullscreenDocument
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null
}

function canFullscreen() {
  const doc = document as FullscreenDocument
  return Boolean(
    doc.fullscreenEnabled ||
    doc.webkitFullscreenEnabled ||
    (typeof HTMLVideoElement !== "undefined" &&
      "webkitEnterFullscreen" in HTMLVideoElement.prototype)
  )
}

function canPictureInPicture() {
  return Boolean(
    (document as Document & { pictureInPictureEnabled?: boolean })
      .pictureInPictureEnabled
  )
}

function captionTracks(video: HTMLVideoElement) {
  const tracks: TextTrack[] = []
  const list = video.textTracks
  if (!list) {
    return tracks
  }
  for (let index = 0; index < list.length; index++) {
    const track = list[index]
    if (track.kind === "subtitles" || track.kind === "captions") {
      tracks.push(track)
    }
  }
  return tracks
}

function subscribeNever() {
  return () => {}
}

function useSupport(check: () => boolean) {
  return React.useSyncExternalStore(subscribeNever, check, () => false)
}

function ignoreRejection(result: unknown) {
  if (result && typeof (result as Promise<unknown>).catch === "function") {
    ;(result as Promise<unknown>).catch(() => {})
  }
}

function createVideoPlayerStore(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  rootRef: React.RefObject<HTMLDivElement | null>
): VideoPlayerStore {
  const listeners = new Set<() => void>()
  let snapshot: VideoPlayerApi

  const set = (patch: Partial<VideoPlayerMediaState>) => {
    let changed = false
    for (const key in patch) {
      const name = key as keyof VideoPlayerMediaState
      if (!Object.is(snapshot[name], patch[name])) {
        changed = true
        break
      }
    }
    if (!changed) {
      return
    }
    snapshot = { ...snapshot, ...patch }
    listeners.forEach((listener) => listener())
  }

  const actions: VideoPlayerActions = {
    play: () => {
      const video = videoRef.current
      if (video) {
        ignoreRejection(video.play())
      }
    },
    pause: () => {
      videoRef.current?.pause()
    },
    togglePaused: () => {
      const video = videoRef.current
      if (!video) {
        return
      }
      if (video.paused || video.ended) {
        ignoreRejection(video.play())
      } else {
        video.pause()
      }
    },
    seek: (time) => {
      const video = videoRef.current
      if (!video || !isSeekable(video.duration)) {
        return
      }
      const next = clamp(time, 0, video.duration)
      video.currentTime = next
      set({ currentTime: next, ended: false })
    },
    seekBy: (offset) => {
      const video = videoRef.current
      if (video) {
        actions.seek(video.currentTime + offset)
      }
    },
    setVolume: (volume) => {
      const video = videoRef.current
      if (!video) {
        return
      }
      const next = clamp(volume, 0, 1)
      video.volume = next
      video.muted = next === 0
    },
    toggleMuted: () => {
      const video = videoRef.current
      if (!video) {
        return
      }
      if (video.muted || video.volume === 0) {
        if (video.volume === 0) {
          video.volume = 0.5
        }
        video.muted = false
      } else {
        video.muted = true
      }
    },
    setPlaybackRate: (rate) => {
      const video = videoRef.current
      if (video && Number.isFinite(rate) && rate > 0) {
        video.playbackRate = clamp(rate, 0.0625, 16)
      }
    },
    toggleFullscreen: () => {
      const root = rootRef.current as FullscreenElement | null
      const video = videoRef.current as FullscreenVideo | null
      const doc = document as FullscreenDocument
      if (fullscreenElement()) {
        ignoreRejection(
          doc.exitFullscreen
            ? doc.exitFullscreen()
            : doc.webkitExitFullscreen?.()
        )
        return
      }
      if (video?.webkitDisplayingFullscreen) {
        video.webkitExitFullscreen?.()
        return
      }
      if (root && doc.fullscreenEnabled && root.requestFullscreen) {
        ignoreRejection(root.requestFullscreen())
      } else if (root?.webkitRequestFullscreen && doc.webkitFullscreenEnabled) {
        ignoreRejection(root.webkitRequestFullscreen())
      } else {
        video?.webkitEnterFullscreen?.()
      }
    },
    toggleCaptions: () => {},
    togglePictureInPicture: () => {
      const video = videoRef.current
      if (!video) {
        return
      }
      const doc = document as Document & {
        pictureInPictureElement?: Element | null
        exitPictureInPicture?: () => Promise<void>
      }
      if (doc.pictureInPictureElement) {
        ignoreRejection(doc.exitPictureInPicture?.())
      } else if (canPictureInPicture() && !video.disablePictureInPicture) {
        ignoreRejection(
          (
            video as HTMLVideoElement & {
              requestPictureInPicture?: () => Promise<unknown>
            }
          ).requestPictureInPicture?.()
        )
      }
    },
  }

  let activeTrack: TextTrack | null = null
  let lastTrack: TextTrack | null = null

  const readCaption = () => {
    const cues = activeTrack?.activeCues
    if (!cues) {
      return ""
    }
    const lines: string[] = []
    for (let index = 0; index < cues.length; index++) {
      const text = (cues[index] as VTTCue).text
      if (typeof text === "string") {
        lines.push(text.replace(/<[^>]*>/g, "").trim())
      }
    }
    return lines.filter(Boolean).join("\n")
  }

  const handleCueChange = () => set({ caption: readCaption() })

  const activate = (track: TextTrack | null) => {
    if (track === activeTrack) {
      return
    }
    if (activeTrack) {
      activeTrack.removeEventListener("cuechange", handleCueChange)
      if (activeTrack.mode !== "disabled") {
        activeTrack.mode = "disabled"
      }
    }
    activeTrack = track
    if (track) {
      lastTrack = track
      track.mode = "hidden"
      track.addEventListener("cuechange", handleCueChange)
    }
    set({ captions: track !== null, caption: readCaption() })
  }

  const syncTracks = () => {
    const video = videoRef.current
    if (!video) {
      return
    }
    const tracks = captionTracks(video)
    if (activeTrack && !tracks.includes(activeTrack)) {
      activeTrack.removeEventListener("cuechange", handleCueChange)
      activeTrack = null
    }
    if (lastTrack && !tracks.includes(lastTrack)) {
      lastTrack = null
    }
    const shown = tracks.find(
      (track) => track.mode === "showing" && track !== activeTrack
    )
    if (shown) {
      activate(shown)
    } else if (activeTrack && activeTrack.mode === "disabled") {
      activate(null)
    }
    set({
      hasCaptions: tracks.length > 0,
      captions: activeTrack !== null,
      caption: readCaption(),
    })
  }

  actions.toggleCaptions = () => {
    const video = videoRef.current
    if (!video) {
      return
    }
    if (activeTrack) {
      activate(null)
      return
    }
    const tracks = captionTracks(video)
    const language =
      typeof navigator === "undefined" ? "" : navigator.language.split("-")[0]
    activate(
      lastTrack ??
        tracks.find((track) => track.language.split("-")[0] === language) ??
        tracks[0] ??
        null
    )
  }

  snapshot = { ...initialState, ...actions }
  const initial = snapshot

  return {
    get: () => snapshot,
    getInitial: () => initial,
    set,
    syncTracks,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

function useStoreValue<T>(
  store: VideoPlayerStore,
  selector: (api: VideoPlayerApi) => T
) {
  return React.useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(store.getInitial())
  )
}

const identity = (api: VideoPlayerApi) => api

function useVideoPlayer(): VideoPlayerApi
function useVideoPlayer<T>(selector: (api: VideoPlayerApi) => T): T
function useVideoPlayer<T>(selector?: (api: VideoPlayerApi) => T) {
  const { store } = useVideoPlayerContext("useVideoPlayer")
  return useStoreValue(
    store,
    (selector ?? identity) as (api: VideoPlayerApi) => T | VideoPlayerApi
  )
}

function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  if (target.isContentEditable) {
    return true
  }
  if (target instanceof HTMLInputElement) {
    return (
      target.type !== "range" &&
      target.type !== "checkbox" &&
      target.type !== "radio" &&
      target.type !== "button"
    )
  }
  return (
    target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement
  )
}

function isActivatable(target: EventTarget | null) {
  return (
    target instanceof Element &&
    target.closest(
      "button, a[href], summary, select, [role=button], [role=link], [role=checkbox], [role=switch], [role=tab], [role=option]"
    ) !== null
  )
}

function isRange(target: EventTarget | null) {
  return (
    target instanceof Element &&
    (target.closest("[role=slider]") !== null ||
      (target instanceof HTMLInputElement && target.type === "range"))
  )
}

function inPopup(target: EventTarget | null) {
  return (
    target instanceof Element &&
    target.closest(
      "[role=menu], [role=listbox], [role=dialog], [role=alertdialog]"
    ) !== null
  )
}

function runShortcut(
  event: KeyboardEvent | React.KeyboardEvent,
  api: VideoPlayerApi,
  notify: Notify
) {
  if (
    event.defaultPrevented ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    isEditable(event.target) ||
    inPopup(event.target)
  ) {
    return false
  }
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
  const seekable = isSeekable(api.duration)
  const range = isRange(event.target)

  if (key === " " || key === "k") {
    if (key === " " && isActivatable(event.target)) {
      return false
    }
    if (event.shiftKey) {
      return false
    }
    const willPlay = api.paused || api.ended
    api.togglePaused()
    notify(willPlay ? "play" : "pause", willPlay ? "Playing" : "Paused")
    return true
  }
  if (
    event.shiftKey &&
    (key === ">" || key === "<" || key === "." || key === ",")
  ) {
    const faster = key === ">" || key === "."
    const index = defaultRates.findIndex(
      (rate) => rate >= api.playbackRate - 0.001
    )
    const current = index === -1 ? defaultRates.length - 1 : index
    const next =
      defaultRates[
        clamp(
          defaultRates[current] === api.playbackRate || !faster
            ? current + (faster ? 1 : -1)
            : current,
          0,
          defaultRates.length - 1
        )
      ]
    api.setPlaybackRate(next)
    notify("rate", formatRate(next))
    return true
  }
  if (event.shiftKey) {
    return false
  }
  if (key === "j" || key === "l") {
    if (!seekable) {
      return false
    }
    api.seekBy(key === "j" ? -10 : 10)
    notify(
      key === "j" ? "back" : "forward",
      key === "j" ? "−10s" : "+10s",
      key === "j" ? "Back 10 seconds" : "Forward 10 seconds"
    )
    return true
  }
  if (!range && (key === "ArrowLeft" || key === "ArrowRight")) {
    if (!seekable) {
      return false
    }
    api.seekBy(key === "ArrowLeft" ? -5 : 5)
    notify(
      key === "ArrowLeft" ? "back" : "forward",
      key === "ArrowLeft" ? "−5s" : "+5s",
      key === "ArrowLeft" ? "Back 5 seconds" : "Forward 5 seconds"
    )
    return true
  }
  if (!range && (key === "ArrowUp" || key === "ArrowDown")) {
    const base = api.muted ? 0 : api.volume
    const next = clamp(
      Math.round((base + (key === "ArrowUp" ? 0.05 : -0.05)) * 100) / 100,
      0,
      1
    )
    api.setVolume(next)
    notify(
      next === 0 ? "mute" : "volume",
      `${Math.round(next * 100)}%`,
      `Volume ${Math.round(next * 100)}%`
    )
    return true
  }
  if (key === "m") {
    const willMute = !(api.muted || api.volume === 0)
    api.toggleMuted()
    notify(willMute ? "mute" : "volume", willMute ? "Muted" : "Unmuted")
    return true
  }
  if (key === "c" && api.hasCaptions) {
    const willShow = !api.captions
    api.toggleCaptions()
    notify(
      "captions",
      willShow ? "On" : "Off",
      willShow ? "Captions on" : "Captions off"
    )
    return true
  }
  if (key === "f") {
    api.toggleFullscreen()
    return true
  }
  if (key === "i" && canPictureInPicture()) {
    api.togglePictureInPicture()
    return true
  }
  if (!range && (key === "Home" || key === "End")) {
    if (!seekable) {
      return false
    }
    api.seek(key === "Home" ? 0 : api.duration)
    return true
  }
  if (/^[0-9]$/.test(key) && !range) {
    if (!seekable) {
      return false
    }
    api.seek((Number(key) / 10) * api.duration)
    return true
  }
  return false
}

const videoPlayerVariants = cva(
  "group/video-player @container/video-player relative isolate grid w-full grid-cols-[minmax(0,1fr)] overflow-hidden rounded-xl text-foreground outline-none select-none focus-visible:outline-hidden data-fullscreen:size-full data-fullscreen:rounded-none [&>*]:col-start-1",
  {
    variants: {
      variant: {
        overlay:
          "dark grid-rows-[minmax(0,1fr)] bg-background data-[controls=hidden]:cursor-none",
        bar: "grid-rows-[minmax(0,1fr)_auto] bg-card text-card-foreground ring-(length:--hairline) ring-foreground/10 data-fullscreen:ring-0 forced-colors:border",
      },
    },
    defaultVariants: {
      variant: "overlay",
    },
  }
)

type VideoPlayerProps = React.ComponentProps<"div"> & {
  variant?: VideoPlayerVariant
  shortcuts?: boolean
  globalShortcuts?: boolean
  errorMessage?: React.ReactNode
}

function VideoPlayer({
  className,
  variant = "overlay",
  shortcuts = true,
  globalShortcuts = false,
  errorMessage = "This video can’t be played.",
  children,
  onKeyDown,
  onPointerMove,
  onPointerLeave,
  ref,
  ...props
}: VideoPlayerProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const videoRef = React.useRef<HTMLVideoElement | null>(null)
  const [store] = React.useState(() =>
    createVideoPlayerStore(videoRef, rootRef)
  )
  const [controlsHidden, setControlsHidden] = React.useState(false)
  const [flash, setFlash] = React.useState<Flash | null>(null)
  const [announcement, setAnnouncement] = React.useState("")
  const holdsRef = React.useRef(new Set<string>())
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )
  const flashTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  const fullscreen = useStoreValue(store, (api) => api.fullscreen)
  const started = useStoreValue(store, (api) => api.started)
  const waiting = useStoreValue(store, (api) => api.waiting && !api.paused)
  const error = useStoreValue(store, (api) => api.error)
  const captions = useStoreValue(store, (api) => api.captions)
  const caption = useStoreValue(store, (api) => api.caption)

  const canHide = React.useCallback(() => {
    const api = store.get()
    return (
      variant === "overlay" &&
      !api.paused &&
      !api.ended &&
      !api.scrubbing &&
      !api.error &&
      holdsRef.current.size === 0
    )
  }, [store, variant])

  const schedule = React.useCallback(
    (delay = hideDelay) => {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = setTimeout(() => {
        if (canHide()) {
          setControlsHidden(true)
        }
      }, delay)
    },
    [canHide]
  )

  const reveal = React.useCallback(() => {
    setControlsHidden(false)
    schedule()
  }, [schedule])

  const hideControls = React.useCallback(() => {
    clearTimeout(hideTimerRef.current)
    if (canHide()) {
      setControlsHidden(true)
    }
  }, [canHide])

  const hold = React.useCallback(
    (reason: string, active: boolean) => {
      const holds = holdsRef.current
      if (active) {
        holds.add(reason)
        clearTimeout(hideTimerRef.current)
        setControlsHidden(false)
      } else if (holds.delete(reason)) {
        schedule()
      }
    },
    [schedule]
  )

  const notify = React.useCallback<Notify>(
    (kind, text, spoken = text, side = "center") => {
      clearTimeout(flashTimerRef.current)
      setFlash((previous) => ({
        id: (previous?.id ?? 0) + 1,
        kind,
        text,
        side,
      }))
      setAnnouncement(spoken ?? "")
      flashTimerRef.current = setTimeout(() => setFlash(null), 700)
    },
    []
  )

  React.useEffect(() => {
    let paused = store.get().paused || store.get().ended
    let scrubbing = store.get().scrubbing
    return store.subscribe(() => {
      const api = store.get()
      const nextPaused = api.paused || api.ended || api.error
      if (nextPaused !== paused || api.scrubbing !== scrubbing) {
        paused = nextPaused
        scrubbing = api.scrubbing
        if (paused || scrubbing) {
          clearTimeout(hideTimerRef.current)
          setControlsHidden(false)
        } else {
          schedule()
        }
      }
    })
  }, [schedule, store])

  React.useEffect(() => {
    const sync = () => {
      const root = rootRef.current
      store.set({
        fullscreen: root !== null && fullscreenElement() === root,
      })
    }
    document.addEventListener("fullscreenchange", sync)
    document.addEventListener("webkitfullscreenchange", sync)
    return () => {
      document.removeEventListener("fullscreenchange", sync)
      document.removeEventListener("webkitfullscreenchange", sync)
    }
  }, [store])

  React.useEffect(
    () => () => {
      clearTimeout(hideTimerRef.current)
      clearTimeout(flashTimerRef.current)
    },
    []
  )

  React.useEffect(() => {
    if (!shortcuts || !globalShortcuts) {
      return
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (
        target instanceof Element &&
        target !== document.body &&
        (target.closest("[data-slot=video-player]") !== null ||
          isActivatable(target) ||
          isRange(target))
      ) {
        return
      }
      if (
        document.querySelector("[role=dialog], [role=alertdialog], [role=menu]")
      ) {
        return
      }
      if (runShortcut(event, store.get(), notify)) {
        event.preventDefault()
        if (variant === "overlay") {
          reveal()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [globalShortcuts, notify, reveal, shortcuts, store, variant])

  const setRootRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node
      if (typeof ref === "function") {
        const cleanup = ref(node)
        return () => {
          rootRef.current = null
          if (typeof cleanup === "function") {
            cleanup()
          } else {
            ref(null)
          }
        }
      }
      if (ref) {
        ref.current = node
      }
      return () => {
        rootRef.current = null
        if (ref && typeof ref !== "function") {
          ref.current = null
        }
      }
    },
    [ref]
  )

  const context = React.useMemo<VideoPlayerContextValue>(
    () => ({
      store,
      variant,
      rootRef,
      videoRef,
      controlsHidden,
      hold,
      reveal,
      hideControls,
      notify,
      shortcuts,
    }),
    [
      controlsHidden,
      hideControls,
      hold,
      notify,
      reveal,
      shortcuts,
      store,
      variant,
    ]
  )

  return (
    <VideoPlayerContext.Provider value={context}>
      <div
        ref={setRootRef}
        role="region"
        aria-label="Video player"
        tabIndex={-1}
        data-slot="video-player"
        data-variant={variant}
        data-controls={controlsHidden ? "hidden" : "visible"}
        data-fullscreen={fullscreen ? "" : undefined}
        aria-busy={waiting || undefined}
        className={cn(videoPlayerVariants({ variant }), className)}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (
            !shortcuts ||
            event.defaultPrevented ||
            !(event.target instanceof Node) ||
            !event.currentTarget.contains(event.target)
          ) {
            return
          }
          if (runShortcut(event, store.get(), notify)) {
            event.preventDefault()
            if (variant === "overlay") {
              reveal()
            }
          }
        }}
        onPointerMove={(event) => {
          onPointerMove?.(event)
          if (event.pointerType === "mouse" && variant === "overlay") {
            reveal()
          }
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event)
          if (event.pointerType === "mouse" && variant === "overlay") {
            schedule(600)
          }
        }}
        {...props}
      >
        {children}
        <div
          data-slot="video-player-status"
          dir="ltr"
          className="dark pointer-events-none row-start-1 grid place-items-center text-foreground *:col-start-1 *:row-start-1"
        >
          {!error && (
            <span
              aria-hidden
              data-slot="video-player-poster-play"
              data-started={started ? "" : undefined}
              className="grid size-14 place-items-center rounded-full bg-background/60 backdrop-blur-sm transition-[opacity,scale] duration-200 ease-out-quint data-started:opacity-0 motion-safe:data-started:scale-90 motion-reduce:transition-opacity [&_svg]:size-6"
            >
              <IconPlayerPlayFilled />
            </span>
          )}
          {!error && (
            <Spinner
              aria-hidden
              loading={waiting}
              size="xl"
              data-slot="video-player-spinner"
            />
          )}
          {flash && !error && (
            <span
              key={flash.id}
              aria-hidden
              data-slot="video-player-flash"
              data-kind={flash.kind}
              data-side={flash.side}
              className={cn(
                "flex animate-video-player-flash items-center justify-center gap-1.5 rounded-full bg-background/60 font-medium tabular-nums backdrop-blur-sm motion-reduce:[--video-player-flash-from:1] motion-reduce:[--video-player-flash-to:1] [&_svg]:size-6",
                flash.text && flash.kind !== "play" && flash.kind !== "pause"
                  ? "h-11 ps-3 pe-4 text-sm [&_svg]:size-5"
                  : "size-14",
                flash.side === "start" && "ms-[8%] justify-self-start",
                flash.side === "end" && "me-[8%] justify-self-end"
              )}
            >
              <FlashIcon kind={flash.kind} />
              {flash.kind !== "play" && flash.kind !== "pause" && flash.text}
            </span>
          )}
          {captions && caption && !error && (
            <div
              data-slot="video-player-captions"
              data-lifted={
                variant === "overlay" && !controlsHidden ? "" : undefined
              }
              className="mb-3 self-end px-4 text-center text-sm/snug text-foreground transition-[translate] duration-200 ease-out-quint in-data-fullscreen:text-2xl/snug data-lifted:-translate-y-[max(0px,calc(var(--video-player-controls-height,0px)-2rem))] motion-reduce:transition-none @md/video-player:text-base/snug @3xl/video-player:text-xl/snug"
            >
              <span className="rounded-sm bg-background/80 box-decoration-clone px-2 py-0.5 whitespace-pre-line">
                {caption}
              </span>
            </div>
          )}
          {error && (
            <div
              data-slot="video-player-error"
              className="flex max-w-xs flex-col items-center gap-2 px-6 text-center text-sm text-pretty text-muted-foreground [&_svg]:size-6"
            >
              <IconAlertTriangle aria-hidden className="text-foreground" />
              {errorMessage}
            </div>
          )}
        </div>
        <span
          data-slot="video-player-announcer"
          role="status"
          className="sr-only"
        >
          {announcement}
        </span>
        <span data-slot="video-player-alert" role="alert" className="sr-only">
          {error ? errorMessage : ""}
        </span>
      </div>
    </VideoPlayerContext.Provider>
  )
}

function FlashIcon({ kind }: { kind: FlashKind }) {
  switch (kind) {
    case "play":
      return <IconPlayerPlayFilled />
    case "pause":
      return <IconPlayerPauseFilled />
    case "back":
      return <IconChevronsLeft />
    case "forward":
      return <IconChevronsRight />
    case "mute":
      return <IconVolume3 />
    case "volume":
      return <IconVolume />
    case "captions":
      return <IconBadgeCcFilled />
    default:
      return null
  }
}

type VideoPlayerContentProps = useRender.ComponentProps<"video"> & {
  doubleTapSeek?: number | false
}

type Tap = {
  time: number
  side: -1 | 0 | 1
  streak: number
  hiddenBefore: boolean
  playing: boolean
}

const doubleTapWindow = 300

function VideoPlayerContent({
  className,
  render,
  ref,
  autoPlay = false,
  playsInline = true,
  preload = "metadata",
  doubleTapSeek = 10,
  onPointerDown,
  onClick,
  onDoubleClick,
  ...props
}: VideoPlayerContentProps) {
  const { store, videoRef, notify, reveal, hideControls, controlsHidden } =
    useVideoPlayerContext("VideoPlayerContent")
  const pointerTypeRef = React.useRef("mouse")
  const tapRef = React.useRef<Tap | null>(null)

  const attach = React.useCallback(
    (video: HTMLVideoElement | null) => {
      if (!video) {
        return
      }
      videoRef.current = video
      let frame = 0

      const read = () => ({
        paused: video.paused,
        ended: video.ended,
        currentTime: video.currentTime,
        duration: Number.isNaN(video.duration) ? 0 : video.duration,
        volume: video.volume,
        muted: video.muted,
        playbackRate: video.playbackRate,
        buffered: readBuffered(video),
        error: video.error !== null,
      })

      const tick = () => {
        store.set({ currentTime: video.currentTime })
        frame = requestAnimationFrame(tick)
      }
      const startTicking = () => {
        cancelAnimationFrame(frame)
        if (typeof requestAnimationFrame === "function") {
          frame = requestAnimationFrame(tick)
        }
      }
      const stopTicking = () => cancelAnimationFrame(frame)

      const sync = () => store.set(read())
      const handlers: Array<[string, () => void]> = [
        ["loadedmetadata", sync],
        ["durationchange", sync],
        ["timeupdate", sync],
        ["progress", () => store.set({ buffered: readBuffered(video) })],
        ["volumechange", sync],
        ["ratechange", sync],
        ["seeked", sync],
        [
          "play",
          () => {
            store.set({ ...read(), started: true, ended: false })
            startTicking()
          },
        ],
        [
          "playing",
          () => {
            store.set({ ...read(), waiting: false })
            startTicking()
          },
        ],
        [
          "pause",
          () => {
            stopTicking()
            store.set(read())
          },
        ],
        [
          "ended",
          () => {
            stopTicking()
            store.set({ ...read(), ended: true, waiting: false })
          },
        ],
        ["waiting", () => store.set({ waiting: true })],
        ["canplay", () => store.set({ waiting: false })],
        [
          "error",
          () => {
            stopTicking()
            store.set({ ...read(), waiting: false })
          },
        ],
        [
          "emptied",
          () => {
            stopTicking()
            store.set({
              ...read(),
              started: !video.paused,
              waiting: false,
              buffered: 0,
            })
          },
        ],
        ["enterpictureinpicture", () => store.set({ pictureInPicture: true })],
        ["leavepictureinpicture", () => store.set({ pictureInPicture: false })],
      ]
      for (const [type, handler] of handlers) {
        video.addEventListener(type, handler)
      }
      const sourceError = (event: Event) => {
        if (
          event.target instanceof HTMLSourceElement &&
          video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE
        ) {
          store.set({ error: true, waiting: false })
        }
      }
      video.addEventListener("error", sourceError, true)
      const tracks =
        typeof video.textTracks?.addEventListener === "function"
          ? video.textTracks
          : null
      const syncTracks = () => store.syncTracks()
      tracks?.addEventListener("addtrack", syncTracks)
      tracks?.addEventListener("removetrack", syncTracks)
      tracks?.addEventListener("change", syncTracks)
      store.syncTracks()
      store.set({
        ...read(),
        started: !video.paused || video.currentTime > 0,
        error:
          video.error !== null ||
          (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE &&
            video.readyState === HTMLMediaElement.HAVE_NOTHING &&
            video.querySelector("source") !== null),
      })
      if (!video.paused) {
        startTicking()
      }

      return () => {
        stopTicking()
        for (const [type, handler] of handlers) {
          video.removeEventListener(type, handler)
        }
        video.removeEventListener("error", sourceError, true)
        tracks?.removeEventListener("addtrack", syncTracks)
        tracks?.removeEventListener("removetrack", syncTracks)
        tracks?.removeEventListener("change", syncTracks)
        if (videoRef.current === video) {
          videoRef.current = null
          store.syncTracks()
        }
      }
    },
    [store, videoRef]
  )

  const element = useRender({
    defaultTagName: "video",
    render,
    ref: ref ? [attach, ref] : attach,
    props: mergeProps<"video">(
      {
        playsInline,
        preload,
        className: cn(
          "row-start-1 aspect-video size-full bg-black object-contain outline-none focus-visible:outline-hidden in-data-fullscreen:aspect-auto",
          className
        ),
        onPointerDown: (event) => {
          onPointerDown?.(event)
          pointerTypeRef.current = event.pointerType
        },
        onClick: (event) => {
          onClick?.(event)
          if (event.defaultPrevented) {
            return
          }
          const api = store.get()
          if (api.error) {
            return
          }
          const playing = !(api.paused || api.ended)
          if (pointerTypeRef.current === "touch") {
            const now = event.timeStamp
            const rect = event.currentTarget.getBoundingClientRect()
            const ratio =
              rect.width > 0 ? (event.clientX - rect.left) / rect.width : 0.5
            const side = ratio < 1 / 3 ? -1 : ratio > 2 / 3 ? 1 : 0
            const last = tapRef.current
            if (
              doubleTapSeek &&
              side !== 0 &&
              last &&
              last.playing &&
              last.side === side &&
              now - last.time < doubleTapWindow &&
              isSeekable(api.duration)
            ) {
              const streak = last.streak + 1
              tapRef.current = { ...last, time: now, streak }
              api.seekBy(side * doubleTapSeek)
              const total = streak * doubleTapSeek
              notify(
                side < 0 ? "back" : "forward",
                `${side < 0 ? "−" : "+"}${total}s`,
                `${side < 0 ? "Back" : "Forward"} ${total} seconds`,
                side < 0 ? "start" : "end"
              )
              if (last.hiddenBefore) {
                hideControls()
              } else {
                reveal()
              }
              return
            }
            tapRef.current = {
              time: now,
              side,
              streak: 0,
              hiddenBefore: controlsHidden,
              playing,
            }
          }
          if (pointerTypeRef.current === "touch" && playing) {
            if (controlsHidden) {
              reveal()
            } else {
              hideControls()
            }
            return
          }
          const willPlay = api.paused || api.ended
          api.togglePaused()
          notify(willPlay ? "play" : "pause", willPlay ? "Playing" : "Paused")
        },
        onDoubleClick: (event) => {
          onDoubleClick?.(event)
          if (
            !event.defaultPrevented &&
            pointerTypeRef.current !== "touch" &&
            !store.get().error
          ) {
            store.get().toggleFullscreen()
          }
        },
      },
      props,
      { "data-slot": "video-player-content" } as React.ComponentProps<"video">
    ),
  })

  React.useEffect(() => {
    const video = videoRef.current
    if (autoPlay && video && video.paused && !prefersReducedMotion()) {
      ignoreRejection(video.play())
    }
  }, [autoPlay, videoRef])

  return element
}

type VideoPlayerControlsProps = React.ComponentProps<"div"> & {
  tooltips?: boolean
}

function VideoPlayerControls({
  className,
  tooltips = true,
  children,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ref,
  ...props
}: VideoPlayerControlsProps) {
  const { variant, controlsHidden, hold, rootRef } = useVideoPlayerContext(
    "VideoPlayerControls"
  )
  const fullscreen = useVideoPlayerFullscreen()
  const context = React.useMemo(() => ({ tooltips }), [tooltips])
  const measure = React.useCallback((node: HTMLDivElement | null) => {
    const root = node?.closest<HTMLElement>("[data-slot=video-player]")
    if (!node || !root || typeof ResizeObserver === "undefined") {
      return
    }
    const observer = new ResizeObserver(() => {
      root.style.setProperty(
        "--video-player-controls-height",
        `${node.offsetHeight}px`
      )
    })
    observer.observe(node)
    return () => {
      observer.disconnect()
      root.style.removeProperty("--video-player-controls-height")
    }
  }, [])
  const mergedRef = useMergedRef(measure, ref)

  const bar = (
    <div
      ref={mergedRef}
      dir="ltr"
      data-slot="video-player-controls"
      data-variant={variant}
      data-hidden={controlsHidden ? "" : undefined}
      className={cn(
        "z-10 flex min-w-0 flex-wrap items-center gap-0.5 px-2 pb-2 transition-[opacity,translate] duration-200 ease-out-quint motion-reduce:transition-opacity",
        variant === "overlay"
          ? "pointer-events-none row-start-1 self-end bg-linear-to-t from-background/80 via-background/35 to-transparent pt-10 *:pointer-events-auto data-hidden:opacity-0 data-hidden:duration-300 data-hidden:*:pointer-events-none motion-safe:data-hidden:translate-y-1"
          : "row-start-2 pt-1",
        className
      )}
      onPointerEnter={(event) => {
        onPointerEnter?.(event)
        if (event.pointerType === "mouse") {
          hold("pointer", true)
        }
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        hold("pointer", false)
      }}
      onFocus={(event) => {
        onFocus?.(event)
        let visible = false
        try {
          visible = event.target.matches(":focus-visible")
        } catch {
          visible = false
        }
        hold("focus", visible)
      }}
      onBlur={(event) => {
        onBlur?.(event)
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          hold("focus", false)
        }
      }}
      {...props}
    >
      {children}
    </div>
  )

  return (
    <VideoPlayerControlsContext.Provider value={context}>
      {tooltips ? (
        <TooltipGroup
          side="top"
          sideOffset={8}
          portalProps={{ container: fullscreen ? rootRef : undefined }}
        >
          {bar}
        </TooltipGroup>
      ) : (
        bar
      )}
    </VideoPlayerControlsContext.Provider>
  )
}

function useVideoPlayerFullscreen() {
  const { store } = useVideoPlayerContext("VideoPlayerControls")
  return useStoreValue(store, (api) => api.fullscreen)
}

type ControlButtonProps = React.ComponentProps<typeof Button> & {
  label: string
  shortcut?: string
}

function ControlButton({
  label,
  shortcut,
  size = "icon-sm",
  variant = "ghost",
  ...props
}: ControlButtonProps) {
  const controls = React.useContext(VideoPlayerControlsContext)
  const button = (
    <Button variant={variant} size={size} aria-label={label} {...props} />
  )
  if (!controls?.tooltips) {
    return button
  }
  return (
    <TooltipTrigger
      render={button}
      content={
        <>
          {label}
          {shortcut && <Kbd keys={shortcut} size="sm" />}
        </>
      }
    />
  )
}

type VideoPlayerButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "children"
> & {
  children?: React.ReactNode
}

type VideoPlayerPlayButtonProps = VideoPlayerButtonProps & {
  playLabel?: string
  pauseLabel?: string
  replayLabel?: string
}

function VideoPlayerPlayButton({
  playLabel = "Play",
  pauseLabel = "Pause",
  replayLabel = "Replay",
  onClick,
  children,
  ...props
}: VideoPlayerPlayButtonProps) {
  const { store } = useVideoPlayerContext("VideoPlayerPlayButton")
  const paused = useStoreValue(store, (api) => api.paused)
  const ended = useStoreValue(store, (api) => api.ended)
  const error = useStoreValue(store, (api) => api.error)
  const state = ended ? "ended" : paused ? "paused" : "playing"

  return (
    <ControlButton
      data-slot="video-player-play-button"
      data-state={state}
      label={ended ? replayLabel : paused ? playLabel : pauseLabel}
      shortcut="k"
      disabled={error}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          store.get().togglePaused()
        }
      }}
      {...props}
    >
      {children ?? (
        <span
          aria-hidden
          className="grid *:col-start-1 *:row-start-1 *:transition-[opacity,scale] *:duration-200 *:ease-out-quint motion-reduce:*:transition-opacity"
        >
          <IconPlayerPlayFilled
            className={cn(
              state !== "paused" && "opacity-0 motion-safe:scale-50"
            )}
          />
          <IconPlayerPauseFilled
            className={cn(
              state !== "playing" && "opacity-0 motion-safe:scale-50"
            )}
          />
          <IconRotateClockwise
            className={cn(
              state !== "ended" && "opacity-0 motion-safe:scale-50"
            )}
          />
        </span>
      )}
    </ControlButton>
  )
}

const seekIcons: Record<number, [React.ElementType, React.ElementType]> = {
  5: [IconRewindBackward5, IconRewindForward5],
  10: [IconRewindBackward10, IconRewindForward10],
  15: [IconRewindBackward15, IconRewindForward15],
  30: [IconRewindBackward30, IconRewindForward30],
}

type VideoPlayerSeekButtonProps = VideoPlayerButtonProps & {
  offset?: number
  label?: string
}

function VideoPlayerSeekButton({
  offset = 10,
  label,
  className,
  onClick,
  children,
  ...props
}: VideoPlayerSeekButtonProps) {
  const { store, notify } = useVideoPlayerContext("VideoPlayerSeekButton")
  const seekable = useStoreValue(
    store,
    (api) => isSeekable(api.duration) && !api.error
  )
  const amount = Math.abs(offset)
  const backward = offset < 0
  const icons = seekIcons[amount]
  const Icon = icons?.[backward ? 0 : 1] ?? IconRotateClockwise
  const resolvedLabel =
    label ??
    `${backward ? "Back" : "Forward"} ${amount} ${amount === 1 ? "second" : "seconds"}`

  return (
    <ControlButton
      data-slot="video-player-seek-button"
      data-direction={backward ? "backward" : "forward"}
      className={cn("@max-sm/video-player:hidden", className)}
      label={resolvedLabel}
      shortcut={amount === 10 ? (backward ? "j" : "l") : undefined}
      disabled={!seekable}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          store.get().seekBy(offset)
          notify(
            backward ? "back" : "forward",
            `${backward ? "−" : "+"}${amount}s`,
            resolvedLabel
          )
        }
      }}
      {...props}
    >
      {children ?? (
        <Icon
          aria-hidden
          className={cn(!icons && backward && "-scale-x-100")}
        />
      )}
    </ControlButton>
  )
}

type VideoPlayerMuteButtonProps = VideoPlayerButtonProps & {
  muteLabel?: string
  unmuteLabel?: string
}

function VideoPlayerMuteButton({
  muteLabel = "Mute",
  unmuteLabel = "Unmute",
  onClick,
  children,
  ...props
}: VideoPlayerMuteButtonProps) {
  const { store } = useVideoPlayerContext("VideoPlayerMuteButton")
  const level = useStoreValue(store, (api) =>
    api.muted || api.volume === 0 ? "muted" : api.volume < 0.5 ? "low" : "high"
  )

  return (
    <ControlButton
      data-slot="video-player-mute-button"
      data-state={level}
      label={level === "muted" ? unmuteLabel : muteLabel}
      shortcut="m"
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          store.get().toggleMuted()
        }
      }}
      {...props}
    >
      {children ??
        (level === "muted" ? (
          <IconVolume3 aria-hidden />
        ) : level === "low" ? (
          <IconVolume2 aria-hidden />
        ) : (
          <IconVolume aria-hidden />
        ))}
    </ControlButton>
  )
}

type SliderRestProps = Omit<
  SliderPrimitive.Root.Props<number>,
  | "value"
  | "defaultValue"
  | "min"
  | "max"
  | "step"
  | "largeStep"
  | "children"
  | "className"
  | "orientation"
> & {
  className?: string
  label?: string
}

const sliderTrack =
  "relative h-1 w-full rounded-full bg-foreground/20 transition-[height] duration-150 ease-out-quint motion-reduce:transition-none"

const sliderThumb =
  "size-3 rounded-full bg-foreground outline-none focus-visible:outline-hidden group-data-[variant=overlay]/video-player:shadow-sm transition-[scale,box-shadow] duration-150 ease-out-quint has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-foreground/40 motion-reduce:transition-none pointer-coarse:size-4"

const volumeSteps = 0.05

type VideoPlayerSeekBarProps = SliderRestProps

type VideoPlayerVolumeProps = SliderRestProps & {
  muteLabel?: string
  unmuteLabel?: string
}

function VideoPlayerVolume({
  className,
  label = "Volume",
  muteLabel,
  unmuteLabel,
  onValueChange,
  disabled,
  ...props
}: VideoPlayerVolumeProps) {
  const { store } = useVideoPlayerContext("VideoPlayerVolume")
  const volume = useStoreValue(store, (api) => (api.muted ? 0 : api.volume))

  return (
    <div
      data-slot="video-player-volume"
      className={cn("group/volume flex items-center", className)}
    >
      <VideoPlayerMuteButton muteLabel={muteLabel} unmuteLabel={unmuteLabel} />
      <div className="grid w-0 overflow-hidden transition-[width] duration-200 ease-out-quint group-focus-within/volume:w-20 group-hover/volume:w-20 motion-reduce:transition-none pointer-coarse:hidden">
        <SliderPrimitive.Root
          data-slot="video-player-volume-slider"
          value={Math.round(volume * 100)}
          min={0}
          max={100}
          step={1}
          largeStep={10}
          disabled={disabled}
          onValueChange={(value, details) => {
            onValueChange?.(value, details)
            if (!details.isCanceled) {
              store.get().setVolume(value / 100)
            }
          }}
          className="w-20 px-2.5"
          {...props}
        >
          <SliderPrimitive.Control className="flex h-8 w-full touch-none items-center">
            <SliderPrimitive.Track className={sliderTrack}>
              <SliderPrimitive.Indicator className="rounded-full bg-foreground" />
              <SliderPrimitive.Thumb
                aria-label={label}
                getAriaValueText={(_, value) => `${Math.round(value)}%`}
                onKeyDown={(event) => {
                  if (
                    event.key === "ArrowUp" ||
                    event.key === "ArrowRight" ||
                    event.key === "ArrowDown" ||
                    event.key === "ArrowLeft"
                  ) {
                    if (event.shiftKey) {
                      return
                    }
                    event.preventDefault()
                    const up =
                      event.key === "ArrowUp" || event.key === "ArrowRight"
                    const api = store.get()
                    const base = api.muted ? 0 : api.volume
                    api.setVolume(
                      Math.round(
                        (base + (up ? volumeSteps : -volumeSteps)) * 100
                      ) / 100
                    )
                  }
                }}
                className={sliderThumb}
              />
            </SliderPrimitive.Track>
          </SliderPrimitive.Control>
        </SliderPrimitive.Root>
      </div>
    </div>
  )
}

function VideoPlayerSeekBar({
  className,
  label = "Seek",
  onValueChange,
  onValueCommitted,
  disabled,
  ...props
}: VideoPlayerSeekBarProps) {
  const { store, videoRef, hold } = useVideoPlayerContext("VideoPlayerSeekBar")
  const time = useStoreValue(store, (api) =>
    api.scrubbing ? api.scrubTime : api.currentTime
  )
  const duration = useStoreValue(store, (api) => api.duration)
  const buffered = useStoreValue(store, (api) => api.buffered)
  const error = useStoreValue(store, (api) => api.error)
  const seekable = isSeekable(duration) && !error
  const controlRef = React.useRef<HTMLDivElement>(null)
  const previewRef = React.useRef<HTMLSpanElement>(null)

  React.useLayoutEffect(() => {
    controlRef.current?.style.setProperty(
      "--video-player-buffered",
      String(buffered)
    )
  }, [buffered])

  const showPreview = (clientX: number) => {
    const control = controlRef.current
    const preview = previewRef.current
    if (!control || !preview || !seekable) {
      return
    }
    const rect = control.getBoundingClientRect()
    if (rect.width === 0) {
      return
    }
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
    preview.textContent = formatTime(ratio * duration, duration)
    const half = preview.offsetWidth / 2
    const x = clamp(ratio * rect.width, half, Math.max(half, rect.width - half))
    control.style.setProperty("--video-player-hover", String(ratio))
    preview.style.translate = `${x - half}px 0`
    control.setAttribute("data-previewing", "")
  }

  const finishScrub = () => {
    const api = store.get()
    if (api.scrubbing) {
      store.set({ scrubbing: false, currentTime: api.scrubTime })
    }
  }

  return (
    <SliderPrimitive.Root
      dir="ltr"
      data-slot="video-player-seek-bar"
      value={seekable ? clamp(time, 0, duration) : 0}
      min={0}
      max={seekable ? duration : 1}
      step={0.01}
      disabled={disabled || !seekable}
      onValueChange={(value, details) => {
        onValueChange?.(value, details)
        if (details.isCanceled) {
          return
        }
        const video = videoRef.current
        if (!video) {
          return
        }
        if (details.reason === "drag" || details.reason === "track-press") {
          store.set({ scrubbing: true, scrubTime: value, ended: false })
          const fast = (
            video as HTMLVideoElement & {
              fastSeek?: (time: number) => void
            }
          ).fastSeek
          if (details.reason === "drag" && typeof fast === "function") {
            fast.call(video, value)
          } else {
            video.currentTime = value
          }
        } else {
          store.get().seek(value)
        }
      }}
      onValueCommitted={(value, details) => {
        onValueCommitted?.(value, details)
        const video = videoRef.current
        if (video && store.get().scrubbing) {
          video.currentTime = value
          store.set({ currentTime: value })
        }
        finishScrub()
      }}
      className={cn("order-first basis-full px-1", className)}
      {...props}
    >
      <SliderPrimitive.Control
        ref={controlRef}
        data-slot="video-player-seek-bar-control"
        className="group/seek relative flex h-5 w-full touch-none items-center pointer-coarse:h-8"
        onPointerMove={(event) => showPreview(event.clientX)}
        onPointerDown={(event) => {
          showPreview(event.clientX)
          hold("scrub", true)
        }}
        onPointerUp={() => {
          hold("scrub", false)
          finishScrub()
        }}
        onPointerCancel={() => {
          hold("scrub", false)
          finishScrub()
        }}
        onPointerLeave={(event) => {
          if (!event.currentTarget.hasAttribute("data-dragging")) {
            event.currentTarget.removeAttribute("data-previewing")
          }
        }}
        onLostPointerCapture={(event) => {
          hold("scrub", false)
          event.currentTarget.removeAttribute("data-previewing")
        }}
      >
        <SliderPrimitive.Track
          className={cn(
            sliderTrack,
            "group-hover/seek:h-1.5 group-data-dragging/seek:h-1.5"
          )}
        >
          <span
            aria-hidden
            data-slot="video-player-seek-bar-buffered"
            className="absolute inset-y-0 start-0 w-[calc(var(--video-player-buffered,0)*100%)] rounded-full bg-foreground/25"
          />
          <span
            aria-hidden
            data-slot="video-player-seek-bar-hover"
            className="absolute inset-y-0 start-0 w-[calc(var(--video-player-hover,0)*100%)] rounded-full bg-foreground/20 opacity-0 transition-opacity duration-150 group-data-previewing/seek:opacity-100 pointer-coarse:hidden"
          />
          <SliderPrimitive.Indicator
            data-slot="video-player-seek-bar-indicator"
            className="rounded-full bg-foreground"
          />
          <SliderPrimitive.Thumb
            aria-label={label}
            getAriaValueText={(_, value) =>
              `${spokenTime(value)} of ${spokenTime(duration)}`
            }
            onKeyDown={(event) => {
              if (
                event.key === "ArrowLeft" ||
                event.key === "ArrowRight" ||
                event.key === "ArrowUp" ||
                event.key === "ArrowDown" ||
                event.key === "PageUp" ||
                event.key === "PageDown"
              ) {
                event.preventDefault()
                const forward =
                  event.key === "ArrowRight" ||
                  event.key === "ArrowUp" ||
                  event.key === "PageUp"
                const amount =
                  event.shiftKey ||
                  event.key === "PageUp" ||
                  event.key === "PageDown"
                    ? 10
                    : 5
                store.get().seekBy(forward ? amount : -amount)
              }
            }}
            className={cn(
              sliderThumb,
              "scale-0 group-hover/seek:scale-100 group-data-dragging/seek:scale-100 has-[:focus-visible]:scale-100 pointer-coarse:scale-100"
            )}
          />
        </SliderPrimitive.Track>
        <span
          ref={previewRef}
          aria-hidden
          data-slot="video-player-seek-bar-preview"
          className="pointer-events-none absolute start-0 bottom-full mb-1.5 rounded-md bg-foreground px-1.5 py-0.5 text-xs font-medium text-background tabular-nums opacity-0 transition-opacity duration-150 group-data-previewing/seek:opacity-100 pointer-coarse:not-group-data-dragging/seek:opacity-0 pointer-coarse:group-data-dragging/seek:opacity-100"
        />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

type VideoPlayerTimeProps = React.ComponentProps<"span"> & {
  type?: "both" | "elapsed" | "remaining" | "duration"
}

function VideoPlayerTime({
  className,
  type = "both",
  ...props
}: VideoPlayerTimeProps) {
  const { store } = useVideoPlayerContext("VideoPlayerTime")
  const seconds = useStoreValue(store, (api) =>
    Math.floor(api.scrubbing ? api.scrubTime : api.currentTime)
  )
  const duration = useStoreValue(store, (api) => api.duration)
  const known = isSeekable(duration)
  const total = known ? formatTime(duration) : "--:--"
  const elapsed = formatTime(seconds, duration)
  const remaining = known
    ? `-${formatTime(Math.max(0, Math.ceil(duration) - seconds), duration)}`
    : "--:--"

  const text =
    type === "elapsed"
      ? elapsed
      : type === "remaining"
        ? remaining
        : type === "duration"
          ? total
          : `${elapsed} / ${total}`

  return (
    <span
      dir="ltr"
      data-slot="video-player-time"
      data-type={type}
      className={cn(
        "shrink-0 px-1.5 text-xs font-medium whitespace-nowrap text-foreground/90 tabular-nums",
        className
      )}
      {...props}
    >
      {text}
    </span>
  )
}

function VideoPlayerSpacer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      data-slot="video-player-spacer"
      className={cn("flex-1", className)}
      {...props}
    />
  )
}

type VideoPlayerPlaybackRateProps = VideoPlayerButtonProps & {
  rates?: number[]
  label?: string
  normalLabel?: string
}

function VideoPlayerPlaybackRate({
  rates = defaultRates,
  label = "Playback speed",
  normalLabel = "Normal",
  className,
  ...props
}: VideoPlayerPlaybackRateProps) {
  const { store, hold, rootRef } = useVideoPlayerContext(
    "VideoPlayerPlaybackRate"
  )
  const rate = useStoreValue(store, (api) => api.playbackRate)
  const fullscreen = useStoreValue(store, (api) => api.fullscreen)
  const options = React.useMemo(
    () =>
      Array.from(
        new Set(rates.filter((value) => Number.isFinite(value) && value > 0))
      ).sort((a, b) => a - b),
    [rates]
  )

  return (
    <DropdownMenu onOpenChange={(open) => hold("menu", open)}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            aria-label={`${label} ${formatRate(rate)}`}
            data-slot="video-player-playback-rate"
            className={cn("min-w-10 px-2 tabular-nums", className)}
            {...props}
          />
        }
      >
        {formatRate(rate)}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="end"
        sideOffset={8}
        portalProps={{ container: fullscreen ? rootRef : undefined }}
        className="min-w-32"
      >
        <DropdownMenuRadioGroup
          value={String(rate)}
          onValueChange={(value) => store.get().setPlaybackRate(Number(value))}
        >
          {options.map((value) => (
            <DropdownMenuRadioItem
              key={value}
              value={String(value)}
              closeOnClick
              className="tabular-nums"
            >
              {value === 1 ? normalLabel : formatRate(value)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type VideoPlayerCaptionsButtonProps = VideoPlayerButtonProps & {
  label?: string
}

function VideoPlayerCaptionsButton({
  label = "Captions",
  onClick,
  children,
  ...props
}: VideoPlayerCaptionsButtonProps) {
  const { store } = useVideoPlayerContext("VideoPlayerCaptionsButton")
  const available = useStoreValue(store, (api) => api.hasCaptions)
  const active = useStoreValue(store, (api) => api.captions)

  if (!available) {
    return null
  }

  return (
    <ControlButton
      data-slot="video-player-captions-button"
      data-state={active ? "on" : "off"}
      aria-pressed={active}
      label={label}
      shortcut="c"
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          store.get().toggleCaptions()
        }
      }}
      {...props}
    >
      {children ??
        (active ? (
          <IconBadgeCcFilled aria-hidden />
        ) : (
          <IconBadgeCc aria-hidden />
        ))}
    </ControlButton>
  )
}

type VideoPlayerPictureInPictureButtonProps = VideoPlayerButtonProps & {
  enterLabel?: string
  exitLabel?: string
}

function VideoPlayerPictureInPictureButton({
  enterLabel = "Picture in picture",
  exitLabel = "Exit picture in picture",
  onClick,
  children,
  ...props
}: VideoPlayerPictureInPictureButtonProps) {
  const { store } = useVideoPlayerContext("VideoPlayerPictureInPictureButton")
  const supported = useSupport(canPictureInPicture)
  const active = useStoreValue(store, (api) => api.pictureInPicture)
  const error = useStoreValue(store, (api) => api.error)

  if (!supported) {
    return null
  }

  return (
    <ControlButton
      data-slot="video-player-pip-button"
      data-state={active ? "on" : "off"}
      label={active ? exitLabel : enterLabel}
      shortcut="i"
      disabled={error}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          store.get().togglePictureInPicture()
        }
      }}
      {...props}
    >
      {children ??
        (active ? (
          <IconPictureInPictureOff aria-hidden />
        ) : (
          <IconPictureInPictureOn aria-hidden />
        ))}
    </ControlButton>
  )
}

type VideoPlayerFullscreenButtonProps = VideoPlayerButtonProps & {
  enterLabel?: string
  exitLabel?: string
}

function VideoPlayerFullscreenButton({
  enterLabel = "Full screen",
  exitLabel = "Exit full screen",
  onClick,
  children,
  ...props
}: VideoPlayerFullscreenButtonProps) {
  const { store } = useVideoPlayerContext("VideoPlayerFullscreenButton")
  const supported = useSupport(canFullscreen)
  const active = useStoreValue(store, (api) => api.fullscreen)

  if (!supported) {
    return null
  }

  return (
    <ControlButton
      data-slot="video-player-fullscreen-button"
      data-state={active ? "on" : "off"}
      label={active ? exitLabel : enterLabel}
      shortcut="f"
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          store.get().toggleFullscreen()
        }
      }}
      {...props}
    >
      {children ??
        (active ? <IconMinimize aria-hidden /> : <IconMaximize aria-hidden />)}
    </ControlButton>
  )
}

export {
  formatTime,
  useVideoPlayer,
  VideoPlayer,
  VideoPlayerCaptionsButton,
  VideoPlayerContent,
  VideoPlayerControls,
  VideoPlayerFullscreenButton,
  VideoPlayerMuteButton,
  VideoPlayerPictureInPictureButton,
  VideoPlayerPlaybackRate,
  VideoPlayerPlayButton,
  VideoPlayerSeekBar,
  VideoPlayerSeekButton,
  VideoPlayerSpacer,
  VideoPlayerTime,
  VideoPlayerVolume,
  videoPlayerVariants,
}
export type {
  VideoPlayerActions,
  VideoPlayerApi,
  VideoPlayerCaptionsButtonProps,
  VideoPlayerContentProps,
  VideoPlayerControlsProps,
  VideoPlayerMediaState,
  VideoPlayerProps,
  VideoPlayerSeekBarProps,
  VideoPlayerVariant,
  VideoPlayerVolumeProps,
}
