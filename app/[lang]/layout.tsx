import { notFound } from "next/navigation"

import { LocaleAttribute } from "@/components/site/locale-attribute"
import { readMessages } from "@/lib/i18n/catalog"
import {
  chromeDictionaryId,
  isTranslatedLocale,
  translatedLocales,
} from "@/lib/i18n/config"
import { setRequestLocale } from "@/lib/i18n/request"

export const dynamicParams = false

export function generateStaticParams() {
  return translatedLocales.map((lang) => ({ lang }))
}

export default async function Layout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params
  if (!isTranslatedLocale(lang)) notFound()
  setRequestLocale(lang)

  return (
    <>
      <script
        id={chromeDictionaryId(lang)}
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(readMessages(lang, "chrome")).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />
      <LocaleAttribute locale={lang} />
      {children}
    </>
  )
}
