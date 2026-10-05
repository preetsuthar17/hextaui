import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControls,
  VideoPlayerPlaybackRate,
  VideoPlayerPlayButton,
  VideoPlayerSeekBar,
  VideoPlayerSeekButton,
  VideoPlayerSpacer,
  VideoPlayerTime,
} from "@/components/ui/video-player"

export function VideoPlayerSeekOffsets() {
  return (
    <VideoPlayer className="max-w-xl">
      <VideoPlayerContent
        src="https://media.w3.org/2010/05/sintel/trailer.mp4"
        poster="https://media.w3.org/2010/05/sintel/poster.png"
        aria-label="Sintel trailer"
      />
      <VideoPlayerControls>
        <VideoPlayerSeekBar />
        <VideoPlayerSeekButton offset={-15} />
        <VideoPlayerPlayButton />
        <VideoPlayerSeekButton offset={30} />
        <VideoPlayerTime />
        <VideoPlayerSpacer />
        <VideoPlayerPlaybackRate rates={[1, 1.5, 2, 3]} />
      </VideoPlayerControls>
    </VideoPlayer>
  )
}
