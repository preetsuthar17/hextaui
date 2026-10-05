import {
  VideoPlayer,
  VideoPlayerCaptionsButton,
  VideoPlayerContent,
  VideoPlayerControls,
  VideoPlayerFullscreenButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBar,
  VideoPlayerSpacer,
  VideoPlayerTime,
  VideoPlayerVolume,
} from "@/components/ui/video-player"

export function VideoPlayerCaptions() {
  return (
    <VideoPlayer className="max-w-xl">
      <VideoPlayerContent
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4"
        crossOrigin="anonymous"
        aria-label="Friday"
      >
        <track
          default
          kind="captions"
          srcLang="en"
          label="English"
          src="https://interactive-examples.mdn.mozilla.net/media/examples/friday.vtt"
        />
      </VideoPlayerContent>
      <VideoPlayerControls>
        <VideoPlayerSeekBar />
        <VideoPlayerPlayButton />
        <VideoPlayerVolume />
        <VideoPlayerTime />
        <VideoPlayerSpacer />
        <VideoPlayerCaptionsButton />
        <VideoPlayerFullscreenButton />
      </VideoPlayerControls>
    </VideoPlayer>
  )
}
