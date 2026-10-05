"use client"

import * as React from "react"
import { IconAlertTriangle, IconFileText, IconX } from "@tabler/icons-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Alert,
  AlertAction,
  AlertClose,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  getInitials,
} from "@/components/ui/avatar"
import { Badge, BadgeClose, BadgeCount, BadgeDot } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NumberFlow } from "@/components/ui/number-flow"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton, SkeletonText } from "@/components/ui/skeleton"

import { DocsSection } from "@/components/docs/docs-content"

const unbroken = "Supercalifragilisticexpialidocious".repeat(6)
const email =
  "firstname.middlename.lastname+newsletter-filter-2026@subdomain.very-long-company-domain-name.co.uk"
const url =
  "https://example.com/" +
  "nested-segment/".repeat(12) +
  "?utm_source=" +
  "x".repeat(40)
const emoji = "👩‍👩‍👧‍👦🏳️‍🌈🧑🏽‍💻🇮🇳".repeat(8)
const zalgo = "Z̷̢̛͖͓̰̈́a̶̧̛̱͎̿l̴̰͊g̸̣̈́̃o̵͙̊ ṫ̷̢e̶͖̿x̸̰̌t̵̗̓ "
const mixed = "Invoice مرحبا بالعالم #4821 שלום עולם — paid ✓"
const cjk =
  "これは非常に長い日本語のテキストで改行の動作を確認するためのものです".repeat(
    3
  )
const script = "<script>alert('xss')</script><b>not bold</b>"
const whitespace = "      "

const labels = [
  unbroken,
  email,
  url,
  emoji,
  zalgo,
  mixed,
  cjk,
  script,
  whitespace,
  "",
]

function Narrow({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div
      id={id}
      data-stress-container=""
      className="flex w-72 max-w-full flex-col gap-2 rounded-lg border border-dashed p-2"
    >
      {children}
    </div>
  )
}

