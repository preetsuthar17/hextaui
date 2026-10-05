import { DocsCodeBlock } from "@/components/docs/docs-code-block"
import { DocsComponentPage } from "@/components/docs/docs-component-page"
import {
  DocsCode,
  DocsList,
  DocsParagraph,
  DocsSection,
} from "@/components/docs/docs-content"
import { DocsExample } from "@/components/docs/docs-example"
import { DocsInstall } from "@/components/docs/docs-install"
import {
  DocsAttributesTable,
  DocsKeyboardTable,
  DocsPropsTable,
} from "@/components/docs/docs-props-table"
import { VideoPlayerBar } from "@/components/examples/video-player/bar"
import { VideoPlayerCaptions } from "@/components/examples/video-player/captions"
import { VideoPlayerCustomControls } from "@/components/examples/video-player/custom-controls"
import { VideoPlayerDemo } from "@/components/examples/video-player/demo"
import { VideoPlayerError } from "@/components/examples/video-player/error"
import { VideoPlayerGlobalShortcuts } from "@/components/examples/video-player/global-shortcuts"
import { VideoPlayerMinimal } from "@/components/examples/video-player/minimal"
import { VideoPlayerRtl } from "@/components/examples/video-player/rtl"
import { VideoPlayerSeekOffsets } from "@/components/examples/video-player/seek-offsets"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("video-player")

const importCode = `import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControls,
  VideoPlayerFullscreenButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBar,
  VideoPlayerSpacer,
  VideoPlayerTime,
  VideoPlayerVolume,
} from "@/components/ui/video-player"`

const usageCode = `<VideoPlayer>
  <VideoPlayerContent src="/intro.mp4" poster="/intro.jpg" />
  <VideoPlayerControls>
    <VideoPlayerSeekBar />
    <VideoPlayerPlayButton />
    <VideoPlayerVolume />
    <VideoPlayerTime />
    <VideoPlayerSpacer />
    <VideoPlayerFullscreenButton />
  </VideoPlayerControls>
</VideoPlayer>`

const hookCode = `const paused = useVideoPlayer((player) => player.paused)
const seek = useVideoPlayer((player) => player.seek)`

const renderType = "ReactElement | (props, state) => ReactElement"
const buttonProps = "Every Button prop, including variant and size."

const compositionCode = `VideoPlayer
├── VideoPlayerContent
└── VideoPlayerControls
    ├── VideoPlayerPlayButton
    ├── VideoPlayerSeekButton
    ├── VideoPlayerSeekBar
    ├── VideoPlayerTime
    ├── VideoPlayerSpacer
    ├── VideoPlayerVolume
    ├── VideoPlayerPlaybackRate
    ├── VideoPlayerCaptionsButton
    ├── VideoPlayerPictureInPictureButton
    └── VideoPlayerFullscreenButton`

