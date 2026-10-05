"use client"

import { Button } from "@/components/ui/button"
import {
  formatTime,
  useVideoPlayer,
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControls,
  VideoPlayerPlayButton,
  VideoPlayerSeekBar,
  VideoPlayerTime,
} from "@/components/ui/video-player"

const chapters = [
  { title: "The cave", time: 0 },
  { title: "Searching", time: 13 },
  { title: "The dragon", time: 31 },
]

function Chapters() {
  const seek = useVideoPlayer((player) => player.seek)
  const play = useVideoPlayer((player) => player.play)
  const currentTime = useVideoPlayer((player) => Math.floor(player.currentTime))
  const active = chapters.findLast((chapter) => chapter.time <= currentTime)

  return (
    <div className="flex flex-wrap gap-2">
      {chapters.map((chapter) => (
        <Button
          key={chapter.title}
          variant={chapter === active ? "secondary" : "outline"}
          size="sm"
          aria-pressed={chapter === active}
          onClick={() => {
            seek(chapter.time)
            play()
          }}
        >
          <span className="tabular-nums">{formatTime(chapter.time)}</span>
          {chapter.title}
        </Button>
      ))}
    </div>
  )
}

export function VideoPlayerCustomControls() {
  return (
    <VideoPlayer variant="bar" className="max-w-xl">
      <VideoPlayerContent
        src="https://media.w3.org/2010/05/sintel/trailer.mp4"
        poster="https://media.w3.org/2010/05/sintel/poster.png"
        aria-label="Sintel trailer"
      />
      <VideoPlayerControls>
        <VideoPlayerSeekBar />
        <VideoPlayerPlayButton />
        <VideoPlayerTime />
        <div className="basis-full px-1 pt-1">
          <Chapters />
        </div>
      </VideoPlayerControls>
    </VideoPlayer>
  )
}
