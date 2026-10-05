import { ThreadCard } from "@/components/site/showcase/thread-card"
import { ActivityCard } from "@/components/site/showcase/activity-card"
import { AlertsCard } from "@/components/site/showcase/alerts-card"
import { AwayCard } from "@/components/site/showcase/away-card"
import { EmptyCard } from "@/components/site/showcase/empty-card"
import { FaqCard } from "@/components/site/showcase/faq-card"
import { FilesMenuCard } from "@/components/site/showcase/files-menu-card"
import { InvoicesCard } from "@/components/site/showcase/invoices-card"
import { IssueCard } from "@/components/site/showcase/issue-card"
import { PaymentCard } from "@/components/site/showcase/payment-card"
import { PlayerCard } from "@/components/site/showcase/player-card"
import { ShareCard } from "@/components/site/showcase/share-card"
import { ShortcutsCard } from "@/components/site/showcase/shortcuts-card"
import { SignInCard } from "@/components/site/showcase/sign-in-card"
import { StorageCard } from "@/components/site/showcase/storage-card"
import { VideoCard } from "@/components/site/showcase/video-card"
import { AnalyticsCard } from "@/components/site/showcase/analytics-card"
import { BookingCard } from "@/components/site/showcase/booking-card"
import { ChatCard } from "@/components/site/showcase/chat-card"
import { CommandCard } from "@/components/site/showcase/command-card"
import { DeployCard } from "@/components/site/showcase/deploy-card"
import { FilesCard } from "@/components/site/showcase/files-card"
import { KitchenSinkCard } from "@/components/site/showcase/kitchen-sink-card"
import { MenuCards } from "@/components/site/showcase/menu-cards"
import { OnboardingCard } from "@/components/site/showcase/onboarding-card"
import { RevenueCard } from "@/components/site/showcase/revenue-card"
import { SettingsCard } from "@/components/site/showcase/settings-card"
import { TeamCard } from "@/components/site/showcase/team-card"
import { UpgradeCard } from "@/components/site/showcase/upgrade-card"
import { UploadsCard } from "@/components/site/showcase/uploads-card"
import { VerifyCard } from "@/components/site/showcase/verify-card"

const cards = [
  { id: "kitchen-sink", Card: KitchenSinkCard },
  { id: "sign-in", Card: SignInCard },
  { id: "deploy", Card: DeployCard },
  { id: "menus", Card: MenuCards },
  { id: "storage", Card: StorageCard },
  { id: "settings", Card: SettingsCard },
  { id: "faq", Card: FaqCard },
  { id: "files", Card: FilesCard },
  { id: "analytics", Card: AnalyticsCard },
  { id: "player", Card: PlayerCard },
  { id: "upgrade", Card: UpgradeCard },
  { id: "verify", Card: VerifyCard },
  { id: "files-menu", Card: FilesMenuCard },
  { id: "away", Card: AwayCard },
  { id: "empty", Card: EmptyCard },
  { id: "chat", Card: ChatCard },
  { id: "video", Card: VideoCard },
  { id: "onboarding", Card: OnboardingCard },
  { id: "issue", Card: IssueCard },
  { id: "revenue", Card: RevenueCard },
  { id: "shortcuts", Card: ShortcutsCard },
  { id: "thread", Card: ThreadCard },
  { id: "payment", Card: PaymentCard },
  { id: "command", Card: CommandCard },
  { id: "activity", Card: ActivityCard },
  { id: "booking", Card: BookingCard },
  { id: "share", Card: ShareCard },
  { id: "alerts", Card: AlertsCard },
  { id: "team", Card: TeamCard },
  { id: "uploads", Card: UploadsCard },
  { id: "invoices", Card: InvoicesCard },
]

function Showcase() {
  return (
    <div className="columns-1 gap-3 md:columns-2 lg:columns-3 lg:mask-b-from-95% xl:columns-4 [&>*]:mb-3 [&>*]:break-inside-avoid [&>*]:p-0.5">
      {cards.map(({ id, Card }) => (
        <div key={id}>
          <Card />
        </div>
      ))}
    </div>
  )
}

export { Showcase }
