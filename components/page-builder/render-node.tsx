"use client"

import * as React from "react"
import {
  IconArrowRight,
  IconAtom,
  IconBolt,
  IconChartBar,
  IconCheck,
  IconCircleCheck,
  IconCircleDot,
  IconClock,
  IconCloud,
  IconCode,
  IconDeviceMobile,
  IconHexagon,
  IconInfinity,
  IconLayersIntersect,
  IconLeaf,
  IconLock,
  IconMessage,
  IconPalette,
  IconPlug,
  IconRocket,
  IconSearch,
  IconShieldCheck,
  IconSparkles,
  IconSquareRounded,
  IconTriangle,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { isElement, type Node } from "@/lib/page-builder/node"

const components: Record<string, React.ElementType> = {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Separator,
  IconArrowRight,
  IconAtom,
  IconBolt,
  IconChartBar,
  IconCheck,
  IconCircleCheck,
  IconCircleDot,
  IconClock,
  IconCloud,
  IconCode,
  IconDeviceMobile,
  IconHexagon,
  IconInfinity,
  IconLayersIntersect,
  IconLeaf,
  IconLock,
  IconMessage,
  IconPalette,
  IconPlug,
  IconRocket,
  IconSearch,
  IconShieldCheck,
  IconSparkles,
  IconSquareRounded,
  IconTriangle,
  IconUsers,
  IconWorld,
}

function renderNode(node: Node, key?: React.Key): React.ReactNode {
  if (!isElement(node)) return node || null
  const type =
    components[node.tag] ??
    (/^[a-z][a-z0-9]*$/.test(node.tag) ? node.tag : "div")
  const props: Record<string, unknown> = { key }
  for (const [name, value] of Object.entries(node.props)) {
    props[name] = isElement(value) ? renderNode(value) : value
  }
  const children = node.children.map((child, index) => renderNode(child, index))
  return React.createElement(
    type,
    props,
    ...(children.length ? [children.length === 1 ? children[0] : children] : [])
  )
}

export { renderNode }
