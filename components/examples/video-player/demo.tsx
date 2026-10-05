import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControls,
  VideoPlayerFullscreenButton,
  VideoPlayerPictureInPictureButton,
  VideoPlayerPlaybackRate,
  VideoPlayerPlayButton,
  VideoPlayerSeekBar,
  VideoPlayerSeekButton,
  VideoPlayerSpacer,
  VideoPlayerTime,
  VideoPlayerVolume,
} from "@/components/ui/video-player"

export function VideoPlayerDemo() {
  return (
    <VideoPlayer className="max-w-2xl">
      <VideoPlayerContent
        poster="https://media.w3.org/2010/05/sintel/poster.png"
        aria-label="Sintel trailer"
      >
        <source
          src="https://media.w3.org/2010/05/sintel/trailer.webm"
          type="video/webm"
        />
        <source
          src="https://media.w3.org/2010/05/sintel/trailer.mp4"
          type="video/mp4"
        />
      </VideoPlayerContent>
      <VideoPlayerControls>
        <VideoPlayerSeekBar />
        <VideoPlayerPlayButton />
        <VideoPlayerSeekButton offset={-10} />
        <VideoPlayerSeekButton offset={10} />
        <VideoPlayerVolume />
        <VideoPlayerTime />
        <VideoPlayerSpacer />
        <VideoPlayerPlaybackRate />
        <VideoPlayerPictureInPictureButton />
        <VideoPlayerFullscreenButton />
      </VideoPlayerControls>
    </VideoPlayer>
  )
}