function StressDemos() {
  return (
    <>
      <DocsSection title="Accordion">
        <Narrow id="stress-accordion">
          <Accordion variant="outline" multiple defaultValue={[0, 1, 2]}>
            {labels.map((label, index) => (
              <AccordionItem key={index} value={index}>
                <AccordionTrigger>{label}</AccordionTrigger>
                <AccordionContent>
                  {labels[(index + 3) % labels.length]} {email} {url}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Narrow>
      </DocsSection>

      <DocsSection title="Alert">
        <Narrow id="stress-alert">
          {labels.slice(0, 6).map((label, index) => (
            <Alert key={index} variant={index % 2 ? "destructive" : "default"}>
              <IconAlertTriangle />
              <AlertTitle>{label}</AlertTitle>
              <AlertDescription>
                Contact {email} or visit {url}. {cjk}
              </AlertDescription>
              <AlertAction>
                <Button size="xs" variant="secondary">
                  {unbroken.slice(0, 40)}
                </Button>
              </AlertAction>
              <AlertClose />
            </Alert>
          ))}
        </Narrow>
      </DocsSection>

      <DocsSection title="Avatar">
        <Narrow id="stress-avatar">
          <AvatarGroup max={6}>
            {Array.from({ length: 500 }, (_, index) => (
              <Avatar key={index}>
                <AvatarFallback>
                  {getInitials(labels[index % labels.length])}
                </AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
          <AvatarGroup>
            {labels.map((label, index) => (
              <Avatar key={index}>
                <AvatarFallback>{getInitials(label)}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
          <div className="flex items-center gap-2">
            <Avatar size="xs">
              <AvatarFallback>{unbroken}</AvatarFallback>
              <AvatarBadge status="busy" />
            </Avatar>
            <Avatar>
              <AvatarImage src="" alt="" />
              <AvatarFallback>{emoji}</AvatarFallback>
            </Avatar>
            <Avatar className="size-0">
              <AvatarFallback>{zalgo}</AvatarFallback>
              <AvatarBadge status="online" />
            </Avatar>
            <span className="min-w-0 truncate text-sm">{email}</span>
          </div>
        </Narrow>
      </DocsSection>

      <DocsSection title="Badge">
        <Narrow id="stress-badge">
          <div className="flex flex-wrap gap-1">
            {labels.map((label, index) => (
              <Badge
                key={index}
                variant={
                  (
                    [
                      "default",
                      "success",
                      "info",
                      "warning",
                      "destructive",
                    ] as const
                  )[index % 5]
                }
              >
                <BadgeDot />
                {label}
                <BadgeClose />
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 300 }, (_, index) => (
              <Badge key={index} appearance="outline" size="sm">
                {`tag-${index}`}
                <BadgeClose />
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            <Badge appearance="solid" variant="destructive">
              <BadgeCount value={1e12} />
            </Badge>
            <Badge>
              <BadgeCount value={-5} />
            </Badge>
            <Badge>
              <BadgeCount value={1e12} max={Infinity} />
            </Badge>
          </div>
        </Narrow>
      </DocsSection>

      <DocsSection title="Number flow">
        <Narrow id="stress-number-flow">
          <div className="text-4xl">
            <NumberFlow value={1e15} />
          </div>
          <NumberFlow
            value={-987654321.123456}
            format={{ maximumFractionDigits: 6 }}
          />
          <NumberFlow value={Number.NaN} />
          <NumberFlow value={Infinity} prefix={unbroken} />
          <NumberFlow value={42} suffix={email} />
          <div className="flex flex-wrap gap-1 text-xs">
            {Array.from({ length: 200 }, (_, index) => (
              <NumberFlow key={index} value={index * 997} />
            ))}
          </div>
        </Narrow>
      </DocsSection>

      <DocsSection title="Button">
        <Narrow id="stress-button">
          {labels.map((label, index) => (
            <Button key={index} variant={index % 2 ? "outline" : "default"}>
              {label}
            </Button>
          ))}
          <Button
            feedback
            errorLabel={unbroken}
            onClick={() => Promise.reject(new Error("x"))}
          >
            {email}
          </Button>
          <div className="flex gap-2">
            <Button>{url}</Button>
            <Button variant="ghost">{emoji}</Button>
          </div>
        </Narrow>
      </DocsSection>

      <DocsSection title="Attachment">
        <Narrow id="stress-attachment">
          {labels.map((label, index) => (
            <Attachment key={index} state={index % 3 === 0 ? "error" : "done"}>
              <AttachmentMedia>
                <IconFileText />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{`${label}.pdf`}</AttachmentTitle>
                <AttachmentDescription>
                  {`Shared by ${email}`}
                </AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction aria-label="Remove">
                  <IconX />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>
          ))}
          <AttachmentGroup>
            {labels.map((label, index) => (
              <Attachment key={index} size="xs">
                <AttachmentContent>
                  <AttachmentTitle>{label || "untitled"}</AttachmentTitle>
                </AttachmentContent>
              </Attachment>
            ))}
          </AttachmentGroup>
        </Narrow>
      </DocsSection>

      <DocsSection title="Aspect ratio and skeleton">
        <Narrow id="stress-media">
          <AspectRatio ratio={16 / 9} className="rounded-lg">
            <div className="absolute inset-0 grid place-items-center overflow-hidden p-2 text-center text-sm wrap-anywhere">
              {unbroken}
            </div>
          </AspectRatio>
          <AspectRatio ratio={"1e9/1" as "1/1"} className="rounded-lg border" />
          <Skeleton loading>
            <p className="text-sm">{unbroken}</p>
          </Skeleton>
          <Skeleton loading>
            <p className="text-sm">{email}</p>
          </Skeleton>
          <SkeletonText lines={1000000} className="max-h-24 overflow-hidden" />
        </Narrow>
      </DocsSection>

      <DocsSection title="Scroll area">
        <Narrow id="stress-scroll">
          <ScrollArea peek className="h-64 rounded-lg border">
            <ul className="flex flex-col p-1">
              {Array.from({ length: 1000 }, (_, index) => (
                <li key={index} className="rounded-md px-2 py-1.5 text-sm">
                  {index}. {labels[index % labels.length] || "(empty)"}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </Narrow>
      </DocsSection>

      <DocsSection title="Alert dialog and sheet">
        <Narrow id="stress-overlays">
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}>
              Open alert dialog
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {email}?</AlertDialogTitle>
                <AlertDialogDescription>
                  {unbroken} {url} {cjk} {zalgo}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{unbroken.slice(0, 60)}</AlertDialogCancel>
                <AlertDialogAction variant="destructive">
                  {email}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              Open sheet
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{unbroken}</SheetTitle>
                <SheetDescription>{email}</SheetDescription>
              </SheetHeader>
              <SheetBody>
                <div className="flex flex-col gap-2 text-sm">
                  {Array.from({ length: 200 }, (_, index) => (
                    <p key={index}>
                      {labels[index % labels.length] || "(empty)"}
                    </p>
                  ))}
                </div>
              </SheetBody>
              <SheetFooter>
                <Button>{url}</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Narrow>
      </DocsSection>
    </>
  )
}

export { StressDemos }
