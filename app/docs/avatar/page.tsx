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
import { AvatarDemo } from "@/components/examples/avatar/demo"
import { AvatarGroupDemo } from "@/components/examples/avatar/group"
import { AvatarInitials } from "@/components/examples/avatar/initials"
import { AvatarLayout } from "@/components/examples/avatar/layout"
import { AvatarLinkedGroup } from "@/components/examples/avatar/linked-group"
import { AvatarLoading } from "@/components/examples/avatar/loading"
import { AvatarRtl } from "@/components/examples/avatar/rtl"
import { AvatarSizes } from "@/components/examples/avatar/sizes"
import { AvatarStatusDemo } from "@/components/examples/avatar/status"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("avatar")

const importCode = `import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar"`

const usageCode = `<Avatar>
  <AvatarImage src="/ada.jpg" alt="" />
  <AvatarFallback>AL</AvatarFallback>
</Avatar>`

const renderType = "ReactElement | (props, state) => ReactElement"
const sizeType = '"xs" | "sm" | "default" | "lg" | "xl"'
const shapeType = '"circle" | "square"'

const compositionCode = `Avatar
├── AvatarImage
├── AvatarFallback
└── AvatarBadge

AvatarGroup
├── Avatar
└── AvatarGroupCount`

export default function Page() {
  return (
    <DocsComponentPage slug="avatar">
      <DocsExample file="avatar/demo">
        <AvatarDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={["components/ui/avatar.tsx"]}
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
          file="avatar/sizes"
          title="Sizes and shapes"
          description={
            <>
              Five sizes, as circles or squares. Initials and the user icon
              scale with the box, and square corners step down with the size. An
              empty <DocsCode>{"<AvatarFallback />"}</DocsCode> shows the user
              icon.
            </>
          }
        >
          <AvatarSizes />
        </DocsExample>
        <DocsExample
          file="avatar/loading"
          title="Loading"
          description={
            <>
              Initials show while the photo loads, then the photo fades in over
              them. A broken photo keeps the fallback. Pass{" "}
              <DocsCode>delay</DocsCode> to wait before showing initials, so
              fast photos never flash them.
            </>
          }
        >
          <AvatarLoading />
        </DocsExample>
        <DocsExample
          file="avatar/initials"
          title="Initials"
          description={
            <>
              <DocsCode>getInitials()</DocsCode> picks the first and last
              initial. It handles email addresses, emoji, CJK and RTL names,
              combining marks, and names with no letters at all.
            </>
          }
        >
          <AvatarInitials />
        </DocsExample>
        <DocsExample
          file="avatar/status"
          title="Status"
          description={
            <>
              <DocsCode>{"<AvatarBadge />"}</DocsCode> sits on the rim at every
              size and shape. Set <DocsCode>status</DocsCode> for a colored dot
              with an accessible label, or pass an icon. Changing the status
              plays a single pulse.
            </>
          }
        >
          <AvatarStatusDemo />
        </DocsExample>
        <DocsExample
          file="avatar/group"
          title="Group"
          description={
            <>
              <DocsCode>{"<AvatarGroup />"}</DocsCode> overlaps its avatars and
              sets their size and shape. <DocsCode>max</DocsCode> collapses the
              rest into a count.
            </>
          }
        >
          <AvatarGroupDemo />
        </DocsExample>
        <DocsExample
          file="avatar/linked-group"
          title="Linked group"
          description={
            <>
              Render avatars as links with <DocsCode>render</DocsCode> and give
              each an <DocsCode>aria-label</DocsCode>. A focused avatar rises
              above its neighbours so the ring is never cut. Add{" "}
              <DocsCode>{"<AvatarGroupCount />"}</DocsCode> yourself when the
              total comes from your data.
            </>
          }
        >
          <AvatarLinkedGroup />
        </DocsExample>
        <DocsExample
          file="avatar/layout"
          title="Layout"
          description="Avatars never shrink in tight rows. A size class like size-20 scales the initials and badge with it, and long initials never overflow."
        >
          <AvatarLayout />
        </DocsExample>
        <DocsExample
          file="avatar/rtl"
          title="Right to left"
          description="The badge stays on the end corner, which is the left in RTL, and groups overlap from the right."
        >
          <AvatarRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsParagraph>
          Avatars aren’t focusable on their own. Rendered as a link or button
          they get the usual keys.
        </DocsParagraph>
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description: "Moves focus to the next linked avatar.",
            },
            {
              keys: ["Enter"],
              description: "Follows the focused link.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Use <DocsCode>{'alt=""'}</DocsCode> when the person’s name is
            already next to the avatar, and their name as the alt text when it
            isn’t.
          </li>
          <li>
            Badges with a <DocsCode>status</DocsCode> are announced as “Online”,
            “Away”, “Busy” or “Offline”. Offline is drawn as a ring, so the
            status never relies on color alone.
          </li>
          <li>
            Groups have <DocsCode>{'role="group"'}</DocsCode>. The count reads
            as “3 more”, not “+3”.
          </li>
          <li>
            With reduced motion on, photos appear without fading and status
            changes don’t pulse.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI avatar. Every part accepts the attributes of the
          element it renders. The styles are exported as{" "}
          <DocsCode>avatarVariants</DocsCode> and{" "}
          <DocsCode>avatarBadgeVariants</DocsCode>.
        </DocsParagraph>
        <DocsSection title="Avatar" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "size",
                type: sizeType,
                default: '"default"',
                description: "Inherited from the group when omitted.",
              },
              {
                name: "shape",
                type: shapeType,
                default: '"circle"',
                description: "Inherited from the group when omitted.",
              },
              { name: "render", type: renderType, default: "<span>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="avatar"',
                description: "Target avatars in CSS.",
              },
              { name: "data-size", description: "The resolved size." },
              { name: "data-shape", description: "The resolved shape." },
              {
                name: "--avatar-radius",
                description: "The corner radius, shared by every layer.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AvatarImage" level={3}>
          <DocsPropsTable
            props={[
              { name: "src", type: "string" },
              { name: "alt", type: "string" },
              {
                name: "onLoadingStatusChange",
                type: '(status: "idle" | "loading" | "loaded" | "error") => void',
              },
              {
                name: "keepMounted",
                type: "boolean",
                default: "false",
                description:
                  'Load the image in place instead of preloading it, for loading="lazy" or next/image.',
              },
              { name: "render", type: renderType, default: "<img>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="avatar-image"',
                description: "Target images in CSS.",
              },
              {
                name: "data-loading",
                description: "Present while the image loads.",
              },
              {
                name: "data-error",
                description: "Present when the image failed to load.",
              },
              {
                name: "data-starting-style",
                description: "Present while the image fades in.",
              },
              {
                name: "data-ending-style",
                description: "Present while the image fades out.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AvatarFallback" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                default: "<IconUser />",
                description: "Empty or whitespace shows the user icon.",
              },
              {
                name: "delay",
                type: "number",
                default: "0",
                description: "Milliseconds to wait before showing it.",
              },
              { name: "render", type: renderType, default: "<span>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="avatar-fallback"',
                description: "Target fallbacks in CSS.",
              },
              {
                name: "data-ready",
                description: "false until the delay has passed.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AvatarBadge" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "status",
                type: '"online" | "away" | "busy" | "offline"',
                description:
                  "Colors the dot and labels it for assistive tech. Without it the badge uses the primary color.",
              },
              {
                name: "children",
                type: "ReactNode",
                description:
                  "An icon inside the badge. Hidden at the xs and sm sizes.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="avatar-badge"',
                description: "Target badges in CSS.",
              },
              { name: "data-status", description: "The current status." },
              {
                name: 'data-slot="avatar-badge-pulse"',
                description: "The pulse played after a status change.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AvatarGroup" level={3}>
          <DocsPropsTable
            props={[
              { name: "size", type: sizeType, default: '"default"' },
              { name: "shape", type: shapeType, default: '"circle"' },
              {
                name: "max",
                type: "number",
                description:
                  "How many items to show, including the count. Values below 2 are raised to 2.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="avatar-group"',
                description: "Target groups in CSS.",
              },
              { name: "data-size", description: "The group’s size." },
            ]}
          />
        </DocsSection>
        <DocsSection title="AvatarGroupCount" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "count",
                type: "number",
                description: "Shown as +3, or 99+ above 99.",
              },
              {
                name: "children",
                type: "ReactNode",
                description: "Replaces the count, for example with an icon.",
              },
              {
                name: "size",
                type: sizeType,
                description: "Inherited from the group when omitted.",
              },
              {
                name: "shape",
                type: shapeType,
                description: "Inherited from the group when omitted.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="avatar-group-count"',
                description: "Target the count in CSS.",
              },
              { name: "data-size", description: "The resolved size." },
              { name: "data-shape", description: "The resolved shape." },
            ]}
          />
        </DocsSection>
        <DocsSection title="getInitials" level={3}>
          <DocsParagraph>
            <DocsCode>getInitials(name, max = 2)</DocsCode> returns up to{" "}
            <DocsCode>max</DocsCode> uppercase initials: the first word’s and
            the last word’s. For an email address it uses the part before the{" "}
            <DocsCode>@</DocsCode>. It returns an empty string when the name has
            no letters, numbers or emoji, so the fallback shows the user icon.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
