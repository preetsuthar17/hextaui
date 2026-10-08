import type { AuthEnv } from "@/lib/auth"

type MailerEnv = {
  CF_ACCOUNT_ID?: string
  CF_EMAIL_TOKEN?: string
}

type EmailEnv = AuthEnv & {
  EMAIL_ADMIN_TOKEN: string
}

type Email = {
  to: string
  subject: string
  html: string
  text: string
  headers?: Record<string, string>
}

type SendResult = { ok: true } | { ok: false; error: string; status: number }

const sender = { address: "updates@hextaui.com", name: "HextaUI" }

async function sendEmail(env: MailerEnv, email: Email): Promise<SendResult> {
  if (!env.CF_ACCOUNT_ID || !env.CF_EMAIL_TOKEN) {
    return { ok: false, error: "Email sending isn’t configured", status: 503 }
  }
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/email/sending/send`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.CF_EMAIL_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ ...email, from: sender, to: [email.to] }),
    }
  )
  const body = (await response.json().catch(() => null)) as {
    success?: boolean
    errors?: { code: number; message: string }[]
    result?: { permanent_bounces?: string[] } | null
  } | null

  if (!response.ok || !body?.success) {
    const error =
      body?.errors?.map((item) => `${item.code} ${item.message}`).join("; ") ||
      `HTTP ${response.status}`
    return { ok: false, error, status: response.status }
  }
  if (body.result?.permanent_bounces?.length) {
    return { ok: false, error: "Permanent bounce", status: 200 }
  }
  return { ok: true }
}

export {
  sendEmail,
  sender,
  type Email,
  type EmailEnv,
  type MailerEnv,
  type SendResult,
}