export default function Page() {
  return (
    <DocsComponentPage slug="video-player">
      <DocsExample file="video-player/demo">
        <VideoPlayerDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={[
          "components/ui/video-player.tsx",
          "components/ui/button.tsx",
          "components/ui/dropdown-menu.tsx",
          "components/ui/kbd.tsx",
          "components/ui/spinner.tsx",
          "components/ui/tooltip.tsx",
        ]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="video-player/bar"
          title="Bar"
          description={
            <>
              <DocsCode>{'variant="bar"'}</DocsCode> puts the controls under the
              picture on the page surface. They never hide or cover the video.
            </>
          }
        >
          <VideoPlayerBar />
        </DocsExample>
        <DocsExample
          file="video-player/minimal"
          title="Minimal"
          description={
            <>
              Use only the parts you need.{" "}
              <DocsCode>{"tooltips={false}"}</DocsCode> turns off the hover
              hints, and <DocsCode>{'type="remaining"'}</DocsCode> counts down
              instead of up.
            </>
          }
        >
          <VideoPlayerMinimal />
        </DocsExample>
        <DocsExample
          file="video-player/seek-offsets"
          title="Seek offsets and speeds"
          description={
            <>
              <DocsCode>offset</DocsCode> sets how far each seek button jumps,
              and <DocsCode>rates</DocsCode> sets the speeds in the menu.
            </>
          }
        >
          <VideoPlayerSeekOffsets />
        </DocsExample>
        <DocsExample
          file="video-player/global-shortcuts"
          title="Page-wide shortcuts"
          description={
            <>
              Shortcuts work while focus is inside the player.{" "}
              <DocsCode>globalShortcuts</DocsCode> also listens on the page, but
              never while you type in a field, use a button or have a menu or
              dialog open. Use it for one player per page.
            </>
          }
        >
          <VideoPlayerGlobalShortcuts />
        </DocsExample>
        <DocsExample
          file="video-player/captions"
          title="Captions"
          description={
            <>
              Add a <DocsCode>{"<track>"}</DocsCode> and{" "}
              <DocsCode>VideoPlayerCaptionsButton</DocsCode>. Captions are drawn
              by the player, so they move up while the controls show instead of
              hiding behind them. A cross-origin track needs{" "}
              <DocsCode>crossOrigin</DocsCode> on the video.
            </>
          }
        >
          <VideoPlayerCaptions />
        </DocsExample>
        <DocsExample
          file="video-player/custom-controls"
          title="Custom controls"
          description={
            <>
              <DocsCode>useVideoPlayer</DocsCode> reads state and actions from
              any component inside the player. Select only what you use, so the
              component re-renders only when that value changes.
            </>
          }
        >
          <VideoPlayerCustomControls />
        </DocsExample>
        <DocsExample
          file="video-player/error"
          title="Error"
          description={
            <>
              When the source fails, the player shows{" "}
              <DocsCode>errorMessage</DocsCode>, announces it and disables the
              controls that can’t work.
            </>
          }
        >
          <VideoPlayerError />
        </DocsExample>
        <DocsExample
          file="video-player/rtl"
          title="Right to left"
          description="Labels follow the page language. The timeline and transport controls stay left to right, the way platform media players do."
        >
          <VideoPlayerRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsParagraph>
          These work while focus is anywhere inside the player, or on the page
          with <DocsCode>globalShortcuts</DocsCode>. They are skipped while a
          modifier key is held or focus is in a text field.
        </DocsParagraph>
        <DocsKeyboardTable
          keys={[
            { keys: ["Space", "K"], description: "Plays or pauses." },
            { keys: ["J"], description: "Goes back 10 seconds." },
            { keys: ["L"], description: "Goes forward 10 seconds." },
            {
              keys: ["←", "→"],
              description:
                "Goes back or forward 5 seconds. On the seek bar, Shift jumps 10.",
            },
            {
              keys: ["↑", "↓"],
              description: "Turns the volume up or down by 5%.",
            },
            { keys: ["M"], description: "Mutes or unmutes." },
            {
              keys: ["C"],
              description: "Turns captions on or off, when the video has them.",
            },
            { keys: ["F"], description: "Enters or leaves full screen." },
            {
              keys: ["I"],
              description:
                "Opens or closes picture in picture, where supported.",
            },
            {
              keys: ["Shift+.", "Shift+,"],
              description: "Speeds up or slows down playback.",
            },
            {
              keys: ["0–9"],
              description: "Jumps to 0% through 90% of the video.",
            },
            {
              keys: ["Home", "End"],
              description: "Jumps to the start or the end.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The player is a labelled region. Every button has a name that
            follows its state (Play, Pause, Replay) and a tooltip with its
            shortcut.
          </li>
          <li>
            The seek bar and volume are sliders. The seek bar reads its value as
            “1 minute 5 seconds of 3 minutes”.
          </li>
          <li>
            Actions from shortcuts and video clicks are announced politely, for
            example “Paused” or “Volume 40%”. Load errors are announced as an
            alert.
          </li>
          <li>
            In the overlay variant, controls fade out after 2.5 seconds of
            playback without pointer movement. They stay visible while paused,
            while you hover or use them with the keyboard, and while a menu is
            open.
          </li>
          <li>
            On touch screens, a tap shows or hides the controls and a double tap
            on the left or right third goes back or forward 10 seconds. Keep
            tapping to add 10 seconds each time.
          </li>
          <li>
            The captions button is a toggle with{" "}
            <DocsCode>aria-pressed</DocsCode>. It picks the last track you used,
            then one in the browser’s language, then the first one.
          </li>
          <li>
            With reduced motion, controls and feedback fade without moving or
            scaling.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          The seek bar and volume are built on the Base UI slider, and the
          buttons on HextaUI’s Button, Tooltip and Dropdown menu.
        </DocsParagraph>
        <DocsSection title="VideoPlayer" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"overlay" | "bar"',
                default: '"overlay"',
                description:
                  "overlay floats auto-hiding controls over the video. bar puts them below it.",
              },
              {
                name: "shortcuts",
                type: "boolean",
                default: "true",
                description: "Keyboard shortcuts while focus is in the player.",
              },
              {
                name: "globalShortcuts",
                type: "boolean",
                default: "false",
                description: "Also listen for shortcuts on the whole page.",
              },
              {
                name: "errorMessage",
                type: "ReactNode",
                default: '"This video can’t be played."',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="video-player"',
                description: "Target the root in CSS.",
              },
              { name: "data-variant", description: "The current variant." },
              {
                name: "data-controls",
                description:
                  '"visible" or "hidden". The cursor hides with the controls.',
              },
              {
                name: "data-fullscreen",
                description: "Present while the player is full screen.",
              },
              {
                name: "aria-busy",
                description: "Set while playback waits for data.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="VideoPlayerContent" level={3}>
          <DocsParagraph>
            The <DocsCode>{"<video>"}</DocsCode> element. It takes every video
            attribute, and <DocsCode>{"<source>"}</DocsCode> or{" "}
            <DocsCode>{"<track>"}</DocsCode> children. A click plays or pauses,
            a double click toggles full screen, a tap shows or hides the
            controls and a double tap at either side seeks.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "autoPlay",
                type: "boolean",
                default: "false",
                description:
                  "Starts playback on mount, except under reduced motion.",
              },
              { name: "playsInline", type: "boolean", default: "true" },
              {
                name: "preload",
                type: '"none" | "metadata" | "auto"',
                default: '"metadata"',
              },
              {
                name: "doubleTapSeek",
                type: "number | false",
                default: "10",
                description:
                  "Seconds a double tap at either side jumps on touch screens. false turns it off.",
              },
              {
                name: "render",
                type: renderType,
                default: "<video>",
                description:
                  "Swap in another media element, such as an HLS video element.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="video-player-content"',
                description: "Target the video in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="VideoPlayerControls" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "tooltips",
                type: "boolean",
                default: "true",
                description: "Show each control’s label and shortcut on hover.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="video-player-controls"',
                description: "Target the control bar in CSS.",
              },
              {
                name: "data-hidden",
                description: "Present while overlay controls are hidden.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="VideoPlayerSeekBar" level={3}>
          <DocsParagraph>
            Always takes its own row above the buttons. Hover shows the time
            under the pointer, and the lighter track shows what has loaded.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              { name: "label", type: "string", default: '"Seek"' },
              {
                name: "onValueChange",
                type: "(value: number, details) => void",
              },
              {
                name: "onValueCommitted",
                type: "(value: number, details) => void",
              },
              { name: "disabled", type: "boolean", default: "false" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="video-player-seek-bar"',
                description: "Target the seek bar in CSS.",
              },
              {
                name: "data-dragging",
                description: "Present while you scrub.",
              },
              {
                name: "data-previewing",
                description:
                  "Present on the control while the hover time is shown.",
              },
              {
                name: "--video-player-buffered",
                description: "The loaded part of the video, from 0 to 1.",
              },
              {
                name: "--video-player-hover",
                description: "The pointer position along the bar, from 0 to 1.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="VideoPlayerPlayButton" level={3}>
          <DocsPropsTable
            props={[
              { name: "playLabel", type: "string", default: '"Play"' },
              { name: "pauseLabel", type: "string", default: '"Pause"' },
              { name: "replayLabel", type: "string", default: '"Replay"' },
              {
                name: "...props",
                type: "ButtonProps",
                description: buttonProps,
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="video-player-play-button"',
                description: "Target the button in CSS.",
              },
              {
                name: "data-state",
                description: '"paused", "playing" or "ended".',
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="VideoPlayerSeekButton" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "offset",
                type: "number",
                default: "10",
                description: "Seconds to jump. Negative values go back.",
              },
              {
                name: "label",
                type: "string",
                default: '"Forward 10 seconds"',
              },
              {
                name: "...props",
                type: "ButtonProps",
                description: buttonProps,
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="video-player-seek-button"',
                description: "Target the button in CSS.",
              },
              {
                name: "data-direction",
                description: '"backward" or "forward".',
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="VideoPlayerVolume" level={3}>
          <DocsParagraph>
            A mute button with a slider that opens on hover or focus. On touch
            screens only the mute button shows, since phones control volume with
            their own buttons.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              { name: "label", type: "string", default: '"Volume"' },
              { name: "muteLabel", type: "string", default: '"Mute"' },
              { name: "unmuteLabel", type: "string", default: '"Unmute"' },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="video-player-volume"',
                description: "Target the group in CSS.",
              },
              {
                name: 'data-slot="video-player-mute-button"',
                description:
                  "The mute button. Also exported as VideoPlayerMuteButton.",
              },
              {
                name: "data-state",
                description: 'On the mute button: "muted", "low" or "high".',
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="VideoPlayerTime" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "type",
                type: '"both" | "elapsed" | "remaining" | "duration"',
                default: '"both"',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="video-player-time"',
                description: "Target the time in CSS.",
              },
              { name: "data-type", description: "The current type." },
            ]}
          />
        </DocsSection>
        <DocsSection title="VideoPlayerPlaybackRate" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "rates",
                type: "number[]",
                default: "[0.5, 0.75, 1, 1.25, 1.5, 2]",
              },
              { name: "label", type: "string", default: '"Playback speed"' },
              { name: "normalLabel", type: "string", default: '"Normal"' },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="video-player-playback-rate"',
                description: "Target the menu trigger in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="VideoPlayerFullscreenButton" level={3}>
          <DocsParagraph>
            Makes the whole player full screen, or the video itself on iPhone.
            Renders nothing where full screen isn’t available.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              { name: "enterLabel", type: "string", default: '"Full screen"' },
              {
                name: "exitLabel",
                type: "string",
                default: '"Exit full screen"',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="video-player-fullscreen-button"',
                description: "Target the button in CSS.",
              },
              { name: "data-state", description: '"on" or "off".' },
            ]}
          />
        </DocsSection>
        <DocsSection title="VideoPlayerCaptionsButton" level={3}>
          <DocsParagraph>
            Renders nothing until the video has a subtitles or captions track.
          </DocsParagraph>
          <DocsPropsTable
            props={[{ name: "label", type: "string", default: '"Captions"' }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="video-player-captions-button"',
                description: "Target the button in CSS.",
              },
              { name: "data-state", description: '"on" or "off".' },
              {
                name: 'data-slot="video-player-captions"',
                description:
                  "The caption text on the video. data-lifted is present while it sits above the controls.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="VideoPlayerPictureInPictureButton" level={3}>
          <DocsParagraph>
            Renders nothing in browsers without picture in picture.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "enterLabel",
                type: "string",
                default: '"Picture in picture"',
              },
              {
                name: "exitLabel",
                type: "string",
                default: '"Exit picture in picture"',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="video-player-pip-button"',
                description: "Target the button in CSS.",
              },
              { name: "data-state", description: '"on" or "off".' },
            ]}
          />
        </DocsSection>
        <DocsSection title="VideoPlayerSpacer" level={3}>
          <DocsParagraph>
            Fills the free space in the control row, pushing the controls after
            it to the end.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="useVideoPlayer" level={3}>
          <DocsParagraph>
            Returns the player’s state and actions. Pass a selector that returns
            a single value.
          </DocsParagraph>
          <DocsCodeBlock code={hookCode} />
          <DocsPropsTable
            props={[
              {
                name: "state",
                type: "paused, ended, started, waiting, scrubbing, currentTime, duration, buffered, volume, muted, playbackRate, fullscreen, pictureInPicture, error, hasCaptions, captions, caption",
              },
              {
                name: "actions",
                type: "play, pause, togglePaused, seek, seekBy, setVolume, toggleMuted, setPlaybackRate, toggleFullscreen, togglePictureInPicture, toggleCaptions",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
