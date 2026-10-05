import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  formatTime,
  useVideoPlayer,
  VideoPlayer,
  VideoPlayerCaptionsButton,
  VideoPlayerContent,
  VideoPlayerControls,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBar,
  VideoPlayerSeekButton,
  VideoPlayerTime,
  VideoPlayerVolume,
} from "./video-player"

type MediaState = {
  paused: boolean
  currentTime: number
  duration: number
  volume: number
  muted: boolean
  playbackRate: number
  error: MediaError | null
}

const media = new WeakMap<HTMLMediaElement, MediaState>()

function state(element: HTMLMediaElement) {
  let value = media.get(element)
  if (!value) {
    value = {
      paused: true,
      currentTime: 0,
      duration: Number.NaN,
      volume: 1,
      muted: false,
      playbackRate: 1,
      error: null,
    }
    media.set(element, value)
  }
  return value
}

function accessor<K extends keyof MediaState>(key: K, event?: string) {
  return {
    configurable: true,
    get(this: HTMLMediaElement) {
      return state(this)[key]
    },
    set(this: HTMLMediaElement, value: MediaState[K]) {
      state(this)[key] = value
      if (event) {
        this.dispatchEvent(new Event(event))
      }
    },
  }
}

const original = new Map<string, PropertyDescriptor | undefined>()
const keys = [
  "paused",
  "currentTime",
  "duration",
  "volume",
  "muted",
  "playbackRate",
  "error",
  "play",
  "pause",
  "ended",
  "textTracks",
] as const

class FakeTrack extends EventTarget {
  mode: TextTrackMode = "disabled"
  activeCues: Array<{ text: string }> = []
  constructor(
    public kind: string,
    public language: string
  ) {
    super()
  }
}

class FakeTrackList extends EventTarget {
  [index: number]: FakeTrack
  length = 0
  add(track: FakeTrack) {
    this[this.length] = track
    this.length++
    this.dispatchEvent(new Event("addtrack"))
  }
}

const trackLists = new WeakMap<HTMLMediaElement, FakeTrackList>()

function tracksOf(element: HTMLMediaElement) {
  let list = trackLists.get(element)
  if (!list) {
    list = new FakeTrackList()
    trackLists.set(element, list)
  }
  return list
}

beforeEach(() => {
  for (const key of keys) {
    original.set(
      key,
      Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, key)
    )
  }
  Object.defineProperties(HTMLMediaElement.prototype, {
    paused: accessor("paused"),
    currentTime: accessor("currentTime", "timeupdate"),
    duration: accessor("duration", "durationchange"),
    volume: accessor("volume", "volumechange"),
    muted: accessor("muted", "volumechange"),
    playbackRate: accessor("playbackRate", "ratechange"),
    error: accessor("error"),
    textTracks: {
      configurable: true,
      get(this: HTMLMediaElement) {
        return tracksOf(this)
      },
    },
    ended: {
      configurable: true,
      get(this: HTMLMediaElement) {
        return false
      },
    },
    play: {
      configurable: true,
      value(this: HTMLMediaElement) {
        state(this).paused = false
        this.dispatchEvent(new Event("play"))
        return Promise.resolve()
      },
    },
    pause: {
      configurable: true,
      value(this: HTMLMediaElement) {
        state(this).paused = true
        this.dispatchEvent(new Event("pause"))
      },
    },
  })
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  for (const [key, descriptor] of original) {
    if (descriptor) {
      Object.defineProperty(HTMLMediaElement.prototype, key, descriptor)
    } else {
      delete (HTMLMediaElement.prototype as unknown as Record<string, unknown>)[
        key
      ]
    }
  }
})

function Player(props: React.ComponentProps<typeof VideoPlayer>) {
  return (
    <VideoPlayer {...props}>
      <VideoPlayerContent src="/video.mp4" />
      <VideoPlayerControls tooltips={false}>
        <VideoPlayerSeekBar />
        <VideoPlayerPlayButton />
        <VideoPlayerSeekButton offset={-10} />
        <VideoPlayerVolume />
        <VideoPlayerTime />
      </VideoPlayerControls>
    </VideoPlayer>
  )
}

function video() {
  return document.querySelector("video") as HTMLVideoElement
}

function root() {
  return document.querySelector("[data-slot=video-player]") as HTMLElement
}

function load(duration = 120) {
  act(() => {
    ;(video() as unknown as { duration: number }).duration = duration
  })
}

