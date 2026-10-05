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
import { MessageScrollerDemo } from "@/components/examples/message-scroller/demo"
import { MessageScrollerGroupChat } from "@/components/examples/message-scroller/group-chat"
import { MessageScrollerHistory } from "@/components/examples/message-scroller/history"
import { MessageScrollerJump } from "@/components/examples/message-scroller/jump"
import { MessageScrollerPeek } from "@/components/examples/message-scroller/peek"
import { MessageScrollerSavedThread } from "@/components/examples/message-scroller/saved-thread"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("message-scroller")

const importCode = `import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"`

const usageCode = `<MessageScrollerProvider>
  <MessageScroller>
    <MessageScrollerViewport aria-label="Conversation">
      <MessageScrollerContent>
        {messages.map((message) => (
          <MessageScrollerItem key={message.id} messageId={message.id}>
            <Message>…</Message>
          </MessageScrollerItem>
        ))}
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
</MessageScrollerProvider>`

const hooksCode = `const { scrollToEnd, scrollToMessage, scrollToStart } = useMessageScroller()
const { start, end } = useMessageScrollerScrollable()
const { visibleMessageIds, currentAnchorId } = useMessageScrollerVisibility()`

const compositionCode = `MessageScrollerProvider
└── MessageScroller
    ├── MessageScrollerViewport
    │   └── MessageScrollerContent
    │       └── MessageScrollerItem
    └── MessageScrollerButton`

export default function Page() {
  return (
    <DocsComponentPage slug="message-scroller">
      <DocsExample file="message-scroller/demo">
        <MessageScrollerDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@shadcn/react", "@tabler/icons-react", "cn"]}
        files={[
          "components/ui/message-scroller.tsx",
          "components/ui/button.tsx",
          "lib/motion.ts",
        ]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Give every item a stable <DocsCode>messageId</DocsCode>. The scroller
          uses it to follow new messages, keep your place and count what you
          haven&apos;t seen. Pair it with <DocsCode>{"<Message />"}</DocsCode>{" "}
          and <DocsCode>{"<Bubble />"}</DocsCode> for the rows.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="message-scroller/group-chat"
          title="Group chat"
          description={
            <>
              Anchors don&apos;t have to be messages. Here a{" "}
              <DocsCode>{"<Marker />"}</DocsCode> for someone joining starts the
              turn. Scroll up, receive messages, and the jump button counts what
              arrived while you were away.
            </>
          }
        >
          <MessageScrollerGroupChat />
        </DocsExample>
        <DocsExample
          file="message-scroller/peek"
          title="Keeping context"
          description={
            <>
              <DocsCode>scrollPreviousItemPeek</DocsCode> keeps a slice of the
              previous turn above a newly anchored one, so the thread still
              feels continuous. Try each amount, then ask the next question.
            </>
          }
        >
          <MessageScrollerPeek />
        </DocsExample>
        <DocsExample
          file="message-scroller/saved-thread"
          title="Opening saved threads"
          description={
            <>
              <DocsCode>{'defaultScrollPosition="last-anchor"'}</DocsCode>{" "}
              reopens a conversation at its last question, with the answer
              below, instead of dropping the reader mid-answer at the bottom.
            </>
          }
        >
          <MessageScrollerSavedThread />
        </DocsExample>
        <DocsExample
          file="message-scroller/history"
          title="Loading earlier messages"
          description={
            <>
              Older messages added above keep what you&apos;re reading in place
              (<DocsCode>preserveScrollOnPrepend</DocsCode>, on by default).
            </>
          }
        >
          <MessageScrollerHistory />
        </DocsExample>
        <DocsExample
          file="message-scroller/jump"
          title="Jumping to messages"
          description={
            <>
              <DocsCode>useMessageScroller</DocsCode> drives the thread from
              outside it, and <DocsCode>useMessageScrollerVisibility</DocsCode>{" "}
              reports the current turn, so the outline highlights where you are.
            </>
          }
        >
          <MessageScrollerJump />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Hooks">
        <DocsParagraph>
          Inside the provider, these hooks let your own controls scroll the
          thread and react to what&apos;s on screen.
        </DocsParagraph>
        <DocsCodeBlock code={hooksCode} />
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Focuses the conversation. The jump button joins the tab order only while it's showing.",
            },
            { keys: ["↑", "↓"], description: "Scrolls the conversation." },
            {
              keys: ["Page Up", "Page Down"],
              description: "Scrolls by a screen.",
            },
            {
              keys: ["Home", "End"],
              description: "Jumps to the first or latest message.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The viewport is a labelled, focusable region and the content is a{" "}
            <DocsCode>{'role="log"'}</DocsCode>, so screen readers announce new
            messages as they arrive. Give the viewport an{" "}
            <DocsCode>aria-label</DocsCode>.
          </li>
          <li>
            The jump button&apos;s label says how many messages are new, so
            &quot;3 new messages&quot; is read out, not just an arrow.
          </li>
          <li>
            Following new messages never moves you while you&apos;re reading
            back. It only resumes once you&apos;re at the bottom again.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="MessageScrollerProvider" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "autoScroll",
                type: "boolean",
                default: "false",
                description:
                  "Follow new messages while the reader is at the bottom.",
              },
              {
                name: "defaultScrollPosition",
                type: '"start" | "end" | "last-anchor"',
                default: '"end"',
                description: "Where the thread opens.",
              },
              {
                name: "scrollPreviousItemPeek",
                type: "number",
                default: "64",
                description:
                  "How much of the previous item stays visible above a new anchor.",
              },
              {
                name: "scrollEdgeThreshold",
                type: "number",
                description: "Pixels from an edge that still count as at it.",
              },
              {
                name: "scrollMargin",
                type: "number",
                description: "Space kept above messages scrolled into view.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="MessageScrollerViewport" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "preserveScrollOnPrepend",
                type: "boolean",
                default: "false",
                description:
                  "Keep the reading position when messages are added above.",
              },
              {
                name: "aria-label",
                type: "string",
                description: "Names the conversation region.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-scrollable="start end"',
                description:
                  "Which edges have more to scroll. Drives the edge fades.",
              },
              {
                name: "data-autoscrolling",
                description:
                  "Present while following new messages. The scrollbar hides.",
              },
              {
                name: "--scroller-fade-start / --scroller-fade-end",
                description: "Size of the edge fades. They animate in and out.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="MessageScrollerItem" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "messageId",
                type: "string",
                description: "Stable id for following, anchors and counts.",
              },
              {
                name: "scrollAnchor",
                type: "boolean",
                default: "false",
                description:
                  'Scroll this item to the top when it arrives, with defaultScrollPosition="last-anchor".',
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="MessageScrollerButton" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "direction",
                type: '"start" | "end"',
                default: '"end"',
              },
              {
                name: "showUnseen",
                type: "boolean",
                default: "true",
                description:
                  "Grow into a pill that counts messages that arrived while you were scrolled up.",
              },
              {
                name: "unseenLabel",
                type: "(count: number) => ReactNode",
                default: '"3 new messages"',
              },
              {
                name: "variant",
                type: "Button variant",
                default: '"outline"',
              },
              { name: "behavior", type: "ScrollBehavior", default: '"smooth"' },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="message-scroller-button"',
                description: "Target the button in CSS.",
              },
              {
                name: "data-active",
                description: '"true" while there\'s somewhere to jump to.',
              },
              {
                name: "data-unseen",
                description: "The unseen count, while it's above zero.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
