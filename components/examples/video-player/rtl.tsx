import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControls,
  VideoPlayerFullscreenButton,
  VideoPlayerPlaybackRate,
  VideoPlayerPlayButton,
  VideoPlayerSeekBar,
  VideoPlayerSpacer,
  VideoPlayerTime,
  VideoPlayerVolume,
} from "@/components/ui/video-player"

export function VideoPlayerRtl() {
  return (
    <div dir="rtl" className="w-full max-w-xl">
      <VideoPlayer aria-label="مشغل الفيديو">
        <VideoPlayerContent
          src="https://media.w3.org/2010/05/sintel/trailer.mp4"
          poster="https://media.w3.org/2010/05/sintel/poster.png"
          aria-label="إعلان سينتل"
        />
        <VideoPlayerControls>
          <VideoPlayerSeekBar label="تقديم" />
          <VideoPlayerPlayButton
            playLabel="تشغيل"
            pauseLabel="إيقاف مؤقت"
            replayLabel="إعادة التشغيل"
          />
          <VideoPlayerVolume
            label="مستوى الصوت"
            muteLabel="كتم الصوت"
            unmuteLabel="إلغاء كتم الصوت"
          />
          <VideoPlayerTime />
          <VideoPlayerSpacer />
          <VideoPlayerPlaybackRate label="سرعة التشغيل" normalLabel="عادي" />
          <VideoPlayerFullscreenButton
            enterLabel="ملء الشاشة"
            exitLabel="الخروج من ملء الشاشة"
          />
        </VideoPlayerControls>
      </VideoPlayer>
    </div>
  )
}
