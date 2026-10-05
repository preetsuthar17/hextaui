import { Kbd } from "@/components/ui/kbd"
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControls,
  VideoPlayerFullscreenButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBar,
  VideoPlayerSpacer,
  VideoPlayerTime,
  VideoPlayerVolume,
} from "@/components/ui/video-player"

export function VideoPlayerGlobalShortcuts() {
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-3">
      <VideoPlayer globalShortcuts>
        <VideoPlayerContent
          src="https://media.w3.org/2010/05/sintel/trailer.mp4"
          poster="https://media.w3.org/2010/05/sintel/poster.png"
          aria-label="Sintel trailer"
        />
        <VideoPlayerControls>
          <VideoPlayerSeekBar />
          <VideoPlayerPlayButton />
          <VideoPlayerVolume />
          <VideoPlayerTime />
          <VideoPlayerSpacer />
          <VideoPlayerFullscreenButton />
        </VideoPlayerControls>
      </VideoPlayer>
      <p className="text-sm text-muted-foreground">
        Press <Kbd keys="k" /> anywhere on the page to play or pause.
      </p>
    </div>
  )
}
