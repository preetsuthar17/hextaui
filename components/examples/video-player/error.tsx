import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControls,
  VideoPlayerPlayButton,
  VideoPlayerSeekBar,
  VideoPlayerTime,
} from "@/components/ui/video-player"

export function VideoPlayerError() {
  return (
    <VideoPlayer
      className="max-w-md"
      errorMessage="We couldn’t load this video. Check your connection and try again."
    >
      <VideoPlayerContent
        src="https://media.w3.org/2010/05/sintel/missing.mp4"
        aria-label="Missing video"
      />
      <VideoPlayerControls>
        <VideoPlayerSeekBar />
        <VideoPlayerPlayButton />
        <VideoPlayerTime />
      </VideoPlayerControls>
    </VideoPlayer>
  )
}