describe("formatTime", () => {
  it("formats minutes, hours and bad input", () => {
    expect(formatTime(0)).toBe("0:00")
    expect(formatTime(65.9)).toBe("1:05")
    expect(formatTime(3725)).toBe("1:02:05")
    expect(formatTime(5, 4000)).toBe("0:00:05")
    expect(formatTime(Number.NaN)).toBe("0:00")
    expect(formatTime(-4)).toBe("0:00")
    expect(formatTime(Infinity)).toBe("0:00")
  })
})

describe("VideoPlayer", () => {
  it("throws a clear error outside the root", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<VideoPlayerPlayButton />)).toThrow(
      "VideoPlayerPlayButton must be used within <VideoPlayer>."
    )
    spy.mockRestore()
  })

  it("plays and pauses from the button with a state-following name", () => {
    render(<Player />)
    load()
    const button = screen.getByRole("button", { name: "Play" })
    fireEvent.click(button)
    expect(video().paused).toBe(false)
    expect(button.getAttribute("aria-label")).toBe("Pause")
    expect(button.dataset.state).toBe("playing")
    fireEvent.click(button)
    expect(video().paused).toBe(true)
  })

  it("honours preventDefault in a user click handler", () => {
    render(
      <VideoPlayer>
        <VideoPlayerContent />
        <VideoPlayerPlayButton onClick={(event) => event.preventDefault()} />
      </VideoPlayer>
    )
    fireEvent.click(screen.getByRole("button", { name: "Play" }))
    expect(video().paused).toBe(true)
  })

  it("runs shortcuts while focus is inside the player", () => {
    render(<Player />)
    load()
    const player = root()
    fireEvent.keyDown(player, { key: "k" })
    expect(video().paused).toBe(false)
    fireEvent.keyDown(player, { key: "l" })
    expect(video().currentTime).toBe(10)
    fireEvent.keyDown(player, { key: "ArrowLeft" })
    expect(video().currentTime).toBe(5)
    fireEvent.keyDown(player, { key: "j" })
    expect(video().currentTime).toBe(0)
    fireEvent.keyDown(player, { key: "5" })
    expect(video().currentTime).toBe(60)
    fireEvent.keyDown(player, { key: "End" })
    expect(video().currentTime).toBe(120)
    fireEvent.keyDown(player, { key: "ArrowDown" })
    expect(video().volume).toBe(0.95)
    fireEvent.keyDown(player, { key: "m" })
    expect(video().muted).toBe(true)
    fireEvent.keyDown(player, { key: ">", shiftKey: true })
    expect(video().playbackRate).toBe(1.25)
    fireEvent.keyDown(player, { key: "<", shiftKey: true })
    fireEvent.keyDown(player, { key: "<", shiftKey: true })
    expect(video().playbackRate).toBe(0.75)
  })

  it("announces shortcut results politely", () => {
    render(<Player />)
    load()
    fireEvent.keyDown(root(), { key: "ArrowDown" })
    expect(
      document.querySelector("[data-slot=video-player-announcer]")?.textContent
    ).toBe("Volume 95%")
  })

  it("leaves modified keys, buttons and text fields alone", () => {
    render(
      <VideoPlayer>
        <VideoPlayerContent />
        <input aria-label="Comment" />
        <VideoPlayerPlayButton />
      </VideoPlayer>
    )
    load()
    const input = screen.getByRole("textbox")
    const typed = fireEvent.keyDown(input, { key: "k" })
    expect(typed).toBe(true)
    expect(video().paused).toBe(true)
    fireEvent.keyDown(root(), { key: "l", metaKey: true })
    expect(video().currentTime).toBe(0)
    const space = fireEvent.keyDown(
      screen.getByRole("button", { name: "Play" }),
      { key: " " }
    )
    expect(space).toBe(true)
    expect(video().paused).toBe(true)
  })

  it("does nothing with shortcuts off", () => {
    render(<Player shortcuts={false} />)
    load()
    fireEvent.keyDown(root(), { key: "k" })
    expect(video().paused).toBe(true)
  })

  it("listens on the page only with globalShortcuts", () => {
    const { unmount } = render(<Player />)
    load()
    fireEvent.keyDown(document.body, { key: "k" })
    expect(video().paused).toBe(true)
    unmount()

    render(
      <>
        <input aria-label="Search" />
        <Player globalShortcuts />
      </>
    )
    load()
    fireEvent.keyDown(document.body, { key: "k" })
    expect(video().paused).toBe(false)
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "k" })
    expect(video().paused).toBe(false)
    fireEvent.keyDown(document.body, { key: "k" })
    expect(video().paused).toBe(true)
  })

  it("does not double-handle a shortcut from inside the player in global mode", () => {
    render(<Player globalShortcuts />)
    load()
    fireEvent.keyDown(root(), { key: "k" })
    expect(video().paused).toBe(false)
  })

  it("removes the page listener on unmount", () => {
    const { unmount } = render(<Player globalShortcuts />)
    load()
    const element = video()
    unmount()
    fireEvent.keyDown(document.body, { key: "k" })
    expect(element.paused).toBe(true)
  })

  it("seeks 5 seconds per arrow on the seek bar and 10 with Shift", () => {
    render(<Player />)
    load()
    const slider = screen.getByRole("slider", { name: "Seek" })
    fireEvent.keyDown(slider, { key: "ArrowRight" })
    expect(video().currentTime).toBe(5)
    fireEvent.keyDown(slider, { key: "ArrowRight", shiftKey: true })
    expect(video().currentTime).toBe(15)
    fireEvent.keyDown(slider, { key: "ArrowLeft" })
    expect(video().currentTime).toBe(10)
    expect(slider.getAttribute("aria-valuetext")).toBe(
      "10 seconds of 2 minutes"
    )
  })

  it("changes volume from its slider without seeking", () => {
    render(<Player />)
    load()
    const slider = screen.getByRole("slider", { name: "Volume" })
    fireEvent.keyDown(slider, { key: "ArrowDown" })
    expect(video().volume).toBe(0.95)
    expect(video().currentTime).toBe(0)
  })

  it("unmutes to half volume when the volume was zero", () => {
    render(<Player />)
    load()
    act(() => {
      video().volume = 0
      video().muted = true
    })
    const mute = screen.getByRole("button", { name: "Unmute" })
    expect(mute.dataset.state).toBe("muted")
    fireEvent.click(mute)
    expect(video().muted).toBe(false)
    expect(video().volume).toBe(0.5)
  })

  it("disables seeking until the duration is known", () => {
    render(<Player />)
    expect(
      (
        screen.getByRole("button", {
          name: "Back 10 seconds",
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
    expect(screen.getByText("0:00 / --:--")).toBeTruthy()
    fireEvent.keyDown(root(), { key: "l" })
    expect(video().currentTime).toBe(0)
    load(90)
    expect(
      (
        screen.getByRole("button", {
          name: "Back 10 seconds",
        }) as HTMLButtonElement
      ).disabled
    ).toBe(false)
    expect(screen.getByText("0:00 / 1:30")).toBeTruthy()
  })

  it("clamps seeks to the video", () => {
    render(<Player />)
    load(30)
    fireEvent.click(screen.getByRole("button", { name: "Back 10 seconds" }))
    expect(video().currentTime).toBe(0)
    fireEvent.keyDown(root(), { key: "l" })
    fireEvent.keyDown(root(), { key: "l" })
    fireEvent.keyDown(root(), { key: "l" })
    fireEvent.keyDown(root(), { key: "l" })
    expect(video().currentTime).toBe(30)
  })

  it("hides overlay controls after idle playback and shows them on pause", () => {
    vi.useFakeTimers()
    render(<Player />)
    load()
    fireEvent.click(screen.getByRole("button", { name: "Play" }))
    fireEvent.pointerMove(root(), { pointerType: "mouse" })
    act(() => {
      vi.advanceTimersByTime(2400)
    })
    expect(root().dataset.controls).toBe("visible")
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(root().dataset.controls).toBe("hidden")
    fireEvent.pointerMove(root(), { pointerType: "mouse" })
    expect(root().dataset.controls).toBe("visible")
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(root().dataset.controls).toBe("hidden")
    act(() => {
      video().pause()
    })
    expect(root().dataset.controls).toBe("visible")
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(root().dataset.controls).toBe("visible")
  })

  it("keeps controls while the pointer is over them", () => {
    vi.useFakeTimers()
    render(<Player />)
    load()
    fireEvent.click(screen.getByRole("button", { name: "Play" }))
    const controls = document.querySelector(
      "[data-slot=video-player-controls]"
    ) as HTMLElement
    fireEvent.pointerEnter(controls, { pointerType: "mouse" })
    act(() => {
      vi.advanceTimersByTime(6000)
    })
    expect(root().dataset.controls).toBe("visible")
    fireEvent.pointerLeave(controls, { pointerType: "mouse" })
    act(() => {
      vi.advanceTimersByTime(2600)
    })
    expect(root().dataset.controls).toBe("hidden")
  })

  it("never hides controls in the bar variant", () => {
    vi.useFakeTimers()
    render(<Player variant="bar" />)
    load()
    fireEvent.click(screen.getByRole("button", { name: "Play" }))
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    expect(root().dataset.controls).toBe("visible")
  })

  it("toggles playback on video click and controls on touch tap", () => {
    vi.useFakeTimers()
    render(<Player />)
    load()
    const element = video()
    fireEvent.pointerDown(element, { pointerType: "mouse" })
    fireEvent.click(element)
    expect(element.paused).toBe(false)
    fireEvent.pointerDown(element, { pointerType: "touch" })
    fireEvent.click(element)
    expect(element.paused).toBe(false)
    expect(root().dataset.controls).toBe("hidden")
    fireEvent.pointerDown(element, { pointerType: "touch" })
    fireEvent.click(element)
    expect(root().dataset.controls).toBe("visible")
  })

  it("shows the error, alerts and disables play", () => {
    render(<Player errorMessage="Nope" />)
    act(() => {
      ;(video() as unknown as { error: unknown }).error = { code: 4 }
      video().dispatchEvent(new Event("error"))
    })
    expect(screen.getByRole("alert").textContent).toBe("Nope")
    expect(
      (screen.getByRole("button", { name: "Play" }) as HTMLButtonElement)
        .disabled
    ).toBe(true)
    fireEvent.keyDown(root(), { key: "l" })
    expect(video().currentTime).toBe(0)
  })

  it("lets custom controls select state and actions", () => {
    let renders = 0
    function Readout() {
      renders++
      const paused = useVideoPlayer((player) => player.paused)
      const toggle = useVideoPlayer((player) => player.togglePaused)
      return (
        <button type="button" onClick={toggle}>
          {paused ? "Custom play" : "Custom pause"}
        </button>
      )
    }
    render(
      <VideoPlayer>
        <VideoPlayerContent />
        <Readout />
      </VideoPlayer>
    )
    load()
    const before = renders
    act(() => {
      video().currentTime = 12
      video().volume = 0.3
    })
    expect(renders).toBe(before)
    fireEvent.click(screen.getByRole("button", { name: "Custom play" }))
    expect(screen.getByRole("button", { name: "Custom pause" })).toBeTruthy()
  })

  it("composes the user's root key handler and respects preventDefault", () => {
    render(<Player onKeyDown={(event) => event.preventDefault()} />)
    load()
    fireEvent.keyDown(root(), { key: "k" })
    expect(video().paused).toBe(true)
  })

  it("forwards refs to the root and the video", () => {
    const rootRef = React.createRef<HTMLDivElement>()
    const videoRef = React.createRef<HTMLVideoElement>()
    render(
      <VideoPlayer ref={rootRef}>
        <VideoPlayerContent ref={videoRef} />
      </VideoPlayer>
    )
    expect(rootRef.current?.dataset.slot).toBe("video-player")
    expect(videoRef.current?.tagName).toBe("VIDEO")
  })

  it("passes labels through for translation", () => {
    render(
      <VideoPlayer>
        <VideoPlayerContent />
        <VideoPlayerControls tooltips={false}>
          <VideoPlayerPlayButton playLabel="تشغيل" />
          <VideoPlayerMuteButton muteLabel="كتم الصوت" />
          <VideoPlayerSeekBar label="تقديم" />
        </VideoPlayerControls>
      </VideoPlayer>
    )
    expect(screen.getByRole("button", { name: "تشغيل" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "كتم الصوت" })).toBeTruthy()
    expect(screen.getByRole("slider", { name: "تقديم" })).toBeTruthy()
  })

  it("cleans up timers and listeners on unmount mid-flash", () => {
    vi.useFakeTimers()
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    const { unmount } = render(<Player />)
    load()
    fireEvent.keyDown(root(), { key: "k" })
    unmount()
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it("seeks on a double tap at either side and adds up repeated taps", () => {
    render(<Player />)
    load()
    const element = video()
    element.getBoundingClientRect = () =>
      DOMRect.fromRect({ x: 0, y: 0, width: 300, height: 170 })
    fireEvent.click(screen.getByRole("button", { name: "Play" }))
    const tap = (clientX: number) => {
      fireEvent.pointerDown(element, { pointerType: "touch" })
      fireEvent.click(element, { clientX })
    }
    tap(280)
    expect(root().dataset.controls).toBe("hidden")
    tap(280)
    expect(element.currentTime).toBe(10)
    expect(root().dataset.controls).toBe("visible")
    tap(280)
    expect(element.currentTime).toBe(20)
    const flash = document.querySelector(
      "[data-slot=video-player-flash]"
    ) as HTMLElement
    expect(flash.textContent).toBe("+20s")
    expect(flash.dataset.side).toBe("end")
    tap(20)
    expect(element.currentTime).toBe(20)
    tap(20)
    expect(element.currentTime).toBe(10)
    expect(
      document.querySelector("[data-slot=video-player-announcer]")?.textContent
    ).toBe("Back 10 seconds")
    expect(element.paused).toBe(false)
  })

  it("does not seek on a double tap in the middle, while paused or when turned off", () => {
    const { unmount } = render(<Player />)
    load()
    let element = video()
    element.getBoundingClientRect = () =>
      DOMRect.fromRect({ x: 0, y: 0, width: 300, height: 170 })
    const tap = (clientX: number) => {
      fireEvent.pointerDown(element, { pointerType: "touch" })
      fireEvent.click(element, { clientX })
    }
    tap(280)
    tap(280)
    expect(element.paused).toBe(false)
    expect(element.currentTime).toBe(0)
    tap(150)
    tap(150)
    expect(element.currentTime).toBe(0)
    unmount()

    render(
      <VideoPlayer>
        <VideoPlayerContent doubleTapSeek={false} />
      </VideoPlayer>
    )
    load()
    element = video()
    element.getBoundingClientRect = () =>
      DOMRect.fromRect({ x: 0, y: 0, width: 300, height: 170 })
    element.play()
    tap(280)
    tap(280)
    expect(element.currentTime).toBe(0)
  })

  it("toggles captions and renders cues in its own layer", () => {
    render(
      <VideoPlayer>
        <VideoPlayerContent />
        <VideoPlayerControls tooltips={false}>
          <VideoPlayerCaptionsButton />
        </VideoPlayerControls>
      </VideoPlayer>
    )
    expect(screen.queryByRole("button", { name: "Captions" })).toBeNull()
    const english = new FakeTrack("subtitles", "en")
    act(() => {
      tracksOf(video()).add(new FakeTrack("metadata", "en"))
      tracksOf(video()).add(english)
    })
    const button = screen.getByRole("button", { name: "Captions" })
    expect(button.getAttribute("aria-pressed")).toBe("false")
    fireEvent.click(button)
    expect(english.mode).toBe("hidden")
    expect(button.getAttribute("aria-pressed")).toBe("true")
    act(() => {
      english.activeCues = [{ text: "<i>Hildy!</i>" }, { text: "How are you?" }]
      english.dispatchEvent(new Event("cuechange"))
    })
    const layer = document.querySelector(
      "[data-slot=video-player-captions]"
    ) as HTMLElement
    expect(layer.textContent).toBe("Hildy!\nHow are you?")
    expect(layer.hasAttribute("data-lifted")).toBe(true)
    fireEvent.keyDown(root(), { key: "c" })
    expect(english.mode).toBe("disabled")
    expect(button.getAttribute("aria-pressed")).toBe("false")
    expect(
      document.querySelector("[data-slot=video-player-captions]")
    ).toBeNull()
    fireEvent.keyDown(root(), { key: "c" })
    expect(english.mode).toBe("hidden")
  })

  it("takes over a track the browser shows by default", () => {
    render(
      <VideoPlayer>
        <VideoPlayerContent />
        <VideoPlayerCaptionsButton />
      </VideoPlayer>
    )
    const track = new FakeTrack("captions", "de")
    act(() => {
      tracksOf(video()).add(track)
      track.mode = "showing"
      tracksOf(video()).dispatchEvent(new Event("change"))
    })
    expect(track.mode).toBe("hidden")
    expect(
      screen
        .getByRole("button", { name: "Captions" })
        .getAttribute("aria-pressed")
    ).toBe("true")
  })

  it("keeps captions on when the same video re-attaches", () => {
    const view = (ref: React.Ref<HTMLVideoElement>) => (
      <VideoPlayer>
        <VideoPlayerContent ref={ref} />
        <VideoPlayerCaptionsButton />
      </VideoPlayer>
    )
    const { rerender } = render(view(() => {}))
    const track = new FakeTrack("captions", "en")
    act(() => {
      tracksOf(video()).add(track)
    })
    fireEvent.click(screen.getByRole("button", { name: "Captions" }))
    rerender(view(() => {}))
    expect(track.mode).toBe("hidden")
    expect(
      screen
        .getByRole("button", { name: "Captions" })
        .getAttribute("aria-pressed")
    ).toBe("true")
  })

  it("hydrates without warnings", async () => {
    const html = renderToString(<Player />)
    const container = document.createElement("div")
    container.innerHTML = html
    document.body.appendChild(container)
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    ;(
      globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true
    let rootHandle: ReturnType<typeof hydrateRoot> | undefined
    await act(async () => {
      rootHandle = hydrateRoot(container, <Player />)
    })
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
    act(() => rootHandle?.unmount())
    container.remove()
  })
})
