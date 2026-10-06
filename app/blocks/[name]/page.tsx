import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { BlockCode } from "@/components/blocks/block-code"
import { BlockFrame } from "@/components/blocks/block-frame"
import { DocsCodeBlock } from "@/components/docs/docs-code-block"
import { DocsCommand } from "@/components/docs/docs-command"
import {
  DocsCode,
  DocsParagraph,
  DocsSection,
} from "@/components/docs/docs-content"
import { DocsStep } from "@/components/docs/docs-install"
import { DocsPage } from "@/components/docs/docs-page"
import { pageMetadata } from "@/lib/metadata"
import { blocksNavItems, getProBlock, proBlockParams } from "@/lib/pro/catalog"

export const dynamicParams = false

const registryCode = `{
  "registries": {
    "@hextaui-pro": {
      "url": "https://hextaui.com/r/pro/{name}.json",
      "headers": {
        "Authorization": "Bearer \${HEXTAUI_PRO_TOKEN}"
      }
    }
  }
}`

const linkClassName = "text-foreground underline underline-offset-4"

export function generateStaticParams() {
  return proBlockParams()
}

export async function generateMetadata({
  params,
}: PageProps<"/blocks/[name]">): Promise<Metadata> {
  const block = getProBlock((await params).name)
  return block
    ? pageMetadata({
        title: `${block.title} block`,
        description: block.description,
        path: `/blocks/${block.name}`,
      })
    : {}
}

export default async function Page({ params }: PageProps<"/blocks/[name]">) {
  const block = getProBlock((await params).name)
  if (!block) notFound()

  return (
    <DocsPage
      href={`/blocks/${block.name}`}
      title={block.title}
      description={block.description}
      navItems={blocksNavItems}
      className="max-w-4xl"
    >
      <div className="mt-8">
        <BlockFrame name={block.name} title={block.title} />
      </div>

      <DocsSection title="Installation">
        <ol className="flex flex-col">
          <DocsStep step={1} title="Add the Pro registry to components.json">
            <DocsCodeBlock
              code={registryCode}
              lang="json"
              title="components.json"
            />
          </DocsStep>
          <DocsStep step={2} title="Add your token">
            <DocsParagraph>
              Create a token on your{" "}
              <Link href="/account" className={linkClassName}>
                account page
              </Link>{" "}
              and put it in <DocsCode>.env.local</DocsCode> as{" "}
              <DocsCode>HEXTAUI_PRO_TOKEN</DocsCode>.
            </DocsParagraph>
          </DocsStep>
          <DocsStep step={3} title="Add the block">
            <DocsCommand
              mode="dlx"
              packages={["shadcn@latest", "add", `@hextaui-pro/${block.name}`]}
            />
          </DocsStep>
        </ol>
      </DocsSection>

      {block.usage.length > 0 ? (
        <DocsSection title="Usage">
          {block.usage.map((example) => (
            <DocsSection
              key={example.title}
              title={example.title}
              description={example.description}
              level={3}
            >
              <DocsCodeBlock code={example.code} />
            </DocsSection>
          ))}
        </DocsSection>
      ) : null}

      <DocsSection
        title="Code"
        description={`${block.files.length} ${block.files.length === 1 ? "file" : "files"}, added to components/blocks/${block.name}.`}
      >
        <BlockCode name={block.name} />
      </DocsSection>
    </DocsPage>
  )
}
