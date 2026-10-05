import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControls,
  VideoPlayerFullscreenButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBar,
  VideoPlayerSpacer,
  VideoPlayerTime,
} from "@/components/ui/video-player"

export function VideoPlayerMinimal() {
  return (
    <VideoPlayer className="max-w-md">
      <VideoPlayerContent
        src="https://media.w3.org/2010/05/sintel/trailer.mp4"
        poster="https://media.w3.org/2010/05/sintel/poster.png"
        aria-label="Sintel trailer"
      />
      <VideoPlayerControls tooltips={false}>
        <VideoPlayerSeekBar />
        <VideoPlayerPlayButton />
        <VideoPlayerTime type="remaining" />
        <VideoPlayerSpacer />
        <VideoPlayerFullscreenButton />
      </VideoPlayerControls>
    </VideoPlayer>
  )
}
