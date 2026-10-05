"use client"

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

function VideoCard() {
  return (
    <VideoPlayer>
      <VideoPlayerContent
        preload="none"
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
        <VideoPlayerVolume />
        <VideoPlayerTime />
        <VideoPlayerSpacer />
        <VideoPlayerFullscreenButton />
      </VideoPlayerControls>
    </VideoPlayer>
  )
}

export { VideoCard }
