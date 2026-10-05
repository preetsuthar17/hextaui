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
  DocsPropsTable,
} from "@/components/docs/docs-props-table"
import { MessageAlignment } from "@/components/examples/message/alignment"
import { MessageAssistant } from "@/components/examples/message/assistant"
import { MessageDemo } from "@/components/examples/message/demo"
import { MessageHeaderFooter } from "@/components/examples/message/header-footer"
import { MessageLongContent } from "@/components/examples/message/long-content"
import { MessageRtl } from "@/components/examples/message/rtl"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("message")

const importCode = `import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message"`

const usageCode = `<MessageGroup>
  <Message align="end">
    <MessageContent>
      <Bubble>
        <BubbleContent>On my way.</BubbleContent>
      </Bubble>
      <MessageFooter>Read</MessageFooter>
    </MessageContent>
  </Message>
</MessageGroup>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `MessageGroup
└── Message
    ├── MessageAvatar
    └── MessageContent
        ├── MessageHeader
        ├── Bubble
        └── MessageFooter`

export default function Page() {
  return (
    <DocsComponentPage slug="message">
      <DocsExample file="message/demo">
        <MessageDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "class-variance-authority", "cn"]}
        files={["components/ui/message.tsx", "components/ui/bubble.tsx"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          A message lays out an avatar, a name, one or more{" "}
          <DocsCode>{"<Bubble />"}</DocsCode>s and a status line. Bubbles
          inherit the message&apos;s <DocsCode>align</DocsCode>, so you set it
          once.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="message/alignment"
          title="Alignment"
          description={
            <>
              <DocsCode>{'align="end"'}</DocsCode> puts the avatar and bubbles
              on the other side for your own messages.
            </>
          }
        >
          <MessageAlignment />
        </DocsExample>
        <DocsExample
          file="message/header-footer"
          title="Header and footer"
          description={
            <>
              <DocsCode>{"<MessageHeader />"}</DocsCode> holds the name and
              time, and <DocsCode>{"<MessageFooter />"}</DocsCode> a single line
              of status. The avatar always lines up with the last bubble, with
              or without a footer.
            </>
          }
        >
          <MessageHeaderFooter />
        </DocsExample>
        <DocsExample
          file="message/assistant"
          title="Assistant"
          description={
            <>
              A <DocsCode>ghost</DocsCode> bubble spans the full width for long
              answers, and an icon in <DocsCode>{"<MessageAvatar />"}</DocsCode>{" "}
              becomes a round tile.
            </>
          }
        >
          <MessageAssistant />
        </DocsExample>
        <DocsExample
          file="message/long-content"
          title="Long content"
          description="Bubbles wrap long links, and header and footer text can truncate without pushing the avatar."
        >
          <MessageLongContent />
        </DocsExample>
        <DocsExample
          file="message/rtl"
          title="Right to left"
          description="Start and end swap sides, and new messages grow from the matching corner."
        >
          <MessageRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Messages are plain content. For a live chat, wrap the list in a{" "}
            <DocsCode>{'role="log"'}</DocsCode> element so screen readers read
            new messages as they arrive.
          </li>
          <li>
            Put the sender&apos;s name in a header or in visually hidden text,
            since alignment alone doesn&apos;t say who wrote a message.
          </li>
          <li>
            The entrance only plays for messages added after the list first
            renders. With reduced motion they fade in.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Every part renders a <DocsCode>{"<div>"}</DocsCode> and accepts{" "}
          <DocsCode>render</DocsCode>.
        </DocsParagraph>
        <DocsSection title="MessageGroup" level={3}>
          <DocsParagraph>
            The thread. Messages added after its first render animate in.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="message-group"',
                description: "Target the thread in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="Message" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "align",
                type: '"start" | "end"',
                default: '"start"',
                description: "Side of the conversation. Bubbles inherit it.",
              },
              {
                name: "animated",
                type: "boolean",
                default: "true",
                description:
                  "Rise in when added to a MessageGroup after its first render.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="message"',
                description: "Target messages in CSS.",
              },
              { name: "data-align", description: "The side." },
              {
                name: "data-entering",
                description: "Present on messages that animate in.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="MessageAvatar" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="message-avatar"',
                description:
                  "Lines up with the last bubble. A bare icon or image is sized to 32px.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="MessageContent" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="message-content"',
                description: "Stacks the header, bubbles and footer.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="MessageHeader and MessageFooter" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="message-header"',
                description: "Name and time above the bubbles.",
              },
              {
                name: 'data-slot="message-footer"',
                description:
                  "One line of status below. Keep it to a single line so the avatar stays aligned.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
